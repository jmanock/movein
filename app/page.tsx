import type { Metadata } from "next";
import Link from "next/link";
import { Check, ClipboardCheck, House, ReceiptText, Upload } from "lucide-react";
import { JsonLd } from "./components/JsonLd";
import { TrustStrip } from "./components/Primitives";
import { ZipLookupForm } from "./components/ZipLookupForm";
import { DEFAULT_DESCRIPTION, pageMetadata, SITE_URL } from "./lib/metadata";

export const metadata: Metadata = pageMetadata("Moving In Is Just the Beginning", DEFAULT_DESCRIPTION, "/");
const structuredData = { "@context": "https://schema.org", "@graph": [
  { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "MoveIn", url: SITE_URL, description: DEFAULT_DESCRIPTION, potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/lookup?zip={search_term_string}` }, "query-input": "required name=search_term_string" } },
  { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "MoveIn", url: SITE_URL, slogan: "Everything after the keys.", email: "hello@movein.guide" },
] };
const steps = [
  { icon: Upload, title: "Upload", text: "Take a photo or choose an existing receipt." },
  { icon: ClipboardCheck, title: "Review", text: "MoveIn reads the purchase. Check the details and suggested household items." },
  { icon: House, title: "Keep what matters", text: "Choose which purchases belong in My Home." },
];
export default function HomePage() {
  return <main id="main-content"><JsonLd data={structuredData} />
    <section className="home-product-hero"><div className="shell product-hero-grid">
      <div className="product-hero-copy"><span className="eyebrow">Your home, after the move</span><h1>Moving in is just the beginning.</h1><p>Upload receipts and turn everyday purchases into useful home records without manually building an inventory.</p><div className="product-actions"><Link className="button" href="/receipts">Upload a receipt</Link><Link className="text-link" href="#zip-lookup">Find services by ZIP</Link></div><small>Receipt processing is available locally while private household access is being prepared.</small></div>
      <div className="purchase-preview" aria-label="Sample receipt review"><div className="preview-top"><span><ReceiptText size={20} aria-hidden="true" /> Receipt → My Home</span><strong>Sample data</strong></div><div className="sample-merchant"><span>HOME DEPOT</span><small>October 2, 2026 · Example purchase</small><h2>A little paper.<br />A useful home record.</h2></div><ul className="sample-purchases">{[["Weber Grill", "$599", true], ["Paper towels", "$18", false], ["Ryobi Drill", "$129", true]].map(([name, price, keep]) => <li key={String(name)} className={keep ? 'keep' : ''}><span className="sample-check">{keep ? <Check size={18} aria-hidden="true" /> : '—'}</span><div><h3>{name}</h3><small>{keep ? 'Add to My Home' : 'Receipt only · Not needed in My Home'}</small></div><strong>{price}</strong></li>)}</ul><p className="preview-bottom"><House size={18} aria-hidden="true" /> You choose what stays in My Home.</p></div>
    </div></section>
    <section className="section receipt-workflow"><div className="shell"><div className="home-section-heading"><span className="eyebrow">Less admin. More home.</span><h2>Turn receipts into useful home records.</h2></div><ol className="home-flow">{steps.map(({ icon: StepIcon, title, text }, index) => <li key={title}><div><StepIcon size={26} aria-hidden="true" /><span>0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></li>)}</ol></div></section>
    <section className="home-record-section"><div className="shell home-record-grid"><div><span className="eyebrow">Meet My Home</span><h2>Build your home record as you go.</h2><p>A grill today. A drill next month. Reviewed receipts gradually build a household inventory, with purchase dates, prices, and merchant details in one place.</p><Link className="button" href="/my-home">Explore My Home</Link></div><div className="home-record-example"><span className="sample-label">Sample My Home record</span><div className="record-item-heading"><House size={28} aria-hidden="true" /><h3>Ryobi Drill</h3><strong>$129</strong></div><dl><div><dt>Category</dt><dd>Tools</dd></div><div><dt>Purchased</dt><dd>October 2, 2026</dd></div><div><dt>Merchant</dt><dd>Home Depot</dd></div></dl><p><Check size={16} aria-hidden="true" /> Added from a reviewed receipt</p></div></div></section>
    <section className="section home-services" id="zip-lookup"><div className="shell"><div className="home-services-grid"><div><span className="eyebrow">Just moved in?</span><h2>Find the basics for your new address.</h2><p>Find possible electric, water, internet, and local-service providers for your Florida ZIP. Coverage can vary within a ZIP; confirm your exact address at the official source.</p><Link className="text-link" href="/coverage">See current coverage</Link></div><ZipLookupForm context="homepage_footer" /></div><TrustStrip /><div className="home-help-links"><Link href="/internet">Internet options</Link><Link href="/homeowners">Homeowner essentials</Link><Link href="/renters">Renter essentials</Link><Link href="/learn-your-area">Learn your area</Link></div></div></section>
    <section className="home-moving-links"><div className="shell"><div><span className="eyebrow">Still settling in?</span><h2>One less thing to remember.</h2></div><Link href="/my-move"><ClipboardCheck aria-hidden="true" /><div><h3>My Move</h3><p>Your moving checklist, saved in this browser.</p></div></Link><Link href="/resources"><ReceiptText aria-hidden="true" /><div><h3>Practical resources</h3><p>Guides and printable tools for the next task.</p></div></Link></div></section>
  </main>;
}
