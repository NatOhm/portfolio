import { Minus, Plus } from "lucide-react";
import { capabilities } from "@/lib/content";

/* Native exclusive accordion: no client bundle, keyboard support built in. */
const exclusive = { name: "capability-drawers" } as Record<string, string>;

export default function Capabilities() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <p className="font-meta text-meta uppercase text-faint">Capabilities</p>
        <h2 className="mt-3 text-display-l text-ink">What I do</h2>

        <div className="mt-10 grid gap-3 md:mt-14">
          {capabilities.map((c, i) => (
            <details
              key={c.label}
              {...exclusive}
              open={i === 0}
              className="clay cap-item group rounded-[28px] bg-surface open:bg-surface"
            >
              <summary className="cap-row flex cursor-pointer list-none items-center gap-4 rounded-[28px] px-5 py-4 [&::-webkit-details-marker]:hidden md:px-7 md:py-5">
                <span className="cap-index font-meta text-meta tabular-nums text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="cap-label flex-1 font-display text-lg text-ink md:text-2xl">{c.label}</span>
                <span className="cap-toggle clay-sm grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface text-ink">
                  <Plus size={18} className="cap-plus" aria-hidden="true" />
                  <Minus size={18} className="cap-minus" aria-hidden="true" />
                </span>
              </summary>
              <div className="cap-panel px-5 pb-5 md:px-7 md:pb-7">
                <p className="max-w-2xl text-body text-muted">{c.detail}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
