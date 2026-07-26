/* The customer account: past orders and where each one stands on press, saved
 * garment setups, the artwork library, addresses and contact details.
 *
 * An order is a list of the same `BasketLine` the basket and checkout use, so
 * pricing, the size run and reordering are the code that already exists rather
 * than a second set that can disagree with it.
 *
 * ponytail: seeded, like the basket — there's no account server here. Stage
 * times are offsets in working days from today rather than fixed strings, so an
 * order placed "yesterday" is still yesterday whenever the demo is opened.
 *
 * Self-check: `node --experimental-strip-types src/lib/account.check.ts`. */

import * as React from "react";
import { addLine, totals, type BasketLine } from "./basket.ts";
import { addWorkingDays, fmtDate, subWorkingDays } from "./dates.ts";
import { BAILEY_FC, MEDWAY_10K } from "./sample-art.ts";

/* ─── Production stages ──────────────────────────────────────────────────── */

/** The five stages every job runs through. The timeline is these, in order. */
export const STAGES = [
  { key: "check", label: "Artwork check" },
  { key: "proof", label: "Proof sent" },
  { key: "approval", label: "Your approval" },
  { key: "press", label: "On press" },
  { key: "ready", label: "Ready" },
] as const;

/** Working days ago, and the time on that day. A negative day is a projection. */
export type Stamp = [days: number, time: string];

export type StageView = {
  key: string;
  label: string;
  when: string;
  state: "done" | "now" | "todo";
};

/* ─── An order ───────────────────────────────────────────────────────────── */

export type Order = {
  ref: string;
  /** The stage the job is standing on. 5 means every stage is behind it. */
  stage: number;
  /** One stamp per stage, oldest first. */
  at: Stamp[];
  items: BasketLine[];
  address: string[];
  /** The dated PDF sitting with the customer, when there is one. */
  proof?: { file: string; version: number; art: string | null; note: string };
  /** Set when the customer approves in this session — a real clock reading. */
  approvedAt?: Date;
  changeRequested?: boolean;
};

export type OrderStatus = "approval" | "production" | "delivered";

/** Three states, and the middle one is the one that needs the customer. */
export const statusOf = (o: Order): OrderStatus =>
  o.stage >= STAGES.length
    ? "delivered"
    : STAGES[o.stage].key === "approval" && !o.approvedAt
      ? "approval"
      : "production";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  approval: "Needs your approval",
  production: "In production",
  delivered: "Delivered",
};

/** One line of the run, so the seed reads as a spec rather than an object. */
const line = (
  id: string,
  product: string,
  colourId: string,
  colourName: string,
  view: BasketLine["view"],
  artUrl: string | null,
  run: BasketLine["run"],
  artwork: BasketLine["artwork"],
): BasketLine => ({
  id,
  product,
  href: "/products/classic-heavy-tee",
  colourId,
  colourName,
  view,
  artUrl,
  run,
  artwork,
});

const CHECKED = (name: string, note: string) =>
  ({ status: "checked", name, note }) as const;

/* ─── The orders ─────────────────────────────────────────────────────────── */

