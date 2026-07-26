/* Self-check for the account area. Two things here can quietly lie: the stage
 * stamps (a "completed" stage dated in the future) and approval (which has to
 * move the job and the clock together).
 *
 *   node --experimental-strip-types src/lib/account.check.ts
 */

import assert from "node:assert/strict";
import {
  ARTWORK,
  STAGES,
  approveProof,
  daysAgo,
  getDesigns,
  getOrders,
  orderByRef,
  orderStages,
  orderTotals,
  placedOn,
  removeDesign,
  reorder,
  stampAt,
  statusOf,
} from "./account.ts";
import { getLines } from "./basket.ts";
import { subWorkingDays } from "./dates.ts";
import { priceRun } from "./pricing.ts";

const today = new Date(2026, 6, 27); // Mon 27 Jul 2026

/* ── Working days back ─────────────────────────────────────────────────────
 * Monday − 1 working day is the Friday before, not Sunday. */
assert.equal(subWorkingDays(today, 1).getDate(), 24);
assert.equal(subWorkingDays(today, 5).getDate(), 20);
assert.equal(subWorkingDays(today, 0).getDate(), 27);
// A weekend reading falls back to the Friday before counting starts.
assert.equal(subWorkingDays(new Date(2026, 6, 26), 0).getDate(), 24);
assert.equal(subWorkingDays(new Date(2026, 6, 26), 1).getDate(), 23);

assert.equal(stampAt(today, [1, "14:15"]), "FRI 24 JUL · 14:15");
assert.equal(stampAt(today, [-1, "08:30"]), "TUE 28 JUL · 08:30");
assert.equal(stampAt(null, [1, "14:15"]), "—");
assert.equal(daysAgo(today, 0), "MON 27 JUL");

/* ── Every order's stamps have to agree with its stage ─────────────────────
 * A stage the job has reached is dated when it started, so it's in the past;
 * one it hasn't reached is a projection, so it's in the future. Time only ever
 * runs one way down the list. */
for (const o of getOrders()) {
  assert.equal(o.at.length, STAGES.length, `${o.ref} needs five stamps`);

  o.at.forEach(([days], i) => {
    if (i <= o.stage) assert.ok(days >= 0, `${o.ref} stage ${i} is live but dated ahead`);
    else assert.ok(days < 0, `${o.ref} stage ${i} is not reached but dated in the past`);
    if (i > 0) {
      assert.ok(
        days <= o.at[i - 1][0],
        `${o.ref} stage ${i} happens before the stage before it`,
      );
    }
  });

  const stages = orderStages(today, o);
  assert.equal(stages.filter((s) => s.state === "now").length, o.stage < 5 ? 1 : 0);
  assert.equal(stages.filter((s) => s.state === "done").length, o.stage);
  assert.ok(o.items.length > 0, `${o.ref} has no items`);
  assert.ok(placedOn(today, o).length > 0);
}

/* One order of each status, so the list actually shows three dot colours. */
const statuses = getOrders().map(statusOf);
for (const s of ["approval", "production", "delivered"] as const) {
  assert.ok(statuses.includes(s), `no order is ${s}`);
}
assert.equal(statuses.filter((s) => s === "approval").length, 1);

/* ── Totals come off the shared pricing, not a second sum ───────────────── */
const first = getOrders()[0];
const sum = orderTotals(first);
assert.equal(
  sum.units,
  first.items.reduce((a, l) => a + priceRun(l.run).qty, 0),
);
assert.ok(sum.total > sum.goods, "VAT is missing from the order total");

/* ── Approval moves the job and the clock together ─────────────────────── */
const pending = getOrders().find((o) => statusOf(o) === "approval");
assert.ok(pending, "the demo needs an order awaiting approval");
assert.equal(pending.stage, 2);
assert.ok(pending.proof, "an order awaiting approval must have a proof");

const at = new Date(2026, 6, 27, 15, 4);
approveProof(pending.ref, at);
const after = orderByRef(pending.ref);
assert.ok(after);
assert.equal(after.stage, 3, "approval puts the job on press");
assert.equal(statusOf(after), "production");
assert.equal(after.approvedAt, at);
// Both the approval and the press stamp read the moment of approval.
assert.deepEqual(after.at[2], [0, "15:04"]);
assert.deepEqual(after.at[3], [0, "15:04"]);
assert.equal(orderStages(today, after)[2].when, "MON 27 JUL · 15:04");
// Ready is still ahead of the job, so the stamps stay consistent.
assert.ok(after.at[4][0] < 0);
assert.equal(orderStages(today, after).filter((s) => s.state === "done").length, 3);

/* ── Reorder puts the run back in the basket with a fresh id ───────────── */
const before = getLines().length;
reorder(after.items);
const lines = getLines();
assert.equal(lines.length, before + after.items.length);
assert.equal(new Set(lines.map((l) => l.id)).size, lines.length, "duplicate line id");
assert.equal(lines[before].run.counts.M, after.items[0].run.counts.M);
// Twice in one visit is a real thing customers do — and still no clash.
reorder(after.items);
assert.equal(new Set(getLines().map((l) => l.id)).size, getLines().length);

/* ── Saved designs empty out, which is what the empty state is for ─────── */
const designs = getDesigns();
assert.ok(designs.length > 0);
designs.forEach((d) => removeDesign(d.id));
assert.equal(getDesigns().length, 0);

/* ── Artwork metadata is complete enough to print from ─────────────────── */
for (const a of ARTWORK) {
  assert.ok(/\.(svg|png|ai|pdf|jpg)$/.test(a.name), `${a.name} has no extension`);
  assert.ok(a.size && a.dpi && a.mode && a.note, `${a.name} is missing metadata`);
  // A file good enough to print has been printed, or is waiting to be.
  if (a.readiness === "not-ready") assert.equal(a.jobs.length, 0, a.name);
}

console.log("account.check.ts — ok");
