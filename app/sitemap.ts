import type { MetadataRoute } from "next";
import { indexablePilotZips } from "./data/site";
import { SITE_URL } from "./lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-27");
  const pages = [
    ["", 1, "weekly"], ["homeowners", .8, "monthly"], ["renters", .8, "monthly"],
    ["learn-your-area", .85, "monthly"], ["resources", .7, "monthly"], ["faq", .7, "monthly"],
    ["data-sources", .55, "monthly"], ["corrections", .45, "yearly"], ["about", .45, "yearly"],
    ["contact", .35, "yearly"], ["privacy", .3, "yearly"], ["terms", .3, "yearly"],
    ["disclosure", .3, "yearly"], ["editorial-policy", .4, "yearly"],
  ] as const;
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${SITE_URL}/${path}`, lastModified, changeFrequency, priority })),
    ...indexablePilotZips.map((zip) => ({ url: `${SITE_URL}/lookup/${zip}`, lastModified, changeFrequency: "monthly" as const, priority: .75 })),
  ];
}
