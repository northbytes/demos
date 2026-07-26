import type { Metadata } from "next";
import { OrderConfirmed } from "@/components/site/order-confirmed";
import { SiteNav, SiteFooter } from "@/components/site/site-nav";

export const metadata: Metadata = {
  title: "Order confirmed | PRESSMARK",
  description:
    "Your order number and the production timeline for this job — artwork check, proof, approval, on press, ready.",
  robots: { index: false },
};

export default function ConfirmedPage() {
  return (
    <>
      <SiteNav />

      <main className="flex-1">
        <div className="shell py-12 md:py-18">
          <OrderConfirmed />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
