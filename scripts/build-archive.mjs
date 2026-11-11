/**
 * Complete-archive derivative builder.
 *
 * Walks the source library, writes web derivatives into public/archive/ and
 * records one item per finished file in src/lib/archive.generated.json.
 * Originals are never modified or moved. Re-running is cheap: a derivative
 * newer than its source is reused.
 *
 *   node scripts/build-archive.mjs            # everything
 *   node scripts/build-archive.mjs tk-reels   # one collection id
 *
 * Requires ffmpeg/ffprobe on PATH; PDF covers need python + pymupdf.
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  renameSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { archiveCollections } from "../src/lib/archive-collections.ts";
import { writeCourseCover } from "./lib/course-cover.mjs";

const ROOT = process.env.ARCHIVE_SOURCE ?? "E:/งานนะจ๊ะ/Port/Port-full/Portfolio";
const projectDir = fileURLToPath(new URL("..", import.meta.url));
const OUT_DIR = path.join(projectDir, "public", "archive");
const JSON_OUT = path.join(projectDir, "src", "lib", "archive.generated.json");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".tif", ".tiff", ".bmp"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".m4v", ".mkv", ".avi", ".webm"]);
const DOC_EXT = new Set([".pdf"]);
const IGNORED = new Set(["desktop.ini", "thumbs.db", ".ds_store"]);

const only = process.argv[2];

const sha = (text) => createHash("sha1").update(text).digest("hex").slice(0, 10);
function walk(dir) {
  const found = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED.has(entry.name.toLowerCase()) || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full));
    else if (entry.isFile()) found.push(full);
  }
  return found;
}

function kindOf(file) {
  const ext = path.extname(file).toLowerCase();
  if (IMAGE_EXT.has(ext)) return "image";
  if (VIDEO_EXT.has(ext)) return "video";
  if (DOC_EXT.has(ext)) return "document";
  return "skip";
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Windows can briefly lock a freshly written file (indexer, AV); retry reads. */
async function retryAsync(fn, attempts = 6) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      last = error;
      await sleep(400 * (i + 1));
    }
  }
  throw last;
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.setEncoding("utf8").on("data", (chunk) => { out += chunk; });
    child.stderr.setEncoding("utf8").on("data", (chunk) => { err += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(out);
      else reject(new Error(`${path.basename(cmd)} exited ${code}: ${err.trim().split("\n").slice(-2).join(" ")}`));
    });
  });
}

const ffmpeg = (args) => retryAsync(() => run("ffmpeg", ["-v", "error", "-y", ...args]));

async function probe(file) {
  const out = (
    await retryAsync(() =>
      run("ffprobe", [
        "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height", "-of", "csv=p=0", file,
      ]),
    )
  ).trim();
  const [w, h] = out.split(",").map(Number);
  return { width: w || 0, height: h || 0 };
}

async function duration(file) {
  const out = (
    await retryAsync(() => run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]))
  ).trim();
  const value = Number.parseFloat(out);
  return Number.isFinite(value) ? Math.round(value * 10) / 10 : undefined;
}

function mtime(file) {
  return statSync(file).mtimeMs;
}

/** "final_front" -> "final front"; camera dumps fall back to a positional label. */
function label(file) {
  const base = path
    .basename(file, path.extname(file))
    .replace(/_+$/, "")
    .replace(/\s*\(\d+\)$/, "")
    .trim();
  if (/^[0-9_\-\s]+$/.test(base)) return "";
  return base.replace(/_+/g, " ").replace(/\s+/g, " ").trim();
}

/** Reusable only when the derivative exists, is newer, and still decodes. */
async function fresh(target, source, kind = "image") {
  if (!existsSync(target) || mtime(target) < mtime(source) - 1000) return false;
  try {
    if (kind === "image") await probe(target);
    else await duration(target);
    return true;
  } catch {
    return false; // interrupted earlier run left a partial file
  }
}

/**
 * Encode beside the target, then move it into place: ffmpeg never writes the
 * final path, so an antivirus or indexer lock cannot corrupt a good derivative
 * and a partial file never masquerades as finished.
 */
async function encode(target, args) {
  const ext = path.extname(target);
  const partial = `${target.slice(0, -ext.length)}.part${ext}`;
  rmSync(partial, { force: true });
  try {
    await ffmpeg([...args.slice(0, -1), partial]);
    await retryAsync(() => renameSync(partial, target));
  } catch (error) {
    rmSync(partial, { force: true });
    throw error;
  }
}

async function buildImage(outBase, source) {
  const full = `${outBase}-full.jpg`;
  const thumb = `${outBase}-thumb.jpg`;
  if (!(await fresh(full, source))) {
    await encode(full, ["-i", source, "-vf", "scale='min(1600,iw)':-2", "-frames:v", "1", "-q:v", "3", full]);
  }
  if (!(await fresh(thumb, source))) {
    await encode(thumb, ["-i", source, "-vf", "scale='min(480,iw)':-2", "-frames:v", "1", "-q:v", "4", thumb]);
  }
  return { dims: await probe(full) };
}

