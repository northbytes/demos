"use client";

import * as React from "react";
import { BANDS, money } from "@/lib/pricing";

const MAX = 250;

export function PriceLadder() {
  const [qty, setQty] = React.useState(24);

  const band = BANDS.find((b) => qty <= b.to) ?? BANDS[BANDS.length - 1];
  const next = BANDS.find((b) => b.from > qty);
  const nudge = next
    ? `ADD ${next.from - qty} MORE TO REACH ${money(next.price).toUpperCase()} EACH`
    : `BEST PRICE REACHED · ${money(band.price).toUpperCase()} EACH`;

  return (
    <div className="grid-12 gap-y-16">
      {/* ── Left: the argument ─────────────────────────────────────────────── */}
      <div className="col-span-12 lg:col-span-4">
        <span className="t-utility block opacity-60">QUANTITY BREAKS</span>
        <h2 className="t-section mt-4">
          The more you print, the less each one costs.
        </h2>
        <p className="mt-6 max-w-measure text-body opacity-75">
          Setup is the same whether we print ten or a thousand, so the cost of it
          spreads out. Screen printing is where the drop bites hardest — DTG
          stays flat because there are no screens to make.
        </p>
      </div>

      {/* ── Right: the ladder ──────────────────────────────────────────────── */}
      <div className="col-span-12 lg:col-span-7 lg:col-start-6">
        <div className="flex items-baseline justify-between gap-6">
          <p
            className="t-display text-magenta"
            aria-live="polite"
            aria-label={`${money(band.price)} each`}
          >
            {money(band.price)}
          </p>
          <span className="t-utility opacity-60">EACH · EX VAT</span>
        </div>

        <p className="t-sub mt-4 text-wash">
          {qty} {qty === 1 ? "piece" : "pieces"} · {money(qty * band.price)}{" "}
          total
        </p>

        {/* Band chart — widths track the real ranges, so the bar under the
            thumb is always the band you're in. */}
        <div className="mt-16">
          <div aria-hidden="true" className="flex h-[140px] items-end gap-px">
            {BANDS.map((b) => {
              const on = b === band;
              return (
                <div
                  key={b.label}
                  style={{
                    flexGrow: b.to - b.from + 1,
                    height: `${(b.price / BANDS[0].price) * 100}%`,
                  }}
                  className={`flex min-w-0 items-start justify-center border-t border-r border-l border-rule-dk pt-2 ${
                    on ? "bg-magenta" : ""
                  }`}
                >
                  <span
                    // The narrow bands are only a few pixels wide on a phone —
                    // the figure and the nudge carry the numbers there.
                    className={`t-utility hidden truncate md:block ${on ? "text-paper" : "opacity-45"}`}
                  >
                    {b.label}
                  </span>
                </div>
              );
            })}
          </div>

          <label className="sr-only" htmlFor="qty-slider">
            Quantity
          </label>
          <input
            id="qty-slider"
            type="range"
            min={1}
            max={MAX}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="qty-slider mt-3 block"
            aria-valuetext={`${qty} pieces at ${money(band.price)} each`}
          />

          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
            <span className="t-utility opacity-60">1 PIECE — {MAX} PIECES</span>
            <span className="t-utility text-amber">{nudge}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
