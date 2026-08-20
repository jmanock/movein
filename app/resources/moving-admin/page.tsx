import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Building2, HeartPulse, Landmark, MailCheck, ShieldCheck, ShoppingBag } from "lucide-react";
import { AddAddressTasksToMyMoveButton } from "../../components/AddAddressTasksToMyMoveButton";
import { Breadcrumbs, PageHero } from "../../components/PageHero";
import { JsonLd } from "../../components/JsonLd";
import { ContinueYourMove } from "../../components/ContinueYourMove";
import { pageMetadata, SITE_URL } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Moving Admin Checklist and Address Change Hub", "Organize USPS forwarding, Florida records, banks, insurance, work, health care, subscriptions, household services, and printable address tools after moving.", "/resources/moving-admin");

const groups = [
  { category: "Services", icon: MailCheck, title: "Mail forwarding", text: "Submit forwarding only through the official USPS process, then update each sender directly.", href: "/resources/change-your-address" },
  { category: "Services", icon: ShoppingBag, title: "Utilities and household accounts", text: "Move Internet, change utilities, and update deliveries, subscriptions, memberships, veterinarian, and pet records.", href: "/resources/utility-setup" },
  { category: "Rental or home", icon: Landmark, title: "Government records", text: "Review Florida driver, vehicle, title, voter, tax, and applicable property records through official sources.", href: "/resources/change-your-address" },
  { category: "Rental or home", icon: Building2, title: "Money and insurance", text: "Update banks, cards, lenders, home or renters insurance, auto insurance, and retirement accounts.", href: "/resources/printables/address-update-checklist" },
  { category: "Planning", icon: BriefcaseBusiness, title: "Work and benefits", text: "Update employer payroll, benefits, professional registrations, and other applicable records.", href: "/my-move" },
  { category: "Planning", icon: HeartPulse, title: "Health and education", text: "Review health providers, pharmacy, health plan, school, childcare, and student records.", href: "/resources/printables/address-update-checklist" },
] as const;

const categories = ["Services", "Rental or home", "Planning"] as const;

export default function MovingAdminPage() {
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", name: "Moving admin checklist and address change hub", description: metadata.description, url: `${SITE_URL}/resources/moving-admin`, hasPart: groups.map((group) => ({ "@type": "WebPage", name: group.title, url: `${SITE_URL}${group.href}` })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Resources", item: `${SITE_URL}/resources` }, { "@type": "ListItem", position: 3, name: "Moving admin", item: `${SITE_URL}/resources/moving-admin` }] },
  ] };
  return <main id="main-content"><JsonLd data={schema} /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Moving admin" }]} /></div><PageHero eyebrow="Moving admin hub" title="Update the records that do not move with you." description="Start with official mail forwarding, then work through services, rental or home records, and planning tasks. No account, email, or street address is required."><AddAddressTasksToMyMoveButton sourcePage="/resources/moving-admin" /></PageHero><section className="section"><div className="shell"><div className="section-heading"><span className="eyebrow">One clear sequence</span><h2>Forward the mail. Then update each record directly.</h2><p>Forwarding helps eligible mail reach you; it does not change the address stored by another organization.</p></div><div className="moving-admin-categories">{categories.map((category) => <section key={category}><h2>{category}</h2><div className="moving-admin-grid">{groups.filter((group) => group.category === category).map(({ icon: Icon, title, text, href }) => <Link href={href} key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{text}</p><span>Open this task <ArrowRight size={15} aria-hidden="true" /></span></Link>)}</div></section>)}</div></div></section><section className="section subtle"><div className="shell"><div className="address-tool-row"><article><BadgeCheck aria-hidden="true" /><h2>Track progress online</h2><p>Use a browser-only checklist with no sign-in and no exact address field.</p><Link href="/resources/change-your-address#address-checklist">Start the checklist</Link></article><article><ShieldCheck aria-hidden="true" /><h2>Print a private copy</h2><p>Use the checklist or new-address sheet without submitting what you write.</p><Link href="/resources/printables/address-update-checklist">Browse address printables</Link></article></div><ContinueYourMove /></div></section></main>;
}
