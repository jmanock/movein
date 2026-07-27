import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { PageHero } from "../components/PageHero";
import { faqItems } from "../data/site";
import { pageMetadata, SITE_URL } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Utility Lookup FAQ", "Plain-language answers about finding electric, water, internet, trash, and other services by ZIP code.", "/faq");
const schema = { "@context": "https://schema.org", "@type": "FAQPage", url: `${SITE_URL}/faq`, mainEntity: faqItems.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
export default function FaqPage() { return <main id="main-content"><JsonLd data={schema} /><PageHero eyebrow="FAQ" title="Straight answers about finding local services." description="ZIP codes are useful starting points, but the exact address decides many services." /><section className="section"><div className="shell faq-list">{faqItems.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section></main>; }
