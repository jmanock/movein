import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs, PageHero } from "../../../components/PageHero";
import { ContinueYourMove } from "../../../components/ContinueYourMove";
import { InternetAnalytics } from "../../../components/InternetAnalytics";
import { InternetProviderCard } from "../../../components/InternetProviderCard";
import { JsonLd } from "../../../components/JsonLd";
import { internetProviderBySlug, internetProviders, internetZipRelationships, technologyLabel } from "../../../data/internet";
import { pageMetadata, SITE_URL } from "../../../lib/metadata";

export function generateStaticParams() { return internetProviders.map((provider) => ({ slug: provider.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const provider = internetProviderBySlug.get((await params).slug);
  return provider ? pageMetadata(`${provider.providerName} Address Check and Moving Guide`, `Check ${provider.providerName} at a new address, review connection and installation considerations, and use the official transfer resource without promotional rankings.`, `/internet/providers/${provider.slug}`) : {};
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const provider = internetProviderBySlug.get((await params).slug); if (!provider) notFound();
  const zips = internetZipRelationships.filter((item) => item.provider === provider.id).map((item) => item.zip);
  const path = `/internet/providers/${provider.slug}`;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", name: `${provider.providerName} Internet availability and moving guide`, url: `${SITE_URL}${path}`, description: provider.notes, dateModified: provider.sourceCheckedAt },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Internet", item: `${SITE_URL}/internet` }, { "@type": "ListItem", position: 3, name: provider.providerName, item: `${SITE_URL}${path}` }] },
  ] };
  return <main id="main-content"><JsonLd data={schema} /><InternetAnalytics view="provider" provider={provider.slug} /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Internet", href: "/internet" }, { label: provider.providerName }]} /></div><PageHero eyebrow="Provider information" title={`${provider.providerName}: check the new address first.`} description={provider.notes} /><section className="section"><div className="shell provider-detail-layout"><InternetProviderCard sourcePage={path} provider={{ slug: provider.id, name: provider.providerName, technologyTypes: provider.technologyTypes.map(technologyLabel), technologyType: provider.technologyTypes.map(technologyLabel).join(" | "), addressCheckUrl: provider.availabilityCheckerUrl, movingOrTransferUrl: provider.movingOrTransferUrl, officialWebsite: provider.officialWebsite, coverageLabel: "Address check required", coverageNotes: `${zips.length} MoveIn ZIP relationships have market-level evidence; none proves service for a home.`, lastVerifiedAt: provider.sourceCheckedAt }} /><article className="prose"><h2>What MoveIn can confirm</h2><p>The provider has official market evidence relevant to parts of MoveIn’s Central Florida pilot. MoveIn cannot confirm an address, plan, speed, price, or installation without the provider’s current address result.</p><h2>Connection types to look for</h2><p>{provider.technologyTypes.map(technologyLabel).join(", ")}. The exact address result determines which—if any—is orderable.</p><h2>Moving with {provider.providerName}</h2><p>{provider.movingNote}</p><ol><li>Run the official availability check for the complete new address.</li><li>Confirm whether the current account and equipment can move.</li><li>Ask whether self-installation, delivery, or a technician is required.</li><li>Schedule the old and new service dates, then test the connection.</li><li>Return or exchange equipment only as the provider instructs.</li></ol><h2>Installation considerations</h2><p>{provider.installationNote}</p><h2>Official resources</h2><ul><li><a href={provider.availabilityCheckerUrl} target="_blank" rel="noopener noreferrer">Check {provider.providerName} at the new address <ExternalLink size={13} aria-hidden="true" /></a></li>{provider.movingOrTransferUrl ? <li><a href={provider.movingOrTransferUrl} target="_blank" rel="noopener noreferrer">Open official moving or transfer guidance <ExternalLink size={13} aria-hidden="true" /></a></li> : null}<li><a href={provider.sourceUrl} target="_blank" rel="noopener noreferrer">Review market evidence used by MoveIn <ExternalLink size={13} aria-hidden="true" /></a></li></ul><p><Link href="/internet/transfer-or-switch">Decide whether to transfer or switch Internet</Link></p><p><Link href="/internet/compare">Compare this provider with other possible options</Link></p><p><Link href="/resources/transfer-internet-when-moving">Use the complete Internet moving checklist</Link></p></article></div><ContinueYourMove /></section></main>;
}
