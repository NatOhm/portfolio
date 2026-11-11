"use client";

import Link from "next/link";
import { experience } from "@/lib/content";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";

/** Lead discipline -> the tint the entry carries on the timeline. */
const TRACKS: Record<string, "video" | "motion" | "3d" | "graphic"> = {
  Video: "video",
  Motion: "motion",
  "3D": "3d",
  "Graphic Design": "graphic",
};

const MARKS: Record<"video" | "motion" | "3d" | "graphic", string> = {
  video: "VID",
  motion: "MOT",
  "3d": "3D",
  graphic: "GRF",
};

function trackOf(disciplines: string[]): "video" | "motion" | "3d" | "graphic" {
  return (disciplines[0] && TRACKS[disciplines[0]]) || "graphic";
}

/** Rail label: drop the legal suffix and any Thai name in brackets, keeping the
 *  trading name — "Me Style Solution Co., Ltd." reads as "Me Style Solution",
 *  and a studio keeps the word Studio because it is part of the name. */
function shortOrg(name: string): string {
  const trimmed = name
    .replace(/\(.*?\)/g, " ")
    .replace(/\bCo\.?,?\s*(Ltd\.?)?/gi, " ")
    .replace(/\bCompany\b/gi, " ")
    .replace(/[,\s]+/g, " ")
    .replace(/[\s.]+$/, "")
    .trim();
  return trimmed || name;
}

const span = "2020–2026";

export default function ExperienceBody() {
  const disciplines = Array.from(new Set(experience.flatMap((entry) => entry.disciplines)));

  return (
    <article className="exp-page">
      <header className="px-4 pt-28 pb-10 md:px-6 md:pt-36 md:pb-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-meta text-meta uppercase text-faint">Experience</p>
            <p className="font-meta text-meta uppercase tabular-nums text-faint">
              {experience.length} roles · {span}
            </p>
          </div>

          <h1 className="rise mt-4 max-w-3xl text-display-l text-ink">
            Where I’ve worked and what I’ve built.
          </h1>

          <div className="exp-hero-row">
            <p className="exp-deck">
              Video, motion, 3D and graphic design — from a university photo club to a national
              agricultural brand and a twenty-lesson insurance e-learning series.
            </p>
            <a
              href={site.resumePath}
              download={site.resumeFilename}
              className="clay-btn clay-btn-accent"
            >
              Download résumé — PDF
            </a>
          </div>

          {/* Decorative span: the numbers are already in the meta line above, so
              this is set as a graphic rather than read twice. */}
          <p className="exp-years" aria-hidden="true">
            2020 &mdash; 2026
          </p>
        </div>
      </header>

      <section className="px-4 pb-16 md:px-6 md:pb-24">
        <div className="exp-layout mx-auto max-w-[1280px]">
          <nav className="exp-rail" aria-label="Experience index">
            <p className="font-meta text-meta uppercase text-faint">Index</p>
            <ol className="mt-4 space-y-1">
              {experience.map((entry, i) => (
                <li key={entry.organization + "-" + entry.date}>
                  <a href={`#role-${i + 1}`} className="exp-rail-link">
                    <span className="exp-rail-num">{String(i + 1).padStart(2, "0")}</span>
                    <span>{shortOrg(entry.organization)}</span>
                  </a>
                </li>
              ))}
            </ol>
            <p className="exp-rail-note">Newest first · {disciplines.length} disciplines</p>
          </nav>

          <ol className="exp-list">
            {experience.map((entry, i) => {
              const track = trackOf(entry.disciplines);
              return (
                <li
                  key={entry.organization + "-" + entry.date}
                  id={`role-${i + 1}`}
                  className="exp-item"
                  data-track={track}
                >
                  <Reveal delay={i * 0.04}>
                    <div className="exp-card">
                      <div className="exp-head">
                        <div className="exp-head-left">
                          <span className="exp-ordinal" aria-hidden="true">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="exp-mark" aria-hidden="true">
                            {MARKS[track]}
                          </span>
                          <span className="exp-type">{entry.type}</span>
                        </div>
                        <div className="exp-head-right">
                          {i === 0 ? <span className="exp-now">Latest</span> : null}
                          <span className="exp-year tabular-nums">{entry.date}</span>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-6 md:grid-cols-12 md:gap-10">
                        <div className="md:col-span-4">
                          <h2 className="exp-role font-display text-ink">{entry.position}</h2>
                          <p className="mt-1 text-sm font-medium text-accent">
                            {entry.organization}
                          </p>
                          {entry.unconfirmedDetail ? (
                            <p className="mt-2 font-meta text-meta uppercase text-faint">
                              Pending confirmation: {entry.unconfirmedDetail}
                            </p>
                          ) : null}
                          {entry.relatedProject ? (
                            <Link
                              href={"/work/" + entry.relatedProject}
                              className="mt-3 inline-block font-meta text-meta uppercase text-muted transition-colors hover:text-accent"
                            >
                              See the case study →
                            </Link>
                          ) : null}
                        </div>

                        <div className="md:col-span-8">
                          <p className="max-w-2xl text-body text-muted">{entry.description}</p>

                          {entry.responsibilities.length > 0 && (
                            <ul className="mt-5 space-y-2">
                              {entry.responsibilities.map((responsibility) => (
                                <li
                                  key={responsibility}
                                  className="flex gap-3 text-sm text-muted"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="mt-2 h-1 w-1 shrink-0 rounded-full"
                                    style={{ backgroundColor: "var(--exp-key)" }}
                                  />
                                  <span>{responsibility}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {entry.disciplines.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2">
                              {entry.disciplines.map((discipline) => (
                                <span
                                  key={discipline}
                                  className="clay-sm rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-muted"
                                >
                                  {discipline}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <nav
        className="mx-auto grid max-w-[1280px] gap-4 px-4 pb-6 md:grid-cols-2 md:px-6 md:pb-10"
        aria-label="Continue"
      >
        <Link href="/about" className="clay clay-card group rounded-[28px] bg-surface p-6 md:p-8">
          <span className="font-meta text-meta uppercase text-faint">← Back to</span>
          <span className="mt-2 block font-display text-title text-ink group-hover:text-accent">
            About
          </span>
        </Link>
        <Link
          href="/contact"
          className="clay clay-card group rounded-[28px] bg-surface p-6 text-right md:p-8"
        >
          <span className="font-meta text-meta uppercase text-faint">Get in touch</span>
          <span className="mt-2 block font-display text-title text-ink group-hover:text-accent">
            Contact
          </span>
        </Link>
      </nav>
    </article>
  );
}