const SEED_ORDERS: Order[] = [
  {
    ref: "PM-40921",
    stage: 2,
    at: [
      [1, "09:40"],
      [1, "14:15"],
      [1, "14:15"],
      [-1, "08:30"],
      [-3, "16:00"],
    ],
    items: [
      line(
        "PM-40921-1",
        "Classic heavy tee",
        "black",
        "Black",
        "front",
        BAILEY_FC,
        {
          methodId: "screen",
          positions: ["front-chest", "left-sleeve"],
          counts: { S: 4, M: 12, L: 16, XL: 8, "2XL": 4 },
          turnaroundId: "standard",
        },
        CHECKED(
          "bailey-fc-crest.svg",
          "Vector, 2 spot colours. Ready for screen.",
        ),
      ),
      line(
        "PM-40921-2",
        "Cuffed beanie",
        "black",
        "Black",
        "folded",
        BAILEY_FC,
        {
          methodId: "embroidery",
          positions: ["front-chest"],
          counts: { M: 24 },
          turnaroundId: "standard",
        },
        CHECKED(
          "bailey-fc-crest.svg",
          "Digitised to 55mm wide. Stitch count 8,400.",
        ),
      ),
    ],
    address: ["Bailey FC Clubhouse", "Cornwallis Avenue", "Medway, Kent ME4 4TZ"],
    proof: {
      file: "PM-40921-proof-v2.pdf",
      version: 2,
      art: BAILEY_FC,
      note: "Crest moved 15mm up from v1, as asked. Sleeve print unchanged.",
    },
  },
  {
    ref: "PM-40817",
    stage: 3,
    at: [
      [4, "08:50"],
      [4, "15:20"],
      [3, "09:05"],
      [3, "11:40"],
      [-1, "16:00"],
    ],
    items: [
      line(
        "PM-40817-1",
        "Premium ringspun tee",
        "natural",
        "Natural",
        "back",
        MEDWAY_10K,
        {
          methodId: "dtg",
          positions: ["back"],
          counts: { S: 8, M: 22, L: 26, XL: 14, "2XL": 6 },
          turnaroundId: "standard",
        },
        CHECKED("medway-10k-2026.png", "300 DPI at print size. Trimmed at proof."),
      ),
    ],
    address: ["Medway Runners", "43 High Street", "Rochester, Kent ME1 1LN"],
  },
  {
    ref: "PM-40644",
    stage: 5,
    at: [
      [14, "09:15"],
      [14, "13:50"],
      [14, "16:20"],
      [13, "08:40"],
      [11, "15:10"],
    ],
    items: [
      line(
        "PM-40644-1",
        "Classic pullover hoodie",
        "forest",
        "Forest green",
        "front",
        BAILEY_FC,
        {
          methodId: "screen",
          positions: ["front-chest"],
          counts: { S: 6, M: 14, L: 18, XL: 10, "2XL": 4 },
          turnaroundId: "standard",
        },
        CHECKED("bailey-fc-crest.svg", "Vector, 2 spot colours."),
      ),
      line(
        "PM-40644-2",
        "Heavy canvas tote",
        "natural",
        "Natural",
        "folded",
        BAILEY_FC,
        {
          methodId: "screen",
          positions: ["front-chest"],
          counts: { M: 50 },
          turnaroundId: "standard",
        },
        CHECKED("bailey-fc-crest.svg", "One colour, 240mm wide."),
      ),
    ],
    address: ["Bailey FC Clubhouse", "Cornwallis Avenue", "Medway, Kent ME4 4TZ"],
  },
  {
    ref: "PM-40312",
    stage: 5,
    at: [
      [32, "10:05"],
      [32, "16:40"],
      [31, "09:25"],
      [31, "14:00"],
      [29, "16:00"],
    ],
    items: [
      line(
        "PM-40312-1",
        "Classic piqué polo",
        "navy",
        "Navy",
        "front",
        BAILEY_FC,
        {
          methodId: "embroidery",
          positions: ["left-chest"],
          counts: { S: 4, M: 10, L: 12, XL: 8 },
          turnaroundId: "express",
        },
        CHECKED("bailey-fc-crest.svg", "Digitised to 70mm wide."),
      ),
    ],
    address: ["Bailey FC Clubhouse", "Cornwallis Avenue", "Medway, Kent ME4 4TZ"],
  },
  {
    ref: "PM-39980",
    stage: 5,
    at: [
      [58, "08:45"],
      [58, "14:30"],
      [57, "10:10"],
      [57, "13:15"],
      [54, "15:40"],
    ],
    items: [
      line(
        "PM-39980-1",
        "Event tee",
        "white",
        "White",
        "front",
        MEDWAY_10K,
        {
          methodId: "screen",
          positions: ["front-chest", "back"],
          counts: { S: 20, M: 60, L: 70, XL: 40, "2XL": 10 },
          turnaroundId: "standard",
        },
        CHECKED("medway-10k-2026.png", "Separated to 1 colour for the run."),
      ),
    ],
    address: ["Medway Runners", "43 High Street", "Rochester, Kent ME1 1LN"],
  },
];

/* ─── Saved designs ──────────────────────────────────────────────────────── */

export type SavedDesign = {
  id: string;
  name: string;
  /** Working days ago it was saved. */
  saved: number;
  line: BasketLine;
};

