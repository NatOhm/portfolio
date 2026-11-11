import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="px-4 pt-8 pb-16 md:px-6 md:pt-10 md:pb-24">
      <div className="clay-lg mx-auto max-w-[1280px] rounded-[40px] bg-surface px-6 py-14 text-center md:px-12 md:py-20">
        <p className="font-meta text-meta uppercase text-faint">Open for work</p>
        <p className="mx-auto mt-5 max-w-3xl text-display-l text-ink">
          Have an idea?{" "}
          <span className="text-accent">Let’s make something.</span>
        </p>
        <Link href="/contact" className="clay-btn clay-btn-accent mt-9">
          Get in touch
        </Link>
      </div>
    </section>
  );
}
