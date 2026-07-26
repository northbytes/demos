"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { RegistrationMark } from "@/components/system/section";
import { SqueegeeReveal } from "@/components/system/squeegee-reveal";
import { ArtworkDrop, type Artwork } from "./artwork-drop";
import { templateById, type PositionId } from "@/lib/occasions";
import { dispatchLabel, useToday } from "@/lib/dates";
import {
  PRINT_METHODS as METHODS,
  PRINT_POSITIONS,
  SIZES,
  TURNAROUNDS,
  money,
  nextBand,
  priceRun,
} from "@/lib/pricing";
import {
  GARMENTS,
  GarmentPlate,
  PRINT_AREA,
  VIEWS,
  type View,
} from "./garment";

/* ─── The product ────────────────────────────────────────────────────────── */

/* Where each position sits on the plate. The names and rates live in
 * lib/pricing with the rest of the money, so the basket quotes the same
 * figures; only the geometry is the configurator's business.
 *
 * Hotspots are numbered rather than captioned — five mono labels on a garment
 * this small collide with each other. The number keys into the list beneath. */
const HOTSPOT: Record<PositionId, { n: number; face: View; x: number; y: number }> = {
  "front-chest": { n: 1, face: "front", x: 50, y: 44 },
  "left-chest": { n: 2, face: "front", x: 38, y: 36 },
  "left-sleeve": { n: 3, face: "front", x: 20, y: 26 },
  "right-sleeve": { n: 4, face: "front", x: 80, y: 26 },
  back: { n: 5, face: "back", x: 50, y: 40 },
};

const POSITIONS = PRINT_POSITIONS.map((p) => ({ ...p, ...HOTSPOT[p.id] }));

const SPEC = [
  ["FABRIC", "100% ringspun cotton"],
  ["WEIGHT", "180 GSM"],
  ["FIT", "Regular, unisex"],
  ["SIZES", "S–5XL"],
];

/* ─── Small parts ────────────────────────────────────────────────────────── */

