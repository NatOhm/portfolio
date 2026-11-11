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
  async redirects() {
    /* The Thai front door is gone from the product; keep any inbound link or
       search result pointing at /th landing on the English home instead of a
       404. Permanent, so crawlers drop the old URL. */
    return [{ source: "/th", destination: "/", permanent: true }];
  },
};

export default nextConfig;
