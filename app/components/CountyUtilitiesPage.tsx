import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { countyResources } from "../data/local-resources";
import type { CountyProfile } from "../data/counties";
import { getCoverageResults, isZipResultIndexable } from "../lib/seo";
import { SITE_URL } from "../lib/metadata";
import { Breadcrumbs, PageHero } from "./PageHero";
import { JsonLd } from "./JsonLd";
import { LocalResourceCards } from "./LocalResourceCards";
import { RelatedGuides } from "./ContentTools";
import { SectionIntro } from "./Primitives";

const guidePaths = ["/resources/find-electric-company", "/resources/find-water-provider", "/resources/find-internet-providers", "/resources/find-trash-service", "/resources/when-to-transfer-utilities", "/resources/change-your-address"];

export function CountyUtilitiesPage({ county }: { county: CountyProfile }) {
  const results = getCoverageResults().filter((result) => result.county === county.name);
  const verified = results.filter(isZipResultIndexable);
  const pending = results.filter((result) => !isZipResultIndexable(result));
  const resources = Object.values(countyResources[county.name]);
  const pageUrl = `${SITE_URL}/${county.slug}`;
  const faqs = [
    { q: `How do I find my utility providers in ${county.name} County?`, a: "Start with a reviewed ZIP result, then confirm the complete street address through the official provider or territory link. ZIP codes do not define utility boundaries." },
    { q: `Does one electric company serve all of ${county.name} County?`, a: "No countywide assumption is safe. Municipal utilities, cooperatives, and investor-owned utilities can serve different areas, so use the listed territory and address tools." },
    { q: "Can internet availability be confirmed by ZIP code?", a: "No. Internet technology and availability can differ by building or unit. Use each provider's official address checker and the FCC National Broadband Map." },
  ];
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", name: `${county.name} County utility lookup`, url: pageUrl, description: county.description, hasPart: verified.map((result) => ({ "@type": "WebPage", name: `Utilities for ZIP Code ${result.zipCode}`, url: `${SITE_URL}/lookup/${result.zipCode}` })) },
    { "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Florida utilities", item: `${SITE_URL}/florida-utilities` }, { "@type": "ListItem", position: 3, name: `${county.name} County utilities`, item: pageUrl }] },
  ] };
  return <main id="main-content"><JsonLd data={schema} /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Florida utilities", href: "/florida-utilities" }, { label: `${county.name} County` }]} /></div><PageHero eyebrow="County utility guide" title={`${county.name} County utilities and moving resources`} description={county.description} /><section className="section"><div className="shell county-overview"><div><span className="eyebrow">Start with the property</span><h2>A county guide, not a countywide provider claim.</h2><p>{county.overview}</p><p>MoveIn currently tracks {results.length} ZIP records in {county.name} County: {verified.length} verified and indexable, with {pending.length} still in research.</p></div><aside><ShieldCheck size={26} aria-hidden="true" /><strong>Every provider still requires address confirmation.</strong><span>Official links and reviewed dates are shown on each ZIP result.</span></aside></div></section><section className="section subtle"><div className="shell"><SectionIntro eyebrow="Verified utility pages" title={`Browse reviewed ${county.name} County ZIP codes`} text="These pages meet the source, category, phone, action, and indexing checks." /><div className="county-zip-grid">{verified.map((result) => <Link href={`/lookup/${result.zipCode}`} key={result.zipCode}><MapPin size={18} aria-hidden="true" /><span><strong>{result.city}</strong><small>ZIP Code {result.zipCode}</small></span><ArrowRight size={16} aria-hidden="true" /></Link>)}</div>{pending.length ? <p className="county-pending"><strong>{pending.length} additional ZIPs are being researched:</strong> {pending.map((result) => result.zipCode).join(", ")}. These records remain noindex until complete.</p> : null}<Link className="text-link" href="/coverage">Compare all pilot coverage <ArrowRight size={16} aria-hidden="true" /></Link></div></section><section className="section"><div className="shell"><SectionIntro eyebrow="Official local help" title={`Government and emergency resources for ${county.name} County`} text="Use these official destinations for emergency planning, resident services, libraries, property information, and local jurisdiction questions." /><LocalResourceCards resources={resources} /></div></section><section className="section subtle"><div className="shell"><RelatedGuides paths={guidePaths} title="Utility and moving guides" /></div></section><section className="section"><div className="shell county-faq"><SectionIntro eyebrow="Common questions" title={`${county.name} County utility FAQ`} />{faqs.map((faq) => <details key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}</div></section></main>;
}
