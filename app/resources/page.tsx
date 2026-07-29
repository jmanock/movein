import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, ExternalLink } from "lucide-react";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { SectionIntro } from "../components/Primitives";
import { guidesFor, type OfficialResource } from "../data/guides";
import { printables } from "../data/printables";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Moving and Utility Setup Resources", "Practical guides and printable tools for utility setup, provider lookup, address changes, outages, home safety, and renter responsibilities.", "/resources");
const resourceGuides = guidesFor("resources");
const official: OfficialResource[] = [
  { title: "Official USPS Change of Address", organization: "United States Postal Service", url: "https://moversguide.usps.com/", checked: "2026-07-29", note: "Submit mail forwarding directly with USPS." },
  { title: "National Broadband Map", organization: "Federal Communications Commission", url: "https://broadbandmap.fcc.gov/home", checked: "2026-07-29", note: "Check reported broadband availability by complete address." },
  { title: "Consumer Assistance", organization: "Florida Public Service Commission", url: "https://www.floridapsc.com/consumer-assistance", checked: "2026-07-29", note: "Florida utility consumer information and assistance." },
];
const groups = [
  ["Find a provider", resourceGuides.filter((g) => g.slug.startsWith("find-") || g.slug.includes("providers-vary") || g.slug.includes("jurisdiction"))],
  ["Set up service", resourceGuides.filter((g) => g.slug.includes("set-up") || g.slug.includes("transfer") || g.slug.includes("documents") || g.slug.includes("deposits"))],
  ["Understand the address", resourceGuides.filter((g) => g.slug.includes("mailing") || g.slug.includes("city-vs") || g.slug.includes("change-address"))],
] as const;

export default function ResourcesPage() { return <main id="main-content"><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources" }]} /></div><PageHero eyebrow="Practical library" title="Direct answers. Useful checklists. No filler." description="Start with the task in front of you, then continue to an official provider or government source when the address matters." /><section className="section"><div className="shell resource-columns">{groups.map(([title, guides]) => <section key={title}><h2>{title}</h2>{guides.map((guide) => <Link href={guide.path} key={guide.path}><span>{guide.h1}</span><ArrowRight size={15} /></Link>)}</section>)}</div></section><section className="section subtle"><div className="shell"><SectionIntro eyebrow="Print and use" title="Checklists that work away from the screen." text="Clean layouts, no sign-in, and no personal information sent to MoveIn." /><div className="printable-grid">{printables.map((item) => <Link href={`/resources/printables/${item.slug}`} key={item.slug}><Download size={21} aria-hidden="true" /><small>{item.audience}</small><h3>{item.title}</h3><p>{item.description}</p><span>Open printable <ArrowRight size={15} /></span></Link>)}</div></div></section><section className="section"><div className="shell"><SectionIntro eyebrow="Official tools" title="Go straight to the source." /><div className="official-tool-row">{official.map((item) => <a href={item.url} target="_blank" rel="noopener noreferrer" key={item.url}><small>{item.organization}</small><strong>{item.title}</strong><span>{item.note}</span><em>Open official site <ExternalLink size={14} /></em></a>)}</div></div></section></main>; }
