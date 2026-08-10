"use client";

import { ArrowRightLeft, Bookmark, BookmarkCheck, ExternalLink, MapPinCheck, Wifi } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { internetProviderById, technologyLabel, type InternetProviderRecord } from "../data/internet";
import { readInternetComparison, removeInternetProvider, saveInternetProvider, type SavedInternetProvider } from "../lib/internet-comparison";
import { trackEvent } from "../lib/analytics";
import { saveInternetProviderToMyMove } from "../lib/my-move";

export type InternetCardProvider = {
  slug: string;
  name: string;
  technologyTypes: string[];
  technologyType?: string | null;
  addressCheckUrl: string | null;
  movingOrTransferUrl?: string | null;
  officialWebsite: string;
  coverageLabel: string;
  coverageNotes: string;
  lastVerifiedAt: string | null;
};

export function InternetProviderCard({ provider, zip, sourcePage, compact = false }: { provider: InternetCardProvider; zip?: string; sourcePage: string; compact?: boolean }) {
  const details = internetProviderById.get(provider.slug);
  const savedProvider = toSaved(provider, details, zip);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => { queueMicrotask(() => setSaved(readInternetComparison().providers.some((item) => item.slug === provider.slug))); }, [provider.slug]);

  const toggleSaved = () => {
    const result = saved ? removeInternetProvider(provider.slug) : saveInternetProvider(savedProvider);
    setSaved(!saved); setMessage(result.available ? saved ? "Removed from comparison." : "Saved for comparison." : "Comparison storage is unavailable in this browser.");
    trackEvent(saved ? "internet_provider_removed" : "internet_provider_saved", { provider: provider.name, technology: provider.technologyTypes.join(" | "), source_page: sourcePage, coverage_status: provider.coverageLabel });
    if (result.available) window.dispatchEvent(new CustomEvent("movein:internet-comparison-updated"));
  };
  const saveToMove = () => {
    const savedToMove = saveInternetProviderToMyMove(provider.name);
    setMessage(savedToMove ? `${provider.name} saved to My Move.` : "My Move storage is unavailable in this browser.");
    if (savedToMove) trackEvent("add_to_my_move", { task_category: "internet-provider", source_page: sourcePage });
  };

  const technologies = details?.technologyTypes.map(technologyLabel) ?? provider.technologyTypes;
  const type = details?.providerType ?? "wired";
  const addressUrl = provider.addressCheckUrl ?? details?.availabilityCheckerUrl ?? provider.officialWebsite;
  const transferUrl = provider.movingOrTransferUrl ?? details?.movingOrTransferUrl;
  return <article className={`internet-provider-card ${compact ? "compact" : ""}`} data-provider={provider.slug}>
    <header><span className={`internet-type ${type}`}><Wifi size={15} aria-hidden="true" />{type === "wired" ? "Wired internet" : "Wireless home internet"}</span><h3>{provider.name}</h3><p>{technologies.join(" · ")}</p></header>
    <div className="internet-provider-copy"><strong>{provider.coverageLabel}</strong><p>{provider.coverageNotes}</p><small>Availability, technology, and speeds must be confirmed for the exact address.</small>{provider.lastVerifiedAt ? <small>Market evidence checked {formatDate(provider.lastVerifiedAt)}</small> : null}</div>
    <div className="internet-card-actions">
      <a className="button" href={addressUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("internet_availability_click", { provider: provider.name, technology: technologies.join(" | "), source_page: sourcePage, coverage_status: provider.coverageLabel })}>Check your address <ExternalLink size={15} aria-hidden="true" /><span className="sr-only"> on {provider.name}; opens in a new tab</span></a>
      {transferUrl ? <a href={transferUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("internet_transfer_click", { provider: provider.name, technology: technologies.join(" | "), source_page: sourcePage })}>Transfer service <ArrowRightLeft size={14} aria-hidden="true" /><span className="sr-only">; opens in a new tab</span></a> : null}
      <a href={provider.officialWebsite} target="_blank" rel="noopener noreferrer">Official website <ExternalLink size={13} aria-hidden="true" /><span className="sr-only">; opens in a new tab</span></a>
    </div>
    <div className="internet-save-actions"><button type="button" aria-pressed={saved} onClick={toggleSaved}>{saved ? <BookmarkCheck size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}{saved ? "Saved for comparison" : "Save for comparison"}</button><button type="button" onClick={saveToMove}><MapPinCheck size={16} aria-hidden="true" />Save provider to My Move</button></div>
    <p className="internet-card-status" aria-live="polite">{message}</p>
    {details ? <Link className="provider-detail-link" href={`/internet/providers/${details.slug}`}>About {provider.name}</Link> : null}
  </article>;
}

function toSaved(provider: InternetCardProvider, details: InternetProviderRecord | undefined, zip?: string): SavedInternetProvider {
  return { slug: provider.slug, providerName: provider.name, technologyTypes: details?.technologyTypes.map(technologyLabel) ?? provider.technologyTypes, providerType: details?.providerType ?? "wired", availabilityCheckerUrl: provider.addressCheckUrl ?? details?.availabilityCheckerUrl ?? provider.officialWebsite, movingOrTransferUrl: provider.movingOrTransferUrl ?? details?.movingOrTransferUrl, lastReviewedAt: provider.lastVerifiedAt ?? details?.sourceCheckedAt ?? "2026-08-10", zip };
}

function formatDate(value: string) { return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
