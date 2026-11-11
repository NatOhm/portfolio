"use client";

import { useState } from "react";
import type { ArchiveSummary } from "@/lib/archive";
import ArchiveCard from "@/components/ArchiveCard";

const groups = [
  "Short-form video",
  "Long-form video",
  "Motion & 3D",
  "Graphic design",
  "Photography",
] as const;

/**
 * The complete archive, filterable. Records arrive as props from the server so
 * the 500 media items behind them never enter the client bundle.
 */
export default function ArchiveIndex({ collections }: { collections: ArchiveSummary[] }) {
  const [active, setActive] = useState<(typeof groups)[number] | "All">("All");
  const filtered =
    active === "All" ? collections : collections.filter((c) => c.group === active);

  const sections =
    active === "All"
      ? groups
          .map((group) => ({ group, items: filtered.filter((c) => c.group === group) }))
          .filter((section) => section.items.length > 0)
      : [{ group: active, items: filtered }];

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter the archive by discipline"
      >
        {(["All", ...groups] as (typeof groups[number] | "All")[]).map((group) => (
          <button
            key={group}
            type="button"
            aria-pressed={active === group}
            onClick={() => setActive(group)}
            className="clay-chip"
          >
            {group}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-5 font-meta text-meta uppercase tabular-nums text-faint">
        {filtered.length} {filtered.length === 1 ? "collection" : "collections"} ·{" "}
        {filtered.reduce((sum, c) => sum + c.images + c.videos + c.documents, 0)} pieces
      </p>

      {sections.map((section) => (
        <section key={section.group} className="mt-8">
          {active === "All" ? (
            <p className="font-meta text-meta uppercase text-faint">{section.group}</p>
          ) : null}
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((collection, i) => (
              <ArchiveCard key={collection.id} collection={collection} index={i} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
