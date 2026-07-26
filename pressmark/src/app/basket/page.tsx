import Link from "next/link";
import type { Metadata } from "next";
import { BasketView } from "@/components/site/basket-view";
import { SiteNav, SiteFooter } from "@/components/site/site-nav";

export const metadata: Metadata = {
  title: "Your basket | PRESSMARK",
  description:
    "Your configured print runs — method, positions, size run, turnaround and dispatch date on every line, with the quantity break each one sits in.",
};

export default function BasketPage() {
  return (
    <>
      <SiteNav />

      <main className="flex-1">
        <nav aria-label="Breadcrumb" className="border-b border-rule bg-wash">
          <ol className="shell flex h-[48px] items-center gap-3">
            <li className="flex items-center gap-3">
              <Link href="/clothing" className="t-utility opacity-60 hover:opacity-100">
                Clothing
              </Link>
              <span aria-hidden="true" className="t-utility opacity-30">
                /
              </span>
            </li>
            <li className="t-utility" aria-current="page">
              BASKET
            </li>
          </ol>
        </nav>

        <div className="shell py-12 md:py-18">
          <BasketView />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
