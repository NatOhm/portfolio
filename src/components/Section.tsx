import Link from "next/link";
import { cn } from "@/lib/utils";

/** Consistent eyebrow/heading pair for page sections. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? <p className="font-meta text-meta uppercase text-faint">{eyebrow}</p> : null}
      <h2 id={id} className="mt-3 text-display-l text-ink">
        {title}
      </h2>
      {description ? <p className="mt-4 max-w-2xl text-body text-muted">{description}</p> : null}
    </div>
  );
}

/** Shared primary/secondary CTA links used across pages. */
export function CTAButtons({
  primary,
  secondary,
  className,
}: {
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Link href={primary.href} className="clay-btn clay-btn-accent">
        {primary.label}
      </Link>
      {secondary ? (
        <Link href={secondary.href} className="clay-btn clay-ghost">
          {secondary.label}
        </Link>
      ) : null}
    </div>
  );
}
