"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RegistrationMark } from "@/components/system/section";
import { Empty, SectionHead, SpecRow, Thumb } from "./account-shell";
import { useToday } from "@/lib/dates";
import { money } from "@/lib/pricing";
import { sizeRun } from "@/lib/basket";
import {
  approveProof,
  orderStages,
  orderTotals,
  placedOn,
  reorder,
  requestChange,
  statusOf,
  useOrders,
  type Order,
  type OrderStatus,
  type StageView,
  STATUS_LABEL,
} from "@/lib/account";

/* Orders, and where each one is standing on the press floor.
 *
 * The status dot does the colour work and the words do the meaning — magenta on
 * wash is 3.9:1, amber is 1.8:1, so neither can be the label. */

const STATUS_DOT: Record<OrderStatus, string> = {
  approval: "border-magenta bg-magenta",
  production: "border-amber bg-amber",
  delivered: "border-ink/30 bg-ink/30",
};

function Status({ status }: { status: OrderStatus }) {
  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`block size-2 shrink-0 rounded-full border ${STATUS_DOT[status]}`}
      />
      <span className="t-note leading-none">{STATUS_LABEL[status]}</span>
    </span>
  );
}

/* ─── The list ───────────────────────────────────────────────────────────── */

function Row({ order }: { order: Order }) {
  const today = useToday();
  const sum = orderTotals(order);
  const shown = order.items.slice(0, 3);

  return (
    <li className="border-b border-rule">
      <Link
        href={`/account/orders/${order.ref}`}
        className="flex flex-col gap-4 px-2 py-4 transition-colors duration-wipe ease-squeegee hover:bg-paper lg:grid lg:grid-cols-[104px_112px_1fr_84px_92px_180px] lg:items-center lg:gap-6"
      >
        {/* `contents` on large screens: four tidy rows on a phone, one row on a
            desk, without reordering the markup for either. */}
        <div className="flex items-baseline justify-between gap-4 lg:contents">
          <span className="t-utility">{order.ref}</span>
          <span className="t-note opacity-60">{placedOn(today, order)}</span>
        </div>

        <div className="flex items-center gap-2">
          {shown.map((l) => (
            <Thumb key={l.id} line={l} width={40} />
          ))}
          {order.items.length > shown.length && (
            <span className="t-note opacity-45">
              +{order.items.length - shown.length}
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-4 lg:contents">
          <span className="t-note opacity-70">{sum.units} UNITS</span>
          <span
            className="font-display leading-none lg:text-right"
            style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            {money(sum.total)}
          </span>
        </div>

        <Status status={statusOf(order)} />
      </Link>
    </li>
  );
}

export function OrdersList() {
  const orders = useOrders();
  const waiting = orders.filter((o) => statusOf(o) === "approval");

  return (
    <>
      <SectionHead title="Orders" count={`${orders.length} ORDERS`}>
        Every job you&apos;ve put through the press, newest first. Open one to
        see where it is and what it&apos;s waiting on.
      </SectionHead>

      {waiting.length > 0 && (
        <p className="mt-8 border-l-2 border-magenta bg-paper py-4 pr-4 pl-4 text-small leading-relaxed">
          {waiting.length === 1 ? "One order is" : `${waiting.length} orders are`}{" "}
          waiting on your approval. Nothing goes on press until you reply —{" "}
          <Link href={`/account/orders/${waiting[0].ref}`} className="link">
            open {waiting[0].ref}
          </Link>
          .
        </p>
      )}

      {orders.length === 0 ? (
        <div className="mt-8">
          <Empty
            title="No orders yet."
            action={
              <Button asChild>
                <Link href="/clothing">Browse clothing</Link>
              </Button>
            }
          >
            Once you&apos;ve run a job through the press it lands here — with its
            proof, its dates and a reorder button that keeps the same spec.
          </Empty>
        </div>
      ) : (
        <ul className="mt-8 border-t border-rule">
          {orders.map((o) => (
            <Row key={o.ref} order={o} />
          ))}
        </ul>
      )}
    </>
  );
}

/* ─── The production timeline ────────────────────────────────────────────── */

/* A registration target, filled by state: ink behind the job, magenta where
 * it's standing, hollow ahead of it. The ring and the ticks stay the same on
 * all five, so the fill is the only thing that moves down the track. */
function StageMark({ state }: { state: StageView["state"] }) {
  const done = state === "done";
  const now = state === "now";
  const ink = done || now;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`relative block ${now ? "reg-pulse" : ""}`}
    >
      {/* Opaque, so the hairline track can't run through a hollow marker. */}
      <circle
        cx="10"
        cy="10"
        r="7"
        fill="var(--wash)"
        stroke={now ? "var(--magenta)" : "var(--ink)"}
        strokeWidth="1"
        opacity={ink ? 0.85 : 0.32}
      />
      <circle
        cx="10"
        cy="10"
        r="4"
        fill={done ? "var(--ink)" : now ? "var(--magenta)" : "none"}
      />
      <path
        d="M10 0v3M10 17v3M0 10h3M17 10h3"
        stroke={now ? "var(--magenta)" : "var(--ink)"}
        strokeWidth="1"
        opacity={ink ? 0.6 : 0.28}
      />
    </svg>
  );
}

