import { ResponsiveImage } from "@/components/Media";
import { freeWorkSeries, type FreeWorkSeries } from "@/lib/freework";

/**
 * The personal library wall. Grouped by series rather than one endless
 * masonry: the club posters are a uniform set, the infographic boards are very
 * tall, and the 3D captures are small originals that must not be upscaled.
 * No per-tile reveal wrapper — these are decorative archive items and the
 * observer cost is not worth it (ARCHITECTURE.md §14).
 */
export default function FreeWorkStrip() {
  return (
    <section className="mt-24 border-t border-line pt-14 md:mt-32 md:pt-20">
      <p className="font-meta text-meta uppercase text-faint">Free time</p>
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="text-display-l text-ink">Made between projects</h2>
        <p className="max-w-md text-sm text-muted md:text-right">
          Poster art, photo manipulation, lettering studies, club posters and 3D experiments made
          outside client briefs — the personal graphic library, grouped by series.
        </p>
      </div>

      <div className="mt-12 space-y-16 md:mt-16 md:space-y-24">
        {freeWorkSeries.map((series) => (
          <SeriesBlock key={series.id} series={series} />
        ))}
      </div>
    </section>
  );
}

function SeriesBlock({ series }: { series: FreeWorkSeries }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-title text-ink">{series.title}</h3>
        <p className="font-meta text-meta uppercase tabular-nums text-faint">
          {String(series.pieces.length).padStart(2, "0")} pieces
        </p>
      </div>
      {series.note ? <p className="mt-1 max-w-xl text-sm text-muted">{series.note}</p> : null}

      {series.layout === "masonry" ? (
        <div className="mt-6 columns-2 gap-4 md:columns-3 md:gap-6">
          {series.pieces.map((piece) => (
            <ResponsiveImage
              key={piece.src}
              src={piece.src}
              alt={piece.alt}
              sizes="(max-width: 768px) 45vw, 30vw"
              className="mb-4 break-inside-avoid md:mb-6"
            />
          ))}
        </div>
      ) : null}

      {series.layout === "grid" ? (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {series.pieces.map((piece) => (
            <ResponsiveImage
              key={piece.src}
              src={piece.src}
              alt={piece.alt}
              sizes="(max-width: 768px) 45vw, 30vw"
            />
          ))}
        </div>
      ) : null}

      {series.layout === "boards" ? (
        <div className="mt-6 grid items-start gap-6 md:grid-cols-2 md:gap-8">
          {series.pieces.map((piece) => (
            <ResponsiveImage
              key={piece.src}
              src={piece.src}
              alt={piece.alt}
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          ))}
        </div>
      ) : null}

      {series.layout === "small" ? (
        /* Shown at native size: these captures are 206 px wide. */
        <ul className="mt-6 flex flex-wrap gap-4">
          {series.pieces.map((piece) => (
            <li key={piece.src} className="w-[calc(50%-0.5rem)] max-w-[206px]">
              <ResponsiveImage src={piece.src} alt={piece.alt} sizes="206px" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
