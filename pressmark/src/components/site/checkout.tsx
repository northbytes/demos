"use client";

import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, FieldError } from "@/components/ui/input";
import { money } from "@/lib/pricing";
import {
  COLLECTION,
  POSTCODE_RESULTS,
  normalisePostcode,
  totals,
  useBasket,
} from "@/lib/basket";
import { OrderSummary } from "./basket-view";

/* One page, four blocks, no wizard. A print job has enough real decisions in it
 * without hiding three of them behind a Continue button. */

const BLOCKS = [
  { n: "01", label: "DELIVERY OR COLLECTION" },
  { n: "02", label: "ADDRESS" },
  { n: "03", label: "PAYMENT" },
  { n: "04", label: "BEFORE WE PRINT" },
];

const PAYMENTS = [
  { id: "card", name: "Card", note: "Visa, Mastercard, Amex" },
  { id: "apple", name: "Apple Pay", note: "Confirm with Face ID" },
  { id: "google", name: "Google Pay", note: "Confirm in the sheet" },
  { id: "paypal", name: "PayPal", note: "You'll be sent to PayPal" },
];

/* ─── Parts ──────────────────────────────────────────────────────────────── */

function Block({
  n,
  label,
  value,
  children,
}: {
  n: string;
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="t-utility opacity-60">
          {n} — {label}
        </h2>
        {value && <span className="t-utility text-right">{value}</span>}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** The house tile. Magenta is spent on the pay button and the total here, so
 * selection is carried by the ink border and a filled marker instead. */
function Tile({
  active,
  onClick,
  className = "",
  children,
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex gap-3 border bg-paper p-4 text-left transition-colors duration-wipe ease-squeegee ${
        active
          ? "border-ink outline outline-1 -outline-offset-1 outline-ink"
          : "border-rule hover:border-ink/40"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`mt-1 block size-3 shrink-0 border ${
          active ? "border-ink bg-ink" : "border-ink/40"
        }`}
      />
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}

function Field({
  id,
  label,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="t-utility block opacity-60">
        {label}
      </label>
      <div className="mt-3">{children}</div>
      {error && <FieldError className="mt-2">{error}</FieldError>}
    </div>
  );
}

/* ─── Postcode lookup ────────────────────────────────────────────────────── */

type Address = {
  name: string;
  company: string;
  line1: string;
  line2: string;
  town: string;
  postcode: string;
};

const EMPTY_ADDRESS: Address = {
  name: "",
  company: "",
  line1: "",
  line2: "",
  town: "",
  postcode: "",
};

function PostcodeLookup({
  onPick,
  onManual,
}: {
  onPick: (a: Partial<Address>) => void;
  onManual: () => void;
}) {
  const [entry, setEntry] = React.useState("");
  const [results, setResults] = React.useState<string[][] | null>(null);
  const [miss, setMiss] = React.useState<string | null>(null);

  function find() {
    const key = normalisePostcode(entry);
    if (key.length < 5) {
      setResults(null);
      setMiss("That doesn't look like a full postcode. Try ME4 4TZ.");
      return;
    }
    const hit = POSTCODE_RESULTS[key];
    setResults(hit ?? null);
    setMiss(
      hit
        ? null
        : `Nothing found for ${entry.toUpperCase()}. Type the address in by hand — we'll still print it.`,
    );
    if (!hit) onManual();
  }

  return (
    <div className="border border-rule bg-paper p-4 md:p-6">
      <div className="flex flex-wrap items-end gap-3">
        <Field id="lookup" label="POSTCODE" className="min-w-[180px] flex-1">
          <Input
            id="lookup"
            value={entry}
            autoComplete="postal-code"
            placeholder="ME4 4TZ"
            onChange={(e) => setEntry(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                find();
              }
            }}
          />
        </Field>
        <Button type="button" variant="secondary" onClick={find}>
          Find address
        </Button>
      </div>

      {miss && (
        <FieldError className="mt-4" role="alert">
          {miss}
        </FieldError>
      )}

      {results && (
        <ul className="mt-4 border-t border-rule">
          {results.map((r) => (
            <li key={r.join()}>
              <button
                type="button"
                onClick={() => {
                  onPick({ line1: r[0], line2: r[1], town: r[2], postcode: r[3] });
                  setResults(null);
                }}
                className="block w-full border-b border-rule py-3 text-left text-small transition-colors duration-wipe ease-squeegee hover:text-magenta"
              >
                {r.join(", ")}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onManual}
        className="link t-utility mt-4 inline-block opacity-70"
      >
        ENTER IT BY HAND INSTEAD
      </button>
    </div>
  );
}

/* ─── The page body ──────────────────────────────────────────────────────── */

export function Checkout() {
  const router = useRouter();
  const lines = useBasket();

  const [collecting, setCollecting] = React.useState(false);
  const [address, setAddress] = React.useState<Address>(EMPTY_ADDRESS);
  const [manual, setManual] = React.useState(false);
  const [contact, setContact] = React.useState({ email: "", phone: "" });
  const [payment, setPayment] = React.useState("card");
  const [card, setCard] = React.useState({ number: "", expiry: "", cvc: "" });
  const [agreed, setAgreed] = React.useState(false);
  const [showErrors, setShowErrors] = React.useState(false);

  const sum = totals(lines, collecting);
  const patch = (p: Partial<Address>) => {
    setAddress((a) => ({ ...a, ...p }));
    setManual(true);
  };

  /* Only what the shop genuinely can't proceed without: somewhere to send the
   * proof, somewhere to send the box, and the sign-off. */
  const errors: Record<string, string> = {};
  if (!contact.email.includes("@"))
    errors.email = "We need an email — the proof and the artwork link go there.";
  if (!address.name.trim()) errors.name = "Who should we put on the label?";
  if (!collecting) {
    if (!address.line1.trim()) errors.line1 = "Add the first line of the address.";
    if (!address.town.trim()) errors.town = "Add the town.";
    if (!address.postcode.trim()) errors.postcode = "Add the postcode.";
  }
  if (payment === "card" && card.number.replace(/\s/g, "").length < 12)
    errors.card = "Enter the long number on the front of the card.";
  const err = (k: string) => (showErrors ? errors[k] : undefined);

  const blocked = Object.keys(errors).length > 0 || !agreed;

  function pay() {
    if (blocked) {
      setShowErrors(true);
      document
        .querySelector("[data-invalid='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    router.push("/checkout/confirmed");
  }

  if (lines.length === 0) {
    return (
      <div className="border border-rule bg-paper p-8 md:p-16">
        <h1 className="t-section">There&apos;s nothing to pay for.</h1>
        <p className="mt-6 max-w-measure text-small opacity-75">
          Your basket is empty, so there&apos;s no job to book in.
        </p>
        <Button className="mt-8" asChild>
          <Link href="/clothing">Browse clothing</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid-12 gap-y-12">
      {/* ══ The four blocks ═══════════════════════════════════════════════ */}
      <div className="col-span-12 lg:col-span-7">
        <h1 className="t-section">Checkout</h1>
        <p className="t-utility mt-4 opacity-55">
          FOUR THINGS. NO STEPS TO CLICK THROUGH.
        </p>

        <div className="mt-12 space-y-12">
          {/* ── 01 Delivery or collection ─────────────────────────────── */}
          <Block
            n={BLOCKS[0].n}
            label={BLOCKS[0].label}
            value={collecting ? "COLLECTION" : "DELIVERY"}
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <Tile active={!collecting} onClick={() => setCollecting(false)}>
                <span className="block text-small font-medium">
                  Delivered to you
                </span>
                <span className="mt-2 block text-small leading-snug opacity-65">
                  Tracked, next day once the run is off the press.
                </span>
                <span className="t-utility mt-4 block opacity-60">
                  {sum.goods >= 75 ? "FREE OVER £75" : `${money(6.5)} TRACKED`}
                </span>
              </Tile>

              <Tile active={collecting} onClick={() => setCollecting(true)}>
                <span className="block text-small font-medium">
                  Collect from the works
                </span>
                <address className="t-note mt-3 block leading-[1.8] not-italic opacity-70">
                  {COLLECTION.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <dl className="mt-4 border-t border-rule pt-3">
                  {COLLECTION.hours.map(([day, hours]) => (
                    <div
                      key={day}
                      className="flex items-baseline justify-between gap-4 py-1"
                    >
                      <dt className="t-utility opacity-55">{day}</dt>
                      <dd className="t-utility">{hours}</dd>
                    </div>
                  ))}
                </dl>
              </Tile>
            </div>

            {collecting && (
              <p className="t-note mt-4 border-l-2 border-amber pl-3 leading-[1.8]">
                {COLLECTION.note}
              </p>
            )}
          </Block>

          {/* ── 02 Address ────────────────────────────────────────────── */}
          <Block
            n={BLOCKS[1].n}
            label={collecting ? "WHO'S COLLECTING" : BLOCKS[1].label}
          >
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="name" label="FULL NAME" error={err("name")}>
                  <Input
                    id="name"
                    value={address.name}
                    autoComplete="name"
                    aria-invalid={!!err("name")}
                    data-invalid={!!err("name")}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, name: e.target.value }))
                    }
                  />
                </Field>
                <Field id="company" label="COMPANY (OPTIONAL)">
                  <Input
                    id="company"
                    value={address.company}
                    autoComplete="organization"
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, company: e.target.value }))
                    }
                  />
                </Field>
                <Field id="email" label="EMAIL" error={err("email")}>
                  <Input
                    id="email"
                    type="email"
                    value={contact.email}
                    autoComplete="email"
                    aria-invalid={!!err("email")}
                    data-invalid={!!err("email")}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, email: e.target.value }))
                    }
                  />
                </Field>
                <Field id="phone" label="PHONE (OPTIONAL)">
                  <Input
                    id="phone"
                    type="tel"
                    value={contact.phone}
                    autoComplete="tel"
                    onChange={(e) =>
                      setContact((c) => ({ ...c, phone: e.target.value }))
                    }
                  />
                </Field>
              </div>

              {!collecting && (
                <>
                  <PostcodeLookup
                    onPick={patch}
                    onManual={() => setManual(true)}
                  />

                  {manual && (
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field
                        id="line1"
                        label="ADDRESS LINE 1"
                        error={err("line1")}
                        className="sm:col-span-2"
                      >
                        <Input
                          id="line1"
                          value={address.line1}
                          autoComplete="address-line1"
                          aria-invalid={!!err("line1")}
                          data-invalid={!!err("line1")}
                          onChange={(e) =>
                            setAddress((a) => ({ ...a, line1: e.target.value }))
                          }
                        />
                      </Field>
                      <Field
                        id="line2"
                        label="ADDRESS LINE 2 (OPTIONAL)"
                        className="sm:col-span-2"
                      >
                        <Input
                          id="line2"
                          value={address.line2}
                          autoComplete="address-line2"
                          onChange={(e) =>
                            setAddress((a) => ({ ...a, line2: e.target.value }))
                          }
                        />
                      </Field>
                      <Field id="town" label="TOWN" error={err("town")}>
                        <Input
                          id="town"
                          value={address.town}
                          autoComplete="address-level2"
                          aria-invalid={!!err("town")}
                          data-invalid={!!err("town")}
                          onChange={(e) =>
                            setAddress((a) => ({ ...a, town: e.target.value }))
                          }
                        />
                      </Field>
                      <Field
                        id="postcode"
                        label="POSTCODE"
                        error={err("postcode")}
                      >
                        <Input
                          id="postcode"
                          value={address.postcode}
                          autoComplete="postal-code"
                          aria-invalid={!!err("postcode")}
                          data-invalid={!!err("postcode")}
                          onChange={(e) =>
                            setAddress((a) => ({
                              ...a,
                              postcode: e.target.value,
                            }))
                          }
                        />
                      </Field>
                    </div>
                  )}

                  {showErrors && !manual && (
                    <FieldError role="alert">
                      Find your postcode above, or enter the address by hand.
                    </FieldError>
                  )}
                </>
              )}
            </div>
          </Block>

          {/* ── 03 Payment ────────────────────────────────────────────── */}
          <Block
            n={BLOCKS[2].n}
            label={BLOCKS[2].label}
            value={PAYMENTS.find((p) => p.id === payment)?.name.toUpperCase()}
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {PAYMENTS.map((p) => (
                <Tile
                  key={p.id}
                  active={p.id === payment}
                  onClick={() => setPayment(p.id)}
                >
                  <span className="block text-small font-medium">{p.name}</span>
                  <span className="t-utility mt-2 block opacity-55">
                    {p.note.toUpperCase()}
                  </span>
                </Tile>
              ))}
            </div>

            {payment === "card" ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Field
                  id="card-number"
                  label="CARD NUMBER"
                  error={err("card")}
                  className="sm:col-span-2"
                >
                  <Input
                    id="card-number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    value={card.number}
                    aria-invalid={!!err("card")}
                    data-invalid={!!err("card")}
                    onChange={(e) =>
                      setCard((c) => ({ ...c, number: e.target.value }))
                    }
                  />
                </Field>
                <Field id="card-expiry" label="EXPIRY">
                  <Input
                    id="card-expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM / YY"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard((c) => ({ ...c, expiry: e.target.value }))
                    }
                  />
                </Field>
                <Field id="card-cvc" label="SECURITY CODE">
                  <Input
                    id="card-cvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    value={card.cvc}
                    onChange={(e) =>
                      setCard((c) => ({ ...c, cvc: e.target.value }))
                    }
                  />
                </Field>
              </div>
            ) : (
              <p className="t-note mt-6 border border-rule px-4 py-4 leading-[1.8] opacity-75">
                YOU&apos;LL CONFIRM THE PAYMENT IN THE{" "}
                {PAYMENTS.find((p) => p.id === payment)?.name.toUpperCase()} SHEET
                AFTER YOU PRESS PAY. NOTHING IS TAKEN BEFORE THAT.
              </p>
            )}
          </Block>

          {/* ── 04 Proof approval ─────────────────────────────────────── */}
          <Block n={BLOCKS[3].n} label={BLOCKS[3].label}>
            <div
              className={`border bg-paper p-6 transition-colors duration-wipe ease-squeegee ${
                showErrors && !agreed ? "border-amber" : "border-rule"
              }`}
            >
              {/* Stated at reading size, not shrunk into small print. The whole
                  returns position for a custom print shop is these two lines. */}
              <p className="max-w-measure text-body leading-relaxed">
                Custom-printed items can&apos;t be returned unless they&apos;re
                faulty or we&apos;ve printed them wrong. You&apos;ll approve a
                digital proof before anything is printed.
              </p>

              <label
                htmlFor="proof-ack"
                className="mt-6 flex cursor-pointer items-start gap-3 border-t border-rule pt-6"
              >
                <Checkbox
                  id="proof-ack"
                  checked={agreed}
                  aria-invalid={showErrors && !agreed}
                  data-invalid={showErrors && !agreed}
                  onCheckedChange={(v) => setAgreed(v === true)}
                  className="mt-[3px]"
                />
                <span className="text-small leading-relaxed">
                  I understand, and I&apos;ll check the proof before approving it.
                </span>
              </label>

              {showErrors && !agreed && (
                <FieldError className="mt-4" role="alert">
                  Tick the box and the pay button unlocks.
                </FieldError>
              )}
            </div>

            {sum.missingArtwork.length > 0 && (
              <div className="mt-4 border border-rule bg-paper p-6">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] block size-2 shrink-0 rounded-full border border-ink/45"
                  />
                  <div>
                    <h3 className="text-small font-medium">
                      {sum.missingArtwork.length === 1
                        ? "One item has no artwork yet"
                        : `${sum.missingArtwork.length} items have no artwork yet`}
                    </h3>
                    <p className="mt-2 max-w-measure text-small leading-relaxed opacity-75">
                      You can pay now and send artwork after — we&apos;ll email
                      you a link. Nothing goes on press until you approve the
                      proof.
                    </p>
                    <ul className="mt-4 border-t border-rule">
                      {sum.missingArtwork.map((l) => (
                        <li
                          key={l.id}
                          className="t-utility border-b border-rule py-3 opacity-70"
                        >
                          {l.product.toUpperCase()} — {l.colourName.toUpperCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Block>
        </div>
      </div>

      {/* ══ Summary ═══════════════════════════════════════════════════════ */}
      <div className="col-span-12 lg:col-span-4 lg:col-start-9">
        <div className="lg:sticky lg:top-[88px]">
          <OrderSummary
            sum={sum}
            collecting={collecting}
            action={
              <Button size="lg" className="w-full" onClick={pay}>
                Pay {money(sum.total)}
              </Button>
            }
            note={
              <p className="t-note leading-[1.8] opacity-60">
                {agreed
                  ? "A DATED PROOF COMES BACK THE SAME WORKING DAY."
                  : "TICK THE PROOF NOTE IN BLOCK 04 TO PAY."}
              </p>
            }
          />
        </div>
      </div>
    </div>
  );
}
