import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { projectLogos } from "@/lib/logos";
import ProjectCard from "@/components/ProjectCard";

const sizes: ("sm" | "md" | "lg")[] = ["lg", "sm", "md", "sm", "lg", "md"];

export default function SelectedWork() {
  const projects = getFeaturedProjects();
  /* Same pickup as the work index: a project folder with a logo.* shows the
     mark here too, so the two grids never disagree about a project. */
  const logos = projectLogos(projects.map((project) => project.slug));

  return (
    <section className="px-4 py-16 md:px-6 md:py-24" id="work">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-meta text-meta uppercase text-faint">Selected work</p>
            <h2 className="mt-3 text-display-l text-ink">On the bench</h2>
          </div>
          <Link href="/work" className="clay-chip">
            All work
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:mt-14 md:grid-cols-6 md:gap-y-14">
          {projects.map((p, i) => {
            const size = sizes[i % sizes.length];
            const span =
              size === "lg" ? "md:col-span-4" : size === "md" ? "md:col-span-3" : "md:col-span-2";
            const offset = i % 2 === 1 && size !== "lg" ? "md:mt-14" : "";
            return (
              <div key={p.slug} className={`${span} ${offset}`}>
                <ProjectCard project={p} index={i} size={size} logo={logos[p.slug]} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
