import type { Metadata } from "next";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { MyMoveDashboard } from "../components/MyMoveDashboard";
import { JsonLd } from "../components/JsonLd";
import { pageMetadata, SITE_URL } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("My Move: A Private Moving Checklist", "Create a personalized homeowner or renter moving checklist saved only in your browser. No account, email, payment, or external sync required.", "/my-move");

export default function MyMovePage() {
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", name: "My Move personalized moving checklist", url: `${SITE_URL}/my-move`, description: "A private browser-saved moving checklist for homeowners and renters." }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "My Move", item: `${SITE_URL}/my-move` }] }] };
  return <main id="main-content"><JsonLd data={schema} /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Move" }]} /></div><PageHero eyebrow="No account. No email." title="Make the move feel manageable." description="Build a checklist around your date, Florida ZIP, and homeowner or renter responsibilities. Your progress stays in this browser." /><div className="shell my-move-page"><MyMoveDashboard /></div></main>;
}
