import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Icon } from "./components/Icon";
import { JsonLd } from "./components/JsonLd";
import { ZipLookupForm } from "./components/ZipLookupForm";
import { pilotCounties, serviceTypes } from "./data/site";
import { DEFAULT_DESCRIPTION, pageMetadata, SITE_URL } from "./lib/metadata";

export const metadata: Metadata = pageMetadata("Find Utilities and Essential Services by ZIP Code", DEFAULT_DESCRIPTION, "/");
const structuredData = { "@context": "https://schema.org", "@graph": [
  { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "MoveIn", url: SITE_URL, description: DEFAULT_DESCRIPTION },
  { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "MoveIn", url: SITE_URL, slogan: "Everything after the keys.", email: "hello@movein.guide" },
] };

export default function HomePage() {
  return <main id="main-content"><JsonLd data={structuredData} />
    <section className="lookup-hero" id="zip-lookup"><Image className="hero-background" src="/images/homepage/movein-entryway-v2.webp" alt="" width={1600} height={880} sizes="100vw" quality={76} preload fetchPriority="high" aria-hidden="true" /><div className="shell hero-content"><span className="eyebrow">Florida utility lookup</span><h1>Find the services for your new place.</h1><p>Enter a Florida ZIP code to find local electric, water, internet, and other essential providers.</p><ZipLookupForm /><div className="pilot-note"><CheckCircle2 size={18} aria-hidden="true" /><span><strong>Currently covering selected ZIP codes in {pilotCounties.join(", ")} counties.</strong> No account required · No email required · <Link href="/data-sources">Information from official sources</Link> · Availability varies by address · Data reviewed July 28, 2026</span></div></div></section>
    <section className="section"><div className="shell"><div className="section-heading"><span className="eyebrow">Essential services</span><h2>One place to start.</h2></div><div className="service-grid">{serviceTypes.map((service) => <article className="service-card" key={service.slug}><span className="service-icon"><Icon name={service.icon} size={25} /></span><h3>{service.name}</h3><p>{service.description}</p></article>)}</div></div></section>
    <section className="section subtle"><div className="shell"><div className="section-heading"><span className="eyebrow">How it works</span><h2>From ZIP code to official source.</h2></div><ol className="steps"><li><span>1</span><div><h3>Enter your ZIP code</h3><p>We match it to the verified pilot records we have.</p></div></li><li><span>2</span><div><h3>See possible providers</h3><p>Coverage labels make uncertainty clear.</p></div></li><li><span>3</span><div><h3>Confirm your address</h3><p>Use the provider’s official site or phone number before opening service.</p></div></li></ol></div></section>
    <section className="section"><div className="shell two-card-grid"><Link href="/homeowners" className="audience-card"><span className="service-icon"><Icon name="House" /></span><h2>Homeowners</h2><p>Utility setup, safety checks, records, and basic home routines.</p><span>View homeowner basics <ArrowRight size={17} aria-hidden="true" /></span></Link><Link href="/renters" className="audience-card"><span className="service-icon"><Icon name="Building2" /></span><h2>Renters</h2><p>Utilities, move-in condition, lease contacts, and deposit records.</p><span>View renter basics <ArrowRight size={17} aria-hidden="true" /></span></Link></div></section>
    <section className="section area-callout"><div className="shell"><div><span className="eyebrow">Learn Your Area</span><h2>Find the local starting points connected to your ZIP.</h2><p>See utility, internet, trash, county, city, and emergency resources as verified coverage expands.</p></div><Link href="/learn-your-area">Learn what is available <ArrowRight size={17} aria-hidden="true" /></Link></div></section>
  </main>;
}
