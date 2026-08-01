import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, ClipboardCheck, House, MapPinned, SearchCheck } from "lucide-react";
import { Icon } from "./components/Icon";
import { JsonLd } from "./components/JsonLd";
import { SectionIntro, TrustStrip } from "./components/Primitives";
import { ZipLookupForm } from "./components/ZipLookupForm";
import { pilotCounties, serviceTypes } from "./data/site";
import { DEFAULT_DESCRIPTION, pageMetadata, SITE_URL } from "./lib/metadata";
import { getIndexableZipResults } from "./lib/seo";

export const metadata: Metadata = pageMetadata("Find Utilities and Essential Services by ZIP Code", DEFAULT_DESCRIPTION, "/");
const structuredData = { "@context": "https://schema.org", "@graph": [
  { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "MoveIn", url: SITE_URL, description: DEFAULT_DESCRIPTION, potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/lookup?zip={search_term_string}` }, "query-input": "required name=search_term_string" } },
  { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "MoveIn", url: SITE_URL, slogan: "Everything after the keys.", email: "hello@movein.guide" },
] };
const resources = [
  ["Set up utilities", "A plain-language order of operations for a new address.", "/resources/set-up-utilities"],
  ["Find your electric company", "Use territory tools and confirm the complete address.", "/resources/find-electric-company"],
  ["Confirm water and sewer", "Understand city, county, private, well, and septic possibilities.", "/resources/find-water-provider"],
  ["Print a utility checklist", "Keep the essentials visible without creating an account.", "/resources/printables/utility-setup-checklist"],
] as const;

export default function HomePage() {
  const covered = getIndexableZipResults();
  return <main id="main-content"><JsonLd data={structuredData} />
    <section className="lookup-hero" id="zip-lookup"><div className="shell hero-layout"><div className="hero-copy"><span className="eyebrow">The first calm step after the keys</span><h1>You have the keys.<br />Now what?</h1><p>Find possible utility and local-service providers for your Florida ZIP, then confirm the exact address at the official source.</p><ZipLookupForm context="homepage_hero" /><TrustStrip /></div><figure className="hero-visual"><Image src="/images/homepage/movein-entryway-v2.webp" alt="A bright home entryway with moving boxes, ready for move-in" width={1600} height={880} sizes="(max-width: 760px) 100vw, 48vw" quality={88} priority /><figcaption><CheckCircle2 size={17} aria-hidden="true" /><span>Built for the practical questions that begin after move-in day.</span></figcaption></figure></div></section>
    <section className="service-ribbon" aria-label="Services covered"><div className="shell">{serviceTypes.map((service) => <span key={service.slug}><Icon name={service.icon} size={17} />{service.name}</span>)}</div></section>
    <section className="section"><div className="shell"><SectionIntro eyebrow="How MoveIn works" title="A useful shortlist. A clear next step." text="ZIP codes are a starting point. We show what is known, label what can vary, and link to official address checks." /><ol className="process-line"><li><SearchCheck aria-hidden="true" /><span>1</span><div><h3>Enter one ZIP</h3><p>No account, email, or personal details.</p></div></li><li><MapPinned aria-hidden="true" /><span>2</span><div><h3>See possible providers</h3><p>Coverage and confidence are labeled plainly.</p></div></li><li><ClipboardCheck aria-hidden="true" /><span>3</span><div><h3>Confirm the address</h3><p>Continue to the official provider or territory tool.</p></div></li></ol></div></section>
    <section className="section subtle"><div className="shell"><SectionIntro eyebrow="Choose your path" title="Start with the situation you are in." text="Focused hubs keep homeowner and renter responsibilities separate." /><div className="pathway-grid"><Link href="/homeowners"><span className="pathway-icon"><House aria-hidden="true" /></span><div><small>Homeowners</small><h3>Set up the house</h3><p>Utilities, shutoffs, outage contacts, safety, and first-week records.</p><span>Open homeowner hub <ArrowRight size={16} /></span></div></Link><Link href="/renters"><span className="pathway-icon coral"><Building2 aria-hidden="true" /></span><div><small>Renters</small><h3>Know the lease</h3><p>Included utilities, tenant accounts, installation rules, and move-in records.</p><span>Open renter hub <ArrowRight size={16} /></span></div></Link><Link href="/learn-your-area"><span className="pathway-icon aqua"><MapPinned aria-hidden="true" /></span><div><small>Local lookup</small><h3>Learn your area</h3><p>Understand electric, water, internet, trash, and jurisdiction starting points.</p><span>Explore local services <ArrowRight size={16} /></span></div></Link><Link href="/resources"><span className="pathway-icon gold"><ClipboardCheck aria-hidden="true" /></span><div><small>Practical library</small><h3>Use a checklist</h3><p>Direct answers and printable tools for the next task on your list.</p><span>Browse resources <ArrowRight size={16} /></span></div></Link></div></div></section>
    <section className="section"><div className="shell"><SectionIntro eyebrow="Popular resources" title="Answers built for the moment you need them." action={{ href: "/resources", label: "Browse all resources" }} /><div className="editorial-list">{resources.map(([title, text, href], index) => <Link href={href} key={href}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight aria-hidden="true" /></Link>)}</div></div></section>
    <section className="section coverage-preview"><div className="shell coverage-preview-grid"><div><span className="eyebrow">Coverage with restraint</span><h2>{covered.length} reviewed ZIP pages.<br />Five Florida counties.</h2><p>MoveIn is deliberately growing from {pilotCounties.join(", ")}. We publish a local page only when the record clears the quality gate.</p><Link className="text-link" href="/coverage">See current coverage <ArrowRight size={16} /></Link></div><div className="coverage-number" aria-label={`${covered.length} reviewed ZIP code pages`}><strong>{covered.length}</strong><span>reviewed<br />ZIPs</span></div></div></section>
    <section className="section final-lookup"><div className="shell"><div><span className="eyebrow">Ready for the next task?</span><h2>Start with the address you are moving into.</h2><p>We only need the five-digit ZIP code.</p></div><ZipLookupForm compact context="homepage_footer" /></div></section>
  </main>;
}
