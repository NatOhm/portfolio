import type { CSSProperties } from "react";
import { site } from "@/lib/site";

/**
 * First-paint title card: the role sets over the name, a hairline draws, then
 * the porcelain sheet lifts off the page.
 *
 * The whole sequence is CSS keyframes with a fixed timeline, so it needs no
 * client component, plays identically on the server-rendered HTML, and cannot
 * strand the page behind an overlay if scripting fails. It is `aria-hidden`
 * decoration, it never blocks a click or a scroll (`pointer-events: none`), and
 * the reduced-motion rule removes it entirely rather than shortening it. Total
 * cover is ~1.2s; the hero's own entry is offset by CSS in globals.css so it
 * begins as the sheet clears instead of playing underneath it.
 */
export default function Intro() {
  return (
    <div className="intro-curtain" aria-hidden="true">
      <div className="intro-inner">
        <p className="intro-kicker font-meta text-meta uppercase text-faint">{site.role}</p>
        <p
          className="hero-line intro-name mt-2 text-display-l text-ink"
          style={{ "--line-delay": "0.04s" } as CSSProperties}
        >
          <span>{site.shortName}</span>
        </p>
        <span className="intro-rule" />
      </div>
    </div>
  );
}
