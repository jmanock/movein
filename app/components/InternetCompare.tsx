"use client";

import { Search, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { InternetProviderCard, type InternetCardProvider } from "./InternetProviderCard";
import { clearInternetComparison, readInternetComparison, type SavedInternetProvider } from "../lib/internet-comparison";
import { trackEvent } from "../lib/analytics";

type Filter = "all" | "wired" | "fixed-wireless";
type LookupPayload = { zipCode: string; county?: string; state?: string; status?: string; internet?: never; providers?: { internet?: InternetCardProvider[] } };

export function InternetCompare({ initialZip = "" }: { initialZip?: string }) {
  const [zip, setZip] = useState(initialZip);
  const [searchedZip, setSearchedZip] = useState("");
  const [providers, setProviders] = useState<InternetCardProvider[]>([]);
  const [saved, setSaved] = useState<SavedInternetProvider[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [message, setMessage] = useState("Enter a ZIP to see reviewed provider possibilities, or continue with saved options below.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const refresh = () => setSaved(readInternetComparison().providers);
    queueMicrotask(refresh); window.addEventListener("movein:internet-comparison-updated", refresh);
    if (/^\d{5}$/.test(initialZip)) queueMicrotask(() => void runSearch(initialZip));
    return () => window.removeEventListener("movein:internet-comparison-updated", refresh);
  // Initial ZIP should run once; user searches are explicit.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(value: string) {
    setLoading(true); setMessage("Checking reviewed Internet possibilities…");
    try {
      const response = await fetch(`/api/lookup?zip=${value}`);
      if (!response.ok) { setProviders([]); setSearchedZip(value); setMessage(response.status === 404 ? "MoveIn does not support this ZIP yet. Try the FCC map or request coverage." : "Internet options are temporarily unavailable."); return; }
      const payload = await response.json() as LookupPayload;
      const options = (payload.providers?.internet ?? []).filter((provider) => provider.slug !== "fcc-broadband-map").sort((a, b) => a.name.localeCompare(b.name));
      setProviders(options); setSearchedZip(value); setMessage(options.length ? `${options.length} possible providers found. Every option requires an exact-address check.` : "No commercial provider possibilities have enough evidence to show for this ZIP yet.");
      trackEvent("internet_zip_search", { county: payload.county, state: payload.state, source_page: "/internet/compare", coverage_status: payload.status });
    } catch { setMessage("MoveIn could not reach the lookup. Check your connection and try again."); }
    finally { setLoading(false); }
  }

  function submit(event: FormEvent) { event.preventDefault(); if (!/^\d{5}$/.test(zip)) { setMessage("Enter a valid five-digit ZIP code."); return; } void runSearch(zip); }
  const cards = providers.length ? providers : saved.map(savedToCard);
  const filtered = useMemo(() => cards.filter((provider) => filter === "all" || providerType(provider) === filter), [cards, filter]);
  const clear = () => { clearInternetComparison(); setSaved([]); if (!providers.length) setMessage("Saved comparison cleared. Enter a ZIP to start another comparison."); window.dispatchEvent(new CustomEvent("movein:internet-comparison-updated")); };

  return <div className="internet-compare-tool">
    <form onSubmit={submit} noValidate><label htmlFor="internet-compare-zip">ZIP code</label><div><input id="internet-compare-zip" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} onChange={(event) => setZip(event.currentTarget.value.replace(/\D/g, "").slice(0, 5))} /><button className="button" disabled={loading}><Search size={18} aria-hidden="true" />{loading ? "Checking…" : "Compare options"}</button></div><p aria-live="polite">{message}</p></form>
    {cards.length ? <><div className="internet-filter" aria-label="Filter comparison"><span>Show:</span>{(["all", "wired", "fixed-wireless"] as Filter[]).map((value) => <button type="button" aria-pressed={filter === value} onClick={() => { setFilter(value); trackEvent("internet_technology_filter", { technology: value, source_page: "/internet/compare" }); }} key={value}>{value === "all" ? "All" : value === "wired" ? "Wired" : "Wireless home"}</button>)}</div><div className="internet-compare-header"><div><span className="eyebrow">{providers.length ? `ZIP ${searchedZip}` : "Saved options"}</span><h2>Compare the facts that do not expire tomorrow.</h2><p>Connection type, address checking, transfer tools, and installation considerations are more useful than temporary promotional prices.</p></div>{saved.length ? <button type="button" onClick={clear}><Trash2 size={16} aria-hidden="true" />Clear comparison</button> : null}</div><div className="internet-compare-grid">{filtered.map((provider) => <div key={provider.slug}><InternetProviderCard provider={provider} zip={searchedZip || saved.find((item) => item.slug === provider.slug)?.zip} sourcePage="/internet/compare" compact /><dl><div><dt>Connection</dt><dd>{providerType(provider) === "wired" ? "Wired" : "Wireless home"}</dd></div><div><dt>Address check</dt><dd>Required</dd></div><div><dt>Transfer option</dt><dd>{provider.movingOrTransferUrl ? "Available" : "Ask provider"}</dd></div><div><dt>Installation</dt><dd>May require equipment, access, or an appointment</dd></div></dl></div>)}</div></> : null}
  </div>;
}

function savedToCard(provider: SavedInternetProvider): InternetCardProvider { return { slug: provider.slug, name: provider.providerName, technologyTypes: provider.technologyTypes, technologyType: provider.technologyTypes.join(" | "), addressCheckUrl: provider.availabilityCheckerUrl, movingOrTransferUrl: provider.movingOrTransferUrl, officialWebsite: provider.availabilityCheckerUrl, coverageLabel: "Saved possible provider", coverageNotes: "Saved from a previous MoveIn comparison. Recheck the exact address before ordering.", lastVerifiedAt: provider.lastReviewedAt }; }
function providerType(provider: InternetCardProvider): "wired" | "fixed-wireless" { return /T-Mobile|Verizon|5G|LTE|Fixed wireless/i.test(`${provider.name} ${provider.technologyTypes.join(" ")}`) ? "fixed-wireless" : "wired"; }
