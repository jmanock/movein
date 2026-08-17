import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Camera, ClipboardCheck, FileText, KeyRound, ReceiptText, ShieldCheck, Wifi, Zap } from "lucide-react";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { JsonLd } from "../components/JsonLd";
import { RenterAnalytics } from "../components/RenterAnalytics";
import { ZipLookupForm } from "../components/ZipLookupForm";
import { guidesFor } from "../data/guides";
import { pageMetadata, SITE_URL } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Renter Move-In Guide, Costs, Utilities and Checklists", "Plan apartment move-in costs, utilities, internet, renters insurance, deposit records, condition photos, and free renter checklists.", "/renters");
const steps = [
  [ReceiptText, "Plan every move-in cost", "Separate rent, deposits, fees, utility starts, insurance, moving, pet, parking, and other confirmed charges.", "/renters/move-in-costs"],
  [Zap, "Confirm utility responsibility", "Read the lease and written property guidance before opening electricity, water, trash, or other accounts.", "/renters/what-utilities-do-renters-pay"],
  [Wifi, "Check Internet for the unit", "ZIP results are only a shortlist. Confirm availability, installation timing, and permission for the exact address.", "/renters/internet-installation"],
  [ShieldCheck, "Protect insurance and deposit records", "Understand general coverage terms, document condition, and keep receipts and notices privately.", "/renters/renters-insurance-and-deposits"],
  [Camera, "Photograph before unpacking", "Capture rooms, fixtures, appliances, existing damage, and any required condition form on time.", "/renters/what-to-photograph-before-moving-in"],
  [ClipboardCheck, "Finish with one checklist", "Put the remaining utility, access, address, safety, and first-week steps into My Move.", "/my-move"],
] as const;
const tools = [
  [Calculator, "Move-in cost calculator", "Create a private planning estimate.", "/renters/move-in-cost-calculator"],
  [FileText, "Expense planner", "Print planned and actual cost fields.", "/resources/printables/renter-move-in-expense-planner"],
  [Camera, "Condition checklist", "Print a room-by-room record.", "/resources/printables/renter-move-in-condition-checklist"],
  [KeyRound, "Free renter kit", "Open every renter tool in one place.", "/renters/free-move-in-kit"],
  [ClipboardCheck, "Address update checklist", "Track mail, government, financial, insurance, work, health, and household changes.", "/resources/change-your-address"],
] as const;

export default function RentersPage() {
  const renterGuides = guidesFor("renters");
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "MoveIn renter resources", description: metadata.description, url: `${SITE_URL}/renters`, hasPart: renterGuides.map((guide) => ({ "@type": "Article", name: guide.h1, url: `${SITE_URL}${guide.path}` })) };
  return <main id="main-content"><JsonLd data={schema} /><RenterAnalytics path="/renters" /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Renters" }]} /></div><PageHero eyebrow="Renter move-in guide" title="Your renter move-in, in the right order." description="Plan the costs, confirm what the lease covers, arrange exact-address services, and preserve the records that may matter later."><ZipLookupForm compact /></PageHero><section className="section"><div className="shell"><div className="section-heading"><span className="eyebrow">Six practical steps</span><h2>Move from questions to confirmed details.</h2><p>Use written lease and property information for obligations, official providers for service, and private storage for personal records.</p></div><ol className="renter-journey">{steps.map(([Icon, title, description, href], index) => <li key={href}><Link href={href}><span className="renter-step-icon"><Icon aria-hidden="true" /></span><small>Step {index + 1}</small><h3>{title}</h3><p>{description}</p><span>Open this step <ArrowRight size={15} aria-hidden="true" /></span></Link></li>)}</ol></div></section><section className="section subtle"><div className="shell"><div className="section-heading"><span className="eyebrow">Free renter tools</span><h2>Use the format that fits the task.</h2><p>No account, email gate, quote request, or personal-information form.</p></div><div className="renter-tool-grid">{tools.map(([Icon, title, description, href]) => <Link href={href} key={href}><Icon aria-hidden="true" /><h3>{title}</h3><p>{description}</p><span>Open tool <ArrowRight size={15} aria-hidden="true" /></span></Link>)}</div></div></section><section className="section"><div className="shell renter-before-signing"><div><span className="eyebrow">Still comparing rentals?</span><h2>Ask before the obligation begins.</h2><p>Confirm total move-in charges, recurring fees, included utilities, billing methods, insurance proof, condition-report procedure, parking, pets, and Internet installation rules in writing.</p></div><Link className="button" href="/renters/questions-before-signing-a-lease">Questions before signing <ArrowRight size={16} aria-hidden="true" /></Link></div></section></main>;
}
