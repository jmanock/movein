import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { JsonLd } from "../components/JsonLd";
import { SectionIntro } from "../components/Primitives";
import { pageMetadata, SITE_URL } from "../lib/metadata";
import { getCoverageResults, isZipResultIndexable } from "../lib/seo";

export const metadata: Metadata = pageMetadata("MoveIn Florida Utility Lookup Coverage", "See verified and research-stage Central Florida ZIP codes across the five-county MoveIn utility lookup pilot.", "/coverage");

export default function CoveragePage() {
  const results = getCoverageResults();
  const verified = results.filter(isZipResultIndexable);
  const pending = results.filter((result) => !isZipResultIndexable(result));
  const counties = [...new Set(results.map((result) => result.county).filter(Boolean))].sort() as string[];
  const updated = results.map((result) => result.lastLocationReview).filter((value): value is string => Boolean(value)).sort().at(-1);
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "MoveIn Florida utility lookup coverage", url: `${SITE_URL}/coverage`, description: "Verified and research-stage ZIP coverage in the five-county Central Florida pilot.", hasPart: verified.map((result) => ({ "@type": "WebPage", name: `Utilities for ZIP Code ${result.zipCode}`, url: `${SITE_URL}/lookup/${result.zipCode}` })) };

  return <main id="main-content"><JsonLd data={schema} /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Coverage" }]} /></div><PageHero eyebrow="Current coverage" title="Small by design. Verified before it grows." description={`MoveIn tracks ${results.length} ZIP codes across ${counties.length} Central Florida counties. Only ${verified.length} complete results are indexable; ${pending.length} remain in the research queue.`} /><section className="section"><div className="shell"><div className="coverage-stats"><div><strong>{results.length}</strong><span>supported ZIP records</span></div><div><strong>{verified.length}</strong><span>verified and indexable</span></div><div><strong>{pending.length}</strong><span>pending research</span></div><div><strong>{counties.length}</strong><span>pilot counties</span></div></div>{updated ? <p className="coverage-updated"><Clock3 size={17} aria-hidden="true" /> Coverage data last updated {formatDate(updated)}</p> : null}<SectionIntro eyebrow="Verified areas" title="Complete provider results" text="These pages meet the core-category, source, action, and indexability checks. Every provider must still be confirmed with the complete address." /><div className="coverage-counties">{counties.map((county) => <section key={county}><h2><MapPin size={20} aria-hidden="true" />{county} County</h2><div>{verified.filter((result) => result.county === county).map((result) => <Link key={result.zipCode} href={`/lookup/${result.zipCode}`}><strong>{result.city}</strong><span>{result.zipCode}</span><ArrowRight size={15} aria-hidden="true" /></Link>)}</div></section>)}</div></div></section><section className="section subtle"><div className="shell"><SectionIntro eyebrow="Research queue" title="ZIP pages being completed" text="These useful but incomplete records are noindex and excluded from the XML sitemap. They provide official county and address-level internet starting points without guessing at providers." /><div className="pending-zip-grid">{pending.map((result) => <Link key={result.zipCode} href={`/lookup/${result.zipCode}`}><span>{result.city}</span><strong>{result.zipCode}</strong><small>{result.county} County · Research in progress</small></Link>)}</div></div></section><section className="section coverage-method"><div className="shell split-note"><ShieldCheck size={30} aria-hidden="true" /><div><span className="eyebrow">What verified means</span><h2>Five core categories and official evidence.</h2><p>A verified ZIP has useful electricity, water, sewer, trash and recycling, internet guidance, and local-government records. Provider cards need official sources and dates; essential utility records need relevant customer or emergency actions. Internet listings always require an exact-address check.</p><p>Postal boundaries are not utility boundaries. MoveIn expands carefully because city limits, wells, septic systems, HOAs, landlords, and infrastructure can change the answer within one ZIP.</p><p><Link className="text-link" href="/data-sources">Read the data method <ArrowRight size={15} aria-hidden="true" /></Link></p></div></div></section></main>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
