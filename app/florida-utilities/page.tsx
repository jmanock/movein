import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPinned, ShieldCheck } from "lucide-react";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { JsonLd } from "../components/JsonLd";
import { SectionIntro } from "../components/Primitives";
import { countyProfiles } from "../data/counties";
import { pageMetadata, SITE_URL } from "../lib/metadata";
import { getCoverageResults, isZipResultIndexable } from "../lib/seo";

export const metadata: Metadata = pageMetadata("Florida Utility Lookup and Moving Resources", "Browse verified utility lookup pages and moving resources for MoveIn's five Central Florida pilot counties.", "/florida-utilities");

export default function FloridaUtilitiesPage() {
  const results = getCoverageResults();
  const verified = results.filter(isZipResultIndexable);
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Central Florida utility lookup", url: `${SITE_URL}/florida-utilities`, description: "Verified utility lookup and moving-resource hubs for five Central Florida counties.", hasPart: countyProfiles.map((county) => ({ "@type": "CollectionPage", name: `${county.name} County utilities`, url: `${SITE_URL}/${county.slug}` })) };
  return <main id="main-content"><JsonLd data={schema} /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Florida utilities" }]} /></div><PageHero eyebrow="Central Florida pilot" title="Find utilities and moving resources by county." description={`MoveIn tracks ${results.length} ZIP records across five counties. ${verified.length} reviewed ZIP pages are indexable; incomplete records stay out of search until the evidence is ready.`} /><section className="section"><div className="shell"><SectionIntro eyebrow="County guides" title="Start with the county, then confirm the address." text="County pages organize verified ZIP results, emergency resources, local services, and practical moving guides without treating county borders as utility territories." /><div className="county-hub-grid">{countyProfiles.map((county) => { const countyResults = results.filter((result) => result.county === county.name); const countyVerified = countyResults.filter(isZipResultIndexable); return <Link href={`/${county.slug}`} key={county.name} data-analytics-county={county.name}><MapPinned size={24} aria-hidden="true" /><span className="eyebrow">{countyVerified.length} verified ZIPs</span><h2>{county.name} County</h2><p>{county.overview}</p><strong>Open county guide <ArrowRight size={16} aria-hidden="true" /></strong></Link>; })}</div></div></section><section className="section subtle"><div className="shell split-note"><ShieldCheck size={30} aria-hidden="true" /><div><span className="eyebrow">Coverage standard</span><h2>Useful before indexable.</h2><p>Every verified ZIP needs reviewed electricity, water, sewer, trash and recycling, internet guidance, local government, provider actions, phone contacts, and public sources. Pending ZIPs can offer safe official starting points, but they remain noindex.</p><p><Link className="text-link" href="/coverage">Review all current ZIP coverage <ArrowRight size={15} aria-hidden="true" /></Link></p></div></div></section></main>;
}