/* Said in words as well as colour — the dot alone can't carry "this is where
 * the job is standing" for anyone who can't separate magenta from ink. */
const stateWord = (s: StageView) =>
  s.state === "done"
    ? "COMPLETED"
    : s.state === "todo"
      ? "EXPECTED"
      : s.key === "approval"
        ? "AWAITING YOU"
        : "IN PROGRESS";

const STAGE_NOTE: Record<string, string> = {
  check: "A press operator has your files open — resolution, colours, trapping.",
  proof: "A dated PDF per garment is being set, showing position and size against the size chart.",
  approval: "Nothing goes on press until you reply. The dates ahead assume you approve today.",
  press: "Screens burnt, colours mixed to your spec, first pull checked against the proof.",
  ready: "Boxed and collected by the courier, or on the desk in Medway from 4pm.",
};

function Timeline({ stages }: { stages: StageView[] }) {
  const done = stages.filter((s) => s.state === "done").length;
  const live = stages.find((s) => s.state === "now");

  return (
    <section className="mt-12">
      <h3 className="t-utility opacity-55">PRODUCTION TIMELINE</h3>

      {/* Narrow screens scroll the track rather than stacking it — five stages
          in a row is the shape of the information. */}
      <div className="rail mt-8 overflow-x-auto pb-3">
        <ol className="grid min-w-[820px] grid-cols-5">
          {stages.map((s, i) => (
            <li key={s.key} className="relative">
              {i < stages.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-[9px] left-[10px] -right-[10px] h-px ${
                    i < done ? "bg-ink/40" : "bg-rule"
                  }`}
                />
              )}

              <StageMark state={s.state} />

              {/* Three fixed lines, so the five stages read across as rows and
                  not as five separate little blocks. */}
              <div className="mt-4 pr-6">
                <span className="t-note block opacity-40">{stateWord(s)}</span>
                <span
                  className={`t-utility mt-2 block ${
                    s.state === "todo" ? "opacity-55" : ""
                  }`}
                >
                  {s.label.toUpperCase()}
                </span>
                <span
                  className={`t-note mt-2 block leading-[1.6] ${
                    s.state === "now" ? "opacity-100" : "opacity-60"
                  }`}
                >
                  {s.when}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-6 max-w-measure text-small leading-relaxed opacity-75">
        {live
          ? STAGE_NOTE[live.key]
          : "Delivered. Your artwork stays in the library — reorder the same spec any time."}
      </p>
    </section>
  );
}

/* ─── Proof approval ─────────────────────────────────────────────────────── */

function ProofPanel({ order }: { order: Order }) {
  const today = useToday();
  const proof = order.proof;
  if (!proof) return null;

  const stages = orderStages(today, order);

  if (order.approvedAt) {
    return (
      <section className="mt-12 border border-rule bg-paper p-6 md:p-8">
        <h3 className="t-utility opacity-55">PROOF APPROVED</h3>
        <p className="mt-4 max-w-measure text-small leading-relaxed">
          Approved <span className="t-note">{stages[2].when}</span>. The job
          moved to the press floor the moment you did — the dates above have
          been redrawn from it.
        </p>
      </section>
    );
  }

  if (order.changeRequested) {
    return (
      <section className="mt-12 border border-rule bg-paper p-6 md:p-8">
        <h3 className="t-utility opacity-55">CHANGE REQUESTED</h3>
        <p className="mt-4 max-w-measure text-small leading-relaxed">
          We&apos;ve got it. A revised proof comes back before 5pm today, to{" "}
          sam@baileyfc.co.uk and to this page. Nothing is on press.
        </p>
      </section>
    );
  }

  return (
    <section className="relative mt-12 border border-rule bg-paper p-6 md:p-8">
      <RegistrationMark className="top-3 right-3" />
      <h3 className="t-utility opacity-55">PROOF — WAITING ON YOU</h3>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,240px)_1fr] md:gap-12">
        {/* The proof sheet as it was sent: the garment, the mark on it, and the
            dated file name underneath. */}
        <figure>
          <div className="border border-rule bg-wash p-4">
            <Thumb
              line={order.items[0]}
              className="w-full border-0 bg-transparent p-0"
            />
          </div>
          <figcaption className="t-note mt-3 leading-[1.7] opacity-60">
            {proof.file.toUpperCase()}
            <br />V{proof.version} · SENT {stages[1].when}
          </figcaption>
        </figure>

        <div className="min-w-0">
          <p className="max-w-measure text-small leading-relaxed">{proof.note}</p>

          <dl className="mt-6 border-t border-rule">
            <SpecRow k="GARMENT" v={order.items[0].product.toUpperCase()} />
            <SpecRow k="COLOUR" v={order.items[0].colourName.toUpperCase()} />
            <SpecRow k="SIZE RUN" v={sizeRun(order.items[0].run.counts)} />
          </dl>

          {/* `items-start` or the magenta button stretches to whatever height
              the open disclosure beside it happens to be. */}
          <div className="mt-8 flex flex-wrap items-start gap-3">
            <Button size="lg" onClick={() => approveProof(order.ref)}>
              Approve and print
            </Button>

            {/* Native disclosure — the note only needs to exist once it's asked
                for, and that needs no state. Open, it takes the whole row so
                the field isn't squeezed into a button-width column. */}
            <details className="open:w-full">
              <summary className="btn btn-secondary inline-flex cursor-pointer list-none items-center rounded px-8 py-4 text-body font-medium [&::-webkit-details-marker]:hidden">
                Request a change
              </summary>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  requestChange(order.ref);
                }}
                className="mt-4 max-w-measure"
              >
                <label htmlFor="proof-change" className="t-utility opacity-55">
                  WHAT NEEDS CHANGING
                </label>
                <textarea
                  id="proof-change"
                  required
                  rows={3}
                  className="field mt-3 block"
                  placeholder="Move the crest 10mm up, keep the sleeve as it is."
                />
                <Button type="submit" variant="secondary" className="mt-3">
                  Send to the studio
                </Button>
              </form>
            </details>
          </div>

          <p className="t-note mt-6 max-w-measure leading-[1.8] opacity-65">
            Approving is what starts the clock. Nothing is screened, mixed or
            stitched until you do — and the dates above move with you.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── The detail page ────────────────────────────────────────────────────── */

export function OrderDetail({ orderRef }: { orderRef: string }) {
  const orders = useOrders();
  const today = useToday();
  const router = useRouter();
  const order = orders.find((o) => o.ref === orderRef);

  if (!order) {
    return (
      <Empty
        title="That order isn't on this account."
        action={
          <Button asChild>
            <Link href="/account/orders">All orders</Link>
          </Button>
        }
      >
        The reference may belong to another account, or it may be mistyped —
        ours look like PM-40921. It&apos;s on your confirmation email and on the
        job bag.
      </Empty>
    );
  }

  const sum = orderTotals(order);
  const status = statusOf(order);

  return (
    <>
      <Link href="/account/orders" className="t-utility opacity-55 hover:opacity-100">
        ← ALL ORDERS
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-rule pb-6">
        <div>
          <h2
            className="font-mono"
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            {order.ref}
          </h2>
          <p className="t-note mt-4 opacity-60">
            PLACED {placedOn(today, order)} · {sum.priced.length}{" "}
            {sum.priced.length === 1 ? "ITEM" : "ITEMS"} · {sum.units} UNITS
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <Status status={status} />
          <span
            className="font-display leading-none"
            style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }}
          >
            {money(sum.total)}
          </span>
        </div>
      </header>

      <Timeline stages={orderStages(today, order)} />

      <ProofPanel order={order} />

      {/* ── What's on the job bag ───────────────────────────────────────── */}
      <section className="mt-12">
        <h3 className="t-utility opacity-55">ON THIS ORDER</h3>
        <ul className="mt-6 border-t border-rule">
          {sum.priced.map(({ line, price }) => (
            <li
              key={line.id}
              className="flex flex-col gap-4 border-b border-rule py-6 sm:flex-row sm:gap-6"
            >
              <Thumb line={line} width={64} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <span className="t-sub">{line.product}</span>
                  <span className="t-utility">{money(price.total).toUpperCase()}</span>
                </div>
                <p className="t-note mt-3 leading-[1.8] opacity-60">
                  {line.colourName.toUpperCase()} ·{" "}
                  {price.method.name.toUpperCase()} ·{" "}
                  {price.positions.map((p) => p.name.toUpperCase()).join(", ")}
                  <br />
                  {sizeRun(line.run.counts)} · {money(price.unit)} EACH
                  <br />
                  {line.artwork.name?.toUpperCase()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Where it went, and the way back to the press ─────────────────── */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="t-utility opacity-55">
            {status === "delivered" ? "DELIVERED TO" : "DELIVERING TO"}
          </h3>
          <p className="t-note mt-4 leading-[1.9] opacity-75">
            {order.address.map((l) => (
              <React.Fragment key={l}>
                {l.toUpperCase()}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>

        <div className="sm:text-right">
          <h3 className="t-utility opacity-55">PRINT IT AGAIN</h3>
          <p className="mt-4 text-small leading-relaxed opacity-75">
            Same garments, same artwork, same positions — priced at today&apos;s
            breaks.
          </p>
          <Button
            size="lg"
            className="mt-6"
            onClick={() => {
              reorder(order.items);
              router.push("/basket");
            }}
          >
            Reorder this order
          </Button>
        </div>
      </div>
    </>
  );
}
