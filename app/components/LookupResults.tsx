import { ExternalLink, Phone, ShieldCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { LookupProvider, LookupResult } from "../../db/lookup.ts";
import { categoryLabels } from "../data/site";

const categoryOrder = ["electricity", "water", "sewer", "natural-gas", "internet", "trash-recycling", "local-government"];

export function LookupResults({ result }: { result: LookupResult }) {
  const count = Object.values(result.providers).reduce((total, providers) => total + providers.length, 0);
  return <>
    <section className="result-summary"><div><span className={`status-badge ${result.status}`}>{statusLabel(result.status)}</span><h1>Services for ZIP code {result.zipCode}</h1><p>{[result.city, result.county ? `${result.county} County` : null, result.state].filter(Boolean).join(" · ")}</p></div><Link href="/#zip-lookup">Search another ZIP</Link></section>
    <aside className="address-warning"><TriangleAlert size={21} aria-hidden="true" /><div><strong>Confirm every provider with your exact street address.</strong><p>{result.disclaimer}</p></div></aside>
    {result.status === "pending" || count === 0 ? <section className="pending-panel"><h2>We’re still verifying providers for this ZIP code.</h2><p>MoveIn will not guess. Use the official county or city website while this record is being researched.</p></section> : null}
    <div className="result-groups">{categoryOrder.map((category) => {
      const providers = result.providers[category] ?? [];
      if (!providers.length) return null;
      return <section className="result-group" key={category}><div className="result-group-heading"><h2>{categoryLabels[category]}</h2><span>{providers.length} {providers.length === 1 ? "record" : "records"}</span></div><div className="provider-list">{providers.map((provider) => <ProviderCard key={provider.slug} provider={provider} />)}</div></section>;
    })}</div>
    <aside className="source-note"><ShieldCheck size={20} aria-hidden="true" /><p>MoveIn is not a utility company or government agency. We link to official sources and show when each record was checked. <Link href="/data-sources">How our data works</Link></p></aside>
  </>;
}

function ProviderCard({ provider }: { provider: LookupProvider }) {
  return <article className="provider-card"><div className="provider-top"><div><span className={`coverage-label ${provider.coverageType}`}>{provider.coverageLabel}</span><h3>{provider.name}</h3></div>{provider.lastVerifiedAt ? <span className="verified-date">Checked {formatDate(provider.lastVerifiedAt)}</span> : null}</div><p className="coverage-note">{provider.coverageNotes}</p>{provider.description ? <p>{provider.description}</p> : null}<div className="contact-list">{provider.contacts.map((contact) => <a href={contact.phoneHref} key={`${contact.type}-${contact.phone}`}><Phone size={16} aria-hidden="true" /><span><small>{contact.label}</small>{contact.phone}</span></a>)}</div><div className="provider-actions"><a className="button secondary" href={provider.officialWebsite} target="_blank" rel="noopener noreferrer">Official website <ExternalLink size={16} aria-hidden="true" /></a>{provider.sources[0] ? <a href={provider.sources[0].url} target="_blank" rel="noopener noreferrer">View source <ExternalLink size={14} aria-hidden="true" /></a> : null}</div></article>;
}

function statusLabel(status: LookupResult["status"]) {
  return status === "verified" ? "Verified pilot records" : status === "partial" ? "Partial coverage" : "Verification in progress";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
