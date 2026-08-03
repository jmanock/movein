import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck } from "lucide-react";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { ZipRequestForm } from "../components/ZipRequestForm";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Request a ZIP Code for MoveIn Coverage", "Request an unsupported Florida ZIP code without creating an account or sharing an email address.", "/request-zip", { noindex: true });

export default async function RequestZipPage({ searchParams }: { searchParams: Promise<{ zip?: string }> }) {
  const { zip = "" } = await searchParams;
  return <main id="main-content"><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Coverage", href: "/coverage" }, { label: "Request a ZIP" }]} /></div><PageHero eyebrow="Coverage requests" title="We don’t support this ZIP yet." description="Request this ZIP. We’re expanding coverage every week, and anonymous request totals help us decide what to research next." /><section className="section"><div className="shell request-zip-layout"><div><ZipRequestForm initialZip={zip} /><p className="request-privacy"><ShieldCheck size={18} aria-hidden="true" />MoveIn records only the requested five-digit ZIP in privacy-respecting analytics when tracking is available. We do not ask for an email, name, phone number, or street address.</p></div><aside><BarChart3 size={28} aria-hidden="true" /><h2>Coverage driven by real demand.</h2><p>Request counts help MoveIn prioritize official-source research instead of guessing which areas need coverage most.</p><Link href="/coverage">See current coverage <ArrowRight size={16} aria-hidden="true" /></Link></aside></div></section></main>;
}
