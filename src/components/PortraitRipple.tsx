"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionAllowed } from "@/lib/use-motion-allowed";

/**
 * Liquid ripple over the About portrait.
 *
 * The photograph stays exactly where it was: the same <img>, the same alt text,
 * the same card. A WebGL canvas is laid over it and only revealed once it has
 * painted its first frame, so every failure path — no context, a shader that
 * will not compile, an image over MAX_TEXTURE_SIZE, a lost context — simply
 * leaves the plain portrait on screen. `data-ready` is the single switch.
 *
 * Motion: `useMotionAllowed` is false during SSR and the first client render, so
 * the canvas is not in the markup until the visitor has asked for motion; the
 * reduced-motion case keeps the plain image and never allocates a GPU context.
 *
 * Cost: there is no permanent render loop. Frames are requested while a ripple
 * is still alive, and stop when the last one dies, when the portrait scrolls
 * out of view, or when the tab is hidden.
 */

const MAX_POINTS = 16;
const LIFE_SECONDS = 4.2;
const MOVE_PX = 10;
const MOVE_MS = 35;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform float uTime;
uniform vec3 uPts[16];
uniform float uStrength;
uniform float uSplit;
uniform float uDecay;

/* object-fit: cover, in texture space. */
vec2 coverUV(vec2 st) {
  float ca = uRes.x / uRes.y;
  float ia = uImg.x / uImg.y;
  vec2 s = ca > ia ? vec2(1.0, ia / ca) : vec2(ca / ia, 1.0);
  return clamp((st - 0.5) * s + 0.5, 0.0, 1.0);
}

