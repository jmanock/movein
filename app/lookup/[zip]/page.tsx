import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../components/PageHero";
import { LookupResults } from "../../components/LookupResults";
import { ZipLookupForm } from "../../components/ZipLookupForm";
import { getLookupResult, isValidZip } from "../../../db/lookup.ts";
import { pageMetadata } from "../../lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ zip: string }> }): Promise<Metadata> {
  const { zip } = await params;
  if (!isValidZip(zip)) return pageMetadata("ZIP code not found", "Enter a valid Florida ZIP code.", `/lookup/${encodeURIComponent(zip)}`, { noindex: true });
  try {
    const result = getLookupResult(zip);
    if (!result) return pageMetadata("ZIP code not found", "This ZIP code is not in the current MoveIn pilot.", `/lookup/${zip}`, { noindex: true });
    const title = result.city ? `Utilities for ZIP Code ${zip} in ${result.city}, ${result.state}` : `Utilities for ZIP Code ${zip}`;
    const description = `Find electric, water, internet, trash, and official local service information for ZIP Code ${zip}${result.city ? ` in ${result.city}, ${result.stateName}` : ""}. Confirm availability by address.`;
    return pageMetadata(title, description, `/lookup/${zip}`, { noindex: !result.isIndexable || result.status !== "verified" });
  } catch {
    return pageMetadata(`Utilities for ZIP Code ${zip}`, "Florida utility lookup results.", `/lookup/${zip}`, { noindex: true });
  }
}

export default async function ZipResultPage({ params }: { params: Promise<{ zip: string }> }) {
  const { zip } = await params;
  if (!isValidZip(zip)) notFound();
  const result = getLookupResult(zip);
  if (!result) notFound();
  return <main id="main-content"><div className="shell result-page"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn Your Area", href: "/learn-your-area" }, { label: `ZIP Code ${zip}` }]} /><LookupResults result={result} /><section className="search-again"><h2>Check another ZIP code</h2><ZipLookupForm compact /></section></div></main>;
}
