"use client";

import Link from "next/link";
import { priceRun } from "@/lib/pricing";
import { useBasket } from "@/lib/basket";

/* The one control in the nav that has to track client state — remove a line on
 * the basket page and a server-rendered badge would sit there lying about it.
 * Split out so the rest of the nav stays a server component. */

function IconBasket() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M3 5.5h12L14 16.5H4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M6.25 7.5V4.75a2.75 2.75 0 0 1 5.5 0V7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export function BasketLink() {
  const lines = useBasket();
  const units = lines.reduce((a, l) => a + priceRun(l.run).qty, 0);

  return (
    <Link
      href="/basket"
      aria-label={
        lines.length === 0
          ? "Basket, empty"
          : `Basket, ${lines.length} ${lines.length === 1 ? "item" : "items"}, ${units} units`
      }
      className="relative flex size-8 items-center justify-center text-ink transition-colors duration-wipe ease-squeegee hover:text-magenta"
    >
      <IconBasket />
      {lines.length > 0 && (
        <span
          aria-hidden="true"
          className="t-utility absolute -top-px -right-px rounded bg-magenta px-1 py-px text-paper"
        >
          {lines.length}
        </span>
      )}
    </Link>
  );
}
