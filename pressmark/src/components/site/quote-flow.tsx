"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { RegistrationMark } from "@/components/system/section";
import { ArtworkDrop, type Artwork } from "./artwork-drop";
import {
  EMPTY_DRAFT,
  FIXINGS,
  LF_PRODUCTS,
  MAX_WIDTH_MM,
  PLACES,
  STEPS,
  UNITS,
  convert,
  fmtNeedBy,
  fmtSize,
  needsPanelling,
  stepIssues,
  type QuoteDraft,
  type UnitId,
} from "@/lib/large-format";

/* ponytail: the reference is fixed. A real one comes off the job book when the
 * request lands — there's no server here to ask. */
const REF = "QUOTE #PM-4821";

/* ─── Small parts ────────────────────────────────────────────────────────── */

function Block({
  step,
  label,
  children,
}: {
  step: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule pt-6">
      <h3 className="t-utility opacity-60">
        {step} — {label}
      </h3>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="t-utility block opacity-60">
        {label}
      </label>
      <div className="mt-3">{children}</div>
      {hint && <p className="t-note mt-2 opacity-60">{hint}</p>}
    </div>
  );
}

/** The house toggle — same aria-pressed tile the garment configurator uses for
 * print method and turnaround, so the two forms feel like one shop. */
function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`relative border bg-paper px-4 py-3 text-left text-small transition-colors duration-wipe ease-squeegee ${
        active
          ? "border-ink outline outline-1 -outline-offset-1 outline-ink"
          : "border-rule hover:border-ink/40"
      }`}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute top-0 right-0 size-0 border-t-[12px] border-l-[12px] border-t-magenta border-l-transparent"
        />
      )}
      {children}
    </button>
  );
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-rule-dk py-3">
      <dt className="t-utility leading-[1.5] opacity-60">{k}</dt>
      <dd className="t-note text-right leading-[1.6]">{v}</dd>
    </div>
  );
}

const summarise = (d: QuoteDraft) => [
  ["PRODUCT", d.product],
  ["QUANTITY", `${d.quantity}`],
  ["FINISHED SIZE", fmtSize(d)],
  ["WHERE IT'S GOING", d.place],
  ["FIXINGS", d.fixings.length ? d.fixings.join(", ") : "None specified"],
  [
    "ARTWORK",
    d.artwork
      ? d.artwork
      : d.needsDesign
        ? "None yet — quote for design too"
        : "None supplied",
  ],
  ["NEEDED BY", fmtNeedBy(d.needBy) || "No date given"],
];

/* ─── The flow ───────────────────────────────────────────────────────────── */

