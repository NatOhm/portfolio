"use client";

import { useSyncExternalStore } from "react";

/**
 * True when the visitor allows motion. SSR and the first client render return
 * false, so markup that depends on it hydrates identically and decorative
 * motion only opts in after mount.
 */
const QUERY = "(prefers-reduced-motion: no-preference)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function useMotionAllowed(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
