import Link from "next/link";
import type { Metadata } from "next";
import { Section } from "@/components/system/section";
import { UtilityLabel } from "@/components/system/utility-label";
import { QuoteFlow } from "@/components/site/quote-flow";
import { SiteNav, SiteFooter } from "@/components/site/site-nav";

export const metadata: Metadata = {
  title: "Request a quote — large format print | PRESSMARK",
  description:
    "Tell us the product, the finished size, where it's going and when you need it. We'll come back with a price by 4pm the next working day.",
};

export default function QuotePage() {
  return (
    <>
      <SiteNav />

      <main id="top">
        {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="border-b border-rule bg-wash">
          <ol className="shell flex h-[48px] items-center gap-3">
            <li className="flex items-center gap-3">
              <Link
                href="/large-format"
                className="t-utility opacity-60 hover:opacity-100"
              >
                Large format
              </Link>
              <span aria-hidden="true" className="t-utility opacity-30">
                /
              </span>
            </li>
            <li className="t-utility" aria-current="page">
              REQUEST A QUOTE
            </li>
          </ol>
        </nav>

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <Section dark rule={false} className="py-16 md:py-24">
          <UtilityLabel className="block opacity-60">
            REQUEST A QUOTE
          </UtilityLabel>

          <h1 className="t-display mt-6 max-w-[13ch]">Tell us the job.</h1>

          <p className="mt-8 max-w-measure text-body opacity-75">
            Three steps, and none of them ask for a card. A real estimator reads
            it and comes back with a price — by 4pm the next working day.
          </p>

          <div className="mt-16 border-t border-rule-dk pt-6">
            <span className="t-utility opacity-70">
              NO ACCOUNT NEEDED · NO OBLIGATION · PRICED BY A PERSON
            </span>
          </div>
        </Section>

        {/* ── The flow ──────────────────────────────────────────────────────── */}
        <Section crosshairs={false} rule={false} className="py-12 md:py-18">
          <QuoteFlow />
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
