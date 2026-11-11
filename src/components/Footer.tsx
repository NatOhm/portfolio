import Link from "next/link";
import GiantWordmark from "@/components/GiantWordmark";
import LiveStatus from "@/components/LiveStatus";
import { profile, socials } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="mt-8 overflow-hidden px-4 pb-10 md:px-6 md:pb-14">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-7 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg text-ink">{profile.name}</p>
          <p className="mt-1 font-meta text-meta uppercase text-faint">{profile.role}</p>
        </div>

        <nav className="flex flex-wrap gap-2" aria-label="Elsewhere">
          <Link href="/contact" className="clay-chip">
            Contact
          </Link>
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="clay-chip"
            >
              {social.label}
            </a>
          ))}
        </nav>

        <p className="font-meta text-meta uppercase text-faint">
          © {new Date().getFullYear()} — Designed &amp; built with intent.
        </p>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1280px] justify-center md:mt-16">
        <LiveStatus />
      </div>

      <GiantWordmark text={profile.name.split(" ")[0]} />
    </footer>
  );
}
