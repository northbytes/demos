/* Occasion landing pages — all copy, imagery and figures for one occasion in
 * one object. `OccasionLanding` renders it; swapping an occasion means adding
 * an entry here and nothing else.
 *
 * Self-check: `node --experimental-strip-types src/lib/occasions.check.ts`. */

import type { MethodId } from "./catalog";

/* Print positions as the configurator names them. Declared here and imported
 * back by configurator.tsx to type its POSITIONS array, so the two lists can't
 * drift apart silently — a template deep-link seeds that control. */
export const POSITION_IDS = [
  "front-chest",
  "left-chest",
  "left-sleeve",
  "right-sleeve",
  "back",
] as const;
export type PositionId = (typeof POSITION_IDS)[number];

export type Template = {
  id: string;
  /** Mono label on the tile. */
  label: string;
  note: string;
  /** Flat stand-in for the design: a glyph, some type bars, maybe an image block. */
  art: { big?: string; lines: number[]; block?: boolean };
  /** What the configurator opens with when this tile is picked. */
  method: MethodId;
  positions: PositionId[];
};

export type Occasion = {
  slug: string;
  /** "OCCASION — STAG & HEN" */
  label: string;
  title: string;
  intro: string;
  /** Photograph behind the hero. Swap for a real shot, same slot. */
  heroPhoto: string;
  heroImg: string;
  primary: { text: string; href: string };
  secondary: { text: string; href: string };
  facts: string[];
  templates: Template[];
  season: {
    note: string;
    /** Month indexes, 0 = January. `fill` is the peak band, in magenta. */
    spans: { label: string; from: number; to: number; fill?: boolean }[];
    line: string;
  };
  usual: { field: string; value: string; note: string }[];
  faqs: { q: string; a: string }[];
  closing: { label: string; heading: string; copy: string; cta: string };
  meta: { title: string; description: string };
};

const CONFIGURE = "/products/classic-heavy-tee";

