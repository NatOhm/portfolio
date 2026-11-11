# Effects reference — how other portfolio sites build motion, and what fits the clay theme

Research only. No site's code, assets, copy, or branding is copied here; each section describes
the *technique* in my own words and the sketches in Part 3 are written from scratch for this
project (Next.js 16 App Router, Tailwind 4, React 19).

Traced: 9–10 Nov 2026, desktop Chromium 1440×900, viewport scrolled in 900 px steps, hover and
keyboard probes on the primary cards and links.

Verification legend:

- **verified** — seen in the page source, computed styles, animation API, network requests, or in
  a before/after screenshot pair.
- **unverified** — could not be confirmed from the page; stated as such, not guessed.

Raw evidence lives in `docs/trace/`: one `<host>.json` per site (script tags, detected globals,
keyframe names, hover rules, fixed elements), `<host>-top.jpg` + four `-scroll-N.jpg` frames,
`hover/*-before/after.png` crops used for pixel diffs, and a few interaction stills.

---

## 0. Summary

| Site | Status | Platform detected | Motion stack (verified) | Ambient loop? | Reduced-motion CSS |
| --- | --- | --- | --- | --- | --- |
| jasonbergh.com | 200 | Webflow | GSAP 3.15 + ScrollTrigger + Observer + InertiaPlugin + Draggable + SplitType 0.3.4 | 137 `<video>` in DOM, 5 autoplay | none found |
| gallereee.com | 308 → www | Framer (`Framer 941e113`) | Framer components only, CSS colour transitions | none | none found |
| bruno-simon.com | 200 | custom WebGL app | Three.js + Howler.js (in a 3.8 MB bundle) | 3D scene runs continuously | none found |
| thunderking-burger.com | **404** | dead domain (Wix parking page) | — | — | — |
| marckuiper.com | 308 → www | Framer (`Framer 99770fa`) | Framer appear animations + one hero `<canvas>` | hero canvas | none found |
| willphan.com | 200 | Next.js App Router | Lenis-style smooth scroll + custom inline reveal (`opacity`/`filter`) + CSS keyframes | 7 muted looping videos | 6 `prefers-reduced-motion` blocks |
| ivankalkaev.com | 200 | Framer export + Astro island | View Transitions API + ~19 CSS keyframes + 2 canvases | 2 canvases + floating objects | none found |
| astapable.com (via gallereee) | 200 | Webflow | GSAP 3.15 (ScrambleText, SplitText, ScrollTrigger) + Howler 2.2.4 | 2 muted looping videos | none found |

Three portfolio sites were taken from the gallereee.com gallery, as asked: **willphan.com**
(Next.js, video-grid work index), **ivankalkaev.com** (View Transitions, playful objects) and
**astapable.com** (GSAP typography, ambient hero clip).

---

## 1. jasonbergh.com — cinematic reel that advances on wheel

**Status:** 200. **Platform:** Webflow (`html[data-wf-page]`, Webflow runtime chunks, jQuery 3.5.1).
**Libraries (verified from script tags):** `gsap.min.js` 3.15, `ScrollTrigger.min.js`,
`CustomEase.min.js`, `Draggable.min.js`, `InertiaPlugin.min.js`, `Observer.min.js`,
`split-type@0.3.4`.

Effects verified:

- **Wheel does not scroll the page.** After a 600 px wheel burst the document is still at
  `scrollY: 0`, but the active slide text changed from "The Greatest Love Feature" to
  "Barbara Palvin Fashion Film" and the large index counter moved to a different number
  (`docs/trace/www-jasonbergh-com-wheel.jpg`). Wheel input is captured and drives a slider.
  `Observer` + `InertiaPlugin` in the bundle match that behaviour.
- **Full-page crossfade layer.** Fixed elements include `div.transition-wrapper` plus
  `div.background-decor` and `div.popup-container`; keyframes `playerOpen` / `playerClose`
  exist for a video lightbox.
- **Custom cursor.** `div.cursor-block_play` is fixed on the page — a "PLAY" cursor over media.
  `noise` keyframes exist, so a grain overlay is animated somewhere on the page.
- **Character-level type.** `SplitType` is loaded and the screenshots caught headings mid-reveal
  with individual characters clipped at the baseline (`-top.jpg`), i.e. a per-letter mask or
  translate reveal, not a whole-block fade.
