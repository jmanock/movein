import { JsonLd } from "./JsonLd";
import { Breadcrumbs } from "./PageHero";
import { NextStep, OfficialResources, RelatedGuides, ReviewedDate } from "./ContentTools";
import type { Guide } from "../data/guides";
import { SITE_URL } from "../lib/metadata";

const hubNames = { homeowners: "Homeowners", renters: "Renters", resources: "Resources" } as const;

export function GuideArticle({ guide }: { guide: Guide }) {
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: guide.h1, description: guide.description, datePublished: guide.published, dateModified: guide.reviewed, mainEntityOfPage: `${SITE_URL}${guide.path}`, author: { "@type": "Organization", name: "MoveIn", url: SITE_URL }, publisher: { "@type": "Organization", name: "MoveIn", url: SITE_URL } };
  return <main id="main-content"><JsonLd data={schema} /><div className="shell content-page"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: hubNames[guide.section], href: `/${guide.section}` }, { label: guide.h1 }]} /><header className="article-header"><span className="eyebrow">{guide.eyebrow}</span><h1>{guide.h1}</h1><p className="direct-answer">{guide.directAnswer}</p><ReviewedDate published={guide.published} reviewed={guide.reviewed} /></header><article className="guide-article">{guide.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.steps ? <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol> : null}</section>)}</article><OfficialResources resources={guide.sources} /><RelatedGuides paths={guide.related} /><NextStep /><aside className="editorial-note"><p><strong>General information:</strong> Provider territories, requirements, contacts, and availability can change. Confirm the complete address with the official provider or government source. <a href={`/corrections`}>Report incorrect information</a>.</p></aside></div></main>;
}
