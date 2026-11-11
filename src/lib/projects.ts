import type { Project } from "./types";

/**
 * Real project data for the launch projects. Sources:
 *  - Portfolio/ source library (media derivatives prepared in public/)
 *  - Project AnimHoodie Presentation.pdf
 *  - Natnithichai_Resume.pdf
 *  - Nong-kati store source repo and the live shop at nongkatistore.com
 * Open owner confirmations are tracked in content.ts (openConfirmations);
 * copy here is worded conservatively where permission or role detail is
 * unconfirmed.
 */
export const projects: Project[] = [
  {
    slug: "anim-hoodie",
    title: "Anim Hoodie",
    summary:
      "A stylized 3D art toy blending streetwear aesthetics with character design, carried from research and concept sketches to final renders through a complete Blender and Photoshop pipeline.",
    context: "academic",
    year: "2025",
    accent: "#E3B25A",
    theme: { accentDeep: "#55300A", tint: "#E9D7B8", motif: "weave" },
    disciplines: ["3D", "Motion"],
    roles: ["Character Designer", "3D Artist"],
    tools: ["Blender", "Photoshop"],
    deliverables: [
      "Final front, back, side, and detail renders (1920×1080)",
      "Short rendered showcase clips",
      "Three complete character variations",
      "Academic design documentation (7-stage pipeline)",
    ],
    featured: true,
    featuredOrder: 1,
    facing: "landscape",
    cover: {
      type: "image",
      src: "/images/projects/anim-hoodie/cover.jpg",
      alt: "Anim Hoodie art toy character, front view final render",
    },
    hero: {
      type: "video",
      // Rotated from preview.mp4: the render is portrait, stored as landscape.
      src: "/videos/projects/anim-hoodie/turntable.mp4",
      poster: "/images/projects/anim-hoodie/turntable.jpg",
      alt: "Portrait turntable clip of the Anim Hoodie art toy rotating on its stage",
      autoplayPreview: true,
      caption: "Turntable clip — final shaded model on the render stage.",
    },
    brief:
      "An independent design project at Khon Kaen University: design and develop an original 3D art toy. The brief set four goals — a unique character with a strong visual identity, a professional modeling and sculpting workflow, advanced texturing and material work, and high-quality rendering and lighting.",
    approach:
      "Research into established art-toy brands (Pop Mart, Mighty Jaxx, 52TOYS) surfaced three principles that drove every later decision: strong silhouettes create memorability, simplicity enhances collectible appeal, and personality creates the emotional connection. The result pairs streetwear fashion cues with animal character stylization on collectible toy proportions — a snake character wearing a hoodie, deliberately kept in a neutral palette so the form, not the color, carries the design.",
    process:
      "A seven-stage pipeline, run over about eight months with roughly nineteen weeks of active production: research and ideation, concept sketching in Photoshop with a drawing tablet, base-mesh blocking in Blender, digital sculpting (Clay Buildup, Crease, Smooth, Grab, Inflate), retopology and UV unwrapping for a production-ready mesh, texturing and material setup across roughness, normal and metallic maps, and a final lighting pass — HDRI environment mapping with a three-point studio setup, rendered in Blender Eevee at 1920×1080 and polished in Photoshop with grading, sharpness, and subtle depth of field. The working process was repeated end-to-end for three character variations — snake, fox, and capybara — to prove the pipeline could produce consistent quality.",
    result:
      "One original character design taken through every production stage to portfolio-quality renders, plus two further complete variations. Facing the classic art-toy tensions — proportion balance, detail management, topology optimization, render efficiency — each resolved through iteration, reference study, and GPU-efficiency planning.",
    evidence: [
      "7-stage production pipeline executed end to end",
      "≈19 weeks of active production across 8 months",
      "3 complete character variations produced by the same process",
      "Presentation prepared July 2025",
    ],
    gallery: [
      {
        type: "video",
        src: "/videos/projects/anim-hoodie/logo-animation.mp4",
        poster: "/images/projects/anim-hoodie/logo-animation.jpg",
        alt: "Animated Anim Hoodie wordmark on black",
        caption: "Animated logo — the wordmark in motion.",
      },
      {
        type: "image",
        src: "/images/projects/anim-hoodie/final-front.jpg",
        alt: "Anim Hoodie character, front view",
        caption: "Front turnaround — all three character variations rendered at the front angle.",
      },
      {
        type: "image",
        src: "/images/projects/anim-hoodie/final-back.jpg",
        alt: "Anim Hoodie character, back view",
        caption: "Back views — hoodie form and surface detail continue around the silhouette.",
      },
      {
        type: "image",
        src: "/images/projects/anim-hoodie/final-side.jpg",
        alt: "Anim Hoodie character, side view",
        caption: "Side views — profile structure and collectible proportions.",
      },
      {
        type: "image",
        src: "/images/projects/anim-hoodie/final-detail.jpg",
        alt: "Anim Hoodie character, close-up detail",
        caption: "Close-ups — material and texture quality of each variation.",
      },
    ],
    credits: [
      { role: "Character design & 3D production", name: "Natnithichai Srikolchan" },
      {
        role: "Advisors",
        name: "Dr. Sarun Paisarnsrisomsuk · Asst. Prof. Manasawee Kaenampornpan, Faculty of Engineering, Khon Kaen University",
      },
    ],
  },
  {
    slug: "tk-campaign",
    title: "TK Agricultural Campaign",
    summary:
      "An integrated content campaign for an organic-agriculture brand: field interviews with farmers across Thailand, cut into long-form stories, 45-second advertisements, short reels, and a supporting promo-graphic system.",
    context: "freelance",
    // Client naming withheld pending permission confirmation.
    year: "2025",
    accent: "#D9B44A",
    theme: { accentDeep: "#2A4422", tint: "#DCE5C6", motif: "paddy" },
    disciplines: ["Video", "Motion", "Graphic Design"],
    roles: ["Video Editing", "Graphic Design"],
    tools: ["Premiere Pro", "After Effects", "Photoshop", "CapCut"],
    deliverables: [
      "27 short-form reels (9:16)",
      "11 highlight and 45-second advertisement edits",
      "7 full-length field interviews",
      "72+ promotional graphics across campaign product lines",
    ],
    featured: true,
    featuredOrder: 2,
    facing: "landscape",
    cover: {
      type: "image",
      src: "/images/projects/tk-campaign/cover.jpg",
      alt: "Two farmers standing in a flooded paddy during a TK campaign shoot",
    },
    hero: {
      type: "image",
      src: "/images/projects/tk-campaign/graphic-1.jpg",
      alt: "TK campaign promotional graphic showing the rice farming product line",
      caption: "Campaign promo graphic from the product-line design system.",
    },
    brief:
      "A national agricultural brand needed campaign content able to live in several formats at once: honest long-form interviews with the farmers behind its products, tight 45-second advertisements for reach, and 9:16 reels for social feeds. The work covered portraits across sugar cane, rubber, corn, and tomato farming communities — plus product education pieces such as application how-tos.",
    approach:
      "One shoot, many formats. The same field material adapts without losing its voice: full interviews stay long and personal, highlights compress to the emotional core, reels sharpen to a single hook, and the design system — titles, product frames, typography — holds the recognizable brand layer across every cut.",
    result:
      "A campaign library built to production facts rather than vanity metrics: 27 reels, 11 highlight and advertisement edits, 7 full field interviews, and 72+ promotional graphics, each format trackable back to the same source shoot.",
    evidence: [
      "27 short-form reels delivered",
      "11 highlight & advertisement edits delivered",
      "7 full-length field interviews edited",
      "72+ promotional graphics designed",
    ],
    gallery: [
      {
        type: "video",
        src: "/videos/projects/tk-campaign/reel-1.mp4",
        poster: "/images/projects/tk-campaign/reel-1.jpg",
        alt: "Excerpt of a vertical campaign reel",
        caption: "Vertical reel excerpt, 9:16.",
        autoplayPreview: true,
      },
      {
        type: "video",
        src: "/videos/projects/tk-campaign/reel-2.mp4",
        poster: "/images/projects/tk-campaign/reel-2.jpg",
        alt: "Excerpt of a second vertical campaign reel",
        caption: "Vertical reel excerpt — product application content.",
        autoplayPreview: true,
      },
      {
        type: "video",
        src: "/videos/projects/tk-campaign/montage.mp4",
        poster: "/images/projects/tk-campaign/hero.jpg",
        alt: "Excerpt of a 45-second campaign film for the TK agricultural content series",
        caption: "Excerpt from a 45-second campaign edit.",
      },
      {
        type: "image",
        src: "/images/projects/tk-campaign/graphic-2.jpg",
        alt: "Campaign promotional graphic, organic product line",
        caption: "Promo graphic — organic product line.",
      },
      {
        type: "image",
        src: "/images/projects/tk-campaign/farmer-review-1.jpg",
        alt: "Farmer review graphic: a rice farmer holding a bunch of rice in a green paddy, with a Thai quote and B-Organic Plus packs",
        caption: "Farmer review — rice grower in a green paddy with the product pack.",
      },
      {
        type: "image",
        src: "/images/projects/tk-campaign/farmer-review-2.jpg",
        alt: "Farmer review graphic: a woman in a straw hat standing in ripe golden rice, holding a B-Organic pack",
        caption: "Farmer review — harvest-season testimonial in ripe rice.",
      },
      {
        type: "image",
        src: "/images/projects/tk-campaign/b-soil-promo.jpg",
        alt: "B-Soil promotion graphic: four bundles pairing B-Soil bottles with B-Soil product packs and a price, set over a rice-field backdrop",
        caption: "B-Soil product promotion — four bottle-and-pack bundles priced over a rice-field backdrop.",
      },
      {
        type: "image",
        src: "/images/projects/tk-campaign/graphic-3.jpg",
        alt: "Campaign promotional graphic, product application how-to content",
        caption: "Promo graphic — toothpaste product line artwork.",
      },
      {
        type: "image",
        src: "/images/projects/tk-campaign/graphic-4.jpg",
        alt: "Campaign promotional graphic for a partner page",
        caption: "Partner-programme promo graphic.",
      },
    ],
    credits: [
      { role: "Video editing & campaign design", name: "Natnithichai Srikolchan" },
    ],
  },
  {
    slug: "pattaya-guide",
    title: "Pattaya Guide Thailand",
    summary:
      "A weekly social-media design system for the travel and events Instagram account pattayaguide.thailand — roughly 200 graphics across 23 weekly posting batches, keeping one consistent visual voice for food, attractions, and event content.",
    context: "freelance",
    year: "2026",
    accent: "#FF8A5B",
    theme: { accentDeep: "#753010", tint: "#F5D8C4", motif: "tide" },
    disciplines: ["Graphic Design"],
    roles: ["Graphic Designer"],
    tools: ["Photoshop", "Illustrator", "Canva"],
    deliverables: [
      "≈200 published graphics across 23 weekly batches",
      "Weekly event, attraction, and food post designs",
      "A consistent typographic and color system maintained across months",
    ],
    featured: true,
    featuredOrder: 3,
    facing: "landscape",
    cover: {
      type: "image",
      src: "/images/projects/pattaya-guide/cover.jpg",
      alt: "Featured weekly post from the Pattaya Guide Thailand design system",
    },
    hero: {
      type: "image",
      src: "/images/projects/pattaya-guide/system-band.jpg",
      alt: "Three Pattaya Guide Thailand posts side by side: a weekly event listing, a venue feature, and a café post",
      caption: "Selected posts across weekly batches — one system, many subjects.",
    },
    result:
      "A freelancing engagement running on weekly deadlines for months without weakening the system: every batch lands recognizable at first glance, yet each subject keeps its own framing and emphasis.",
    evidence: [
      "23 weekly posting batches delivered",
      "≈200 graphics designed",
      "Résumé listing: freelance graphic designer, pattayaguide.thailand (2026)",
    ],
    gallery: [
      {
        type: "image",
        src: "/images/projects/pattaya-guide/post-1.jpg",
        alt: "Pattaya Guide Thailand weekly post",
      },
      {
        type: "image",
        src: "/images/projects/pattaya-guide/post-2.jpg",
        alt: "Pattaya Guide Thailand weekly post",
      },
      {
        type: "image",
        src: "/images/projects/pattaya-guide/post-3.jpg",
        alt: "Pattaya Guide Thailand weekly post",
      },
      {
        type: "image",
        src: "/images/projects/pattaya-guide/post-4.jpg",
        alt: "Pattaya Guide Thailand weekly post",
      },
      {
        type: "image",
        src: "/images/projects/pattaya-guide/post-5.jpg",
        alt: "Pattaya Guide Thailand weekly post",
      },
      {
        type: "image",
        src: "/images/projects/pattaya-guide/post-6.jpg",
        alt: "Pattaya Guide Thailand weekly post",
      },
      {
        type: "image",
        src: "/images/projects/pattaya-guide/post-7.jpg",
        alt: "Pattaya Guide Thailand weekly post",
      },
      {
        type: "image",
        src: "/images/projects/pattaya-guide/post-8.jpg",
        alt: "Pattaya Guide Thailand weekly post",
      },
    ],
    credits: [{ role: "Design", name: "Natnithichai Srikolchan" }],
  },
  {
    slug: "blueventure-elearning",
    title: "BlueVentureTPA E-Learning",
    summary:
      "A 20-lesson e-learning series for Thai insurance broker licensing: consistent presenter framing, typographic hierarchy, and motion treatment turning dense regulatory material into structured lessons.",
    context: "freelance",
    // Client naming/publication permission confirmation pending; content kept to
    // non-confidential excerpts.
    year: "2026",
    accent: "#5AA8EE",
    theme: { accentDeep: "#173F63", tint: "#D8E4EE", motif: "circuit" },
    disciplines: ["Motion", "Video"],
    roles: ["Motion Design & Editing"],
    tools: ["After Effects", "Premiere Pro"],
    deliverables: ["20 lesson videos", "A repeatable lesson template system"],
    featured: true,
    featuredOrder: 4,
    facing: "landscape",
    cover: {
      type: "image",
      src: "/images/projects/blueventure-elearning/cover.jpg",
      alt: "BlueVentureTPA e-learning lesson slide with a four-step claims diagram",
    },
    hero: {
      type: "video",
      src: "/videos/projects/blueventure-elearning/module-preview.mp4",
      poster: "/images/projects/blueventure-elearning/hero.jpg",
      alt: "Short montage excerpt of BlueVentureTPA e-learning lessons",
      autoplayPreview: true,
      caption: "Short montage excerpt • Client naming and full-length publication pending permission",
    },
    evidence: [
      "20 lesson videos edited",
      "One repeatable template system for class-level content",
    ],
    gallery: [
      {
        type: "image",
        src: "/images/projects/blueventure-elearning/frame-1.jpg",
        alt: "E-learning lesson frame, topic title treatment",
        caption: "Presenter frame with role icons — one of the system's consistent layouts.",
      },
      {
        type: "image",
        src: "/images/projects/blueventure-elearning/frame-2.jpg",
        alt: "E-learning lesson frame, structured information slide",
        caption: "Structured process timeline from the lesson system.",
      },
      {
        type: "image",
        src: "/images/projects/blueventure-elearning/frame-3.jpg",
        alt: "E-learning lesson frame, presenter shot",
        caption: "Lesson opening title card — consistent typographic system.",
      },
    ],
  },
  {
    slug: "en-kku",
    title: "EN KKU Events & ENPHOTO",
    summary:
      "Event storytelling and visual communication for EN Photo Club at Khon Kaen University — event films, ceremony shorts, and an identity system of countdown posts, app shirts, and promo graphics across three club generations.",
    context: "club",
    year: "2020 – 2023",
    accent: "#E86A60",
    theme: { accentDeep: "#75221C", tint: "#F0D8D3", motif: "stamp" },
    disciplines: ["Video", "Motion", "Graphic Design"],
    roles: ["Event Film Editing", "Visual Design"],
    tools: ["Premiere Pro", "After Effects", "Photoshop"],
    deliverables: [
      "4 long-form event films",
      "2 short-form ceremony videos",
      "Countdown, app-shirt, and promo identity graphics",
    ],
    featured: true,
    featuredOrder: 5,
    facing: "landscape",
    cover: {
      type: "image",
      src: "/images/projects/en-kku/cover.jpg",
      alt: "Title card from the EN Photo Club volleyball event film",
    },
    hero: {
      type: "image",
      src: "/images/projects/en-kku/graphic-1.jpg",
      alt: "EN Photo Club season countdown post for the 18-day campaign",
      caption: "Season countdown post from the campaign design.",
    },
    result:
      "Three years of continuity: the club's visual voice passed between generations of admins because the system — type, countdown format, event-film language — was designed once and reused deliberately.",
    evidence: [
      "4 long-form event films edited",
      "2 short-form ceremony videos",
      "Countdown, identity, and apparel graphics across 3 seasons",
    ],
    gallery: [
      {
        type: "video",
        src: "/videos/projects/en-kku/event-preview.mp4",
        poster: "/images/projects/en-kku/hero.jpg",
        alt: "Excerpt of an EN Photo Club event film",
        caption: "Event film excerpt.",
      },
      {
        type: "image",
        src: "/images/projects/en-kku/graphic-2.jpg",
        alt: "EN Photo Club countdown post, alternative generation",
        caption: "Countdown design from the later club generation.",
      },
      {
        type: "image",
        src: "/images/projects/en-kku/graphic-3.jpg",
        alt: "EN Photo Club apparel design",
        caption: "App-shirt design.",
      },
      {
        type: "image",
        src: "/images/projects/en-kku/graphic-4.jpg",
        alt: "EN Photo Club promotional graphic",
        caption: "Lunar New Year identity artwork.",
      },
    ],
    credits: [{ role: "Design & editing", name: "Natnithichai Srikolchan" }],
  },
  {
    slug: "sci-fi-environments",
    title: "Scene Study — Sci-Fi Environments",
    summary:
      "A personal exploration of looping animation, materials, and procedural form inside science-fiction environments — short studies on lighting, scale, and rhythm rather than client deliverables.",
    context: "personal",
    year: "2025",
    accent: "#57D8D0",
    theme: { accentDeep: "#0A403E", tint: "#D2E6E4", motif: "scan" },
    disciplines: ["3D", "Motion"],
    roles: ["3D Artist"],
    tools: ["Blender"],
    deliverables: ["7 looping environment studies", "2 rendered environment stills", "2 poster geometries"],
    featured: true,
    featuredOrder: 6,
    facing: "landscape",
    cover: {
      type: "image",
      src: "/images/projects/sci-fi-environments/cover.jpg",
      alt: "Retro sci-fi environment study 3D render",
    },
    hero: {
      type: "video",
      src: "/videos/projects/sci-fi-environments/loop-1.mp4",
      poster: "/images/projects/sci-fi-environments/hero.jpg",
      alt: "Looping 3D animation study, retro sci-fi environment",
      autoplayPreview: true,
      caption: "Loop study — personal experimental work.",
    },
    result:
      "Short loop studies on what makes environments feel alive: light interacting with form, the pacing of repetition, and how small shifts keep a camera on frame. Personal work — shared as studies, not commissions.",
    evidence: [
      "7 looping studies rendered",
      "2 environment stills",
      "Clearly personal work",
    ],
    gallery: [
      {
        type: "video",
        src: "/videos/projects/sci-fi-environments/loop-2.mp4",
        poster: "/images/projects/sci-fi-environments/loop-2.jpg",
        alt: "Looping 3D animation study, abstract form",
        caption: "Abstract geometry loop.",
        autoplayPreview: true,
      },
      {
        type: "video",
        src: "/videos/projects/sci-fi-environments/loop-3.mp4",
        poster: "/images/projects/sci-fi-environments/loop-3.jpg",
        alt: "Looping 3D animation study, liquid surface",
        caption: "Liquid surface loop.",
        autoplayPreview: true,
      },
      {
        type: "image",
        src: "/images/projects/sci-fi-environments/still-2.jpg",
        alt: "Rendered environment still",
      },
    ],
  },
  {
    slug: "nong-kati-store",
    title: "Nong Kati Store",
    summary:
      "A Thai storefront for streaming and software accounts — Netflix, HBO Max, Spotify, YouTube Premium, Microsoft 365, Canva — rebuilt as a warm clay-and-peach shop with its own brand voice, product artwork, and a checkout built around payment-slip verification.",
    context: "client",
    client: "Nong Kati Store",
    year: "2026",
    accent: "#EA7A3C",
    theme: { accentDeep: "#732F0E", tint: "#F2DFCF", motif: "shelf" },
    disciplines: ["Graphic Design"],
    roles: ["Brand & Visual Design", "Content Design"],
    tools: ["Next.js", "Tailwind CSS"],
    deliverables: [
      "Brand palette and clay component system",
      "Product artwork system across the catalogue",
      "Responsive storefront: catalogue, product, cart, checkout",
      "Thai-language interface copy",
      "Admin panel for products, stock, coupons and orders",
    ],
    featured: false,
    facing: "landscape",
    cover: {
      type: "image",
      src: "/images/projects/nong-kati-store/cover.jpg",
      alt: "Nong Kati Store home page with peach announcement bar, clay how-to-buy steps and product shelves",
    },
    hero: {
      type: "image",
      src: "/images/projects/nong-kati-store/catalogue.jpg",
      alt: "Nong Kati Store catalogue filtered to streaming apps, product tiles with stock badges and prices",
      caption: "Live catalogue — streaming-app category, captured from the shipped shop.",
    },
    brief:
      "Nong Kati sells digital subscriptions — streaming accounts, software keys, and monthly memberships — to a Thai audience that mostly buys from a phone. The shop needed to feel personal rather than reseller-generic, to explain a three-step purchase (pick a product, pay by transfer, receive the code by email) without jargon, and to keep pricing legible where one product carries two variants: an account on the customer's own email, or a pre-registered shop email.",
    approach:
      "Warm clay surfaces, a peach accent (#F97316) and rounded hand-pressed panels replace the flat default card grid, with a clay hamster mascot carrying the brand through the how-to-buy steps and empty states. Every catalogue tile is drawn as its own object — the app's mark over a starry village backdrop with its month count — so a long subscription list reads as one shelf instead of a wall of borrowed logos. Thai leads the interface: Thai-first type, Thai copy for stock and delivery states (เหลือ 2 · หมด · พร้อมส่ง), and a dark theme that keeps the same clay depth.",
    process:
      "Built as a Next.js storefront on Tailwind with Prisma behind it, from the first commit in August 2026 through the design system's second pass at the end of September: catalogue and category shelves, product pages with the two-email price variants, wishlist, cart drawer, coupon support, and an order flow that takes a payment slip and sends the account details by email. The admin side covers products, stock, coupons and orders, with role-based access and two-factor sign-in. Automated payment-slip verification went live on 1 November 2026; hosting moved to its current server on 30 September 2026.",
    result:
      "A live shop at nongkatistore.com: 19 streaming-app listings, 7 Chinese-miniseries listings and 3 work-space products at the time of capture, each with a stock state, two price variants and its own artwork — run day to day from an admin panel rather than a spreadsheet.",
    evidence: [
      "Store live at nongkatistore.com",
      "19 streaming-app listings in the catalogue at capture",
      "Automated payment-slip verification live 1 November 2026",
      "Clay design system v2 in place since September 2026",
    ],
    // Same screen, two themes: a real pair for the compare slider rather than
    // two different pages pretending to be before and after.
    compare: {
      a: {
        type: "image",
        src: "/images/projects/nong-kati-store/cover.jpg",
        alt: "Nong Kati Store home page in the light clay theme",
      },
      b: {
        type: "image",
        src: "/images/projects/nong-kati-store/dark.jpg",
        alt: "The same home page in the dark theme, clay panels on a dark cocoa ground",
      },
      labelA: "Light",
      labelB: "Dark",
    },
    gallery: [
      {
        type: "image",
        src: "/images/projects/nong-kati-store/cover.jpg",
        alt: "Home page with the peach announcement bar, clay how-to-buy steps and the clay hamster mascot",
        caption: "Storefront home — how-to-buy steps and the clay mascot.",
      },
      {
        type: "image",
        src: "/images/projects/nong-kati-store/product.jpg",
        alt: "Product page for a Microsoft 365 subscription with two price variants and a stock count",
        caption: "Product page — customer-email and shop-email variants.",
      },
      {
        type: "image",
        src: "/images/projects/nong-kati-store/cart.jpg",
        alt: "Cart drawer open over a product page, showing the added item, totals and checkout button",
        caption: "Cart drawer over the product page.",
      },
      {
        type: "image",
        src: "/images/projects/nong-kati-store/dark.jpg",
        alt: "Home page in dark theme, with the same clay panels and peach accents on a dark cocoa ground",
        caption: "Dark theme.",
      },
      {
        type: "image",
        src: "/images/projects/nong-kati-store/mobile.jpg",
        alt: "Mobile home page with the announcement bar, how-to-buy steps and the start of the category shelves",
        caption: "Mobile home.",
      },
    ],
    credits: [
      { role: "Brand, UI and content design", name: "Natnithichai Srikolchan" },
    ],
  },
];

