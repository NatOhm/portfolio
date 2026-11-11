# Trace reference — hero, colour, motion, hover

Short catalogue of the eight sites captured in this folder, one line per axis. Derived from the
`<host>.json` records, the `-top.jpg` frames and the `hover/*` pairs only; nothing here comes from
memory or from the sites' own marketing copy.

**Confidence tags**

- **[v]** verified by two independent signals (script/style evidence *and* a pixel or computed-style
  result), or by a matched before/after pair with a control.
- **[1]** seen in a single frame or a single stylesheet read; directionally right, not cross-checked.
- **[n]** noisy capture — recorded here so it is *not* cited. See "Captures not to cite" at the end.

Everything is desktop Chromium, 1440×900, viewport-scrolled in 900 px steps.

---

## At a glance

| Site | Hero | Colour | Motion engine | Hover |
| --- | --- | --- | --- | --- |
| jasonbergh.com | full-screen reel stage, no page scroll | black ground, cream type, one lemon accent | GSAP 3.15 (Observer, Inertia, ScrollTrigger, SplitType) | colour → lemon, 0.3 s |
| gallereee.com | gallery grid of site cards | near-black page, orange accent, grey cards | Framer variants + CSS colour 0.4 s | preview image swap inside card |
| bruno-simon.com | the 3D scene itself | scene-dominant purple/blue night | Three.js + Howler, always running | 2D chrome only, ±4 px nudge |
| marckuiper.com | full-bleed canvas + huge headline | near-black with blue aurora | Framer appear + 1 canvas | none found |
| willphan.com | six-up video grid | near-black, white type | Lenis + bespoke blur/opacity reveal | arrow nudge + surface tint |
| ivankalkaev.com | "selected text" name with real handles | white ground, black pill nav, metallic objects | View Transitions API + ~19 keyframes | email pill expands, icon rotates in |
| astapable.com | looping 3D desk clip | white ground, greyscale scene | GSAP SplitText/ScrambleText + marquee | none found |
| thunderking-burger.com | — (404) | — | — | — |

---

## Per site

### jasonbergh.com — Webflow
- **Hero.** A fixed, full-viewport stage: one film still at a time with a huge serif title, a
  counters column of tiny mono index numbers, and video thumbnails pinned left and right. Wheel
  does not scroll — after a 600 px burst `scrollY` stayed 0 while the slide title changed, so the
  document is 977 px tall and the "page" is the stage. **[v]**
- **Colour.** Black ground, warm cream type (`rgb(255,251,242)`), and exactly one accent — a
  `--lemon` custom property — used by every hover state. Nothing else is tinted. **[v]**
- **Motion.** GSAP 3.15 with Observer, InertiaPlugin, ScrollTrigger, Draggable and SplitType 0.3.4;
  keyframes `spin`, `fadePulse`, `playerOpen`, `playerClose`, `noise`. Headings arrive
  character-by-character, caught mid-reveal with letters clipped at the baseline. 137 `<video>`
  elements in the DOM, 5 autoplaying. **[v]**
- **Hover.** Colour only, `transition: color 0.3s`, on nav links, the large name, mode blocks,
  creator blocks, filter items and option rows. The one media hover that is real scales the
  thumbnail: `.preview-video_reportage:hover { transform: scale(1.15) }`. **[v]**
- **Noise.** The four `-scroll-N.jpg` frames are `[0,77,0,0]`: the capture never scrolled because
  the site doesn't. `.preview-block_reportage:hover { filter: brightness(); }` is an empty,
  dead declaration — don't quote a brightness effect. **[n]**

### gallereee.com — Framer (308 → www)
- **Hero.** No video, no canvas: a filter-chip row and a three-across grid of portfolio cards, each
  card holding a screenshot of another site. Cards measured 437×437 at capture. **[1]**
- **Colour.** Near-black page (`#0a0a0a`-ish) with a warm orange highlight on one word of the
  headline and an orange radial glow behind the top-right corner; cards sit on `rgb(28,28,28)` at
  16 px radius with an 8 px inner figure. Chips are dark pills; the "Free template" badge is the
  only saturated fill. **[v]** for the card/hex values (inline styles), **[1]** for the glow.
- **Motion.** No GSAP, no `<video>`, 0 canvases, 0 CSS animations beyond Framer's editor chrome.
  Everything is Framer variants; the only timing worth copying is the link colour curve,
  `color 0.4s cubic-bezier(0.44, 0, 0.56, 1)` — a symmetric ease-in-out, softer than a default. **[v]**
- **Hover.** The card swaps its preview image: a different file loads in the same 358×201 box,
  which reads as a zoom but is an image swap. 13 % of the card's pixels changed; a no-hover control
  pair 900 ms apart changed 0 %. **[v]**
