"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { mediaDims } from "@/lib/media-dimensions";
import type { Project } from "@/lib/types";
import { useOnceInView } from "./useOnceInView";

/**
 * BlueVenture's signature: the lesson template as a spec sheet — the three
 * layouts the system repeats, plus one tick per edited lesson. The tick count
 * is read from the project's own evidence line rather than typed in, so the
 * rail and the number can never disagree.
 */
export default function LessonTemplate({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  useOnceInView(ref, "tmpl");

  const countLine = project.evidence?.find((line) => /lesson videos/i.test(line));
  const lessons = Number(countLine?.match(/\d+/)?.[0] ?? 0);
  const templateLine = project.evidence?.find((line) => /template/i.test(line));
  const frames = project.gallery.filter((item) => item.type === "image").slice(0, 3);

  if (frames.length === 0) return null;

  return (
    <section className="cs-signature px-4 pt-10 md:px-6 md:pt-14">
      <div ref={ref} className="tmpl-sheet mx-auto max-w-[1280px]">
        <div className="tmpl-head">
          {countLine ? (
            <p className="font-meta text-meta uppercase text-accent">{countLine}</p>
          ) : null}
          {templateLine ? (
            <p className="mt-1 font-meta text-meta uppercase text-faint">{templateLine}</p>
          ) : null}
        </div>

        {lessons > 0 ? (
          <div className="tmpl-rail" aria-hidden="true">
            {Array.from({ length: lessons }, (_, i) => (
              <span key={i} className="tmpl-tick" style={{ "--i": i } as CSSProperties} />
            ))}
          </div>
        ) : null}

        <ol className="tmpl-frames">
          {frames.map((item, i) => {
            const dims = mediaDims(item.src);
            return (
              <li key={item.src}>
                <p className="tmpl-index font-meta text-meta tabular-nums text-faint">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div
                  className="tmpl-frame"
                  style={{ aspectRatio: dims ? `${dims.width} / ${dims.height}` : "16 / 9" }}
                >
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
                {item.caption ? (
                  <p className="tmpl-label mt-2 font-meta text-meta uppercase text-faint">
                    {item.caption}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
