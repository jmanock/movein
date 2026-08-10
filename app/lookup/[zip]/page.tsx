import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../components/PageHero";
import { LookupResults } from "../../components/LookupResults";
import { ZipLookupForm } from "../../components/ZipLookupForm";
import { getLookupResult, isValidZip } from "../../../db/lookup.ts";
import { pageMetadata } from "../../lib/metadata";
import { getRelatedAreas, isZipResultIndexable } from "../../lib/seo";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL } from "../../lib/metadata";
import { countyPath } from "../../data/counties";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ zip: string }> }): Promise<Metadata> {
  const { zip } = await params;
  if (!isValidZip(zip)) return pageMetadata("ZIP code not found", "Enter a valid Florida ZIP code.", `/lookup/${encodeURIComponent(zip)}`, { noindex: true });
  try {
    const result = getLookupResult(zip);
    if (!result) return pageMetadata("ZIP code not found", "This ZIP code is not in the current MoveIn pilot.", `/lookup/${zip}`, { noindex: true });
    const title = result.city ? `Utilities for ZIP Code ${zip} in ${result.city}, ${result.state}` : `Utilities for ZIP Code ${zip}`;
    const description = `Find possible electric, water, internet, trash, outage, and local service information for ZIP Code ${zip}${result.city ? ` in ${result.city}, ${result.stateName}` : ""}. Confirm availability by address.`;
    return pageMetadata(title, description, `/lookup/${zip}`, { noindex: !isZipResultIndexable(result), imageTitle: `Utilities for ${zip}${result.city ? ` · ${result.city}, FL` : ""}` });
  } catch {
    return pageMetadata(`Utilities for ZIP Code ${zip}`, "Florida utility lookup results.", `/lookup/${zip}`, { noindex: true });
  }
}

export default async function ZipResultPage({ params }: { params: Promise<{ zip: string }> }) {
  const { zip } = await params;
  if (!isValidZip(zip)) notFound();
  const result = getLookupResult(zip);
  if (!result) return <UnsupportedZip zip={zip} />;
  const relatedAreas = getRelatedAreas(result);
  const pageUrl = `${SITE_URL}/lookup/${zip}`;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": `${pageUrl}#webpage`, name: `Utilities for ZIP Code ${zip}${result.city ? ` in ${result.city}, Florida` : ""}`, url: pageUrl, description: result.disclaimer, dateModified: result.lastUpdated ?? undefined, about: ["Electric utilities", "Water and sewer service", "Internet availability", "Trash and recycling", "Local moving resources"], isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` } },
  ] };
  return <main id="main-content"><JsonLd data={schema} /><div className="shell result-page" data-analytics-county={result.county ?? undefined}><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Florida utilities", href: "/florida-utilities" }, { label: `${result.county} County`, href: countyPath(result.county) }, { label: `ZIP Code ${zip}` }]} /><LookupResults result={result} relatedAreas={relatedAreas} /><section className="search-again"><h2>Check another ZIP code</h2><ZipLookupForm compact /></section></div></main>;
}

function UnsupportedZip({ zip }: { zip: string }) {
  return <main id="main-content"><div className="shell unsupported-result"><span className="status-icon"><MapPin size={27} aria-hidden="true" /></span><span className="eyebrow">Coverage is still growing</span><h1>We don’t support this ZIP yet.</h1><p>That does not mean service is unavailable. It means MoveIn has not verified enough official information to publish a provider shortlist for {zip}.</p><p><strong>We’re expanding coverage every week.</strong> Request this ZIP to help us prioritize the next official-source review.</p><div className="unsupported-actions"><Link className="button" href={`/request-zip?zip=${zip}`}>Request this ZIP <ArrowRight size={17} aria-hidden="true" /></Link><Link href="/coverage">See current coverage</Link><Link href="/resources/utility-setup">Use the utility setup hub</Link></div><section><h2>Useful ways to continue</h2><ul><li>Check your city or county utility department for water, sewer, and trash.</li><li>Use the Florida Public Service Commission utility finder for regulated electric service.</li><li>Check internet availability using your complete address on the FCC National Broadband Map.</li></ul></section><div className="search-again"><h2>Try another ZIP code</h2><ZipLookupForm compact initialZip={zip} context="unsupported_zip" /></div></div></main>;
}