- **Noise.** `gallereee-com.json` is the 308 redirect stub — the real record is the `www-` files.
  `webgl: true` with 0 canvases is a capability check, not WebGL usage. **[n]**

### bruno-simon.com — custom WebGL app
- **Hero.** The scene *is* the hero: one full-viewport canvas, purple night, a glowing white ring,
  a steep plane of small dashed grid marks. Document height equals the viewport, so there is no
  scroll at all; menus and modals live in ordinary DOM above the canvas. **[v]**
- **Colour.** Scene-driven — deep blue into violet, electric-blue grid accents, a white-cyan ring.
  The DOM chrome is monochrome white. There is no page palette to copy, only a render palette. **[1]**
- **Motion.** Continuous Three.js loop plus Howler.js in a single 3.8 MB bundle; keyboard input
  moves the camera (ArrowUp for 1.2 s moved the view closer). Only one CSS keyframe,
  `map-player-animation`, for the 2D map widget. **[v]**
- **Hover.** 2D chrome only: `.button:hover` swaps to white text and a 1 px white border;
  `.menu-trigger:hover .button-inner` translates −4 px (and −4 px on Y for menu items) while its
  `::after` and icon fade to 0.8/1; `.has-tooltip:hover .tooltip` flips to `display: block`. **[v]**
- **Noise.** `frames: [0,0,0,0]` — the scroll frames are identical copies of the top frame, because
  the page cannot scroll. Don't cite them as "no change on scroll"; there is nothing to scroll. **[n]**

### marckuiper.com — Framer (308 → www)
- **Hero.** A full-bleed canvas (1440×630 at capture) with a separate `div[data-framer-name="Noise"]`
  overlay, then a huge white headline with one italic word, two pills and a "Currently working for"
  line. Nav is `position: relative`, so it scrolls away. Page height ≈ 7832 px. **[v]** layout,
  **[1]** the canvas being the aurora (renderer unreadable — `getContext` returns null on a live
  canvas).
- **Colour.** Near-black `#0b0b0c` ground with a blue-teal aurora glow behind the headline; white
  type; a small yellow avatar as the only warm note; grey translucent pill buttons. **[1]**
- **Motion.** Four elements carried `data-framer-appear-id` (hero copy, buttons) — a load-in, not a
  scroll system. One canvas. No `prefers-reduced-motion` blocks. **[v]**
- **Hover.** Nothing on the work cards: `transform: none` in both probe states. **[n]** — the
  probe's clip was the full viewport while the card box started at y = 830, so the pointer may
  never have been over the card. Treat "no hover" as unproven rather than established.

### willphan.com — Next.js App Router
- **Hero.** A six-up grid of full-bleed videos (7 `<video>`, all muted/looping/autoplaying), each
  with its own pause control, a two-line bio centred above, and a dotted index divider. Page height
  1597 px. **[v]**
- **Colour.** Near-black `#0d0d0d` ground, white captions, and a single `--ink` channel used at
  6 %/10 % opacity for hover surfaces plus `black/30` overlays on media. No accent hue at all. **[v]**
- **Motion.** Lenis smooth scroll (global present, `scroll-behavior: smooth`) plus a bespoke "wave"
  system: each card `<a>` carries inline `opacity` / `filter: blur()` / `will-change` and
  `data-wave-slot|frame|media` wrappers, animating from blurred to sharp on entry. Page transitions
  are CSS keyframes (`page-fade-in`, `page-fade-out`, `page-slide-up`, `rise_rise`, `orbit_turn`);
  15 animations were running at capture. **6 `@media (prefers-reduced-motion)` blocks — the only
  traced site with any.** **[v]**
- **Hover.** Small and composited cheaply: a `group-hover` arrow translates 12–16 px
  (`--tw-translate-x: 12/14/16px`) and a surface tints `rgb(var(--ink)/.06)`. No scale, no overlay,
  no colour flip. **[v]**
- **Noise.** `frames: [697,697,697,697]` — the scroll never took, so the four scroll frames are one
  frame repeated. The hover probe reported `cursor: auto` and no cursor-like element, and the card
  was captured with inline `filter: blur(0px)`, i.e. fully revealed — a before/after pair from it
  can't show the reveal curve. **[n]**

### ivankalkaev.com — Framer export + Astro island
- **Hero.** The name is rendered as a fake text selection — blue selection rectangle with two
  handles and a floating toolbar whose `Copy`, `Open CV` and `Ask Blue` are real buttons — over
  white, surrounded by floating 3D objects (orange diamond, purple gem, mouse, baseball, blue blob).
  Two canvases (520×240, 336×280). **[v]** for DOM/structure, **[1]** for the object list.
- **Colour.** White ground, near-black type, one black pill nav with a white active item; the only
  saturated colour is in the 3D objects and the blue selection/text-caret UI. Metallic artwork
  shifts hue via `ik-gold-shift`, `mail-metal`, `apple-metal-shift`. **[v]** keyframes,
  **[1]** object colours.
