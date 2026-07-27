import { ArrowRight, CheckCircle2, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { Guide } from "../data/guides";
import { SITE_URL } from "../lib/metadata";
import { GuideVisual } from "./GuideVisual";
import { OfficialResource, RelatedGuideLink } from "./GuideActions";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";
import { Breadcrumbs, PageHero } from "./PageHero";

const categoryLabels = { checklists: "Checklists", homeowners: "Homeowners", renters: "Renters", florida: "Florida Guide" } as const;

export function GuidePage({ guide }: { guide: Guide }) {
  const path = `/${guide.category}/${guide.slug}`;
  const categoryPath = guide.category === "florida" ? "/florida" : `/${guide.category}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: categoryLabels[guide.category], item: `${SITE_URL}${categoryPath}` },
      { "@type": "ListItem", position: 3, name: guide.title, item: `${SITE_URL}${path}` },
    ],
  };
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    mainEntityOfPage: `${SITE_URL}${path}`,
    dateModified: "2026-07-27",
    datePublished: "2026-07-27",
    author: { "@type": "Organization", name: "MoveIn Editorial" },
    publisher: { "@type": "Organization", name: "MoveIn", url: SITE_URL },
  };
  const howTo = guide.category === "checklists" ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.description,
    step: guide.steps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: step.title, text: step.body })),
  } : null;
  const faq = guide.faq ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  } : null;

  return <main id="main-content">
    <JsonLd data={[breadcrumb, article, ...(howTo ? [howTo] : []), ...(faq ? [faq] : [])]} />
    <div className="shell breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: categoryLabels[guide.category], href: categoryPath }, { label: guide.title }]} /></div>
    <PageHero eyebrow={guide.eyebrow} title={guide.title} description={guide.description} />
    <article className="guide-article">
      <div className="shell guide-layout">
        <div className="guide-main">
          <section className="quick-answer" aria-labelledby="quick-answer-heading">
            <span><Icon name={guide.icon} size={24} /></span>
            <div><h2 id="quick-answer-heading">The short answer</h2><p>{guide.answer}</p></div>
          </section>
          <GuideVisual icon={guide.icon} title={guide.title} labels={guide.steps.slice(0, 3).map((step) => step.title)} />
          <section className="guide-steps" aria-labelledby="guide-steps-heading">
            <span className="kicker">Your practical plan</span>
            <h2 id="guide-steps-heading">Work through these steps</h2>
            <ol>{guide.steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol>
          </section>
          {guide.officialResources?.length ? <aside className="official-resources" aria-labelledby="official-resources-heading"><div><ShieldAlert size={22} aria-hidden="true" /><div><span className="kicker">Verify changing details</span><h2 id="official-resources-heading">Official resources</h2></div></div><p>Rules, forms, maps, and safety guidance can change. Use these primary sources for current information.</p><div>{guide.officialResources.map((resource) => <OfficialResource key={resource.href} {...resource} />)}</div></aside> : null}
          {guide.faq?.length ? <section className="guide-faq" aria-labelledby="faq-heading"><span className="kicker">Common questions</span><h2 id="faq-heading">Questions worth clarifying</h2>{guide.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section> : null}
        </div>
        <aside className="guide-sidebar" aria-label="Guide details and next steps">
          <div className="editorial-card"><span className="kicker">MoveIn Editorial</span><p><strong>Last reviewed:</strong> {guide.updated}</p><p>We favor official sources for changing rules and review guidance for clarity, usefulness, and unsupported claims.</p><a href="mailto:hello@movein.guide?subject=Correction%20for%20MoveIn%20guide"><Mail size={15} aria-hidden="true" /> Suggest a correction</a></div>
          <div className="next-step-card"><span className="kicker">Continue your plan</span><h2>Put this into your timeline.</h2><Link className="button" href={guide.timelineHref}>Open the relevant stage <ArrowRight size={17} aria-hidden="true" /></Link></div>
          <div className="related-card"><span className="kicker">Related guides</span><h2>Keep going</h2>{guide.related.map((link) => <RelatedGuideLink key={link.href} {...link} />)}</div>
        </aside>
      </div>
      <div className="shell guide-disclaimer"><CheckCircle2 size={18} aria-hidden="true" /><p>MoveIn provides general educational information. Verify property-specific, legal, financial, insurance, tax, safety, and construction decisions with the appropriate official source or qualified professional.</p></div>
    </article>
  </main>;
}