function Block({
  step,
  label,
  value,
  children,
}: {
  step: string;
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="t-utility opacity-60">
          {step} — {label}
        </h2>
        {value && <span className="t-utility text-right">{value}</span>}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/* ─── The configurator ───────────────────────────────────────────────────── */

type Plate = { view: View; colourId: string; artUrl: string | null };

export function Configurator() {
  const init: Plate = { view: "front", colourId: "white", artUrl: null };
  const [{ prev, cur }, setPair] = React.useState({ prev: init, cur: init });

  // Both plates move in one render: the outgoing one has to be on the base
  // layer in the same frame the sweep starts, or the wipe reveals nothing.
  const patchPlate = React.useCallback(
    (patch: Partial<Plate>) =>
      setPair((p) => ({ prev: p.cur, cur: { ...p.cur, ...patch } })),
    [],
  );

  const [showPrintArea, setShowPrintArea] = React.useState(false);
  const [methodId, setMethodId] = React.useState("screen");
  const [on, setOn] = React.useState<string[]>(["front-chest"]);
  const [artwork, setArtwork] = React.useState<Artwork | null>(null);
  const [counts, setCounts] = React.useState<Record<string, number>>({
    M: 12,
    L: 16,
    XL: 12,
    "2XL": 8,
  });
  const [turnId, setTurnId] = React.useState("standard");

  const today = useToday();

  /* Template tiles on the occasion pages deep-link here as ?template=<id>,
   * which seeds the method and the print positions. Read off `location` rather
   * than useSearchParams so the page stays a plain static render with no
   * Suspense boundary around the whole configurator. */
  React.useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("template");
    const t = id ? templateById(id) : undefined;
    if (!t) return;
    // Seeding after hydration is deliberate: the page is prerendered, so
    // reading the URL during render would mismatch the server HTML. One extra
    // render, once, and only when someone arrives on a template link.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (METHODS.some((m) => m.id === t.method)) setMethodId(t.method);
    setOn(t.positions);
    // Land on the face the artwork is actually on.
    if (POSITIONS.find((p) => p.id === t.positions[0])?.face === "back") {
      patchPlate({ view: "back" });
    }
  }, [patchPlate]);

  const garment = GARMENTS.find((g) => g.id === cur.colourId) ?? GARMENTS[0];
  const chosen = POSITIONS.filter((p) => on.includes(p.id));

  /* ── The money — the same function the basket prices its lines with ────── */

  const run = {
    methodId,
    positions: on as PositionId[],
    counts,
    turnaroundId: turnId,
  };
  const {
    method,
    turn,
    qty,
    band,
    surchargeUnits,
    subtotal,
    total,
    perUnit,
    belowMin,
  } = priceRun(run);
  const next = nextBand(qty);
  /** The headline is the garment plus the method — positions are itemised. */
  const unitHeadline = band.price + method.delta;

  /* ── Artwork ───────────────────────────────────────────────────────────── */

  const replaceArtwork = React.useCallback(
    (next: Artwork | null) => {
      setArtwork((old) => {
        if (old?.revoke) URL.revokeObjectURL(old.url);
        return next;
      });
      patchPlate({ artUrl: next?.url ?? null });
    },
    [patchPlate],
  );

  // Object URLs outlive the component unless they're handed back.
  React.useEffect(() => {
    return () => {
      if (artwork?.revoke) URL.revokeObjectURL(artwork.url);
    };
  }, [artwork]);

  /* ── Breakdown ─────────────────────────────────────────────────────────── */

  const lines: { label: string; value: string }[] = [
    { label: `CLASSIC HEAVY TEE × ${qty}`, value: money(qty * band.price) },
    {
      label: `${method.name.toUpperCase()} × ${qty}`,
      value: method.delta ? money(qty * method.delta) : "INCLUDED",
    },
    ...chosen.map((p) => ({
      label: `${p.name.toUpperCase()} × ${qty}`,
      value: p.price ? money(qty * p.price) : "INCLUDED",
    })),
    ...(surchargeUnits
      ? [
          {
            label: `2XL+ SURCHARGE × ${surchargeUnits}`,
            value: money(surchargeUnits * 1.2),
          },
        ]
      : []),
    {
      label: turn.name.toUpperCase(),
      value: turn.uplift ? money(subtotal * turn.uplift) : "INCLUDED",
    },
  ];

  return (
    // The phone bar is fixed to the viewport, so the clearance it needs lives
    // on the page bottom (see the product page), not here.
    <div className="grid-12 gap-y-16">
      {/* ══ Left — the visual ═══════════════════════════════════════════════ */}
      <div className="col-span-12 lg:col-span-7">
        {/* Held to a column narrower than the 7/12 well so the whole sticky
            stack — plate, views, spec — fits a laptop viewport at once. */}
        <div className="mx-auto max-w-[520px] lg:sticky lg:top-[88px] lg:mx-0">
          <div className="relative border border-rule bg-paper p-6 md:p-8">
            <RegistrationMark className="top-3 left-3" />
            <RegistrationMark className="top-3 right-3" />
            <RegistrationMark className="bottom-3 left-3" />
            <RegistrationMark className="bottom-3 right-3" />

            <div className="relative mx-auto aspect-[400/470] w-full max-w-[330px]">
              <div className="absolute inset-0">
                <GarmentPlate
                  view={prev.view}
                  hex={
                    (GARMENTS.find((g) => g.id === prev.colourId) ?? GARMENTS[0])
                      .hex
                  }
                  ink={
                    (GARMENTS.find((g) => g.id === prev.colourId) ?? GARMENTS[0])
                      .ink
                  }
                  artUrl={prev.artUrl}
                />
              </div>

              {/* Opaque, or the outgoing view stays visible through the new
                  one — the garment SVG is transparent around the silhouette,
                  and front/back/sleeve don't share an outline the way two
                  colours of the same view do. */}
              <SqueegeeReveal
                replayKey={`${cur.view}|${cur.colourId}|${cur.artUrl ?? ""}`}
                threshold={0}
                className="absolute inset-0 bg-paper"
              >
                <GarmentPlate
                  view={cur.view}
                  hex={garment.hex}
                  ink={garment.ink}
                  artUrl={cur.artUrl}
                />
              </SqueegeeReveal>

              {showPrintArea && (
                <>
                  <div
                    className="pointer-events-none absolute border border-dashed border-magenta"
                    style={PRINT_AREA[cur.view].box}
                  />
                  {/* Anchored to the plate, not the rectangle — hung off the
                      box it runs past the edge of the frame. */}
                  <span className="t-utility pointer-events-none absolute bottom-0 left-0 whitespace-nowrap text-magenta">
                    {PRINT_AREA[cur.view].label}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* ── View thumbnails + print area toggle ───────────────────────── */}
          <div className="mt-4 flex flex-wrap items-stretch gap-2">
            {VIEWS.map((v) => {
              const active = v.id === cur.view;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => patchPlate({ view: v.id })}
                  className={`group flex-1 border bg-paper p-2 text-left transition-colors duration-wipe ease-squeegee ${
                    active
                      ? "border-ink outline outline-1 -outline-offset-1 outline-ink"
                      : "border-rule hover:border-ink/40"
                  }`}
                >
                  <div className="pointer-events-none aspect-[400/470] w-full">
                    <GarmentPlate
                      view={v.id}
                      hex={garment.hex}
                      ink={garment.ink}
                      artUrl={cur.artUrl}
                    />
                  </div>
                  <span
                    className={`t-utility mt-2 block truncate ${active ? "" : "opacity-55"}`}
                  >
                    {v.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-pressed={showPrintArea}
            onClick={() => setShowPrintArea((v) => !v)}
            className="t-utility mt-4 flex items-center gap-3 border border-rule bg-paper px-4 py-3 transition-colors duration-wipe ease-squeegee hover:border-ink"
          >
            <span
              aria-hidden="true"
              className={`block size-3 border ${
                showPrintArea
                  ? "border-magenta bg-magenta"
                  : "border-dashed border-ink/50"
              }`}
            />
            PRINT AREA {showPrintArea ? "ON" : "OFF"}
          </button>

          {!artwork && (
            <p className="t-note mt-4 max-w-measure opacity-70">
              No artwork yet. You can still get a price — upload before you check
              out.
            </p>
          )}

          {/* ── Spec block ────────────────────────────────────────────────── */}
          <dl className="mt-8 border-t border-rule">
            {SPEC.map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-6 border-b border-rule py-3"
              >
                <dt className="t-utility opacity-60">{k}</dt>
                <dd className="t-note text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ══ Right — the configurator ════════════════════════════════════════ */}
      <div className="col-span-12 lg:col-span-5">
        <span className="t-utility block opacity-60">
          PRODUCT 04 — CLASSIC HEAVY TEE
        </span>
        <h1 className="t-section mt-4">Classic heavy tee</h1>

        <div className="mt-8 flex flex-wrap items-baseline gap-3">
          <span
            className="font-display text-magenta"
            style={{ fontSize: "3.5rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.9 }}
            aria-live="polite"
          >
            {money(unitHeadline)}
          </span>
          <span className="text-small opacity-60">each, at {band.label}</span>
        </div>
        <p className="t-utility mt-3 opacity-55">PRICE UPDATES AS YOU CONFIGURE</p>

        <div className="mt-12 space-y-12">
          {/* ── 01 Colour ─────────────────────────────────────────────────── */}
          <Block step="01" label="COLOUR">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <div
                role="group"
                aria-label="Garment colour"
                className="rail flex h-[52px] items-center gap-1 overflow-x-auto"
              >
                {GARMENTS.map((g) => {
                  const active = g.id === cur.colourId;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      className="ink-chip shrink-0"
                      style={{ width: 44, height: 44, background: g.hex }}
                      aria-label={g.name}
                      aria-pressed={active}
                      onClick={() => patchPlate({ colourId: g.id })}
                    />
                  );
                })}
              </div>
              <span className="t-utility" aria-live="polite">
                {garment.name.toUpperCase()}
              </span>
            </div>
          </Block>

          {/* ── 02 Print method ───────────────────────────────────────────── */}
          <Block step="02" label="PRINT METHOD" value={method.name.toUpperCase()}>
            <div className="grid gap-2 sm:grid-cols-3">
              {METHODS.map((m) => {
                const active = m.id === methodId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setMethodId(m.id)}
                    className={`relative border bg-paper p-4 text-left transition-colors duration-wipe ease-squeegee ${
                      active
                        ? "border-ink outline outline-1 -outline-offset-1 outline-ink"
                        : "border-rule hover:border-ink/40"
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute top-0 right-0 size-0 border-t-[14px] border-l-[14px] border-t-magenta border-l-transparent"
                      />
                    )}
                    <span className="block text-small font-medium">{m.name}</span>
                    <span className="mt-2 block text-small leading-snug opacity-65">
                      {m.best}
                    </span>
                    <span className="t-utility mt-4 block opacity-60">
                      MIN {m.min}
                      {m.delta > 0 ? ` · +${money(m.delta)}` : " · BASE"}
                    </span>
                  </button>
                );
              })}
            </div>

            {belowMin && (
              <p className="t-note mt-4 border-l-2 border-amber pl-3">
                {method.name} starts at {method.min} pieces. You&apos;ve got {qty}{" "}
                — add {method.min - qty} more, or switch to DTG.
              </p>
            )}
          </Block>

          {/* ── 03 Print positions ────────────────────────────────────────── */}
          <Block
            step="03"
            label="PRINT POSITIONS"
            value={`${chosen.length} SELECTED`}
          >
            <p className="t-note mb-6 opacity-70">
              Tap a position on the garment to add it — front chest, left chest,
              back, either sleeve.
            </p>

            <div className="flex gap-6">
              {(["front", "back"] as const).map((face) => (
                <div key={face} className="flex-1">
                  <div className="relative mx-auto aspect-[400/470] max-w-[170px]">
                    <svg
                      viewBox="0 0 400 470"
                      className="block h-full w-full"
                      aria-hidden="true"
                    >
                      <path
                        d={
                          face === "front"
                            ? "M160 44 L120 54 L48 122 L74 184 L116 162 L110 428 Q200 444 290 428 L284 162 L326 184 L352 122 L280 54 L240 44 C224 70 176 70 160 44 Z"
                            : "M160 44 L120 54 L48 122 L74 184 L116 162 L110 428 Q200 444 290 428 L284 162 L326 184 L352 122 L280 54 L240 44 C226 60 174 60 160 44 Z"
                        }
                        fill="none"
                        stroke="var(--ink)"
                        strokeWidth="1"
                        opacity="0.45"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>

                    {POSITIONS.filter((p) => p.face === face).map((p) => {
                      const active = on.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          aria-pressed={active}
                          aria-label={`${p.name}${p.price ? `, plus ${money(p.price)} each` : ", included"}`}
                          onClick={() =>
                            setOn((s) =>
                              s.includes(p.id)
                                ? s.filter((x) => x !== p.id)
                                : [...s, p.id],
                            )
                          }
                          title={p.name}
                          className="absolute -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        >
                          <span
                            className={`t-utility flex size-[22px] items-center justify-center rounded-[2px] border transition-colors duration-wipe ease-squeegee ${
                              active
                                ? "border-magenta bg-magenta text-paper"
                                : "border-ink/50 bg-paper opacity-60 hover:border-amber hover:bg-amber/25 hover:opacity-100"
                            }`}
                          >
                            {p.n}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="t-utility mt-3 text-center opacity-55">
                    {face.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>

            <ul className="mt-6 border-t border-rule">
              {chosen.length === 0 && (
                <li className="t-note border-b border-rule py-3 opacity-70">
                  No positions selected. Tap the diagram to add one.
                </li>
              )}
              {chosen.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 border-b border-rule py-3"
                >
                  <span className="t-utility">
                    <span className="mr-3 opacity-45">{p.n}</span>
                    {p.name.toUpperCase()}
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="t-utility opacity-70">
                      {p.price ? `+${money(p.price)}` : "INCLUDED"}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${p.name}`}
                      onClick={() => setOn((s) => s.filter((x) => x !== p.id))}
                      className="flex size-6 items-center justify-center border border-rule transition-colors duration-wipe ease-squeegee hover:border-ink hover:bg-ink hover:text-paper"
                    >
                      <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
                        <path
                          d="M0.5 0.5 8.5 8.5M8.5 0.5 0.5 8.5"
                          stroke="currentColor"
                          strokeWidth="1.25"
                        />
                      </svg>
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </Block>

          {/* ── 04 Artwork ────────────────────────────────────────────────── */}
          <Block
            step="04"
            label="YOUR ARTWORK"
            value={artwork ? "1 FILE" : "NONE YET"}
          >
            <ArtworkDrop value={artwork} onChange={replaceArtwork} />
          </Block>

          {/* ── 05 Size run ───────────────────────────────────────────────── */}
          <Block step="05" label="SIZE RUN" value={`${qty} UNITS`}>
            <div className="flex gap-6">
              <div className="grid flex-1 grid-cols-4 gap-2">
                {SIZES.map((s) => {
                  const n = counts[s.id] ?? 0;
                  return (
                    <div key={s.id}>
                      <div
                        className={`flex aspect-square flex-col border bg-paper transition-colors duration-wipe ease-squeegee ${
                          n > 0 ? "border-ink" : "border-rule"
                        }`}
                      >
                        <label
                          htmlFor={`qty-${s.id}`}
                          className={`t-utility border-b py-2 text-center ${
                            n > 0
                              ? "border-ink bg-ink text-paper"
                              : "border-rule opacity-60"
                          }`}
                        >
                          {s.id}
                        </label>
                        <input
                          id={`qty-${s.id}`}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={9999}
                          value={n === 0 ? "" : n}
                          placeholder="0"
                          onChange={(e) =>
                            setCounts((c) => ({
                              ...c,
                              [s.id]: Math.min(
                                9999,
                                Math.max(0, Math.floor(Number(e.target.value) || 0)),
                              ),
                            }))
                          }
                          className="qty-box min-h-0 w-full flex-1 bg-transparent text-center font-display text-sub outline-none placeholder:opacity-30"
                        />
                      </div>
                      <span
                        // Tighter than the utility default: at the standard
                        // 0.12em the four labels touch on a phone.
                        className={`t-utility mt-1 block text-center text-[0.625rem] tracking-[0.02em] whitespace-nowrap ${
                          s.surcharge ? "text-amber" : "opacity-0"
                        }`}
                        aria-hidden={!s.surcharge}
                      >
                        +{money(s.surcharge)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="w-[92px] shrink-0 border-l border-rule pl-4">
                <span className="t-utility block opacity-60">TOTAL</span>
                <span
                  className="mt-2 block font-display leading-none"
                  style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.03em" }}
                  aria-live="polite"
                >
                  {qty}
                </span>
                <span className="t-utility mt-2 block opacity-60">UNITS</span>
              </div>
            </div>

            <p className="t-utility mt-6 border border-rule px-4 py-4 leading-relaxed">
              {qty} UNITS · {money(band.price).toUpperCase()} EACH ·{" "}
              {next ? (
                <>
                  ADD <span className="text-magenta">{next.from - qty}</span> MORE
                  TO REACH {money(next.price).toUpperCase()}
                </>
              ) : qty === 0 ? (
                <>ADD A SIZE RUN TO SEE YOUR BREAK</>
              ) : (
                <>BEST PRICE REACHED</>
              )}
            </p>
          </Block>

          {/* ── 06 Turnaround ─────────────────────────────────────────────── */}
          <Block step="06" label="TURNAROUND" value={turn.name.toUpperCase()}>
            <div className="grid gap-2 sm:grid-cols-3">
              {TURNAROUNDS.map((t) => {
                const active = t.id === turnId;
                const date = dispatchLabel(today, t.days);
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTurnId(t.id)}
                    className={`relative border bg-paper p-4 text-left transition-colors duration-wipe ease-squeegee ${
                      active
                        ? "border-ink outline outline-1 -outline-offset-1 outline-ink"
                        : "border-rule hover:border-ink/40"
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute top-0 right-0 size-0 border-t-[14px] border-l-[14px] border-t-magenta border-l-transparent"
                      />
                    )}
                    <span className="block text-small font-medium">{t.name}</span>
                    <span className="mt-2 block text-small opacity-65">
                      {t.note}
                    </span>
                    <span className="t-utility mt-4 block opacity-60">
                      {t.cost.toUpperCase()}
                    </span>
                    <span className="t-utility mt-2 block leading-relaxed">
                      {date}
                    </span>
                  </button>
                );
              })}
            </div>
          </Block>
        </div>

        {/* ══ Sticky summary ════════════════════════════════════════════════ */}
        <div className="on-dark fixed inset-x-0 bottom-0 z-40 border-t border-rule-dk bg-press text-wash lg:static lg:mt-12 lg:border lg:border-rule-dk">
          <div className="px-4 py-4 md:px-6 lg:p-8">
            {/* Itemised — the phone bar keeps the total and the button only. */}
            <dl className="mb-8 hidden border-t border-rule-dk lg:block">
              {lines.map((l) => (
                <div
                  key={l.label}
                  className="flex items-baseline justify-between gap-6 border-b border-rule-dk py-3"
                >
                  {/* Mono is set at line-height 1 for labels; these wrap. */}
                  <dt className="t-utility leading-[1.5] opacity-60">{l.label}</dt>
                  <dd className="t-utility shrink-0 leading-[1.5]">
                    {l.value.toUpperCase()}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
              <div className="min-w-0">
                <span className="t-utility block opacity-60">TOTAL EX VAT</span>
                <span
                  className="mt-2 block font-display text-paper"
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                  aria-live="polite"
                >
                  {money(total)}
                </span>
                <span className="t-utility mt-2 block leading-[1.5] opacity-60">
                  {qty === 0
                    ? "ADD A SIZE TO GET A PRICE"
                    : `${money(perUnit)} PER UNIT, INC. EVERYTHING`}
                </span>
              </div>

              {/* Full width on a phone, where it wraps to its own row anyway. */}
              <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
                {qty === 0 ? (
                  <Button size="lg" disabled className="flex-1 sm:flex-none">
                    Add to basket
                  </Button>
                ) : (
                  <Button size="lg" asChild className="flex-1 sm:flex-none">
                    <Link href="/basket">Add to basket</Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="lg"
                  className="hidden sm:inline-flex"
                >
                  Save this setup
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
