import type { MetadataRoute } from "next";
import { guides } from "./data/guides";
import { legalPages, sectionPages } from "./data/site";
import { timelineStages } from "./data/timeline";
import { SITE_URL } from "./lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const reviewed = new Date("2026-07-27");
  const entries: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "timeline", changeFrequency: "monthly", priority: .9 },
    ...timelineStages.map((stage) => ({ path: `timeline/${stage.slug}`, changeFrequency: "monthly" as const, priority: .75 })),
    { path: "homeowners", changeFrequency: "weekly", priority: .9 },
    { path: "renters", changeFrequency: "weekly", priority: .85 },
    { path: "checklists", changeFrequency: "weekly", priority: .9 },
    { path: "florida", changeFrequency: "weekly", priority: .95 },
    ...guides.map((guide) => ({ path: `${guide.category}/${guide.slug}`, changeFrequency: guide.category === "florida" ? "monthly" as const : "yearly" as const, priority: guide.category === "florida" ? .82 : .8 })),
    ...Object.keys(sectionPages).filter((path) => !["homeowners", "renters", "checklists"].includes(path)).map((path) => ({ path, changeFrequency: "monthly" as const, priority: path === "resources" || path === "about" ? .65 : .55 })),
    ...Object.keys(legalPages).map((path) => ({ path, changeFrequency: "yearly" as const, priority: .35 })),
  ];
  return entries.map(({ path, ...entry }) => ({ url: `${SITE_URL}/${path}`, lastModified: reviewed, ...entry }));
}
