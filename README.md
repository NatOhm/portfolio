# Portfolio — Natnithichai Srikolchan

Personal portfolio for a multimedia designer. Next.js App Router, TypeScript,
Tailwind CSS 4, CSS-driven motion (no animation library). All content is typed static data: no CMS, no
database, no contact backend (v1 ships a `mailto:` CTA).

## Where to start

- `docs/HANDOFF.md` — what landed most recently, the current state of the build,
  the commands that verify it, and what is still open. Read this first.
- `ARCHITECTURE.md` — the decisions behind the structure: layers, media
  pipeline, rendering model, deployment.

## Layout

| Path | What lives there |
| --- | --- |
| `src/app/` | Routes: `/`, `/work`, `/work/[slug]`, `/work/collection/[slug]`, `/about`, `/experience`, `/contact` |
| `src/components/` | One file per surface — hero shader, case-study body, archive grid, footer, compare slider |
| `src/lib/` | Content and types: `site.ts`, `content.ts`, `projects.ts`, `archive.generated.json`, `media-dimensions.ts` |
| `public/images`, `public/videos` | Deployed derivatives: project stills, posters, the homepage reel |
| `public/archive/` | The archive browser's 1,069 items — full JPEGs, 12-second preview clips, two process PDFs |
| `media-originals/` | Full-length source videos. Gitignored, never deployed |
| `scripts/` | Content check, archive builder, OG generator, UI verifier |
| `docs/` | `HANDOFF.md`, `PRODUCTION.md`, the media manifest, `trace/` reference shots |

Only `public/` ships with the site; `.next/`, `node_modules/`, `media-originals/`
and the local logs stay out of the repository.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # runs the content check, then builds
npm start
```

## Checks

| Command | What it proves |
| --- | --- |
| `npm run typecheck` | Types across `src/` |
| `npm run lint` | ESLint (next/core-web-vitals + TypeScript) |
| `npm run validate` | Project schema, every referenced media file exists and has a registered size, per-project OG image present; warns on open owner confirmations and an unset production origin. Runs automatically before `build` |
| `npm run verify:ui` | Drives the **production build** in headless Chromium: the custom cursor ring paints and restyles over `data-cursor` targets, and the mobile menu traps Tab/Shift+Tab, wraps both ways, closes on Escape and restores focus. Requires `npm run build` first |

## Content

- `src/lib/site.ts` — name, role, email, résumé path, production origin (`NEXT_PUBLIC_SITE_URL`)
- `src/lib/content.ts` — profile, capabilities, software, experience, education, socials; `openConfirmations` lists owner decisions still pending
- `src/lib/projects.ts` — the six case studies; `validateProjects()` enforces the schema
- `src/lib/media-dimensions.ts` — generated intrinsic sizes for everything in `public/`

Copy marked "confirm before launch" in `content.ts` is deliberately conservative
and will print as a warning from `npm run validate` until the owner resolves it.

## Media

`public/images` and `public/videos` hold derivatives only; originals stay in
`../Portfolio` and are never deployed. `docs/media-manifest.json` maps every
derivative back to its source.

The homepage reel (`public/videos/hero/reel.mp4`) is a 1280×720, 6.4s, 1.4MB
ping-pong encode of `videos/projects/sci-fi-environments/loop-1.mp4`, so it loops
without a cut. It only autoplays when the visitor allows motion; otherwise the
poster frame is shown and no video bytes are fetched.
