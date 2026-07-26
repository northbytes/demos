"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RegistrationMark } from "@/components/system/section";
import { GARMENTS, GarmentPlate } from "./garment";
import { dispatchWindow, useToday } from "@/lib/dates";
import { money } from "@/lib/pricing";
import {
  nudgeCopy,
  removeLine,
  sizeRun,
  totals,
  useBasket,
  type ArtworkState,
  type BasketLine,
} from "@/lib/basket";

/* ─── Artwork status ─────────────────────────────────────────────────────── */

/* Three states, and the third one is the point: custom print has a legitimate
 * "paid for, not yet drawn" that a normal store never has to show.
 *
 * The dot carries the state and the words carry the message — amber on paper is
 * a 1.8:1 contrast, so it can mark a row, it can never be the text on one. */
const ARTWORK: Record<ArtworkState["status"], { label: string; dot: string }> = {
  checked: {
    label: "Artwork uploaded and checked",
    dot: "border-press bg-press",
  },
  warning: {
    label: "Artwork uploaded — one thing to fix",
    dot: "border-amber bg-amber",
  },
  missing: {
    // Hollow, so "nothing here yet" reads before the words do.
    label: "Artwork not yet supplied",
    dot: "border-ink/45 bg-transparent",
  },
};

function SpecRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-[10px]">
      <dt className="t-utility opacity-55">{k}</dt>
      <dd className="t-note text-right leading-[1.6]">{v}</dd>
    </div>
  );
}

/* ─── One line ───────────────────────────────────────────────────────────── */

