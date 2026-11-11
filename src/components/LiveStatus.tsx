"use client";

import { useEffect, useState } from "react";

const CLOCK = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Bangkok",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/**
 * Local time in Khon Kaen, ticking once a minute.
 *
 * The first render is a placeholder on both server and client so hydration never
 * disagrees; the real time appears on mount and is refreshed by a timer aligned
 * to the next minute boundary rather than a blind interval, so the displayed
 * minute does not lag by up to a minute.
 */
export default function LiveStatus({ city = "Khon Kaen" }: { city?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let minuteTimer: number | undefined;
    let ticker: number | undefined;

    const paint = () => setTime(CLOCK.format(new Date()));

    const schedule = () => {
      const now = Date.now();
      const next = 60_000 - (now % 60_000);
      minuteTimer = window.setTimeout(() => {
        paint();
        schedule();
      }, next + 50);
    };

    paint();
    schedule();
    /* A second, cheap nudge so a throttled background tab catches up when it
       comes back instead of waiting out a stretched timer. */
    ticker = window.setInterval(paint, 30_000);

    return () => {
      if (minuteTimer) window.clearTimeout(minuteTimer);
      if (ticker) window.clearInterval(ticker);
    };
  }, []);

  return (
    <p className="live-status font-meta text-meta uppercase text-faint">
      <span aria-hidden="true" className="live-dot" />
      <span>
        {city} · <time suppressHydrationWarning>{time ?? "--:--"}</time> · Available for freelance
      </span>
    </p>
  );
}
