"use client";

import Image from "next/image";
import { useRef } from "react";
import { mediaDims } from "@/lib/media-dimensions";
import type { Project } from "@/lib/types";
import { useOnceInView } from "./useOnceInView";

/**
 * Sci-Fi's signature: one rendered plate under a terminal readout, with the
 * study's own counts listed beside it. The single scan pass is the only motion;
 * it runs once on entry and ends invisible, leaving the still untouched.
 */
export default function ScanPlate({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  useOnceInView(ref, "scan");

  const still = project.gallery.find((item) => item.type === "image");
  if (!still) return null;

  const dims = mediaDims(still.src);
  const evidence = project.evidence ?? [];

  return (
    <section className="cs-signature px-4 pt-10 md:px-6 md:pt-14">
      <div ref={ref} className="scan-plate mx-auto max-w-[1280px]">
        <figure className="scan-still">
          <div
            className="scan-frame"
            style={{ aspectRatio: dims ? `${dims.width} / ${dims.height}` : "16 / 9" }}
          >
            <Image
              src={still.src}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 780px"
              className="object-cover"
            />
            <span aria-hidden="true" className="scan-beam" />
          </div>
          <figcaption className="mt-3 font-meta text-meta uppercase text-faint">
            {still.caption ?? still.alt}
          </figcaption>
        </figure>

        {evidence.length > 0 ? (
          <ul className="scan-log">
            {evidence.map((line, i) => (
              <li key={line} className="scan-log-row">
                <span className="scan-log-num font-meta text-meta tabular-nums text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-ink">{line}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
