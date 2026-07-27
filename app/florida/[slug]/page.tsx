import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, ContentCard, PageHero } from "../../components/PageHero";
import { floridaGuides } from "../../data/site";
import { pageMetadata } from "../../lib/metadata";

const regionalExamples = [
  { slug: "miami", title: "Moving to Miami", description: "A focused starting point for utilities, storm planning, parking, and local routines in Miami." },
  { slug: "orange-county", title: "Moving to Orange County", description: "A focused starting point for county services, emergency information, utilities, and local routines." },
];

const allGuides = [...floridaGuides, ...regionalExamples];
export function generateStaticParams() { return allGuides.map((guide) => ({ slug: guide.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = allGuides.find((item) => item.slug === slug);
  return guide ? pageMetadata(`${guide.title} | Florida Guide`, guide.description, `/florida/${guide.slug}`) : {};
}

export default async function FloridaGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = allGuides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const topics = slug === "hurricane-prep" ? ["Know your evacuation zone", "Build a seven-day supply plan", "Protect insurance records", "Plan for pets and medications"] : slug === "homestead-exemption" ? ["Check ownership and residency requirements", "Find your county property appraiser", "Verify the filing deadline", "Keep confirmation records"] : ["What to handle first", "Records worth saving", "Local questions to ask", "When to use an official source"];
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://movein.guide/" }, { "@type": "ListItem", position: 2, name: "Florida Guide", item: "https://movein.guide/florida" }, { "@type": "ListItem", position: 3, name: guide.title, item: `https://movein.guide/florida/${guide.slug}` }] };
  return <main id="main-content"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><div className="shell breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Florida Guide", href: "/florida" }, { label: guide.title }]} /></div><PageHero eyebrow="Welcome Home Florida" title={guide.title} description={guide.description} /><section className="section-pad"><div className="shell reading-shell"><div className="content-grid two">{topics.map((topic) => <ContentCard key={topic} title={topic} description="Clear starting guidance, questions to ask, and records to keep as you settle in." />)}</div><aside className="professional-note"><p>Florida rules and services vary by county and change over time. Verify deadlines, eligibility, evacuation information, insurance coverage, and safety guidance with the appropriate official source or qualified professional.</p></aside></div></section></main>;
}
