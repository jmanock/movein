import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Camera, ClipboardCheck, FileCheck, FileText, MapPinCheck, Search, Wifi } from "lucide-react";
import { Breadcrumbs, PageHero } from "../../components/PageHero";
import { JsonLd } from "../../components/JsonLd";
import { RenterAnalytics } from "../../components/RenterAnalytics";
import { pageMetadata, SITE_URL } from "../../lib/metadata";

const path = "/renters/free-move-in-kit";
export const metadata: Metadata = pageMetadata("Free Renter Move-In Kit", "Use a free apartment move-in calculator, expense planner, condition checklist, utility guides, internet tools, and private My Move checklist without an email gate.", path);
const tools = [
  [Calculator, "Estimate move-in costs", "Add only the written rent, deposit, fee, utility, insurance, and moving amounts that apply.", "/renters/move-in-cost-calculator"],
  [FileText, "Plan expenses on paper", "Print a blank planned-versus-actual expense worksheet with paid and due-date fields.", "/resources/printables/renter-move-in-expense-planner"],
  [Camera, "Document condition", "Print a room-by-room condition and photo checklist before unpacking.", "/resources/printables/renter-move-in-condition-checklist"],
  [ClipboardCheck, "Build My Move", "Create a renter checklist saved only in this browser—no account or email.", "/my-move"],
  [Wifi, "Compare Internet possibilities", "Start with a ZIP shortlist, then check every provider for the exact unit address.", "/internet/compare"],
  [Search, "Find possible utilities", "Use MoveIn’s reviewed Central Florida coverage, then confirm the complete address.", "/#zip-lookup"],
  [FileCheck, "Utility setup checklist", "Print the service dates, transfers, provider checks, and move-in-day utility steps.", "/resources/printables/utility-setup-checklist"],
  [MapPinCheck, "Address update checklist", "Work through government, financial, insurance, work, health, and household address records.", "/resources/printables/address-update-checklist"],
  [Wifi, "Internet setup checklist", "Plan the exact-address check, equipment, access, installation, and saved support details.", "/resources/printables/internet-setup-checklist"],
] as const;

export default function FreeRenterKitPage() {
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "CollectionPage", name: "Free Renter Move-In Kit", description: metadata.description, url: `${SITE_URL}${path}`, hasPart: tools.map(([, name, description, href]) => ({ "@type": "WebPage", name, description, url: `${SITE_URL}${href}` })) }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Renters", item: `${SITE_URL}/renters` }, { "@type": "ListItem", position: 3, name: "Free move-in kit", item: `${SITE_URL}${path}` }] }] };
  return <main id="main-content"><JsonLd data={schema} /><RenterAnalytics path={path} /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Renters", href: "/renters" }, { label: "Free move-in kit" }]} /></div><PageHero eyebrow="Free · Private · Ungated" title="A free renter kit you can actually use." description="Plan the money, utilities, Internet, records, and move-in condition without giving MoveIn an email address." /><section className="section"><div className="shell renter-kit-grid">{tools.map(([Icon, title, description, href], index) => <Link href={href} key={href}><Icon aria-hidden="true" /><small>Tool {index + 1}</small><h2>{title}</h2><p>{description}</p><span>Open tool <ArrowRight size={15} aria-hidden="true" /></span></Link>)}</div></section><section className="section subtle"><div className="shell renter-kit-guides"><div><span className="eyebrow">Before you sign</span><h2>Questions first. Commitments second.</h2><p>Clarify utilities, insurance proof, deposits, fees, condition reporting, access, and Internet installation before relying on an assumption.</p></div><div><Link href="/renters/questions-before-signing-a-lease">Questions before signing a lease</Link><Link href="/renters/renters-insurance-and-deposits">Insurance and deposit records</Link><Link href="/renters/what-utilities-do-renters-pay">What utilities do renters pay?</Link><Link href="/renters/what-to-photograph-before-moving-in">What to photograph before moving in</Link></div></div></section></main>;
}