- **Link hover is colour only.** `.nav-link-block:hover`, `.name-large.has--hover:hover`,
  `.text-mono.has--hover:hover` all switch `color` to a `--lemon` custom property, with
  `transition: color 0.3s` (verified in the stylesheet and computed styles).
- **Media weight:** 137 `<video>` elements in the DOM, 5 with autoplay — the reel thumbnails are
  video, not stills.

Key technique in plain words: the page is a fixed, full-screen stage and scrolling is only an
*input*. GSAP's Observer converts wheel/touch into "next/previous item" events, an inertia plugin
carries the momentum, and a fixed wrapper crossfades the outgoing and incoming work. Nothing on
the page scrolls in the normal sense, so the layout is allowed to be a single cinematic frame.

Unverified: the exact GSAP timeline (custom code, minified), whether `Draggable` is bound to the
slider or only to the lightbox, mobile behaviour, and how the 137 videos are lazy-loaded.

---

## 2. gallereee.com — Framer gallery, preview swap on hover

**Status:** 308 → `https://www.gallereee.com/` (200). **Platform:** Framer
(`meta[name=generator] = Framer 941e113`, `data-framer-name` components). Page height ≈ 6127 px.

Effects verified:

- **Hover swaps the preview inside each card.** I read `img.currentSrc` on the first card before
  and after moving the pointer onto it: a different image file is loaded (same box, 358×201,
  `object-fit: cover`). The screenshot pair shows the second capture is a tighter crop of the same
  project, so the card reads as "zoom" but is actually an image swap
  (`docs/trace/hover/www-gallereee-com-before.png` / `-after.png`, 13 % of the card's pixels
  changed; a no-hover control pair 900 ms apart changed 0 %).
- **Category filter chips** (All / Designer / Agency / Developer / Photographer / Videographer /
  Director / 3D Artist / …) filter the grid in place — Framer variants, no page reload.
- **Editorial badges** ("Editor's pick", "Free template") sit on the card, not in the caption.
- **Link colour transitions** use `color 0.4s cubic-bezier(0.44, 0, 0.56, 1)` — a symmetric
  ease-in-out, noticeably softer than the site's default.
- **No `<video>` anywhere** and no GSAP; everything is Framer's own runtime.

Key technique: the card holds two stacked preview images and a hover variant crossfades between
them (Framer "appear"/variant swap), which gives a sense of browsing without any scroll trickery.
Cheap, and the whole gallery stays a normal scrolling page.

Unverified: whether some cards switch to a video preview (none found in the DOM at capture time),
and the exact Framer variant easing beyond the colour rule above.

---

## 3. bruno-simon.com — a 3D world instead of a page

**Status:** 200. **Platform:** a single custom app: `assets/index-DZgz1LCb.js`, 3.8 MB.
**Libraries (verified by grepping that bundle):** Three.js (`WebGLRenderer` ×3, `three` markers),
Howler.js (`Howl` / `howler` ×69). Single `<canvas>`, document height = viewport height (900 px),
so there is **no page scroll at all**.

Effects verified:

- **The page is a WebGL scene.** One full-viewport canvas; the fixed layers are `div.game`,
  `div.js-menu`, `div.js-modals`, plus a `.js-fonts-loader`. The menu/modal text exists in the DOM
  (intro copy about being a creative developer, a "Your time 00:00:000" score panel, an offline
  high-score notice).
- **Keyboard drives the camera.** Pressing `ArrowUp` for 1.2 s visibly moved the view closer to
  the glowing ring (`docs/trace/bruno-simon-com-keyup.jpg` vs `-top.jpg`), so keyboard input
  reaches the 3D controller rather than the document.
- **The scene is always running** — no scroll trigger, the loop is the experience.
- **In-page UI is DOM, not 3D:** keyframes `map-player-animation` animate the little map player;
  `.button:hover` swaps border/colour and `.menu-trigger:hover .button-inner` shifts by −4 px
  (verified in CSS) — normal CSS hover on the 2D chrome.

Key technique: interaction is spatial. The visitor drives a character/car around a low-poly world
and the "portfolio" is the objects in it; all the readable content (menus, modals, scores) stays
in ordinary HTML layered above the canvas for accessibility and text selection.

Unverified: the exact Three.js version (the bundle exposes no `REVISION` string), the full control
map beyond the arrow-key test, drag/orbit behaviour, and mobile/touch input.

---

## 4. thunderking-burger.com — dead

