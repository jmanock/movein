import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "../../components/GuidePage";
import { getGuide, getGuides } from "../../data/guides";
import { pageMetadata } from "../../lib/metadata";

export function generateStaticParams() { return getGuides("renters").map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide("renters", slug);
  if (!guide) notFound();
  return pageMetadata(guide.title, guide.description, `/renters/${slug}`, "/og/renters");
}

export default async function RenterGuide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide("renters", slug);
  if (!guide) notFound();
  return <GuidePage guide={guide} />;
}