const SEED_DESIGNS: SavedDesign[] = [
  {
    id: "D-1",
    name: "Match day tee",
    saved: 1,
    line: SEED_ORDERS[0].items[0],
  },
  {
    id: "D-2",
    name: "Club hoodie — squad",
    saved: 14,
    line: SEED_ORDERS[2].items[0],
  },
  {
    id: "D-3",
    name: "10K finisher tee",
    saved: 4,
    line: SEED_ORDERS[1].items[0],
  },
  {
    id: "D-4",
    name: "Committee polo",
    saved: 32,
    line: SEED_ORDERS[3].items[0],
  },
  {
    id: "D-5",
    name: "Clubhouse tote",
    saved: 14,
    line: SEED_ORDERS[2].items[1],
  },
  {
    id: "D-6",
    name: "Winter beanie",
    saved: 1,
    line: SEED_ORDERS[0].items[1],
  },
];

/* ─── Artwork library ────────────────────────────────────────────────────── */

/** Ready to print, one thing to look at, or not usable at this size. */
export type ArtReadiness = "ready" | "check" | "not-ready";

export type ArtworkFile = {
  name: string;
  /** As supplied — millimetres for vector, pixels for raster. */
  size: string;
  dpi: string;
  mode: string;
  /** Working days ago it was uploaded. */
  added: number;
  jobs: string[];
  readiness: ArtReadiness;
  note: string;
  preview: string | null;
};

export const READINESS: Record<ArtReadiness, { label: string; dot: string }> = {
  ready: { label: "Print ready", dot: "border-press bg-press" },
  check: { label: "One thing to check", dot: "border-amber bg-amber" },
  // Hollow, so "we can't use this" reads before the words do.
  "not-ready": { label: "Not usable at size", dot: "border-ink/45 bg-transparent" },
};

export const ARTWORK: ArtworkFile[] = [
  {
    name: "bailey-fc-crest.svg",
    size: "297 × 208 MM",
    dpi: "VECTOR",
    mode: "2 SPOT",
    added: 58,
    jobs: ["PM-40921", "PM-40644", "PM-40312", "PM-39980"],
    readiness: "ready",
    note: "Outlined, two spot colours. Scales to any size we print.",
    preview: BAILEY_FC,
  },
  {
    name: "medway-10k-2026.png",
    size: "2480 × 1748 PX",
    dpi: "300 DPI",
    mode: "RGB",
    added: 4,
    jobs: ["PM-40817"],
    readiness: "check",
    note: "White box behind the mark. We trimmed it at proof stage — send a transparent version and we'll swap it in.",
    preview: MEDWAY_10K,
  },
  {
    name: "bailey-fc-crest-mono.ai",
    size: "210 × 148 MM",
    dpi: "VECTOR",
    mode: "1 SPOT",
    added: 32,
    jobs: ["PM-40312"],
    readiness: "ready",
    note: "Single-colour version, for embroidery and one-colour runs.",
    preview: null,
  },
  {
    name: "sponsor-block-2026.pdf",
    size: "420 × 90 MM",
    dpi: "VECTOR",
    mode: "CMYK",
    added: 14,
    jobs: ["PM-40644"],
    readiness: "ready",
    note: "Four sponsor marks on one strip, back print.",
    preview: null,
  },
  {
    name: "squad-photo-back.jpg",
    size: "900 × 640 PX",
    dpi: "72 DPI",
    mode: "RGB",
    added: 14,
    jobs: [],
    readiness: "not-ready",
    note: "72 DPI — at back-print size that's 90 DPI on the shirt. Send the camera original and we'll re-check it.",
    preview: null,
  },
  {
    name: "medway-10k-2026-white.png",
    size: "2480 × 1748 PX",
    dpi: "300 DPI",
    mode: "RGB",
    added: 3,
    jobs: [],
    readiness: "ready",
    note: "White version for dark garments. Transparent background.",
    preview: null,
  },
];

/* ─── Addresses and details ──────────────────────────────────────────────── */

export type Address = {
  id: string;
  label: string;
  name: string;
  lines: string[];
  primary?: boolean;
  /** Where the last delivery to this address went. */
  lastUsed?: string;
};

