import type { Metadata } from "next";
import { OrdersList } from "@/components/site/account-orders";

/* Orders are what people come here for. This renders them rather than
 * redirecting to /account/orders — redirect() needs a server and the site is a
 * static export (see next.config.ts), which built this page as an error shell. */

export const metadata: Metadata = {
  title: "Orders | PRESSMARK account",
  description:
    "Every job you've put through the press, with the stage it's standing on, what it's waiting on and the total.",
};

export default function AccountPage() {
  return <OrdersList />;
}
