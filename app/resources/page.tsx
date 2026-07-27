import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Moving and Utility Resources", "Official resources for address changes, broadband, emergencies, home safety, renter help, and Florida services.", "/resources");
const groups = [
  ["Address and internet", [["USPS official change of address", "https://moversguide.usps.com/"], ["FCC National Broadband Map", "https://broadbandmap.fcc.gov/home"]]],
  ["Emergency and home safety", [["Florida Division of Emergency Management", "https://www.floridadisaster.org/"], ["Ready.gov household planning", "https://www.ready.gov/plan"], ["U.S. Consumer Product Safety Commission", "https://www.cpsc.gov/Safety-Education/Safety-Guides/Home"]]],
  ["Florida and consumer help", [["Florida Public Service Commission consumer assistance", "https://www.floridapsc.com/consumer-assistance"], ["Florida consumer protection", "https://www.fdacs.gov/Consumer-Resources"], ["FloridaHousingSearch renter resources", "https://www.floridahousingsearch.org/"]]],
] as const;
export default function ResourcesPage() { return <main id="main-content"><PageHero eyebrow="Official resources" title="Useful links, without the filler." description="These government and public-service resources help with common moving, utility, safety, and consumer questions." /><section className="section"><div className="shell resource-groups">{groups.map(([title, links]) => <section key={title}><h2>{title}</h2>{links.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noopener noreferrer"><span>{label}</span><ExternalLink size={17} aria-hidden="true" /></a>)}</section>)}</div></section></main>; }
