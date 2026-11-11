"use client";

import Link from "next/link";
import Image from "next/image";
import { profile, softwareGroups, education } from "@/lib/content";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";
import PortraitRipple from "@/components/PortraitRipple";

export default function AboutBody() {
  return (
    <article>
      <section className="px-4 pt-28 pb-10 md:px-6 md:pt-36 md:pb-14">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-meta text-meta uppercase text-faint">About</p>
          <h1 className="rise mt-4 max-w-4xl text-display-l text-ink">{profile.headline}</h1>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={site.resumePath}
              download={site.resumeFilename}
              className="clay-btn clay-btn-accent"
            >
              Download résumé — PDF
            </a>
            <Link href="/contact" className="clay-btn clay-ghost">
              Get in touch
            </Link>
            <span className="font-meta text-meta uppercase text-faint">
              {profile.location} · {profile.availability}
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 md:px-6 md:pb-20">
        <div className="mx-auto grid max-w-[1280px] gap-8 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-5 lg:col-span-4">
            <figure className="print">
              {/* The card itself is the ripple surface: keeping the canvas inside
                  the rounded, clipping box is what gives it the portrait's
                  corners. Nothing here changes the image, its alt text or the
                  figure's layout. */}
              <PortraitRipple className="overflow-hidden rounded-[22px] bg-well">
                <Image
                  src="/images/about/portrait.jpg"
                  alt="Portrait of Natnithichai Srikolchan standing in a concrete arcade"
                  width={1360}
                  height={2048}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 42vw, 380px"
                  className="h-auto w-full object-cover"
                  priority
                />
              </PortraitRipple>
              <figcaption className="mt-3 px-1 pb-1 font-meta text-meta uppercase text-faint">
                {profile.name} · {profile.location}
              </figcaption>
            </figure>
          </Reveal>
          <div className="md:col-span-7 lg:col-span-8">
            <Reveal>
              <p className="text-lede text-ink">{profile.intro}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-body text-muted">{profile.introAbout}</p>
              <p className="mt-5 text-body text-muted">{profile.approach}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 md:px-6 md:pb-20">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-meta text-meta uppercase text-faint">Software</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {softwareGroups.map((group, i) => (
              <Reveal key={group.group} delay={i * 0.05}>
                <div className="clay h-full rounded-[28px] bg-surface p-6">
                  <h2 className="font-meta text-meta uppercase text-muted">{group.group}</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.tools.map((tool) => (
                      <li
                        key={tool}
                        className="clay-sm rounded-full bg-surface px-3.5 py-2 text-sm font-medium text-ink"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {education.length > 0 && (
        <section className="px-4 pb-14 md:px-6 md:pb-20">
          <div className="mx-auto max-w-[1280px]">
            <p className="font-meta text-meta uppercase text-faint">Education</p>
            <div className="mt-6 space-y-4">
              {education.map((entry, i) => (
                <Reveal key={entry.school} delay={i * 0.06}>
                  <div className="clay rounded-[28px] bg-surface p-6 md:p-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h2 className="font-display text-title text-ink">{entry.school}</h2>
                      <span className="font-meta text-meta uppercase text-faint">{entry.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{entry.program}</p>
                    {entry.description && (
                      <p className="mt-3 max-w-2xl text-body text-muted">{entry.description}</p>
                    )}
                    {entry.unconfirmedDetail ? (
                      <p className="mt-3 font-meta text-meta uppercase text-faint">
                        Pending confirmation: {entry.unconfirmedDetail}
                      </p>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <nav className="mx-auto grid max-w-[1280px] gap-4 px-4 pb-6 md:grid-cols-2 md:px-6 md:pb-10" aria-label="Continue">
        <Link
          href="/experience"
          className="clay clay-card group rounded-[28px] bg-surface p-6 md:p-8"
        >
          <span className="font-meta text-meta uppercase text-faint">View</span>
          <span className="mt-2 block font-display text-title text-ink group-hover:text-accent">
            Experience
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
