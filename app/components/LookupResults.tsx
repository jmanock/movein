import { ArrowRight, ExternalLink, Phone, ShieldCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { LookupProvider, LookupResult } from "../../db/lookup.ts";
import { Icon } from "./Icon";

const groups = [
  { key: "electricity", label: "Electricity", icon: "Zap", slugs: ["electricity"] },
  { key: "water-sewer", label: "Water and sewer", icon: "Droplets", slugs: ["water", "sewer"] },
  { key: "internet", label: "Internet", icon: "Wifi", slugs: ["internet"] },
  { key: "trash-recycling", label: "Trash and recycling", icon: "Recycle", slugs: ["trash-recycling"] },
  { key: "natural-gas", label: "Natural gas", icon: "Flame", slugs: ["natural-gas"] },
  { key: "local-government", label: "Local government", icon: "Landmark", slugs: ["local-government"] },
] as const;

export function LookupResults({ result }: { result: LookupResult }) {
  const providers = Object.values(result.providers).flat();
  const localDestination = result.providers["local-government"]?.[0]?.officialWebsite;
  const quickActions = buildQuickActions(result);
  return <>
    <section className="result-summary"><div><span className={`status-badge ${result.status}`}>{statusLabel(result.status)}</span><h1>Utilities for ZIP Code {result.zipCode}</h1><p>{[result.city, result.county ? `${result.county} County` : null, result.stateName].filter(Boolean).join(", ")}</p><div className="review-dates">{result.lastUpdated ? <small>Database updated {formatDate(result.lastUpdated)}</small> : null}{result.lastLocationReview ? <small>Location reviewed {formatDate(result.lastLocationReview)}</small> : null}</div></div><Link href="/#zip-lookup">Search another ZIP</Link></section>
    <aside className="address-warning"><TriangleAlert size={21} aria-hidden="true" /><div><strong>ZIP codes can cross service boundaries.</strong><p>Confirm availability using your exact address before opening an account.</p>{result.jurisdictionNotes ? <p>{result.jurisdictionNotes}</p> : null}</div></aside>
    {result.status === "pending" || providers.length === 0 ? <section className="pending-panel"><h2>We found this location, but some providers are still being verified.</h2><p>MoveIn will not guess. Use the official county or city website while this record is being researched.</p></section> : null}
    {quickActions.length ? <nav className="quick-actions" aria-label="Utility quick actions">{quickActions.map((action) => action.external ? <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer">{action.label}<ExternalLink size={15} /></a> : <Link key={action.label} href={action.href}>{action.label}<ArrowRight size={15} /></Link>)}</nav> : null}
    <div className="result-groups">{groups.map((group) => {
      const groupProviders = group.slugs.flatMap((slug) => result.providers[slug] ?? []);
      const multiplePossible = groupProviders.filter((provider) => provider.providerType !== "official_lookup").length > 1;
      return <section className="result-group" key={group.key}><div className="result-group-heading"><h2><span className="result-category-icon"><Icon name={group.icon} size={21} /></span>{group.label}</h2><span>{groupProviders.length ? `${groupProviders.length} ${groupProviders.length === 1 ? "record" : "records"}` : "Verification pending"}</span></div>{multiplePossible ? <p className="multiple-provider-note"><strong>Multiple providers may serve this ZIP code.</strong> Confirm the exact address with each official provider.</p> : null}{groupProviders.length ? <div className="provider-list">{groupProviders.map((provider) => <ProviderCard key={provider.slug} provider={provider} icon={group.icon} category={group.key} />)}</div> : <div className="empty-provider"><p>We are still verifying this service for your ZIP code.</p>{localDestination ? <a href={localDestination} target="_blank" rel="noopener noreferrer">Visit local government <ExternalLink size={14} /></a> : <Link href={`/corrections?zip=${result.zipCode}`}>Report a missing provider <ArrowRight size={14} /></Link>}</div>}</section>;
    })}</div>
    <section className="ready-section"><div><span className="eyebrow">Before you call</span><h2>What you may need</h2><p>Requirements vary by provider. MoveIn never collects identification, payment information, lease or closing documents, or utility account details.</p></div><ul><li>Service address and move-in date</li><li>Government-issued identification</li><li>Lease or closing documents if requested</li><li>Previous account details when transferring service</li><li>Payment method and landlord contact if applicable</li></ul></section>
    <section className="result-pathways"><article><span className="service-icon"><Icon name="House" /></span><h2>Homeowner</h2><ul><li>Confirm electric and water service</li><li>Locate the main shutoff</li><li>Check trash collection and save outage numbers</li><li>Review deposits and account requirements</li></ul><Link href="/homeowners">Homeowner basics <ArrowRight size={16} /></Link></article><article><span className="service-icon"><Icon name="Building2" /></span><h2>Renter</h2><ul><li>Confirm which utilities are included in rent</li><li>Ask which accounts the tenant must open</li><li>Document meter readings and emergency contacts</li><li>Confirm internet installation rules</li></ul><Link href="/renters">Renter basics <ArrowRight size={16} /></Link></article></section>
    <aside className="source-note"><ShieldCheck size={20} aria-hidden="true" /><p>MoveIn is not a utility company or government agency. We link to official sources and show when each record was checked. <Link href="/data-sources">How our data works</Link></p></aside>
    <nav className="result-next-links" aria-label="Next steps"><Link href="/#zip-lookup">Check another ZIP code <ArrowRight size={16} /></Link><Link href={`/corrections?zip=${result.zipCode}`}>Report incorrect information <ArrowRight size={16} /></Link></nav>
  </>;
}

function ProviderCard({ provider, icon, category }: { provider: LookupProvider; icon: string; category: string }) {
  const officialLabel = provider.providerType === "official_lookup" ? category === "internet" ? "Check availability at your address" : "Open official territory lookup" : "Visit official provider";
  const actions = uniqueActions([
    provider.startServiceUrl ? { href: provider.startServiceUrl, label: "Start or transfer service" } : null,
    provider.addressCheckUrl ? { href: provider.addressCheckUrl, label: category === "internet" ? "Check availability at your address" : "Check address availability" } : null,
    provider.outageUrl ? { href: provider.outageUrl, label: "Report an outage" } : null,
    provider.outageMapUrl ? { href: provider.outageMapUrl, label: "View outage map" } : null,
    provider.collectionInfoUrl ? { href: provider.collectionInfoUrl, label: "Find collection information" } : null,
    { href: provider.officialWebsite, label: category === "local-government" ? "Visit county utilities" : category === "trash-recycling" ? "Find collection information" : officialLabel },
  ]);
  return <article className="provider-card"><div className="provider-card-icon"><Icon name={icon} size={19} /></div><div className="provider-top"><div><span className={`coverage-label ${provider.coverageType}`}>{provider.coverageLabel}</span><h3>{provider.name}</h3>{provider.providerType && provider.providerType !== "official_lookup" ? <small className="provider-type">{providerTypeLabel(provider.providerType)}</small> : null}</div>{provider.lastVerifiedAt ? <span className="verified-date">Verified {formatDate(provider.lastVerifiedAt)}</span> : null}</div><p className="coverage-note">{provider.coverageNotes}</p>{provider.description ? <p>{provider.description}</p> : null}{provider.jurisdictionNotes ? <p className="jurisdiction-note">{provider.jurisdictionNotes}</p> : null}{category === "internet" ? <p className="category-caution">Availability and speeds vary by exact street address.</p> : null}{category === "trash-recycling" ? <p className="category-caution">Trash service may be arranged by your city, county, HOA, landlord, or private hauler.</p> : null}{provider.technologyType ? <p><strong>Technology:</strong> {provider.technologyType}</p> : null}{provider.hours ? <p><strong>Hours:</strong> {provider.hours}</p> : null}<div className="contact-list">{provider.contacts.map((contact) => <a href={contact.phoneHref} key={`${contact.type}-${contact.phone}`}><Phone size={16} aria-hidden="true" /><span><small>{contact.label}</small>{contact.phone}</span></a>)}</div><div className="provider-actions">{actions.map((action, index) => <a className={index === 0 ? "button secondary" : undefined} href={action.href} key={action.href} target="_blank" rel="noopener noreferrer">{action.label} <ExternalLink size={index === 0 ? 16 : 14} aria-hidden="true" /></a>)}</div>{provider.sources[0] ? <p className="provider-source">Source: <a href={provider.sources[0].url} target="_blank" rel="noopener noreferrer">{provider.sources[0].name} <ExternalLink size={13} /></a></p> : null}</article>;
}

function buildQuickActions(result: LookupResult) {
  const first = (slug: string) => result.providers[slug]?.find((provider) => provider.isVerified);
  const electric = first("electricity"); const water = first("water"); const internet = first("internet"); const trash = first("trash-recycling");
  return [
    electric ? { label: electric.providerType === "official_lookup" ? "Find electric territory" : "Start electric service", href: electric.startServiceUrl ?? electric.addressCheckUrl ?? electric.officialWebsite, external: true } : null,
    water ? { label: "Check water service", href: water.addressCheckUrl ?? water.startServiceUrl ?? water.officialWebsite, external: true } : null,
    internet ? { label: "Check availability at your address", href: internet.addressCheckUrl ?? internet.officialWebsite, external: true } : null,
    trash ? { label: "Find trash information", href: trash.addressCheckUrl ?? trash.officialWebsite, external: true } : null,
    { label: "Report incorrect information", href: `/corrections?zip=${result.zipCode}`, external: false },
  ].filter((value): value is { label: string; href: string; external: boolean } => Boolean(value));
}

function uniqueActions(actions: Array<{ href: string; label: string } | null>) {
  const seen = new Set<string>();
  const unique: Array<{ href: string; label: string }> = [];
  for (const action of actions) {
    if (!action || seen.has(action.href)) continue;
    seen.add(action.href);
    unique.push(action);
  }
  return unique;
}

function statusLabel(status: LookupResult["status"]) { return status === "verified" ? "Verified" : status === "mostly_verified" ? "Mostly verified" : status === "partial" ? "Partial" : "Verification in progress"; }
function providerTypeLabel(type: string) { return ({ municipal_utility: "City utility", municipal_department: "City department", county_utility: "County utility", private_utility: "Private utility", electric_cooperative: "Electric cooperative", investor_owned_utility: "Investor-owned utility", public_authority: "Public utility authority", special_district: "Special district" } as Record<string, string>)[type] ?? type.replaceAll("_", " "); }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
