import type { Metadata } from "next";

export const SITE_URL = "https://movein.guide";
export const SITE_NAME = "MoveIn";
export const DEFAULT_DESCRIPTION = "MoveIn helps homeowners and renters organize everything after getting the keys, including move-in checklists, timelines, Florida guides, maintenance tasks, and practical resources.";

export function pageMetadata(title: string, description: string, path = "/"): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  const fullTitle = title.includes("MoveIn") ? title : `${title} | MoveIn`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical },
    openGraph: { title: fullTitle, description, type: "website", url: canonical, siteName: SITE_NAME, images: [{ url: `${SITE_URL}/og.png`, width: 1732, height: 908, alt: "MoveIn — Everything after the keys." }] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [`${SITE_URL}/og.png`] },
  };
}
