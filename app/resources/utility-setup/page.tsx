import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Droplets, FileCheck2, House, Recycle, Router, Search, Zap } from "lucide-react";
import { Breadcrumbs, PageHero } from "../../components/PageHero";
import { JsonLd } from "../../components/JsonLd";
import { AddToMyMoveButton } from "../../components/AddToMyMoveButton";
import { ContinueYourMove } from "../../components/ContinueYourMove";
import { ZipLookupForm } from "../../components/ZipLookupForm";
import { pageMetadata, SITE_URL } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Utility Setup Guide for a New Address", "Find electricity, water, internet, and trash providers; plan transfers; prepare documents; and follow renter or homeowner setup steps.", "/resources/utility-setup");

const services = [
  { title: "Find your electric company", text: "Identify possible electric territories, then confirm the service address.", href: "/resources/find-electric-company", icon: Zap },
  { title: "Find water and sewer", text: "Check city, county, authority, well, and septic possibilities separately.", href: "/resources/find-water-provider", icon: Droplets },
  { title: "Find internet providers", text: "Use address-level tools for reported providers and connection technology.", href: "/resources/find-internet-providers", icon: Router },
  { title: "Find trash and recycling", text: "Confirm whether the city, county, HOA, landlord, or hauler is responsible.", href: "/resources/find-trash-service", icon: Recycle },
];

const plans = [
  ["Learn when to transfer utilities", "Use the before-move, move-day, and after-move sequence.", "/resources/when-to-transfer-utilities"],
  ["Prepare utility setup documents", "Know what a provider may request and keep sensitive information private.", "/resources/utility-setup-documents"],
  ["Review deposits and account requirements", "Confirm deposits, refund terms, waivers, and official payment channels.", "/resources/utility-deposits"],
  ["Open the moving utility checklist", "Track service starts, installation appointments, confirmations, and first bills.", "/resources/moving-utility-checklist"],
  ["Transfer or switch Internet", "Check the new address, compare alternatives, and schedule activation before canceling old service.", "/internet/transfer-or-switch"],
  ["Change your address after moving", "Forward mail, then update government and household records directly.", "/resources/change-your-address"],
] as const;

export default function UtilitySetupPage() {
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", name: "Utility setup guide for a new address", url: `${SITE_URL}/resources/utility-setup`, description: "A task hub for finding, confirming, starting, and transferring essential household services.", hasPart: [...services, ...plans.map(([title, text, href]) => ({ title, text, href }))].map((item) => ({ "@type": "WebPage", name: item.title, url: `${SITE_URL}${item.href}` })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Resources", item: `${SITE_URL}/resources` }, { "@type": "ListItem", position: 3, name: "Utility setup", item: `${SITE_URL}/resources/utility-setup` }] },
  ] };
  return <main id="main-content"><JsonLd data={schema} /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Utility setup" }]} /></div><PageHero eyebrow="Utility setup hub" title="Set up the essential services in the right order." description="Find the possible provider, confirm the complete address, schedule service for the responsibility date, and keep account details private."><ZipLookupForm compact context="/resources/utility-setup" /><AddToMyMoveButton taskId="local-utilities" label="Add utility setup to My Move" sourcePage="/resources/utility-setup" /></PageHero><section className="section"><div className="shell"><div className="section-heading"><span className="eyebrow">Find each service</span><h2>Start with the address—not a provider guess.</h2><p>ZIP results narrow the search. Official provider and territory tools make the final address-level decision.</p></div><div className="utility-hub-services">{services.map(({ title, text, href, icon: Icon }) => <Link href={href} key={href}><Icon size={24} aria-hidden="true" /><h3>{title}</h3><p>{text}</p><strong>Open the guide <ArrowRight size={15} aria-hidden="true" /></strong></Link>)}</div></div></section><section className="section subtle"><div className="shell utility-hub-plan"><div><BookOpenCheck size={30} aria-hidden="true" /><span className="eyebrow">Plan the handoff</span><h2>Transfer, documents, deposits, and verification.</h2><p>Use only the steps you need. This hub organizes the work without rebuilding the retired timeline system.</p></div><div>{plans.map(([title, text, href]) => <Link href={href} key={href}><span><strong>{title}</strong><small>{text}</small></span><ArrowRight size={17} aria-hidden="true" /></Link>)}</div></div></section><section className="section"><div className="shell utility-audience-grid"><Link href="/homeowners/set-up-utilities"><House size={24} aria-hidden="true" /><span><small>Homeowners</small><strong>Set up household utilities and save outage contacts</strong></span><ArrowRight size={17} aria-hidden="true" /></Link><Link href="/renters/set-up-utilities"><FileCheck2 size={24} aria-hidden="true" /><span><small>Renters</small><strong>Review the lease before opening tenant accounts</strong></span><ArrowRight size={17} aria-hidden="true" /></Link><Link href="/#zip-lookup"><Search size={24} aria-hidden="true" /><span><small>Address starting point</small><strong>Find utility providers by ZIP code</strong></span><ArrowRight size={17} aria-hidden="true" /></Link></div><ContinueYourMove /></section></main>;
}
