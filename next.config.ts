import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* AVIF first: the portfolio is image-led and the saving on these large
       photographs is worth the slower first encode. WebP stays as the fallback
       for browsers without AVIF. */
    formats: ["image/avif", "image/webp"],
    /* Project logos are dropped in by hand and are often vector marks; they are
       first-party files under /public, and the optimizer's response is locked
       down the way Next documents for SVG. */
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox",
  },
  async headers() {
    /* Everything under /public is served with `max-age=0, must-revalidate`, so
       a returning visitor re-validates every hero photo and clip. These are
       finished media files that only change when they are replaced, so a
       month-long cache with a revalidation window is safe and removes those
       round trips. The résumé keeps a shorter life because it is edited far
       more often than a photograph. */
    return [
      {
        source: "/:dir(images|videos|archive)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/:file(resume.pdf)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=3600" }],
      },
    ];
  },
  async redirects() {
    /* The Thai front door is gone from the product; keep any inbound link or
       search result pointing at /th landing on the English home instead of a
       404. Permanent, so crawlers drop the old URL. */
    return [{ source: "/th", destination: "/", permanent: true }];
  },
};

export default nextConfig;
