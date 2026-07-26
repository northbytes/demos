import type { Metadata } from "next";
import { ArtworkLibrary } from "@/components/site/account-artwork";

export const metadata: Metadata = {
  title: "Artwork library | PRESSMARK account",
  description:
    "Every file you've sent us, checked at print size — dimensions, resolution, colour mode and the jobs it's been printed on.",
};

export default function ArtworkPage() {
  return <ArtworkLibrary />;
}
