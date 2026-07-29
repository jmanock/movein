import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "../../components/GuideArticle";
import { getGuide, guidesFor } from "../../data/guides";
import { pageMetadata } from "../../lib/metadata";

export function generateStaticParams() { return guidesFor("resources").map((guide) => ({ slug: guide.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const guide = getGuide("resources", slug); return guide ? pageMetadata(guide.title, guide.description, guide.path, { article: true }) : pageMetadata("Resource not found", "This MoveIn resource is not available.", "/resources", { noindex: true }); }
export default async function ResourceGuidePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const guide = getGuide("resources", slug); if (!guide) notFound(); return <GuideArticle guide={guide} />; }
