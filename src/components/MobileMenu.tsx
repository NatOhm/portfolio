"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { site } from "@/lib/site";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  links: readonly { href: string; label: string }[];
}

/**
 * Full-screen mobile menu. Handles Escape, body scroll lock, scroll
 * containment inside the panel, and focus restoration to the trigger.
 */
export default function MobileMenu({ open, onClose, triggerRef, links }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isThai = usePathname().startsWith("/th");

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const trigger = triggerRef?.current ?? null;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKey);
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="menu-panel menu-in fixed inset-0 z-[100] flex flex-col bg-canvas md:hidden"
    >
      <div className="flex items-center justify-between px-4 py-4">
        <span className="font-meta text-meta uppercase text-faint">Menu</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          autoFocus
          className="clay-btn !h-11 !w-11 !p-0"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-3 px-4 pb-8">
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="rise clay rounded-[24px] bg-surface px-5 py-4 font-display text-3xl text-ink"
            style={{ animationDelay: `${0.04 * i}s` }}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href={isThai ? "/" : "/th"}
          hrefLang={isThai ? "en" : "th"}
          lang={isThai ? "en" : "th"}
          onClick={onClose}
          className="rise clay-btn mt-3 self-start"
          style={{ animationDelay: `${0.04 * links.length}s` }}
        >
          {isThai ? "EN" : "ไทย"}
        </Link>

        <a
          href={site.resumePath}
          download={site.resumeFilename}
          onClick={onClose}
          className="rise clay-btn clay-btn-accent mt-3 self-start"
          style={{ animationDelay: `${0.04 * links.length}s` }}
        >
          Résumé
        </a>
      </nav>

      <p className="px-5 pb-8 font-meta text-meta uppercase text-faint">
        Khon Kaen · available for work
      </p>
    </div>
  );
}
