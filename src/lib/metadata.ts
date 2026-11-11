import type { Metadata } from "next";
import { site } from "@/lib/site";
import { mediaDims } from "@/lib/media-dimensions";

const ogDefault = mediaDims("/images/og/default.jpg") ?? { width: 1200, height: 630 };

const defaultTitle = `${site.name} — ${site.role}`;

/**
 * One Open Graph block for a route. `url` is the same path the route uses for
 * its canonical, and Next resolves it against `metadataBase` (built from
 * `site.url`), so the absolute `og:url` follows `NEXT_PUBLIC_SITE_URL` when the
 * domain changes instead of being pinned to a literal.
 *
 * The title, description and image fall back to the site-wide values the root
 * layout used before, so declaring this per route adds `og:url` without
 * changing any tag that was already being emitted.
 */
export function ogFor(
  path: string,
  title: string = defaultTitle,
  description: string = site.description,
): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    type: "website",
    url: path,
    images: [{ url: "/images/og/default.jpg", ...ogDefault }],
  };
}
