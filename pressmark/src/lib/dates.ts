/* Working-day arithmetic and the date labels that hang off it.
 *
 * Every date on the site — dispatch windows, proof dates, the production
 * timeline on the confirmation — counts forward from *today*, so none of it can
 * be baked in at build time. `useToday` is the one place that reads the clock.
 *
 * Self-check: `node --experimental-strip-types src/lib/dates.check.ts`. */

import * as React from "react";

/** Today, or the Monday after it — the works is shut at the weekend. */
export function nextWorkingDay(from: Date) {
  const d = new Date(from);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d;
}

/**
 * Saturdays and Sundays don't count, at either end. Counting starts from the
 * next working day, so an order placed on Sunday runs from Monday rather than
 * promising a same-day collection from a closed unit. Bank holidays are the
 * press's problem.
 */
export function addWorkingDays(from: Date, n: number) {
  const d = nextWorkingDay(from);
  while (n > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) n--;
  }
  return d;
}

/** The last working day on or before `from` — the mirror of `nextWorkingDay`. */
export function prevWorkingDay(from: Date) {
  const d = new Date(from);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() - 1);
  return d;
}

/**
 * `n` working days back — what the account area needs, since an order placed
 * "four working days ago" has to land on a day the works was actually open.
 */
export function subWorkingDays(from: Date, n: number) {
  const d = prevWorkingDay(from);
  while (n > 0) {
    d.setDate(d.getDate() - 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) n--;
  }
  return d;
}

/** "THU 30 JUL" — mono, uppercase, the way the spec blocks read. */
export const fmtDate = (d: Date) =>
  d
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    .toUpperCase();

/** The bare window a turnaround lands in — no verb, for a labelled spec row. */
export function dispatchWindow(today: Date | null, days: [number, number]) {
  if (!today) return "—";
  if (days[0] === 0) return `${fmtDate(addWorkingDays(today, 0))} FROM 4PM`;
  if (days[0] === days[1]) return fmtDate(addWorkingDays(today, days[0]));
  return `${fmtDate(addWorkingDays(today, days[0]))} — ${fmtDate(
    addWorkingDays(today, days[1]),
  )}`;
}

/** The same window with its verb, for a tile that has no label beside it. */
export function dispatchLabel(today: Date | null, days: [number, number]) {
  if (!today) return "—";
  const verb = days[0] === 0 ? "COLLECT " : days[0] === days[1] ? "DISPATCH " : "";
  return verb + dispatchWindow(today, days);
}

/* Read through a store with no server snapshot: the server and the first client
 * paint agree on "unknown", then the real date lands. Memoised, so the snapshot
 * is referentially stable and the store never appears to change. */
let clientToday: Date | null = null;
const getToday = () => (clientToday ??= new Date());
const noServerToday = () => null;
const neverChanges = () => () => {};

/** Today on the client; `null` on the server and during the first paint. */
export const useToday = () =>
  React.useSyncExternalStore(neverChanges, getToday, noServerToday);
