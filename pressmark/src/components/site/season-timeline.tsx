"use client";

import * as React from "react";
import type { Occasion } from "@/lib/occasions";

// Initials alone give you three J's and two M's — the axis has to be readable.
const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

/* Today is read once, on the client only. The server snapshot is null so the
 * marker simply isn't in the prerendered HTML — a build-time date would go
 * stale the day after deploy. Same idiom as the configurator. */
let clientToday: Date | undefined;
const getToday = () => (clientToday ??= new Date());
const noServerToday = () => null;
const neverChanges = () => () => {};

const pctOf = (month: number, fraction = 0) => ((month + fraction) / 12) * 100;

export function SeasonTimeline({
  spans,
}: {
  spans: Occasion["season"]["spans"];
}) {
  const today = React.useSyncExternalStore(
    neverChanges,
    getToday,
    noServerToday,
  );

  const at = today
    ? pctOf(
        today.getMonth(),
        (today.getDate() - 1) /
          new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(),
      )
    : null;

  // A label centred on December would hang off the end of the band.
  const nudge =
    at === null
      ? ""
      : at > 84
        ? "-translate-x-full"
        : at < 6
          ? ""
          : "-translate-x-1/2";

  // When the rail overflows — phones — bring the marker into view. It's the
  // one thing on the band that answers "where am I in the year".
  const rail = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = rail.current;
    if (!el || at === null) return;
    const overflow = el.scrollWidth - el.clientWidth;
    if (overflow <= 0) return;
    const centred = (at / 100) * el.scrollWidth - el.clientWidth / 2;
    el.scrollLeft = Math.min(overflow, Math.max(0, centred));
  }, [at]);

  return (
    // Twelve months of mono labels don't fit a phone. Same snap rail the
    // trust strip uses rather than a second, smaller calendar.
    <div ref={rail} className="rail overflow-x-auto pb-4">
      <div className="min-w-[680px]">
        <div className="relative h-[168px]">
          {/* Month grid — hairlines only, the calendar itself. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-12"
          >
            {MONTHS.map((_, i) => (
              <span
                key={i}
                className="border-l border-rule-dk first:border-l-0"
              />
            ))}
          </div>

          {spans.map((s, i) => (
            <div
              key={s.label}
              className={`absolute flex h-[36px] items-center px-4 ${
                s.fill ? "bg-magenta" : "border border-rule-dk"
              }`}
              style={{
                left: `${pctOf(s.from)}%`,
                width: `${pctOf(s.to - s.from + 1)}%`,
                top: 56 + i * 48,
              }}
            >
              <span
                className={`t-utility truncate ${s.fill ? "text-paper" : "opacity-75"}`}
              >
                {s.label}
              </span>
            </div>
          ))}

          {at !== null && (
            <div
              className="absolute inset-y-0 w-px bg-paper"
              style={{ left: `${at}%` }}
            >
              <span
                className={`t-utility absolute top-0 block whitespace-nowrap bg-paper px-2 py-1 text-press ${nudge}`}
              >
                TODAY
              </span>
            </div>
          )}
        </div>

        {/* Axis */}
        <div className="grid grid-cols-12 border-t border-rule-dk">
          {MONTHS.map((m, i) => (
            <span key={i} className="t-utility py-4 pl-3 opacity-55">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
