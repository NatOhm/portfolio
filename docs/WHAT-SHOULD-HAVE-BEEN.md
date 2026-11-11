# The Portfolio, Re-decided — Design & Architecture Plan (v2)

**Owner:** Natnithichai Srikolchan · **Target:** `Port-full/Web` · **Status:** proposal
**Supersedes:** the "cutting room / dark cinematic" direction in v1 of this file. On the owner's instruction the old design is retired, not polished.

---

## 0. Decision log

| Decision | Outcome |
| --- | --- |
| Direction | **Retired:** graphite + citron cinematic editorial. |
| New direction | **"Soft Studio"** — a light, moulded, tactile interface; claymorphism in the chrome, matte frames for the work. |
| Codebase | Keep `Port-full/Web`. A fresh *design*, not a fifth app: the content layer, media pipeline and checks are the only things four rebuilds have actually produced. |
| Motion | CSS only, physical press feedback, no library. |
| Expo skill | Not applicable — no React Native/Expo in this project. Its frequency gate is applied to web motion instead. |

---

## 1. What the folder actually contains

| Location | What it is | Verdict |
| --- | --- | --- |
| `Port-full/Web` | Next.js 16 App Router, 6 case studies, typed content, validator, Playwright check, 60 media derivatives | **The build target.** |
| `Port-full/Web-v2` | Bricolage/DM Sans rebuild, no checks | Archive. |
| `portfolio-homepage` | `create-next-app` default | Archive. |
| `portfolio-scaffold` | MDX brutalist attempt | Archive. |
| `Port-full/Portfolio` | 700+ originals, 5 disciplines | Source library, never deployed. |

**Why it kept getting rebuilt:** direction was re-decided four times instead of finished; 11 content confirmations were never resolved (the site still prints "Pending confirmation: 2025 employer name" at `AboutBody.tsx:107` and `ExperienceBody.tsx:45`); and no build had a signature — every one polished the default dark-portfolio grammar.

---

## 2. The new thesis

> **The portfolio is a studio bench.** Work is laid out as prints on a warm, soft surface. The reel plays inside a moulded monitor. Controls are physical: buttons press in, tabs pull like drawers, cards lift a few millimetres when you reach for them.

This is claymorphism used the way a product designer would use it: **soft, warm, and structural — never candy.** The interface is quiet and light; the only saturation comes from the work itself (neon 3D, gold fireworks, rice-field green), which is exactly why a light canvas beats a dark one: dark stills read as prints, bright graphics stay bright, and no acid accent competes with either.

---

## 3. Design language

### 3.1 Colour — porcelain, iron, one fired accent

| Token | Value | Job | Never |
| --- | --- | --- | --- |
| `canvas` | `#EDE6DC` | Page surface (warm porcelain) | Gradients, photos |
| `surface` | `#F6F1E9` | Raised clay (cards, header, monitor) | Body text background |
| `well` | `#E1D9CC` | Pressed/inset areas, input wells | Large pages |
| `ink` | `#241F1A` | Text, icons, embossed marks | — |
| `muted` | `#645A4F` | Secondary text (5.4:1 canvas, 4.8:1 well) | — |
| `faint` | `#6B6155` | Meta labels on canvas/surface only (4.9:1) | Never on `well` |
| `accent` | `#A63D1B` | Action, active state, focus (5.1:1 canvas) | Decorative fills; ink text on it |
| `project.accent` | per project | Case-study meta only | Buttons, links |

Measured: `ink` 13.2:1, `muted` 5.4:1, `faint` 4.9:1, `accent` 5.1:1 on canvas. Text on the accent clay button must be `surface` (5.65:1) — **ink on accent is 2.57:1 and is forbidden**.

Rules: text sits on flat `canvas` or `surface`, never on a shaded clay gradient. Shadow is depth, never the only signal. Every text/background pair ≥4.5:1 — extend `validate-content.mjs` to check each token on both surfaces, not just project accents.

### 3.2 Depth — three levels, no more

```
raised    8px 8px 18px rgb(92 76 58 / .18)
         -8px -8px 18px rgb(255 255 255 / .85)
         inset 0 1px 0 rgb(255 255 255 / .7)

lifted    14px 16px 30px rgb(92 76 58 / .22)
         -10px -10px 24px rgb(255 255 255 / .9)

pressed   inset 5px 5px 12px rgb(92 76 58 / .22)
         inset -5px -5px 12px rgb(255 255 255 / .85)
```

