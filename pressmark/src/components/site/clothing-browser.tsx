"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { asset, cn } from "@/lib/utils";
import {
  COLOURS,
  EMPTY_FILTERS,
  GROUP_LABEL,
  METHODS,
  MIN_ORDERS,
  PRICE_BOUNDS,
  PRODUCTS,
  SIZE_RANGES,
  SORTS,
  TYPES,
  bestRelaxation,
  clearGroup,
  facetCount,
  filterProducts,
  isActive,
  sortProducts,
  type ColourId,
  type Filters,
  type MethodId,
  type Product,
  type SizeId,
  type SortId,
  type TypeId,
} from "@/lib/catalog";

const PAGE = 24;

const colour = (id: string) => COLOURS.find((g) => g.id === id) ?? COLOURS[0];

/* Catalogue blanks per garment type — a folded polo and a folded hoodie are
 * different objects, and a drawn silhouette can't tell you that. The types
 * with the most products get the most colourways, because a rack of blanks is
 * never one colour and ten identical tees in a grid look like a bug. */
const PHOTOS_FOR: Record<TypeId, number> = {
  tee: 4,
  polo: 4,
  hoodie: 4,
  sweat: 4,
  workwear: 4,
  long: 2,
  jacket: 2,
  headwear: 2,
  bag: 2,
};

/* Dealt round-robin through each type's own products, so no colourway is
 * over-represented and two of the same never land side by side. Keyed off the
 * catalogue order, not the grid position — filtering must not reshuffle which
 * blank a product shows. A hash was tried first and clumped: three burgundy
 * tees in a row. */
const PHOTO_BY_ID = new Map<string, string>();
{
  const seen: Partial<Record<TypeId, number>> = {};
  for (const p of PRODUCTS) {
    const n = seen[p.type] ?? 0;
    seen[p.type] = n + 1;
    PHOTO_BY_ID.set(
      p.id,
      asset(`/img/garment-${p.type}-${(n % PHOTOS_FOR[p.type]) + 1}.jpg`),
    );
  }
}

const price = (n: number) => `£${n.toFixed(2)}`;

/* ─── Filter rail parts ──────────────────────────────────────────────────── */

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule py-6">
      <h3 className="t-utility opacity-60">{label}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** A checkbox row with its facet count — zero-result options are disabled. */
