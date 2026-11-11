"use client";

import Image from "next/image";
import { useState } from "react";
import { mediaDims } from "@/lib/media-dimensions";
import type { ProjectMedia } from "@/lib/types";

/**
 * Drag-to-compare: two states of the same screen with a clipped seam between
 * them. The interaction is a real range input laid transparently over the
 * picture, so pointer drag, touch drag, arrow keys and Home/End all work, and
 * the control is announced as a slider rather than being a mouse-only flourish.
 */
export default function CompareSlider({
  a,
  b,
  labelA,
  labelB,
}: {
  a: ProjectMedia;
  b: ProjectMedia;
  labelA: string;
  labelB: string;
}) {
  const dims = mediaDims(b.src) ?? mediaDims(a.src) ?? { width: 1600, height: 1000 };
  const [position, setPosition] = useState(50);

  return (
    <div
      className="cs-compare"
      style={{ aspectRatio: `${dims.width} / ${dims.height}` }}
    >
      <Image
        src={b.src}
        alt={b.alt}
        fill
        sizes="(max-width: 768px) 100vw, 1280px"
        className="cs-compare-img"
      />
      <div className="cs-compare-clip" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image
          src={a.src}
          alt={a.alt}
          fill
          sizes="(max-width: 768px) 100vw, 1280px"
          className="cs-compare-img"
        />
      </div>

      <span className="cs-compare-tag cs-compare-tag--a">{labelA}</span>
      <span className="cs-compare-tag cs-compare-tag--b">{labelB}</span>
      <span
        aria-hidden="true"
        className="cs-compare-divider"
        style={{ left: `${position}%` }}
      />

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(position)}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="cs-compare-range"
        aria-label={`Reveal the ${labelA} state over the ${labelB} state`}
      />
    </div>
  );
}
