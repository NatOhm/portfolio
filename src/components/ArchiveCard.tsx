import Image from "next/image";
import Link from "next/link";
import type { ArchiveSummary } from "@/lib/archive";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";

/**
 * One collection in the archive index. The cover is a real piece from the set;
 * the count line is the promise that nothing was sampled.
 */
export default function ArchiveCard({
  collection,
  index,
}: {
  collection: ArchiveSummary;
  index: number;
}) {
  const pieces = collection.images + collection.videos + collection.documents;
  const runtime = collection.runtime;

  return (
    <Reveal lift={14} delay={(index % 3) * 0.04}>
      <Link
        href={`/work/collection/${collection.id}`}
        className="clay clay-card group block rounded-[26px] p-2.5"
      >
        <div
          className={cn(
            "relative aspect-[5/4] overflow-hidden rounded-[18px]",
            collection.logo ? "bg-ink" : "bg-well",
          )}
        >
          {collection.logo ? (
            /* Sets that are a case study show the project's mark; the rest keep
               the cover piece, which is real work rather than branding. */
            <div className="absolute inset-[15%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
              <Image src={collection.logo} alt="" fill sizes="(max-width: 1024px) 50vw, 380px" className="object-contain" />
            </div>
          ) : collection.cover ? (
            <Image
              src={collection.cover.src}
              alt={collection.cover.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
          ) : null}
          {collection.caseStudy ? (
            <span className="absolute top-2.5 left-2.5 rounded-full bg-ink/85 px-2.5 py-1 font-meta text-[10px] tracking-[0.12em] text-canvas uppercase">
              Case study
            </span>
          ) : null}
        </div>
        <div className="px-2 pt-3.5 pb-1">
          <div className="flex items-center gap-2 font-meta text-meta uppercase text-faint">
            <span className="truncate">{collection.group}</span>
            <span className="ml-auto shrink-0 tabular-nums">{collection.year}</span>
          </div>
          <h3 className="mt-2 font-display text-title text-ink">{collection.title}</h3>
          <p className="mt-1 font-meta text-meta uppercase text-faint">
            {pieces} {pieces === 1 ? "piece" : "pieces"}
            {runtime ? ` · ${runtime}` : ""}
          </p>
        </div>
      </Link>
    </Reveal>
  );
}
