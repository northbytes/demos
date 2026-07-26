/* Self-check for the basket maths — the quantity-break nudge is the only claim
 * on the page that could be a lie, so it gets the most attention here.
 *
 *   node --experimental-strip-types src/lib/basket.check.ts
 */

import assert from "node:assert/strict";
import { getLines, sizeRun, timeline, totals, nudgeCopy } from "./basket.ts";
import {
  BANDS,
  bandFor,
  breakNudge,
  nextBand,
  priceRun,
  SIZE_SURCHARGE,
  type Run,
} from "./pricing.ts";
import { addWorkingDays, dispatchLabel, dispatchWindow } from "./dates.ts";

const lines = getLines();
const near = (a: number, b: number, msg: string) =>
  assert.ok(Math.abs(a - b) < 0.005, `${msg}: ${a} vs ${b}`);

/* ── Working days ──────────────────────────────────────────────────────────
 * Friday + 1 working day is Monday, not Saturday. */
const friday = new Date(2026, 6, 24); // Fri 24 Jul 2026
assert.equal(addWorkingDays(friday, 1).getDay(), 1);
assert.equal(addWorkingDays(friday, 5).getDate(), 31);
assert.equal(addWorkingDays(new Date(2026, 6, 20), 0).getDate(), 20);

/* A weekend order starts on the Monday — a same-day collection can't be
 * offered from a unit that's shut, and nothing counts from a Sunday. */
for (const weekend of [new Date(2026, 6, 25), new Date(2026, 6, 26)]) {
  assert.equal(addWorkingDays(weekend, 0).getDate(), 27, "same day → Monday");
  assert.equal(addWorkingDays(weekend, 1).getDate(), 28);
  assert.equal(addWorkingDays(weekend, 7).getDate(), 5, "Mon + 7wd → Wed 5 Aug");
}
assert.equal(dispatchWindow(new Date(2026, 6, 26), [0, 0]), "MON 27 JUL FROM 4PM");
assert.equal(dispatchLabel(new Date(2026, 6, 26), [0, 0]), "COLLECT MON 27 JUL FROM 4PM");
assert.equal(dispatchLabel(null, [5, 7]), "—");
assert.equal(dispatchLabel(new Date(2026, 6, 27), [2, 2]), "DISPATCH WED 29 JUL");

/* ── One line, priced by hand ─────────────────────────────────────────────
 * 4+12+16+8+4 = 44 units, screen (delta 0), front chest (0) + left sleeve
 * (1.20), standard (no uplift), four 2XL at the surcharge. */
const first = lines[0];
const p = priceRun(first.run);
assert.equal(p.qty, 44);
assert.equal(p.band.label, "25–49");
near(p.positionRate, 1.2, "position rate");
near(p.unit, 9.4 + 1.2, "unit");
assert.equal(p.surchargeUnits, 4);
near(p.surcharge, 4 * SIZE_SURCHARGE, "surcharge");
near(p.total, 44 * 10.6 + 4.8, "line total");
near(p.perUnit, p.total / 44, "per unit");
assert.equal(p.belowMin, false); // 44 ≥ screen's 25

/* Uplift is applied to the whole line, surcharge included. */
const express: Run = { ...first.run, turnaroundId: "express" };
near(priceRun(express).total, p.total * 1.15, "express uplift");

/* ── The nudge ─────────────────────────────────────────────────────────────
 * It must only fire when the bigger run genuinely costs less overall. */
const n = breakNudge(first.run);
assert.ok(n, "44 units should reach a cheaper 50");
assert.equal(n.add, 6);
assert.equal(n.band.label, "50–99");
near(n.unitThen, 7.9 + 1.2, "unit at the next break");
near(n.totalThen, 50 * 9.1 + 4.8, "total at the next break");
near(n.saving, p.total - n.totalThen, "saving");
assert.ok(n.saving > 0);

/* Line two sits at 20 units: 25 at £9.40 is cheaper per shirt and dearer in
 * total, so there is nothing honest to say and the nudge stays quiet. */
