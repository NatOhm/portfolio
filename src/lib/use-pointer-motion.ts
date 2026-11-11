"use client";

import { useSyncExternalStore } from "react";

/**
 * True only on fine pointers with animations allowed. Subscribes to the
 * media query so a mid-session change (e.g. user toggles reduced motion)
 * updates too. SSR and first render return false — decorative motion
 * opts in after hydration only.
 */
const QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function usePointerMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
