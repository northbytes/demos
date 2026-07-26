/* The basket, its totals, and the order that comes out the other end.
 *
 * ponytail: the lines are seeded rather than built up by the configurator —
 * there's no server or session here to hold a real one. Everything downstream
 * of them is derived, so the numbers on the basket, the checkout summary and
 * the confirmation are the same numbers, computed once.
 *
 * Self-check: `node --experimental-strip-types src/lib/basket.check.ts`. */

import * as React from "react";
import type { ColourId } from "./catalog";
import { addWorkingDays, fmtDate } from "./dates.ts";
import { breakNudge, money, priceRun, TURNAROUNDS, type Run } from "./pricing.ts";
import { BAILEY_FC, MEDWAY_10K } from "./sample-art.ts";
import type { View } from "@/components/site/garment";

/* ─── A line ─────────────────────────────────────────────────────────────── */

/** Custom print has a state a normal store doesn't: paid for, not yet drawn. */
export type ArtworkState =
  | { status: "checked"; name: string; note: string }
  | { status: "warning"; name: string; note: string }
  | { status: "missing"; name?: undefined; note: string };

export type BasketLine = {
  id: string;
  product: string;
  /** Back to the configurator with this run loaded. */
  href: string;
  colourId: ColourId;
  colourName: string;
  /** The face the artwork is on — the thumbnail shows the print, not the label. */
  view: View;
  artUrl: string | null;
  run: Run;
  artwork: ArtworkState;
};

const CONFIGURE = "/products/classic-heavy-tee";

const SEED: BasketLine[] = [
  {
    id: "PM-L1",
    product: "Classic heavy tee",
    href: CONFIGURE,
    colourId: "black",
    colourName: "Black",
    view: "front",
    artUrl: BAILEY_FC,
    run: {
      methodId: "screen",
      positions: ["front-chest", "left-sleeve"],
      counts: { S: 4, M: 12, L: 16, XL: 8, "2XL": 4 },
      turnaroundId: "standard",
    },
    artwork: {
      status: "checked",
      name: "bailey-fc-crest.svg",
      note: "Vector, 2 spot colours. Ready for screen.",
    },
  },
  {
    id: "PM-L2",
    product: "Premium ringspun tee",
    href: CONFIGURE,
    colourId: "natural",
    colourName: "Natural",
    view: "back",
    artUrl: MEDWAY_10K,
    run: {
      methodId: "dtg",
      positions: ["back"],
      counts: { S: 2, M: 6, L: 8, XL: 4 },
      turnaroundId: "express",
    },
    artwork: {
      status: "warning",
      name: "medway-10k-2026.png",
      note: "There's a white box behind the mark. Send a transparent version, or we'll trim it at proof stage.",
    },
  },
  {
    id: "PM-L3",
    product: "Organic cotton tee",
    href: CONFIGURE,
    colourId: "forest",
    colourName: "Forest green",
    view: "front",
    artUrl: null,
    run: {
      methodId: "screen",
      positions: ["left-chest"],
      counts: { S: 6, M: 10, L: 10, XL: 4 },
      turnaroundId: "standard",
    },
    artwork: {
      status: "missing",
      note: "Nothing supplied yet. You can order now and send it after — the item stays priced and slotted.",
    },
  },
];

/* ─── The store ──────────────────────────────────────────────────────────── */

/* A module-level store rather than context: the basket is read by three routes
 * and a nav badge, and none of them share a provider. Client navigation keeps
 * it; a hard reload puts the seed back, which is what a demo wants anyway. */
let lines: BasketLine[] = SEED;
const listeners = new Set<() => void>();

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};

export const getLines = () => lines;

export function removeLine(id: string) {
  lines = lines.filter((l) => l.id !== id);
  listeners.forEach((fn) => fn());
}

/* Reorder drops a finished run straight back in, so the id has to be fresh —
 * the same saved design can legitimately be reordered twice in one visit. */
let reorders = 0;

export function addLine(line: BasketLine) {
  lines = [...lines, { ...line, id: `PM-R${++reorders}` }];
  listeners.forEach((fn) => fn());
}

/** The seed is identical on the server, so there's no snapshot to mismatch. */
export const useBasket = () =>
  React.useSyncExternalStore(subscribe, getLines, getLines);

/* ─── Totals ─────────────────────────────────────────────────────────────── */

export const VAT_RATE = 0.2;
export const FREE_DELIVERY_OVER = 75;
export const DELIVERY = 6.5;

/** Everything the summary panel shows, off one pass over the lines. */
export function totals(list: BasketLine[], collecting = false) {
  const priced = list.map((l) => ({ line: l, price: priceRun(l.run) }));
  const goods = priced.reduce((a, p) => a + p.price.total, 0);
  const units = priced.reduce((a, p) => a + p.price.qty, 0);
  const delivery =
    collecting || goods === 0 || goods >= FREE_DELIVERY_OVER ? 0 : DELIVERY;
  const net = goods + delivery;
  const vat = net * VAT_RATE;

  return {
    priced,
    units,
    goods,
    delivery,
    net,
    vat,
    total: net + vat,
    missingArtwork: list.filter((l) => l.artwork.status === "missing"),
  };
}