Radii: 18 (controls), 30 (cards), 42 (monitor, slabs). Radii never go below 14 — soft is the language. No glass, no blur panels, no coloured glows behind photographs.

### 3.3 Typography — professional soft, not toy

| Voice | Face | Use |
| --- | --- | --- |
| Display | **Bricolage Grotesque** variable (600/700, opsz 96) | Names, project titles, section heads |
| Reading | **Inter** 400/500 | All prose and captions |
| Instrument | **Space Mono** 400 | Timecode, frame numbers, labels ≤4 words |

Ramp (locked tokens, no arbitrary `text-[…]`):

| Token | Size | Line | Tracking | Case |
| --- | --- | --- | --- | --- |
| `display-xl` | clamp(3rem, 8vw, 7.5rem) | 0.92 | −0.035em | Sentence case |
| `display-l` | clamp(2.25rem, 4.5vw, 3.75rem) | 0.98 | −0.03em | Sentence |
| `title` | 1.5rem | 1.15 | −0.02em | Sentence |
| `lede` | clamp(1.125rem, 1.5vw, 1.375rem) | 1.5 | 0 | Sentence |
| `body` | 1rem | 1.7 | 0 | Sentence |
| `meta` | 0.6875rem | 1.2 | 0.12em | Uppercase |

Sentence case is default; uppercase is a deliberate exception. No uppercase Thai, ever (add IBM Plex Sans Thai only if Thai copy is published; never apply tracking to it).

### 3.4 Signature components

| Component | Behaviour | Why it reads as clay, not a theme |
| --- | --- | --- |
| **The Monitor** (home + case-study hero) | Moulded bezel, inset screen, physical transport row: play/pause, scrub well, timecode. Presses in 120ms. | It is one object, with a bezel thickness, a well and feet — not a rounded div. |
| **Print** (project card) | Photo on a `surface` mat with a 10px paper margin and a caption strip below the rule. Lifts 4px and gains shadow on hover. | The mat physically separates the work from the page. |
| **Drawer tab** (work filters) | Tabs sit in a well; the active tab is pressed inward and its label goes ink. | State is shape + colour, not shadow alone. |
| **Index card** (experience) | Stacked cards, 2px offset, corner radius 22, punched-hole detail optional. | Physical stacking rather than dividing rules. |
| **Slab** (contact, about) | Full-width clay block with an inset well for the CTA. | One heavy object per page, maximum. |

Use at most **two** of these per viewport. Clay is seasoning.

---

## 4. Motion

| Token | Value | Use |
| --- | --- | --- |
| `--press` | 120ms `cubic-bezier(.2,.8,.2,1)` | button/card press-in |
| `--release` | 220ms `cubic-bezier(.34,1.4,.64,1)` | chip pop-out after select |
| `--reveal` | 300ms `cubic-bezier(.23,1,.32,1)` | section reveal, translate 8px + fade |
| `--page` | 400ms | route change: fade + 6px rise |

Rules: transform and opacity only; no parallax; no scroll-jacking; one looping element maximum (the reel) and it is always pausable; `prefers-reduced-motion` renders final state and drops transforms. Hover never moves layout. Clay shadows may grow on hover, but the press must also change colour — depth alone is invisible to low-vision users.

---

## 5. Page design

### Home — a bench, not a deck

```
┌───────────────────────────────────────────────────────────────┐
│ [NATNITHICHAI]     Work  About  Experience  Contact  [Résumé] │  clay rail
├───────────────────────────────────────────────────────────────┤
│  Multimedia designer — Khon Kaen, TH                          │
│  Stories in motion.                        ┌───────────────┐  │
│  Brands with character.                    │  ▓▓ REEL ▓▓▓  │  │  the Monitor
│  one-sentence claim                        │  ▓▓▓▓▓▓▓▓▓▓▓  │  │
│  [ See the work ]  [ Get in touch ]        └───────────────┘  │
│                                            ▶  00:00 ──●─ 00:06│
├───────────────────────────────────────────────────────────────┤
│ Selected work — 3 Prints on the bench, mixed sizes            │
├───────────────────────────────────────────────────────────────┤
│ Capabilities as drawer rows (4), one open at a time           │
├───────────────────────────────────────────────────────────────┤
│ About slab: portrait plate + 2 paragraphs + résumé            │
├───────────────────────────────────────────────────────────────┤
│ Contact slab: fired-clay button, location, availability       │
└───────────────────────────────────────────────────────────────┘
```

