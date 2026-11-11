import Image from "next/image";
import { mediaDims } from "@/lib/media-dimensions";
import type { ProjectMedia } from "@/lib/types";
import { cn } from "@/lib/utils";
import VideoPreview from "@/components/VideoPreview";

/**
 * Consistent image rendering with intrinsic dimensions from the generated
 * registry — prevents layout shift and keeps framing rules in one place.
 * The frame is a recessed clay edge; the photograph itself is never tinted or
 * shadowed in colour.
 */
export function ResponsiveImage({
  src,
  alt,
  caption,
  className,
  sizes,
  priority,
  settle,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Let the caption rise into place on entry (case-study galleries). */
  settle?: boolean;
}) {
  const dims = mediaDims(src) ?? { width: 1600, height: 900 };
  return (
    <figure className={cn("not-prose", className)}>
      <div className="clay-sm overflow-hidden rounded-[24px] bg-well">
        <Image
          src={src}
          alt={alt}
          width={dims.width}
          height={dims.height}
          sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"}
          priority={priority}
          className="h-auto w-full object-cover"
        />
      </div>
      {caption ? (
        <figcaption
          data-settle={settle ? "pending" : undefined}
          className="mt-3 font-meta text-meta uppercase text-faint"
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * User-controlled video: native controls, poster, playsInline, lazy loading.
 * Used for case-study hero clips and any non-preview video.
 */
export function ProjectVideo({
  meta,
  className,
  settle,
}: {
  meta: ProjectMedia;
  className?: string;
  settle?: boolean;
}) {
  const dims = mediaDims(meta.src);
  const ratio = dims ? (dims.width / dims.height).toFixed(2) : undefined;
  return (
    <figure className={cn("not-prose", className)}>
      <div className="clay-sm overflow-hidden rounded-[24px] bg-ink">
        <video
          src={meta.src}
          poster={meta.poster}
          width={dims?.width ?? 1920}
          height={dims?.height ?? 1080}
          aria-label={meta.alt}
          controls
          playsInline
          preload="none"
          className="h-auto w-full bg-black/20"
          style={ratio ? { aspectRatio: ratio } : undefined}
        />
      </div>
      {meta.caption ? (
        <figcaption
          data-settle={settle ? "pending" : undefined}
          className="mt-3 font-meta text-meta uppercase text-faint"
        >
          {meta.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Marked autoplayPreview media: short muted looping inline preview. */
export function MediaItem({
  meta,
  priority,
  className,
  sizes,
  settle,
  previewLabel,
}: {
  meta: ProjectMedia;
  priority?: boolean;
  className?: string;
  sizes?: string;
  settle?: boolean;
  /** Name and add a pause control to an autoplay preview (the hero clip). */
  previewLabel?: string;
}) {
  if (meta.type === "video") {
    if (meta.autoplayPreview) {
      const dims = mediaDims(meta.src);
      return (
        <figure className={cn("not-prose", className)}>
          <div className="clay-sm overflow-hidden rounded-[24px] bg-well">
            <VideoPreview
              src={meta.src}
              poster={meta.poster}
              width={dims?.width}
              height={dims?.height}
              label={previewLabel}
              className="h-auto w-full"
            />
          </div>
          {meta.caption ? (
            <figcaption
              data-settle={settle ? "pending" : undefined}
              className="mt-3 font-meta text-meta uppercase text-faint"
            >
              {meta.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    return <ProjectVideo meta={meta} className={className} settle={settle} />;
  }
  return (
    <ResponsiveImage
      src={meta.src}
      alt={meta.alt}
      caption={meta.caption}
      priority={priority}
      className={className}
      sizes={sizes}
      settle={settle}
    />
  );
}

/** Mixed media gallery — one renderer for image and video items. */
export function MediaGallery({
  items,
  className,
}: {
  items: ProjectMedia[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <ul className={cn("grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8", className)}>
      {items.map((item, i) => (
        <li
          key={item.src}
          data-settle="pending"
          className={i === 0 ? "md:col-span-2" : undefined}
        >
          <MediaItem
            meta={item}
            settle
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 900px"
          />
        </li>
      ))}
    </ul>
  );
}
