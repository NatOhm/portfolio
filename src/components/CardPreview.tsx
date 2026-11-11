"use client";

/**
 * Card preview: the still stays the card. When a fine pointer rests on the card
 * — or the link takes keyboard focus — the project's own short clip fades in
 * over the still and plays muted, and leaving fades it back out.
 *
 * Nothing is downloaded until that intent: the element is preload="none" and
 * only play() starts the fetch, after a short rest so a pointer crossing the
 * grid does not pull megabytes. Reduced motion and Save-Data never mount it, a
 * tap only focuses the link (no hover, no :focus-visible) so phones keep the
 * still, and the still underneath means the preview is never the only way to
 * see the work.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotionAllowed } from "@/lib/use-motion-allowed";
import { usePointerMotion } from "@/lib/use-pointer-motion";

/** How long the pointer must rest on the card before the clip is fetched. */
const INTENT_MS = 320;

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };

export default function CardPreview({
  src,
  poster,
  portrait = false,
}: {
  src: string;
  poster?: string;
  /** Vertical clip: cover-cropping it into a landscape card cuts the subject. */
  portrait?: boolean;
}) {
  const motionAllowed = useMotionAllowed();
  const pointerMotion = usePointerMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!motionAllowed) return;
    const video = ref.current;
    const card = video?.closest("a");
    if (!video || !card) return;
    if ((navigator as SaveDataNavigator).connection?.saveData) return;

    let timer = 0;

    const start = () => {
      timer = 0;
      video.play().catch(() => {
        /* autoplay can be refused — the still stays */
      });
    };
    const stop = () => {
      window.clearTimeout(timer);
      timer = 0;
      video.pause();
    };
    const onEnter = () => {
      if (!pointerMotion) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(start, INTENT_MS);
    };
    const onLeave = (event: PointerEvent | FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (next && card.contains(next)) return;
      stop();
    };
    const onFocusIn = () => {
      /* A tap also focuses the link; only keyboard-visible focus is intent. */
      if (!card.matches(":focus-visible")) return;
      window.clearTimeout(timer);
      start();
    };
    const onPlaying = () => setLive(true);
    const onPause = () => setLive(false);

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("focusin", onFocusIn);
    card.addEventListener("focusout", onLeave);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);

    return () => {
      window.clearTimeout(timer);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("focusin", onFocusIn);
      card.removeEventListener("focusout", onLeave);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.pause();
    };
  }, [motionAllowed, pointerMotion]);

  if (!motionAllowed) return null;

  return (
    <div
      data-live={live ? "true" : "false"}
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out data-[live=true]:opacity-100"
    >
      {/* A vertical clip sits on its own dark plate, the way the case-study
          player frames it; the card frame becomes the stage instead of a crop
          that leaves the subject out of shot. */}
      {portrait ? <span aria-hidden="true" className="absolute inset-0 bg-ink" /> : null}
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        className={cn(
          "absolute inset-0 h-full w-full",
          portrait ? "object-contain" : "object-cover",
        )}
      />
    </div>
  );
}
