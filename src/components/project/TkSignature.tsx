"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { mediaDims } from "@/lib/media-dimensions";
import type { Project } from "@/lib/types";
import { useOnceInView } from "./useOnceInView";

/**
 * TK's signature: the same field material in the three shapes it shipped in,
 * standing on one ground line. The frames are the project's own stills, shown
 * here for their shape — the gallery below already carries them with captions,
 * so they are decorative and the format labels do the reading.
 */
const PICKED = [
  { match: "reel-1", label: "9:16 reel" },
  { match: "montage", label: "45-second edit" },
  { match: "graphic-2", label: "Promo graphic" },
];

export default function TkSignature({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  useOnceInView(ref, "fmt");

  const plots = PICKED.flatMap(({ match, label }) => {
    const item = project.gallery.find((media) => media.src.includes(match));
    const src = item?.type === "video" ? item.poster : item?.src;
    if (!src) return [];
    const dims = mediaDims(src);
    return [{ label, src, ratio: dims ? `${dims.width} / ${dims.height}` : "4 / 3" }];
  });

  if (plots.length === 0) return null;

  return (
    <section className="cs-signature px-4 pt-10 md:px-6 md:pt-14">
      <figure ref={ref} className="fmt-ladder mx-auto max-w-[1280px]">
        <div className="fmt-plots">
          {plots.map((plot, i) => (
            <div className="fmt-plot" key={plot.label} style={{ "--i": i } as CSSProperties}>
              <div className="fmt-frame" style={{ aspectRatio: plot.ratio }}>
                <Image
                  src={plot.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 32vw, 400px"
                  className="object-cover"
                />
              </div>
              <p className="fmt-label font-meta text-meta uppercase text-faint">{plot.label}</p>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="fmt-ground" />
        {/* Verbatim from project.approach — the ladder is that sentence drawn. */}
        <figcaption className="fmt-note font-meta text-meta uppercase text-faint">
          One shoot, many formats.
        </figcaption>
      </figure>
    </section>
  );
}
