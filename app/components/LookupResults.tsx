import { ArrowRight, ExternalLink, Phone, ShieldCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { LookupProvider, LookupResult } from "../../db/lookup.ts";
import { resourcesForCounty, statewideMoveResources, zipMoveOverviews } from "../data/local-resources";
import { countyPath } from "../data/counties";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";
import { LocalResourceCards } from "./LocalResourceCards";
import { AddToMyMoveButton } from "./AddToMyMoveButton";
import { InternetOptions } from "./InternetOptions";

const groups = [
  { key: "electricity", label: "Electricity", icon: "Zap", slugs: ["electricity"] },
  { key: "water-sewer", label: "Water and sewer", icon: "Droplets", slugs: ["water", "sewer"] },
  { key: "internet", label: "Internet", icon: "Wifi", slugs: ["internet"] },
  { key: "trash-recycling", label: "Trash and recycling", icon: "Recycle", slugs: ["trash-recycling"] },
  { key: "local-government", label: "Local government", icon: "Landmark", slugs: ["local-government"] },
] as const;

type RelatedArea = { zipCode: string; city: string; county: string };
type QuickAction = { label: string; href: string; external: boolean; category?: string; providerName?: string; linkType?: string };

export function LookupResults({ result, relatedAreas = [] }: { result: LookupResult; relatedAreas?: RelatedArea[] }) {
  const providers = Object.values(result.providers).flat();
  const localDestination = result.providers["local-government"]?.[0]?.officialWebsite;
  const quickActions = buildQuickActions(result);
  const faq = buildLocalFaq(result);
  const countyProfile = resourcesForCounty(result.county);
  const recentlyMoved = buildRecentlyMovedResources(result, countyProfile);
  const locationName = result.city ?? `ZIP Code ${result.zipCode}`;
  const moveOverview = zipMoveOverviews[result.zipCode] ?? `${locationName} is a useful mailing-area starting point, but provider and government boundaries can vary by property. Confirm the complete address with every official source before opening an account.`;
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }} />
    <section className="result-summary"><div><span className={`status-badge ${result.status}`}>{statusLabel(result.status)}</span><h1>Utilities for ZIP Code {result.zipCode}</h1><p>{[result.city, result.county ? `${result.county} County` : null, result.stateName].filter(Boolean).join(", ")}</p><div className="review-dates">{result.lastUpdated ? <small>Database updated {formatDate(result.lastUpdated)}</small> : null}{result.lastLocationReview ? <small>Location reviewed {formatDate(result.lastLocationReview)}</small> : null}</div></div><Link href="/#zip-lookup">Search another ZIP</Link></section>
    <aside className="address-warning"><TriangleAlert size={21} aria-hidden="true" /><div><strong>ZIP codes can cross service boundaries.</strong><p>Confirm availability using your exact address before opening an account.</p>{result.jurisdictionNotes ? <p>{result.jurisdictionNotes}</p> : null}</div></aside>
    <section className="moving-overview"><span className="eyebrow">Moving to this ZIP code</span><h2>Start with the services connected to {locationName}.</h2><p>{moveOverview}</p><div className="local-facts"><span><strong>Mailing city</strong>{result.mailingCityName ?? result.city ?? "Not recorded"}</span><span><strong>County</strong>{result.county ? `${result.county} County` : "Confirm by address"}</span><span><strong>Jurisdiction</strong>{jurisdictionLabel(result.jurisdictionStatus)}</span></div></section>
    <section className="service-summary"><span className="eyebrow">Service coverage summary</span><h2>What this ZIP result can—and cannot—confirm</h2><p>This page lists reviewed possible providers and official lookup tools for {result.zipCode}. It does not determine service for a specific parcel, house, or apartment.</p><ul><li><strong>Mailing city:</strong> {result.mailingCityName ?? result.city ?? "Not recorded"}</li><li><strong>County:</strong> {result.county ? `${result.county} County` : "Not recorded"}</li><li><strong>Jurisdiction context:</strong> {jurisdictionLabel(result.jurisdictionStatus)}</li></ul><p className="local-context">A postal city name is not the same as city limits or utility jurisdiction. Confirm water, sewer, trash, and internet with the complete address.</p></section>
    {!result.isIndexable || providers.length === 0 ? <section className="pending-panel"><h2>We found this location, but utility research is still in progress.</h2><p>MoveIn will not guess. This page stays out of search results until the core services pass the verification checklist. Use the official county and address-level internet tools while research continues.</p></section> : null}
    {quickActions.length ? <nav className="quick-actions" aria-label="Utility quick actions">{quickActions.map((action) => action.external ? <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer" data-analytics-category={action.category} data-analytics-provider={action.providerName} data-analytics-link-type={action.linkType}>{action.label}<ExternalLink size={15} aria-hidden="true" /></a> : <Link key={action.label} href={action.href}>{action.label}<ArrowRight size={15} aria-hidden="true" /></Link>)}</nav> : null}
    <div className="result-groups">{groups.map((group) => {
      const groupProviders = group.slugs.flatMap((slug) => result.providers[slug] ?? []);
      const multiplePossible = groupProviders.filter((provider) => provider.providerType !== "official_lookup").length > 1;
      if (group.key === "internet") return <InternetOptions providers={groupProviders} zip={result.zipCode} sourcePage={`/lookup/${result.zipCode}`} key={group.key} />;
      return <section className="result-group" id={group.key} key={group.key}><div className="result-group-heading"><h2><span className="result-category-icon"><Icon name={group.icon} size={21} /></span>{group.label}</h2><span>{groupProviders.length ? `${groupProviders.length} ${groupProviders.length === 1 ? "record" : "records"}` : "Verification pending"}</span></div>{multiplePossible ? <p className="multiple-provider-note"><strong>Multiple providers may serve this ZIP code.</strong> Confirm the exact address with each official provider.</p> : null}{groupProviders.length ? <div className="provider-list">{groupProviders.map((provider) => <ProviderCard key={provider.slug} provider={provider} icon={group.icon} category={group.key} />)}</div> : <div className="empty-provider"><p>We are still verifying this service for your ZIP code.</p>{localDestination ? <a href={localDestination} target="_blank" rel="noopener noreferrer">Visit local government <ExternalLink size={14} aria-hidden="true" /></a> : <Link href={`/corrections?zip=${result.zipCode}`}>Report a missing provider <ArrowRight size={14} aria-hidden="true" /></Link>}</div>}</section>;
    })}</div>
    <section className="people-also-need"><div className="section-heading compact"><span className="eyebrow">Practical next steps</span><h2>People moving to this ZIP also need:</h2></div><div><Link href="/resources/find-electric-company">Set up electricity</Link><Link href="/resources/find-water-provider">Confirm water and sewer</Link><Link href="/internet/compare">Compare internet options</Link><Link href="/internet/transfer-or-switch">Transfer or switch Internet</Link><Link href="/resources/find-trash-service">Find trash and recycling</Link><Link href="/resources/change-your-address">Change your address after moving</Link></div><AddToMyMoveButton taskId="local-utilities" label="Add local utility setup to My Move" sourcePage="/lookup/[zip]" /></section>
    <section className="recently-moved"><div className="section-heading compact"><span className="eyebrow">Official local help</span><h2>Continue to government and community resources.</h2><p>Use official destinations for address records, local services, emergency management, property information, and collection schedules.</p></div><LocalResourceCards resources={recentlyMoved} /></section>
    <section className="forgotten-checklist"><div><span className="eyebrow">Often missed</span><h2>Things to check during the first week.</h2><p>Use the list that fits the property. Ask a qualified professional or property manager when a control, alarm, or system is unfamiliar.</p></div><ul><li>Locate the accessible water shutoff and electrical panel.</li><li>Test smoke and carbon-monoxide alarms.</li><li>Save power, water, and property emergency contacts.</li><li>Confirm trash day, recycling rules, and moving-box disposal.</li><li>Change locks or confirm key and access-code handoff.</li><li>Photograph the condition, visible meter readings, and major appliances.</li><li>Check the HVAC filter size and replacement schedule.</li><li>Review hurricane supplies, alerts, and flood information.</li></ul></section>
    <section className="emergency-information"><div className="section-heading compact"><span className="eyebrow">Emergency information</span><h2>Know where to start before something goes wrong.</h2></div><div className="emergency-grid"><article><Icon name="ShieldAlert" /><h3>Police, fire, or medical danger</h3><p>Call 911 for an immediate threat to life or property. Use the official city or county website for non-emergency agency contacts.</p><a href="tel:911">Call 911</a></article><article><Icon name="Landmark" /><h3>Local emergency management</h3><p>{countyProfile ? countyProfile.emergencyManagement.description : "Use your county emergency-management office for alerts, shelter, evacuation, and preparedness information."}</p>{countyProfile ? <a href={countyProfile.emergencyManagement.url} target="_blank" rel="noopener noreferrer">Open official emergency information <ExternalLink size={14} aria-hidden="true" /></a> : null}</article><article><Icon name="Zap" /><h3>Power outage</h3><p>Use the outage phone or map on the confirmed electricity-provider card. Keep away from downed lines and call 911 for immediate danger.</p><a href="#electricity">Go to electric contacts</a></article><article><Icon name="Droplets" /><h3>Water or sewer problem</h3><p>Use the emergency contact on the confirmed water or sewer card. A utility-main problem and a problem inside the property may require different help.</p><a href="#water-sewer">Go to water and sewer contacts</a></article></div></section>
    <section className="ready-section"><div><span className="eyebrow">Before you call</span><h2>What you may need</h2><p>Requirements vary by provider. MoveIn never collects identification, payment information, lease or closing documents, or utility account details.</p></div><ul><li>Service address and move-in date</li><li>Government-issued identification</li><li>Lease or closing documents if requested</li><li>Previous account details when transferring service</li><li>Payment method and landlord contact if applicable</li></ul></section>
    <section className="result-pathways"><article><span className="service-icon"><Icon name="House" /></span><h2>Homeowner</h2><ul><li>Confirm electric and water service</li><li>Locate the main shutoff</li><li>Check trash collection and save outage numbers</li><li>Review deposits and account requirements</li></ul><Link href="/homeowners">Homeowner basics <ArrowRight size={16} /></Link></article><article><span className="service-icon"><Icon name="Building2" /></span><h2>Renter</h2><ul><li>Confirm which utilities are included in rent</li><li>Ask which accounts the tenant must open</li><li>Document meter readings and emergency contacts</li><li>Confirm internet installation rules</li></ul><Link href="/renters">Renter basics <ArrowRight size={16} /></Link></article></section>
    <section className="zip-guide-links"><span className="eyebrow">Use the result</span><h2>Guides for the next step</h2><div>{result.county ? <Link href={countyPath(result.county)} data-analytics-county={result.county}>{result.county} County utility guide</Link> : null}<Link href="/resources/find-electric-company">Find your electric company</Link><Link href="/resources/find-water-provider">Confirm water and sewer</Link><Link href="/resources/find-internet-providers">Check internet by address</Link><Link href="/resources/transfer-internet-when-moving">Follow the Internet moving checklist</Link><Link href="/resources/change-your-address">Change your address after moving</Link><Link href="/homeowners/set-up-utilities">Homeowner utility setup</Link><Link href="/renters/set-up-utilities">Renter utility setup</Link><Link href="/data-sources">How MoveIn verifies data</Link></div></section>
    <section className="zip-faq"><span className="eyebrow">Local questions</span><h2>Questions about services in {result.zipCode}</h2>{faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
    {relatedAreas.length ? <section className="nearby-areas"><span className="eyebrow">Same county</span><h2>Related reviewed areas in {result.county} County</h2><div>{relatedAreas.map((area) => <Link key={area.zipCode} href={`/lookup/${area.zipCode}`}><strong>{area.city}</strong><span>ZIP Code {area.zipCode}</span></Link>)}</div></section> : null}
    <aside className="source-note"><ShieldCheck size={20} aria-hidden="true" /><p>MoveIn is not a utility company or government agency. We link to official sources and show when each record was checked. <Link href="/data-sources">How our data works</Link></p></aside>
    <nav className="result-next-links" aria-label="Next steps"><Link href="/#zip-lookup">Check another ZIP code <ArrowRight size={16} /></Link><Link href={`/corrections?zip=${result.zipCode}`}>Report incorrect information <ArrowRight size={16} /></Link></nav>
  </>;
}

function ProviderCard({ provider, icon, category }: { provider: LookupProvider; icon: string; category: string }) {
  const officialLabel = provider.providerType === "official_lookup" ? category === "internet" ? "Check availability at your address" : "Open official territory lookup" : "Visit official provider";
  const actions = uniqueActions([
    provider.startServiceUrl ? { href: provider.startServiceUrl, label: "Start or transfer service", linkType: "start_service" } : null,
    provider.addressCheckUrl ? { href: provider.addressCheckUrl, label: category === "internet" ? "Check availability at your address" : "Check address availability", linkType: "address_check" } : null,
    provider.supportUrl ? { href: provider.supportUrl, label: "Provider support", linkType: "support" } : null,
    provider.outageUrl ? { href: provider.outageUrl, label: "Report an outage", linkType: "outage_report" } : null,
    provider.outageMapUrl ? { href: provider.outageMapUrl, label: "View outage map", linkType: "outage_map" } : null,
    provider.collectionInfoUrl ? { href: provider.collectionInfoUrl, label: "Find collection information", linkType: "collection_info" } : null,
    { href: provider.officialWebsite, label: category === "local-government" ? "Visit county utilities" : category === "trash-recycling" ? "Find collection information" : officialLabel, linkType: "official_website" },
  ]);
  return <article className="provider-card" data-analytics-provider={provider.name} data-analytics-category={category}>
    <div className="provider-card-icon"><Icon name={icon} size={19} /></div>
    <div className="provider-main"><div className="provider-top"><div><span className={`coverage-label ${provider.coverageType}`}>{provider.coverageLabel}</span><h3>{provider.name}</h3>{provider.providerType && provider.providerType !== "official_lookup" ? <small className="provider-type">{providerTypeLabel(provider.providerType)}</small> : null}</div>{provider.lastVerifiedAt ? <span className="verified-date"><ShieldCheck size={14} aria-hidden="true" />Verified {formatDate(provider.lastVerifiedAt)}</span> : null}</div><p className="coverage-note">{provider.coverageNotes}</p>{provider.description ? <p>{provider.description}</p> : null}{provider.serviceNotes ? <p className="service-note"><strong>Service note:</strong> {provider.serviceNotes}</p> : null}{provider.jurisdictionNotes ? <p className="jurisdiction-note">{provider.jurisdictionNotes}</p> : null}{category === "internet" ? <p className="category-caution">Availability and speeds vary by exact street address.</p> : null}{category === "trash-recycling" ? <p className="category-caution">Trash service may be arranged by your city, county, HOA, landlord, or private hauler.</p> : null}{provider.technologyType ? <p><strong>Technology:</strong> {provider.technologyType}</p> : null}{provider.hours ? <p><strong>Hours:</strong> {provider.hours}</p> : null}<div className="contact-list">{provider.contacts.map((contact) => <a href={contact.phoneHref} data-analytics-phone-type={contact.type} key={`${contact.type}-${contact.phone}`}><Phone size={16} aria-hidden="true" /><span><small>{contact.label}</small>{contact.phone}</span></a>)}</div>{provider.contacts.length === 0 ? <p className="contact-availability">No public account phone is listed in this record. Use the official website or address tool.</p> : null}</div>
    <div className="provider-rail"><div className="provider-actions">{actions.map((action, index) => <a className={index === 0 ? "button secondary" : undefined} href={action.href} data-analytics-link-type={action.linkType} key={action.href} target="_blank" rel="noopener noreferrer">{action.label} <ExternalLink size={index === 0 ? 16 : 14} aria-hidden="true" /></a>)}</div>{provider.sources[0] ? <div className="provider-source"><span><ShieldCheck size={14} aria-hidden="true" />Official source</span><a href={provider.sources[0].url} data-analytics-link-type="official_source" target="_blank" rel="noopener noreferrer">{provider.sources[0].name} <ExternalLink size={13} aria-hidden="true" /></a><small>Checked {formatDate(provider.sources[0].retrievedAt)}</small></div> : null}</div>
  </article>;
}

function buildRecentlyMovedResources(result: LookupResult, countyProfile: ReturnType<typeof resourcesForCounty>) {
  const resources = [...statewideMoveResources.slice(0, 3)];
  if (countyProfile) resources.push(countyProfile.emergencyManagement, countyProfile.library, countyProfile.residentServices, countyProfile.propertyAppraiser);
  const trash = result.providers["trash-recycling"]?.find((provider) => provider.collectionInfoUrl || provider.addressCheckUrl || provider.officialWebsite);
  if (trash) resources.push({ title: "Find your trash and recycling schedule", organization: trash.name, url: trash.collectionInfoUrl ?? trash.addressCheckUrl ?? trash.officialWebsite, description: "Confirm collection responsibility, pickup days, carts, recycling, yard waste, and bulk-item rules by address.", icon: "Recycle" });
  return resources;
}

function buildQuickActions(result: LookupResult) {
  const first = (slug: string) => result.providers[slug]?.find((provider) => provider.isVerified);
  const electric = first("electricity"); const water = first("water"); const internet = first("internet"); const trash = first("trash-recycling");
  return [
    electric ? { label: electric.providerType === "official_lookup" ? "Find electric territory" : "Start electric service", href: electric.startServiceUrl ?? electric.addressCheckUrl ?? electric.officialWebsite, external: true, category: "electricity", providerName: electric.name, linkType: electric.startServiceUrl ? "start_service" : electric.addressCheckUrl ? "address_check" : "official_website" } : null,
    water ? { label: "Check water service", href: water.addressCheckUrl ?? water.startServiceUrl ?? water.officialWebsite, external: true, category: "water", providerName: water.name, linkType: water.addressCheckUrl ? "address_check" : water.startServiceUrl ? "start_service" : "official_website" } : null,
    internet ? { label: "Check availability at your address", href: internet.addressCheckUrl ?? internet.officialWebsite, external: true, category: "internet", providerName: internet.name, linkType: internet.addressCheckUrl ? "address_check" : "official_website" } : null,
    trash ? { label: "Find trash information", href: trash.addressCheckUrl ?? trash.officialWebsite, external: true, category: "trash-recycling", providerName: trash.name, linkType: trash.addressCheckUrl ? "address_check" : "official_website" } : null,
    { label: "Report incorrect information", href: `/corrections?zip=${result.zipCode}`, external: false, category: undefined, providerName: undefined, linkType: undefined },
  ].filter(Boolean) as QuickAction[];
}

function uniqueActions(actions: Array<{ href: string; label: string; linkType: string } | null>) {
  const seen = new Set<string>();
  const unique: Array<{ href: string; label: string; linkType: string }> = [];
  for (const action of actions) {
    if (!action || seen.has(action.href)) continue;
    seen.add(action.href);
    unique.push(action);
  }
  return unique;
}

function statusLabel(status: LookupResult["status"]) { return status === "verified" ? "Verified" : status === "mostly_verified" ? "Mostly verified" : status === "partial" ? "Partial" : "Verification in progress"; }
function jurisdictionLabel(status: LookupResult["jurisdictionStatus"]) { return ({ incorporated: "Primarily incorporated", unincorporated: "Primarily unincorporated", mixed: "May include incorporated and unincorporated areas", unknown: "Confirm city or county jurisdiction by address" } as const)[status]; }
function buildLocalFaq(result: LookupResult) {
  const electric = result.providers.electricity?.filter((provider) => provider.providerType !== "official_lookup").map((provider) => provider.name) ?? [];
  const water = result.providers.water?.filter((provider) => provider.providerType !== "official_lookup").map((provider) => provider.name) ?? [];
  return [
    { question: `Which electric company serves ZIP Code ${result.zipCode}?`, answer: electric.length ? `${electric.join(" or ")} may serve addresses in ${result.zipCode}. Utility territories can divide a ZIP code, so confirm the complete address on the official provider site.` : `MoveIn has not verified a ZIP-wide electric provider for ${result.zipCode}. Use an official territory lookup and confirm the complete address.` },
    { question: `Who provides water service in ${result.city ?? result.zipCode}?`, answer: water.length ? `${water.join(" or ")} appears in the reviewed record. Water and sewer jurisdiction can differ by parcel, city limits, well, or septic status, so confirm the address directly.` : `Water service is not confirmed for every address in ${result.zipCode}. Check the city or county jurisdiction and ask whether the property uses a public utility, private utility, well, or septic system.` },
    { question: `Can I choose an internet provider from this ZIP page?`, answer: "Use these records only as a starting point. Internet availability, technology, and speed can differ by building or unit; check the complete address with the provider and the FCC National Broadband Map." },
    { question: `How do I find the trash schedule for ${result.zipCode}?`, answer: `Open the official collection link in the trash and recycling record, then search the complete address. City limits, unincorporated areas, HOAs, landlords, and property type can change who collects waste and on which day.` },
    { question: `Where can I find emergency information for ${result.county ?? "this area"}?`, answer: `Use the official county emergency-management resource on this page for alerts, shelters, evacuation, and preparedness. Use 911 for immediate police, fire, or medical danger, and use the confirmed utility's official outage channel for service interruptions.` },
  ];
}
function providerTypeLabel(type: string) { return ({ municipal_utility: "City utility", municipal_department: "City department", county_utility: "County utility", private_utility: "Private utility", electric_cooperative: "Electric cooperative", investor_owned_utility: "Investor-owned utility", public_authority: "Public utility authority", special_district: "Special district", address_lookup: "Address-level availability check" } as Record<string, string>)[type] ?? type.replaceAll("_", " "); }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
