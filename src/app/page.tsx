import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Monitor from "@/components/Monitor";
import SelectedWork from "@/components/SelectedWork";
import Capabilities from "@/components/Capabilities";
import AboutPreview from "@/components/AboutPreview";
import ContactCTA from "@/components/ContactCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { en: "/", th: "/th" },
  },
};

export default function Home() {
  return (
    <>
      {/* Front-door title card; it lifts on its own CSS timeline. */}
      <Intro />
      <div className="liquid-stage">
        <Hero />
        {/*
         * The reel is the hero's second half: it plays inside the one physical
         * object on the page, with a real transport underneath it.
         */}
        <div id="reel" className="scroll-mt-24">
          <Monitor
            src="/videos/hero/reel.mp4"
            poster="/videos/hero/reel-poster.jpg"
            title="Scene Study — Sci-Fi Environments"
            meta="3D / Motion · 2025"
            href="/work/sci-fi-environments"
          />
        </div>
      </div>
      <SelectedWork />
      <Capabilities />
      <AboutPreview />
      <ContactCTA />
    </>
  );
}
