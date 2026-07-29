import type { MetadataRoute } from "next";
import { publicPages } from "./data/pages";
import { SITE_URL } from "./lib/metadata";
import { getIndexableZipResults } from "./lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = publicPages.map((page) => ({ url: new URL(page.path, SITE_URL).toString(), lastModified: new Date(page.lastModified), changeFrequency: page.changeFrequency, priority: page.priority }));
  const zips = getIndexableZipResults().map((result) => ({ url: `${SITE_URL}/lookup/${result.zipCode}`, lastModified: new Date(result.lastLocationReview!), changeFrequency: "monthly" as const, priority: .75 }));
  return [...pages, ...zips];
}
