import type { Metadata } from "next";
import { OrderDetail } from "@/components/site/account-orders";
import { getOrders } from "@/lib/account";

export function generateStaticParams() {
  return getOrders().map((o) => ({ ref: o.ref }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ref: string }>;
}): Promise<Metadata> {
  const { ref } = await params;
  return {
    title: `Order ${ref} | PRESSMARK account`,
    description:
      "Where this job is on the press floor — five stages with real timestamps, the proof waiting on you, and what's on the job bag.",
  };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  return <OrderDetail orderRef={ref} />;
}