export function QuoteFlow() {
  const [step, setStep] = React.useState(1);
  const [draft, setDraft] = React.useState<QuoteDraft>(EMPTY_DRAFT);
  const [items, setItems] = React.useState<QuoteDraft[]>([]);
  const [artwork, setArtwork] = React.useState<Artwork | null>(null);
  const [showIssues, setShowIssues] = React.useState(false);
  const topRef = React.useRef<HTMLDivElement>(null);

  const patch = (p: Partial<QuoteDraft>) => setDraft((d) => ({ ...d, ...p }));

  /* The site-boards block deep-links here as ?product=<id>. Read off `location`
   * after hydration — the page is prerendered, so reading it during render
   * would mismatch the server HTML. */
  React.useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("product");
    const p = LF_PRODUCTS.find((x) => x.id === id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (p) setDraft((d) => ({ ...d, product: p.name }));
  }, []);

  const replaceArtwork = React.useCallback((next: Artwork | null) => {
    setArtwork((old) => {
      if (old?.revoke) URL.revokeObjectURL(old.url);
      return next;
    });
    setDraft((d) => ({ ...d, artwork: next?.name ?? null }));
  }, []);

  // Object URLs outlive the component unless they're handed back.
  React.useEffect(
    () => () => {
      if (artwork?.revoke) URL.revokeObjectURL(artwork.url);
    },
    [artwork],
  );

  const issues = stepIssues(step, draft);

  function advance() {
    if (issues.length) {
      setShowIssues(true);
      return;
    }
    setShowIssues(false);
    if (step < 3) {
      setStep(step + 1);
    } else {
      setItems((list) => [...list, draft]);
      setStep(4);
    }
    topRef.current?.scrollIntoView({ block: "start" });
  }

  function addAnother() {
    // Same quote, so the contact details and the date stay put.
    setDraft((d) => ({
      ...EMPTY_DRAFT,
      name: d.name,
      company: d.company,
      email: d.email,
      phone: d.phone,
      needBy: d.needBy,
    }));
    replaceArtwork(null);
    setShowIssues(false);
    setStep(1);
    topRef.current?.scrollIntoView({ block: "start" });
  }

  /* Derived from the updater's own `d`, not the render's `draft` — two fixings
   * ticked inside one React batch would otherwise both read the same stale
   * array and the first one would vanish. */
  const toggleFixing = (f: string) =>
    setDraft((d) => ({
      ...d,
      fixings: d.fixings.includes(f)
        ? d.fixings.filter((x) => x !== f)
        : // "None" is exclusive — ticking it clears the rest, and vice versa.
          f.startsWith("None")
          ? [f]
          : [...d.fixings.filter((x) => !x.startsWith("None")), f],
    }));

  /* ══ Confirmation ══════════════════════════════════════════════════════ */

  if (step === 4) {
    return (
      <div ref={topRef} className="grid-12 scroll-mt-[88px]">
        <div className="col-span-12 lg:col-span-8">
          <div className="on-dark relative border border-rule-dk bg-press p-6 text-wash md:p-12">
            <RegistrationMark className="top-3 left-3" />
            <RegistrationMark className="top-3 right-3" />
            <RegistrationMark className="bottom-3 left-3" />
            <RegistrationMark className="bottom-3 right-3" />

            <span className="t-utility block text-magenta">{REF}</span>

            <h1 className="t-section mt-6 max-w-[16ch]">
              We&apos;ll come back with a price by 4pm tomorrow.
            </h1>

            <p className="mt-6 max-w-measure text-body opacity-75">
              It&apos;s with the estimator now. If anything about the size or the
              fixings changes what it costs, we&apos;ll say so in the reply rather
              than surprise you on the invoice.
            </p>

            <div className="mt-12 border-t border-rule-dk pt-6">
              <span className="t-utility opacity-60">
                {items.length === 1
                  ? "WHAT YOU SENT US"
                  : `WHAT YOU SENT US — ${items.length} ITEMS`}
              </span>
            </div>

            {items.map((item, i) => (
              <dl key={i} className="mt-8">
                {items.length > 1 && (
                  <p className="t-utility mb-3 text-magenta">
                    ITEM {String(i + 1).padStart(2, "0")}
                  </p>
                )}
                <div className="border-t border-rule-dk">
                  {summarise(item).map(([k, v]) => (
                    <SummaryRow key={k} k={k} v={v} />
                  ))}
                  {item.notes && <SummaryRow k="ALSO TOLD US" v={item.notes} />}
                </div>
              </dl>
            ))}

            <div className="mt-12 border-t border-rule-dk pt-8">
              <button
                type="button"
                onClick={addAnother}
                className="link t-sub border-b-2 border-amber"
              >
                Add another item to this quote
              </button>
            </div>
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-3 lg:col-start-10">
          <dl className="border-t border-rule">
            {[
              ["SENT TO", items[0]?.email ?? ""],
              ["REFERENCE", REF.replace("QUOTE #", "")],
              ["ESTIMATOR", "DAN WHITTAKER"],
              ["DIRECT LINE", "01634 880 210"],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-rule py-3">
                <dt className="t-utility opacity-60">{k}</dt>
                <dd className="t-note mt-2 break-words">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    );
  }

  /* ══ Steps 1–3 ═════════════════════════════════════════════════════════ */

  return (
    <div ref={topRef} className="scroll-mt-[88px]">
      {/* ── Progress ────────────────────────────────────────────────────── */}
      <div>
        <div className="relative h-px w-full bg-rule">
          <div
            className="absolute inset-y-0 left-0 bg-magenta transition-[width] duration-squeegee ease-squeegee"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
          {STEPS.map((s) => (
            <li
              key={s.n}
              aria-current={s.n === step ? "step" : undefined}
              className={`t-utility leading-[1.5] ${
                s.n === step
                  ? ""
                  : s.n < step
                    ? "opacity-60"
                    : "opacity-35"
              }`}
            >
              <span className={s.n === step ? "text-magenta" : ""}>
                {String(s.n).padStart(2, "0")}
              </span>{" "}
              {s.label}
            </li>
          ))}
        </ol>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          advance();
        }}
        className="mt-16 grid-12"
      >
        <div className="col-span-12 lg:col-span-8">
          {/* ── 01 What you need ──────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-12">
              <Block step="01" label="WHAT YOU NEED">
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field id="q-product" label="PRODUCT TYPE">
                    <select
                      id="q-product"
                      className="field"
                      value={draft.product}
                      onChange={(e) => patch({ product: e.target.value })}
                    >
                      <option value="">Pick one…</option>
                      {LF_PRODUCTS.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                      <option value="Something else">Something else</option>
                    </select>
                  </Field>

                  <Field id="q-qty" label="QUANTITY">
                    <input
                      id="q-qty"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={9999}
                      className="field qty-box"
                      value={draft.quantity || ""}
                      onChange={(e) =>
                        patch({
                          quantity: Math.min(
                            9999,
                            Math.max(0, Math.floor(Number(e.target.value) || 0)),
                          ),
                        })
                      }
                    />
                  </Field>
                </div>
              </Block>

              <Block step="02" label="FINISHED SIZE">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="min-w-[110px] flex-1">
                    <Field id="q-w" label="WIDTH">
                      <input
                        id="q-w"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        className="field qty-box"
                        value={draft.width || ""}
                        onChange={(e) =>
                          patch({ width: Math.max(0, Number(e.target.value) || 0) })
                        }
                      />
                    </Field>
                  </div>

                  <span aria-hidden="true" className="t-utility pb-4 opacity-50">
                    ×
                  </span>

                  <div className="min-w-[110px] flex-1">
                    <Field id="q-h" label="HEIGHT">
                      <input
                        id="q-h"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        className="field qty-box"
                        value={draft.height || ""}
                        onChange={(e) =>
                          patch({ height: Math.max(0, Number(e.target.value) || 0) })
                        }
                      />
                    </Field>
                  </div>

                  {/* Toggling converts what's already typed rather than
                      reinterpreting 3000mm as 3000in. */}
                  <div
                    role="group"
                    aria-label="Units"
                    className="flex border border-rule"
                  >
                    {UNITS.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        aria-pressed={draft.unit === u.id}
                        onClick={() =>
                          // Converted off the updater's own `d` for the same
                          // reason as the fixings — a stale unit here would
                          // double-convert the size.
                          setDraft((d) => ({
                            ...d,
                            unit: u.id as UnitId,
                            width: convert(d.width, d.unit, u.id),
                            height: convert(d.height, d.unit, u.id),
                          }))
                        }
                        className={`t-utility min-h-[48px] px-4 transition-colors duration-wipe ease-squeegee ${
                          draft.unit === u.id
                            ? "bg-ink text-paper"
                            : "bg-paper hover:bg-ink/8"
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>

                {needsPanelling(draft) && (
                  <p className="t-note mt-6 border-l-2 border-amber pl-3 leading-[1.8]">
                    That&apos;s wider than the {MAX_WIDTH_MM}mm roll on both sides,
                    so it&apos;ll be printed in panels and joined. Still doable —
                    we&apos;ll show you where the seam falls before we print.
                  </p>
                )}
              </Block>

              <Block step="03" label="WHERE IT'S GOING">
                <div className="grid gap-2 sm:grid-cols-3">
                  {PLACES.map((p) => (
                    <Toggle
                      key={p}
                      active={draft.place === p}
                      onClick={() => patch({ place: p })}
                    >
                      {p}
                    </Toggle>
                  ))}
                </div>
                <p className="t-note mt-4 opacity-70">
                  Outdoor jobs get laminated and UV-stable inks as standard. It
                  changes the material, not the price band.
                </p>
              </Block>

              <Block step="04" label="FIXINGS NEEDED">
                <div className="grid gap-2 sm:grid-cols-2">
                  {FIXINGS.map((f) => (
                    <Toggle
                      key={f}
                      active={draft.fixings.includes(f)}
                      onClick={() => toggleFixing(f)}
                    >
                      {f}
                    </Toggle>
                  ))}
                </div>
              </Block>
            </div>
          )}

          {/* ── 02 Your artwork ───────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-12">
              <Block step="01" label="YOUR ARTWORK">
                <ArtworkDrop value={artwork} onChange={replaceArtwork} />
              </Block>

              <Block step="02" label="NOTHING TO UPLOAD?">
                <label className="flex cursor-pointer items-start gap-4 border border-rule bg-paper p-4 transition-colors duration-wipe ease-squeegee hover:border-ink/40">
                  <input
                    type="checkbox"
                    checked={draft.needsDesign}
                    onChange={(e) => patch({ needsDesign: e.target.checked })}
                    className="mt-1 size-4 shrink-0 accent-[var(--magenta)]"
                  />
                  <span>
                    <span className="block text-small font-medium">
                      Haven&apos;t got artwork yet? We can quote for design too.
                    </span>
                    <span className="t-note mt-2 block opacity-70">
                      Tick this and the quote comes back with two numbers — print
                      on its own, and print with the artwork drawn up here.
                    </span>
                  </span>
                </label>
              </Block>
            </div>
          )}

          {/* ── 03 Your details ───────────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-12">
              <Block step="01" label="YOUR DETAILS">
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field id="q-name" label="NAME">
                    <input
                      id="q-name"
                      className="field"
                      autoComplete="name"
                      value={draft.name}
                      onChange={(e) => patch({ name: e.target.value })}
                    />
                  </Field>
                  <Field id="q-company" label="COMPANY (OPTIONAL)">
                    <input
                      id="q-company"
                      className="field"
                      autoComplete="organization"
                      value={draft.company}
                      onChange={(e) => patch({ company: e.target.value })}
                    />
                  </Field>
                  <Field id="q-email" label="EMAIL">
                    <input
                      id="q-email"
                      type="email"
                      className="field"
                      autoComplete="email"
                      value={draft.email}
                      onChange={(e) => patch({ email: e.target.value })}
                    />
                  </Field>
                  <Field id="q-phone" label="PHONE (OPTIONAL)">
                    <input
                      id="q-phone"
                      type="tel"
                      className="field"
                      autoComplete="tel"
                      value={draft.phone}
                      onChange={(e) => patch({ phone: e.target.value })}
                    />
                  </Field>
                </div>
              </Block>

              <Block step="02" label="WHEN YOU NEED IT BY">
                <div className="max-w-[280px]">
                  <Field
                    id="q-date"
                    label="DATE"
                    hint="Leave it blank if it's not urgent — we'll quote the standard lead time."
                  >
                    {/* Native date input: the OS picker is better than anything
                        we'd ship, and it works with a keyboard on day one. */}
                    <input
                      id="q-date"
                      type="date"
                      className="field"
                      value={draft.needBy}
                      onChange={(e) => patch({ needBy: e.target.value })}
                    />
                  </Field>
                </div>
              </Block>

              <Block step="03" label="ANYTHING ELSE WE SHOULD KNOW">
                <textarea
                  id="q-notes"
                  rows={5}
                  className="field"
                  placeholder="Where it's being fitted, what it's going on, whether there's an existing banner we're matching…"
                  value={draft.notes}
                  onChange={(e) => patch({ notes: e.target.value })}
                />
              </Block>
            </div>
          )}

          {/* ── Issues + controls ─────────────────────────────────────────── */}
          {showIssues && issues.length > 0 && (
            <div role="alert" className="mt-12 border-l-2 border-amber pl-4">
              <p className="t-utility text-amber">
                {issues.length} THING{issues.length > 1 ? "S" : ""} TO FILL IN
              </p>
              <ul className="mt-3 space-y-2">
                {issues.map((m) => (
                  <li key={m} className="t-note">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-rule pt-8">
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowIssues(false);
                  setStep(step - 1);
                }}
              >
                Back
              </Button>
            )}
            <Button type="submit">
              {step === 3 ? "Send this quote request" : "Continue"}
            </Button>
            <span className="t-utility ml-auto opacity-55">
              STEP {step} OF 3
            </span>
          </div>
        </div>

        {/* ── Running spec ────────────────────────────────────────────────── */}
        <aside className="col-span-12 mt-16 lg:col-span-3 lg:col-start-10 lg:mt-0">
          <div className="lg:sticky lg:top-[88px]">
            <span className="t-utility block opacity-60">THIS ITEM</span>
            <dl className="mt-6 border-t border-rule">
              {summarise(draft).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-4 border-b border-rule py-3"
                >
                  <dt className="t-utility leading-[1.5] opacity-55">{k}</dt>
                  <dd className="t-note text-right leading-[1.6]">
                    {v || <span className="opacity-40">—</span>}
                  </dd>
                </div>
              ))}
            </dl>
            {items.length > 0 && (
              <p className="t-note mt-6 opacity-70">
                {items.length} item{items.length > 1 ? "s" : ""} already on{" "}
                {REF}. This one gets added to it.
              </p>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}
