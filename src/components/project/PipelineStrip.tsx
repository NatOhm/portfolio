"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * The seven stages the Anim Hoodie pipeline actually ran, named as they are in
 * the project's process notes. Numbers are the sequence, not an invented claim.
 */
const STAGES = [
  "Research & ideation",
  "Concept sketching",
  "Base-mesh blocking",
  "Digital sculpting",
  "Retopology & UV unwrapping",
  "Texturing & materials",
  "Lighting & rendering",
] as const;

/**
 * Clay steps on one track: a scrolling row on phones, a column beside the angle
 * viewer from 768px. The container carries the state — `pending` only after
 * mount, `shown` on entry — so with scripting off (or no observer) the steps
 * are simply there, and the stagger is CSS, not a timer per step.
 */
export default function PipelineStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.dataset.pipe = "shown";
      return;
    }

    el.dataset.pipe = "pending";
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.dataset.pipe = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "-6% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="pipe">
      {/* Focusable so the phone layout's horizontal row can be scrolled from the
          keyboard, not only by dragging. */}
      <ol className="pipe-track" aria-label="Production stages" tabIndex={0}>
        {STAGES.map((stage, i) => (
          <li
            key={stage}
            className="pipe-step"
            style={{ "--d": `${i * 60}ms` } as CSSProperties}
          >
            <span className="pipe-num font-meta text-meta tabular-nums text-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="pipe-name">{stage}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
