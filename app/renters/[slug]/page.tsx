import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "../../components/GuideArticle";
import { RenterAnalytics } from "../../components/RenterAnalytics";
import { getGuide, guidesFor } from "../../data/guides";
import { pageMetadata } from "../../lib/metadata";

export function generateStaticParams() { return guidesFor("renters").map((guide) => ({ slug: guide.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const guide = getGuide("renters", slug); return guide ? pageMetadata(guide.title, guide.description, guide.path, { article: true }) : pageMetadata("Renter guide not found", "This renter guide is not available.", "/renters", { noindex: true }); }
export default async function RenterGuidePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const guide = getGuide("renters", slug); if (!guide) notFound(); return <><RenterAnalytics path={guide.path} /><GuideArticle guide={guide} /></>; }
