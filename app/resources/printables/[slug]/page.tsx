import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/PageHero";
import { JsonLd } from "../../../components/JsonLd";
import { PrintButton } from "../../../components/PrintButton";
import { AddToMyMoveButton } from "../../../components/AddToMyMoveButton";
import { InteractiveChecklist } from "../../../components/InteractiveChecklist";
import { PrintableView } from "../../../components/RetentionAnalytics";
import { printableBySlug, printables } from "../../../data/printables";
import { pageMetadata, SITE_URL } from "../../../lib/metadata";

export function generateStaticParams() { return printables.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const item = printableBySlug.get((await params).slug); return item ? pageMetadata(item.title, item.description, `/resources/printables/${item.slug}`) : {}; }

export default async function PrintablePage({ params }: { params: Promise<{ slug: string }> }) {
  const item = printableBySlug.get((await params).slug); if (!item) notFound();
  const path = `/resources/printables/${item.slug}`;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", name: item.title, description: item.description, url: `${SITE_URL}${path}`, dateModified: item.reviewed, isPartOf: { "@type": "CollectionPage", name: "MoveIn printable resources", url: `${SITE_URL}/resources` } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Resources", item: `${SITE_URL}/resources` }, { "@type": "ListItem", position: 3, name: item.title, item: `${SITE_URL}${path}` }] },
  ] };
  return <main id="main-content" className="printable-page"><JsonLd data={schema} /><PrintableView slug={item.slug} /><div className="shell page-breadcrumb-wrap no-print"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Printables", href: "/resources/printables" }, { label: item.title }]} /></div><article className="shell printable-sheet"><header><span className="eyebrow">MoveIn · {item.audience}</span><h1>{item.title}</h1><p>{item.intro}</p><div className="printable-actions no-print"><PrintButton resourceSlug={item.slug} label="Print / Save as PDF" /><AddToMyMoveButton taskId={item.myMoveTaskId} label={item.myMoveLabel} sourcePage={path} /><span>Free · No email · Uses your browser’s print dialog</span></div><p className="printable-reviewed">Reviewed {formatDate(item.reviewed)}</p></header><InteractiveChecklist printable={item} /><div className={`printable-columns ${item.sections.some((section) => section.kind?.endsWith("table")) ? "printable-table-sections" : ""}`}>{item.sections.map((section) => <PrintableSection key={section.title} section={section} />)}</div><section className="printable-related no-print"><h2>Use this with</h2><div>{item.related.map((related) => related.href.startsWith("http") ? <a href={related.href} target="_blank" rel="noopener noreferrer" key={related.href}>{related.label} <ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a> : <Link href={related.href} key={related.href}>{related.label}</Link>)}<Link href="/my-move">Open My Move</Link></div></section><footer className="printable-footer"><strong>MoveIn.guide</strong><span>Confirm providers and property requirements directly. MoveIn is not a utility company, insurer, law firm, or government agency.</span></footer><p className="no-print printable-back"><Link href="/resources/printables">← Browse all printable tools</Link></p></article></main>;
}

function PrintableSection({ section }: { section: (typeof printables)[number]["sections"][number] }) {
  if (section.kind === "expense-table") return <section className="printable-table-section"><h2>{section.title}</h2><table><thead><tr><th scope="col">Expense</th><th scope="col">Planned</th><th scope="col">Actual</th><th scope="col">Paid</th><th scope="col">Due date</th></tr></thead><tbody>{section.items.map((entry) => <tr key={entry}><th scope="row">{entry}</th><td /><td /><td className="table-check" /><td /></tr>)}</tbody></table></section>;
  if (section.kind === "condition-table") return <section className="printable-table-section"><h2>{section.title}</h2><table><thead><tr><th scope="col">Item</th><th scope="col">Condition / notes</th><th scope="col">Photo taken</th><th scope="col">Reported</th></tr></thead><tbody>{section.items.map((entry) => <tr key={entry}><th scope="row">{entry}</th><td /><td className="table-check" /><td className="table-check" /></tr>)}</tbody></table></section>;
  return <section className={section.kind === "fields" ? "printable-fields" : undefined}><h2>{section.title}</h2><ul>{section.items.map((entry) => <li key={entry}><span aria-hidden="true" />{entry}</li>)}</ul></section>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