function Option({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  const dead = count === 0 && !checked;
  return (
    <label
      className={cn(
        "flex items-center gap-3 py-2 text-small",
        dead ? "cursor-not-allowed opacity-40" : "cursor-pointer",
      )}
    >
      <Checkbox
        checked={checked}
        disabled={dead}
        onCheckedChange={(v) => onChange(v === true)}
      />
      <span className="flex-1">{label}</span>
      <span className="t-utility opacity-50">{count}</span>
    </label>
  );
}

/* Two native ranges stacked on one hairline track. Only the thumbs take
 * pointer events, so the lower input doesn't swallow drags on the upper one. */
function PriceRange({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (next: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const [min, max] = PRICE_BOUNDS;
  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  const common =
    "qty-slider pointer-events-none absolute inset-x-0 top-0 [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto";

  return (
    <div>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-px bg-rule" />
        <div
          className="absolute top-1/2 h-px bg-ink"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          aria-label="Minimum price per unit"
          min={min}
          max={max}
          value={lo}
          onChange={(e) =>
            onChange([Math.min(Number(e.target.value), hi - 1), hi])
          }
          className={cn(common, "z-20")}
        />
        <input
          type="range"
          aria-label="Maximum price per unit"
          min={min}
          max={max}
          value={hi}
          onChange={(e) =>
            onChange([lo, Math.max(Number(e.target.value), lo + 1)])
          }
          className={cn(common, "z-10")}
        />
      </div>
      <div className="mt-3 flex justify-between">
        <span className="t-utility">£{lo}</span>
        <span className="t-utility">
          £{hi}
          {hi === max ? "+" : ""}
        </span>
      </div>
    </div>
  );
}

/* ─── Card ───────────────────────────────────────────────────────────────── */

function ProductCard({ p }: { p: Product }) {
  const shown = p.colours.slice(0, 5);
  const over = p.variants - shown.length;

  return (
    <a href="#" className="group block">
      <div className="cut-marks">
        <div className="grain relative aspect-[4/5] overflow-hidden border border-rule bg-paper">
          {/* One blank per garment type. The card sells the shape and the
              cloth; the colourways are the swatch row underneath, and the
              actual colour choice happens in the configurator. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PHOTO_BY_ID.get(p.id)}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-squeegee ease-squeegee group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
          />

          {!p.stock && (
            <span className="t-utility absolute top-4 left-4 border border-rule bg-wash px-2 py-1">
              BACK IN 2 WEEKS
            </span>
          )}
        </div>
      </div>

      <p className="t-utility mt-4 opacity-60">{p.spec}</p>
      <h3
        className="mt-3 font-sans text-sub transition-transform duration-squeegee ease-squeegee group-hover:translate-x-1"
        style={{ fontWeight: 600 }}
      >
        {p.name}
      </h3>

      <div className="mt-3 flex items-center gap-2">
        {shown.map((c) => (
          <span
            key={c}
            aria-hidden="true"
            className="block size-4 rounded-full border border-rule"
            style={{ background: colour(c).hex }}
          />
        ))}
        {over > 0 && <span className="t-utility opacity-60">+{over}</span>}
        <span className="sr-only">{p.variants} colourways</span>
      </div>

      <p className="mt-3 text-small">
        from <span className="text-magenta">{price(p.price)}</span> each at 100+
      </p>
    </a>
  );
}

/* ─── The page body ──────────────────────────────────────────────────────── */

export function ClothingBrowser() {
  const [f, setFilters] = React.useState<Filters>(EMPTY_FILTERS);
  const [sort, setSortId] = React.useState<SortId>("popular");
  const [visible, setVisible] = React.useState(PAGE);
  const [railOpen, setRailOpen] = React.useState(false);

  // Re-filtering or re-sorting makes the old "load more" depth meaningless, so
  // both setters walk it back rather than an effect chasing them afterwards.
  const setF = (next: React.SetStateAction<Filters>) => {
    setFilters(next);
    setVisible(PAGE);
  };
  const setSort = (next: SortId) => {
    setSortId(next);
    setVisible(PAGE);
  };

  const results = React.useMemo(
    () => sortProducts(filterProducts(f), sort),
    [f, sort],
  );

  const toggle = <K extends "types" | "methods" | "colours" | "sizes" | "mins">(
    key: K,
    value: Filters[K][number],
  ) =>
    setF((cur) => ({
      ...cur,
      [key]: cur[key].includes(value as never)
        ? (cur[key] as unknown[]).filter((v) => v !== value)
        : [...(cur[key] as unknown[]), value],
    }));

  /* Every active filter, flattened into removable chips. */
  const chips: { key: string; label: string; clear: () => void }[] = [
    ...f.types.map((t) => ({
      key: `t-${t}`,
      label: TYPES.find((x) => x.id === t)!.label,
      clear: () => toggle("types", t),
    })),
    ...f.methods.map((m) => ({
      key: `m-${m}`,
      label: METHODS.find((x) => x.id === m)!.label,
      clear: () => toggle("methods", m),
    })),
    ...f.colours.map((c) => ({
      key: `c-${c}`,
      label: colour(c).name,
      clear: () => toggle("colours", c),
    })),
    ...f.sizes.map((s) => ({
      key: `s-${s}`,
      label: SIZE_RANGES.find((x) => x.id === s)!.label,
      clear: () => toggle("sizes", s),
    })),
    ...f.mins.map((m) => ({
      key: `n-${m}`,
      label: MIN_ORDERS.find((x) => x.id === m)!.label,
      clear: () => toggle("mins", m),
    })),
    ...(isActive(f, "price")
      ? [
          {
            key: "price",
            label: `£${f.price[0]}–£${f.price[1]}`,
            clear: () => setF((cur) => clearGroup(cur, "price")),
          },
        ]
      : []),
    ...(f.stock
      ? [
          {
            key: "stock",
            label: "In stock now",
            clear: () => setF((cur) => ({ ...cur, stock: false })),
          },
        ]
      : []),
  ];

  const relax = results.length === 0 ? bestRelaxation(f) : undefined;

  return (
    <div className="grid-12">
      {/* ── Filter rail ───────────────────────────────────────────────────── */}
      <div className="col-span-full lg:col-span-3">
        <button
          type="button"
          onClick={() => setRailOpen((o) => !o)}
          aria-expanded={railOpen}
          aria-controls="filter-rail"
          className="t-utility flex w-full items-center justify-between border-y border-rule py-4 lg:hidden"
        >
          FILTERS
          <span aria-hidden="true">{railOpen ? "–" : "+"}</span>
        </button>

        <div
          id="filter-rail"
          className={cn(
            "lg:sticky lg:top-[88px] lg:block lg:max-h-[calc(100vh-112px)] lg:overflow-y-auto",
            "rail pb-6",
            railOpen ? "block" : "hidden",
          )}
        >
          <FilterGroup label="GARMENT TYPE">
            {TYPES.map((t) => (
              <Option
                key={t.id}
                label={t.label}
                count={facetCount(f, "type", (p) => p.type === t.id)}
                checked={f.types.includes(t.id)}
                onChange={() => toggle("types", t.id as TypeId)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="PRINT METHOD">
            {METHODS.map((m) => (
              <Option
                key={m.id}
                label={m.label}
                count={facetCount(f, "method", (p) =>
                  p.methods.includes(m.id),
                )}
                checked={f.methods.includes(m.id)}
                onChange={() => toggle("methods", m.id as MethodId)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="COLOUR">
            <div className="grid grid-cols-[repeat(auto-fill,32px)] gap-3">
              {COLOURS.map((c) => {
                const on = f.colours.includes(c.id);
                const count = facetCount(f, "colour", (p) =>
                  p.colours.includes(c.id),
                );
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    disabled={count === 0 && !on}
                    title={`${c.name} — ${count}`}
                    onClick={() => toggle("colours", c.id as ColourId)}
                    className="ink-chip disabled:cursor-not-allowed disabled:opacity-30"
                    style={{ background: c.hex }}
                  >
                    <span className="sr-only">
                      {c.name}, {count} products
                    </span>
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          <FilterGroup label="SIZE RANGE">
            {SIZE_RANGES.map((s) => (
              <Option
                key={s.id}
                label={s.label}
                count={facetCount(f, "size", (p) => p.sizes === s.id)}
                checked={f.sizes.includes(s.id)}
                onChange={() => toggle("sizes", s.id as SizeId)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="PRICE PER UNIT">
            <PriceRange
              value={f.price}
              onChange={(price) => setF((cur) => ({ ...cur, price }))}
            />
          </FilterGroup>

          <FilterGroup label="MIN ORDER">
            {MIN_ORDERS.map((m) => (
              <Option
                key={m.id}
                label={m.label}
                count={facetCount(f, "min", (p) => p.min === m.id)}
                checked={f.mins.includes(m.id)}
                onChange={() => toggle("mins", m.id)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="IN STOCK">
            <Option
              label="In stock now"
              count={facetCount(f, "stock", (p) => p.stock)}
              checked={f.stock}
              onChange={(v) => setF((cur) => ({ ...cur, stock: v }))}
            />
          </FilterGroup>
        </div>
      </div>

      {/* ── Results ───────────────────────────────────────────────────────── */}
      <div className="col-span-full lg:col-span-9">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
          <span className="t-utility opacity-60">
            {results.length} {results.length === 1 ? "PRODUCT" : "PRODUCTS"}
          </span>

          <label className="flex items-center gap-3">
            <span className="t-utility opacity-60">SORT</span>
            <span className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortId)}
                className="t-utility min-h-0 appearance-none border border-rule bg-paper py-3 pr-10 pl-4 outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
              >
                <path
                  d="M1 1.5 6 6.5 11 1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
              </svg>
            </span>
          </label>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-rule py-4">
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={c.clear}
                className="t-utility flex items-center gap-2 border border-rule bg-paper py-2 pr-2 pl-3 transition-colors duration-wipe ease-squeegee hover:border-ink"
              >
                {c.label}
                <span aria-hidden="true" className="text-magenta">
                  ×
                </span>
                <span className="sr-only">— remove filter</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setF(EMPTY_FILTERS)}
              className="t-utility ml-2 underline underline-offset-4 opacity-60 hover:opacity-100"
            >
              CLEAR ALL
            </button>
          </div>
        )}

        {results.length === 0 ? (
          <div className="max-w-measure py-24">
            <p className="t-sub">
              No garments match those filters.
              {relax &&
                ` Clearing the ${GROUP_LABEL[relax.group]} filter would give you ${relax.count}.`}
            </p>
            <Button
              variant="secondary"
              className="mt-8"
              onClick={() =>
                setF((cur) =>
                  relax ? clearGroup(cur, relax.group) : EMPTY_FILTERS,
                )
              }
            >
              {relax
                ? `Clear the ${GROUP_LABEL[relax.group]} filter`
                : "Clear all filters"}
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.slice(0, visible).map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>

            <div className="mt-16 flex flex-col items-start gap-6 border-t border-rule pt-6">
              <span className="t-utility opacity-60">
                SHOWING {Math.min(visible, results.length)} OF {results.length}
              </span>
              {visible < results.length && (
                <Button
                  variant="secondary"
                  onClick={() => setVisible((v) => v + PAGE)}
                >
                  Load more
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
