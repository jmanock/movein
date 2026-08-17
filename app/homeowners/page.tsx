import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { JsonLd } from "../components/JsonLd";
import { RelatedGuides } from "../components/ContentTools";
import { ZipLookupForm } from "../components/ZipLookupForm";
import { guidesFor } from "../data/guides";
import { pageMetadata, SITE_URL } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Utility Setup and Moving Resources for Homeowners", "Learn how to set up electricity, water, internet, trash service, outage contacts, and other essentials after moving into a new home.", "/homeowners");
const homeownerGuides = guidesFor("homeowners");
const services = [
  ["Electricity", "Confirm the provider, start date, outage number, and official outage map.", "/resources/find-electric-company"],
  ["Water and sewer", "Confirm both services separately and identify whether a well or septic system applies.", "/resources/find-water-provider"],
  ["Internet", "Check the complete address and plan any installation access.", "/resources/find-internet-providers"],
  ["Trash and recycling", "Verify city, county, HOA, or private collection responsibility.", "/resources/find-trash-service"],
  ["Address changes", "Forward mail, then update government, financial, insurance, work, health, and household records.", "/resources/change-your-address"],
] as const;

export default function HomeownersPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "MoveIn homeowner resources", url: `${SITE_URL}/homeowners`, hasPart: homeownerGuides.map((guide) => ({ "@type": "Article", name: guide.h1, url: `${SITE_URL}${guide.path}` })) };
  return <main id="main-content"><JsonLd data={schema} /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Homeowners" }]} /></div><PageHero eyebrow="Homeowners" title="Set up the essentials. Learn the house." description="A practical homeowner hub for utility setup, outage preparation, basic safety, records, and local information."><ZipLookupForm compact /></PageHero><section className="section"><div className="shell"><div className="section-heading"><span className="eyebrow">Start here</span><h2>Open the right accounts for the exact address.</h2><p>Use your ZIP code to identify official starting points. Confirm every provider before scheduling service or paying a deposit.</p></div><div className="topic-link-grid">{services.map(([title, description, href]) => <Link href={href} key={href}><h3>{title}</h3><p>{description}</p><span>Review {title.toLowerCase()} guidance <ArrowRight size={15} aria-hidden="true" /></span></Link>)}</div></div></section><section className="section subtle"><div className="shell guide-groups"><section><h2>Basic home safety</h2><ul><li>Locate the homeowner-accessible water shutoff and electrical panel.</li><li>Test smoke and carbon-monoxide alarms.</li><li>Do not open sealed utility equipment or approach downed lines.</li></ul></section><section><h2>Important records</h2><ul><li>Keep closing, inspection, insurance, warranty, and utility records together.</li><li>Save account start confirmations and emergency contacts privately.</li><li>Record model numbers and service history for major equipment.</li></ul></section><section><h2>Useful next steps</h2><ul><li>Confirm internet installation timing and property access.</li><li>Save city and county non-emergency contacts.</li><li>Turn inspection findings into a prioritized maintenance list.</li></ul></section></div></section><section className="section"><div className="shell"><RelatedGuides paths={homeownerGuides.map((guide) => guide.path)} title="Homeowner guides" /></div></section></main>;
}
