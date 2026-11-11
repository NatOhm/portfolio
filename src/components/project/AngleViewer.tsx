"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import type { ProjectMedia } from "@/lib/types";

/** The four final renders, in turnaround order. */
const ANGLES = ["Front", "Back", "Side", "Detail"] as const;

/**
 * One render at a time on a single stage, chosen with a slider or its labelled
 * chips. This crossfades between four finished views — it is not a 3D turntable
 * and does not claim to be; the hero clip already carries the rotation.
 *
 * Everything is data the project already publishes (src, alt, caption), and the
 * default state renders on the server, so the block is usable before hydration.
 */
export default function AngleViewer({ items }: { items: ProjectMedia[] }) {
  const views = items.filter((item) => item.type === "image").slice(0, ANGLES.length);
  const [index, setIndex] = useState(0);
  if (views.length === 0) return null;

  const current = views[Math.min(index, views.length - 1)];
  const labels = ANGLES.slice(0, views.length);
  const progress = views.length > 1 ? (index / (views.length - 1)) * 100 : 100;

  return (
    <figure className="angle">
      <div className="angle-stage bg-well">
        {views.map((item, i) => (
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 760px"
            className="angle-frame object-cover"
            data-active={i === index}
            aria-hidden={i !== index}
          />
        ))}
      </div>

      <div className="angle-controls mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Choose an angle">
          {labels.map((label, i) => (
            <button
              key={label}
              type="button"
              className="clay-chip"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          type="range"
          className="scrub angle-range"
          min={0}
          max={Math.max(views.length - 1, 0)}
          step={1}
          value={index}
          aria-label="Viewing angle"
          aria-valuetext={`${labels[index]} view`}
          style={{ "--progress": `${progress}%` } as CSSProperties}
          onChange={(event) => setIndex(Number(event.target.value))}
        />
      </div>

      {/* The caption already opens with the angle it shows, so it is not
          repeated; the pressed chip and the slider's aria-valuetext name it. */}
      <figcaption className="angle-caption mt-3 font-meta text-meta uppercase text-faint">
        {current.caption ?? current.alt}
      </figcaption>
    </figure>
  );
}