const STAG_AND_HEN: Occasion = {
  slug: "stag-and-hen",
  label: "OCCASION — STAG & HEN",
  title: "Matching tees for the weekend, printed in five days.",
  intro:
    "Pick a template, put the names in, and we'll have them boxed before you've booked the taxi. One shirt or thirty, printed in Medway, proof back the same working day.",
  heroPhoto: "STAG PARTY · 14 TEES · SCREEN PRINT",
  heroImg: "/img/hero-stag-hen.jpg",
  primary: { text: "Start a design", href: CONFIGURE },
  secondary: { text: "See last year's prints", href: "/#work" },
  facts: [
    "MIN ORDER 1",
    "TYPICAL RUN 8–20",
    "FROM £11.20 EACH",
    "READY IN 5 DAYS",
  ],

  templates: [
    {
      id: "team-name-roles",
      label: "TEAM NAME + ROLES",
      note: "Group name on the front, everyone's job on the back.",
      art: { lines: [70, 44, 30] },
      method: "screen",
      positions: ["front-chest", "back"],
    },
    {
      id: "back-numbers",
      label: "BACK-OF-SHIRT NUMBERS",
      note: "Football-shirt layout. Name above, big number under it.",
      art: { big: "23", lines: [52] },
      method: "screen",
      positions: ["back", "left-chest"],
    },
    {
      id: "photo-print",
      label: "PHOTO PRINT",
      note: "His face, full colour, printed straight onto the cotton.",
      art: { block: true, lines: [46] },
      method: "dtg",
      positions: ["front-chest"],
    },
    {
      id: "big-slogan",
      label: "BIG FRONT SLOGAN",
      note: "One line, set enormous, one colour. The cheapest to print.",
      art: { lines: [88, 64] },
      method: "screen",
      positions: ["front-chest"],
    },
    {
      id: "left-chest-crest",
      label: "LEFT CHEST CREST",
      note: "Small badge over the heart, for the ones who want it subtle.",
      art: { big: "✕", lines: [22] },
      method: "screen",
      positions: ["left-chest"],
    },
    {
      id: "the-one-off",
      label: "THE ONE-OFF",
      note: "Everyone matching, one shirt different. Usually the groom's.",
      art: { big: "1", lines: [40, 26] },
      method: "dtg",
      positions: ["front-chest", "back"],
    },
    {
      id: "date-and-place",
      label: "DATE + PLACE STAMP",
      note: "Where you went and when, printed like a ticket stub.",
      art: { lines: [58, 58, 34] },
      method: "screen",
      positions: ["left-chest", "back"],
    },
    {
      id: "sleeve-initials",
      label: "SLEEVE INITIALS",
      note: "Initials down the sleeve, artwork on the chest.",
      art: { big: "A·J", lines: [36] },
      method: "screen",
      positions: ["front-chest", "left-sleeve"],
    },
  ],

  season: {
    note: "MOST STAG AND HEN WEEKENDS FALL APRIL–JUNE. ORDERS PEAK JANUARY–MARCH.",
    spans: [
      { label: "ORDERS PEAK", from: 0, to: 2, fill: true },
      { label: "THE WEEKENDS", from: 3, to: 5 },
    ],
    line: "Lead time is five working days from proof approval, the same in every month of the year. The thing that changes in spring is garment stock — book in January and you get a choice of colours, book in May and you get what's on the rack.",
  },

  usual: [
    {
      field: "GARMENT",
      value: "Classic heavy tee",
      note: "180 GSM ringspun cotton, S–5XL. Hoodies instead for the winter ones, at £21.40.",
    },
    {
      field: "TYPICAL QUANTITY",
      value: "8–20",
      note: "One each plus a spare. Most groups land on twelve, which clears the 10–24 band.",
    },
    {
      field: "TYPICAL PRICE",
      value: "£11.20 each",
      note: "One-colour front print at the 10–24 band. Twelve shirts comes to £134.40 ex VAT.",
    },
  ],

  faqs: [
    {
      q: "Can everyone have a different name on the back?",
      a: "Yes. Send the names and sizes in a list and we'll match them up. Names are £4.00 a shirt on top, whatever the run size, and we'll show you every one on the proof before we print.",
    },
    {
      q: "What if someone drops out?",
      a: "Tell us before you approve the proof and we'll take them off. After that it's printed, and you've got a spare — which is why we suggest ordering one anyway.",
    },
    {
      q: "How late can I order?",
      a: "Five working days from proof approval, so ten days out is comfortable. Express is 48 hours for 15% more. Tighter than that, ring us and we'll tell you honestly whether it'll make it.",
    },
    {
      q: "Can you print a photo of his face?",
      a: "Yes — that's DTG, full colour, no extra cost per colour. Send the biggest version of the photo you have. One taken close up on a phone is fine; one screenshotted off Instagram usually isn't, and we'll say so before you pay.",
    },
  ],

  closing: {
    label: "QUANTITY BREAKS",
    heading: "The more of you there are, the less each shirt costs.",
    copy: "Setup costs the same whether we print eight or eighty, so it spreads out across the run. Prices below are per shirt, ex VAT, for a one-colour front print.",
    cta: "Start a design",
  },

  meta: {
    title: "Stag & hen t-shirts — printed in five days | PRESSMARK",
    description:
      "Matching printed tees for stag and hen weekends, from £11.20 each. Eight ready-made templates, names on the back, no minimum order, five working days from proof approval.",
  },
};

export const OCCASIONS: Occasion[] = [STAG_AND_HEN];

export const occasionBySlug = (slug: string) =>
  OCCASIONS.find((o) => o.slug === slug);

/** Deep-link target for a template tile — read back by the configurator. */
export const templateHref = (id: string) => `${CONFIGURE}?template=${id}`;

export const templateById = (id: string) =>
  OCCASIONS.flatMap((o) => o.templates).find((t) => t.id === id);
