"use client";

import { useEffect, useRef } from "react";

/**
 * A live GLSL plate for a case study.
 *
 * The shader runs in a WebGL2 canvas behind the caption. Three things keep it
 * from costing more than it gives: it only runs while the plate is on screen,
 * it ticks at 30fps rather than at the display's rate, and it renders one
 * settled frame and stops on a reduced-motion preference or a device that has
 * told us it is small. A device without WebGL2, or a shader that fails to
 * compile, keeps the CSS gradient underneath — the plate never goes blank and
 * never leaves a black hole in the page.
 */
export default function ProjectShader({
  source,
  quality = 1,
  heavy = false,
  hue = 0,
}: {
  /** GLSL ES 3.00 body: `#define`s, helpers and `mainImage(out vec4, vec2)`. */
  source: string;
  /** Pixels per CSS pixel before the size cap. */
  quality?: number;
  /** Marches many steps per pixel: a still frame on a phone rather than a loop. */
  heavy?: boolean;
  /** Amplitude, in radians, of the field's slow palette drift. 0 is none. */
  hue?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = host.current;
    if (!canvas || !frame) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    /* Chromium falls back to a software rasteriser (SwiftShader, or the Basic
       Render Driver) when a machine has no usable GPU, which is common on
       Windows laptops with stale drivers and on battery-saver profiles. There
       this shader runs on the CPU: one 1600x900 plate blocked the main thread
       for most of a second, which is the stutter a visitor feels while
       scrolling. Those devices keep the CSS gradient and never paint a plate. */
    const rendererExt = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = rendererExt
      ? String(gl.getParameter(rendererExt.UNMASKED_RENDERER_WEBGL) ?? "")
      : "";
    if (/swiftshader|llvmpipe|swangle|software|basic render/i.test(renderer)) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }

    const FRAGMENT = `#version 300 es
precision highp float;
precision highp int;
uniform vec2 iResolution;
uniform float iTime;
out vec4 outColor;
${source}
void main() {
  vec4 color = vec4(0.);
  mainImage(color, gl_FragCoord.xy);
  outColor = color;
}`;

    const VERTEX = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0., 1.); }`;

    const compile = (type: number, text: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, text);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[project-shader]", gl.getShaderInfoLog(shader));
        }
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[project-shader]", gl.getProgramInfoLog(program));
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }

    /* One oversized triangle covers the viewport without an index buffer. */
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");
    const uHue = gl.getUniformLocation(program, "iHue");

    gl.useProgram(program);
    gl.clearColor(0.043, 0.043, 0.047, 1);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small =
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4;
    /* `heavy` marks the field that marches a hundred steps per pixel. A phone
       has the pixels for it, but not the frame budget, so there it gets the
       same treatment as the hero: one composed frame, no loop. The cheap
       fields keep running — they are a couple of dozen instructions a pixel. */
    const still = calm || small || (window.innerWidth < 640 && heavy);
    /* A once-only frame on a four-core machine can still be the most expensive
       single task on the page, so it is drawn at roughly half the pixels: the
       plate is soft, and one frame at 880x480 is indistinguishable at 720px. */
    const stillScale = small ? 0.55 : 1;

    const draw = (seconds: number) => {
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, seconds);
      gl.uniform1f(uHue, hue);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = (crisp = false) => {
      const rect = frame.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      /* A 1280px plate is already soft-edged art; past that the extra pixels are
         invisible and the raymarch cost per frame is linear in them. A frame
         that is only ever drawn once can afford the full sharpen, though, so
         the still path asks for it. */
      const dpr = crisp
        ? Math.min(window.devicePixelRatio || 1, 2) * stillScale
        : Math.min(window.devicePixelRatio || 1, 1.25) * quality;
      const scale = crisp ? dpr : dpr * Math.min(1, rect.width / 900);
      const width = Math.max(240, Math.round(rect.width * scale));
      const height = Math.max(160, Math.round(rect.height * scale));
      if (canvas.width === width && canvas.height === height) return false;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      return true;
    };

    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let visible = false;
    let painted = false;
    let lastRaf = 0;
    let slow = 0;
    let exhausted = false;

    /* A driver name is not a speedometer: a machine can report an ordinary GPU
       and still spend 40ms on this plate, which is the shake felt on every
       scroll. So the backdrop watches the browser's own clock instead — four
       frames more than 55ms apart mean the page is under 18fps with this canvas
       running, and a backdrop is the first thing that should give way. It then
       stops on its last frame and never restarts for the rest of the visit. */
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const gap = lastRaf ? now - lastRaf : 16;
      lastRaf = now;
      slow = gap > 55 ? slow + 1 : 0;
      if (slow >= 4) {
        exhausted = true;
        stop();
        return;
      }
      if (now - last < 33) return;
      const step = Math.min(0.1, (now - last) / 1000);
      last = now;
      elapsed += step;
      draw(elapsed);
    };

    const start = () => {
      if (raf || still || exhausted) return;
      lastRaf = 0;
      slow = 0;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const renderStill = () => {
      if (resize(true) || !painted) {
        /* A little time in, so the still frame is a composed pose rather than
           the dead centre of the motion. */
        draw(6.5);
        painted = true;
      }
      frame.dataset.shaderState = "on";
    };

    if (still) {
      renderStill();
    } else {
      const observer =
        typeof IntersectionObserver === "undefined"
          ? null
          : new IntersectionObserver(
              (entries) => {
                for (const entry of entries) {
                  visible = entry.isIntersecting;
                  if (visible) {
                    if (resize() || !painted) {
                      draw(elapsed);
                      painted = true;
                      frame.dataset.shaderState = "on";
                    }
                    if (!document.hidden) start();
                  } else {
                    stop();
                  }
                }
              },
              { rootMargin: "160px 0px" },
            );

      if (observer) {
        observer.observe(frame);
      } else {
        resize();
        draw(0);
        painted = true;
        frame.dataset.shaderState = "on";
        start();
      }

      const onVisibility = () => {
        if (document.hidden) stop();
        else if (visible) start();
      };
      document.addEventListener("visibilitychange", onVisibility);

      let resizeFrame = 0;
      const onResize = () => {
        if (resizeFrame) return;
        resizeFrame = requestAnimationFrame(() => {
          resizeFrame = 0;
          resize();
          draw(elapsed);
        });
      };
      const resizeObserver =
        typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onResize);
      resizeObserver?.observe(frame);

      return () => {
        stop();
        observer?.disconnect();
        resizeObserver?.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        if (resizeFrame) cancelAnimationFrame(resizeFrame);
        /* Deliberately not calling `loseContext()` here. React StrictMode mounts
           effects twice in development, and a lost context cannot be replaced on
           the same canvas: the second mount would get the dead one back and the
           plate would sit blank. The context is reclaimed with the canvas. */
      };
    }

    return () => {
      stop();
    };
  }, [source, quality, heavy, hue]);

  return (
    <div ref={host} className="cs-shader-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