**Status:** HTTP **404**, and the served document is Wix's parking screen ("This domain isn't
connected to a site", `docs/trace/www-thunderking-burger-com-top.jpg`). No site to trace. Not
retried, not worked around.

---

## 5. marckuiper.com — dark hero with a live canvas

**Status:** 308 → `https://www.marckuiper.com/` (200). **Platform:** Framer
(`Framer 99770fa`). Height ≈ 7832 px.

Effects verified:

- **Hero is a full-bleed `<canvas>`** (1440×630) with a separate `div[data-framer-name="Noise"]`
  overlay on top — the soft aurora gradient behind the headline is drawn, not a photo. The canvas
  drawing context could not be read back (`getContext` returns null once a canvas already has a
  context), so **whether it is WebGL or 2D is unverified**.
- **Framer appear animations:** 4 elements carry `data-framer-appear-id`, so the hero copy and
  buttons animate in on load.
- **Typography does the rest:** one huge headline with a single italic word, two pill buttons, a
  small "Currently working for" line. No grain/scanline filter on the type.
- **Nav is not sticky** (`position: relative` at rest) — it scrolls away with the hero.
- **Work cards have no hover feedback:** a before/after pointer pass over the first work card
  changed 0 % of pixels, and its wrapper reports `transform: none` in both states. The five cards
  are plain links to `/work/<slug>`.
- **No `prefers-reduced-motion` blocks** were found (0 media queries).

Key technique: spend the motion budget on one atmospheric layer. A slow gradient canvas behind a
static, very large headline gives the site its mood; the rest of the page is deliberately
motionless so the work photography carries it.

Unverified: canvas renderer, the speed/loop of the gradient, and whether the hero canvas pauses
when scrolled out of view.

---

## 6. willphan.com — video grid with a custom blur reveal

**Status:** 200. **Platform:** Next.js App Router (`/_next/static/chunks/app/page-*.js`), Vercel
insights. **Smooth scroll:** a Lenis class/attribute is present (`.lenis` or `[data-lenis]`) and
`scroll-behavior: smooth` is computed on the root.

Effects verified:

- **Cards are video.** 7 `<video>` elements, all muted, looping, autoplaying, each a looping film
  still with its own pause/play control in the corner (`-top.jpg`, `-scroll-2.jpg`). The caption
  line under each card is separate DOM text (project name + one-line description).
- **Custom reveal, not a library.** Each card `<a>` carries inline
  `opacity: …; filter: blur(0px); will-change: opacity, filter` and `data-wave-slot`,
  `data-wave-frame`, `data-wave-media` attributes on the media wrapper. A 900 ms screenshot pair
  taken while a card was still animating shows it blurred and offset, settling to sharp — so the
  reveal animates opacity + blur (and a small offset) per card, driven by a bespoke
  "wave" scroll system rather than GSAP (no GSAP globals on the page).
- **Hover is two small things.** `group-hover` rules translate an arrow by 12–16 px
  (`--tw-translate-x: 12px/14px/16px`) and tint a surface `rgb(var(--ink)/.06)`. No scale, no
  overlay.
- **Page transitions are CSS keyframes:** `page-fade-out`, `page-fade-in`, `page-slide-up`, plus
  `rise_rise` and `orbit_turn` for in-page motion; `document.getAnimations()` reported mostly
  `left`/`opacity` transitions.
- **Reduced motion is respected:** 6 `@media (prefers-reduced-motion)` blocks in the stylesheets —
  the only traced site that had any.

Key technique: keep every card a real video element and let one small scroll observer add a
blur-and-rise class as the card enters. The effect reads as film coming into focus, and because
it is inline style + a class, the same markup degrades to plain visible cards without JavaScript.

Unverified: the reveal library/implementation inside the "wave" system (it is bundled app code),
the page-transition trigger (client-side navigation vs. click), and whether the videos pause when
offscreen.

---

## 7. ivankalkaev.com — View Transitions and spring-like keyframes

**Status:** 200. **Platform:** Framer export with an Astro island
(`_astro/Pilot.astro_astro_type_script_index_0.js`) plus Cloudflare insights. Two `<canvas>`
elements (520×240, 336×280).

Effects verified:

- **The View Transitions API is used.** The stylesheet contains
  `::view-transition-group(ik-hero) { animation-duration: 520ms; animation-timing-function:
  cubic-bezier(0.2, 0, 0, 1); }` and `::view-transition-old(root)` rules, with paired keyframes
  `ik-vt-hero-old` (opacity 1 → 0 by 40 %) and `ik-vt-hero-new` (0 → 1 by 35 %). That means
  navigation morphs the hero between pages instead of hard-cutting.
