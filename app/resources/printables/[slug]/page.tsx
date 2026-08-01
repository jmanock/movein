import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/PageHero";
import { PrintButton } from "../../../components/PrintButton";
import { printableBySlug, printables } from "../../../data/printables";
import { pageMetadata } from "../../../lib/metadata";

export function generateStaticParams() { return printables.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const item = printableBySlug.get((await params).slug); return item ? pageMetadata(item.title, item.description, `/resources/printables/${item.slug}`) : {}; }

export default async function PrintablePage({ params }: { params: Promise<{ slug: string }> }) {
  const item = printableBySlug.get((await params).slug); if (!item) notFound();
  return <main id="main-content" className="printable-page"><div className="shell page-breadcrumb-wrap no-print"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: item.title }]} /></div><article className="shell printable-sheet"><header><span className="eyebrow">MoveIn · {item.audience}</span><h1>{item.title}</h1><p>{item.intro}</p><PrintButton resourceSlug={item.slug} /></header><div className="printable-columns">{item.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><ul>{section.items.map((entry) => <li key={entry}><span aria-hidden="true" />{entry}</li>)}</ul></section>)}</div><footer className="printable-footer"><strong>MoveIn.guide</strong><span>Confirm providers for the exact address. MoveIn is not a utility company or government agency.</span></footer><p className="no-print printable-back"><Link href="/resources">← Back to resources</Link></p></article></main>;
}
