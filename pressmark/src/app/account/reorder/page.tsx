import type { Metadata } from "next";
import { ReorderList } from "@/components/site/account-designs";

export const metadata: Metadata = {
  title: "Reorder | PRESSMARK account",
  description:
    "Send a past job back to the press unchanged — same garments, same artwork, same positions, priced at today's quantity breaks.",
};

export default function ReorderPage() {
  return <ReorderList />;
}