- **Spring-flavoured micro-animations:** `ik-grip` (translateY 16 px → 0, overshoot to −2 px, then
  0 with opacity) and `ik-pull` (0 → 3 px → −1.5 px → 0) — a settle/overshoot, not a linear slide.
- **Nav selection animation:** `ik-selected-rise`, `ik-selected-title-line-in`,
  `ik-selected-highlight-reveal`, `ik-selected-marker-in`, `ik-selected-edge-track`,
  `ik-selected-handle-track`, `ik-selected-menu-slot-open`, `ik-selected-menu-reveal` — the active
  chip grows into a highlighted "selected text" state with markers and handles.
- **Playful object layer:** floating 3D-looking gems, a mouse, a baseball, plus `hero-object-float`
  and `mail-metal` / `apple-metal-shift` / `ik-gold-shift` keyframes (looping colour-shift on
  metallic artwork).
- **The hero text is a fake text-selection UI:** the name renders with selection handles and a
  floating toolbar containing real `Copy`, `Open CV`, `Ask Blue` buttons (verified in the DOM).
- **Fixed chrome:** `portfolio-nav-scrim` layers plus two `framer-*-container` elements; the nav
  itself is a black pill above a light page.
- **No `prefers-reduced-motion` blocks** found (0).

Key technique: navigation is animated at the browser level with the View Transitions API — name
the hero element once, and every route change crossfades/morphs it inside a 520 ms custom bezier.
Secondary motion (chips, floating objects) is plain CSS keyframes with overshoot, which keeps the
bundle small.

Unverified: what the two canvases actually draw (context type not readable; likely the gems), and
the complete route transition set (only same-document transitions could be observed on the home
page).

---

## 8. astapable.com — GSAP typography and one ambient clip

**Status:** 200 (navigation timed out on `networkidle`; the page rendered and scrolled normally).
**Platform:** Webflow. **Libraries (verified from script tags):** GSAP 3.15 with
`ScrambleTextPlugin`, `SplitText`, `ScrollTrigger`, `CustomEase`; `howler@2.2.4`; a
`widget.js` for the "Ask Ev AI" chat.

Effects verified:

- **Ambient hero clip.** Two `<video>` elements, both `autoplay`, `loop`, `muted`
  (`Homescreen Video_Ev Astapov.mp4`, `Captures_cover.MP4`). One is the hero scene of a designer
  at a desk; a floating control bottom-right reads **"Vibing with Ev"** with a play/pause state
  ("Paused" in the capture) — the ambient loop has a real off switch.
- **Scramble text section labels.** `ScrambleTextPlugin` is loaded and section headings are
  styled like code comments (`/* Featured Work */`); the plugin's presence plus the letter-by-
  letter appearance between scroll frames indicates a decode/scramble effect on those labels.
- **Custom cursor exists:** a fixed `.cursor` element (≈102×37 px capsule) sits exactly under the
  pointer coordinates after a mouse move, `mix-blend-mode: normal`.
- **Marquee band:** a `howler-marquee` keyframe animation runs a horizontal loop of client logos.
- **Cards:** wide tinted covers with a small tag row above the title and a one-line outcome below;
  captions are plain text, no hover state was observable in the stills.
- **Audio:** Howler is loaded, tied to the "Ask Ev" / "Vibing" widgets; I did not trigger playback.

Key technique: one looping hero video sets the temperature, while GSAP's text plugins carry the
personality on scroll — split headings and scrambled labels cost almost nothing layout-wise but
make the page feel authored.

Unverified: the exact scramble target and timing, SplitText's split granularity, whether the
ambient clip also plays audio, and the hover behaviour on work cards.

---

## 9. What I will not adopt

These appeared repeatedly and conflict with the clay theme's rules (calm, physical, no
scroll-jacking, no custom cursor, reduced-motion, nothing hidden without JS):

