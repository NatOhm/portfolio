import type { Capability, EducationEntry, ExperienceEntry, SocialLink } from "./types";

/**
 * Profile content sourced from Natnithichai_Resume.pdf and approved project
 * presentations. Details marked "confirm before launch" are not yet
 * owner-verified and are worded conservatively until then.
 */
export const profile = {
  name: "Natnithichai Srikolchan",
  role: "Multimedia Designer",
  headline: "Stories in motion. Brands with character.",
  statement:
    "Multimedia designer creating video, motion, 3D, and visual campaigns from concept to final delivery.",
  intro:
    "I'm Natnithichai, a multimedia designer based in Khon Kaen, Thailand. I take stories and briefs through the whole journey — concept, production, and final delivery — across video, motion, 3D, and graphic campaigns.",
  introAbout:
    "I like starting from a real story: a farmer's harvest, a graduation, a character that exists only in 3D. From there I find the visual language that carries it — editing, motion, three-dimensional form, or the graphic system that binds a campaign together — and I keep that language consistent from the first idea to final delivery.",
  location: "Khon Kaen, Thailand", // confirm before launch (resume lists Khon Kaen 40002, wants relocation work)
  availability: "Available for freelance and studio work", // confirm before launch
  approach:
    "Process first, decoration later. I study the subject before choosing a visual language, keep the system consistent — silhouette, palette, type, motion — and then let finished work carry the argument. Whether it is a full production pipeline from concept sketches to rendered scenes, or a weekly social system built for a deadline, I plan the steps so quality survives the schedule.",
} as const;

export const capabilities: Capability[] = [
  {
    label: "Video Editing & Storytelling",
    detail:
      "Short-form and long-form editing — field interviews, event films, reels, and campaign highlights cut to clear narratives.",
  },
  {
    label: "Motion Graphics",
    detail:
      "Explainer systems, branded social motion, kinetic information design, and e-learning lesson graphics built from a brief.",
  },
  {
    label: "3D Design & Animation",
    detail:
      "Character and environment modeling, sculpting, texturing, lighting, and rendering — a complete Blender production pipeline.",
  },
  {
    label: "Graphic Design & Campaigns",
    detail:
      "Weekly social-media design systems, promotional campaigns, identity graphics, and print-ready artwork.",
  },
];

export const softwareGroups = [
  {
    group: "Image & Layout",
    tools: ["Photoshop", "Illustrator", "InDesign", "Canva"],
  },
  {
    group: "Film & Editing",
    tools: ["Premiere Pro", "DaVinci Resolve", "CapCut"],
  },
  {
    group: "Motion & 3D",
    tools: ["After Effects", "Blender", "Maya"],
  },
  {
    group: "UI & Prototyping",
    tools: ["Figma", "Adobe XD"],
  },
];

export const experience: ExperienceEntry[] = [
  {
    position: "Freelance Motion Graphic Designer",
    organization: "Me Style Solution Co., Ltd.",
    type: "Freelance contract",
    date: "Dec 2025 – Mar 2026",
    description:
      "Designed and edited a 20-lesson e-learning series in Canva and Premiere Pro for a Thai insurance broker licensing programme.",
    responsibilities: [
      "Designed and edited 20 e-learning lesson videos in Canva and Premiere Pro",
      "Laid out content, graphics, and on-screen text so dense material stayed readable",
      "Took team feedback and revised lessons accordingly",
    ],
    disciplines: ["Motion", "Video"],
    relatedProject: "blueventure-elearning",
  },
  {
    position: "Freelance Graphic Designer",
    organization: "Pattaya Guide Thailand",
    type: "Freelance",
    date: "Dec 2025 – May 2026",
    description:
      "Weekly content and social-media design system for the Instagram account pattayaguide.thailand.",
    responsibilities: [
      "Designed the weekly posting system for events, attractions, and food content — 23 consecutive weeks of roughly eight graphics per batch",
      "Aligned each batch with platform trends and the account's brand identity",
      "Handled several pieces in parallel under one delivery deadline",
    ],
    disciplines: ["Graphic Design"],
    relatedProject: "pattaya-guide",
  },
  {
    position: "Multimedia Designer",
    organization: "TK Sap Charoen Rung Rueng Co., Ltd. (ทีเค ทรัพย์เจริญรุ่งเรือง)",
    type: "Part-time",
    date: "Nov 2024 – May 2025",
    description:
      "Edited short-form agricultural content and designed the monthly social graphics for an agricultural brand.",
    responsibilities: [
      "Edited reels and short review clips from farmer and product footage (30+ clips), plus 45-second ad cuts",
      "Cut highlight reels from full interview footage for short-form publishing",
      "Designed monthly promotion and review graphics to the brand guideline",
      "Worked with the team to keep every deliverable on-brand",
    ],
    disciplines: ["Graphic Design", "Motion"],
  },
  {
    position: "Coordinator & Gaffer",
    organization: "20Pix Studio",
    type: "Internship (summer semester)",
    date: "Apr – Jun 2024",
    description:
      "Production internship covering on-set coordination and lighting.",
    responsibilities: [
      "Coordinated on set and kept lighting and equipment ready for each shoot",
      "Learnt the production workflow from pre-production through post-production",
    ],
    disciplines: ["Video"],
  },
  {
    position: "Photographer, Content Creative & Multimedia Designer",
    organization: "EN Photo Club (Khon Kaen University)",
    type: "Club role",
    date: "2020 – 2023",
    description:
      "Created the club's social media, event films, countdown posts, and identity graphics.",
    responsibilities: [
      "Photographed club activities and edited short videos and faculty event films such as Sport Selection Day",
      "Designed the club's countdown posts (22 posts) and posters",
      "Ran the club's social media design output across event seasons",
    ],
    disciplines: ["Video", "Motion", "Graphic Design"],
    relatedProject: "en-kku",
  },
];

export const education: EducationEntry[] = [
  {
    school: "Khon Kaen University",
    program:
      "Bachelor of Engineering — Digital Media Engineering, Faculty of Engineering (international programme)",
    date: "2020 – 2026",
    description:
      "Independent study project: design and development of the 3D art toy Anim Hoodie (advisors: Dr. Sarun Paisarnsrisomsuk, Asst. Prof. Manasawee Kaenampornpan).",
  },
];

export const socials: SocialLink[] = [
  // No personal accounts published yet: the Pattaya Guide account belongs to
  // that project's client, not to the owner. Add Behance / LinkedIn / YouTube
  // here once the owner confirms them.
];

/**
 * Decisions that remain with the owner before launch; not rendered anywhere.
 * 1. Preferred public title (defaulting to "Multimedia Designer").
 * 2. Final headline and biography wording.
 * 3. Additional social links; phone number intentionally not published.
 * 4. 2025 part-time employer name and exact responsibilities.
 * 5. Faculty-of-Engineering program/degree wording.
 * 6. Permission to name the TK agricultural client.
 * 7. Permission to name/publish BlueVentureTPA material.
 * 8. Production domain (site.url).
 */
export const openConfirmations: string[] = [
  "Public title wording (default: Multimedia Designer)",
  "Final headline and biography copy",
  "Additional social links beyond the freelance Instagram account; phone intentionally unpublished",
  "2026 Me Style Solution engagement — client naming permission",
  "TK agricultural campaign — client naming permission",
  "BlueVentureTPA — client naming/publication permission",
  "Nong Kati Store — public credit wording and scope (design only vs design + build)",
  "Location phrasing (Khon Kaen, Thailand)",
  "Availability statement",
  "Production domain and host",
];
