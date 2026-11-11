"use client";

import { useEffect, type RefObject } from "react";

/**
 * The signature blocks' one shared contract, the same one `[data-settle]` uses:
 * the attribute only exists once this component has mounted, so with scripting
 * off the CSS never hides anything; when the block scrolls into view it is
 * switched to "shown" once and the observer disconnects (no repeats, no loop).
 */
export function useOnceInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  name: string,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const set = (value: "pending" | "shown") => el.setAttribute(`data-${name}`, value);

    if (typeof IntersectionObserver === "undefined") {
      set("shown");
      return;
    }

    set("pending");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          set("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "-6% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, name]);
}