export const getFeaturedProjects = () =>
  projects
    .slice()
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

/** Canvas the deep accent must stay legible on (keep in sync with globals.css). */
const CANVAS = "#EDE6DC";
const MOTIFS = new Set(["weave", "paddy", "tide", "circuit", "stamp", "scan", "shelf"]);

function luminance(hex: string) {
  const parts = hex.replace("#", "").match(/../g) ?? [];
  const [r, g, b] = parts.map((pair) => {
    const c = parseInt(pair, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Build-time guardrails; run before generating routes. */
interface ValidateProjectsOptions {
  failOnViolation?: boolean;
}
export function validateProjects(
  options: ValidateProjectsOptions = { failOnViolation: true },
): { valid: boolean; problems: string[] } {
  const problems: string[] = [];
  const seen = new Set<string>();
  const allowedContext = new Set([
    "client",
    "freelance",
    "academic",
    "internship",
    "club",
    "personal",
  ]);
  const forbidden = ["placeholder", "lorem", "example.com"];

  for (const p of projects) {
    if (seen.has(p.slug)) problems.push(`duplicate slug: ${p.slug}`);
    seen.add(p.slug);
    if (!/^[a-z0-9-]+$/.test(p.slug)) problems.push(`invalid slug format: ${p.slug}`);
    if (!allowedContext.has(p.context)) problems.push(`invalid context: ${p.slug}`);
    if (!p.summary?.trim()) problems.push(`missing summary: ${p.slug}`);
    if (!p.cover?.src) problems.push(`missing cover: ${p.slug}`);
    if (!/^#[0-9a-f]{6}$/i.test(p.accent ?? "")) problems.push(`invalid accent hex: ${p.slug}`);
    for (const key of ["accentDeep", "tint"] as const) {
      if (!/^#[0-9a-f]{6}$/i.test(p.theme?.[key] ?? "")) {
        problems.push(`invalid theme hex (${key}): ${p.slug}`);
      }
    }
    if (!MOTIFS.has(p.theme?.motif)) problems.push(`unknown theme motif: ${p.slug}`);
    if (contrast(p.theme?.accentDeep ?? "", CANVAS) < 4.5) {
      problems.push(`theme accentDeep below 4.5:1 on canvas: ${p.slug}`);
    }
    for (const check of [JSON.stringify(p)]) {
      for (const word of forbidden) {
        if (check.toLowerCase().includes(word)) {
          problems.push(`placeholder content in ${p.slug}; available: ${check.includes("lorem") ? "lorem text" : word}`);
        }
      }
    }
  }

  if (options.failOnViolation && problems.length > 0) {
    throw new Error(`Project validation failed:\n${problems.join("\n")}`);
  }
  return { valid: problems.length === 0, problems };
}
