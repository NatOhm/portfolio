import type { CSSProperties } from "react";
import HeroDistort from "@/components/HeroDistort";
import { profile } from "@/lib/content";

/**
 * Opening block: one oversized statement set in two voices — a tight grotesk
 * line answered by a display serif — over a generated gradient, with a scroll
 * cue into the reel.
 *
 * The three lines marked `data-distort-text` are the ones the canvas redraws:
 * their real text stays here for search and assistive tech, and HeroDistort
 * covers them with a GPU layer once it can reproduce them exactly. Marking is
 * opt-in, so if that layer never comes up the page is simply unstyled text.
 *
 * Motion: the headline's CSS rise is replaced by the canvas reveal while the
 * effect is live; the squiggle draws itself and the cue arrow nudges on hover.
 * The reduced-motion rule collapses what is left.
 */

const clients = [
  "TK Agricultural",
  "Pattaya Guide",
  "BlueVentureTPA",
  "EN KKU & ENPHOTO",
  "Nong Kati Store",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-8 md:px-6 md:pt-32 md:pb-10">
      <HeroDistort />
      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="relative text-center">
          <p className="rise font-meta text-meta uppercase text-faint">
            {profile.name} · {profile.location}
          </p>

          <p
            data-distort-text
            className="rise-1 rise mt-9 font-serif text-[clamp(1.5rem,2.6vw,2.35rem)] leading-[1.05] text-ink md:mt-12 lg:mt-24"
          >
            Video, motion &amp; graphic design
          </p>

          <h1 className="mt-2 text-[clamp(2.6rem,8.6vw,7.6rem)] uppercase leading-[0.88] tracking-[-0.03em] text-ink">
            <span
              data-distort-text
              className="hero-line"              style={{ "--line-delay": "0.16s" } as CSSProperties }
            >
              <span className="font-display font-extrabold">Stories in motion</span>
            </span>
            <span
              data-distort-text
              className="hero-line"              style={{ "--line-delay": "0.28s" } as CSSProperties }
            >
              <span className="font-serif font-normal tracking-[-0.015em]">
                Brands with character
              </span>
            </span>
          </h1>

          <p className="rise-3 rise mx-auto mt-8 max-w-[52ch] text-lede text-muted">
            {profile.statement}
          </p>

          <a
            href="#reel"
            className="rise-4 rise group mt-9 inline-flex flex-col items-center gap-2"
          >
            <span className="text-sm font-medium text-ink transition-colors group-hover:text-accent">
              Discover more
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 64 12"
              className="squiggle h-2.5 w-14 text-accent"
              fill="none"
            >
              <path
                d="M1 7.5c4.8-4.6 8.7-4.6 13.4 0s8.7 4.6 13.4 0 8.7-4.6 13.4 0 8.7 4.6 13.4 0 5.6-3.4 8.4-1.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="cue-arrow grid h-6 w-6 place-items-center rounded-full bg-ink text-canvas transition-colors group-hover:bg-accent">
              <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                <path
                  d="M6 1.5v9M2.2 6.6 6 10.4l3.8-3.8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>

          <p className="mt-7 font-meta text-meta uppercase text-faint">{profile.availability}</p>
        </div>

        <div className="mt-12 border-t border-line pt-6 md:mt-16 md:pt-7">
          <p className="text-center font-meta text-meta uppercase text-faint">Selected clients</p>
          {/* One continuous run. The list is emitted twice: the second half is the
              seam-filler that slides into place as the first leaves, and is hidden
              from assistive tech because it repeats the same names. */}
          <div className="clients-marquee mt-4">
            <ul className="clients-track">
              {[...clients, ...clients].map((client, i) => (
                <li
                  key={`${client}-${i}`}
                  aria-hidden={i >= clients.length ? true : undefined}
                  className="font-display text-[0.8rem] font-semibold tracking-[0.04em] whitespace-nowrap text-muted uppercase transition-colors duration-200 hover:text-ink"
                >
                  {client}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
