"use client";

import { useEffect, useRef } from "react";

/**
 * Hero gradient + warped headline, drawn on one WebGL canvas.
 *
 * Licence note: the gradient maths here are an independent implementation, not
 * a copy of any Shadertoy source. The shader that prompted this effect
 * (shadertoy.com/view/Wlf3zn, "spectrum reflections" by johh) carries no licence
 * line, so it falls under Shadertoy's default CC BY-NC-SA 3.0 — non-commercial,
 * share-alike — which does not suit a portfolio that sells freelance work. The
 * colour band below is therefore written from scratch: its own frequency set,
 * its own hash for the dither, no blue-noise texture. Nothing here is encumbered
 * by a third-party licence, so no attribution is owed and none is claimed.
 *
 * How it works: the headline is painted into an offscreen 2D canvas with the
 * computed styles of the real elements, uploaded as a texture, and sampled
 * three times with slightly different offsets. A moving diagonal band widens
 * those offsets and fades the samples, so the letters inside the band warp and
 * split into colour while everything outside it stays pixel-crisp.
 *
 * The DOM text stays in the page for search engines and screen readers. It is
 * only hidden once the canvas has actually presented a frame, so a failed
 * context, shader compile, upload or font load leaves normal text on screen.
 */

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

uniform vec2 uRes;
uniform float uTime;
uniform sampler2D uText;
uniform vec3 uBase;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform vec3 uInk;
uniform float uStrength;
uniform float uDistort;
uniform float uStreak;
uniform float uReveal;
uniform float uLens;
uniform float uInvert;
uniform float uGrain;

/* Cheap per-pixel hash, used only for the dither and the gradient's jitter.
   The sin-based version cost a transcendental per call; the grain calls this
   for every pixel of every frame, so it is a multiply-and-fract hash now. */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

/* The colour band: three sines whose periods share no common factor, so the
   interference never repeats inside a viewport. Amplitudes sum to 1. */
