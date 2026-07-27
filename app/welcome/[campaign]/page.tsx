import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { pageMetadata } from "../../lib/metadata";

export function generateStaticParams() { return [{ campaign: "new-neighbor" }, { campaign: "florida-welcome" }]; }

export async function generateMetadata({ params }: { params: Promise<{ campaign: string }> }): Promise<Metadata> {
  const { campaign } = await params;
  return pageMetadata("Welcome home", "You have plenty to think about. We organized the next steps for you.", `/welcome/${campaign}`);
}

export default async function CampaignPage({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return <main id="main-content" className="campaign-page"><section className="campaign-card"><span className="brand-kicker">MoveIn <i>Everything after the keys.</i></span><h1>Welcome home.</h1><p>You have plenty to think about. We organized the next steps for you.</p><ul><li><CheckCircle2 size={18} /> No account required</li><li><CheckCircle2 size={18} /> Progress saves on your phone</li><li><CheckCircle2 size={18} /> Clear, practical guidance</li></ul><Link className="button" href={`/timeline/first-week?campaign=${encodeURIComponent(campaign)}`}>Start with your first-week checklist <ArrowRight size={17} /></Link></section></main>;
}
