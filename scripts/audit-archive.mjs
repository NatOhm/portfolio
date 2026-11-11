/**
 * Coverage audit: every renderable file in the source library must appear in
 * the archive exactly once, and every archive item must point at a real source.
 * Non-renderable working files are printed with their reason so nothing is
 * silently dropped.
 *
 *   npm run verify:archive
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { archiveCollections } from "../src/lib/archive-collections.ts";

const ROOT = process.env.ARCHIVE_SOURCE ?? "E:/งานนะจ๊ะ/Port/Port-full/Portfolio";
const projectDir = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(
  readFileSync(path.join(projectDir, "src", "lib", "archive.generated.json"), "utf8"),
);

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".tif", ".tiff", ".bmp"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".m4v", ".mkv", ".avi", ".webm"]);
const DOC_EXT = new Set([".pdf"]);
const IGNORED = new Set(["desktop.ini", "thumbs.db", ".ds_store"]);

const kindOf = (file) => {
  const ext = path.extname(file).toLowerCase();
  if (IMAGE_EXT.has(ext)) return "image";
  if (VIDEO_EXT.has(ext)) return "video";
  if (DOC_EXT.has(ext)) return "document";
  return "skip";
};

const walk = (dir, unreadable) => {
  const found = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    unreadable.push({ path: dir, reason: String(error.code ?? error.message) });
    return found;
  }
  for (const entry of entries) {
    if (IGNORED.has(entry.name.toLowerCase()) || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full, unreadable));
    else if (entry.isFile()) found.push(full);
    else unreadable.push({ path: full, reason: "not a regular file" });
  }
  return found;
};

const errors = [];
const notes = [];
let expected = 0;
let mapped = 0;

const byId = new Map((manifest.collections ?? []).map((c) => [c.id, c]));

for (const collection of archiveCollections) {
  const generated = byId.get(collection.id);
  if (!generated) {
    errors.push(`collection not built: ${collection.id}`);
    continue;
  }
  const sources = new Map();
  const unreadable = [];
  const skipped = {};
  for (const folder of [collection.folder, ...(collection.extraFolders ?? [])]) {
    const dir = path.resolve(ROOT, folder);
    if (!existsSync(dir)) {
      errors.push(`source folder missing: ${folder}`);
      continue;
    }
    for (const file of walk(dir, unreadable)) {
      const kind = kindOf(file);
      const rel = path.relative(ROOT, file);
      if (kind === "skip") {
        const ext = path.extname(file).toLowerCase() || "(none)";
        skipped[ext] = (skipped[ext] ?? 0) + 1;
        continue;
      }
      expected++;
      sources.set(rel.replaceAll(path.sep, "/"), kind);
    }
  }

  const seen = new Set();
  for (const item of generated.items) {
    const key = item.source.replaceAll(path.sep, "/");
    if (seen.has(key)) errors.push(`${collection.id}: source listed twice — ${key}`);
    seen.add(key);
    if (!sources.has(key)) errors.push(`${collection.id}: not in the source library — ${key}`);
    else mapped++;
  }
  for (const [source, kind] of sources) {
    if (!seen.has(source)) errors.push(`${collection.id}: missing from the archive — ${kind} ${source}`);
  }
  for (const entry of unreadable) {
    errors.push(`${collection.id}: unreadable source — ${entry.path} (${entry.reason})`);
  }
  const skippedCount = Object.values(skipped).reduce((a, b) => a + b, 0);
  if (skippedCount) {
    notes.push(
      `${collection.id}: ${skippedCount} non-renderable file(s) not shown — ${Object.entries(skipped)
        .map(([ext, n]) => `${n}×${ext}`)
        .join(", ")}`,
    );
  }
}

const extraCollections = [...byId.keys()].filter(
  (id) => !archiveCollections.some((c) => c.id === id),
);
for (const id of extraCollections) errors.push(`manifest has an unknown collection: ${id}`);

const totals = manifest.totals ?? { images: 0, videos: 0, documents: 0 };
const counted = totals.images + totals.videos + totals.documents;

console.log(
  `Archive coverage — ${mapped}/${expected} renderable source files mapped · ${counted} items in ${byId.size} collections`,
);
console.log(
  `  ${totals.images} images · ${totals.videos} videos · ${totals.documents} documents · ${(manifest.totals?.duration / 60).toFixed(0)} min runtime`,
);
if (notes.length) {
  console.log(`\nNot shown (${notes.length})`);
  for (const note of notes) console.log(`  · ${note}`);
}
if (errors.length) {
  console.log(`\nErrors (${errors.length})`);
  for (const error of errors) console.log(`  ✗ ${error}`);
  process.exit(1);
}
if (mapped !== expected) {
  console.log(`\n${expected - mapped} source file(s) unaccounted for.`);
  process.exit(1);
}
console.log("\nArchive coverage passed — every renderable file appears exactly once.");