function Line({
  line,
  price,
  today,
}: {
  line: BasketLine;
  price: ReturnType<typeof totals>["priced"][number]["price"];
  today: Date | null;
}) {
  const garment = GARMENTS.find((g) => g.id === line.colourId) ?? GARMENTS[0];
  const art = ARTWORK[line.artwork.status];
  const nudge = nudgeCopy(line.run);

  return (
    <article className="relative border border-rule bg-paper p-4 sm:p-6 md:p-8">
      <RegistrationMark className="top-3 left-3" />
      <RegistrationMark className="top-3 right-3" />

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        {/* The garment as ordered — this colour, this face, this artwork on it. */}
        <a
          href={line.href}
          aria-label={`Edit ${line.product}`}
          className="block w-[96px] shrink-0 self-start border border-rule bg-wash p-2 transition-colors duration-wipe ease-squeegee hover:border-ink sm:w-[120px]"
        >
          <div className="aspect-[400/470] w-full">
            <GarmentPlate
              view={line.view}
              hex={garment.hex}
              ink={garment.ink}
              artUrl={line.artUrl}
            />
          </div>
        </a>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
            <div className="min-w-0">
              <h2 className="t-sub">{line.product}</h2>
              <p className="t-utility mt-2 opacity-55">
                {line.colourName.toUpperCase()} · {price.qty} UNITS
              </p>
            </div>
            <p
              className="font-display shrink-0 leading-none"
              style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              {money(price.total)}
            </p>
          </div>

          {/* ── The spec, as it goes on the job bag ─────────────────────── */}
          <dl className="mt-6 border-t border-rule">
            <SpecRow k="METHOD" v={price.method.name.toUpperCase()} />
            <SpecRow
              k="PRINT POSITIONS"
              v={price.positions.map((p) => p.name.toUpperCase()).join(", ")}
            />
            <SpecRow k="SIZE RUN" v={sizeRun(line.run.counts)} />
            <SpecRow
              k="TURNAROUND"
              v={`${price.turn.name.toUpperCase()} · ${price.turn.note.toUpperCase()}`}
            />
            <SpecRow
              k={price.turn.days[0] === 0 ? "COLLECT" : "DISPATCH"}
              v={dispatchWindow(today, price.turn.days)}
            />
          </dl>

          {/* ── Artwork status ──────────────────────────────────────────── */}
          <div className="mt-6 flex items-start gap-3 border border-rule px-4 py-3">
            <span
              aria-hidden="true"
              className={`mt-[7px] block size-2 shrink-0 rounded-full border ${art.dot}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-small font-medium">
                {art.label}
                {line.artwork.name && (
                  <span className="t-note ml-3 opacity-60">
                    {line.artwork.name}
                  </span>
                )}
              </p>
              <p className="mt-2 text-small leading-relaxed opacity-70">
                {line.artwork.note}
              </p>
            </div>
          </div>

          {/* ── Unit price, the band it sits in, and the nudge ───────────── */}
          <div className="mt-6 border-t border-rule pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <p className="text-small">
                <span className="font-display text-sub" style={{ fontWeight: 700 }}>
                  {money(price.unit)}
                </span>{" "}
                <span className="opacity-70">each, printed</span>
              </p>
              <p className="t-utility opacity-55">
                {price.band.label} BREAK · {money(price.band.price).toUpperCase()}{" "}
                GARMENT
              </p>
            </div>

            {nudge && (
              <p className="mt-4 border-l-2 border-magenta bg-wash py-3 pr-4 pl-4 text-small leading-relaxed">
                Add {nudge.add} more and every unit drops to{" "}
                {money(nudge.unitThen)} — that&apos;s{" "}
                <span className="text-magenta">{money(nudge.saving)} less</span>{" "}
                overall, for more shirts.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={line.href} className="link t-utility">
              EDIT THIS RUN
            </a>
            <button
              type="button"
              onClick={() => removeLine(line.id)}
              className="t-utility opacity-55 underline underline-offset-4 transition-opacity duration-wipe hover:opacity-100"
            >
              REMOVE
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─── Summary panel ──────────────────────────────────────────────────────── */

function SummaryRow({
  k,
  v,
  note,
}: {
  k: string;
  v: string;
  note?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 border-b border-rule-dk py-3">
      <dt className="t-utility leading-[1.5] opacity-60">{k}</dt>
      <dd className="t-utility shrink-0 leading-[1.5]">
        {v}
        {note && <span className="ml-3 opacity-55">{note}</span>}
      </dd>
    </div>
  );
}

/** Shared by the basket and the checkout, so one panel can't say a different
 * number to the other. `action` is the button that belongs on that page. */
export function OrderSummary({
  sum,
  collecting = false,
  action,
  note,
}: {
  sum: ReturnType<typeof totals>;
  collecting?: boolean;
  action: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <div className="on-dark border border-rule-dk bg-press p-6 text-wash md:p-8">
      <h2 className="t-utility opacity-60">ORDER SUMMARY</h2>

      <dl className="mt-6 border-t border-rule-dk">
        <SummaryRow
          k={`${sum.priced.length} ${sum.priced.length === 1 ? "ITEM" : "ITEMS"}`}
          v={`${sum.units} UNITS`}
        />
        <SummaryRow k="GOODS EX VAT" v={money(sum.goods).toUpperCase()} />
        <SummaryRow
          k={collecting ? "COLLECTION" : "DELIVERY"}
          v={
            collecting
              ? "MEDWAY"
              : sum.delivery === 0
                ? "FREE"
                : money(sum.delivery).toUpperCase()
          }
          note={!collecting && sum.delivery === 0 ? "OVER £75" : undefined}
        />
        <SummaryRow k="VAT 20%" v={money(sum.vat).toUpperCase()} />
      </dl>

      {/* The rationed magenta on a dark ground: a 2px rule, not the figure.
          Process magenta on emulsion teal is a 2.7:1 contrast — it can mark
          the total, it can't be the total. */}
      <div className="mt-6 border-t-2 border-magenta pt-4">
        <span className="t-utility block opacity-60">TOTAL INC VAT</span>
        <span
          className="mt-3 block font-display text-paper"
          style={{
            fontSize: "clamp(2.25rem, 6vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {money(sum.total)}
        </span>
      </div>

      <div className="mt-8">{action}</div>

      {note && <div className="mt-6">{note}</div>}
    </div>
  );
}

/* ─── The page body ──────────────────────────────────────────────────────── */

export function BasketView() {
  const lines = useBasket();
  const today = useToday();
  const sum = totals(lines);

  if (lines.length === 0) {
    return (
      <div className="border border-rule bg-paper p-8 md:p-16">
        <h1 className="t-section">Nothing in the basket.</h1>
        <p className="mt-6 max-w-measure text-small opacity-75">
          Pick a garment, configure the run and the price follows you here. Saved
          setups stay in your account for 14 days.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/clothing">Browse clothing</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/large-format">Large format</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-12 gap-y-12">
      <div className="col-span-12 lg:col-span-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="t-section">Your basket</h1>
          <span className="t-utility opacity-55">
            {sum.priced.length} {sum.priced.length === 1 ? "ITEM" : "ITEMS"} ·{" "}
            {sum.units} UNITS
          </span>
        </div>

        <div className="mt-8 space-y-4">
          {sum.priced.map(({ line, price }) => (
            <Line key={line.id} line={line} price={price} today={today} />
          ))}
        </div>

        {sum.missingArtwork.length > 0 && (
          <div className="mt-8 border border-rule bg-paper p-6">
            <h2 className="t-utility opacity-60">ONE THING BEFORE YOU PAY</h2>
            <p className="mt-4 max-w-measure text-small leading-relaxed">
              {sum.missingArtwork.length === 1
                ? "One item has no artwork yet."
                : `${sum.missingArtwork.length} items have no artwork yet.`}{" "}
              You can pay now and send artwork after — we&apos;ll email you a
              link. Nothing goes on press until you approve the proof.
            </p>
          </div>
        )}
      </div>

      <div className="col-span-12 lg:col-span-4">
        <div className="lg:sticky lg:top-[88px]">
          <OrderSummary
            sum={sum}
            action={
              <Button size="lg" className="w-full" asChild>
                <Link href="/checkout">Checkout</Link>
              </Button>
            }
            note={
              <p className="t-note leading-[1.8] opacity-60">
                Prices held for 14 days. A dated proof comes back before anything
                is printed — see the note at checkout.
              </p>
            }
          />
        </div>
      </div>
    </div>
  );
}
