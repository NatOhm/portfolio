import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { archive, archiveById, formatDuration, formatRuntime } from "@/lib/archive";
import type { ArchiveItem } from "@/lib/archive";
import { ogFor } from "@/lib/metadata";

export function generateStaticParams() {
  return archive.map((collection) => ({ id: collection.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const collection = archiveById.get(id);
  if (!collection) return {};
  return {
    title: `${collection.title} — archive`,
    description: collection.summary,
    alternates: { canonical: `/work/collection/${collection.id}` },
    openGraph: ogFor(`/work/collection/${collection.id}`),
  };
}

function MetaLine({ item }: { item: ArchiveItem }) {
  const detail =
    item.kind === "video"
      ? formatDuration(item.duration)
      : item.kind === "document"
        ? "PDF"
        : "";
  return (
    <p className="mt-2 flex items-baseline gap-2 font-meta text-meta uppercase text-faint">
      <span className="min-w-0 truncate">{item.caption}</span>
      {detail ? <span className="ml-auto shrink-0 tabular-nums">{detail}</span> : null}
    </p>
  );
}

function ArchiveMedia({ item }: { item: ArchiveItem }) {
  if (item.kind === "video") {
    return (
      <figure className="break-inside-avoid">
        <div className="clay-sm overflow-hidden rounded-[18px] bg-ink">
          <video
            src={item.src}
            poster={item.poster}
            width={item.width}
            height={item.height}
            aria-label={item.alt}
            controls
            playsInline
            preload="none"
            className="h-auto w-full"
            style={{ aspectRatio: `${item.width} / ${item.height}` }}
          />
        </div>
        <MetaLine item={item} />
      </figure>
    );
  }

  return (
    <figure className="break-inside-avoid">
      <a
        href={item.src}
        target="_blank"
        rel="noreferrer"
        className="clay-sm block overflow-hidden rounded-[18px] bg-well"
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="h-auto w-full"
          style={{ maxWidth: item.width }}
        />
      </a>
      <MetaLine item={item} />
      {item.download ? (
        <a
          href={item.download}
          download
          className="mt-1 inline-block font-meta text-meta uppercase text-accent underline underline-offset-4"
        >
          Download the PDF
        </a>
      ) : null}
    </figure>
  );
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = archiveById.get(id);
  if (!collection) notFound();

  const pieces = collection.images + collection.videos + collection.documents;
  const runtime = formatRuntime(collection.duration);
  const caseStudy = collection.caseStudy;

  return (
    <article>
      <section className="px-4 pt-28 pb-6 md:px-6 md:pt-36">
        <div className="mx-auto max-w-[1280px]">
          <Link
            href="/work"
            className="font-meta text-meta uppercase text-muted transition-colors hover:text-ink"
          >
            ← All work
          </Link>

          <p className="mt-8 font-meta text-meta uppercase text-faint">
            {collection.group} · {collection.year}
          </p>
          <h1 className="mt-3 max-w-[18ch] text-display-l text-ink">{collection.title}</h1>
          <p className="mt-5 max-w-[62ch] text-body text-muted">{collection.summary}</p>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-meta text-meta uppercase text-faint">
            <div className="flex gap-2">
              <dt>Pieces</dt>
              <dd className="tabular-nums text-ink">{pieces}</dd>
            </div>
            {collection.images ? (
              <div className="flex gap-2">
                <dt>Images</dt>
                <dd className="tabular-nums text-ink">{collection.images}</dd>
              </div>
            ) : null}
            {collection.videos ? (
              <div className="flex gap-2">
                <dt>Videos</dt>
                <dd className="tabular-nums text-ink">{collection.videos}</dd>
              </div>
            ) : null}
            {runtime ? (
              <div className="flex gap-2">
                <dt>Runtime</dt>
                <dd className="tabular-nums text-ink">{runtime}</dd>
              </div>
            ) : null}
            {collection.documents ? (
              <div className="flex gap-2">
                <dt>Documents</dt>
                <dd className="tabular-nums text-ink">{collection.documents}</dd>
              </div>
            ) : null}
          </dl>

          {caseStudy ? (
            <Link
              href={`/work/${caseStudy}`}
              className="mt-8 inline-flex items-center gap-2 font-meta text-meta uppercase text-accent underline underline-offset-4"
            >
              Read the case study →
            </Link>
          ) : null}
        </div>
      </section>

      <section className="px-4 pb-24 md:px-6 md:pb-32">
        <div className="mx-auto max-w-[1280px]">
          {collection.sections.map((section) => (
            <div key={section.title ?? "main"} className="mt-12 first:mt-4">
              {section.title ? (
                <h2 className="mb-4 flex items-baseline gap-3 font-meta text-meta uppercase text-faint">
                  <span className="text-ink">{section.title}</span>
                  <span className="tabular-nums">{section.items.length}</span>
                </h2>
              ) : null}
              <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
                {section.items.map((item) => (
                  <ArchiveMedia key={item.src} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
