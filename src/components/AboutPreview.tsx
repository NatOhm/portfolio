import Link from "next/link";
import { profile } from "@/lib/content";

export default function AboutPreview() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="clay-lg mx-auto max-w-[1280px] rounded-[40px] bg-surface p-6 md:p-12">
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <p className="font-meta text-meta uppercase text-faint">About</p>
            <p className="mt-4 text-sm text-muted">
              {profile.role}
              <br />
              {profile.location}
            </p>
          </div>

          <div className="md:col-span-8">
            <p className="text-lede text-ink">{profile.intro}</p>
            <Link href="/about" className="clay-btn mt-8">
              More about me
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
