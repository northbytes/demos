import Link from "next/link";
import type { Metadata } from "next";
import { Checkout } from "@/components/site/checkout";
import { SiteNav, SiteFooter } from "@/components/site/site-nav";

export const metadata: Metadata = {
  title: "Checkout | PRESSMARK",
  description:
    "Delivery or collection from Medway, your address, payment, and the proof approval — one page, four blocks.",
};

export default function CheckoutPage() {
  return (
    <>
      <SiteNav />

      <main className="flex-1">
        <nav aria-label="Breadcrumb" className="border-b border-rule bg-wash">
          <ol className="shell flex h-[48px] items-center gap-3">
            <li className="flex items-center gap-3">
              <Link href="/basket" className="t-utility opacity-60 hover:opacity-100">
                Basket
              </Link>
              <span aria-hidden="true" className="t-utility opacity-30">
                /
              </span>
            </li>
            <li className="t-utility" aria-current="page">
              CHECKOUT
            </li>
          </ol>
        </nav>

        <div className="shell py-12 md:py-18">
          <Checkout />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
