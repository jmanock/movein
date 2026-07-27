import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { ContentCard, PageHero } from "../components/PageHero";
import { legalPages, sectionPages } from "../data/site";
import { pageMetadata } from "../lib/metadata";

const validSections = [...Object.keys(sectionPages), ...Object.keys(legalPages)];
export function generateStaticParams() { return validSections.map((section) => ({ section })); }

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  if (section in sectionPages) {
    const page = sectionPages[section as keyof typeof sectionPages];
    const socialCards: Record<string, string> = { homeowners: "/og/homeowners", renters: "/og/renters", checklists: "/og/checklists" };
    return pageMetadata(page.title, page.description, `/${section}`, socialCards[section]);
  }
  if (section in legalPages) {
    const page = legalPages[section as keyof typeof legalPages];
    return pageMetadata(page.title, page.intro, `/${section}`);
  }
  notFound();
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (section in sectionPages) {
    const page = sectionPages[section as keyof typeof sectionPages];
    return <main id="main-content"><PageHero eyebrow={page.eyebrow} title={page.title} description={page.description}>{section === "contact" ? <a className="button" href="mailto:hello@movein.guide"><Mail size={17} aria-hidden="true" /> Email hello@movein.guide</a> : <Link className="button" href="/timeline">Start My Timeline <ArrowRight size={17} aria-hidden="true" /></Link>}</PageHero><section className="section-pad"><div className="shell content-grid">{page.cards.map((card) => <ContentCard key={card.title} title={card.title} description={card.description} href={"href" in card ? card.href : undefined} />)}</div></section></main>;
  }
  if (section in legalPages) {
    const page = legalPages[section as keyof typeof legalPages];
    return <main id="main-content"><PageHero eyebrow="MoveIn policies" title={page.title} description={page.intro} /><section className="section-pad"><article className="shell legal-copy">{page.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p><strong>Last updated:</strong> July 27, 2026</p></article></section></main>;
  }
  notFound();
}
