/**
 * Build-time content + media gate (ARCHITECTURE.md §10.2).
 *
 * Runs on Node's native TypeScript stripping, so it reads the same typed
 * content layer the app renders — no duplicated data, no extra dependency.
 *
 * Hard failures (exit 1): project schema violations, media referenced but
 * missing from public/, media missing from the dimension registry, missing
 * per-project OG image.
 *
 * Launch warnings (exit 0): owner confirmations still open in content.ts,
 * unresolved "to be confirmed" copy, unset production origin, OG images that
 * are far from the 1.91:1 ratio social cards expect.
 */
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { projects, validateProjects } from "../src/lib/projects.ts";
import { mediaDimensions } from "../src/lib/media-dimensions.ts";
import { archiveCollections } from "../src/lib/archive-collections.ts";
import { experience, education, openConfirmations } from "../src/lib/content.ts";
import { site } from "../src/lib/site.ts";

const publicDir = fileURLToPath(new URL("../public", import.meta.url));
const errors = [];
const warnings = [];

const mediaSrcs = (project) => {
  const items = [project.cover, project.hero, ...(project.gallery ?? [])];
  return items.flatMap((m) => [m.src, m.poster].filter(Boolean));
};

// 1. Typed project schema rules that the app enforces at runtime.
const validation = validateProjects({ failOnViolation: false });
if (!validation.valid) errors.push(...validation.problems);

// 2. Every referenced media file must exist, and have a registered size.
const allMedia = new Set(projects.flatMap(mediaSrcs));
for (const src of allMedia) {
  const file = path.join(publicDir, src);
  if (!existsSync(file)) {
    errors.push(`missing media file: ${src}`);
    continue;
  }
  if (!mediaDimensions[src]) errors.push(`media missing from dimension registry: ${src}`);
}

// 3. Text tokens must stay legible on every surface they are painted on.
//    Keep the palette in sync with src/app/globals.css.
//
//    Project accents are no longer text: each is a decorative swatch whose
//    meaning is repeated in the adjacent label, so WCAG 1.4.11 (3:1 for
//    graphical objects) does not apply to them. The palette below is what the
//    design system actually sets type in.
const CANVAS = "#EDE6DC";
const SURFACE = "#F6F1E9";
const WELL = "#E1D9CC";
const TEXT_PAIRS = [
  { name: "ink", value: "#241F1A", on: [CANVAS, SURFACE, WELL] },
  { name: "muted", value: "#645A4F", on: [CANVAS, SURFACE, WELL] },
  { name: "faint", value: "#6B6155", on: [CANVAS, SURFACE] },
  { name: "accent", value: "#A63D1B", on: [CANVAS, SURFACE, WELL] },
  { name: "on-accent", value: "#FBF7F0", on: ["#A63D1B", "#873114"] },
];
const MIN_CONTRAST = 4.5;
const channel = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
const luminance = (hex) => {
  const [r, g, b] = [0, 1, 2].map((i) => {
    const c = channel(hex, i);
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

for (const token of TEXT_PAIRS) {
  for (const background of token.on) {
    const ratio = contrast(token.value, background);
    if (ratio < MIN_CONTRAST) {
      errors.push(
        `text token --color-${token.name} (${token.value}) on ${background} is ${ratio.toFixed(2)}:1; needs ${MIN_CONTRAST}:1`,
      );
    }
  }
}


// 3b. The archive must describe every collection, with media that exists.
const archiveJson = JSON.parse(
  readFileSync(new URL("../src/lib/archive.generated.json", import.meta.url), "utf8"),
);
const archiveIds = new Set(archiveCollections.map((c) => c.id));
const archiveSeen = new Set();
let archivePieces = 0;
for (const collection of archiveJson.collections ?? []) {
  if (!archiveIds.has(collection.id)) {
    errors.push(`archive manifest has an unknown collection: ${collection.id}`);
    continue;
  }
  archiveSeen.add(collection.id);
  if (!collection.items?.length) errors.push(`archive collection is empty: ${collection.id}`);
  for (const item of collection.items ?? []) {
    archivePieces++;
    for (const src of [item.src, item.thumb, item.poster, item.download].filter(Boolean)) {
      if (!existsSync(path.join(publicDir, src))) {
        errors.push(`archive media missing from public/: ${src}`);
      }
    }
    if (!item.width || !item.height) errors.push(`archive item has no size: ${item.src}`);
    if (!item.alt) errors.push(`archive item has no alt text: ${item.src}`);
  }
}
for (const id of archiveIds) {
  if (!archiveSeen.has(id)) errors.push(`archive collection not built yet: ${id} (run npm run archive)`);
}
const counted = archiveJson.totals
  ? archiveJson.totals.images + archiveJson.totals.videos + archiveJson.totals.documents
  : -1;
if (counted !== archivePieces) {
  errors.push(`archive totals say ${counted} pieces but ${archivePieces} items are listed`);
}

// 4. Per-project social card.
for (const project of projects) {
  const og = `/images/og/${project.slug}.jpg`;
  if (!existsSync(path.join(publicDir, og))) {
    errors.push(`missing Open Graph image: ${og}`);
    continue;
  }
  const dims = mediaDimensions[og];
  if (dims) {
    const ratio = dims.width / dims.height;
    if (Math.abs(ratio - 1200 / 630) > 0.08) {
      warnings.push(
        `OG image ${og} is ${dims.width}x${dims.height} (${ratio.toFixed(2)}:1); social cards expect 1.91:1`,
      );
    }
  }
}

// 4. Copy that still carries owner confirmations.
const unconfirmed = [
  ...experience
    .filter((e) => e.unconfirmedDetail)
    .map((e) => `experience — ${e.position} (${e.unconfirmedDetail})`),
  ...education
    .filter((e) => e.unconfirmedDetail)
    .map((e) => `education — ${e.school} (${e.unconfirmedDetail})`),
];
if (unconfirmed.length) {
  warnings.push(`unconfirmed entries still rendered on the site:\n    - ${unconfirmed.join("\n    - ")}`);
}
if (openConfirmations.length) {
  warnings.push(`${openConfirmations.length} owner decisions still open in content.ts`);
}

// 5. Production origin.
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  warnings.push(
    `NEXT_PUBLIC_SITE_URL is unset — canonical URLs, sitemap and metadata fall back to ${site.url}`,
  );
}

const report = (label, list) => {
  if (!list.length) return;
  console.log(`${label} (${list.length})`);
  for (const item of list) console.log(`  ${label === "Errors" ? "✗" : "!"} ${item}`);
};

console.log(
  `Content check — ${projects.length} projects, ${allMedia.size} media files, ${archivePieces} archive pieces in ${archiveSeen.size} collections`,
);
report("Errors", errors);
report("Warnings", warnings);

if (errors.length) {
  console.log("\nContent check failed.");
  process.exit(1);
}
console.log("Content check passed.");
