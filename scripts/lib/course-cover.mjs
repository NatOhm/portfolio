import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

/**
 * BlueVenture's lesson videos all open on the same logo slate, so ffmpeg's
 * 2-second poster is a near-blank white card for every lesson. Compose the
 * collection cover from four lesson slides spread across the course instead, so
 * the card shows what the set actually is.
 *
 * Writes `<outDir>/cover.jpg` (1600x1280, 5:4 to match the archive card) and
 * leaves no temporary frames behind.
 */

const CELL_W = 800;
const CELL_H = 640;
const FRAME_W = 1280;
const AT = 0.45; // fraction of each lesson; past the slate, inside the material

export function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited ${code}\n${stderr.trim().split("\n").slice(-3).join("\n")}`));
    });
  });
}

/**
 * @param {string} outDir    Absolute path to the collection's derivative folder.
 * @param {Array<{src: string, duration?: number}>} videos  Manifest items, in order.
 * @returns {Promise<string|undefined>} The written cover's absolute path.
 */
export async function writeCourseCover(outDir, videos, root) {
  const usable = videos.filter((v) => v.duration && v.duration > 0);
  if (usable.length < 4) return undefined;

  mkdirSync(outDir, { recursive: true });
  const picks = [0, 1 / 3, 2 / 3, 1].map((r) => usable[Math.round(r * (usable.length - 1))]);
  const frames = picks.map((_, n) => path.join(outDir, `.cover-frame-${n}.jpg`));

  try {
    for (const [n, item] of picks.entries()) {
      await run("ffmpeg", [
        "-v", "error", "-y",
        "-ss", (item.duration * AT).toFixed(1),
        "-i", path.join(root, "public", item.src.replace(/^\//, "")),
        "-frames:v", "1", "-update", "1",
        "-vf", `scale=${FRAME_W}:-2`,
        "-q:v", "2", frames[n],
      ]);
    }

    const args = frames.flatMap((frame) => ["-i", frame]);
    const cells = frames
      .map(
        (_, i) =>
          `[${i}:v]scale=${CELL_W}:${CELL_H}:force_original_aspect_ratio=decrease,` +
          `pad=${CELL_W}:${CELL_H}:(ow-iw)/2:(oh-ih)/2:color=0xf3f6fb[s${i}]`,
      )
      .join(";");
    const stack = frames.map((_, i) => `[s${i}]`).join("");
    const layout = [`0_0`, `${CELL_W}_0`, `0_${CELL_H}`, `${CELL_W}_${CELL_H}`].join("|");

    const target = path.join(outDir, "cover.jpg");
    const partial = path.join(outDir, "cover.part.jpg");
    await run("ffmpeg", [
      "-v", "error", "-y",
      ...args,
      "-filter_complex", `${cells};${stack}xstack=inputs=${frames.length}:layout=${layout}:fill=0xf3f6fb`,
      "-frames:v", "1", "-update", "1", "-q:v", "3", partial,
    ]);
    rmSync(target, { force: true });
    const { renameSync } = await import("node:fs");
    renameSync(partial, target);
    return target;
  } finally {
    for (const frame of frames) rmSync(frame, { force: true });
    rmSync(path.join(outDir, "cover.part.jpg"), { force: true });
  }
}
