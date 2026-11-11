# Production plan

What has to be true before this site is publicly reachable, in the order it has
to happen. Written against the build as it stands (44 static routes, 7 project
pages, 26 archive collections, 1.7 GB of media in `public/`).

Numbers below are measured, not estimated, unless marked otherwise.

## 0. Where the build actually is

| thing | measured |
| --- | --- |
| routes | 44, all `○` static or `●` SSG — no route handlers, no `cookies()`/`headers()`, no ISR |
| content gate | `npm run validate` passes: 7 projects, 60 project media, 534 archive pieces in 26 collections |
| deployable media | `public/` = 1.7 GB in 1,069 archive files (964 jpg · 215 MB, 103 mp4 · 1,360 MB, 2 pdf · 98 MB) |
| oversized files | 13 files over 25 MB, 3 over 100 MB (largest 152 MB) |
| other media | `public/images` 18 MB, `public/videos` 38 MB, `public/resume.pdf` 408 KB |
| build output | `.next` 338 MB |
| repository | **not a git repository** — no history, no rollback, no review |
| production origin | unset; `site.url` falls back to the placeholder `https://natnithichai.portfolio`, and validation only warns |
| open owner decisions | 10 in `src/lib/content.ts` → `openConfirmations` |

Two of those are launch blockers on their own: 1.7 GB cannot ride inside a
deployment on any mainstream host, and an unset origin makes canonical URLs,
Open Graph and `sitemap.xml` wrong on every page.

## 1. Blockers — resolve before touching a host

**1.1 Domain and host.** Owner decision, listed as open confirmation #10.
Everything below is parameterised by it. Recommendation in §2.

**1.2 Publicity permissions.** Four open confirmations are legal, not copy:
Me Style Solution (2026), TK agricultural campaign, BlueVentureTPA, Nong Kati
Store. Publishing named client work without permission is the one risk here that
cannot be fixed after the fact. Either get a yes in writing or publish the
project as "confidential — details on request". The archive amplifies this: 26
collections of client work are already exposed at `/work/collection/*` and in the
sitemap.

**1.3 Repository.** `git init`, a `.gitignore` covering `node_modules`, `.next`,
`.next-server.log`, `*.bak`, and a first commit. Without this there is no
reviewable diff, no CI, and no rollback story. Media stays out of the history if
it grows past what GitHub comfortably takes (see §3).

**1.4 Production origin.** Set `NEXT_PUBLIC_SITE_URL` per environment, and make
validation **fail** (not warn) on a placeholder origin when
`NODE_ENV === "production"`. Same for the open confirmations once they are
resolved: keep the warning list, but add an explicit
`ALLOW_OPEN_CONFIRMATIONS=1` escape hatch for preview builds.

## 2. Hosting decision

All 44 routes are static, so three shapes are viable:

| shape | what it costs | what it buys |
| --- | --- | --- |
| **A. Next server on Vercel** | zero pipeline work; `next/image` optimizer keeps working | easiest path; media must still be external; per-file and total deployment limits |
| **B. Static export to Cloudflare Pages** | replace runtime `next/image` optimisation with pre-built responsive derivatives (`output: "export"`, `images.unoptimized`) | no server, no cold starts, free tier, instant atomic rollback, best caching; needs the derivative script |
| **C. `next start` on Render/Fly/VPS** | you own uptime, TLS renewal, Node upgrades | portability, image optimizer, but you are the ops team for a portfolio |

Recommendation: **B**, with media on R2 (or any S3-compatible bucket) behind a
CDN. Reasons: the site is 100 % static, a portfolio should not need a runtime,
and static hosting makes rollback a one-click pointer move. The only real work
is image derivatives — which is a one-off script, and it also removes the
runtime optimizer from the critical path.

Choose A instead if you want to be live this week and are willing to accept the
deployment-size limits plus a platform-specific future migration.

Under either, the media does **not** ship with the site.

## 3. Media plan (the actual work)

Current 1.7 GB is 4–10× what a portfolio should serve, and 103 mp4 previews
average 13 MB each for clips meant to be 6–15 seconds.

Targets:

| bucket | now | target | how |
| --- | --- | --- | --- |
| archive video previews | 1,360 MB / 103 files | **≤ 180 MB** (≤ 1.8 MB each) | re-encode H.264 720p, 6–10 s, CRF ~27, `-movflags +faststart`, no audio |
| archive stills | 215 MB / 964 jpg | **≤ 80 MB** | two widths (960 / 1600) as AVIF + WebP, served via `<picture>` or `srcset` |
| archive PDFs | 98 MB / 2 files | **≤ 8 MB** | downsample to 150 dpi, linearise; or replace the viewer with a page-flip image set |
| project images | 18 MB | keep | already derivatives |
| hero reel | 1.4 MB | keep | already a ping-pong encode |

Rules that should become gates, not habits:

- **No single public file over 25 MB** (Cloudflare Pages' per-file ceiling, and
  a sane limit anywhere). The three 100 MB+ exports fail this today.
- **No file served from `public/` that is not referenced** by the app or the
  archive index.
