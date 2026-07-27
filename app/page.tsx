import { ClientHome } from "./ClientHome";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Welcome Home Florida",
  description: "Everything you need after getting the keys.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://welcomehomeflorida.com/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ClientHome />
    </>
  );
}