async function buildVideo(outBase, source, previewSeconds) {
  const video = `${outBase}.mp4`;
  const poster = `${outBase}-poster.jpg`;
  const sourceSeconds = await duration(source);
  // Client course material is published as an excerpt, not the whole lesson:
  // `previewSeconds` takes a slice starting a tenth of the way in, never later
  // than two minutes, so the cut lands inside the teaching material.
  const excerptStart = previewSeconds
    ? Math.min(Math.max(Math.round((sourceSeconds ?? 0) * 0.1), 20), 120)
    : 0;
  const excerpt = previewSeconds
    ? ["-ss", String(excerptStart), "-t", String(previewSeconds)]
    : [];
  // Long-form (lectures, interviews, uncut exports) carries most of the minutes,
  // so it is encoded at 960px and mono audio; short-form keeps its 1280px frame.
  const longForm = (previewSeconds ?? sourceSeconds ?? 0) > 300;
  const vf = longForm ? "scale='min(960,iw)':-2" : "scale='min(1280,iw)':-2";
  const crf = longForm ? "32" : "30";
  const audioBitrate = longForm ? "48k" : "96k";
  const audioChannels = longForm ? "1" : "2";
  if (process.env.ARCHIVE_FORCE_VIDEO === "1" || !(await fresh(video, source, "video"))) {
    await encode(video, [
      ...excerpt,
      "-i", source,
      "-vf", vf,
      "-c:v", "libx264", "-preset", "veryfast", "-crf", crf,
      "-threads", "3",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", audioBitrate, "-ac", audioChannels,
      "-movflags", "+faststart",
      video,
    ]);
  }
  const seconds = await duration(video);
  if (!(await fresh(poster, video))) {
    const seek = seconds && seconds > 4 ? 2 : 0;
    await encode(poster, ["-ss", String(seek), "-i", video, "-frames:v", "1", "-q:v", "3", poster]);
  }
  return { dims: await probe(video), seconds };
}

async function buildDocument(outBase, source) {
  const full = `${outBase}-full.jpg`;
  if (!(await fresh(full, source))) {
    const png = `${outBase}-page.png`;
    await retryAsync(() =>
      run("python", [path.join(projectDir, "scripts", "pdf-cover.py"), source, png, "1600"]),
    );
    await encode(full, ["-i", png, "-frames:v", "1", "-q:v", "3", full]);
    rmSync(png, { force: true });
  }
  const download = `${outBase}.pdf`;
  if (!(await fresh(download, source))) await retryAsync(() => copyFileSync(source, download));
  return { dims: await probe(full), download: `/archive/${path.basename(path.dirname(outBase))}/${path.basename(download)}` };
}

function assertRoot() {
  if (!existsSync(ROOT)) {
    console.error(`Source library not found: ${ROOT}\nSet ARCHIVE_SOURCE to the Portfolio folder.`);
    process.exit(1);
  }
}

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

function collectionEntries(collection) {
  const dirs = [collection.folder, ...(collection.extraFolders ?? [])].map((folder) =>
    path.resolve(ROOT, folder),
  );
  const entries = [];
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      console.warn(`  ! missing folder: ${dir}`);
      continue;
    }
    for (const file of walk(dir)) {
      const parts = path.relative(dir, file).split(path.sep);
      entries.push({
        file,
        kind: kindOf(file),
        section: parts.length > 1 ? parts[0] : undefined,
        rel: path.relative(ROOT, file),
      });
    }
  }
  entries.sort(
    (a, b) =>
      collator.compare(a.section ?? "", b.section ?? "") || collator.compare(a.rel, b.rel),
  );
  return entries;
}

async function processCollection(collection, progress) {
  const outDir = path.join(OUT_DIR, collection.id);
  mkdirSync(outDir, { recursive: true });
  const entries = collectionEntries(collection);
  const items = [];
  const skips = {};
  const failures = [];
  let yearMin = Infinity;
  let yearMax = 0;

  const queue = entries.slice();
  let index = 0;
  const worker = async () => {
    for (;;) {
      const entry = queue.shift();
      if (!entry) return;
      const n = ++index;
      if (entry.kind === "skip") {
        const ext = path.extname(entry.file).toLowerCase().replace(".", "") || "no-ext";
        skips[ext] = (skips[ext] ?? 0) + 1;
        continue;
      }
      const base = path.join(outDir, sha(entry.rel));
      const name = label(entry.file);
      const serial = items.length + 1;
      try {
        const built =
          entry.kind === "image"
            ? await buildImage(base, entry.file)
            : entry.kind === "video"
              ? await buildVideo(base, entry.file, collection.previewSeconds)
              : await buildDocument(base, entry.file);
        const item = {
          kind: entry.kind,
          src: `/archive/${collection.id}/${path.basename(base)}${
            entry.kind === "video" ? ".mp4" : "-full.jpg"
          }`,
          width: built.dims.width,
          height: built.dims.height,
          section: entry.section,
          caption: name || (entry.kind === "video" ? `Clip ${serial}` : `Frame ${serial}`),
          alt: `${collection.title}${entry.section ? `, ${entry.section}` : ""}${
            name
              ? `: ${name}`
              : ` — ${entry.kind === "video" ? "video" : entry.kind === "document" ? "document" : "image"} ${serial}`
          }`,
          source: entry.rel,
        };
        if (entry.kind === "image") item.thumb = item.src.replace("-full.jpg", "-thumb.jpg");
        if (entry.kind === "video") {
          item.poster = item.src.replace(/\.mp4$/, "-poster.jpg");
          if (built.seconds) item.duration = built.seconds;
        }
        if (entry.kind === "document" && built.download) item.download = built.download;
        items.push(item);
        const year = new Date(mtime(entry.file)).getFullYear();
        yearMin = Math.min(yearMin, year);
        yearMax = Math.max(yearMax, year);
      } catch (error) {
        failures.push({ file: entry.rel, error: String(error.message ?? error) });
        console.error(`  ✗ ${entry.rel}\n    ${String(error.message ?? error).split("\n")[0]}`);
      }
      progress(n, entry, totalCount);
    }
  };

  const totalCount = entries.filter((e) => e.kind !== "skip").length;
  const workers = Math.min(Number(process.env.ARCHIVE_JOBS ?? 2), queue.length);
  await Promise.all(Array.from({ length: workers }, worker));

  items.sort((a, b) => collator.compare(a.source, b.source));
  return {
    id: collection.id,
    year: yearMax ? (yearMin === yearMax ? `${yearMin}` : `${yearMin}–${yearMax}`) : "",
    items,
    skips,
    failures,
    total: totalCount,
  };
}

