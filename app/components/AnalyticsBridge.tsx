"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEvent } from "../lib/analytics";

export function AnalyticsBridge() {
  useEffect(() => {
    if (window.location.pathname === "/homeowners") trackEvent("homeowners_hub_visit");
    if (window.location.pathname === "/renters") trackEvent("renters_hub_visit");
    const click = (event: MouseEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>("[data-analytics-event]");
      if (element?.dataset.analyticsEvent) { trackEvent(element.dataset.analyticsEvent as AnalyticsEvent, { category: element.dataset.analyticsCategory }); return; }
      const providerLink = (event.target as HTMLElement).closest<HTMLAnchorElement>(".provider-actions a, .quick-actions a[target='_blank']");
      if (!providerLink) return;
      const label = providerLink.textContent?.toLowerCase() ?? "";
      const name: AnalyticsEvent = label.includes("outage") ? "outage_link_click" : label.includes("start") || label.includes("transfer") ? "start_service_click" : "provider_official_link_click";
      trackEvent(name);
    };
    const toggle = (event: Event) => {
      const details = event.target as HTMLDetailsElement;
      if (details.open && details.dataset.analyticsEvent) trackEvent(details.dataset.analyticsEvent as AnalyticsEvent);
    };
    document.addEventListener("click", click);
    document.addEventListener("toggle", toggle, true);
    return () => { document.removeEventListener("click", click); document.removeEventListener("toggle", toggle, true); };
  }, []);
  return null;
}

export function AnalyticsPageView({ event }: { event: AnalyticsEvent }) {
  useEffect(() => trackEvent(event), [event]);
  return null;
}
