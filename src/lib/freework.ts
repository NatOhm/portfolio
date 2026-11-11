/**
 * Free-time graphics: the personal library, shown as a wall on the Work page
 * rather than as case studies. Series labels follow the source library folders;
 * no invented titles. Alt text describes what is visible in each image.
 */
export interface FreeWorkPiece {
  src: string;
  alt: string;
}

/**
 * How a series is laid out:
 * - masonry: mixed aspect ratios, column flow (personal art, manipulation)
 * - grid:    one uniform set, equal tiles (the club poster series)
 * - boards:  tall infographic boards, two up
 * - small:   native-size captures that must never be upscaled
 */
export type FreeWorkLayout = "masonry" | "grid" | "boards" | "small";

export interface FreeWorkSeries {
  id: string;
  title: string;
  note?: string;
  layout: FreeWorkLayout;
  pieces: FreeWorkPiece[];
}

export const freeWorkSeries: FreeWorkSeries[] = [
  {
    id: "personal-art",
    title: "Personal art",
    layout: "masonry",
    pieces: [
      {
        src: "/images/freework/personal-art-angel.jpg",
        alt: "Purple poster artwork of a haloed figure with gothic lettering reading ANGEL IS WATCHING",
      },
      {
        src: "/images/freework/personal-art-stop-grieving.jpg",
        alt: "Lettering artwork reading STOP GRIEVING across a molten orange and magenta gradient",
      },
      {
        src: "/images/freework/personal-art-stop-grieving-2.jpg",
        alt: "Square variant of the STOP GRIEVING artwork: yellow outlined letters over blown-out orange and magenta light, with a NONIUS label at the top",
      },
      {
        src: "/images/freework/personal-art-untitled-2026.jpg",
        alt: "Dark glitch poster with gothic lettering reading Mors Equat and the line Death makes everyone equal, over blue-tinted sliced portraits",
      },
    ],
  },
  {
    id: "photo-manipulation",
    title: "Photo manipulation",
    layout: "masonry",
    pieces: [
      {
        src: "/images/freework/manipulation-nonus-poster.jpg",
        alt: "NONUS music poster in red and violet, built from a layered portrait",
      },
      {
        src: "/images/freework/manipulation-framed-portrait.jpg",
        alt: "Portrait composite framed inside an ornate gilded picture frame",
      },
      {
        src: "/images/freework/manipulation-syuhei.jpg",
        alt: "Photo composite of a white cat in a straw conical hat and striped robe, holding a blade among falling green leaves, with vertical Japanese lettering on the right",
      },
      {
        src: "/images/freework/manipulation-new-devil.jpg",
        alt: "Blue-lit photo manipulation of a man in a suit against a moonlit city skyline",
      },
      {
        src: "/images/freework/manipulation-cyber-flock.jpg",
        alt: "Cyberpunk scene of a young man in a reflective jacket holding a futuristic blade, under Japanese neon signage",
      },
      {
        src: "/images/freework/manipulation-nonius-character.jpg",
        alt: "Cyberpunk composite of a white-haired character in red light and violet haze, NONIUS wordmark across the bottom",
      },
      {
        src: "/images/freework/manipulation-crystal-jockey.jpg",
        alt: "Neon portrait of a man in a high-collared jacket reading CRYSTAL JOCKEY, in a futuristic city street",
      },
    ],
  },
  {
    id: "callitography",
    title: "Callitography",
    layout: "masonry",
    pieces: [
      {
        src: "/images/freework/callitography-ieni-phoy.jpg",
        alt: "Red calligraphic lettering spelling IENI PHOY, set on black",
      },
      {
        src: "/images/freework/callitography-omexx.jpg",
        alt: "Silver three-dimensional calligraphic lettering with the word OMEXX set below it",
      },
      {
        src: "/images/freework/callitography-thai-gold.jpg",
        alt: "Gold Thai lettering built from stacked strokes on a black ground",
      },
      {
        src: "/images/freework/callitography-framed-pink.jpg",
        alt: "Vertical Thai calligraphic lettering in magenta, framed by an ornate mirrored border on black",
      },
      {
        src: "/images/freework/callitography-framed-red.jpg",
        alt: "Vertical Thai calligraphic lettering in red, framed by an ornate mirrored border on black",
      },
    ],
  },
  {
    id: "volleyball",
    title: "EN Volleyball Club",
    note: "Poster set for the club's freshman-announcement series, one athlete per poster.",
    layout: "grid",
    pieces: [
      {
        src: "/images/freework/volleyball-2b-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 2 throwing two peace signs in front of orange flames",
      },
      {
        src: "/images/freework/volleyball-3-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 3 standing in cold blue light",
      },
      {
        src: "/images/freework/volleyball-8-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 5 with arms crossed in green light",
      },
      {
        src: "/images/freework/volleyball-8b-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 8 with hands on hips in magenta smoke",
      },
      {
        src: "/images/freework/volleyball-9-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 9 surrounded by cyan and violet shards",
      },
      {
        src: "/images/freework/volleyball-9b-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 9 with a hand at his chin, green light trails",
      },
      {
        src: "/images/freework/volleyball-10-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 10 smiling in her jersey, framed by teal light trails",
      },
      {
        src: "/images/freework/volleyball-11-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 11 standing in purple smoke",
      },
      {
        src: "/images/freework/volleyball-11g-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 11 making a heart shape with her hands in yellow sparks",
      },
      {
        src: "/images/freework/volleyball-12-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 12 with arms crossed in magenta light",
      },
      {
        src: "/images/freework/volleyball-14-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 14 with a hand in her hair, green light trails",
      },
      {
        src: "/images/freework/volleyball-16-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 16 smiling inside golden light arcs",
      },
      {
        src: "/images/freework/volleyball-18-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 22 standing in magenta smoke",
      },
      {
        src: "/images/freework/volleyball-21-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 21 in a defensive pose, lit cyan",
      },
      {
        src: "/images/freework/volleyball-27-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 27 smiling amid orange flames",
      },
      {
        src: "/images/freework/volleyball-30-volleyball-66.jpg",
        alt: "Freshy 66 poster: athlete number 30 with a hand behind his head, red flames behind",
      },
      {
        src: "/images/freework/volleyball-coach-volleyball-66.jpg",
        alt: "Freshy 66 poster: team coach in a dark shirt, magenta smoke and a red COACH title behind him",
      },
    ],
  },
  {
    id: "boards",
    title: "Infographic boards",
    note: "Two layouts from an energy-saving freight campaign, in Thai.",
    layout: "boards",
    pieces: [
      {
        src: "/images/freework/board-infographic-1.jpg",
        alt: "Thai infographic board on energy-saving freight, four numbered groups of transport diagrams with fuel, cost and CO₂ figures",
      },
      {
        src: "/images/freework/board-infographic-2.jpg",
        alt: "Second layout of the same logistics infographic, a road running between four numbered groups of diagrams",
      },
    ],
  },
  {
    id: "3d-studies",
    title: "3D studies",
    note: "Short social renders, shown at their native size.",
    layout: "small",
    pieces: [
      {
        src: "/images/freework/study-3d-1.jpg",
        alt: "Night skyline of lit towers under a full moon, in deep blue",
      },
      {
        src: "/images/freework/study-3d-2.jpg",
        alt: "Green neon cross made of light tubes hanging beneath a dark ceiling",
      },
      {
        src: "/images/freework/study-3d-3.jpg",
        alt: "Isometric 3D diorama of a small room with a pool, grass and a blue archway",
      },
      {
        src: "/images/freework/study-3d-4.jpg",
        alt: "Classical bust wrapped in green neon wireframe lines",
      },
    ],
  },
];

export const freeWorkPieces = freeWorkSeries.flatMap((series) => series.pieces);
