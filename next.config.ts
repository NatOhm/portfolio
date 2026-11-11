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
};

export default nextConfig;
