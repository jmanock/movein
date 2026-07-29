import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { SectionIntro } from "../components/Primitives";
import { pageMetadata } from "../lib/metadata";
import { getIndexableZipResults } from "../lib/seo";

export const metadata: Metadata = pageMetadata("MoveIn Florida Utility Lookup Coverage", "See the reviewed Central Florida ZIP codes and counties currently included in MoveIn utility lookup coverage.", "/coverage");

export default function CoveragePage() {
  const results = getIndexableZipResults();
  const counties = [...new Set(results.map((r) => r.county).filter(Boolean))].sort() as string[];
  return <main id="main-content"><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Coverage" }]} /></div><PageHero eyebrow="Current coverage" title="Small by design. Verified before it grows." description={`MoveIn currently publishes ${results.length} reviewed ZIP pages across ${counties.length} Central Florida counties. A ZIP result is a shortlist—not an address-level service guarantee.`} /><section className="section"><div className="shell"><div className="coverage-stats"><div><strong>{results.length}</strong><span>reviewed ZIP pages</span></div><div><strong>{counties.length}</strong><span>pilot counties</span></div><div><strong>100%</strong><span>linked to official sources</span></div></div><SectionIntro eyebrow="Reviewed areas" title="Browse coverage by county" text="Only quality-gated results appear here and in the XML sitemap. Thin or unverified records are not indexed." /><div className="coverage-counties">{counties.map((county) => <section key={county}><h2><MapPin size={20} aria-hidden="true" />{county} County</h2><div>{results.filter((r) => r.county === county).map((r) => <Link key={r.zipCode} href={`/lookup/${r.zipCode}`}><strong>{r.city}</strong><span>{r.zipCode}</span><ArrowRight size={15} aria-hidden="true" /></Link>)}</div></section>)}</div></div></section><section className="section coverage-method"><div className="shell split-note"><ShieldCheck size={30} aria-hidden="true" /><div><span className="eyebrow">Why coverage differs</span><h2>Postal boundaries are not utility boundaries.</h2><p>Electric territories, municipal limits, county service areas, wells, septic systems, HOAs, landlords, and building-specific internet availability can all change the answer. MoveIn labels possible providers and sends you to an official address check whenever the ZIP alone is not enough.</p><p><Link className="text-link" href="/data-sources">Read the data method <ArrowRight size={15} /></Link></p></div></div></section></main>;
}
