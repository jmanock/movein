import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AddToMyMoveButton } from "../components/AddToMyMoveButton";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { InteractiveChecklist } from "../components/InteractiveChecklist";
import { JsonLd } from "../components/JsonLd";
import { FirstThirtyDaysView } from "../components/RetentionAnalytics";
import { PrintButton } from "../components/PrintButton";
import { printableBySlug } from "../data/printables";
import { pageMetadata, SITE_URL } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("First 30 Days After Moving", "Organize utilities, move-in day records, address updates, safety checks, renter or homeowner responsibilities, and first-month home records.", "/first-30-days");
const printable = printableBySlug.get("first-30-days-new-home")!;
const phases = [
  { title: "Before move-in", text: "Confirm responsibility dates, possible providers, installation access, insurance, and the first-night essentials.", links: [["Build My Move", "/my-move"], ["Set up utilities", "/resources/utility-setup"], ["Plan internet", "/resources/find-internet-providers"]] },
  { title: "Move-in day", text: "Confirm active services, document condition and visible meters, recognize critical controls, and save emergency contacts.", links: [["Move-in day utility guide", "/resources/utilities-before-move-in-day"], ["Home safety", "/homeowners/first-week-home-safety"], ["Renter condition photos", "/renters/document-move-in-condition"]] },
  { title: "First week", text: "Update important records, learn collection and property routines, and keep proof of service and condition privately.", links: [["Address updates", "/resources/change-your-address"], ["Homeowner first week", "/resources/homeowner-first-week-checklist"], ["Renter first week", "/resources/renter-first-week-checklist"]] },
  { title: "First month", text: "Create the emergency, inventory, appliance, filter, insurance, and maintenance records that will matter later.", links: [["Things people forget", "/resources/things-people-forget-when-moving"], ["Home records", "/homeowners/home-records-and-maintenance"], ["Browse printables", "/resources/printables"]] },
] as const;

export default function FirstThirtyDaysPage() {
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "CollectionPage", name: "First 30 days after moving", description: "A four-phase moving resource hub.", url: `${SITE_URL}/first-30-days`, hasPart: phases.map((phase) => ({ "@type": "WebPage", name: phase.title, url: `${SITE_URL}/first-30-days#${phase.title.toLowerCase().replaceAll(" ", "-")}` })) }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "First 30 Days", item: `${SITE_URL}/first-30-days` }] }] };
  return <main id="main-content"><JsonLd data={schema} /><FirstThirtyDaysView /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "First 30 Days" }]} /></div><PageHero eyebrow="A calm order of operations" title="Your first 30 days, organized." description="Start before the boxes arrive. Work through move-in day, the first week, and the first month without turning the move into one enormous list."><div className="hero-actions"><AddToMyMoveButton taskId="forgotten-items" label="Add this plan to My Move" sourcePage="/first-30-days" /><PrintButton resourceSlug="first-30-days-new-home" label="Print / Save as PDF" /></div></PageHero><section className="section"><div className="shell first-thirty-grid">{phases.map((phase, index) => <article id={phase.title.toLowerCase().replaceAll(" ", "-")} key={phase.title}><span>0{index + 1}</span><h2>{phase.title}</h2><p>{phase.text}</p><div>{phase.links.map(([label, href]) => <Link href={href} key={href}>{label} <ArrowRight size={14} aria-hidden="true" /></Link>)}</div></article>)}</div></section><section className="section subtle"><div className="shell"><InteractiveChecklist printable={printable} /></div></section><section className="section"><div className="shell resource-hub-callout"><div><span className="eyebrow">Free printable</span><h2>Take the complete first-month checklist offline.</h2><p>The printable is a meaningful standalone page with the full checklist, related resources, and no email gate.</p></div><Link className="button" href="/resources/printables/first-30-days-new-home">Open the printable <ArrowRight size={16} aria-hidden="true" /></Link></div></section></main>;
}
