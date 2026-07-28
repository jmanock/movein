import type { Metadata } from "next";

export const SITE_URL = "https://movein.guide";
export const SITE_NAME = "MoveIn";
export const DEFAULT_DESCRIPTION = "Enter a Florida ZIP code to find possible electric, water, internet, trash, and other essential service providers, then confirm your exact address.";

export function pageMetadata(title: string, description: string, path = "/", options: { noindex?: boolean } = {}): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  const fullTitle = title.includes("MoveIn") ? title : `${title} | MoveIn`;
  const image = new URL("/images/seo/movein-social-card-v2.png", SITE_URL).toString();
  return {
    title: { absolute: fullTitle }, description, alternates: { canonical },
    robots: options.noindex ? { index: false, follow: true } : undefined,
    openGraph: { title: fullTitle, description, type: "website", url: canonical, siteName: SITE_NAME, images: [{ url: image, width: 1200, height: 630, alt: "MoveIn — Find essential services for your new place." }] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}
