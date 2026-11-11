import fs from "node:fs";
import path from "node:path";

/**
 * Project logos are picked up from the project's own image folder: drop a
 * `logo.png` (or .svg/.webp/.jpg) next to `cover.jpg` and the work page shows
 * the mark instead of the still. No data edit, no import, no build script —
 * the folder is the source of truth, and a project without a logo keeps its
 * cover.
 */
const projectImageRoot = path.join(process.cwd(), "public", "images", "projects");

/** Preferred order: a vector mark scales cleanest, then flat rasters. */
const extensions = ["svg", "png", "webp", "avif", "jpg", "jpeg"] as const;

function findLogoFile(slug: string): string | null {
  let entries: string[];
  try {
    entries = fs.readdirSync(path.join(projectImageRoot, slug));
  } catch {
    return null;
  }

  const lower = entries.map((entry) => entry.toLowerCase());

  /* Exact `logo.<ext>` only: a folder can also hold rendered stills whose names
     start with "logo" (an animated wordmark, for one), and those are work, not
     a mark. Extension order decides when several files share the name. */
  for (const extension of extensions) {
    const index = lower.indexOf(`logo.${extension}`);
    if (index !== -1) return entries[index];
  }

  return null;
}

export function projectLogo(slug: string): string | null {
  const file = findLogoFile(slug);
  return file ? `/images/projects/${slug}/${encodeURIComponent(file)}` : null;
}

/** Logos for a set of project slugs, keyed by slug. Empty object when none exist. */
export function projectLogos(slugs: string[]): Record<string, string> {
  const logos: Record<string, string> = {};
  for (const slug of slugs) {
    const src = projectLogo(slug);
    if (src) logos[slug] = src;
  }
  return logos;
}
