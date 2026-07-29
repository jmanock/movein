import type { Metadata } from "next";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { OfficialResources, RelatedGuides } from "../components/ContentTools";
import { guidesFor, type OfficialResource } from "../data/guides";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Moving and Utility Setup Resources", "Practical guides and official tools for utility setup, provider lookup, address changes, outages, home safety, and renter responsibilities.", "/resources");
const resourceGuides = guidesFor("resources");
const official: OfficialResource[] = [
  { title: "Official USPS Change of Address", organization: "United States Postal Service", url: "https://moversguide.usps.com/", checked: "2026-07-29", note: "Submit mail forwarding directly with USPS." },
  { title: "National Broadband Map", organization: "Federal Communications Commission", url: "https://broadbandmap.fcc.gov/home", checked: "2026-07-29", note: "Check reported broadband availability by complete address." },
  { title: "Consumer Assistance", organization: "Florida Public Service Commission", url: "https://www.floridapsc.com/consumer-assistance", checked: "2026-07-29", note: "Florida utility consumer information and assistance." },
  { title: "Household Emergency Planning", organization: "Ready.gov", url: "https://www.ready.gov/plan", checked: "2026-07-29", note: "Federal household emergency-planning guidance." },
];
export default function ResourcesPage() { return <main id="main-content"><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources" }]} /></div><PageHero eyebrow="Moving resources" title="Useful utility and moving guidance—without the filler." description="Find practical steps first, then use official provider and government tools for property-specific decisions." /><section className="section"><div className="shell"><RelatedGuides paths={resourceGuides.map((guide) => guide.path)} title="Utility setup and moving guides" /></div></section><section className="section subtle"><div className="shell"><OfficialResources resources={official} /></div></section></main>; }
