/* Quantity breaks and print-job pricing — the one source of truth.
 * Shared by the homepage price ladder, the product configurator and the basket,
 * so a price can't be one number on the configurator and another at checkout.
 *
 * Self-check: `node --experimental-strip-types src/lib/pricing.check.ts`. */

import type { PositionId } from "./occasions";

export const BANDS = [
  { from: 1, to: 9, price: 14.5, label: "1–9" },
  { from: 10, to: 24, price: 11.2, label: "10–24" },
  { from: 25, to: 49, price: 9.4, label: "25–49" },
  { from: 50, to: 99, price: 7.9, label: "50–99" },
  { from: 100, to: 250, price: 6.4, label: "100+" },
];

export const money = (n: number) =>
  n.toLocaleString("en-GB", { style: "currency", currency: "GBP" });

/** The band a run falls in. Above the top `to`, the last band still applies. */
export const bandFor = (qty: number) =>
  BANDS.find((b) => qty <= b.to) ?? BANDS[BANDS.length - 1];

/** The next band up, or undefined once the best price is reached. */
export const nextBand = (qty: number) => BANDS.find((b) => b.from > qty);

/* ─── What a print job is made of ────────────────────────────────────────── */

export const PRINT_METHODS = [
  {
    id: "screen",
    name: "Screen print",
    best: "Bulk runs in flat spot colours",
    min: 25,
    delta: 0,
  },
  {
    id: "dtg",
    name: "DTG",
    best: "Photographic artwork and small runs",
    min: 1,
    delta: 3.2,
  },
  {
    id: "embroidery",
    name: "Embroidery",
    best: "Logos that need to last a work year",
    min: 10,
    delta: 2.4,
  },
];

/** Position id, name and per-unit rate. The configurator hangs its hotspot
 * geometry off these by id; nothing else needs to know where they sit. */
export const PRINT_POSITIONS: { id: PositionId; name: string; price: number }[] =
  [
    { id: "front-chest", name: "Front chest", price: 0 },
    { id: "left-chest", name: "Left chest", price: 1.6 },
    { id: "left-sleeve", name: "Left sleeve", price: 1.2 },
    { id: "right-sleeve", name: "Right sleeve", price: 1.2 },
    { id: "back", name: "Back", price: 2.4 },
  ];

/** Extra cloth costs extra, from 2XL up. */
export const SIZE_SURCHARGE = 1.2;

export const SIZES = [
  { id: "S", surcharge: 0 },
  { id: "M", surcharge: 0 },
  { id: "L", surcharge: 0 },
  { id: "XL", surcharge: 0 },
  { id: "2XL", surcharge: SIZE_SURCHARGE },
  { id: "3XL", surcharge: SIZE_SURCHARGE },
  { id: "4XL", surcharge: SIZE_SURCHARGE },
  { id: "5XL", surcharge: SIZE_SURCHARGE },
];

/** `days` is the working-day window a run dispatches in; 0 means collection. */
export const TURNAROUNDS = [
  {
    id: "standard",
    name: "Standard",
    note: "5–7 working days",
    cost: "Included",
    uplift: 0,
    days: [5, 7] as [number, number],
  },
  {
    id: "express",
    name: "Express",
    note: "48 hours",
    cost: "+15%",
    uplift: 0.15,
    days: [2, 2] as [number, number],
  },
  {
    id: "same-day",
    name: "Same-day collection",
    note: "Selected items only",
    cost: "+30%",
    uplift: 0.3,
    days: [0, 0] as [number, number],
  },
];

/* ─── The money ──────────────────────────────────────────────────────────── */

/** One configured print run: what the configurator builds and the basket holds. */
export type Run = {
  methodId: string;
  positions: PositionId[];
  /** Size id → units. Sizes with no units may be absent or zero. */
  counts: Record<string, number>;
  turnaroundId: string;
};

export function priceRun(run: Run) {
  const method =
    PRINT_METHODS.find((m) => m.id === run.methodId) ?? PRINT_METHODS[0];
  const turn =
    TURNAROUNDS.find((t) => t.id === run.turnaroundId) ?? TURNAROUNDS[0];
  const positions = PRINT_POSITIONS.filter((p) => run.positions.includes(p.id));

  const qty = Object.values(run.counts).reduce((a, b) => a + b, 0);
  const band = bandFor(qty);
  const positionRate = positions.reduce((a, p) => a + p.price, 0);

  /** What one shirt costs to buy and print, before the big-size surcharge. */
  const unit = band.price + method.delta + positionRate;

  const surchargeUnits = SIZES.filter((s) => s.surcharge > 0).reduce(
    (a, s) => a + (run.counts[s.id] ?? 0),
    0,
  );
  const surcharge = surchargeUnits * SIZE_SURCHARGE;
  const subtotal = qty * unit + surcharge;
  const total = subtotal * (1 + turn.uplift);

  return {
    method,
    turn,
    positions,
    qty,
    band,
    positionRate,
    unit,
    surchargeUnits,
    surcharge,
    subtotal,
    total,
    perUnit: qty ? total / qty : 0,
    belowMin: qty > 0 && qty < method.min,
  };
}

/**
 * The quantity break worth pointing at in the basket: the next one up, but only
 * when reaching it costs *less* than the run as it stands. Most breaks don't —
 * 20 → 25 at £11.20 → £9.40 is still £23 more money — and a nudge that claims a
 * saving it can't deliver is worse than no nudge.
 */
export function breakNudge(run: Run) {
  const now = priceRun(run);
  const next = nextBand(now.qty);
  if (!next) return undefined;

  // The extra units go on the base sizes, so the 2XL+ surcharge doesn't move.
  const unitThen = next.price + now.method.delta + now.positionRate;
  const totalThen =
    (next.from * unitThen + now.surcharge) * (1 + now.turn.uplift);
  const saving = now.total - totalThen;

  return saving > 0
    ? { add: next.from - now.qty, band: next, unitThen, totalThen, saving }
    : undefined;
}
