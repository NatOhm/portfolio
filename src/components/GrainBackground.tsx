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
 * The tooth is for the opening statement, not for reading. Once the first
 * viewport is behind you the plates fade out through a single `data-faded`
 * switch and a CSS opacity transition, so the grain thins out exactly the way
 * it always did — without restyling a blurred fixed layer on every scroll
 * frame.
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

    /*
     * The tooth thins out once the opening statement is behind you — but this
     * element contains four blurred fields and two noise plates on a fixed
     * layer, so writing a style here is not free: it invalidates that whole
     * surface and repaints it. The old version set a custom property every
     * scroll frame, which is a full blurred repaint sixty times a second.
     *
     * Now the handler only compares a number and writes when the threshold is
     * actually crossed, once each way; the fade itself is a CSS opacity
     * transition on the two plates, which the compositor runs. Scrolling costs
     * no style invalidation at all.
     */
    const span = () => Math.max(320, window.innerHeight * 0.8);
    let faded = false;

    const check = () => {
      const next = window.scrollY > span();
      if (next === faded) return;
      faded = next;
      el.dataset.faded = next ? "true" : "false";
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="grain-bg"
      data-paused={hidden ? "true" : "false"}
      data-faded="false"
      aria-hidden="true"
    >
      <span className="grain-bg__blob" />
      <span className="grain-bg__blob" />
      <span className="grain-bg__blob" />
      <span className="grain-bg__blob" />
    </div>
  );
}
