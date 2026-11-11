import path from "node:path";
import { spawn } from "node:child_process";

/**
 * Compose a 5:4 archive cover (1600x1280) around a piece that a plain 5:4 crop
 * would destroy: a tall poster, a menu page, a 9:16 reel frame.
 *
 * The piece is fitted whole (never cropped) and centred. Around it sits a mat:
 * the same artwork blown up, blurred past recognition, darkened and vignetted,
 * so it reads as the piece's own shadow rather than a second copy of it behind
 * the first. A 1px translucent white hairline separates the piece from the mat,
 * which is what makes the inset look intentional at card size.
 *
 * The darkening is measured, not fixed. A constant multiplier made pale pieces
 * (the infographic board) keep a pale mat while dark ones went almost black, so
 * a card's weight depended on its artwork rather than on the design. Instead
 * each artwork is averaged to one pixel and the bloom is scaled toward
 * `MAT_LUMA` out of 255, so a near-white board gets a deep tan mat instead of a
 * washed one. The scale is clamped at the top: a dark render's mat must never
 * come out brighter than the piece sitting on it, so those mats settle a little
 * under target rather than glow.
 *
 * Usage: node scripts/lib/cover-plate.mjs <source image> <output .jpg>
 */

/**
 * Mat brightness on the 0-255 scale, before the vignette. Only the strip beside
 * the piece is ever visible, and the vignette takes that strip to roughly half
 * of this, so the value is set for what you see at the edges rather than at the
 * centre (which the piece covers).
 */
const MAT_LUMA = 115;

/** Never dim so far that the mat loses the artwork's hue, never so little it glows. */
const GAIN_MIN = 0.16;
const GAIN_MAX = 0.62;

function run(args, { capture = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { stdio: ["ignore", capture ? "pipe" : "ignore", "pipe"] });
    const out = [];
    let stderr = "";
    if (capture) child.stdout.on("data", (chunk) => out.push(chunk));
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(Buffer.concat(out));
      else reject(new Error(`ffmpeg exited ${code}\n${stderr.trim()}`));
    });
  });
}

/** Average the artwork down to one pixel and return its perceived brightness. */
async function averageLuma(source) {
  const raw = await run(
    ["-v", "error", "-i", source, "-vf", "scale=1:1", "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
    { capture: true },
  );
  if (raw.length < 3) throw new Error(`could not read a pixel from ${source}`);
  const [r, g, b] = raw;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export async function writeCoverPlate(source, out) {
  const luma = await averageLuma(source);
  const gain = Math.min(GAIN_MAX, Math.max(GAIN_MIN, MAT_LUMA / Math.max(luma, 1)));

  const filter = [
    "[0:v]scale=1600:1280:force_original_aspect_ratio=increase,crop=1600:1280,",
    `boxblur=64:4,lutrgb=r='val*${gain.toFixed(3)}':g='val*${gain.toFixed(3)}':b='val*${gain.toFixed(3)}',`,
    "vignette=PI/4[bg];",
    "[0:v]scale=1170:1170:force_original_aspect_ratio=decrease,",
    "format=rgba,pad=iw+2:ih+2:(ow-iw)/2:(oh-ih)/2:color=0xffffff@0.20[fg];",
    "[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuvj420p",
  ].join("");

  await run(["-v", "error", "-y", "-i", source, "-filter_complex", filter, "-frames:v", "1", "-update", "1", "-q:v", "3", out]);
  return { out: path.resolve(out), luma: Math.round(luma), gain: Number(gain.toFixed(2)) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const [, , source, out] = process.argv;
  if (!source || !out) {
    console.error("usage: node scripts/lib/cover-plate.mjs <source> <output.jpg>");
    process.exit(1);
  }
  const { out: written, luma, gain } = await writeCoverPlate(source, out);
  console.log(`cover plate → ${written}  (art luma ${luma}, mat ×${gain})`);
}
