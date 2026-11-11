import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { projectLogos } from "@/lib/logos";
import { profile } from "@/lib/content";
import { site } from "@/lib/site";
import { thai } from "@/lib/thai";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "นักออกแบบมัลติมีเดีย — ขอนแก่น",
  description: thai.hero.statement,
  alternates: {
    canonical: "/th",
    languages: { en: "/", th: "/th" },
  },
  openGraph: {
    title: profile.name + " — " + thai.hero.headline,
    description: thai.hero.statement,
    locale: "th_TH",
  },
};

const selected = projects.slice(0, 3);

export default function ThaiHome() {
  /* Same logo pickup as the English home and the work index. */
  const logos = projectLogos(selected.map((project) => project.slug));

  return (
    <div lang="th" className="thai-type">
      {/* Front door: same clay grammar, Thai voice. */}
      <section className="px-4 pt-28 pb-10 md:px-6 md:pt-36 md:pb-14">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-meta text-meta uppercase text-faint">{thai.hero.eyebrow}</p>
          <h1 className="rise mt-5 max-w-4xl text-display-xl text-ink">
            {thai.hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lede text-muted">{thai.hero.statement}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/work" className="clay-btn clay-btn-accent">
              {thai.hero.primary}
            </Link>
            <a href={"mailto:" + site.email} className="clay-btn">
              {thai.hero.secondary}
            </a>
            <a
              href={site.resumePath}
              download={site.resumeFilename}
              className="font-meta text-meta uppercase text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
            >
              เรซูเม่ (PDF)
            </a>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-5 font-meta text-meta uppercase text-faint">
            <div className="flex items-center gap-2">
              <dt className="sr-only">ที่ตั้ง</dt>
              <dd>{thai.hero.location}</dd>
            </div>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
              <dt className="sr-only">สถานะ</dt>
              <dd>{thai.hero.availability}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Intro */}
      <section className="px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-[1280px] gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <p className="font-meta text-meta uppercase text-faint">{thai.intro.label}</p>
            <h2 className="mt-3 font-display text-title text-ink md:text-3xl">
              {thai.intro.title}
            </h2>
          </div>
          <div className="space-y-5 md:col-span-8">
            {thai.intro.body.map((paragraph) => (
              <p key={paragraph} className="max-w-2xl text-body text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="px-4 pb-12 md:px-6 md:pb-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-meta text-meta uppercase text-faint">{thai.work.label}</p>
              <h2 className="mt-3 text-display-l text-ink">{thai.work.title}</h2>
            </div>
            <Link
              href={thai.work.allHref}
              className="clay-chip font-meta text-meta uppercase"
            >
              {thai.work.all} →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {selected.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                size="md"
                logo={logos[project.slug]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-4 pb-12 md:px-6 md:pb-20">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-meta text-meta uppercase text-faint">{thai.capabilities.label}</p>
          <h2 className="mt-3 text-display-l text-ink">{thai.capabilities.title}</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {thai.capabilities.items.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.04}>
                <div className="clay h-full rounded-[28px] bg-surface p-6 md:p-8">
                  <span className="font-meta text-meta uppercase tabular-nums text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-title text-ink">{item.label}</h3>
                  <p className="mt-3 text-sm text-muted">{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="px-4 pb-12 md:px-6 md:pb-20">
        <div className="mx-auto grid max-w-[1280px] gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <p className="font-meta text-meta uppercase text-faint">{thai.about.label}</p>
            <h2 className="mt-3 font-display text-title text-ink md:text-3xl">
              {thai.about.title}
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="max-w-2xl text-lede text-muted">{thai.about.body}</p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 font-meta text-meta uppercase text-accent"
            >
              {thai.about.cta} →
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 pb-16 md:px-6 md:pb-24">
        <div className="clay-lg mx-auto max-w-[1280px] rounded-[40px] bg-surface p-6 md:p-12">
          <p className="font-meta text-meta uppercase text-faint">{thai.contact.label}</p>
          <h2 className="mt-3 text-display-l text-ink">{thai.contact.title}</h2>
          <p className="mt-4 max-w-xl text-body text-muted">{thai.contact.body}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a href={"mailto:" + site.email} className="clay-btn clay-btn-accent">
              {thai.contact.cta}
            </a>
            <Link href="/contact" className="clay-chip">
              /contact
            </Link>
            <span className="font-meta text-meta uppercase text-faint">{site.email}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
