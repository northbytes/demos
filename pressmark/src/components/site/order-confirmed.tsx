"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RegistrationMark } from "@/components/system/section";
import { money } from "@/lib/pricing";
import { useToday } from "@/lib/dates";
import {
  ORDER_REF,
  sizeRun,
  timeline,
  totals,
  useBasket,
  type TimelineStage,
} from "@/lib/basket";

/* No confetti and no illustration. The order number, the dates, and a button.
 * Someone has just spent four figures on shirts — what they want is proof the
 * job exists and to know when it lands. */

function Stage({ stage, last }: { stage: TimelineStage; last: boolean }) {
  const done = stage.state === "done";
  const now = stage.state === "now";

  return (
    <li className="relative flex gap-6 pb-8 last:pb-0">
      {/* The rule that joins the stages, cut short on the last one. */}
      {!last && (
        <span
          aria-hidden="true"
          className="absolute top-4 bottom-0 left-[7px] w-px bg-rule"
        />
      )}

      <span
        aria-hidden="true"
        className={`relative mt-[6px] block size-4 shrink-0 rounded-full border-2 ${
          done
            ? "border-press bg-press"
            : now
              ? "border-magenta bg-wash"
              : "border-rule bg-wash"
        }`}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className={`t-sub ${stage.state === "todo" ? "opacity-70" : ""}`}>
            {stage.label}
          </h3>
          <span className={`t-utility ${now ? "" : "opacity-60"}`}>
            {stage.when}
          </span>
        </div>
        <p className="mt-2 max-w-measure text-small leading-relaxed opacity-70">
          {stage.note}
        </p>
      </div>
    </li>
  );
}

export function OrderConfirmed() {
  const lines = useBasket();
  const today = useToday();
  const sum = totals(lines);
  const stages = timeline(today, lines);

  return (
    <div className="grid-12 gap-y-16">
      <div className="col-span-12 lg:col-span-7">
        <span className="t-utility block opacity-60">ORDER PLACED</span>
        <h1 className="t-section mt-4 max-w-[16ch]">
          Booked in. The press knows about it.
        </h1>

        {/* ── The number, set the way it appears on the job bag ────────── */}
        <div className="relative mt-8 border border-rule bg-paper p-6">
          <RegistrationMark className="top-3 right-3" />
          <span className="t-utility block opacity-60">ORDER NUMBER</span>
          <p
            className="mt-3 font-mono"
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            {ORDER_REF}
          </p>
          <p className="t-note mt-4 leading-[1.8] opacity-65">
            Quote it on the phone, on an email, or at the roller door. A
            confirmation is on its way to your inbox now.
          </p>
        </div>

        {/* ── This order's dates, not a generic graphic ────────────────── */}
        <section className="mt-16">
          <h2 className="t-utility opacity-60">PRODUCTION TIMELINE</h2>
          <p className="mt-4 max-w-measure text-small opacity-75">
            Five stages, with the dates this order actually runs to. They move if
            artwork or an approval is late — we&apos;ll email you when they do.
          </p>

          <ol className="mt-12">
            {stages.map((s, i) => (
              <Stage key={s.key} stage={s} last={i === stages.length - 1} />
            ))}
          </ol>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <a href="#">Track your order</a>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/clothing">Print something else</Link>
          </Button>
        </div>
      </div>

      {/* ══ What was ordered ══════════════════════════════════════════════ */}
      <div className="col-span-12 lg:col-span-4 lg:col-start-9">
        <div className="on-dark border border-rule-dk bg-press p-6 text-wash md:p-8 lg:sticky lg:top-[88px]">
          <h2 className="t-utility opacity-60">WHAT&apos;S ON THE JOB BAG</h2>

          <ul className="mt-6 border-t border-rule-dk">
            {sum.priced.map(({ line, price }) => (
              <li key={line.id} className="border-b border-rule-dk py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-small font-medium">{line.product}</span>
                  <span className="t-utility shrink-0">
                    {money(price.total).toUpperCase()}
                  </span>
                </div>
                <p className="t-note mt-2 leading-[1.7] opacity-60">
                  {line.colourName.toUpperCase()} ·{" "}
                  {price.method.name.toUpperCase()}
                  <br />
                  {sizeRun(line.run.counts)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t-2 border-magenta pt-4">
            <span className="t-utility block opacity-60">PAID INC VAT</span>
            <span
              className="mt-3 block font-display text-paper"
              style={{
                fontSize: "clamp(2rem, 5vw, 2.75rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {money(sum.total)}
            </span>
          </div>

          <p className="t-note mt-8 leading-[1.8] opacity-60">
            {sum.missingArtwork.length > 0
              ? "AN UPLOAD LINK FOR THE OUTSTANDING ARTWORK IS IN YOUR INBOX."
              : "EVERY FILE IS IN. THE PROOF IS BEING SET NOW."}
          </p>
        </div>
      </div>
    </div>
  );
}