export const ADDRESSES: Address[] = [
  {
    id: "A-1",
    label: "DELIVERY · DEFAULT",
    name: "Bailey FC Clubhouse",
    lines: ["Cornwallis Avenue", "Medway", "Kent", "ME4 4TZ"],
    primary: true,
    lastUsed: "PM-40921",
  },
  {
    id: "A-2",
    label: "DELIVERY",
    name: "Medway Runners",
    lines: ["43 High Street", "Rochester", "Kent", "ME1 1LN"],
    lastUsed: "PM-40817",
  },
  {
    id: "A-3",
    label: "BILLING",
    name: "Bailey FC (Treasurer)",
    lines: ["12 Watts Avenue", "Rochester", "Kent", "ME1 1RT"],
  },
];

export const DETAILS = {
  name: "Sam Okoro",
  role: "Kit secretary, Bailey FC",
  account: "PM-C-2214",
  since: 58,
  rows: [
    ["NAME", "Sam Okoro"],
    ["EMAIL", "sam@baileyfc.co.uk"],
    ["PHONE", "01634 555 018"],
    ["ORGANISATION", "Bailey FC"],
    ["VAT NUMBER", "NOT REGISTERED"],
    ["PROOFS GO TO", "sam@baileyfc.co.uk"],
    ["INVOICES GO TO", "treasurer@baileyfc.co.uk"],
    ["PAYMENT TERMS", "CARD ON ORDER"],
  ],
};

/* ─── The store ──────────────────────────────────────────────────────────── */

/* Module-level, like the basket: approving a proof has to be visible on the
 * orders list and the rail as well as the detail page, and none of the three
 * share a provider. Client navigation keeps it; a reload puts the seed back. */
let orders: Order[] = SEED_ORDERS;
let designs: SavedDesign[] = SEED_DESIGNS;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};

export const getOrders = () => orders;
export const getDesigns = () => designs;
export const orderByRef = (ref: string) => orders.find((o) => o.ref === ref);

export const useOrders = () =>
  React.useSyncExternalStore(subscribe, getOrders, getOrders);
export const useDesigns = () =>
  React.useSyncExternalStore(subscribe, getDesigns, getDesigns);

const hhmm = (d: Date) =>
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

/**
 * Approval is the one thing on this page that changes the press schedule, so it
 * writes a real reading of the clock into both the approval and the press
 * stage — that's what "approving starts the clock" means.
 */
export function approveProof(ref: string, now = new Date()) {
  orders = orders.map((o) =>
    o.ref === ref
      ? {
          ...o,
          stage: 3,
          approvedAt: now,
          at: o.at.map((s, i) =>
            i === 2 || i === 3 ? ([0, hhmm(now)] as Stamp) : s,
          ),
        }
      : o,
  );
  emit();
}

export function requestChange(ref: string) {
  orders = orders.map((o) =>
    o.ref === ref ? { ...o, changeRequested: true } : o,
  );
  emit();
}

export function removeDesign(id: string) {
  designs = designs.filter((d) => d.id !== id);
  emit();
}

/** Reorder — a saved run goes back in the basket exactly as it was printed. */
export const reorder = (lines: BasketLine[]) => lines.forEach((l) => addLine(l));

/* ─── Derived ────────────────────────────────────────────────────────────── */

export const orderTotals = (o: Order) => totals(o.items);

/** "THU 24 JUL · 14:15", or a projection when the stage hasn't happened yet. */
export function stampAt(today: Date | null, [days, time]: Stamp) {
  if (!today) return "—";
  const d = days >= 0 ? subWorkingDays(today, days) : addWorkingDays(today, -days);
  return `${fmtDate(d)} · ${time}`;
}

/** The date an order was placed — stage one is the moment it hit the job book. */
export const placedOn = (today: Date | null, o: Order) =>
  today ? fmtDate(subWorkingDays(today, o.at[0][0])) : "—";

/** The five markers, with the state each one draws itself in. */
export const orderStages = (today: Date | null, o: Order): StageView[] =>
  STAGES.map((s, i) => ({
    key: s.key,
    label: s.label,
    when: stampAt(today, o.at[i]),
    state: i < o.stage ? "done" : i === o.stage ? "now" : "todo",
  }));

/** A working-day count read as a date — "saved 14 working days ago". */
export const daysAgo = (today: Date | null, n: number) =>
  today ? fmtDate(subWorkingDays(today, n)) : "—";
