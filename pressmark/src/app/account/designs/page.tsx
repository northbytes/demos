import type { Metadata } from "next";
import { SavedDesigns } from "@/components/site/account-designs";

export const metadata: Metadata = {
  title: "Saved designs | PRESSMARK account",
  description:
    "Your saved garment setups — garment, colour, artwork and size run, ready to send back to the press at today's quantity breaks.",
};

export default function DesignsPage() {
  return <SavedDesigns />;
}