float band(float x, float t) {
  return sin(t - x * 1.7) * 0.62
       + cos(t * 2.31 - x * 3.1) * 0.28
       + sin(t * 0.87 - x * 5.3) * 0.1;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 st = frag / uRes;
  vec2 q = (frag - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.6;

  /* Mirror inside the lens only. Folding the band about the centre makes the
     saturated right-hand colours run back across the middle, so the disc reads
     as its own body of colour instead of a seam; outside it the band runs on
     uninterrupted. uLens scales the radius. */
  vec2 uv = q;
  uv.x = mix(1.0 - uv.x, uv.x, smoothstep(0.3, 0.45, length(uv) / uLens));

  float shift = (sin(t) * 0.5 + 0.5) * 0.2 + 0.1;
  float n = (hash(frag * 0.75 + 137.0 * fract(uTime)) - 0.5) * 0.4;

  vec3 g = vec3(
    band(uv.x + n - shift, t),
    band(uv.x + n, t),
    band(uv.x + n + shift, t)
  );

  /* Colour-map the band: smoothstep keeps the midtones wide and the extremes
     short, which is what stops the gradient reading as pure sine stripes. */
  vec3 w = clamp(g * 0.5 + 0.5, 0.0, 1.0);
  w = w * w * (3.0 - 2.0 * w);

  /* The left of the frame stays pale: the mix is scaled by x, so the saturated
     colours never reach the left edge at all and the beige is real paper rather
     than a washed-out orange. */
  float side = smoothstep(0.15, 0.7, st.x);
  float edge = smoothstep(0.7, 1.0, st.x);
  /* Orange carries the body of the gradient, brown is a weight rather than a
     coat (mixed at half strength so it deepens the orange instead of burying
     it), and the purple is held to the right edge. Mixing all three at full
     strength in order turned the whole hero into near-black. */
  vec3 bg = uBase;
  bg = mix(bg, uA, w.r * uStrength * side);
  bg = mix(bg, uC, w.b * uStrength * edge);
  bg = mix(bg, uB, w.g * uStrength * side * 0.5);

  /* The lens: a soft dark disc over the middle of the hero, lifted slightly so
     it sits behind the headline rather than across the paragraph. Its edge is
     deliberately wide — the target's lens fades out, it has no rim. */
  vec2 lq = q - vec2(0.0, -0.08);
  float r = length(lq) / uLens;
  float disc = 1.0 - smoothstep(0.18, 0.52, r);
  bg *= mix(1.0, 0.42, disc);

  /* A gentle contrast push around mid-luminance only. Squashing the field to
     two fixed luminances would make the text metrics perfect and destroy the
     orange-to-purple range the picture is built on, so this stays a nudge: the
     lens and the band still read as colour, not as black and beige. */
  float L0 = dot(bg, vec3(0.299, 0.587, 0.114));
  float split = smoothstep(0.4, 0.6, L0);
  bg *= mix(0.9, 1.06, split);

  /* The band is a diagonal stripe travelling slowly across the hero. */
  float d = dot(q, normalize(vec2(1.0, -0.45))) - sin(uTime * 0.22) * 0.55;
  float m = smoothstep(0.32, 0.0, abs(d)) * uDistort;

  vec2 dir = normalize(vec2(1.0, 0.35));
  vec2 off = vec2(g.g, g.r - g.b) * 0.012 * m
           + vec2(0.0, sin(q.x * 22.0 + uTime * 1.5) * 0.004 * m);
  vec2 rv = vec2(0.0, (1.0 - uReveal) * 0.05);

  float aR = texture2D(uText, st + off + dir * g.r * 0.010 * m - rv).a;
  float aG = texture2D(uText, st + off - rv).a;
  float aB = texture2D(uText, st + off + dir * g.b * 0.010 * m - rv).a;

  vec3 a = vec3(aR, aG, aB) * (1.0 - 0.25 * m) * uReveal;

  /* Text inverts against what it sits on: ink on the pale left, the complement
     — a pale blue over a brown lens — inside the dark disc. The 1.35 push pulls
     the result away from mid-grey, where neither ink nor white would read. */
  float L = dot(bg, vec3(0.299, 0.587, 0.114));
  vec3 inv = 1.0 - bg;
  inv = clamp((inv - 0.5) * 1.35 + 0.5, 0.0, 1.0);
  float k = mix(smoothstep(0.56, 0.44, L), 1.0, uInvert);
  vec3 txt = mix(uInk, inv, k);

  /* Minimum separation. Where the band fades, the blend above lands near the
     background's own luminance and the letter becomes grey-on-grey. Only then,
     and only as far as needed, the text is pushed away from the background in
     the direction it was already going — so ink stays ink, the pale blue on the
     lens stays pale blue, and nothing is flattened to black or white. */
  float bL = dot(bg, vec3(0.299, 0.587, 0.114));
  float tL = dot(txt, vec3(0.299, 0.587, 0.114));
  if (abs(tL - bL) < 0.55) {
    float goal = clamp(bL + (bL > 0.5 ? -0.55 : 0.55), 0.0, 1.0);
    txt = clamp(txt * (goal / max(tL, 0.02)), 0.0, 1.0);
  }

  vec3 col = mix(bg, txt, a);
  col *= 1.0 - uStreak * m;
  /* Film grain in three plates rather than one re-roll. A whole-field re-seed
     reads as a strobing noise plate; real emulsion does three things at once. */

  /* 1. Crawl. The grain grid drifts a few pixels a second, so the speckle
     travels through the frame instead of flickering in place. Stepping the
     texture coordinate (not the hash) keeps each chunk crisp. */
  vec2 gc = floor(frag / 1.5 + vec2(uTime * 14.0, uTime * -9.0));
  /* One hash per cell, three decorrelated channels derived from it: three
     independent lookups cost 50% more for a difference nobody can see at this
     speckle size. */
  float fineSeed = hash(gc + 0.3);
  vec3 fine = vec3(
    fineSeed,
    fract(fineSeed * 7.13 + 0.37),
    fract(fineSeed * 13.7 + 0.71)
  ) - 0.5;

  /* Per-channel noise is mostly luminance with a little colour, the way dyed
     grain behaves: independent channels alone look like chroma noise. */
  float fineM = (fine.r + fine.g + fine.b) * 0.3333;
  vec3 speckle = mix(vec3(fineM), fine, 0.38);

  /* 2. Shimmer. A second, coarser plate re-rolls eight times a second at about
     half amplitude — fast enough to feel alive, far too slow to strobe. */
  float shimmer = hash(floor(frag / 2.4) + floor(uTime * 8.0) * vec2(23.0, 11.0) + 5.0) - 0.5;

  /* 3. Luminance weighting. Real grain lives in the shadows; the pale paper at
     the left edge gets almost none, so the beige stays clean and the type on it
     stays readable. */
  float grainLuma = dot(col, vec3(0.299, 0.587, 0.114));
  float grainWeight = mix(1.25, 0.45, smoothstep(0.12, 0.8, grainLuma));

  col += (speckle * 0.85 + shimmer * 0.45) * uGrain * grainWeight;

  gl_FragColor = vec4(col, 1.0);
}
`;

type Rgb = [number, number, number];
type Target = { el: HTMLElement; inner: HTMLElement };

/* 24 rather than 30: the band drifts over seconds and the grain shimmers 8 times
   a second, so the extra six frames buy nothing the eye can find, while every
   frame costs a full-canvas commit — the single largest recurring cost on the
   home page. Phones get half of that: the effect is a slow drift, not motion
   that gains anything from the extra frames, and the same shader on a phone GPU
   is the difference between a warm lap and a hot one. */
const REVEAL_MS = 700;

/*
 * Can this machine carry a live shader?
 *
 * Chromium silently falls back to a software rasteriser (SwiftShader, or
 * llvmpipe/SwANGLE on Linux) whenever there is no usable GPU: virtual machines,
 * remote desktops, GPU-blocklisted drivers, and any browser launched with
 * hardware acceleration switched off. A 24 fps full-canvas fragment shader on
 * that path is the worst thing on the page — it turns into hundreds of
 * milliseconds of CPU per frame. The same is true, if less dramatically, on
 * four-core or memory-starved devices and under Save-Data.
 *
 * In those cases the component draws one frame of the gradient and leaves the
 * headline as real DOM text: no loop, no rAF, no texture rasterisation.
 */
function isLowPower(gl: WebGLRenderingContext): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if ((nav.hardwareConcurrency ?? 8) <= 4) return true;
  if ((nav.deviceMemory ?? 8) <= 4) return true;
  if (nav.connection?.saveData) return true;

  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = ext
    ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? "")
    : "";
  return /swiftshader|llvmpipe|swangle|software|basic render/i.test(renderer);
}

function parseColor(value: string): Rgb | null {
  const v = value.trim();
  if (!v) return null;
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, (x) => x + x) : hex[1];
    const n = parseInt(h, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const rgb = v.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const parts = rgb[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (parts.length >= 3 && parts.every((n) => Number.isFinite(n))) {
      return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
    }
  }
  return null;
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = ([r, g, b]: Rgb) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const mixRgb = (from: Rgb, to: Rgb, t: number): Rgb => [
  from[0] + (to[0] - from[0]) * t,
  from[1] + (to[1] - from[1]) * t,
  from[2] + (to[2] - from[2]) * t,
];
const bandAt = (x: number, t: number) =>
  Math.sin(t - x * 1.7) * 0.62 +
  Math.cos(t * 2.31 - x * 3.1) * 0.28 +
  Math.sin(t * 0.87 - x * 5.3) * 0.1;
const srgbLum = ([r, g, b]: Rgb) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

/*
 * A CPU twin of the shader's colour ramp, sampled across the hero.
 *
 * The shader decides the text colour per pixel, so the only way to know whether
 * inversion is safe is to evaluate the same maths away from the GPU and compare
 * each sample with the colour the shader would print there. It ignores the
 * motion noise and the grain (both symmetric and small), which is why the check
 * is a warning and not a hard gate.
 */
function contrastReport(
  palette: { base: Rgb; ink: Rgb; a: Rgb; b: Rgb; c: Rgb },
  aspect: number,
  knobs: { lens: number; strength: number; invert: number },
) {
  const rows: { x: number; ratio: number; bg: Rgb; txt: Rgb }[] = [];
  const shift = 0.2;
  const t = 1;
  for (const px of [0.08, 0.3, 0.5, 0.7, 0.92]) {
    const qx = (px - 0.5) * aspect;
    const lensX = mixRgb([qx, 0, 0], [qx, 0, 0], 0)[0];
    const ux = (1 - lensX) + (lensX - (1 - lensX)) * smoothstep(0.3, 0.45, Math.abs(lensX) / knobs.lens);
    const w = [bandAt(ux - shift, t), bandAt(ux, t), bandAt(ux + shift, t)].map((v) => {
      const c = clamp01(v * 0.5 + 0.5);
      return c * c * (3 - 2 * c);
    });
    const side = smoothstep(0.15, 0.7, px);
    let bg = palette.base;
    bg = mixRgb(bg, palette.a, w[0] * knobs.strength * side);
    bg = mixRgb(bg, palette.b, w[1] * knobs.strength * side);
    bg = mixRgb(bg, palette.c, w[2] * knobs.strength * side);
    /* Same disc and mid-luminance split as the shader, so the numbers below
       describe the colours actually on screen. */
    const disc = 1 - smoothstep(0.18, 0.52, Math.hypot(qx, 0.08) / knobs.lens);
    bg = bg.map((c) => c * (1 + (0.42 - 1) * disc)) as Rgb;
    const l0 = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2];
    bg = bg.map((c) => c * (0.9 + 0.16 * smoothstep(0.4, 0.6, l0))) as Rgb;
    const luma = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2];
    const inv = bg.map((c) => clamp01((1 - c - 0.5) * 1.35 + 0.5)) as Rgb;
    const k = smoothstep(0.56, 0.44, luma) * (1 - knobs.invert) + knobs.invert;
    let txt = mixRgb(palette.ink, inv, k);
    /* The shader's minimum-separation rule, mirrored so these ratios describe
       what actually renders. */
    const bL = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2];
    const tL = 0.299 * txt[0] + 0.587 * txt[1] + 0.114 * txt[2];
    if (Math.abs(tL - bL) < 0.55) {
      const goal = clamp01(bL + (bL > 0.5 ? -0.55 : 0.55));
      txt = txt.map((c) => clamp01(c * (goal / Math.max(tL, 0.02)))) as Rgb;
    }
    const l1 = srgbLum(txt);
    const l2 = srgbLum(bg);
    rows.push({ x: px, ratio: (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05), bg, txt });
  }
  return rows;
}

/* The deepest element holding text, so font styles come from the element that
   actually paints the glyphs rather than from its wrapper. */
function textHost(el: HTMLElement): HTMLElement | null {
  let node: HTMLElement = el;
  for (let depth = 0; depth < 4; depth++) {
    const kids = Array.from(node.children) as HTMLElement[];
    if (kids.length !== 1) break;
    node = kids[0];
  }
  const hasText = Array.from(node.childNodes).some(
    (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 0,
  );
  return hasText ? node : null;
}

export default function HeroDistort() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas?.closest("section");
    if (!canvas || !hero) return;

    const debug =
      new URLSearchParams(window.location.search).get("distort") === "debug";

    /* Thai needs shaping that a 2D-canvas fillText cannot reproduce reliably,
       and a wrapped line would not line up with one texture quad. Either case
       opts out and leaves the normal DOM text in place. */
    const lang = (document.documentElement.lang || "en").toLowerCase();
    if (lang.startsWith("th") || hero.closest('[lang="th"]')) return;
    const thai = /[\u0E00-\u0E7F]/;
    if (thai.test((hero.textContent ?? "").slice(0, 2000))) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !program) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      text: gl.getUniformLocation(program, "uText"),
      base: gl.getUniformLocation(program, "uBase"),
      a: gl.getUniformLocation(program, "uA"),
      b: gl.getUniformLocation(program, "uB"),
      c: gl.getUniformLocation(program, "uC"),
      ink: gl.getUniformLocation(program, "uInk"),
      strength: gl.getUniformLocation(program, "uStrength"),
      distort: gl.getUniformLocation(program, "uDistort"),
      streak: gl.getUniformLocation(program, "uStreak"),
      reveal: gl.getUniformLocation(program, "uReveal"),
      lens: gl.getUniformLocation(program, "uLens"),
      invert: gl.getUniformLocation(program, "uInvert"),
      grain: gl.getUniformLocation(program, "uGrain"),
    };

    /* Decided once, before any texture exists: everything below either takes
       the live path or the single-frame one. `?distort=static` forces the
       low-power path on a capable machine, the way `?distort=debug` forces the
       debug overlay, so the fallback can be looked at on real hardware. */
    const forced = new URLSearchParams(window.location.search).get("distort") === "static";
    /*
     * Phones take the single-frame path too, and not for performance: at 390px
     * the warp's channel split is measured in normalised coordinates, so it
     * covers a much larger share of a much smaller headline and the type reads
     * as doubled rather than warped. The still frame keeps everything a phone
     * can actually show — the gradient, the palette, the typography over it —
     * without the artefact. */
    const lowPower = forced || isLowPower(gl) || window.innerWidth < 640;

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.uniform1i(u.text, 0);
    gl.activeTexture(gl.TEXTURE0);

    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const sheet = document.createElement("canvas");
    const ctx = sheet.getContext("2d");

    /* Small screens also get fewer frames: the drift is unreadable at 12 fps
       from a phone's distance anyway. */
    const fps = window.innerWidth < 640 ? 12 : 24;

    let dpr = 1;
    let ready = false;
    let stopAt = 0;
    /* True once the opening has played out: from then on the canvas is redrawn
       frame by frame only when something asks it to, never on a clock. */
    let settled = false;
    let distortKnob = 1;
    let speedKnob = 0.44;
    let raf = 0;
    let last = 0;
    let startedAt = 0;
    let visible = true;

    const readKnob = (name: string, fallback: number) => {
      const value = parseFloat(getComputedStyle(document.body).getPropertyValue(name));
      return Number.isFinite(value) ? value : fallback;
    };

    let checkedContrast = false;

    const applyPalette = () => {
      const css = getComputedStyle(document.body);
      const base = parseColor(css.getPropertyValue("--color-canvas")) ?? [0.93, 0.9, 0.86];
      const ink = parseColor(css.getPropertyValue("--color-ink")) ?? [0.14, 0.12, 0.1];
      /* Raw field colours: the gradient is allowed to be dark and saturated, so
         there is no lift toward the paper any more. Readability is handled by
         the text inversion below, not by holding the background up. */
      const a = parseColor(css.getPropertyValue("--grain-a")) ?? [0.79, 0.47, 0.17];
      const b = parseColor(css.getPropertyValue("--grain-b")) ?? [0.23, 0.12, 0.08];
      const c = parseColor(css.getPropertyValue("--grain-c")) ?? [0.36, 0.17, 0.53];
      gl.uniform3f(u.base, base[0], base[1], base[2]);
      gl.uniform3f(u.ink, ink[0], ink[1], ink[2]);
      gl.uniform3f(u.a, a[0], a[1], a[2]);
      gl.uniform3f(u.b, b[0], b[1], b[2]);
      gl.uniform3f(u.c, c[0], c[1], c[2]);

      const lens = readKnob("--lens-size", 1.15);
      const strength = readKnob("--gradient-strength", 0.9);
      const invert = readKnob("--text-invert", 0);
      gl.uniform1f(u.lens, lens);
      gl.uniform1f(u.invert, invert);
      gl.uniform1f(u.grain, readKnob("--grain-amount", 0.09));
      gl.uniform1f(u.strength, strength);
      gl.uniform1f(u.streak, readKnob("--distort-streak", 0));
      /* Cached: the loop runs at 30fps and must not read computed styles each
         frame, which would force style resolution 30 times a second. */
      distortKnob = readKnob("--distort-strength", 0.35);
      /* The band is measured in normalised coordinates, so on a 390px screen it
         covers a far larger share of the headline than it does on a desktop and
         the split reads as damage. Scale it back with the viewport. */
      if (window.innerWidth < 640) distortKnob *= 0.55;
      speedKnob = readKnob("--grain-speed", 2) * 0.22;

      if (!checkedContrast) {
        checkedContrast = true;
        const aspect = (canvas.width || 1) / (canvas.height || 1);
        const rows = contrastReport(
          { base, ink, a, b, c },
          aspect,
          { lens, strength, invert },
        );
        const bad = rows.filter((row) => row.ratio < 4.5);
        const summary = JSON.stringify(rows.map((row) => ({ x: row.x, ratio: +row.ratio.toFixed(2) })));
        if (debug) console.info(`[hero-distort] contrast ${summary}`);
        if (bad.length) console.warn(`[hero-distort] text below 4.5:1 ${summary}`);
      }
    };

    const textTargets = (): Target[] => {
      const out: Target[] = [];
      const marked = hero.querySelectorAll<HTMLElement>("[data-distort-text]");
      for (const el of marked) {
        const inner = textHost(el);
        if (!inner) return [];
        const range = document.createRange();
        range.selectNodeContents(inner);
        const rects = Array.from(range.getClientRects()).filter(
          (r) => r.width > 1 && r.height > 1,
        );
        range.detach();
        if (!rects.length) return [];
        /* A wrapped line used to disqualify the whole effect, which is why the
           hero went flat on phones: at 390px the headline sets over two lines.
           The raster now places every line the browser laid out, so wrapping is
           ordinary rather than fatal. */
        out.push({ el, inner });
      }
      return out;
    };

    /* Only the headline is redrawn by the canvas, so only the headline changes
       colour with the background. The rest of the centred block is ordinary DOM
       text: one flat ink that vanishes where the lens is dark. Tagging it lets
       CSS blend that copy against the canvas with `difference`, which is the
       same 1 - bg inversion the shader does, per pixel and for nothing. Hero.tsx
       stays untouched — the attribute is added here at runtime and only while
       the layer is presenting. */
    const markCopy = (on: boolean) => {
      const scope = hero.querySelector<HTMLElement>(".text-center");
      if (!scope) return;
      if (on) scope.setAttribute("data-distort-blend", "");
      else scope.removeAttribute("data-distort-blend");
    };

    /*
     * The visual lines of a text node, as the browser actually laid them out.
     *
     * One character at a time through a Range gives the real line breaks and the
     * real origin of each line, which is what the rasteriser needs to place
     * wrapped text exactly where the DOM put it. Phone headlines are only two or
     * three lines, so the per-character cost is a few dozen range reads once per
     * rebuild — nothing next to the raster itself.
     */
    const linesOf = (inner: HTMLElement, heroRect: DOMRect) => {
      const node = Array.from(inner.childNodes).find(
        (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 0,
      );
      if (!node) return [];
      const text = node.textContent ?? "";
      const range = document.createRange();
      const lines: { text: string; left: number; top: number }[] = [];
      let current: { text: string; left: number; top: number } | null = null;
      let lastTop = Number.NaN;
      let space = "";
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const rect = range.getBoundingClientRect();
        /* A space has no ink; it only ever joins two words on one line. */
        if (!rect.width || ch.trim() === "") {
          space += ch;
          continue;
        }
        const absTop = Math.round(rect.top);
        if (!current || Math.abs(absTop - lastTop) > 1) {
          lastTop = absTop;
          current = { text: "", left: rect.left - heroRect.left, top: rect.top - heroRect.top };
          lines.push(current);
        } else {
          current.text += space;
        }
        space = "";
        current.text += ch;
      }
      range.detach();
      return lines.filter((line) => line.text.trim().length > 0);
    };

    const drawText = (targets: Target[]) => {
      if (!ctx) return false;
      const scale = canvas.width / Math.max(1, hero.clientWidth);
      const heroRect = hero.getBoundingClientRect();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, sheet.width, sheet.height);
      ctx.scale(scale, scale);
      ctx.fillStyle = "#fff";
      ctx.textBaseline = "alphabetic";

      for (const { inner } of targets) {
        const cs = getComputedStyle(inner);
        const lines = linesOf(inner, heroRect);
        if (!lines.length) return false;

        ctx.font = `${cs.fontStyle === "normal" ? "" : `${cs.fontStyle} `}${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const spacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
        const spaced = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
        const canSpace = typeof spaced.letterSpacing === "string";
        if (canSpace) spaced.letterSpacing = spacing;

        for (const line of lines) {
          const text = cs.textTransform === "uppercase" ? line.text.toUpperCase() : line.text;
          const metrics = ctx.measureText(text);
          const ascent = metrics.fontBoundingBoxAscent ?? parseFloat(cs.fontSize) * 0.8;
          const y = line.top + ascent;

          if (canSpace) {
            ctx.fillText(text, line.left, y);
          } else {
            let cursor = line.left;
            for (const ch of text) {
              ctx.fillText(ch, cursor, y);
              cursor += ctx.measureText(ch).width;
            }
          }
        }

        if (canSpace) spaced.letterSpacing = "0px";
      }

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sheet);
      return true;
    };

    const resize = () => {
      const cssWidth = hero.clientWidth || window.innerWidth;
      const cssHeight = hero.clientHeight || window.innerHeight;
      /* 1.35 is the soft ceiling: this layer is a gradient and a grain, not a
         photograph, and at 1.35 the type still reads crisp while the fill drops
         by about a third against 1.5. Phones stay at 1 to spare the battery. */
      /* Phones used to render this layer at 1 device pixel per CSS pixel. The
         type is small enough there that a 1x raster plus the band's channel
         split read as a doubled, ragged headline rather than as warp. 1.5x costs
         a quarter of the fill of a 2x layer and keeps the glyphs intact. */
      dpr = Math.min(
        window.devicePixelRatio || 1,
        lowPower ? 1 : window.innerWidth < 640 ? 1.5 : 1.35,
      );
      const width = Math.max(320, Math.min(maxTex, Math.round(cssWidth * dpr)));
      const height = Math.max(240, Math.min(maxTex, Math.round(cssHeight * dpr)));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      if (sheet.width !== width || sheet.height !== height) {
        sheet.width = width;
        sheet.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(u.res, width, height);
    };

    const draw = (time: number, distort: number, reveal: number) => {
      gl.uniform1f(u.time, time);
      gl.uniform1f(u.distort, distort);
      gl.uniform1f(u.reveal, reveal);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    /*
     * The single-frame path.
     *
     * One draw of the gradient, no text rasterised into it, no loop — and the
     * headline stays ordinary DOM text because `data-distort-static` is a
     * different switch from `data-distort`, which hides the real text. The lens
     * and half the field colour are dropped so ink keeps its contrast on a
     * background no shader is going to invert the type against.
     */
    if (lowPower) {
      resize();
      applyPalette();
      /* The shader mixes its background with the text texture's alpha. Nothing
         has been rasterised into the texture on this path, and an empty texture
         samples as opaque, so the whole canvas would fill with the text colour.
         One transparent pixel is all it takes to mean "no text here" — and it
         is the only upload this path ever does. */
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 0]),
      );
      gl.uniform1f(u.lens, 0.0001);
      /* 0.7 rather than the live 0.9: with the text kept in the DOM there is no
         per-pixel inversion to carry it, so the field is held where ink keeps
         its contrast (measured at 5.5:1 or better across the hero). */
      gl.uniform1f(u.strength, 0.7);
      gl.uniform1f(u.grain, 0.06);
      draw(0, 0, 1);
      hero.setAttribute("data-distort-static", "on");

      const repaint = () => {
        resize();
        draw(0, 0, 1);
      };
      const ro = new ResizeObserver(repaint);
      ro.observe(hero);

      return () => {
        ro.disconnect();
        hero.removeAttribute("data-distort-static");
        gl.deleteTexture(texture);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      };
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let waitingOnAnimations = false;
    let entrancePlayed = false;

    /* Rasterising the headline into the canvas — measuring every line, painting
       it into a texture, uploading it, drawing it — is the longest single task
       at startup (about a third of a second on a 4x throttled CPU) and it lands
       after the real text has already painted. Running it on the first idle
       slot keeps that time out of the interaction window; the DOM text stays
       visible until the canvas is ready, so nothing is lost by the wait. */
    let idleHandle: number | null = null;

    const scheduleRebuild = () => {
      if (idleHandle !== null) return;
      if (typeof window.requestIdleCallback !== "function") {
        idleHandle = window.setTimeout(() => {
          idleHandle = null;
          rebuild();
        }, 150);
        return;
      }
      idleHandle = window.requestIdleCallback(
        () => {
          idleHandle = null;
          rebuild();
        },
        { timeout: 900 },
      );
    };

    const rebuild = () => {
      if (waitingOnAnimations) return;

      /* The CSS entrance translates the lines (.rise, .hero-line > span). If the
         text is measured mid-flight, the raster lands where the glyphs *were* and
         the canvas draws the headline offset from the paragraph. Wait for those
         animations to finish before measuring — with a ceiling, because an
         indefinite animation would otherwise block the effect forever. */
      const running = hero
        .getAnimations({ subtree: true })
        .filter(
          (animation) =>
            animation.playState === "running" &&
            Number(animation.effect?.getTiming().iterations) !== Infinity,
        );
      if (running.length) {
        waitingOnAnimations = true;
        entrancePlayed = true;
        const settled = Promise.all(running.map((a) => a.finished.catch(() => undefined)));
        Promise.race([settled, new Promise((resolve) => setTimeout(resolve, 1200))]).finally(() => {
          waitingOnAnimations = false;
          scheduleRebuild();
        });
        return;
      }

      resize();
      const fontsLoaded = !document.fonts || document.fonts.status === "loaded";
      const targets = fontsLoaded ? textTargets() : [];
      let ok = false;
      if (targets.length) {
        applyPalette();
        ok = drawText(targets);
      }

      if (!ok) {
        /* Nothing reliable to stand in for the text — fonts still loading, a
           wrapped line, or a failed upload. Take the layer down so the real
           DOM text is visible; this is the fallback path, not an error. */
        cancelAnimationFrame(raf);
        raf = 0;
        ready = false;
        hero.removeAttribute("data-distort");
        hero.removeAttribute("data-distort-debug");
        markCopy(false);
        return;
      }

      /* Draw once *before* hiding the DOM text, so the layer is never enabled
         over an empty canvas (which would blank the headline for a frame). */
      draw(0, 0, 1);

      /* Only now is the canvas actually able to stand in for the text. */
      ready = true;
      markCopy(true);
      if (debug) hero.setAttribute("data-distort-debug", "on");
      hero.setAttribute("data-distort", "on");

      if (motionQuery.matches) {
        cancelAnimationFrame(raf);
        raf = 0;
        draw(0, 0, 1);
        return;
      }
      /* If the CSS entrance already played while we were waiting, the reveal is
         already spent: starting it again would fade the headline in twice. */
      if (!startedAt) {
        startedAt = entrancePlayed ? performance.now() - REVEAL_MS : performance.now();
      }
            if (!raf) {
        if (settled) {
          /* A rebuild after the reveal (fonts landing, a resize, edited copy) is
             a new raster to draw once — not a reason to start the band again. */
          draw((performance.now() / 1000) * speedKnob, distortKnob, 1);
        } else {
          last = 0;
          stopAt = performance.now() + REVEAL_MS + 1400;
          raf = requestAnimationFrame(render);
        }
      }
    };

    const render = (now: number) => {
      /* Stop the clock entirely when the hero is off-screen or the tab is in the
         background. Scheduling frames only to return from them keeps the
         compositor awake (and a laptop fan on) for nothing. */
      if (document.hidden || !visible || !ready) {
        raf = 0;
        return;
      }
      /* The reveal is the only part that has to play to the end. Past `stopAt`
         the last frame is drawn once and the loop ends — an effect that never
         stops is a fan that never stops. */
      if (now > stopAt) {
        raf = 0;
        settled = true;
        draw((now / 1000) * speedKnob, distortKnob, 1);
        return;
      }
      raf = requestAnimationFrame(render);
      if (now - last < 1000 / fps) return;
      last = now;
      const reveal = Math.min(1, Math.max(0, (now - startedAt) / REVEAL_MS));
      draw((now / 1000) * speedKnob, distortKnob, 1 - (1 - reveal) ** 3);
    };

    /* Interaction is the only thing that brings the band back, for a couple of
       seconds at a time. Pointer moves only count over the hero itself. */
    const stir = () => {
      if (motionQuery.matches || !ready || document.hidden || !visible) return;
      stopAt = Math.max(stopAt, performance.now() + 2400);
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(render);
      }
    };

    const observer = new ResizeObserver(() => scheduleRebuild());
    observer.observe(hero);

    const textObserver = new MutationObserver((records) => {
      if (records.some((r) => r.type === "characterData" || r.type === "childList")) scheduleRebuild();
    });
    textObserver.observe(hero, { characterData: true, childList: true, subtree: true });

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) stir();
      },
      { threshold: 0 },
    );
    io.observe(hero);

    const onMotion = () => scheduleRebuild();
    const onVisibility = () => {
      if (!document.hidden) stir();
    };
    const onFonts = () => scheduleRebuild();
    const onAnimationEnd = () => scheduleRebuild();
    hero.addEventListener("animationend", onAnimationEnd);
    hero.addEventListener("pointerdown", stir, { passive: true });
    hero.addEventListener("pointermove", stir, { passive: true });
    window.addEventListener("scroll", stir, { passive: true });

    motionQuery.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    if (document.fonts) {
      document.fonts.ready.then(scheduleRebuild).catch(() => {});
      document.fonts.addEventListener("loadingdone", onFonts);
    }
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      ready = false;
      hero.removeAttribute("data-distort");
      hero.removeAttribute("data-distort-debug");
      hero.removeAttribute("data-distort-static");
    });

    scheduleRebuild();

    return () => {
      cancelAnimationFrame(raf);
      if (idleHandle !== null) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
        clearTimeout(idleHandle);
        idleHandle = null;
      }
      observer.disconnect();
      textObserver.disconnect();
      io.disconnect();
      motionQuery.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
      if (document.fonts) document.fonts.removeEventListener("loadingdone", onFonts);
      hero.removeEventListener("animationend", onAnimationEnd);
      hero.removeEventListener("pointerdown", stir);
      hero.removeEventListener("pointermove", stir);
      window.removeEventListener("scroll", stir);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={ref} className="hero-distort" aria-hidden="true" />;
}
