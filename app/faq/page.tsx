import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { ZipLookupForm } from "../components/ZipLookupForm";
import { faqItems } from "../data/site";
import { pageMetadata, SITE_URL } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Utility Lookup and Moving Questions", "Answers about finding electric, water, internet, trash, utility setup, address confirmation, privacy, sources, and MoveIn coverage.", "/faq");
const schema = { "@context": "https://schema.org", "@type": "FAQPage", url: `${SITE_URL}/faq`, mainEntity: faqItems.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
const groups = [
  { id: "finding-services", label: "Finding services", items: faqItems.slice(0, 6) },
  { id: "starting-service", label: "Starting service", items: faqItems.slice(6, 8) },
  { id: "trust-and-privacy", label: "Trust and privacy", items: faqItems.slice(8, 13) },
  { id: "coverage-and-corrections", label: "Coverage and corrections", items: faqItems.slice(13) },
];
export default function FaqPage() { return <main id="main-content"><JsonLd data={schema} /><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} /></div><PageHero eyebrow="FAQ" title="Straight answers about finding local services." description="ZIP codes are useful starting points, but the exact address decides many services." /><section className="section"><div className="shell faq-layout"><nav aria-label="FAQ categories"><span>Jump to</span>{groups.map((group) => <a href={`#${group.id}`} key={group.id}>{group.label}</a>)}</nav><div>{groups.map((group) => <section className="faq-group" id={group.id} key={group.id}><h2>{group.label}</h2><div className="faq-list">{group.items.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>)}</div></div></section><section className="section final-lookup"><div className="shell"><div><span className="eyebrow">Put the answer to work</span><h2>Find the official starting points for your ZIP.</h2><p>Review possible providers, outage contacts, and practical local resources.</p></div><ZipLookupForm compact context="faq_footer" /></div></section></main>; }