const second = priceRun(lines[1].run);
assert.equal(second.qty, 20);
assert.ok(nextBand(20), "there is a band above 20");
assert.equal(breakNudge(lines[1].run), undefined);
assert.equal(nudgeCopy(lines[1].run), undefined);

/* Every band that does fire must actually save money, at every position rate. */
for (const b of BANDS) {
  for (const rate of [0, 1.2, 2.4, 4]) {
    const run: Run = {
      methodId: "screen",
      positions: rate ? ["back"] : [],
      counts: { M: b.from },
      turnaroundId: "standard",
    };
    const hit = breakNudge(run);
    if (hit) assert.ok(hit.saving > 0, `band ${b.label} nudge must save`);
  }
}

/* At the top band there is nowhere left to go. */
assert.equal(
  breakNudge({
    methodId: "screen",
    positions: [],
    counts: { M: 260 },
    turnaroundId: "standard",
  }),
  undefined,
);

/* The copy quotes the same unit figure the row shows — no second price. */
const copy = nudgeCopy(first.run);
assert.ok(copy, "the first line has a nudge");
assert.ok(copy.text.includes("£9.10"), copy.text);
assert.ok(copy.text.includes("Add 6 more"), copy.text);

/* ── Totals ────────────────────────────────────────────────────────────── */
const t = totals(lines);
near(
  t.goods,
  lines.reduce((a, l) => a + priceRun(l.run).total, 0),
  "goods",
);
assert.equal(t.units, 44 + 20 + 30);
assert.equal(t.delivery, 0, "over £75, so delivery is free");
near(t.vat, t.net * 0.2, "vat");
near(t.total, t.net * 1.2, "total inc vat");
assert.equal(t.missingArtwork.length, 1);

/* Collection never charges delivery, and a small basket does. */
assert.equal(totals(lines, true).delivery, 0);
const tiny = totals([lines[1]].map((l) => ({
  ...l,
  run: { ...l.run, counts: { M: 1 } },
})));
assert.ok(tiny.goods < 75);
assert.equal(tiny.delivery, 6.5);
assert.equal(totals([], false).delivery, 0, "empty basket pays no delivery");

/* ── Labels ────────────────────────────────────────────────────────────── */
assert.equal(sizeRun(first.run.counts), "S×4  M×12  L×16  XL×8  2XL×4");
assert.equal(sizeRun({ S: 0, M: 3 }), "M×3");

/* ── Timeline ──────────────────────────────────────────────────────────── */
const today = new Date(2026, 6, 27); // Mon 27 Jul 2026
const stages = timeline(today, lines);
assert.equal(stages.length, 5);
assert.equal(stages[0].state, "now", "a missing file holds the artwork check");
assert.ok(stages[0].when.includes("FILES LAND"));
assert.ok(stages[0].note.startsWith("2 of 3 files"), stages[0].note);
/* No press date can be promised while a file is outstanding. */
assert.equal(stages[3].when, "THE DAY AFTER YOU APPROVE");
assert.ok(stages[4].note.includes("lands today"), stages[4].note);
/* Slowest line is standard (7 working days) → Wed 5 Aug. */
assert.equal(stages[4].when, "WED 5 AUG");

/* With every file in, the check is done and the proof is the live stage. */
const allIn = timeline(
  today,
  lines.filter((l) => l.artwork.status !== "missing"),
);
assert.equal(allIn[0].state, "done");
assert.equal(allIn[1].state, "now");
assert.equal(allIn[3].when, "TUE 28 JUL", "one working day on from Mon 27th");
assert.ok(!allIn[4].note.includes("lands today"));
/* Both remaining lines are express or standard — standard still sets the date. */
assert.equal(allIn[4].when, "WED 5 AUG");

/* ── Band edges ────────────────────────────────────────────────────────── */
assert.equal(bandFor(0).label, "1–9");
assert.equal(bandFor(9).label, "1–9");
assert.equal(bandFor(10).label, "10–24");
assert.equal(bandFor(9999).label, "100+");

console.log("basket.check.ts — ok");
