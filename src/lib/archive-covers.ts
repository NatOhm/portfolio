/**
 * Hand-picked cover for each archive collection.
 *
 * The default cover is "first image in folder order", which for most of these
 * sets is the dullest frame in it (a logo slate, a week-1 post, a title card).
 * These entries were chosen by eye from contact sheets of each collection, so a
 * card shows the piece that actually represents the set. `item` refers to a
 * piece already in the collection; `src` points at a derived 5:4 cover for the
 * sets whose own art cannot be used directly — the course whose posters all
 * land on the intro slate, and the tall posters, menu pages and reel frames
 * that a 5:4 crop would slice in half. Those plates keep the whole piece on a
 * blurred blow-up of itself (see scripts/lib/cover-plate.mjs).
 */
export type CoverChoice =
  | { item: string }
  | { src: string; width: number; height: number; alt: string };

export const coverChoices: Record<string, CoverChoice> = {
  "tk-reels": {
    src: "/images/covers/tk-reels.jpg",
    width: 1600,
    height: 1280,
    alt: "TK reel: farmer interview frame with Thai captions",
  },
  "tk-highlights": { item: "/archive/tk-highlights/ba7961568f.mp4" },
  "anim-hoodie-renders": { item: "/archive/anim-hoodie-renders/b5046d34b8.mp4" },
  "en-kku-short": { item: "/archive/en-kku-short/7b4c6d0b5c.mp4" },
  blueventure: {
    src: "/archive/blueventure/cover.jpg",
    width: 1600,
    height: 1280,
    alt: "BlueVenture TPA e-learning: four lesson slides from the course",
  },
  "tk-interviews": { item: "/archive/tk-interviews/f155ff5e08.mp4" },
  "en-kku-events": { item: "/archive/en-kku-events/da494142ab.mp4" },
  "khon-kaen-timeless": { item: "/archive/khon-kaen-timeless/f12926cada.mp4" },
  "corporate-projects": { item: "/archive/corporate-projects/2fd4a160f0.mp4" },
  "personal-edits": { item: "/archive/personal-edits/6ffa58d971.mp4" },
  "raw-exports": { item: "/archive/raw-exports/2570442de6.mp4" },
  vlog: { item: "/archive/vlog/fc10db40e1.mp4" },
  "sci-fi-environment": { item: "/archive/sci-fi-environment/b47ccbf75e.mp4" },
  "social-3d": { item: "/archive/social-3d/0f15337275-full.jpg" },
  "anim-hoodie-process": { item: "/archive/anim-hoodie-process/e8e1b7ce82-full.jpg" },
  "pattaya-posts": {
    src: "/images/covers/pattaya-posts.jpg",
    width: 1600,
    height: 1280,
    alt: "Pattaya Guide weekly post graphic with phone mockup",
  },
  "tk-promo-graphics": { item: "/archive/tk-promo-graphics/f3dac75fbc-full.jpg" },
  enphoto: { item: "/archive/enphoto/6f8af34c37-full.jpg" },
  "cocoa-damneon": { item: "/archive/cocoa-damneon/1bb81b2cc2-full.jpg" },
  manipulation: {
    src: "/images/covers/manipulation.jpg",
    width: 1600,
    height: 1280,
    alt: "Personal artwork: cyberpunk portrait against neon signage",
  },
  "silly-fool": {
    src: "/images/covers/silly-fool.jpg",
    width: 1600,
    height: 1280,
    alt: "Silly Fool – Deep Cut poster: collage figures with orange-slice heads over a cropped portrait",
  },
  "personal-art": { item: "/archive/personal-art/5695d9ef4a-full.jpg" },
  callitography: { item: "/archive/callitography/87e08a5ce8-full.jpg" },
  infographic: {
    src: "/images/covers/infographic.jpg",
    width: 1600,
    height: 1280,
    alt: "Infographic board condensing a page of figures into one poster",
  },
  "breezee-menu": {
    src: "/images/covers/breezee-menu.jpg",
    width: 1600,
    height: 1280,
    alt: "BreeZee menu page with the food photography set",
  },
  "tine-2026": {
    src: "/images/covers/tine-2026.jpg",
    width: 1600,
    height: 1280,
    alt: "Graduation portrait from the Tine 2026 shoot",
  },
};
