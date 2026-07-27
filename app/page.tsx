import type { Metadata } from "next";
import { Homepage } from "./components/Homepage";
import { JsonLd } from "./components/JsonLd";
import { DEFAULT_DESCRIPTION, pageMetadata, SITE_URL } from "./lib/metadata";

export const metadata: Metadata = pageMetadata("MoveIn | New Home and Move-In Guides", DEFAULT_DESCRIPTION, "/");

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "MoveIn", url: SITE_URL, description: DEFAULT_DESCRIPTION },
    { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "MoveIn", url: SITE_URL, slogan: "Everything after the keys.", email: "hello@movein.guide" },
  ],
};

export default function HomePage() {
  return <><JsonLd data={structuredData} /><Homepage /></>;
}
