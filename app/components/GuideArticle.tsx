import Image from "next/image";
import Link from "next/link";
import type { Guide } from "../data/guides";
import { countyProfiles } from "../data/counties";
import { SITE_URL } from "../lib/metadata";
import { AddAddressTasksToMyMoveButton } from "./AddAddressTasksToMyMoveButton";
import { AddToMyMoveButton } from "./AddToMyMoveButton";
import { AddressChangeProgress } from "./AddressChangeProgress";
import { ContinueYourMove } from "./ContinueYourMove";
import { NextStep, OfficialResources, RelatedGuides, ReviewedDate } from "./ContentTools";
import { DontForget } from "./DontForget";
import { InternetAnalytics } from "./InternetAnalytics";
import { JsonLd } from "./JsonLd";
import { MovingInternetChooser } from "./MovingInternetChooser";
import { Breadcrumbs } from "./PageHero";
import { ZipLookupForm } from "./ZipLookupForm";

const hubNames = { homeowners: "Homeowners", renters: "Renters", resources: "Resources" } as const;
const myMoveActions: Record<string, { taskId: string; label: string }> = {
  "/resources/find-internet-providers": { taskId: "internet", label: "Add internet setup to My Move" },
  "/resources/find-electric-company": { taskId: "electricity", label: "Add electric service to My Move" },
  "/resources/find-water-provider": { taskId: "water-sewer", label: "Add water service to My Move" },
  "/resources/when-to-transfer-utilities": { taskId: "utilities-transfer", label: "Add utility transfers to My Move" },
  "/resources/transfer-internet-when-moving": { taskId: "internet", label: "Add Internet transfer to My Move" },
  "/resources/change-your-address": { taskId: "address-updates", label: "Add address updates to My Move" },
  "/resources/things-people-forget-when-moving": { taskId: "forgotten-items", label: "Add forgotten-item review to My Move" },
  "/renters/renters-insurance-and-deposits": { taskId: "renter-financial-setup", label: "Add renter financial records to My Move" },
  "/renters/move-in-costs": { taskId: "renter-move-budget", label: "Add move-in budgeting to My Move" },
  "/renters/what-utilities-do-renters-pay": { taskId: "renter-lease-utilities", label: "Add lease utility review to My Move" },
  "/renters/set-up-utilities": { taskId: "renter-lease-utilities", label: "Add renter utility setup to My Move" },
  "/renters/document-move-in-condition": { taskId: "condition-photos", label: "Add move-in inspection to My Move" },
  "/renters/what-to-photograph-before-moving-in": { taskId: "condition-photos", label: "Add condition photos to My Move" },
  "/renters/questions-before-signing-a-lease": { taskId: "renter-lease-copy", label: "Add lease review to My Move" },
  "/renters/internet-installation": { taskId: "internet", label: "Add apartment internet setup to My Move" },
  "/homeowners/find-water-shutoff": { taskId: "water-shutoff", label: "Add water shutoff task to My Move" },
};

