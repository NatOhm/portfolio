"use client";

import { useRef, type CSSProperties } from "react";
import type { Project } from "@/lib/types";
import { useOnceInView } from "./useOnceInView";

/**
 * EN KKU's signature: the club's output stamped like a record card. Each stamp
 * repeats a count the project already states (4 long-form event films, 2
 * short-form ceremony videos, 3 seasons), so the block adds no claims — it just
 * puts three years of work on one card.
 */
const STAMPS = [
  { value: "4", label: "Event films", tilt: "-5deg" }, // evidence[0]
  { value: "2", label: "Ceremony videos", tilt: "3deg" }, // evidence[1]
  { value: "3", label: "Seasons", tilt: "-2deg" }, // evidence[2]
];

export default function StampRecord({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  useOnceInView(ref, "stamp");

  return (
    <section className="cs-signature px-4 pt-10 md:px-6 md:pt-14">
      <div ref={ref} className="stamp-sheet mx-auto max-w-[1280px]">
        <p className="stamp-head font-meta text-meta uppercase text-faint">{project.year}</p>

        <ul className="stamp-row">
          {STAMPS.map((stamp, i) => (
            <li
              key={stamp.label}
              className="stamp-mark"
              style={{ "--i": i, "--rot": stamp.tilt } as CSSProperties}
            >
              <span className="stamp-value font-display text-accent">{stamp.value}</span>
              <span className="stamp-label font-meta text-meta uppercase text-muted">
                {stamp.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
