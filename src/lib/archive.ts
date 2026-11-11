import generated from "./archive.generated.json";
import { coverChoices } from "./archive-covers";
import {
  archiveCollections,
  type ArchiveCollection,
} from "./archive-collections";

export type {
  ArchiveCollection,
  ArchiveGroup,
} from "./archive-collections";
export { archiveCollections } from "./archive-collections";

/**
 * One physical piece of work. `src` is a web derivative in /public/archive;
 * `source` records the file it came from so the archive can be audited.
 */
export interface ArchiveItem {
  kind: "image" | "video" | "document";
  src: string;
  thumb?: string;
  poster?: string;
  download?: string;
  width: number;
  height: number;
  duration?: number;
  /** Source subfolder, used as the section heading. */
  section?: string;
  caption: string;
  alt: string;
  source: string;
}

interface GeneratedCollection {
  id: string;
  year: string;
  items: ArchiveItem[];
  skips: Record<string, number>;
}

interface GeneratedArchive {
  generated: string;
  totals: {
    images: number;
    videos: number;
    documents: number;
    duration: number;
    bytes: number;
  };
  collections: GeneratedCollection[];
}

const manifest = generated as GeneratedArchive;

export const archiveGeneratedAt = manifest.generated;
export const archiveTotals = manifest.totals;

const byId = new Map(manifest.collections.map((c) => [c.id, c]));

export interface ArchiveCollectionView extends ArchiveCollection {
  year: string;
  items: ArchiveItem[];
  images: number;
  videos: number;
  documents: number;
  /** Runtime of every video in the collection, in seconds. */
  duration: number;
  cover: ArchiveItem | undefined;
  /** Items grouped by source subfolder, in source order. */
  sections: Array<{ title?: string; items: ArchiveItem[] }>;
}

export const archive: ArchiveCollectionView[] = archiveCollections
  .map((collection) => {
    const generatedCollection = byId.get(collection.id);
    const items = generatedCollection?.items ?? [];
    const sections: Array<{ title?: string; items: ArchiveItem[] }> = [];
    for (const item of items) {
      const last = sections[sections.length - 1];
      if (last && (last.title ?? undefined) === (item.section ?? undefined)) last.items.push(item);
      else sections.push({ title: item.section, items: [item] });
    }
    const choice = coverChoices[collection.id];
    const chosenItem =
      choice && "item" in choice ? items.find((i) => i.src === choice.item) : undefined;
    const cover: ArchiveItem | undefined =
      chosenItem ??
      (choice && "src" in choice
        ? {
            kind: "image",
            src: choice.src,
            width: choice.width,
            height: choice.height,
            caption: collection.title,
            alt: choice.alt,
            source: "derived cover",
          }
        : (items.find((i) => i.kind === "image") ?? items[0]));
    return {
      ...collection,
      year: generatedCollection?.year ?? "",
      items,
      images: items.filter((i) => i.kind === "image").length,
      videos: items.filter((i) => i.kind === "video").length,
      documents: items.filter((i) => i.kind === "document").length,
      duration: items.reduce((sum, i) => sum + (i.duration ?? 0), 0),
      cover,
      sections,
    };
  })
  .sort((a, b) => a.order - b.order);

export const archiveById = new Map(archive.map((c) => [c.id, c]));

/** "12 min" / "1 h 04" — compact runtime for cards and headers. */
export function formatRuntime(seconds: number): string {
  if (!seconds) return "";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours} h ${String(minutes % 60).padStart(2, "0")}`;
}

/** "3:42" — per-clip duration. */
export function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Everything the /work index needs and nothing else — 24 records, each with a
 * cover and counts, so the client filter never receives 500 media items.
 */
export interface ArchiveSummary {
  id: string;
  title: string;
  summary: string;
  group: string;
  discipline: string;
  year: string;
  images: number;
  videos: number;
  documents: number;
  duration: number;
  runtime: string;
  caseStudy?: string;
  /** The case study's logo, when the project folder carries one. */
  logo?: string;
  cover: { src: string; width: number; height: number; alt: string } | null;
}

export const archiveSummaries: ArchiveSummary[] = archive.map((collection) => ({
  id: collection.id,
  title: collection.title,
  summary: collection.summary,
  group: collection.group,
  discipline: collection.discipline,
  year: collection.year,
  images: collection.images,
  videos: collection.videos,
  documents: collection.documents,
  duration: collection.duration,
  runtime: formatRuntime(collection.duration),
  caseStudy: collection.caseStudy,
  cover: collection.cover
    ? {
        src: collection.cover.thumb ?? collection.cover.poster ?? collection.cover.src,
        width: 480,
        height: Math.round((480 * collection.cover.height) / Math.max(1, collection.cover.width)),
        alt: collection.cover.alt,
      }
    : null,
}));