- Media lives at a **stable remote base URL** (`NEXT_PUBLIC_MEDIA_URL`), so
  `src/lib/archive.ts` and the archive covers resolve to
  `${MEDIA}/archive/<collection>/<file>` in production and `/archive/...` in
  development. Keep the local files for dev, deploy only the bucket.
- Bucket object names are the existing hashed filenames — no cache-busting
  needed; set `Cache-Control: public, max-age=31536000, immutable`.
- Bucket versioning on, so a bad replace is recoverable.

Add to `scripts/validate-content.mjs`: a size gate over every referenced public
file, and — when `NEXT_PUBLIC_MEDIA_URL` is set — a HEAD check that every remote
object exists before deploy (a broken archive link is invisible otherwise).

## 4. Configuration

| variable | environments | notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | production + preview | exact origin, no trailing slash; preview origin gets `noindex` (§7) |
| `NEXT_PUBLIC_MEDIA_URL` | production + preview | bucket + CDN host; unset locally |
| `ALLOW_OPEN_CONFIRMATIONS` | preview only | lets an unreviewed preview build with warnings |

Nothing else. There is no database, no form endpoint, no secret to leak. Do not
introduce a `NEXT_PUBLIC_*` value that is not public by definition.

`.env.example` should list the three names with empty values and one line each on
what they mean.

## 5. CI and release gates

One command per gate, all runnable locally:

```
npm run typecheck   # tsc --noEmit
npm run lint        # eslint --max-warnings=0
npm run validate    # content, media existence, dimensions, contrast, OG
npm run verify:ui   # Playwright against a production build
npm run verify:archive
npm run build
```

Add `npm run check` chaining the first three plus `build`. CI (GitHub Actions):
run `check` + `verify:ui` on every push, deploy previews on branches, production
only on `main` behind a tag or a manual approval. Keep the build artifact
(revision id + timestamp) with the deployment record.

Preview must be production-equivalent: same media base URL, same env, real
routes — otherwise the review is theatre.

## 6. SEO and metadata

- Canonical per route (the layout currently sets a site-wide `alternates.canonical: "/"`, which mislabels every child route).
- `hreflang` between `/` and `/th` in **metadata**, not only in the sitemap; each language page declares both plus `x-default`.
- Per-project OG images already exist and are validated; check each against 1200×630 (validation warns on ratio drift).
- `sitemap.xml` includes 26 collection routes at priority 0.5 — that is the right call only if the archive is public. If any collection is client-confidential, exclude it and `noindex` it.
- `robots.txt` currently allows everything. Add a `Disallow: /` rule for preview environments only.
- Add `src/app/error.tsx` (a render failure currently falls through to the platform default) and keep `not-found.tsx`.
- Decide apex vs `www` and redirect the other 301 at the host level, not in code.

## 7. Performance budget

Budgets to hold at the 75th percentile on mobile:

- LCP < 2.5 s, CLS < 0.1, INP < 200 ms, first-load JS < 200 KB gzipped on a project page.
- Hero: 24 fps, DPR capped at 1.35, loop stops off-screen and on a hidden tab (implemented). Re-measure on a real device — the local harness cannot measure GPU cost honestly.
- No video bytes before the visitor opts into motion; poster first.
- Caching: `/_next/static/*` immutable for a year (hashed), media immutable, HTML short-lived at the edge. Verify headers on the deployed origin, not locally.
- Image budget per page: gallery images load lazily below the fold; only the hero/LCP image is prioritised.

## 8. QA before launch

- Browsers: Chrome, Opera GX, Safari (iOS 15+), Firefox. GX specifically with its Limiter off and hardware acceleration on.
- Keyboard-only pass on every route, including the mobile menu trap and the compare slider.
- Screen reader pass on one project page and `/th`.
- `prefers-reduced-motion` pass: hero static, gallery unfiltered, no count-up.
- Forced-colors and 200 % zoom at 320 px width.
- Throttled 3G load of the heaviest project page.
- 404 and a deliberately broken media URL: poster and caption must still carry the page.
- `mailto:` and résumé download verified from a phone.

## 9. Operations after launch

- **Monitoring:** uptime check on `/` and one project route; a privacy-safe vitals collector; error alerts (any provider) — one channel you actually read.
- **Rollback drill:** deploy, roll back to the previous version, confirm it works, *before* launch day.
- **Backups:** repository + bucket versioning. Content is code; media is objects. There is nothing else to back up.
- **Monthly:** contact links, résumé file, broken media, and the open-confirmation list.
- **Every new project:** follow the media pipeline, run the gates, review the preview, then publish.

## 10. Launch checklist, in order

1. Domain chosen; host account ready.
2. Four client-permission confirmations resolved (or projects marked confidential).
3. `git init` + `.gitignore` + first commit.
4. Media re-encoded and uploaded to the bucket; size gate added; validator green.
5. `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_MEDIA_URL` set for preview and production.
6. Validation hardened: placeholder origin fails production builds.
7. Canonical/hreflang/sitemap/robots pass; `error.tsx` added; preview `noindex`.
8. CI green on `main`; preview deployed and reviewed on a phone.
9. Performance pass on a real device at 4G.
10. Production deploy, smoke test every route, then flip the DNS.
11. Uptime monitor + vitals live; rollback drill completed.
12. Record revision, date, and the remaining open confirmations in `docs/HANDOFF.md`.
