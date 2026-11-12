"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Project } from "@/lib/types";
import { MediaItem, MediaGallery } from "@/components/Media";
import { mediaDims } from "@/lib/media-dimensions";
import Reveal from "@/components/Reveal";
import ProjectSignature from "@/components/project/Signature";
import CompareSlider from "@/components/CompareSlider";
import ProjectShader from "@/components/ProjectShader";
import { MENGER, GRID, HEXAGONS } from "@/lib/shaders";

/**
 * Oversized marks that sit behind the band. Only projects with a real,
 * owned name get one: TK's registered Thai name and the club's own mark.
 */
const WATERMARKS: Partial<Record<string, { text: string; mark: "thai" | "stamp" }>> = {
  "tk-campaign": { text: "ทีเค ทรัพย์เจริญรุ่งเรือง", mark: "thai" },
  "en-kku": { text: "ENPHOTO", mark: "stamp" },
};

/**
 * The backdrop field, by project slug. Each is a port of a study made for these
 * pages: ENPHOTO gets the raymarched fly-through, the 3D environment study the
 * receding grid, and Anim Hoodie the hexagon subdivision.
 */
const SHADERS: Record<
  string,
  { source: string; quality?: number; heavy?: boolean; hue?: number }
> = {
  "en-kku": {
    source: MENGER,
    heavy: true,
  },
  "sci-fi-environments": {
    source: GRID,
  },
  "anim-hoodie": {
    source: HEXAGONS,
    /* A slow rotation of the panel palette; the only field that drifts. */
    hue: 0.55,
  },
  "tk-campaign": {
    source: HEXAGONS,
  },
  "pattaya-guide": {
    source: GRID,
  },
  "nong-kati-store": {
    source: MENGER,
    heavy: true,
  },
};

const CONTEXT_LABELS: Record<Project["context"], string> = {
  client: "Client work",
  freelance: "Freelance",
  academic: "Academic project",
  internship: "Internship",
  club: "Club work",
  personal: "Personal work",
};

/** Narrative sections, rendered in order — only fields the project has. */
const NARRATIVE: { key: "brief" | "approach" | "process" | "result"; label: string }[] = [
  { key: "brief", label: "Brief" },
  { key: "approach", label: "Approach" },
  { key: "process", label: "Process" },
  { key: "result", label: "Result" },
];

/** Months, so "1 November 2026" is not read as a figure with a unit. */
const MONTHS = /(january|february|march|april|may|june|july|august|september|october|november|december)/i;

/**
 * Pull the figures out of the evidence sentences: the number and the noun after
 * it. Years and dates are skipped — a date is a timestamp, not a statistic — and
 * anything without a unit is dropped, so the strip never shows a bare digit.
 */
function figuresFrom(evidence: string[]): { value: number; unit: string; raw: string }[] {
  const text = evidence.join(" ");
  const found: { value: number; unit: string; raw: string }[] = [];
  const pattern = /(\d[\d,]*)\s*([A-Za-z][A-Za-z&/+'-]*(?:\s+[A-Za-z][A-Za-z&/+'-]*){0,2})/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null && found.length < 4) {
    const value = Number(match[1].replace(/,/g, ""));
    /* Keep the noun phrase up to the first conjunction or preposition, so
       "19 weeks of active production" labels as "weeks" and "in place since"
       is dropped rather than shown as a statistic. Months and bare "1" are
       rejected: a date is a timestamp, not a number about the work. */
    const stop = /^(and|or|in|of|at|to|with|for|on|by|the|a|an|as|since|per|live)$/i;
    const kept: string[] = [];
    for (const word of match[2].trim().split(/\s+/)) {
      if (stop.test(word)) break;
      kept.push(word);
    }
    /* A one-letter trailing token is the next sentence starting, not a unit. */
    while (kept.length > 0 && kept[kept.length - 1].length < 2) kept.pop();
    const unit = kept.join(" ");
    if (!unit || value < 2) continue;
    if (!Number.isFinite(value) || value === 0) continue;
    if (value >= 1900 && value <= 2100) continue;
    if (MONTHS.test(unit)) continue;
    if (found.some((figure) => figure.raw === match![0])) continue;
    found.push({ value, unit, raw: match[0] });
  }

  return found;
}