async function main() {
  assertRoot();
  mkdirSync(OUT_DIR, { recursive: true });
  const selected = archiveCollections.filter((c) => !only || c.id === only);
  if (selected.length === 0) {
    console.error(`Unknown collection id: ${only}`);
    process.exit(1);
  }

  const started = Date.now();
  const results = [];
  const failures = [];

  for (const collection of selected) {
    console.log(`\n${collection.title} — ${collection.folder}`);
    const result = await processCollection(collection, (n, entry, totalCount) => {
      const elapsed = (Date.now() - started) / 1000;
      process.stdout.write(
        `  [${String(n).padStart(3)}/${String(totalCount).padStart(3)}] ${entry.kind.padEnd(8)} ${path.basename(entry.file).slice(0, 54)}  (${elapsed.toFixed(0)}s)\n`,
      );
    });
    results.push(result);
    if (collection.id === "blueventure") {
      // Every lesson poster lands on the same logo slate; the cover is composed
      // from four lesson slides instead (see src/lib/archive-covers.ts).
      await writeCourseCover(
        path.join(OUT_DIR, collection.id),
        result.items.filter((item) => item.kind === "video"),
        projectDir,
      );
    }
    failures.push(...result.failures);
    const tally = ["image", "video", "document"]
      .map((kind) => `${result.items.filter((i) => i.kind === kind).length} ${kind}`)
      .join(", ");
    console.log(`  → ${tally}${Object.keys(result.skips).length ? ` · skipped ${JSON.stringify(result.skips)}` : ""}`);
  }

  if (only) {
    // Merge into the existing manifest so a single-collection run keeps the rest.
    const previous = existsSync(JSON_OUT)
      ? JSON.parse((await import("node:fs")).readFileSync(JSON_OUT, "utf8"))
      : { collections: [] };
    const merged = new Map(previous.collections.map((c) => [c.id, c]));
    for (const result of results) merged.set(result.id, result);
    results.length = 0;
    results.push(...merged.values());
  }

  const order = new Map(archiveCollections.map((c, i) => [c.id, i]));
  results.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  const bytes = walk(OUT_DIR).reduce((sum, file) => sum + statSync(file).size, 0);
  const totals = results.reduce(
    (acc, c) => {
      for (const item of c.items) {
        if (item.kind === "image") acc.images++;
        if (item.kind === "video") acc.videos++;
        if (item.kind === "document") acc.documents++;
        acc.duration += item.duration ?? 0;
      }
      return acc;
    },
    { images: 0, videos: 0, documents: 0, duration: 0, bytes: 0 },
  );
  totals.bytes = bytes;

  writeFileSync(
    `${JSON_OUT}.tmp`,
    `${JSON.stringify(
      {
        generated: new Date().toISOString().slice(0, 10),
        totals,
        collections: results.map((result) => ({
          id: result.id,
          year: result.year,
          items: result.items,
          skips: result.skips,
        })),
      },
      null,
      2,
    )}\n`,
  );
  renameSync(`${JSON_OUT}.tmp`, JSON_OUT);

  const seconds = ((Date.now() - started) / 1000).toFixed(0);
  console.log(
    `\n${totals.images} images · ${totals.videos} videos · ${totals.documents} documents · ${(totals.duration / 3600).toFixed(1)} h runtime · ${(bytes / 1048576).toFixed(0)} MB derivative · ${seconds}s`,
  );
  if (failures.length) {
    console.error(`\n${failures.length} file(s) failed:`);
    for (const failure of failures) console.error(`  ${failure.file} — ${failure.error.split("\n")[0]}`);
    process.exitCode = 1;
  }
}

await main();
