import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ContentCard, PageHero } from "../components/PageHero";
import { floridaGuides } from "../data/site";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Welcome Home, Florida | Florida Move-In Guide", "Everything you need to settle in, get organized, and feel at home in Florida.", "/florida", "/og/florida");

export default function FloridaPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Welcome Home, Florida", url: "https://movein.guide/florida", isPartOf: { "@type": "WebSite", name: "MoveIn", url: "https://movein.guide" } };
  return <main id="main-content"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replaceAll("<", "\\u003c") }} /><PageHero eyebrow="MoveIn regional guide 01" title="Welcome Home, Florida." description="Practical, source-aware guidance for moving, storms, homes, vehicles, tolls, utilities, and local routines."><Link className="button" href="/florida/moving-to-florida-checklist">Start the Florida checklist <ArrowRight size={17} aria-hidden="true" /></Link></PageHero><section className="section-pad region-section"><div className="shell"><div className="region-identity"><MapPin size={22} aria-hidden="true" /><div><span>MoveIn regional guide</span><strong>Welcome Home Florida</strong><p>Statewide guidance with official-source paths for details that vary by county or change over time.</p></div></div><div className="content-grid florida-grid">{floridaGuides.map((guide) => <ContentCard key={guide.href} title={guide.title} description={guide.description} href={guide.href} icon={guide.icon} />)}</div></div></section></main>;
}