export default function CaseStudyBody({
  project,
  prev,
  next,
  ordinal,
}: {
  project: Project;
  prev: Project;
  next: Project;
  /** Position in the project list, shown as “02 / 08” in the hero meta. */
  ordinal?: { index: number; total: number };
}) {
  const sections = NARRATIVE.filter(({ key }) => Boolean(project[key]));
  const figures = figuresFrom(project.evidence ?? []);
  const [chapter, setChapter] = useState<string | null>(null);
  const heroDims = mediaDims(project.hero.src);
  // Cap the hero at one screen-ish height whatever its native shape, so a
  // square poster and a 9:16 turntable both open at a comparable size.
  const heroAspect = heroDims ? heroDims.width / heroDims.height : 16 / 9;

  /*
   * Section headings and gallery captions carry the hero's masked rise, but
   * only once they are on screen: one observer for the whole page writes the
   * "shown" state that CSS animates from. Kept here rather than as a wrapper
   * per caption so the markup stays semantic and no figure gains a client
   * boundary of its own. Re-runs on client-side navigation between projects.
   */
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-settle="pending"]'),
    );
    if (targets.length === 0) return;

    const show = (el: HTMLElement) => {
      el.dataset.settle = "shown";
    };

    // No observer support (or scripting blocked): show the text rather than
    // leave it behind a mask that cannot open.
    if (typeof IntersectionObserver === "undefined") {
      targets.forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      // No bottom inset: a caption sitting in the last sliver of the viewport
      // still counts as seen. With an inset it could stay masked at the very
      // bottom of a page that has nothing left to scroll.
      { rootMargin: "0px" },
    );

    /*
     * Safety net for anything the observer can miss: text that is already above
     * the viewport (a restored scroll position, a fast flick, a hash jump).
     * Masked text is invisible text, so it is always better to settle it late
     * than never.
     */
    const rescuePassed = () => {
      for (const el of targets) {
        if (el.dataset.settle === "shown") continue;
        if (el.getBoundingClientRect().bottom <= 0) {
          observer.unobserve(el);
          show(el);
        }
      }
    };

    for (const el of targets) observer.observe(el);
    window.addEventListener("scroll", rescuePassed, { passive: true });
    rescuePassed();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", rescuePassed);
    };
  }, [project.slug]);

  /* Section rail: the chapter being read is the last heading that has passed
     the 45% line of the viewport. Measured on scroll rather than with an
     intersection band, because a band is empty between two sections and the
     rail would then go dark in the gaps instead of holding the chapter you are
     still inside. */
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".cs-rail-link"),
    );
    if (links.length === 0) return;

    const targets = links
      .map((link) => {
        const id = link.getAttribute("href")!.slice(1);
        return { id, el: document.getElementById(id) };
      })
      .filter((target): target is { id: string; el: HTMLElement } => Boolean(target.el));
    if (targets.length === 0) return;

    const labels = new Map(sections.map(({ key, label }) => [`cs-${key}`, label]));

    const mark = (id: string) => {
      for (const link of links) {
        const on = link.getAttribute("href") === `#${id}`;
        if (on) {
          link.dataset.active = "true";
          link.setAttribute("aria-current", "true");
        } else {
          delete link.dataset.active;
          link.removeAttribute("aria-current");
        }
      }
      /* The gutter title reads the same state as the rail, so the two can never
         disagree about which chapter is on screen. */
      const next = labels.get(id) ?? null;
      setChapter((previous) => (previous === next ? previous : next));
    };

    let frame = 0;
    const apply = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let current = targets[0].id;
      for (const target of targets) {
        if (target.el.getBoundingClientRect().top <= line) current = target.id;
      }
      mark(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [project.slug, sections]);

  /* Figures count up once, when the strip first enters the viewport. The
     server already rendered the final number, so a failed observer or a visitor
     without motion leaves the real figure on screen. */
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-figure]"));
    if (nodes.length === 0) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = (el: HTMLElement) => {
      el.textContent = el.dataset.figure ?? el.textContent;
    };

    if (calm || typeof IntersectionObserver === "undefined") {
      nodes.forEach(finish);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          const target = Number(el.dataset.figure ?? 0);
          if (!target) continue;
          const started = performance.now();
          const step = (now: number) => {
            const t = Math.min(1, (now - started) / 640);
            const eased = 1 - (1 - t) ** 3;
            el.textContent = String(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [project.slug]);

  /* Hero parallax: the photograph drifts and settles a hair as the mat passes
     the viewport. Twenty-eight pixels over a full screen — any more and the
     mat's clay edge starts to look like a window instead of a print. Written
     as custom properties so the transform stays in CSS and the motion check
     lives in one media query. */
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".cs-hero");
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      const travel = rect.height + window.innerHeight;
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel));
      hero.style.setProperty("--cs-parallax", `${((progress - 0.5) * -28).toFixed(2)}px`);
      hero.style.setProperty("--cs-zoom", `${(1.02 - progress * 0.02).toFixed(4)}`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      hero.style.removeProperty("--cs-parallax");
      hero.style.removeProperty("--cs-zoom");
    };
  }, [project.slug]);

  return (
    /* The project's own colour identifies the page; it never colours text. */
    <article
      className="project-theme cs"
      data-motif={project.theme.motif}
      style={
        {
          "--project-accent": project.accent,
          "--project-accent-deep": project.theme.accentDeep,
          "--project-tint": project.theme.tint,
          "--color-accent": project.theme.accentDeep,
        } as React.CSSProperties
      }
    >
      <div className="project-band cs-band">
      {SHADERS[project.slug] ? <ProjectShader {...SHADERS[project.slug]} /> : null}
      <span className="cs-sheen" aria-hidden="true" />
      {WATERMARKS[project.slug] ? (
        <span
          aria-hidden="true"
          className="cs-watermark"
          data-mark={WATERMARKS[project.slug]!.mark}
        >
          {WATERMARKS[project.slug]!.text}
        </span>
      ) : null}
      <section className="px-4 pt-28 pb-8 md:px-6 md:pt-36 md:pb-12">
        <div className="mx-auto max-w-[1280px]">
          <Link
            href="/work"
            className="cs-back font-meta text-meta uppercase text-muted transition-colors hover:text-ink"
          >
            ← All work
          </Link>

          <div className="cs-head mt-6 grid gap-6 md:grid-cols-12 md:items-end">
            <h1 className="cs-title rise text-display-l text-ink md:col-span-8">{project.title}</h1>

            <div className="cs-meta md:col-span-4 md:pb-1">
              <p className="cs-context flex items-center gap-2 font-meta text-meta uppercase">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "var(--project-accent)" }}
                />
                <span className="text-accent">{CONTEXT_LABELS[project.context]}</span>
              </p>
              <p className="cs-disciplines mt-2 font-meta text-meta uppercase text-faint">
                {project.disciplines.join(" · ")}
              </p>
              <p className="cs-year mt-1 font-meta text-meta uppercase text-faint">{project.year}</p>
              {ordinal ? (
                <p className="cs-ordinal mt-1 font-meta text-meta uppercase tabular-nums text-faint">
                  {String(ordinal.index).padStart(2, "0")} / {String(ordinal.total).padStart(2, "0")}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Hero media on a clay mat, height-capped by its own aspect ratio. */}
      <Reveal className="px-4 md:px-6">
        <div
          className="cs-hero clay-lg project-mat mx-auto rounded-[32px] p-2 md:p-3"
          style={{ maxWidth: `min(1280px, 100%, calc(74vh * ${heroAspect.toFixed(4)}))` }}
        >
          <MediaItem
            meta={project.hero}
            priority
            className="w-full"
            previewLabel={project.hero.alt}
          />
        </div>
      </Reveal>

        <div
          aria-hidden="true"
          className="project-rule cs-rule mx-auto mt-10 max-w-[1280px] md:mt-14"
        />
      </div>

      <div className="cs-flow">
        {/* Chapter rail. Decorative navigation only in the sense that the page
            reads fine without it — the links are real anchors. */}
        {sections.length > 1 ? (
          <nav className="cs-rail" aria-label="Case study sections">
            <ol className="cs-rail-list">
              {sections.map(({ key, label }) => (
                <li key={key}>
                  <a href={`#cs-${key}`} className="cs-rail-link">
                    <span aria-hidden="true" className="cs-rail-tick" />
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {/* Signature and body share one surface, so the band's colour fades
            into the page below it instead of stopping at a hard edge. */}
        <ProjectSignature project={project} />

        <section className="px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-12 md:gap-12">
            <Reveal className="md:col-span-4">
              <div className="cs-spec clay project-mat sticky top-28 rounded-[28px] p-6 md:p-7">
                <dl className="cs-spec-list space-y-5">
                  <div>
                    <dt className="cs-dt font-meta text-meta uppercase text-faint">Role</dt>
                    <dd className="cs-dd mt-1 text-sm text-ink">{project.roles.join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="cs-dt font-meta text-meta uppercase text-faint">Tools</dt>
                    <dd className="cs-dd mt-1 text-sm text-ink">{project.tools.join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="cs-dt font-meta text-meta uppercase text-faint">Deliverables</dt>
                    <dd className="mt-1">
                      <ul className="space-y-1.5 text-sm text-ink">
                        {project.deliverables.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt className="cs-dt font-meta text-meta uppercase text-faint">Year</dt>
                    <dd className="cs-dd mt-1 text-sm text-ink">{project.year}</dd>
                  </div>
                  {project.credits && project.credits.length > 0 && (
                    <div>
                      <dt className="cs-dt font-meta text-meta uppercase text-faint">Credits</dt>
                      <dd className="mt-1 space-y-2 text-sm text-muted">
                        {project.credits.map((credit) => (
                          <p key={credit.role}>
                            <span className="text-ink">{credit.name}</span> — {credit.role}
                          </p>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </Reveal>

            {/* Chapter title in the empty gutter: the same active section as
                the rail, set vertically so it reads as a margin note. */}
            <div className="cs-chapter hidden md:col-span-1 md:col-start-5 md:block" aria-hidden="true">
              <p className="cs-chapter-label">{chapter ?? sections[0]?.label ?? ""}</p>
            </div>

            <div className="cs-body space-y-12 md:col-span-7 md:col-start-6">
              <Reveal>
                <p className="cs-lede text-lede text-ink">{project.summary}</p>
              </Reveal>

              {NARRATIVE.map(({ key, label }) => {
                const value = project[key];
                if (!value) return null;
                return (
                  <Reveal key={key} className="cs-section">
                    <p
                      id={`cs-${key}`}
                      data-settle="pending"
                      className="cs-label font-meta text-meta uppercase text-accent"
                    >
                      {label}
                    </p>
                    <p className="cs-text mt-3 max-w-2xl text-body text-muted">{value}</p>
                  </Reveal>
                );
              })}

              {project.evidence && project.evidence.length > 0 && (
                <Reveal>
                  <p
                    data-settle="pending"
                    className="cs-label font-meta text-meta uppercase text-accent"
                  >
                    In numbers
                  </p>
                  {figures.length >= 2 ? (
                    <ul className="cs-stats mt-4">
                      {figures.map((figure) => (
                        <li key={figure.raw} className="cs-stat">
                          <span className="cs-stat-value" data-figure={figure.value}>
                            {figure.value}
                          </span>
                          <span className="cs-stat-label">{figure.unit}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <ul className="cs-evidence clay-sm project-mat mt-4 divide-y divide-line overflow-hidden rounded-[24px]">
                    {project.evidence.map((item, i) => (
                      <li key={item} className="flex items-baseline gap-4 px-5 py-4">
                        <span className="font-meta text-meta tabular-nums text-faint">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm text-ink">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      </div>

      {project.compare ? (
        <section className="px-4 pb-14 md:px-6 md:pb-20">
          <div className="mx-auto max-w-[1280px]">
            <p
              data-settle="pending"
              className="cs-label mb-4 font-meta text-meta uppercase text-accent"
            >
              Compare — drag
            </p>
            <CompareSlider {...project.compare} />
          </div>
        </section>
      ) : null}

      {project.gallery.length > 0 && (
        <section className="cs-gallery px-4 pb-16 md:px-6 md:pb-24">
          <div className="mx-auto max-w-[1280px]">
            <p
              data-settle="pending"
              className="cs-label mb-6 font-meta text-meta uppercase text-accent"
            >
              Gallery
            </p>
            <MediaGallery items={project.gallery} />
          </div>
        </section>
      )}

      <nav
        className="cs-nav mx-auto grid max-w-[1280px] gap-4 px-4 pb-6 md:grid-cols-2 md:px-6 md:pb-10"
        aria-label="More projects"
      >
        <Link
          href={`/work/${prev.slug}`}
          className="cs-navlink clay clay-card group rounded-[28px] bg-surface p-6 md:p-8"
        >
          <span className="cs-navlabel font-meta text-meta uppercase text-faint">← Previous</span>
          <span className="mt-2 block font-display text-title text-ink group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="cs-navlink clay clay-card group rounded-[28px] bg-surface p-6 text-right md:p-8"
        >
          <span className="cs-navlabel font-meta text-meta uppercase text-faint">Next →</span>
          <span className="mt-2 block font-display text-title text-ink group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      </nav>
    </article>
  );
}
