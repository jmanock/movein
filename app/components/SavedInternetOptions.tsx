"use client";

import { BookmarkCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readInternetComparison, type SavedInternetProvider } from "../lib/internet-comparison";

export function SavedInternetOptions() {
  const [providers, setProviders] = useState<SavedInternetProvider[]>([]);
  useEffect(() => { const refresh = () => setProviders(readInternetComparison().providers); queueMicrotask(refresh); window.addEventListener("movein:internet-comparison-updated", refresh); return () => window.removeEventListener("movein:internet-comparison-updated", refresh); }, []);
  if (!providers.length) return null;
  const zips = [...new Set(providers.map((provider) => provider.zip).filter(Boolean))];
  return <aside className="saved-internet-options"><BookmarkCheck aria-hidden="true" /><div><span className="eyebrow">Your saved Internet options</span><h2>You saved {providers.length} {providers.length === 1 ? "provider" : "providers"}{zips.length === 1 ? ` for ZIP ${zips[0]}` : ""}.</h2><p>{providers.map((provider) => provider.providerName).join(" · ")}</p><Link href={zips.length === 1 ? `/internet/compare?zip=${zips[0]}` : "/internet/compare"}>Continue comparing</Link></div></aside>;
}
