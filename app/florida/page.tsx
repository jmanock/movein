import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ContentCard, PageHero } from "../components/PageHero";
import { floridaGuides } from "../data/site";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Welcome Home, Florida | Florida Move-In Guide", "Everything you need to settle in, get organized, and feel at home in Florida.", "/florida");

export default function FloridaPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Welcome Home, Florida", url: "https://movein.guide/florida", isPartOf: { "@type": "WebSite", name: "MoveIn", url: "https://movein.guide" } };
  return <main id="main-content"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><PageHero eyebrow="MoveIn regional guide 01" title="Welcome Home, Florida." description="Everything you need to settle in, get organized, and feel at home."><Link className="button" href="/timeline/first-week">Start with your first week <ArrowRight size={17} /></Link></PageHero><section className="section-pad region-section"><div className="shell"><div className="region-identity"><MapPin size={22} /><div><span>MoveIn</span><strong>Welcome Home Florida</strong><p>The original Florida experience now lives within MoveIn’s national platform.</p></div></div><div className="content-grid">{floridaGuides.map((guide) => <ContentCard key={guide.slug} title={guide.title} description={guide.description} href={`/florida/${guide.slug}`} />)}</div></div></section></main>;
}
