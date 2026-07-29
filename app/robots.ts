import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: ["/", "/_next/", "/images/"], disallow: ["/api/", "/route-not-found", "/lookup?"] }, sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL };
}
