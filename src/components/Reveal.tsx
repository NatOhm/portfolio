"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Shared scroll reveal: fades, lifts, and de-blurs once on entry.
 *
 * Deliberately not motion-library based. The hidden state is pure CSS and the
 * only client signal is a data attribute written after mount, so the server
 * render and the first client render are identical and hydration stays clean.
 * `prefers-reduced-motion` is handled in globals.css, which drops the effect
 * entirely rather than shortening it.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  lift = 24,
  x = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  lift?: number;
  x?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer support (or a script-blocked environment): show the content.
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
      { rootMargin: "-10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className ? `reveal ${className}` : "reveal"}
      style={
        {
          "--reveal-delay": `${delay}s`,
          "--reveal-lift": `${lift}px`,
          "--reveal-x": `${x}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
