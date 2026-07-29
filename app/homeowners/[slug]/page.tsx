import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "../../components/GuideArticle";
import { getGuide, guidesFor } from "../../data/guides";
import { pageMetadata } from "../../lib/metadata";

export function generateStaticParams() { return guidesFor("homeowners").map((guide) => ({ slug: guide.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const guide = getGuide("homeowners", slug); return guide ? pageMetadata(guide.title, guide.description, guide.path, { article: true }) : pageMetadata("Homeowner guide not found", "This homeowner guide is not available.", "/homeowners", { noindex: true }); }
export default async function HomeownerGuidePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const guide = getGuide("homeowners", slug); if (!guide) notFound(); return <GuideArticle guide={guide} />; }
