/* Self-check for the large-format quote rules — the unit toggle and the
 * per-step gate are the only logic on the form that can silently go wrong.
 *
 *   node --experimental-strip-types src/lib/large-format.check.ts
 */

import assert from "node:assert/strict";
import {
  EMPTY_DRAFT,
  LF_PRODUCTS,
  MAX_WIDTH_MM,
  SUBSTRATES,
  convert,
  fmtSize,
  needsPanelling,
  stepIssues,
  toMm,
  type QuoteDraft,
} from "./large-format.ts";

const d = (patch: Partial<QuoteDraft>): QuoteDraft => ({
  ...EMPTY_DRAFT,
  ...patch,
});

/* ── Catalogue ───────────────────────────────────────────────────────────── */

// Site boards are the one that must never offer a basket.
assert.equal(LF_PRODUCTS.length, 5);
assert.equal(LF_PRODUCTS.filter((p) => p.cta === "quote").length, 1);
assert.equal(LF_PRODUCTS.find((p) => p.cta === "quote")!.id, "site-boards");
assert.ok(LF_PRODUCTS.every((p) => p.spec.length === 5));
assert.equal(new Set(SUBSTRATES.map((s) => s.id)).size, SUBSTRATES.length);

/* ── Units ───────────────────────────────────────────────────────────────── */

assert.equal(convert(0, "mm", "in"), 0);
assert.equal(convert(500, "mm", "mm"), 500);
assert.equal(convert(254, "mm", "in"), 10);
assert.equal(convert(10, "in", "mm"), 254);
// A round trip has to land back on the exact millimetre, or toggling the unit
// twice quietly resizes someone's banner.
for (const mm of [300, 841, 1189, 1220, 1600, 2440, 3000, 5997]) {
  assert.equal(
    convert(convert(mm, "mm", "in"), "in", "mm"),
    mm,
    `round trip drifted at ${mm}mm`,
  );
}
assert.equal(toMm(2, "in"), 50.8);

/* ── Panelling ───────────────────────────────────────────────────────────── */

// A 6m × 1.2m banner still prints in one piece — the short side is what has to
// fit across the roll.
assert.equal(needsPanelling(d({ width: 6000, height: 1200 })), false);
assert.equal(needsPanelling(d({ width: 2000, height: 2000 })), true);
assert.equal(
  needsPanelling(d({ width: 100, height: 100, unit: "in" })),
  100 * 25.4 > MAX_WIDTH_MM,
);

/* ── Step gate ───────────────────────────────────────────────────────────── */

// Quantity starts at 1, so a blank form is short a product, a size and a place.
assert.equal(stepIssues(1, EMPTY_DRAFT).length, 3);
const specced = d({
  product: "PVC banners",
  quantity: 2,
  width: 3000,
  height: 1000,
  place: "Outdoor",
});
assert.deepEqual(stepIssues(1, specced), []);
assert.deepEqual(stepIssues(1, { ...specced, quantity: 0 }).length, 1);
assert.deepEqual(stepIssues(1, { ...specced, height: 0 }).length, 1);

// Step 2 clears either by uploading or by asking us to design it.
assert.equal(stepIssues(2, specced).length, 1);
assert.deepEqual(stepIssues(2, { ...specced, needsDesign: true }), []);
assert.deepEqual(stepIssues(2, { ...specced, artwork: "logo.pdf" }), []);

// Step 3 needs a name and something that looks like an email.
assert.equal(stepIssues(3, specced).length, 2);
assert.equal(stepIssues(3, { ...specced, name: "Dan", email: "dan@" }).length, 1);
assert.deepEqual(
  stepIssues(3, { ...specced, name: "Dan", email: "dan@bailey.co.uk" }),
  [],
);
// Fixings and the notes box are genuinely optional.
assert.deepEqual(stepIssues(1, { ...specced, fixings: [] }), []);

assert.equal(fmtSize(specced), "3000 × 1000mm");
assert.equal(fmtSize(EMPTY_DRAFT), "—");

console.log(
  `ok — ${LF_PRODUCTS.length} products, ${SUBSTRATES.length} substrates, step gate clean`,
);
