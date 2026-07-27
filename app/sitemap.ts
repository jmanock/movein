import type { MetadataRoute } from "next";
import { floridaGuides, legalPages, sectionPages } from "./data/site";
import { timelineStages } from "./data/timeline";
import { SITE_URL } from "./lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "timeline", ...timelineStages.map((stage) => `timeline/${stage.slug}`), "florida", ...floridaGuides.map((guide) => `florida/${guide.slug}`), ...Object.keys(sectionPages), ...Object.keys(legalPages)];
  return paths.map((path) => ({ url: `${SITE_URL}/${path}`, lastModified: new Date("2026-07-27"), changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : path === "timeline" || path === "florida" ? .9 : .7 }));
}
