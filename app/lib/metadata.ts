import type { Metadata } from "next";

export const SITE_URL = "https://movein.guide";
export const SITE_NAME = "MoveIn";
export const DEFAULT_DESCRIPTION = "MoveIn helps homeowners and renters organize everything after getting the keys, including move-in checklists, timelines, Florida guides, maintenance tasks, and practical resources.";

export function pageMetadata(title: string, description: string, path = "/", imagePath = "/images/seo/movein-social-card.jpg"): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  const image = new URL(imagePath, SITE_URL).toString();
  const fullTitle = title.includes("MoveIn") ? title : `${title} | MoveIn`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical },
    openGraph: { title: fullTitle, description, type: "website", url: canonical, siteName: SITE_NAME, images: [{ url: image, width: 1200, height: 630, alt: `${fullTitle} — Everything after the keys.` }] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}
