import type { Metadata } from "next";
import { Section } from "@/components/system/section";
import { UtilityLabel } from "@/components/system/utility-label";
import { ClothingBrowser } from "@/components/site/clothing-browser";
import { SiteNav } from "@/components/site/site-nav";
import { PRODUCTS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Clothing — everything we print on | PRESSMARK",
  description:
    "Tees, hoodies, polos, workwear, headwear and bags, stocked and printed in Medway. Filter by garment, print method, colour and price per unit.",
};

export default function ClothingPage() {
  return (
    <>
      <SiteNav />

      <main id="top">
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <Section dark rule={false} className="py-16 md:py-24">
          <UtilityLabel className="block opacity-60">CLOTHING</UtilityLabel>

          <h1 className="t-display mt-6 max-w-[14ch]">
            Everything we print on.
          </h1>

          <p className="mt-8 max-w-measure text-body opacity-75">
            Every blank we hold in the racks at Bailey Works — priced by the unit,
            printed the way the artwork actually needs.
          </p>

          <div className="mt-16 border-t border-rule-dk pt-6">
            <span className="t-utility opacity-60">
              {PRODUCTS.length} PRODUCTS
            </span>
          </div>
        </Section>

        {/* ── Rail + results ────────────────────────────────────────────────── */}
        <Section crosshairs={false} rule={false} className="py-12 md:py-16">
          <ClothingBrowser />
        </Section>
      </main>

      <footer className="on-dark border-t border-rule-dk bg-press text-wash">
        <div className="shell flex h-[64px] items-center justify-between gap-6">
          <span className="t-utility opacity-60">© 2026 PRESSMARK</span>
          <span className="t-utility opacity-60">MADE IN KENT</span>
        </div>
      </footer>
    </>
  );
}