The monitor is the only 3D-ish object above the fold; everything else is flat type on porcelain.

### `/work` — the bench, filtered

Drawer tabs (`All · Video · Motion · 3D · Graphic · Web`), URL state (`?discipline=3d`), live count announced politely, then Prints of mixed size with a hairline under each caption. No cards-in-cards.

### `/work/[slug]` — case study

1. Back link → 2. clay slate header: title, context, disciplines, year → 3. Monitor with hero media + transport → 4. sticky meta well (role, tools, deliverables, runtime, credits) → 5. narrative as numbered sections on canvas (no boxes) → 6. "In numbers" as a ledger → 7. gallery as Prints → 8. prev/next as two clay slabs.

### `/about` — the person

Portrait plate, first-person intro, approach, software chips, education card, résumé. No confirmation placeholders in output.

### `/experience` — index cards

One card per role: year, role, organisation, one-line scope, ≤3 responsibilities, discipline chips.

### `/contact` — one heavy object

Availability, big fired-clay email button, location, socials. v1 stays `mailto:`.

### 404

A single line on porcelain, one pressed button back.

---

## 6. Architecture

### 6.1 Keep

Next.js App Router + TypeScript · static typed content · derivatives only in `public/` · `validate-content.mjs` build gate · `verify-interactions.mjs` · per-project OG images · 1440px grid.

### 6.2 Fix — server/client boundary

16 of 20 components are `"use client"`, including whole page bodies. Keep client only where interaction lives:

| Client leaf | Server |
| --- | --- |
| `Navbar`, `MobileMenu` | `Hero` (parallax removed) |
| `CustomCursor` (optional in new design — see §8) | `ProjectCard`/`Print`, `SelectedWork`, `Capabilities` |
| `Monitor` + `Transport` | `AboutPreview`, `ContactCTA`, `Footer` |
| `VideoPreview` | `Media`, `MediaGallery` |
| `WorkGrid` (URL-synced filter) | `CaseStudyBody`, `AboutBody`, `ExperienceBody`, `ContactBody` |
| `Reveal` | all `page.tsx` |

### 6.3 Content model additions

```ts
media.duration?: string         // "00:06" — real timecode, no fake numbers
media.poster: string            // required on every video
project.order?: number          // archive position, independent of featuredOrder
project.captionLocale?: "th" | "en"
```

### 6.4 Media

Originals in `Portfolio/`, derivatives in `public/`, manifest maps each file back. Video: poster + duration + `preload="none"` + `playsInline` + pause control. Hero reel ≤2MB, ≤10s, ping-pong loop. Stills 1600–2400px, AVIF/WebP; contact-sheet thumbs 640px. **No coloured shadow or tint behind a photograph** — clay stops at the frame.

### 6.5 Archive, don't delete

`Port-full/_archive/`: `Web-v2/`, `../portfolio-homepage/`, `../portfolio-scaffold/`, `.smoke*.log`, `.cloud-attachments/`, root duplicate PDFs. One app, one README, one token file.

---

## 7. Project #7 — Nongkatistore

Seventh case study; the range proof beyond media production.

- Context: `client` or `personal` (owner decision) · Disciplines: `Graphic Design` + new `Web`
- Media: cover (desktop storefront), hero (60–90s capture), 6–8 gallery frames (PLP, PDP, cart, checkout, admin, packaging), OG
- Copy: what it sells, the one design decision that made it work, one real number
- Placement: after Pattaya Guide, so the archive alternates 3D → campaign → graphics → commerce → e-learning → club → personal
- Risk: a shop you built reads as an ad. Frame it as a system: what the owner runs without a developer.

---

## 8. Accessibility for a soft interface

Clay + neumorphism fails accessibility when state is encoded only in shadow. Non-negotiable:

