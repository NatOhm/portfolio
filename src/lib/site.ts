/** Central site configuration — production origin and shared paths. */

export const site = {
  /** Public production URL. Update after a domain is chosen; metadata falls back to localhost for development. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://natnithichai.portfolio",
  name: "Natnithichai Srikolchan",
  shortName: "Natnithichai",
  role: "Multimedia Designer",
  description:
    "Multimedia designer creating video, motion, 3D, and visual campaigns from concept to final delivery.",
  /** Downloadable résumé, served from public/resume.pdf */
  resumePath: "/resume.pdf",
  resumeFilename: "Natnithichai-Srikolchan-Resume.pdf",
  email: "natnithichai.s@gmail.com",
  locale: "en",
} as const;

export const navRoutes = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
] as const;
