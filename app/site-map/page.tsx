import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { guidesFor } from "../data/guides";
import { pageMetadata } from "../lib/metadata";
import { getIndexableZipResults } from "../lib/seo";

export const metadata: Metadata = pageMetadata("MoveIn HTML Sitemap", "Browse MoveIn utility lookup pages, homeowner and renter guides, official resources, verified ZIP pages, and policies.", "/site-map");
const groups = [
  ["Main pages", [["Home", "/"], ["Homeowners", "/homeowners"], ["Renters", "/renters"], ["Learn Your Area", "/learn-your-area"], ["Resources", "/resources"], ["FAQ", "/faq"]]],
  ["County utility guides", [["Central Florida utilities", "/florida-utilities"], ["Orange County utilities", "/orange-county-utilities"], ["Seminole County utilities", "/seminole-county-utilities"], ["Lake County utilities", "/lake-county-utilities"], ["Volusia County utilities", "/volusia-county-utilities"], ["Osceola County utilities", "/osceola-county-utilities"], ["Request a ZIP", "/request-zip"]]],
  ["Homeowner guides", guidesFor("homeowners").map((guide) => [guide.h1, guide.path])],
  ["Renter guides", guidesFor("renters").map((guide) => [guide.h1, guide.path])],
  ["Utility resources", guidesFor("resources").map((guide) => [guide.h1, guide.path])],
  ["Trust and policy", [["About MoveIn", "/about"], ["Data Sources", "/data-sources"], ["Editorial Policy", "/editorial-policy"], ["Corrections", "/corrections"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Disclosure", "/disclosure"]]],
] as const;
export default function SiteMapPage() { const zips = getIndexableZipResults(); return <main id="main-content"><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Site Map" }]} /></div><PageHero eyebrow="Browse MoveIn" title="MoveIn site map" description="Canonical public pages organized for people—not a copy of the XML sitemap." /><section className="section"><div className="shell sitemap-groups">{groups.map(([title, links]) => <section key={title}><h2>{title}</h2><ul>{links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul></section>)}<section><h2>Verified ZIP pages</h2><ul>{zips.map((result) => <li key={result.zipCode}><Link href={`/lookup/${result.zipCode}`}>Utilities for ZIP Code {result.zipCode} in {result.city}, Florida</Link></li>)}</ul></section></div></section></main>; }
