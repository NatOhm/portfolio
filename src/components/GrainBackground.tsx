"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Noise gradient background: four oversized, heavily blurred colour fields
 * drifting under two static film-grain tiles, fixed behind every page.
 *
 * The markup is complete on the server, so the gradient is there with scripting
 * off or blocked and nothing can flash in late. Motion is CSS only — each field
 * animates `transform` and nothing else, which keeps the drift on the
 * compositor — and it is paused (not removed) while the tab is in the
 * background, so coming back resumes the same pose instead of restarting it.
 *
 * The tooth is for the opening statement, not for reading. A scroll listener
 * writes `--grain-fade` (1 at the top, 0 by the end of the first viewport) and
 * the plates multiply their opacity by it, so the grain thins out as soon as
 * the hero is behind you. It is a paint-only property on a fixed layer, rAF
 * throttled, and it never touches layout.
 *
 * The colours live in CSS (`--grain-a` … `--grain-d`), including the per-project
 * overrides, so this component stays four empty spans.
 */
export default function GrainBackground() {
  const [hidden, setHidden] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const span = Math.max(320, window.innerHeight * 0.8);
      const fade = Math.max(0, Math.min(1, 1 - window.scrollY / span));
      el.style.setProperty("--grain-fade", fade.toFixed(3));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="grain-bg"
      data-paused={hidden ? "true" : "false"}
      aria-hidden="true"
    >
      <span className="grain-bg__blob" />
      <span className="grain-bg__blob" />
      <span className="grain-bg__blob" />
      <span className="grain-bg__blob" />
    </div>
  );
}
