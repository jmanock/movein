import { guides } from "./guides.ts";
import { printables } from "./printables.ts";
import { countyProfiles } from "./counties.ts";

export type PublicPage = {
  path: string;
  title: string;
  description: string;
  h1: string;
  group: "main" | "trust" | "homeowners" | "renters" | "resources";
  lastModified: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

const staticPages: PublicPage[] = [
  { path: "/", title: "Find Utilities and Essential Services by ZIP Code", description: "Enter a Florida ZIP code to find possible electric, water, internet, trash, and other essential service providers, then confirm your exact address.", h1: "You have the keys. Now what?", group: "main", lastModified: "2026-08-01", changeFrequency: "weekly", priority: 1 },
  { path: "/homeowners", title: "Utility Setup and Moving Resources for Homeowners", description: "Learn how to set up electricity, water, internet, trash service, outage contacts, and other essentials after moving into a new home.", h1: "Set up the essentials. Learn the house.", group: "main", lastModified: "2026-08-01", changeFrequency: "monthly", priority: .85 },
  { path: "/renters", title: "Utility Setup and Move-In Resources for Renters", description: "Learn how to confirm included utilities, plan move-in costs, arrange internet, document condition, and protect insurance and deposit records.", h1: "Know what you set up—and what the lease covers.", group: "main", lastModified: "2026-08-07", changeFrequency: "monthly", priority: .85 },
  { path: "/learn-your-area", title: "Find Utilities and Local Services by ZIP Code", description: "Use a Florida ZIP code to find possible electric, water, sewer, internet, trash, outage, city, and county information.", h1: "Learn the services connected to your ZIP.", group: "main", lastModified: "2026-08-01", changeFrequency: "monthly", priority: .85 },
  { path: "/resources", title: "Moving and Utility Setup Resources", description: "Practical guides and free printable tools for utility setup, internet availability, provider lookup, address changes, outages, and renter responsibilities.", h1: "Direct answers. Useful checklists. No filler.", group: "main", lastModified: "2026-08-10", changeFrequency: "monthly", priority: .8 },
  { path: "/resources/utility-setup", title: "Utility Setup Guide for a New Address", description: "Find electricity, water, internet, and trash providers; plan transfers; prepare documents; and follow renter or homeowner setup steps.", h1: "Set up the essential services in the right order.", group: "resources", lastModified: "2026-08-07", changeFrequency: "monthly", priority: .8 },
  { path: "/faq", title: "Utility Lookup and Moving Questions", description: "Answers about finding electric, water, internet, trash, utility setup, address confirmation, privacy, sources, and MoveIn coverage.", h1: "Straight answers about finding local services.", group: "main", lastModified: "2026-07-29", changeFrequency: "monthly", priority: .7 },
  { path: "/coverage", title: "MoveIn Florida Utility Lookup Coverage", description: "See verified and research-stage ZIP codes across MoveIn's five-county Central Florida utility lookup pilot.", h1: "Small by design. Verified before it grows.", group: "main", lastModified: "2026-08-10", changeFrequency: "weekly", priority: .75 },
  { path: "/florida-utilities", title: "Florida Utility Lookup and Moving Resources", description: "Browse verified utility lookup pages and moving resources for MoveIn's five Central Florida pilot counties.", h1: "Find utilities and moving resources by county.", group: "main", lastModified: "2026-08-10", changeFrequency: "weekly", priority: .8 },
  { path: "/about", title: "About MoveIn", description: "How MoveIn helps homeowners and renters find possible essential-service providers using official sources and clear limitations.", h1: "A clearer starting point after you get the keys.", group: "trust", lastModified: "2026-07-29", changeFrequency: "yearly", priority: .45 },
  { path: "/data-sources", title: "Utility Data Sources and Method", description: "How MoveIn verifies utility records, stores source dates, handles ZIP-code limitations, and labels incomplete coverage.", h1: "Every result should lead back to an official source.", group: "trust", lastModified: "2026-07-29", changeFrequency: "monthly", priority: .55 },
  { path: "/editorial-policy", title: "Editorial and Data Policy", description: "How MoveIn researches, labels, verifies, reviews, and corrects utility records without paid provider rankings.", h1: "Editorial and data policy", group: "trust", lastModified: "2026-07-29", changeFrequency: "yearly", priority: .4 },
  { path: "/privacy", title: "Privacy", description: "How MoveIn handles ZIP searches, coverage requests, correction submissions, analytics, and personal information.", h1: "Privacy", group: "trust", lastModified: "2026-08-03", changeFrequency: "yearly", priority: .25 },
  { path: "/terms", title: "Terms", description: "Terms and limitations for using MoveIn utility lookup information and official provider links.", h1: "Terms", group: "trust", lastModified: "2026-07-27", changeFrequency: "yearly", priority: .2 },
  { path: "/disclosure", title: "Disclosure", description: "MoveIn affiliation, commercial, provider-ranking, and editorial disclosure.", h1: "Disclosure", group: "trust", lastModified: "2026-07-29", changeFrequency: "yearly", priority: .2 },
  { path: "/site-map", title: "MoveIn HTML Sitemap", description: "Browse MoveIn utility lookup pages, homeowner and renter guides, official resources, verified ZIP pages, and policies.", h1: "MoveIn site map", group: "trust", lastModified: "2026-07-29", changeFrequency: "monthly", priority: .35 },
];

const countyPages: PublicPage[] = countyProfiles.map((county) => ({ path: `/${county.slug}`, title: `${county.name} County Utilities and Moving Resources`, description: county.description, h1: `${county.name} County utilities and moving resources`, group: "main", lastModified: "2026-08-10", changeFrequency: "weekly", priority: .78 }));

export const publicPages: PublicPage[] = [...staticPages, ...countyPages, ...guides.map((guide) => ({ path: guide.path, title: guide.title, description: guide.description, h1: guide.h1, group: guide.section, lastModified: guide.reviewed, changeFrequency: "monthly" as const, priority: .7 })), ...printables.map((item) => ({ path: `/resources/printables/${item.slug}`, title: item.title, description: item.description, h1: item.title, group: "resources" as const, lastModified: item.reviewed, changeFrequency: "monthly" as const, priority: .65 }))];
