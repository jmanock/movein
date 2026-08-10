import type { Metadata } from "next";
import { Breadcrumbs, PageHero } from "../../components/PageHero";
import { JsonLd } from "../../components/JsonLd";
import { InternetCompare } from "../../components/InternetCompare";
import { InternetAnalytics } from "../../components/InternetAnalytics";
import { pageMetadata, SITE_URL } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Compare Internet Options by ZIP Code", "Compare possible wired and wireless home Internet providers by connection type, official address checker, transfer option, and installation considerations.", "/internet/compare");
export default async function ComparePage({ searchParams }: { searchParams: Promise<{ zip?: string }> }) {
  const zip = (await searchParams).zip?.replace(/\D/g, "").slice(0, 5) ?? "";
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", name: "Compare Internet options by ZIP code", url: `${SITE_URL}/internet/compare`, description: metadata.description }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Internet", item: `${SITE_URL}/internet` }, { "@type": "ListItem", position: 3, name: "Compare", item: `${SITE_URL}/internet/compare` }] }] };
  return <main id="main-content"><JsonLd data={schema} /><InternetAnalytics view="compare" /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Internet", href: "/internet" }, { label: "Compare" }]} /></div><PageHero eyebrow="Neutral comparison" title="Compare Internet possibilities side by side." description="No ranking, account, email, promotional prices, or street-address collection. Every provider remains subject to its official address check." /><section className="section"><div className="shell"><InternetCompare initialZip={zip} /></div></section></main>;
}
