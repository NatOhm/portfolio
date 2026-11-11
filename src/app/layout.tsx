import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/bai-jamjuree/thai-600.css";
import "@fontsource-variable/anuphan";
import "./globals.css";
import GrainBackground from "@/components/GrainBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import { mediaDims } from "@/lib/media-dimensions";

const ogDefault = mediaDims("/images/og/default.jpg") ?? { width: 1200, height: 630 };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.description,
    type: "website",
    images: [{ url: "/images/og/default.jpg", ...ogDefault }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#EDE6DC",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={site.locale}>
      {/*
       * No `bg-canvas` here: the porcelain comes from `html`, so the body box
       * stops painting over the fixed noise-gradient layer at z-index: -1.
       */}
      <body className="text-ink antialiased">
        <GrainBackground />
        <div className="scroll-progress" aria-hidden="true" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-surface focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-[var(--shadow-clay)]"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
