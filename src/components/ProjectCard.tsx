import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/types";
import { mediaDims } from "@/lib/media-dimensions";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";
import CardPreview from "@/components/CardPreview";

/* Taller covers than the previous 4/3 default: the stills are the argument. */
const heights: Record<string, string> = {
  sm: "aspect-[3/4]",
  md: "aspect-[5/4]",
  lg: "aspect-[16/10]",
};

/**
 * A print on the bench: the still sits on a paper mat, the caption strip sits
 * under it. The project's own accent appears as a 8px dot — colour as an
 * identifier, never as text, so the work carries the hue and the type stays
 * legible.
 */
export default function ProjectCard({
  project,
  index,
  size = "md",
  logo,
}: {
  project: Project;
  index: number;
  size?: "sm" | "md" | "lg";
  /** A logo file found in the project's image folder; shown instead of the still. */
  logo?: string | null;
}) {
  const priority = project.featuredOrder === 1 && index < 2;
  /* A mark covers the hover clip, so the clip only runs behind a still. */
  const preview = !logo && project.hero.type === "video" ? project.hero : null;
  const previewDims = preview ? mediaDims(preview.src) : undefined;
  const previewPortrait = previewDims ? previewDims.height > previewDims.width : false;

  return (
    <Reveal lift={18} delay={(index % 3) * 0.06}>
      <Link
        href={`/work/${project.slug}`}
        className="card-theme clay clay-card project-card-mat group block rounded-[28px] p-2.5 md:p-3"
        data-motif={project.theme.motif}
        style={
          {
            "--project-accent": project.accent,
            "--project-tint": project.theme.tint,
            "--project-accent-deep": project.theme.accentDeep,
          } as React.CSSProperties
        }
      >
        <div
          className={cn(
            "card-cover relative overflow-hidden rounded-[20px]",
            /* Brand art is white-on-black far more often than not, so a mark
               gets the dark ground; a still keeps the light mat. */
            logo ? "bg-ink" : "bg-well",
            heights[size],
          )}
        >
          {/* One framed surface: the still and the preview share the card's
              hover/focus push, so the clip is framed exactly like the still. */}
          <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03]">
            {logo ? (
              /* A mark is read whole, never cropped: it sits inset on the mat. */
              <div className="absolute inset-[13%]">
                <Image src={logo} alt="" fill sizes="(max-width: 1024px) 50vw, 420px" className="object-contain" />
              </div>
            ) : (
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                fill
                priority={priority}
                sizes={
                  size === "lg"
                    ? "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 960px"
                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                }
                className="object-cover"
              />
            )}
            {preview ? (
              <CardPreview src={preview.src} poster={preview.poster} portrait={previewPortrait} />
            ) : null}
          </div>
        </div>

        <div className="card-caption px-2 pt-4 pb-1.5">
          <div className="card-meta flex items-start gap-2 font-meta text-meta uppercase text-faint">
            <span
              aria-hidden="true"
              className="card-dot mt-[0.2em] h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: project.accent }}
            />
            {/* Wraps rather than ellipsizing: a three-discipline label is longer
                than the row at the paddy theme's tracking, and "GRAPHIC DE…"
                read as a broken word next to the year. Each discipline is kept
                whole, so the line breaks after a separator instead of splitting
                "Graphic" from "Design". */}
            <span className="card-kicker min-w-0 leading-[1.35]">
              {project.disciplines.map((discipline, index) => (
                <Fragment key={discipline}>
                  {index > 0 ? " · " : null}
                  <span className="whitespace-nowrap">{discipline}</span>
                </Fragment>
              ))}
            </span>
            <span className="card-year ml-auto shrink-0 tabular-nums">{project.year}</span>
          </div>
          <h3 className="card-title mt-2.5 break-words font-display text-title text-ink">
            {project.title}
          </h3>
          <p className="card-roles mt-1 text-sm text-muted">{project.roles.join(", ")}</p>
        </div>
      </Link>
    </Reveal>
  );
}
