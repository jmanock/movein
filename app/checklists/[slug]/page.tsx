import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "../../components/GuidePage";
import { getGuide, getGuides } from "../../data/guides";
import { pageMetadata } from "../../lib/metadata";

export function generateStaticParams() { return getGuides("checklists").map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide("checklists", slug);
  if (!guide) notFound();
  return pageMetadata(guide.title, guide.description, `/checklists/${slug}`, "/og/checklists");
}

export default async function ChecklistGuide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide("checklists", slug);
  if (!guide) notFound();
  return <GuidePage guide={guide} />;
}
