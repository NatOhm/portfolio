import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-meta text-meta uppercase text-faint">404</p>
      <h1 className="mt-4 text-display-l text-ink">Lost the plot.</h1>
      <p className="mt-5 max-w-sm text-body text-muted">
        That page does not exist, moved, or never shipped. Head back and start again.
      </p>
      <Link href="/" className="clay-btn clay-btn-accent mt-9">
        Back to home
      </Link>
    </section>
  );
}
