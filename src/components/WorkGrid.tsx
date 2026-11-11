"use client";

import { useState } from "react";
import { projects } from "@/lib/projects";
import { Disciplines } from "@/lib/types";
import ProjectCard from "@/components/ProjectCard";

/** Filter taxonomy matches the plan's work index filters (BUILD_PLAN §6.1). */
const categories: Disciplines[] = ["Video", "Motion", "3D", "Graphic Design"];

export default function WorkGrid({ logos }: { logos?: Record<string, string> }) {
  const [active, setActive] = useState<Disciplines | "All">("All");

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.disciplines.includes(active));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter work by discipline">
        {(["All", ...categories] as (Disciplines | "All")[]).map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={active === category}
            onClick={() => setActive(category)}
            className="clay-chip"
          >
            {category}
          </button>
        ))}
      </div>

      <p
        aria-live="polite"
        className="mt-5 font-meta text-meta uppercase tabular-nums text-faint"
      >
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
      </p>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-body text-muted">
          No projects in this category yet.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              size="md"
              logo={logos?.[project.slug]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
