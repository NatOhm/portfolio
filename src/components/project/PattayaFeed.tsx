"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import type { Project } from "@/lib/types";

/** The client's own account — this case study was made for it. */
const HANDLE = "@pattayaguide.thailand";
const INSTAGRAM = "https://www.instagram.com/pattayaguide.thailand/";

/**
 * The work as the account published it: a phone frame, the real handle, and a
 * three-up grid of posts from the project gallery, topped up with the cover so
 * the grid is full. The grid is decoration on top of the gallery below, so it
 * is hidden from assistive tech rather than reading the same nine images twice.
 */
export default function PattayaFeed({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.dataset.tide = "shown";
      return;
    }

    el.dataset.tide = "pending";
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.dataset.tide = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "-6% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const posts = project.gallery.filter((item) => item.type === "image");
  const tiles = [...posts];
  while (tiles.length > 0 && tiles.length < 9) tiles.push(project.cover);

  return (
    <figure ref={ref} className="tide-feed">
      <div className="tide-phone mx-auto">
        <div className="tide-phone-head">
          <span className="tide-avatar" aria-hidden="true">
            <Image src={project.cover.src} alt="" fill sizes="36px" className="object-cover" />
          </span>
          <a href={INSTAGRAM} className="tide-handle text-ink" rel="noreferrer noopener" target="_blank">
            {HANDLE}
          </a>
        </div>

        <div className="tide-grid" aria-hidden="true">
          {tiles.slice(0, 9).map((tile, i) => (
            <span
              key={`${tile.src}-${i}`}
              className="tide-tile"
              style={{ "--i": i } as CSSProperties}
            >
              <Image
                src={tile.src}
                alt=""
                fill
                sizes="(max-width: 480px) 30vw, 120px"
                className="object-cover"
              />
            </span>
          ))}
        </div>
      </div>

      {project.evidence?.[0] ? (
        <figcaption className="tide-caption mt-3 font-meta text-meta uppercase text-faint">
          {project.evidence[0]}
        </figcaption>
      ) : null}
    </figure>
  );
}
