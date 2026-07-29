import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../components/PageHero";
import { LookupResults } from "../../components/LookupResults";
import { ZipLookupForm } from "../../components/ZipLookupForm";
import { getLookupResult, isValidZip } from "../../../db/lookup.ts";
import { pageMetadata } from "../../lib/metadata";
import { getRelatedAreas, isZipResultIndexable } from "../../lib/seo";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL } from "../../lib/metadata";

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
  if (!result) notFound();
  const relatedAreas = getRelatedAreas(result);
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: `Utilities for ZIP Code ${zip}${result.city ? ` in ${result.city}, Florida` : ""}`, url: `${SITE_URL}/lookup/${zip}`, description: result.disclaimer, dateModified: result.lastUpdated ?? undefined, about: ["Electric utilities", "Water and sewer service", "Internet availability", "Trash and recycling"] };
  return <main id="main-content"><JsonLd data={schema} /><div className="shell result-page"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn Your Area", href: "/learn-your-area" }, { label: `ZIP Code ${zip}` }]} /><LookupResults result={result} relatedAreas={relatedAreas} /><section className="search-again"><h2>Check another ZIP code</h2><ZipLookupForm compact /></section></div></main>;
}
