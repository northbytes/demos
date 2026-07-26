"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Empty, SectionHead, Thumb } from "./account-shell";
import { useToday } from "@/lib/dates";
import { money, priceRun } from "@/lib/pricing";
import { sizeRun, type BasketLine } from "@/lib/basket";
import {
  daysAgo,
  orderTotals,
  placedOn,
  reorder,
  useDesigns,
  useOrders,
  removeDesign,
  type SavedDesign,
} from "@/lib/account";

/* Saved designs, and the shortest route back to the press.
 *
 * Reorder is the highest-value control in the account area — someone who has
 * already bought this exact thing is one click from buying it again — so it's
 * the one place the magenta goes, on every card. Everything else on the card is
 * a hairline and a mono line. */

function useReorder() {
  const router = useRouter();
  return (lines: BasketLine[]) => {
    reorder(lines);
    router.push("/basket");
  };
}

/** The run in one mono line: what it is, how it's printed, how many. */
function summary(line: BasketLine) {
  const p = priceRun(line.run);
  return [
    line.colourName.toUpperCase(),
    p.method.name.toUpperCase(),
    p.positions.map((x) => x.name.toUpperCase()).join(" + "),
  ].join(" · ");
}

function DesignCard({ design }: { design: SavedDesign }) {
  const today = useToday();
  const go = useReorder();
  const price = priceRun(design.line.run);

  return (
    <article className="cut-marks flex flex-col border border-rule bg-paper p-4">
      {/* The garment in its colour with the artwork on it — the design is the
          picture, so it gets the room. */}
      <div className="border border-rule bg-wash p-4">
        <Thumb line={design.line} className="w-full border-0 bg-transparent p-0" />
      </div>

      <h3 className="t-sub mt-6">{design.name}</h3>
      <p className="t-note mt-3 leading-[1.8] opacity-60">
        {design.line.product.toUpperCase()}
        <br />
        {summary(design.line)}
        <br />
        {sizeRun(design.line.run.counts)} · {price.qty} UNITS
        <br />
        {money(price.unit).toUpperCase()} EACH · SAVED {daysAgo(today, design.saved)}
      </p>

      <div className="mt-6 flex-1" />

      <Button className="w-full" onClick={() => go([design.line])}>
        Reorder
      </Button>

      <div className="mt-4 flex items-center justify-between gap-4">
        <a href={design.line.href} className="link t-utility opacity-70">
          EDIT THE RUN
        </a>
        <button
          type="button"
          onClick={() => removeDesign(design.id)}
          className="t-utility opacity-45 underline underline-offset-4 transition-opacity duration-wipe hover:opacity-100"
        >
          REMOVE
        </button>
      </div>
    </article>
  );
}

export function SavedDesigns() {
  const designs = useDesigns();

  return (
    <>
      <SectionHead
        title="Saved designs"
        count={designs.length ? `${designs.length} SAVED` : undefined}
      >
        Every garment setup you&apos;ve configured, with the artwork on it.
        Reorder keeps the spec exactly and prices it at today&apos;s breaks.
      </SectionHead>

      {designs.length === 0 ? (
        <div className="mt-8">
          <Empty
            title="No saved designs yet."
            action={
              <>
                <Button asChild>
                  <Link href="/clothing">Browse clothing</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/products/classic-heavy-tee">Configure a tee</Link>
                </Button>
              </>
            }
          >
            Anything you configure gets saved here automatically once
            you&apos;re signed in — garment, colour, print positions and the
            size run, ready to send back to the press.
          </Empty>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {designs.map((d) => (
            <DesignCard key={d.id} design={d} />
          ))}
        </div>
      )}
    </>
  );
}

/* ─── Reorder ────────────────────────────────────────────────────────────── */

/* The same job, again. Past orders rather than saved setups, because that's how
 * people ask for it — "the same as last time" means the last order. */
export function ReorderList() {
  const orders = useOrders();
  const today = useToday();
  const go = useReorder();

  return (
    <>
      <SectionHead title="Reorder" count={`${orders.length} PAST ORDERS`}>
        Send a past job back to the press unchanged — same garments, same
        artwork, same positions. It lands in your basket priced at today&apos;s
        quantity breaks, and you can still edit it there.
      </SectionHead>

      {orders.length === 0 ? (
        <div className="mt-8">
          <Empty
            title="Nothing to reorder yet."
            action={
              <Button asChild>
                <Link href="/clothing">Browse clothing</Link>
              </Button>
            }
          >
            Your first order shows up here the moment it&apos;s booked in, and
            stays reorderable for as long as the garment is stocked.
          </Empty>
        </div>
      ) : (
        <ul className="mt-8 border-t border-rule">
          {orders.map((o) => {
            const sum = orderTotals(o);
            return (
              <li
                key={o.ref}
                className="flex flex-col gap-4 border-b border-rule py-6 sm:flex-row sm:items-center sm:gap-6"
              >
                {/* Fixed width, or a one-item order would push its own text
                    left of a two-item order's and the column would zig-zag. */}
                <div className="flex w-[104px] shrink-0 items-center gap-2">
                  {o.items.map((l) => (
                    <Thumb key={l.id} line={l} width={44} />
                  ))}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="t-utility">
                    {o.ref}{" "}
                    <span className="ml-3 opacity-55">{placedOn(today, o)}</span>
                  </p>
                  <p className="t-note mt-3 leading-[1.8] opacity-60">
                    {o.items.map((l) => l.product).join(" · ").toUpperCase()}
                    <br />
                    {sum.units} UNITS · {money(sum.goods).toUpperCase()} EX VAT
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <Link
                    href={`/account/orders/${o.ref}`}
                    className="link t-utility opacity-70"
                  >
                    VIEW
                  </Link>
                  <Button onClick={() => go(o.items)}>Reorder</Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
