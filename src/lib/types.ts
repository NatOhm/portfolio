export type Disciplines =
  | "Video"
  | "Motion"
  | "3D"
  | "Graphic Design"
  | "Photography";

export type ProjectContext =
  | "client"
  | "freelance"
  | "academic"
  | "internship"
  | "club"
  | "personal";

export interface ProjectMedia {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  /** short muted inline preview — must not be the only way to see the work */
  autoplayPreview?: boolean;
}

export type Facing = "landscape" | "portrait";

/**
 * Background motifs painted with CSS gradients, so a project theme needs no
 * image asset and no extra request.
 */
export type ProjectMotif =
  | "weave"
  | "paddy"
  | "tide"
  | "circuit"
  | "stamp"
  | "scan"
  | "shelf";

/**
 * Every project gets its own colour world inside one system. `accent` is the
 * sampled decoration colour (dots, motifs, rules); `accentDeep` is the only
 * project colour allowed on text and must reach 4.5:1 on the canvas.
 */
export interface ProjectTheme {
  /** Text-safe shade of the sampled colour — labels, links, focus rings. */
  accentDeep: string;
  /** Pale wash taken from the work: case-study band and card mats. */
  tint: string;
  /** Decorative motif behind the case-study hero. */
  motif: ProjectMotif;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  context: ProjectContext;
  client?: string;
  year: string;
  /**
   * Accent sampled from the project's own artwork, used on its case study and
   * card meta so the page carries the work's colour instead of one brand hue.
   * Must stay legible on the ink canvas (>= 4.5:1).
   */
  accent: string;
  /** Per-project colour world: wash, motif, text-safe shade. */
  theme: ProjectTheme;
  disciplines: Disciplines[];
  roles: string[];
  tools: string[];
  deliverables: string[];
  featured: boolean;
  featuredOrder?: number;
  /** card aspect hint so the editorial grid can mix media deliberately */
  facing: Facing;
  cover: ProjectMedia;
  hero: ProjectMedia;
  brief?: string;
  approach?: string;
  process?: string;
  result?: string;
  evidence?: string[];
  /**
   * Optional two-state pair for the drag-to-compare block — a light and dark
   * theme of the same screen, or a before/after grade. Only add a pair that is
   * genuinely the same subject, or the slider invents a comparison.
   */
  compare?: { a: ProjectMedia; b: ProjectMedia; labelA: string; labelB: string };
  gallery: ProjectMedia[];
  credits?: Array<{ role: string; name: string }>;
}

export interface ExperienceEntry {
  position: string;
  organization: string;
  type: string;
  date: string;
  description: string;
  responsibilities: string[];
  disciplines: string[];
  relatedProject?: string;
  /** true when a detail (e.g., organization name) awaits the owner's confirmation */
  unconfirmedDetail?: string;
}

export interface EducationEntry {
  school: string;
  program: string;
  date: string;
  description?: string;
  unconfirmedDetail?: string;
}

export interface Capability {
  label: string;
  detail: string;
}

export interface SocialLink {
  label: string;
  href: string;
}
