import type { Metadata } from "next";
import { Details } from "@/components/site/account-details";

export const metadata: Metadata = {
  title: "Details | PRESSMARK account",
  description:
    "Contact details on your account — who a proof goes to, who the invoice goes to, and your payment terms.",
};

export default function DetailsPage() {
  return <Details />;
}
