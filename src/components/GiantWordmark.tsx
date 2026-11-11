"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Footer wordmark: the first name at full viewport width, one letter per span so
 * the letters can rise in sequence and each one can take a hover squish.
 *
 * Same approach as Reveal — the hidden state is CSS and the only client signal
 * is a data attribute written after mount, so the server and first client render
 * agree. `prefers-reduced-motion` drops the motion entirely in globals.css. The
 * letters are aria-hidden and the container carries the name, so a screen reader
 * reads "Natnithichai", not twelve separate letters.
 */
export default function GiantWordmark({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.dataset.visible = "true";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="giant-word-clip" aria-hidden="false">
      <p ref={ref} className="giant-word text-ink" aria-label={text}>
        {Array.from(text).map((letter, i) => (
          <span
            key={`${letter}-${i}`}
            aria-hidden="true"
            className="giant-letter"
            style={{ "--letter-delay": `${i * 0.05}s` } as CSSProperties}
          >
            <span className="giant-letter-in">{letter}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
