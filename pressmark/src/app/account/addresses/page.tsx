import type { Metadata } from "next";
import { Addresses } from "@/components/site/account-details";

export const metadata: Metadata = {
  title: "Addresses | PRESSMARK account",
  description:
    "Delivery and billing addresses on your account, and which order each was last used on.",
};

export default function AddressesPage() {
  return <Addresses />;
}