export function GuideArticle({ guide }: { guide: Guide }) {
  const myMoveAction = myMoveActions[guide.path];
  const internetGuide = ["/resources/find-internet-providers", "/resources/check-internet-availability", "/resources/fiber-internet-availability", "/resources/transfer-internet-when-moving", "/renters/internet-installation"].includes(guide.path);
  const addressGuide = guide.path === "/resources/change-your-address";
  const transferGuide = guide.path === "/resources/transfer-internet-when-moving";
  const continuationPage = addressGuide || internetGuide || guide.path === "/resources/when-to-transfer-utilities";
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: guide.h1, description: guide.description, datePublished: guide.published, dateModified: guide.reviewed, mainEntityOfPage: `${SITE_URL}${guide.path}`, author: { "@type": "Organization", name: "MoveIn", url: SITE_URL }, publisher: { "@type": "Organization", name: "MoveIn", url: SITE_URL } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: hubNames[guide.section], item: `${SITE_URL}/${guide.section}` }, { "@type": "ListItem", position: 3, name: guide.h1, item: `${SITE_URL}${guide.path}` }] },
    ...(guide.faqs?.length ? [{ "@type": "FAQPage", mainEntity: guide.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : []),
  ] };
  return <main id="main-content"><JsonLd data={schema} />{transferGuide ? <InternetAnalytics view="transfer" /> : null}<div className="shell content-page"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: hubNames[guide.section], href: `/${guide.section}` }, { label: guide.h1 }]} /><header className="article-header"><span className="eyebrow">{guide.eyebrow}</span><h1>{guide.h1}</h1><p className="direct-answer">{guide.directAnswer}</p>{addressGuide ? <div className="address-hero-actions"><Link className="button" href="#address-checklist">Start the address checklist</Link><AddAddressTasksToMyMoveButton sourcePage={guide.path} /></div> : myMoveAction ? <AddToMyMoveButton taskId={myMoveAction.taskId} label={myMoveAction.label} sourcePage={guide.path} /> : null}<ReviewedDate published={guide.published} reviewed={guide.reviewed} /></header>{internetGuide ? <nav className="internet-guide-actions" aria-label="Internet tools"><Link className="button" href="/internet/compare">Check Internet options by ZIP</Link><Link href="/internet/transfer-or-switch">Transfer or switch?</Link><Link href="/internet">Open the Internet hub</Link></nav> : null}{guide.image ? <figure className="guide-image"><Image src={guide.image.src} alt={guide.image.alt} width={guide.image.width} height={guide.image.height} sizes="(max-width: 760px) 100vw, 920px" quality={88} /></figure> : null}<article className="guide-article">{guide.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.steps ? <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol> : null}</section>)}</article>{transferGuide ? <MovingInternetChooser sourcePage={guide.path} /> : null}{addressGuide ? <AddressChangeProgress /> : null}{guide.faqs?.length ? <section className="guide-faq county-faq"><span className="eyebrow">Common questions</span><h2>Frequently asked questions</h2>{guide.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section> : null}<OfficialResources resources={guide.sources} sourcePage={guide.path} /><RelatedGuides paths={guide.related} />{addressGuide ? <nav className="address-admin-links" aria-label="Address administration tools"><Link href="/resources/moving-admin">Open the moving admin hub</Link><Link href="/resources/transfer-internet-when-moving">Move Internet service to the new address</Link><Link href="/resources/printables/address-update-checklist">Print the address checklist</Link><Link href="/resources/printables/new-address-information-sheet">Print a new-address information sheet</Link></nav> : null}{transferGuide ? <nav className="address-admin-links" aria-label="Internet moving next steps"><Link href="/resources/change-your-address">Update billing and other address records</Link><Link href="/first-30-days">Plan the first 30 days</Link><Link href="/my-move">Open My Move</Link></nav> : null}{continuationPage ? <ContinueYourMove /> : null}{guide.featuredZips?.length ? <section className="guide-featured-zips"><span className="eyebrow">Reviewed Florida examples</span><h2>Explore verified ZIP utility pages</h2><p>These are address-confirmation starting points, not ZIP-wide provider guarantees.</p><div>{guide.featuredZips.map((area) => <Link href={`/lookup/${area.zip}`} key={area.zip}><strong>{area.zip}</strong><span>{area.city}, Florida</span></Link>)}</div></section> : null}<DontForget sourcePage={guide.path} /><section className="guide-lookup"><div><span className="eyebrow">Address starting point</span><h2>Find utility providers by ZIP code</h2><p>Use the ZIP result as a shortlist, then confirm internet and every other service for the complete address.</p><Link className="text-link" href="/resources/utility-setup">Open the complete utility setup hub</Link></div><ZipLookupForm compact context={guide.path} /></section><section className="guide-county-links"><div className="section-heading compact"><span className="eyebrow">Central Florida coverage</span><h2>Continue to a county utility guide</h2></div><div>{countyProfiles.map((county) => <Link href={`/${county.slug}`} data-analytics-county={county.name} key={county.name}>{county.name} County utilities</Link>)}</div></section><NextStep href="/my-move" label="Open My Move" /><aside className="editorial-note"><p><strong>General information:</strong> Provider territories, requirements, contacts, and availability can change. Confirm the complete address with the official provider or government source. <a href="/corrections">Report incorrect information</a>.</p></aside></div></main>;
}
