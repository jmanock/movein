import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Printer } from "lucide-react";
import { Breadcrumbs, PageHero } from "../../components/PageHero";
import { JsonLd } from "../../components/JsonLd";
import { printables } from "../../data/printables";
import { pageMetadata, SITE_URL } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Free Moving Checklists and Printable Tools", "Use free, ungated moving checklists and fillable worksheets for utilities, address updates, renters, homeowners, emergency contacts, and the first 30 days.", "/resources/printables");

export default function PrintablesPage() {
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "CollectionPage", name: "Free MoveIn printable moving tools", url: `${SITE_URL}/resources/printables`, hasPart: printables.map((item) => ({ "@type": "WebPage", name: item.title, url: `${SITE_URL}/resources/printables/${item.slug}` })) }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Resources", item: `${SITE_URL}/resources` }, { "@type": "ListItem", position: 3, name: "Printables", item: `${SITE_URL}/resources/printables` }] }] };
  return <main id="main-content"><JsonLd data={schema} /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Printables" }]} /></div><PageHero eyebrow="Free · No email" title="Useful on screen. Clean on paper." description="Open a complete tool, check items off in this browser, or use Print / Save as PDF. No account, payment, or download gate." /><section className="section"><div className="shell printable-library">{printables.map((item) => <Link href={`/resources/printables/${item.slug}`} key={item.slug}><Printer size={21} aria-hidden="true" /><small>{item.audience}</small><h2>{item.title}</h2><p>{item.description}</p><span>Open the complete tool <ArrowRight size={15} aria-hidden="true" /></span></Link>)}</div></section><section className="section subtle"><div className="shell resource-hub-callout"><div><span className="eyebrow">Prefer a personalized list?</span><h2>Build My Move without creating an account.</h2><p>Add a move date, ZIP, and homeowner or renter path. Progress stays only in that browser.</p></div><Link className="button" href="/my-move">Open My Move <ArrowRight size={16} aria-hidden="true" /></Link></div></section></main>;
}
