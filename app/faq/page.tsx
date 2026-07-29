import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { faqItems } from "../data/site";
import { pageMetadata, SITE_URL } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Utility Lookup and Moving Questions", "Answers about finding electric, water, internet, trash, utility setup, address confirmation, privacy, sources, and MoveIn coverage.", "/faq");
const schema = { "@context": "https://schema.org", "@type": "FAQPage", url: `${SITE_URL}/faq`, mainEntity: faqItems.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
export default function FaqPage() { return <main id="main-content"><JsonLd data={schema} /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} /></div><PageHero eyebrow="FAQ" title="Straight answers about finding local services." description="ZIP codes are useful starting points, but the exact address decides many services." /><section className="section"><div className="shell faq-list">{faqItems.map(([question, answer]) => <details key={question} data-analytics-event="faq_interaction"><summary>{question}</summary><p>{answer}</p></details>)}</div></section></main>; }
