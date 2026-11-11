"use client";

import Link from "next/link";
import { profile, socials } from "@/lib/content";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";
import CopyEmail from "@/components/CopyEmail";

export default function ContactBody() {
  return (
    <article>
      <section className="px-4 pt-28 pb-10 md:px-6 md:pt-36 md:pb-14">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-meta text-meta uppercase text-faint">Contact</p>
          <h1 className="rise mt-4 text-display-l text-ink">Say hello.</h1>
          <p className="mt-6 max-w-xl text-body text-muted">
            {profile.availability} — commissions, collaborations, and full-time roles are all open
            for conversation.
          </p>
        </div>
      </section>

      <Reveal className="px-4 pb-14 md:px-6 md:pb-20">
        <div className="clay-lg mx-auto max-w-[1280px] rounded-[40px] bg-surface p-6 md:p-12">
          <p className="font-meta text-meta uppercase text-faint">Email</p>
          <div className="mt-3">
            <CopyEmail email={site.email} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href={`mailto:${site.email}`} className="clay-btn clay-btn-accent">
              Write an email
            </a>
            <span className="font-meta text-meta uppercase text-faint">{profile.location}</span>
          </div>
        </div>
      </Reveal>

      {socials.length > 0 ? (
      <section className="px-4 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-meta text-meta uppercase text-faint">Elsewhere</p>
          <div className="mt-6 grid gap-3">
            {socials.map((social, i) => (
              <Reveal key={social.label} delay={i * 0.04}>
                <a
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="clay clay-card group flex items-center justify-between gap-4 rounded-[24px] bg-surface px-5 py-4 md:px-7 md:py-5"
                >
                  <span className="font-display text-lg text-ink group-hover:text-accent md:text-2xl">
                    {social.label}
                  </span>
                  <span aria-hidden="true" className="clay-nudge text-muted">
                    →
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      <nav className="mx-auto grid max-w-[1280px] gap-4 px-4 pb-6 md:grid-cols-2 md:px-6 md:pb-10" aria-label="Continue">
        <Link
          href="/work"
          className="clay clay-card group rounded-[28px] bg-surface p-6 md:p-8"
        >
          <span className="font-meta text-meta uppercase text-faint">← See</span>
          <span className="mt-2 block font-display text-title text-ink group-hover:text-accent">
            The work
          </span>
        </Link>
        <Link
          href="/about"
          className="clay clay-card group rounded-[28px] bg-surface p-6 text-right md:p-8"
        >
          <span className="font-meta text-meta uppercase text-faint">Learn</span>
          <span className="mt-2 block font-display text-title text-ink group-hover:text-accent">
            About me
          </span>
        </Link>
      </nav>
    </article>
  );
}