| Pattern | Where | Why not |
| --- | --- | --- |
| Wheel hijack / slide-by-slide stage | Jason Bergh | Scroll hijacking; keyboard/AT users lose the document flow. |
| 137 preloaded videos | Jason Bergh | Bandwidth and battery; a portfolio grid does not need a video per thumbnail. |
| Custom cursor (PLAY / capsule) | Jason Bergh, Ev Astapov, Bruno Simon | Explicitly out of scope; also breaks on touch and with `prefers-reduced-motion`. |
| Full-page WebGL world | Bruno Simon | Great craft, wrong medium for a readable case-study portfolio. |
| Always-on canvas hero | Marc Kuiper, Ivan Kalkaev | Fine as an option, but "one ambient looping element with a pause control" is the rule; a shader that can't pause doesn't qualify. |
| Fake text selection UI | Ivan Kalkaev | Charming, but it competes with real text selection and adds a JS dependency for little content. |

---

## 10. Ideas that fit my clay theme

Six techniques, all implementable with CSS and a little React — **no new dependency** (the one
exception, View Transitions, is a browser API). Every sketch keeps content visible without
JavaScript, honours `prefers-reduced-motion`, and avoids hijacking scroll.

### 10.1 Blur-to-sharp reveal on scroll (from willphan.com)

Cards and photographs settle into focus as they enter the viewport — the film-pull equivalent of
clay pressing into shape. Implemented with **CSS scroll-driven animations**, so there is no
observer to write and nothing is hidden when JS is off (browsers without support simply show the
final state).

```css
/* app/globals.css */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .clay-reveal {
      animation: clay-settle linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 32%;
    }
    @keyframes clay-settle {
      from {
        opacity: 0;
        transform: translateY(18px) scale(0.985);
        filter: blur(7px);
      }
      to {
        opacity: 1;
        transform: none;
        filter: blur(0);
      }
    }
  }
}
```

```tsx
// usage: <figure className="clay-reveal">…</figure>
```

Notes: animate `filter` only on small tiles (≤ 40 % of the viewport), never on a full-bleed hero —
blur is a paint-time cost. Keep `animation-range` short so fast scrollers still see the finished
state. Because the keyframes start from visible content in a no-JS/unsupported browser, nothing
disappears. Add `contain: paint` to the frames.

### 10.2 Two-frame hover on work cards (from gallereee.com)

Each case-study card carries a second still (a process shot or a detail) that crossfades on
hover/focus. In clay terms this reads as a card being *lifted to show what's underneath*.

```tsx
<a href={`/work/${slug}`} className="group relative block overflow-hidden rounded-[24px] clay-sm">
  <Image src={cover} alt="" width={1600} height={1000} className="h-full w-full object-cover" />
  <Image
    src={detail}
    alt=""
    aria-hidden
    width={1600}
    height={1000}
    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
  />
  <span className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/40" />
</a>
```

Notes: keep the second image out of the accessible name (`alt=""` + `aria-hidden`) because it
duplicates the cover; give it `loading="lazy"` and a tiny `sizes`. On touch there is no hover, so
the cover must be complete on its own. `motion-reduce:transition-none` keeps the swap instant for
users who ask for less motion — the information is still there, just not animated.

### 10.3 Press-and-settle card feedback (from willphan.com's arrow nudge)

Will Phan nudges a 12–16 px arrow and tints the surface. For clay, the equivalent is a *physical
press*: the card loses a little height, the shadow tightens, and a small arrow moves just 3 px.

```css
@layer components {
  .clay-card-link {
    transition:
      transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .clay-card-link:hover,
  .clay-card-link:focus-visible {
    transform: translateY(-2px);
    box-shadow: var(--shadow-clay-lg);
  }
  .clay-card-link:active {
    transform: translateY(1px) scale(0.995);
    box-shadow: var(--shadow-clay-press, var(--shadow-clay));
  }
  .clay-card-link svg {
    transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .clay-card-link:hover svg,
  .clay-card-link:focus-visible svg {
    transform: translateX(3px);
  }
  @media (prefers-reduced-motion: reduce) {
    .clay-card-link,
    .clay-card-link svg {
      transition: none;
    }
    .clay-card-link:hover,
    .clay-card-link:active {
      transform: none;
    }
  }
}
```

Notes: 180 ms with a decelerating curve is what makes it feel weighted rather than snappy. Mirror
every hover state on `:focus-visible` so keyboard users get the same feedback, and drive colour
with the existing tokens (no new orange values).

### 10.4 One ambient loop with a real pause control (from willphan.com + astapable.com)

A single muted, looping clip — the showreel — on the home page, with a visible pause button.
Nothing else on the page loops.

