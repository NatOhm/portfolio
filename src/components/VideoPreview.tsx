"use client";

/**
 * Short muted looping preview. Autoplay only when muted, short, and
 * nonessential; pauses whenever offscreen or when reduced motion is requested,
 * and clears its observer on unmount. Decorative previews are aria-hidden
 * since the poster/post text carries the meaning. A labelled preview (the
 * case-study hero) is meaningful content: it keeps its name and gains a pause
 * control instead, because motion that starts by itself and runs past five
 * seconds needs a way to stop it.
 */
import { useEffect, useRef, useState } from "react";
import { useMotionAllowed } from "@/lib/use-motion-allowed";

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };

export default function VideoPreview({
  src,
  poster,
  width,
  height,
  label,
  className,
}: {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  /** Name the clip and offer a pause control (meaningful, not decorative). */
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const motionAllowed = useMotionAllowed();
  const [playing, setPlaying] = useState(false);
  /** A deliberate pause outranks the observer; only the control resumes it. */
  const userPaused = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !motionAllowed) return;
    if ((navigator as SaveDataNavigator).connection?.saveData) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (userPaused.current) return;
          video.play().catch(() => {
            /* autoplay can be blocked — the poster frame remains */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [motionAllowed]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {
        /* a refused play leaves the poster frame in place */
      });
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  const player = (
    <video
      ref={ref}
      src={src}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
      tabIndex={label ? undefined : -1}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      className={className}
    />
  );

  if (!label) return player;

  return (
    <div className="relative">
      {player}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause preview" : "Play preview"}
        className="absolute bottom-3 right-3 z-10 rounded-full bg-ink/85 px-3 py-1.5 font-meta text-meta uppercase text-canvas transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas"
      >
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}
