"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import MobileMenu from "@/components/MobileMenu";
import { thai } from "@/lib/thai";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isThai = pathname.startsWith("/th");
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  /*
   * Hide on scroll down, reveal on scroll up. A plain listener plus a CSS
   * transform, so the header never renders differently on the server.
   */
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY && y > 120);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out",
          hidden ? "-translate-y-28" : "translate-y-0",
        )}
      >
        <div className="mx-auto max-w-[1280px] px-3 pt-3 md:px-6 md:pt-5">
          <nav className="clay flex items-center gap-1.5 rounded-[22px] bg-surface py-2 pr-2 pl-3 md:gap-2 md:pr-3 md:pl-4">
            <Link
              href="/"
              className="mr-auto flex items-center gap-2 rounded-full py-1 font-display text-base font-semibold tracking-tight text-ink"
            >
              {profile.name.split(" ")[0]}
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {(isThai ? thai.nav : links).map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "clay-press bg-well text-ink"
                        : "text-muted hover:bg-surface hover:text-ink",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <Link
              href={isThai ? "/" : "/th"}
              hrefLang={isThai ? "en" : "th"}
              lang={isThai ? "en" : "th"}
              aria-label={isThai ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
              className="clay-chip ml-1 font-meta text-meta uppercase"
            >
              {isThai ? "EN" : "ไทย"}
            </Link>
            <a
              href={site.resumePath}
              download={site.resumeFilename}
              className="clay-chip ml-1 hidden lg:inline-flex"
            >
              Résumé
            </a>
            <a
              href={`mailto:${site.email}`}
              className="clay-btn clay-btn-accent hidden !px-4 md:inline-flex"
            >
              Let’s talk
            </a>

            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-label="Open menu"
              className="clay-btn !min-h-11 !px-4 md:hidden"
            >
              Menu
            </button>
          </nav>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={menuBtnRef}
        links={isThai ? thai.nav : links}
      />
    </>
  );
}