void main() {
  vec2 st = gl_FragCoord.xy / uRes;
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec2 off = vec2(0.0);
  float hi = 0.0;

  for (int i = 0; i < 16; i++) {
    vec3 p = uPts[i];
    float age = uTime - p.z;
    if (p.z < 0.0 || age < 0.0 || age > 4.0) continue;
    vec2 dv = (st - p.xy) * asp;
    float dist = length(dv);
    float env = exp(-age * uDecay) * exp(-dist * 5.0);
    float wave = sin(dist * 38.0 - age * 9.0);
    vec2 dir = dist > 0.0001 ? dv / dist : vec2(0.0);
    off += dir * wave * env;
    hi += wave * env;
  }

  float r = texture2D(uTex, coverUV(st + off * (uStrength + uSplit))).r;
  float g = texture2D(uTex, coverUV(st + off * uStrength)).g;
  float b = texture2D(uTex, coverUV(st + off * (uStrength - uSplit))).b;
  vec3 col = vec3(r, g, b);
  col += hi * 0.035 * vec3(1.0, 0.82, 0.62);
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function PortraitRipple({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const allowed = useMotionAllowed();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!allowed) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });
    /* No WebGL: the portrait under the canvas is already the finished picture. */
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("[portrait-ripple] shader", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = compile(gl.VERTEX_SHADER, VERT);
    const frag = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("[portrait-ripple] link", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, "uRes"),
      img: gl.getUniformLocation(program, "uImg"),
      time: gl.getUniformLocation(program, "uTime"),
      pts: gl.getUniformLocation(program, "uPts"),
      strength: gl.getUniformLocation(program, "uStrength"),
      split: gl.getUniformLocation(program, "uSplit"),
      decay: gl.getUniformLocation(program, "uDecay"),
    };

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const uTex = gl.getUniformLocation(program, "uTex");
    if (uTex) gl.uniform1i(uTex, 0);

    const knobs = () => {
      const cs = getComputedStyle(wrap);
      const read = (name: string, fallback: number) => {
        const value = Number.parseFloat(cs.getPropertyValue(name));
        return Number.isFinite(value) && value > 0 ? value : fallback;
      };
      return {
        strength: read("--ripple-strength", 0.02),
        split: read("--ripple-split", 0.006),
        decay: read("--ripple-decay", 2.2),
      };
    };
    const config = knobs();

    let disposed = false;
    let raf = 0;
    let ready = false;
    let onScreen = true;

    const points = new Float32Array(MAX_POINTS * 3).fill(-100);
    let slot = 0;

    const started = performance.now();
    const clock = () => (performance.now() - started) / 1000;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const cap = window.innerWidth < 640 ? 1.5 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, cap);
      const width = Math.max(1, Math.round(Math.max(1, rect.width) * dpr));
      const height = Math.max(1, Math.round(Math.max(1, rect.height) * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(u.res, width, height);
      gl.uniform1f(u.strength, config.strength);
      gl.uniform1f(u.split, config.split);
      gl.uniform1f(u.decay, config.decay);
    };

    const draw = () => {
      if (u.pts) gl.uniform3fv(u.pts, points);
      gl.uniform1f(u.time, clock());
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const anyAlive = () => {
      const t = clock();
      for (let i = 0; i < MAX_POINTS; i += 1) {
        const birth = points[i * 3 + 2];
        if (birth >= 0 && t - birth < LIFE_SECONDS) return true;
      }
      return false;
    };

    const upload = () => {
      const img = wrap.querySelector("img");
      if (!img || !img.naturalWidth || !img.naturalHeight) return false;
      const max = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
      if (img.naturalWidth > max || img.naturalHeight > max) return false;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.uniform2f(u.img, img.naturalWidth, img.naturalHeight);
      return true;
    };

    const frame = () => {
      raf = 0;
      if (disposed) return;
      draw();
      if (!ready) {
        ready = true;
        wrap.dataset.ready = "true";
      }
      if (onScreen && !document.hidden && anyAlive()) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (disposed || raf || !onScreen || document.hidden) return;
      raf = requestAnimationFrame(frame);
    };

    const firstFrame = () => {
      if (disposed) return;
      resize();
      if (!upload()) return;
      draw();
      ready = true;
      wrap.dataset.ready = "true";
    };

    const begin = () => {
      const img = wrap.querySelector("img");
      if (!img) return;
      const loaded = () =>
        img.complete && img.naturalWidth
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            });
      loaded()
        .then(() => (img.decode ? img.decode().catch(() => undefined) : undefined))
        .then(firstFrame)
        .catch(() => undefined);
    };

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (!ready) return;
            resize();
            draw();
          })
        : null;
    observer?.observe(wrap);

    const intersection =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((entries) => {
            onScreen = entries.some((entry) => entry.isIntersecting);
            if (!onScreen) {
              cancelAnimationFrame(raf);
              raf = 0;
            } else if (anyAlive()) {
              kick();
            }
          })
        : null;
    intersection?.observe(wrap);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (anyAlive()) {
        kick();
      }
    };

    let dismissed = false;
    const dismissHint = () => {
      if (dismissed) return;
      dismissed = true;
      const hint = hintRef.current;
      if (hint) hint.dataset.dismissed = "true";
    };

    let lastX = 0;
    let lastY = 0;
    let lastPush = 0;

    const push = (x: number, y: number, birth: number) => {
      const index = slot % MAX_POINTS;
      slot += 1;
      points[index * 3] = x;
      points[index * 3 + 1] = y;
      points[index * 3 + 2] = birth;
    };

    const localPoint = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) / Math.max(1, rect.width),
        /* Shader space has y pointing up; DOM space does not. */
        y: 1 - (event.clientY - rect.top) / Math.max(1, rect.height),
      };
    };

    const onMove = (event: PointerEvent) => {
      if (!ready) return;
      const now = performance.now();
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (Math.hypot(dx, dy) < MOVE_PX || now - lastPush < MOVE_MS) return;
      lastX = event.clientX;
      lastY = event.clientY;
      lastPush = now;
      const { x, y } = localPoint(event);
      push(x, y, clock());
      dismissHint();
      kick();
    };

    const onDown = (event: PointerEvent) => {
      if (!ready) return;
      const { x, y } = localPoint(event);
      const t = clock();
      /* Three concentric rings, the outer ones already a little older, so the
         splash expands outward instead of starting as one dot. */
      push(x, y, t);
      push(x, y, t - 0.12);
      push(x, y, t - 0.24);
      wrap.dataset.press = "true";
      dismissHint();
      kick();
    };

    const release = () => {
      delete wrap.dataset.press;
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointerup", release);
    wrap.addEventListener("pointerleave", release);
    wrap.addEventListener("pointercancel", release);
    document.addEventListener("visibilitychange", onVisibility);

    const onLost = (event: Event) => {
      /* Keep the browser from trying to restore a context we have already given
         up on, and let the plain portrait take over again. */
      event.preventDefault();
      ready = false;
      cancelAnimationFrame(raf);
      raf = 0;
      delete wrap.dataset.ready;
    };
    const onRestored = () => {
      ready = false;
      firstFrame();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    begin();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointerup", release);
      wrap.removeEventListener("pointerleave", release);
      wrap.removeEventListener("pointercancel", release);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      observer?.disconnect();
      intersection?.disconnect();
      delete wrap.dataset.ready;
      delete wrap.dataset.press;
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [allowed]);

  return (
    <div ref={wrapRef} className={className ? `portrait-ripple ${className}` : "portrait-ripple"}>
      {children}
      {allowed ? (
        <>
          <canvas ref={canvasRef} className="portrait-ripple__canvas" aria-hidden="true" />
          <span ref={hintRef} className="portrait-hint clay-chip font-meta text-meta uppercase text-muted">
            Move or drag to play
          </span>
        </>
      ) : null}
    </div>
  );
}
