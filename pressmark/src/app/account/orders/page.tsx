import type { Metadata } from "next";
import { OrdersList } from "@/components/site/account-orders";

export const metadata: Metadata = {
  title: "Orders | PRESSMARK account",
  description:
    "Every job you've put through the press, with the stage it's standing on, what it's waiting on and the total.",
};

export default function OrdersPage() {
  return <OrdersList />;
}