- **Motion.** The View Transitions API with a named `ik-hero` group: 520 ms,
  `cubic-bezier(0.2, 0, 0, 1)`, paired `ik-vt-hero-old` (fade by 40 %) / `ik-vt-hero-new` (in by
  35 %). Micro-motion overshoots rather than sliding: `ik-grip` (16 px → 0 → −2 px) and `ik-pull`
  (0 → 3 px → −1.5 px → 0). Eight `ik-selected-*` keyframes animate a nav chip into a highlighted
  "selected text" state. No reduced-motion blocks. **[v]**
- **Hover.** The email pill is the interesting one: on hover/focus the icon appears at
  `rotate(-12deg)` with `scale(1)` and unblur, the label shifts −7 px over 260 ms
  `cubic-bezier(0.16, 1, 0.3, 1)`, the pill's `padding-right` goes to 30 px, and the `.metal-bands`
  animation switches to `animation-play-state: running`. **[v]** (from CSS — no pixel diff was
  captured for this site).
- **Noise.** No `hover/*.json` here, so hover rests on rules alone. Of 25 recorded hover selectors,
  18 are Framer's framework link styles (`a.framer-text:hover`, RichText variants) — only the seven
  `.portfolio-email` / `.portfolio-pill-navigation` rules are authored. **[n]** for anything derived
  from the framework rules.

### astapable.com — Webflow
- **Hero.** One looping 3D clip of a designer at a desk (isometric, white studio), centred on white,
  with the name locked bottom-left and a floating "Paused | Vibing with Ev" control bottom-right.
  Two `<video>`, both autoplay/loop/muted. Page height ≈ 4294 px. **[v]** for elements, **[1]** for
  the scene description.
- **Colour.** White ground, near-black type, greyscale scene, one black "Ask Ev AI" pill top-right.
  The page is effectively achromatic; the scene's green cap and orange pegboard are the only hues.
  **[1]**
- **Motion.** GSAP 3.15 with `SplitText`, `ScrambleTextPlugin`, `ScrollTrigger`, `CustomEase`, plus
  a `howler-marquee` CSS loop for the client band. A fixed `.cursor` capsule (≈102×37) follows the
  pointer. No reduced-motion blocks. **[v]**
- **Hover.** Nothing usable: the only recorded rules are Webflow resets (`a:hover { outline: 0 }`,
  `.w-lightbox-inactive:hover { opacity: 0 }`) plus one generic `.utility-page-wrap:hover` border.
  Cards showed no state change in the stills. **[v]** (absence)
- **Noise.** Navigation timed out on `networkidle` after 45 s, so the capture is a partial load;
  its last scroll frame is 3394 px on a 4294 px document. Don't quote its scroll depths or any
  "bottom of page" claim. **[n]**

### thunderking-burger.com — dead
- HTTP **404**, and the served document is Wix's "this domain isn't connected" screen. Nothing to
  catalogue. Its two recorded hover rules (`.aALe9q:hover`, `.hN9f27:hover`) belong to Wix's error
  page template, **not** to any portfolio. **[n]**

---

## Captures not to cite

| Recorded as | Reality | Use instead |
| --- | --- | --- |
| `thunderking-burger-com*` | 404 Wix parking page | nothing — site is gone |
| `astapable-com.json` scroll depth | capture timed out at `networkidle`, stopped 900 px short | the top frame only |
| `gallereee-com.json`, `marckuiper-com.json` | 308 redirect stubs | the `www-*` records |
| `gallereee-com.json → webgl: true` | capability probe, 0 canvases | the `canvases` field |
| `www-jasonbergh-com-scroll-*` | page never scrolls (`[0,77,0,0]`) | `www-jasonbergh-com-wheel.jpg` + the Observer evidence |
| `bruno-simon-com-scroll-*` | page cannot scroll (`[0,0,0,0]`) | `bruno-simon-com-top.jpg`, `bruno-simon-com-keyup.jpg` |
| `willphan-com-scroll-*` | scroll didn't take (`[697,697,697,697]`) | `willphan-com-top.jpg` + the per-card inline styles |
| `hover/www-marckuiper-com-*` | clip was the viewport, card box began at y = 830 | re-probe before claiming "no hover" |
| `hover/*.json` "cursor" fields | `cursor: auto`, `cursorLike: []` everywhere | computed `cursor` on the element itself |

**Rules of thumb for the next trace.** A frame array that doesn't advance means the capture failed,
not that the site is static. A `308`/`404` record describes a redirect or an error page, never the
design. `webgl: true` is a capability check; `canvases` is usage. And a hover pair needs a
zero-input control shot 900 ms later — without it, an ambient loop makes the diff meaningless.
