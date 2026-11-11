import type { Disciplines, ProjectContext } from "./types";

/**
 * The complete work archive: one entry per source-library collection in
 * `Port-full/Portfolio`. Selected case studies stay curated; this index exists
 * so every finished piece is reachable, not just the seven case studies.
 *
 * `folder` is the path from the library root. `extraFolders` admits media that
 * lives outside the numbered library tree. Copy here is factual: folder, count,
 * year and client come from the files, never from invention.
 */
export type ArchiveGroup =
  | "Short-form video"
  | "Long-form video"
  | "Motion & 3D"
  | "Graphic design"
  | "Photography";

export interface ArchiveCollection {
  id: string;
  title: string;
  summary: string;
  group: ArchiveGroup;
  discipline: Disciplines;
  context: ProjectContext;
  client?: string;
  folder: string;
  extraFolders?: string[];
  /** Case study this collection feeds, when one exists. */
  caseStudy?: string;
  /**
   * Publish each video as an excerpt of this many seconds instead of in full.
   * Used where the full file is client course material that stays with them.
   */
  previewSeconds?: number;
  order: number;
}

export const archiveCollections: ArchiveCollection[] = [
  {
    id: "tk-reels",
    title: "TK Reels",
    summary:
      "Vertical reels for TK Agricultural: product stories cut for feed, written and edited from raw farm footage.",
    group: "Short-form video",
    discipline: "Video",
    context: "client",
    client: "TK Agricultural",
    folder: "01_Short-Form Video/TK Reels",
    caseStudy: "tk-campaign",
    order: 1,
  },
  {
    id: "tk-highlights",
    title: "TK Highlights & Ads",
    summary:
      "Highlight cuts and short paid ads from the same campaign, each opening on the strongest frame.",
    group: "Short-form video",
    discipline: "Video",
    context: "client",
    client: "TK Agricultural",
    folder: "01_Short-Form Video/TK Highlights & Ads",
    caseStudy: "tk-campaign",
    order: 2,
  },
  {
    id: "anim-hoodie-renders",
    title: "Anim Hoodie renders",
    summary:
      "Turntable and detail renders of the Anim Hoodie art toy, straight out of Blender Eevee.",
    group: "Short-form video",
    discipline: "3D",
    context: "academic",
    folder: "01_Short-Form Video/AnimHoodie Renders",
    caseStudy: "anim-hoodie",
    order: 3,
  },
  {
    id: "en-kku-short",
    title: "EN KKU short-form",
    summary:
      "Short event films for the EN KKU faculty and the ENPHOTO club, cut for social.",
    group: "Short-form video",
    discipline: "Video",
    context: "client",
    client: "EN KKU / ENPHOTO",
    folder: "01_Short-Form Video/En KKU Short",
    caseStudy: "en-kku",
    order: 4,
  },
  {
    id: "blueventure",
    title: "BlueVenture TPA e-learning",
    summary:
      "Twenty insurance-academy lessons edited into e-learning modules with on-screen lesson titles. Each plays here as a 25-second excerpt; the full modules stay with the client.",
    group: "Long-form video",
    discipline: "Video",
    context: "client",
    client: "BlueVenture TPA",
    folder: "02_Long-Form Video/BlueVentureTPA E-Learning",
    caseStudy: "blueventure-elearning",
    previewSeconds: 25,
    order: 5,
  },
  {
    id: "tk-interviews",
    title: "TK full interviews",
    summary:
      "Long-form interview edits with the people behind TK Agricultural, kept conversational and unhurried.",
    group: "Long-form video",
    discipline: "Video",
    context: "client",
    client: "TK Agricultural",
    folder: "02_Long-Form Video/TK Full Interviews",
    caseStudy: "tk-campaign",
    order: 6,
  },
  {
    id: "en-kku-events",
    title: "EN KKU events",
    summary:
      "Event coverage films for the faculty — ceremony, activities and the people in the room.",
    group: "Long-form video",
    discipline: "Video",
    context: "client",
    client: "EN KKU",
    folder: "02_Long-Form Video/En KKU Events",
    caseStudy: "en-kku",
    order: 7,
  },
  {
    id: "khon-kaen-timeless",
    title: "Khon Kaen Timeless",
    summary:
      "A city portrait film made on internship: the railway station, Wat Phra That, the KKU flea market, the City Pillar and the night roads, titled location by location. Directed and shot by Thanakorn Prakobdee; sound design by Natnithichai.",
    group: "Long-form video",
    discipline: "Video",
    context: "internship",
    folder: "02_Long-Form Video/Internship",
    order: 8,
  },
  {
    id: "corporate-projects",
    title: "Corporate projects",
    summary:
      "Corporate video work cut for company presentation, with titles, music and a clean delivery master.",
    group: "Long-form video",
    discipline: "Video",
    context: "client",
    folder: "02_Long-Form Video/Corporate Projects",
    order: 9,
  },
  {
    id: "personal-edits",
    title: "Personal edits",
    summary:
      "A self-initiated edit: original sequencing, sound design and grading rather than a brief.",
    group: "Long-form video",
    discipline: "Video",
    context: "personal",
    folder: "02_Long-Form Video/Personal Edits",
    order: 10,
  },
  {
    id: "raw-exports",
    title: "Raw exports (uncut)",
    summary:
      "Uncut exports kept as working evidence — the takes before the edit, not the finish.",
    group: "Long-form video",
    discipline: "Video",
    context: "personal",
    folder: "02_Long-Form Video/Raw Exports (Uncut)",
    order: 11,
  },
  {
    id: "vlog",
    title: "Vlog",
    summary: "A single day-in-the-life edit, handheld and cut for pace.",
    group: "Long-form video",
    discipline: "Video",
    context: "personal",
    folder: "02_Long-Form Video/Vlog",
    order: 12,
  },
  {
    id: "sci-fi-environment",
    title: "3D sci-fi environment",
    summary:
      "A retro sci-fi interior built in Blender: modelling, materials, lighting and camera moves.",
    group: "Motion & 3D",
    discipline: "3D",
    context: "academic",
    folder: "03_Motion Graphics & 3D/3D Scifi Environment",
    caseStudy: "sci-fi-environments",
    order: 13,
  },
  {
    id: "social-3d",
    title: "3D social posts",
    summary:
      "Rendered 3D stills made for social, including the set published straight to the feed.",
    group: "Motion & 3D",
    discipline: "3D",
    context: "personal",
    folder: "03_Motion Graphics & 3D/3D Social Posts",
    extraFolders: ["../../3D Artwork"],
    order: 14,
  },
  {
    id: "anim-hoodie-process",
    title: "Anim Hoodie — process",
    summary:
      "The art-toy project end to end: identity lockups, packaging mockup, texture studies and final renders, plus its presentation and motion tests.",
    group: "Motion & 3D",
    discipline: "3D",
    context: "academic",
    folder: "03_Motion Graphics & 3D/Project AnimHoodie (Art toy Concept)",
    caseStudy: "anim-hoodie",
    order: 15,
  },
  {
    id: "pattaya-posts",
    title: "Pattaya Guide weekly posts",
    summary:
      "Every weekly social set made for Pattaya Guide Thailand, week by week across the campaign.",
    group: "Graphic design",
    discipline: "Graphic Design",
    context: "client",
    client: "Pattaya Guide Thailand",
    folder: "04_Graphic Design/PattayaGuide.Thailand",
    caseStudy: "pattaya-guide",
    order: 16,
  },
  {
    id: "tk-promo-graphics",
    title: "TK promo graphics",
    summary:
      "Product posts, price cards and campaign graphics for TK Agricultural's social channels.",
    group: "Graphic design",
    discipline: "Graphic Design",
    context: "client",
    client: "TK Agricultural",
    folder: "04_Graphic Design/TK Promo Graphics",
    caseStudy: "tk-campaign",
    order: 17,
  },
  {
    id: "enphoto",
    title: "ENPHOTO",
    summary:
      "Posters, countdowns and event graphics for the ENPHOTO club, plus its motion pieces.",
    group: "Graphic design",
    discipline: "Graphic Design",
    context: "club",
    client: "ENPHOTO",
    folder: "04_Graphic Design/ENPHOTO",
    caseStudy: "en-kku",
    order: 18,
  },
  {
    id: "cocoa-damneon",
    title: "CocoDamneon",
    summary:
      "Brand and menu visuals for CocoDamneon: product artwork, typography and social layouts.",
    group: "Graphic design",
    discipline: "Graphic Design",
    context: "client",
    client: "CocoDamneon",
    folder: "04_Graphic Design/CocoDamneon",
    order: 19,
  },
  {
    id: "manipulation",
    title: "Photo manipulation",
    summary:
      "Composite portraits and poster art built from photography, light and texture.",
    group: "Graphic design",
    discipline: "Graphic Design",
    context: "personal",
    folder: "04_Graphic Design/Manipulation",
    order: 20,
  },
  {
    id: "silly-fool",
    title: "Silly Fool — Deep Cut",
    summary:
      "A self-initiated collage poster in four variants — two layouts, each in English and Thai. Orange slices for heads, taped-over eyes and a bootleg cowboy standing in for the hero, dropped into deep space under a yellow banner.",
    group: "Graphic design",
    discipline: "Graphic Design",
    context: "personal",
    folder: "04_Graphic Design/Silly Fool Posters",
    order: 21,
  },
  {
    id: "personal-art",
    title: "Personal art",
    summary:
      "One-off personal pieces: glitch typography, the occult ANGEL IS WATCHING poster, the psychedelic STOP GRIEVING series and smaller social artwork.",
    group: "Graphic design",
    discipline: "Graphic Design",
    context: "personal",
    folder: "04_Graphic Design/Personal Art",
    order: 22,
  },
  {
    id: "callitography",
    title: "Callitography",
    summary: "Calligraphic lettering studies, drawn and composed as standalone pieces.",
    group: "Graphic design",
    discipline: "Graphic Design",
    context: "personal",
    folder: "04_Graphic Design/Callitography",
    order: 23,
  },
  {
    id: "infographic",
    title: "Infographic boards",
    summary:
      "Information boards that turn a page of copy into a readable single image.",
    group: "Graphic design",
    discipline: "Graphic Design",
    context: "academic",
    folder: "04_Graphic Design/Infographic",
    order: 24,
  },
  {
    id: "breezee-menu",
    title: "Breezee menu design",
    summary:
      "A café menu designed end to end — layout, typography and print-ready artwork.",
    group: "Graphic design",
    discipline: "Graphic Design",
    context: "client",
    client: "Breezee",
    folder: "04_Graphic Design/Breezee Menu Design",
    order: 25,
  },
  {
    id: "tine-2026",
    // The library folder is spelled "Congratuation" in the source tree; only the
    // name shown to visitors is corrected here.
    title: "Graduation — Tine 2026",
    summary:
      "Graduation portrait coverage: a full shoot, selected and graded for delivery.",
    group: "Photography",
    discipline: "Photography",
    context: "client",
    folder: "05_Photography/Congratuation - Tine 2026",
    order: 26,
  },
];
