import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { pageMetadata } from "../../lib/metadata";

const campaigns = {
  "new-neighbor": { title: "Welcome home", description: "A calm first-week checklist for settling into your new place.", canonical: "/timeline/first-week", cta: "Start with your first-week checklist", destination: "/timeline/first-week" },
  "florida-welcome": { title: "Welcome home, Florida", description: "A Florida-focused starting point for storms, utilities, vehicles, and local routines.", canonical: "/florida/moving-to-florida-checklist", cta: "Start the Florida move-in checklist", destination: "/florida/moving-to-florida-checklist" },
} as const;

export function generateStaticParams() { return Object.keys(campaigns).map((campaign) => ({ campaign })); }

export async function generateMetadata({ params }: { params: Promise<{ campaign: string }> }): Promise<Metadata> {
  const { campaign } = await params;
  const page = campaigns[campaign as keyof typeof campaigns];
  if (!page) notFound();
  return { ...pageMetadata(page.title, page.description, page.canonical), robots: { index: false, follow: true, nocache: true } };
}

export default async function CampaignPage({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  const page = campaigns[campaign as keyof typeof campaigns];
  if (!page) notFound();
  return <main id="main-content" className="campaign-page"><section className="campaign-card"><span className="brand-kicker">MoveIn <i>Everything after the keys.</i></span><h1>{page.title}.</h1><p>{page.description}</p><ul><li><CheckCircle2 size={18} aria-hidden="true" /> No account required</li><li><CheckCircle2 size={18} aria-hidden="true" /> Progress saves on your device</li><li><CheckCircle2 size={18} aria-hidden="true" /> Clear, practical guidance</li></ul><Link className="button" href={`${page.destination}?campaign=${encodeURIComponent(campaign)}`}>{page.cta} <ArrowRight size={17} aria-hidden="true" /></Link></section></main>;
}
