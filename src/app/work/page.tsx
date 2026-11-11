import type { Metadata } from "next";
import WorkGrid from "@/components/WorkGrid";
import ArchiveIndex from "@/components/ArchiveIndex";
import { profile } from "@/lib/content";
import { projects } from "@/lib/projects";
import { projectLogos } from "@/lib/logos";
import { archiveSummaries, archiveTotals } from "@/lib/archive";

export const metadata: Metadata = {
  title: "Work",
  description: `Selected and archived work by ${profile.name} — ${profile.role.toLowerCase()}.`,
  alternates: { canonical: "/work" },
};

const hours = (seconds: number) => String(Math.round(seconds / 3600));

export default function WorkArchivePage() {
  const pieces = archiveTotals.images + archiveTotals.videos + archiveTotals.documents;
  const runtime = hours(archiveTotals.duration);
  /* Logos are read from each project's image folder at build time; an archive
     collection borrows the mark of the case study it belongs to. */
  const logos = projectLogos(projects.map((project) => project.slug));
  const collections = archiveSummaries.map((collection) => {
    const logo = collection.caseStudy ? logos[collection.caseStudy] : undefined;
    return logo ? { ...collection, logo } : collection;
  });

  return (
    <div className="pb-16 md:pb-24">
      <section className="px-4 pt-28 md:px-6 md:pt-36">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-meta text-meta uppercase text-faint">Selected work</p>
          <h1 className="mt-3 mb-10 text-display-xl text-ink md:mb-14">All work</h1>
          <WorkGrid logos={logos} />
        </div>
      </section>

      <section
        id="archive"
        className="mt-20 px-4 md:mt-28 md:px-6"
        aria-labelledby="archive-heading"
      >
        <div className="mx-auto max-w-[1280px]">
          <p className="font-meta text-meta uppercase text-faint">Archive</p>
          <h2 id="archive-heading" className="mt-3 text-display-l text-ink">
            Every collection
          </h2>
          <p className="mt-4 max-w-[64ch] text-body text-muted">
            Every finished piece from the working library — {archiveSummaries.length}{" "}
            collections, {pieces} pieces, {runtime} h of video. Nothing sampled.
          </p>
          <div className="mt-10">
            <ArchiveIndex collections={collections} />
          </div>
        </div>
      </section>
    </div>
  );
}
