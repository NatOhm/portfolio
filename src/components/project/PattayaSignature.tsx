import type { Project } from "@/lib/types";
import PattayaFeed from "./PattayaFeed";

/** Pattaya Guide's signature: the weekly system seen as the feed it shipped to. */
export default function PattayaSignature({ project }: { project: Project }) {
  return (
    <section className="cs-signature px-4 pt-10 md:px-6 md:pt-14">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto max-w-[24rem]">
          <PattayaFeed project={project} />
        </div>
      </div>
    </section>
  );
}
