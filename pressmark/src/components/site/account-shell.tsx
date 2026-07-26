"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADDRESSES, ARTWORK, statusOf, useDesigns, useOrders } from "@/lib/account";
import type { BasketLine } from "@/lib/basket";
import { GARMENTS, GarmentPlate } from "./garment";

/* The account shell: a flat navigation rail and the section beside it.
 *
 * The rail is mono labels on a hairline, nothing else — no icons, no pills, no
 * active background. The current section is ink at full weight against a 2px
 * ink bar; hover takes the amber bar the nav links elsewhere use. Magenta stays
 * out of it: in this area magenta means "reorder", and one accent that means
 * one thing is worth more than a decorated menu. */

const SECTIONS = [
  { label: "ORDERS", href: "/account/orders" },
  { label: "SAVED DESIGNS", href: "/account/designs" },
  { label: "ARTWORK LIBRARY", href: "/account/artwork" },
  { label: "ADDRESSES", href: "/account/addresses" },
  { label: "REORDER", href: "/account/reorder" },
  { label: "DETAILS", href: "/account/details" },
];

function Rail() {
  const pathname = usePathname();
  const orders = useOrders();
  const designs = useDesigns();

  /* The one thing worth interrupting someone for. It's a dot, not a badge —
   * the orders list says what it is in words the moment they get there. */
  const waiting = orders.filter((o) => statusOf(o) === "approval").length;

  const counts: Record<string, number> = {
    ORDERS: orders.length,
    "SAVED DESIGNS": designs.length,
    "ARTWORK LIBRARY": ARTWORK.length,
    ADDRESSES: ADDRESSES.length,
  };

  return (
    <nav aria-label="Your account" className="lg:sticky lg:top-[88px]">
      <span className="t-utility hidden opacity-40 lg:block">SECTIONS</span>

      {/* Horizontal on small screens — the rail scrolls rather than stacking
          six items above every page. */}
      <ul className="rail mt-0 flex overflow-x-auto border-b border-rule lg:mt-6 lg:block lg:overflow-visible lg:border-b-0">
        {SECTIONS.map((s) => {
          // Bare /account shows the orders list, so it lights up ORDERS too.
          const here = pathname === "/account" ? "/account/orders" : pathname;
          const active = here.startsWith(s.href);
          return (
            <li key={s.href} className="shrink-0 lg:shrink">
              <Link
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={`t-utility flex items-center justify-between gap-3 border-b-2 px-4 py-4 whitespace-nowrap transition-[opacity,border-color] duration-wipe ease-squeegee lg:border-b-0 lg:border-l-2 lg:py-3 ${
                  active
                    ? "border-ink opacity-100"
                    : "border-transparent opacity-55 hover:border-amber hover:opacity-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  {s.label}
                  {s.label === "ORDERS" && waiting > 0 && (
                    <span
                      aria-label={`${waiting} awaiting your approval`}
                      className="block size-[6px] shrink-0 rounded-full bg-magenta"
                    />
                  )}
                </span>
                {counts[s.label] !== undefined && (
                  <span className="opacity-40">{counts[s.label]}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-12 gap-y-8 lg:gap-y-12">
      <div className="col-span-12 lg:col-span-3 lg:border-r lg:border-rule lg:pr-6">
        <Rail />
      </div>
      <div className="col-span-12 lg:col-span-8 lg:col-start-5">{children}</div>
    </div>
  );
}

/* ─── Shared section furniture ───────────────────────────────────────────── */

export function SectionHead({
  title,
  count,
  children,
}: {
  title: string;
  count?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-rule pb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="t-section">{title}</h2>
        {count && <span className="t-utility opacity-55">{count}</span>}
      </div>
      {children && (
        <p className="mt-4 max-w-measure text-small leading-relaxed opacity-75">
          {children}
        </p>
      )}
    </header>
  );
}

/** An empty state that hands you the next thing to do, not a shrug. */
export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-rule bg-paper p-8 md:p-12">
      <h3 className="t-sub max-w-[24ch]">{title}</h3>
      <p className="mt-4 max-w-measure text-small leading-relaxed opacity-75">
        {children}
      </p>
      {action && <div className="mt-8 flex flex-wrap gap-3">{action}</div>}
    </div>
  );
}

/** The garment as it was printed — this colour, this face, this artwork on it.
 * Small enough for a list row, drawn rather than a stored image. */
export function Thumb({
  line,
  width,
  className = "",
}: {
  line: BasketLine;
  /** Fixed pixel width for a list row; omit to fill whatever holds it. */
  width?: number;
  className?: string;
}) {
  const garment = GARMENTS.find((g) => g.id === line.colourId) ?? GARMENTS[0];
  return (
    <div
      className={`shrink-0 border border-rule bg-wash p-1 ${className}`}
      style={width ? { width } : undefined}
    >
      <div className="aspect-[400/470] w-full">
        <GarmentPlate
          view={line.view}
          hex={garment.hex}
          ink={garment.ink}
          artUrl={line.artUrl}
        />
      </div>
    </div>
  );
}

/** A mono key and value on a hairline — the spec-sheet row used all over. */
export function SpecRow({
  k,
  v,
  action,
}: {
  k: string;
  v: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-3">
      <dt className="t-utility opacity-55">{k}</dt>
      <dd className="t-note flex items-baseline gap-4 text-right leading-[1.6]">
        {v}
        {action}
      </dd>
    </div>
  );
}