/** "S×4 M×12 L×16 XL×8 2XL×4" — the run broken down, in press order. */
export const sizeRun = (counts: Record<string, number>) =>
  Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([size, n]) => `${size}×${n}`)
    .join("  ");

/** The nudge sentence, or nothing when the next break costs more than it saves. */
export function nudgeCopy(run: Run) {
  const n = breakNudge(run);
  if (!n) return undefined;
  return {
    ...n,
    text: `Add ${n.add} more and every unit drops to ${money(n.unitThen)} — that's ${money(
      n.saving,
    )} less overall, for more shirts.`,
  };
}

/* ─── The order ──────────────────────────────────────────────────────────── */

/* ponytail: a fixed reference. A real one comes off the job book when the
 * payment clears — there's no server here to ask. */
export const ORDER_REF = "PM-40921";

export const COLLECTION = {
  name: "PRESSMARK",
  lines: ["Unit 7, Bailey Works", "Cornwallis Avenue", "Medway, Kent ME4 4TZ"],
  hours: [
    ["MON–THU", "8:00 — 17:00"],
    ["FRI", "8:00 — 16:00"],
    ["SAT–SUN", "CLOSED"],
  ],
  note: "Ring the buzzer on the roller door. Bring your order number.",
};

/* ponytail: three canned results keyed to one postcode. A real lookup hits a
 * PAF provider; the shape of what comes back is the same. */
export const POSTCODE_RESULTS: Record<string, string[][]> = {
  ME44TZ: [
    ["Unit 7, Bailey Works", "Cornwallis Avenue", "Medway", "ME4 4TZ"],
    ["Unit 8, Bailey Works", "Cornwallis Avenue", "Medway", "ME4 4TZ"],
    ["Unit 9–11, Bailey Works", "Cornwallis Avenue", "Medway", "ME4 4TZ"],
    ["The Gatehouse, Bailey Works", "Cornwallis Avenue", "Medway", "ME4 4TZ"],
  ],
};

export const normalisePostcode = (s: string) =>
  s.toUpperCase().replace(/[^A-Z0-9]/g, "");

export type TimelineStage = {
  key: string;
  label: string;
  when: string;
  note: string;
  state: "done" | "now" | "todo";
};

/**
 * This order's actual dates, not a generic four-step graphic. Missing artwork
 * genuinely moves the first two stages, so it's allowed to say so.
 */
export function timeline(
  today: Date | null,
  list: BasketLine[],
): TimelineStage[] {
  const supplied = list.filter((l) => l.artwork.status !== "missing").length;
  const waiting = supplied < list.length;
  const on = (n: number) => (today ? fmtDate(addWorkingDays(today, n)) : "—");

  /* Ready is the slowest line — the order ships as one consignment. */
  const slowest = list.reduce((a, l) => {
    const t = TURNAROUNDS.find((x) => x.id === l.run.turnaroundId);
    return Math.max(a, t?.days[1] ?? 0);
  }, 0);

  return [
    {
      key: "check",
      label: "Artwork check",
      when: waiting ? "WHEN YOUR FILES LAND" : `${on(0)}, BY 4PM`,
      note: waiting
        ? `${supplied} of ${list.length} files are in. We check the rest the day they arrive.`
        : "A press operator opens every file. Resolution, colours, trapping.",
      state: waiting ? "now" : "done",
    },
    {
      key: "proof",
      label: "Proof sent",
      when: waiting ? "SAME DAY AS THE CHECK" : `${on(0)}, BY 5PM`,
      note: "A dated PDF per garment, showing position and size against the size chart.",
      state: waiting ? "todo" : "now",
    },
    {
      key: "approval",
      label: "Your approval",
      when: "AWAITING YOU",
      note: "Nothing goes on press until you reply. The clock below assumes you approve the same day.",
      state: "todo",
    },
    {
      key: "press",
      /* With a file outstanding there is no honest date here — the run can't
       * start before a proof that can't be drawn yet. Say so rather than
       * printing tomorrow's date and quietly moving it later. */
      label: "On press",
      when: waiting ? "THE DAY AFTER YOU APPROVE" : on(1),
      note: "Screens burnt, colours mixed to your spec, first pull checked against the proof.",
      state: "todo",
    },
    {
      key: "ready",
      label: "Ready",
      when: on(slowest),
      note:
        "Boxed and collected by the courier, or on the desk in Medway from 4pm." +
        (waiting ? " This date holds if the outstanding artwork lands today." : ""),
      state: "todo",
    },
  ];
}