| Requirement | Rule in this design |
| --- | --- |
| 1.4.3 Contrast | Every text token ≥4.5:1 on `canvas` *and* `surface`; validator checks both |
| 1.4.11 Non-text contrast | Inset wells and borders ≥3:1 against their surrounding fill |
| 2.4.7 Focus | 2px `accent` **and** 2px offset, on clay too; never rely on a shadow |
| 2.4.11 Focus not obscured | `scroll-margin-top: 5rem` on `#main` and heading anchors under the fixed rail |
| 2.5.8 Target size | All clay controls ≥44px on coarse pointers, ≥32px on fine |
| 3.2.3 Consistent nav | Active route needs `aria-current="page"` **plus** pressed shape + ink label |
| 4.1.3 Status | Filtered count in `aria-live="polite"` |
| 2.2.2 Pause | The Monitor's transport is the pause control; looping previews pause off-screen |
| 2.3.1 Motion | Reduced motion = no lift, no press scale, no reveal; reel shows poster |
| No-JS | All content visible; only the reel and filters need JS |

Custom cursor: **drop it.** A soft, physical interface already gives hover feedback; a ring adds a second pointer and a failure mode. Keep the native cursor.

---

## 9. Web Interface Guidelines audit (unchanged findings, still real)

- `src/app/globals.css` — no `scroll-margin-top`; fixed header can cover focused content.
- `src/components/Navbar.tsx:59` — no `aria-current` / active route state.
- `src/components/WorkGrid.tsx:13` — filter in `useState`, not the URL.
- `src/components/Hero.tsx:66` — headline coloured by word index; move emphasis into content.
- `src/components/AboutBody.tsx:107`, `ExperienceBody.tsx:45` — "Pending confirmation" rendered to visitors.
- `src/components/MobileMenu.tsx:80` — overlay lacks `overscroll-behavior: contain`.
- `src/components/ContactCTA.tsx`, `MobileMenu.tsx` — straight apostrophes in copy.
- `Media.tsx` — decorative videos `aria-hidden` ✓; keep `aria-label` on meaningful clips.
- No `transition: all`, no `outline-none`, images have dimensions ✓.

---

## 10. Build order

| Phase | Work | Done when |
| --- | --- | --- |
| **0 — Truth** | Resolve the 11 `openConfirmations`; decide Nongkatistore context; remove confirmation strings from output; set `NEXT_PUBLIC_SITE_URL` | `npm run validate` = 0 errors, 0 warnings |
| **1 — Tokens + shell** | Three-layer tokens, type ramp, depth scale, clay rail header, pressed states, `scroll-margin`, overscroll, active nav | No arbitrary sizes in shell; keyboard + 200% zoom pass |
| **2 — Monitor + home** | Transport, reel, three Prints, drawer capabilities, about slab, contact slab | Poster-only under reduced motion; no CLS; 44px targets |
| **3 — Archive + case studies** | Bench grid with URL filters, slate header, narrative, gallery Prints, prev/next | Filter survives reload/back; 7 projects |
| **4 — Story pages** | About, Experience, Contact, 404 as server components | Zero client JS beyond shell |
| **5 — QA + launch** | Axe, keyboard, zoom, 320px, Lighthouse, OG, deploy | AA documented; LCP ≤2.5s on 4G; all checks green |

~5 focus blocks. No framework change, no new animation library.

---

## 11. Non-goals

No CMS, no backend, no dark/light toggle, no animation library, no 3D/WebGL hero, no glassmorphism, no second codebase, no Expo app.

---

## 12. Owner decisions

1. The 11 open confirmations (employer name, education wording, client permissions, availability, domain).
2. Nongkatistore: own shop or client build? Stack? One publishable number?
3. Portrait: real photo, BTS still, or no portrait?
4. Thai captions alongside English, or English only?
5. Confirm the fired-clay accent `#A63D1B` against the porcelain canvas, or keep it more neutral (ink-only UI)?

---

## 13. Definition of done

- One app, one token file, one README; the other builds archived.
- Seven case studies with real media, durations and credits.
- No confirmation placeholders in rendered output.
- `typecheck`, `lint`, `validate` (0 warnings), `build`, `verify:ui` green.
- Keyboard-only, 200% zoom, 320px, reduced-motion and one screen-reader pass documented.
- First viewport: name, claim, moving work on the Monitor — nothing else competing.
