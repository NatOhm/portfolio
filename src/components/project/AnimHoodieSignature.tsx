import type { Project } from "@/lib/types";
import AngleViewer from "./AngleViewer";
import PipelineStrip from "./PipelineStrip";

/**
 * Anim Hoodie's signature: the four finished angles on one stage, with the
 * seven studio stages that produced them beside it. Both read from the project
 * record — no new claims, no invented numbers.
 */
export default function AnimHoodieSignature({ project }: { project: Project }) {
  return (
    <section className="cs-signature px-4 pt-10 md:px-6 md:pt-14">
      <div className="mx-auto grid max-w-[1280px] gap-9 md:grid-cols-12 md:gap-10">
        <div className="min-w-0 md:col-span-8">
          <AngleViewer items={project.gallery} />
        </div>
        <div className="min-w-0 md:col-span-4 md:self-center">
          <PipelineStrip />
        </div>
      </div>
    </section>
  );
}
