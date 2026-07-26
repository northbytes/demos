"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHead, SpecRow } from "./account-shell";
import { useToday } from "@/lib/dates";
import { ADDRESSES, DETAILS, daysAgo, type Address } from "@/lib/account";

/* Addresses and contact details. Flat rows, mono labels, no cards — the same
 * spec sheet the rest of the site sets a garment on. */

function AddressRow({ address }: { address: Address }) {
  return (
    <li className="flex flex-col gap-4 border-b border-rule py-6 sm:flex-row sm:items-start sm:gap-8">
      <div className="min-w-0 flex-1">
        <span className="t-utility opacity-55">{address.label}</span>
        <p className="t-note mt-4 leading-[1.9]">
          {address.name.toUpperCase()}
          <br />
          {address.lines.map((l) => (
            <span key={l} className="opacity-70">
              {l.toUpperCase()}
              <br />
            </span>
          ))}
        </p>
        {address.lastUsed && (
          <p className="t-note mt-3 opacity-45">
            LAST DELIVERY{" "}
            <Link
              href={`/account/orders/${address.lastUsed}`}
              className="link opacity-100"
            >
              {address.lastUsed}
            </Link>
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <button type="button" className="link t-utility opacity-70">
          EDIT
        </button>
        {!address.primary && (
          <button
            type="button"
            className="t-utility opacity-45 underline underline-offset-4 transition-opacity duration-wipe hover:opacity-100"
          >
            REMOVE
          </button>
        )}
      </div>
    </li>
  );
}

export function Addresses() {
  return (
    <>
      <SectionHead title="Addresses" count={`${ADDRESSES.length} ON FILE`}>
        Where the boxes go and where the invoice goes. The default is what
        checkout fills in — collection from Medway is always available instead.
      </SectionHead>

      <ul className="mt-8 border-t border-rule">
        {ADDRESSES.map((a) => (
          <AddressRow key={a.id} address={a} />
        ))}
      </ul>

      <div className="mt-8">
        <Button variant="secondary">Add an address</Button>
      </div>
    </>
  );
}

/* ─── Details ────────────────────────────────────────────────────────────── */

export function Details() {
  const today = useToday();

  return (
    <>
      <SectionHead title="Details">
        Who we email a proof to, who we invoice, and how we reach you if a file
        won&apos;t print. Proofs and invoices can go to different people —
        they usually do.
      </SectionHead>

      <dl className="mt-8 border-t border-rule">
        {DETAILS.rows.map(([k, v]) => (
          <SpecRow key={k} k={k} v={v} />
        ))}
        <SpecRow k="ACCOUNT" v={DETAILS.account} />
        <SpecRow k="OPENED" v={daysAgo(today, DETAILS.since)} />
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="secondary">Update details</Button>
        <Button variant="ghost">Change password</Button>
      </div>

      <p className="t-note mt-8 max-w-measure leading-[1.8] opacity-60">
        We keep artwork for as long as the account is open, so a reorder never
        needs the file sending again. Ask and we&apos;ll delete it.
      </p>
    </>
  );
}
