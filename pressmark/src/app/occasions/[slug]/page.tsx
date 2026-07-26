import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OccasionLanding } from "@/components/site/occasion-landing";
import { OCCASIONS, occasionBySlug } from "@/lib/occasions";

export function generateStaticParams() {
  return OCCASIONS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return occasionBySlug(slug)?.meta ?? {};
}

export default async function OccasionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const occasion = occasionBySlug(slug);
  if (!occasion) notFound();

  return <OccasionLanding occasion={occasion} />;
}
