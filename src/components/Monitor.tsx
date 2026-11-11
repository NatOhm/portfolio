"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import { useMotionAllowed } from "@/lib/use-motion-allowed";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * The Monitor — the one physical object on the page.
 *
 * Soft clay bezel, recessed screen, real transport: play/pause, a native range
 * scrubber (keyboard-operable, not drag-only) and a timecode read from the
 * clip rather than invented. Autoplay is opt-in, so reduced-motion visitors
 * get the poster frame and download no video; looping motion always has a
 * pause control (WCAG 2.2.2).
 */
export default function Monitor({
  src,
  poster,
  title,
  meta,
  href,
  label = "Featured reel",
}: {
  src: string;
  poster: string;
  title: string;
  meta: string;
  href: string;
  label?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const pendingPlay = useRef(false);
  const motionAllowed = useMotionAllowed();
  const [attached, setAttached] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  /*
   * The reel is the heaviest request on the page (about 1.4 MB) and it sits
   * below the fold, so its source is held back until the monitor is nearly in
   * view. The poster paints immediately, first paint and LCP stop competing
   * with the clip, and the file itself is untouched — it still plays at full
   * quality, just a moment later.
   */
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || attached) return;
    if (typeof IntersectionObserver !== "function") {
      setAttached(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setAttached(true);
          io.disconnect();
        }
      },
      /* No lead-in: a 400 px margin still caught the monitor on a desktop
         first screen, which defeated the point. It attaches when the frame is
         actually on screen, which is also the moment it can be seen. */
      { rootMargin: "0px", threshold: 0.01 },
    );
    io.observe(shell);
    return () => io.disconnect();
  }, [attached]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !motionAllowed || !attached) return;
    /*
     * Reflect the intent immediately: the transport must read "Pause" from the
     * moment autoplay starts, not one `play` event later. The event handlers
     * still own the truth; a rejected play simply resets the state.
     */
    setPlaying(true);
    video.play().catch(() => setPlaying(false));
  }, [motionAllowed, attached]);

  const toggle = () => {
    /* A click before the clip is attached means the visitor wants it now, so
       skip the visibility wait and start it as soon as metadata lands. */
    if (!attached) {
      pendingPlay.current = true;
      setAttached(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setPlaying(true);
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  };

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrent(value);
  };

  const progress = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <section aria-label={label} className="px-4 md:px-6">
      <div className="mx-auto max-w-[1280px]">
        <div className="clay-lg rounded-[40px] bg-surface p-3 md:p-4">
          <div
            ref={shellRef}
            className="clay-inset relative overflow-hidden rounded-[28px] bg-ink"
          >
            <video
              ref={videoRef}
              className="aspect-video w-full object-cover"
              src={attached ? src : undefined}
              poster={poster}
              muted
              loop
              playsInline
              preload={attached && motionAllowed ? "metadata" : "none"}
              aria-label={`Looping render — ${title}`}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onLoadedMetadata={(event) => {
                setDuration(event.currentTarget.duration);
                if (pendingPlay.current) {
                  pendingPlay.current = false;
                  setPlaying(true);
                  void event.currentTarget.play().catch(() => setPlaying(false));
                }
              }}
              onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
            />
          </div>

          <div className="mt-3 flex items-center gap-3 px-1 md:gap-5 md:px-3">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause reel" : "Play reel"}
              aria-pressed={playing}
              className="clay-btn !h-12 !w-12 shrink-0 !p-0"
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="font-meta text-meta tabular-nums text-muted">
                {formatTime(current)}
              </span>
              <input
                type="range"
                className="scrub min-w-0 flex-1"
                min={0}
                max={duration || 0}
                step={0.01}
                value={Math.min(current, duration || 0)}
                disabled={!duration}
                aria-label="Reel position"
                aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
                onChange={(event) => seek(Number(event.target.value))}
                style={{ "--progress": `${progress}%` } as CSSProperties}
              />
              <span className="font-meta text-meta tabular-nums text-faint">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-3 px-1 pb-1 md:px-3 md:pb-2">
            <div className="min-w-0">
              <span className="flex items-center gap-2 font-meta text-meta uppercase text-faint">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                Reel
              </span>
              <Link
                href={href}
                className="mt-1 block break-words font-display text-title text-ink transition-colors hover:text-accent"
              >
                {title}
              </Link>
            </div>
            <span className="font-meta text-meta uppercase text-faint">{meta}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
