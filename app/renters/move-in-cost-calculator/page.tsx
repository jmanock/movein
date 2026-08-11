import type { Metadata } from "next";
import Link from "next/link";
import { AddToMyMoveButton } from "../../components/AddToMyMoveButton";
import { JsonLd } from "../../components/JsonLd";
import { MoveInCostCalculator } from "../../components/MoveInCostCalculator";
import { Breadcrumbs, PageHero } from "../../components/PageHero";
import { pageMetadata, SITE_URL } from "../../lib/metadata";

const path = "/renters/move-in-cost-calculator";
export const metadata: Metadata = pageMetadata("Apartment Move-In Cost Calculator", "Estimate first rent, deposits, fees, utility starts, internet setup, moving costs, pet costs, parking, insurance, and other renter move-in expenses.", path);

export default function MoveInCostCalculatorPage() {
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", name: "Apartment Move-In Cost Calculator", description: metadata.description, url: `${SITE_URL}${path}`, dateModified: "2026-08-11" }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Renters", item: `${SITE_URL}/renters` }, { "@type": "ListItem", position: 3, name: "Move-in cost calculator", item: `${SITE_URL}${path}` }] }] };
  return <main id="main-content"><JsonLd data={schema} /><div className="shell page-breadcrumb-wrap no-print"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Renters", href: "/renters" }, { label: "Move-in cost calculator" }]} /></div><PageHero eyebrow="Free · No email" title="Estimate what you may need before move-in." description="Build a private planning total from the actual amounts supplied by the property, providers, insurer, and movers." /><section className="section calculator-section"><div className="shell"><MoveInCostCalculator /><div className="calculator-next no-print"><AddToMyMoveButton taskId="renter-move-budget" label="Add budgeting to My Move" sourcePage={path} /><Link href="/resources/printables/renter-move-in-expense-planner">Prefer paper? Open the blank expense planner</Link><Link href="/renters/move-in-costs">Read the complete move-in cost guide</Link></div></div></section></main>;
}