```tsx
"use client";
import { useEffect, useRef, useState } from "react";

export function AmbientReel({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!el) return;
    if (reduced.current) return; // poster only, user opts in
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().then(() => setPlaying(true)).catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[28px] clay-sm">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label="Showreel, silent loop"
        className="h-auto w-full"
      />
      <button
        type="button"
        onClick={() => {
          const el = ref.current;
          if (!el) return;
          if (el.paused) {
            void el.play();
            setPlaying(true);
          } else {
            el.pause();
            setPlaying(false);
          }
        }}
        aria-pressed={playing}
        className="clay-chip absolute bottom-3 right-3"
      >
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}
```

Notes: `preload="none"` plus a poster means the clip costs nothing until it is near the viewport
(the poster is the fallback and is also what reduced-motion and no-JS users see). Pause when
offscreen so a background tab does not decode video. Only one such component per page — the rule
is one ambient element, and this is it. Do not autoplay audio.

### 10.5 Route settle with View Transitions (from ivankalkaev.com)

Ivan morphs the hero across navigations with a 520 ms custom bezier. A calm version for this
site: the outgoing page fades, the incoming page rises 8 px and un-blurs — no shared-element
morph, no slide.

```css
/* app/globals.css */
@media (prefers-reduced-motion: no-preference) {
  ::view-transition-old(root) {
    animation: page-out 160ms cubic-bezier(0.4, 0, 1, 1) both;
  }
  ::view-transition-new(root) {
    animation: page-in 340ms cubic-bezier(0.2, 0, 0, 1) both;
  }
  @keyframes page-out {
    to {
      opacity: 0;
      filter: blur(4px);
    }
  }
  @keyframes page-in {
    from {
      opacity: 0;
      transform: translateY(8px);
      filter: blur(4px);
    }
  }
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

Notes: the CSS above is inert until navigation actually runs a view transition, and the page stays
fully functional if it never does. Enabling it in Next.js 16 is a config-level decision — I have
**not** verified the exact flag name for this version, so check `next.config.ts` docs before
adding it; the fallback is a normal navigation, which is acceptable. A view transition never hides
content permanently, and reduced motion disables it entirely.

### 10.6 Line-mask heading reveal (from jasonbergh.com's SplitType, ivankalkaev.com's keyframes)

Instead of splitting every character with JS, split the headline into **lines** at author time and
let each line slide up out of its own overflow-hidden mask, staggered by 70 ms. It reads as type
being set, and the clay palette stays quiet.

```tsx
// server component — no client JS
export function RevealHeading({ lines }: { lines: string[] }) {
  return (
    <h1 className="text-display-xl text-ink">
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <span className="mask-line block" style={{ "--i": i } as React.CSSProperties}>
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}
```

```css
@media (prefers-reduced-motion: no-preference) {
  .mask-line {
    animation: line-rise 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: calc(var(--i, 0) * 70ms);
  }
  @keyframes line-rise {
    from {
      transform: translateY(105%);
    }
    to {
      transform: none;
    }
  }
}
```

Notes: no JS and no DOM splitting, so screen readers get one clean heading and the text is present
before paint (the mask only clips during the 620 ms). Cap the stagger at ~4 lines so the last line
never waits longer than ~280 ms. Do not combine this with the scroll blur from 10.1 on the same
element — one reveal per element, or the page starts to feel busy.

---

## 11. Implementation guardrails for this repo

1. **`prefers-reduced-motion`** — every new animation goes behind a `no-preference` query (or a
   `motion-reduce:` utility). Only Will Phan's site did this among the eight traced; the clay
   theme should beat that baseline.
2. **One ambient loop** — `AmbientReel` (10.4) is the only continuous element allowed, and it ships
   with a pause button. No hero shader, no second video.
3. **Physical, not flashy** — press/settle/squish only: 140–200 ms, decelerating curves
   (`cubic-bezier(0.22, 1, 0.36, 1)`), 1–3 px travel. No glitch, no parallax stacks, no scale above
   ~1.03.
4. **No scroll hijacking, no custom cursor** — normal document scroll, normal pointer.
5. **Nothing hidden without JavaScript** — CSS-first effects (`@supports (animation-timeline: view())`
   with final-state default), and media renders a real `<img>`/`poster` regardless of script.
6. **Budget** — blur only on small surfaces, `will-change` only while animating, video `preload="none"`,
   and verify with the existing `npm run verify:ui` suite plus a reduced-motion pass.
