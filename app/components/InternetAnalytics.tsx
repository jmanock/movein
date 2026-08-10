"use client";

import { useEffect } from "react";
import { trackEvent } from "../lib/analytics";

export function InternetAnalytics({ view, provider }: { view: "hub" | "compare" | "provider" | "checklist"; provider?: string }) {
  useEffect(() => {
    if (view === "hub") trackEvent("internet_hub_view", { source_page: "/internet" });
    else if (view === "compare") trackEvent("internet_compare_view", { source_page: "/internet/compare" });
    else if (view === "provider" && provider) trackEvent("internet_provider_view", { provider, source_page: `/internet/providers/${provider}` });
    else if (view === "checklist") trackEvent("internet_checklist_view", { source_page: "/resources/printables/internet-setup-checklist" });
  }, [provider, view]);
  return null;
}
