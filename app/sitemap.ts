import type { MetadataRoute } from "next";
import { publicPages } from "./data/pages";
import { canonicalUrl } from "./lib/metadata";
import { getIndexableZipResults } from "./lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = publicPages.map((page) => ({ url: canonicalUrl(page.path), lastModified: new Date(page.lastModified), changeFrequency: page.changeFrequency, priority: page.priority }));
  const zips = getIndexableZipResults().map((result) => ({ url: canonicalUrl(`/lookup/${result.zipCode}`), lastModified: new Date(result.lastLocationReview!), changeFrequency: "monthly" as const, priority: .75 }));
  return [...pages, ...zips];
}
