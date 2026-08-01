"use client";

import { useEffect } from "react";
import { trackEvent } from "../lib/analytics";

export function AnalyticsBridge() {
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      const resultPage = target.closest<HTMLElement>(".result-page");
      const providerCard = target.closest<HTMLElement>(".provider-card");
      const providerParameters = {
        service_category: providerCard?.dataset.analyticsCategory ?? anchor?.dataset.analyticsCategory,
        provider_name: providerCard?.dataset.analyticsProvider ?? anchor?.dataset.analyticsProvider,
        county: resultPage?.dataset.analyticsCounty,
      };

      const phoneLink = target.closest<HTMLAnchorElement>(".contact-list a[href^='tel:']");
      if (phoneLink) {
        const phoneType = phoneLink.dataset.analyticsPhoneType ?? "provider";
        if (phoneType === "outage") trackEvent("outage_phone_click", { ...providerParameters, phone_type: phoneType });
        else trackEvent("provider_phone_click", { ...providerParameters, phone_type: phoneType });
        return;
      }

      const providerLink = target.closest<HTMLAnchorElement>(".provider-actions a, .quick-actions a[target='_blank'], .provider-source a");
      if (providerLink) {
        const linkType = providerLink.dataset.analyticsLinkType ?? (providerLink.closest(".provider-source") ? "official_source" : "official_website");
        const parameters = { ...providerParameters, link_type: linkType };
        if (linkType === "start_service") trackEvent("provider_start_service_click", parameters);
        else if (linkType === "address_check") trackEvent("provider_address_check_click", parameters);
        else if (linkType === "outage_map") trackEvent("outage_map_click", parameters);
        else trackEvent("provider_official_link_click", parameters);
        return;
      }

      if (!anchor) return;
      const destination = new URL(anchor.href, window.location.origin);
      if (destination.origin !== window.location.origin) return;
      const printable = destination.pathname.match(/^\/resources\/printables\/([^/]+)$/);
      if (printable) {
        trackEvent("printable_resource_click", { resource_slug: printable[1], source_page: sourcePage(), action: "open" });
        return;
      }
      const guide = destination.pathname.match(/^\/(?:resources|homeowners|renters)\/([^/]+)$/);
      if (guide) trackEvent("guide_link_click", { guide_slug: guide[1], source_page: sourcePage() });
    };

    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return null;
}

function sourcePage() {
  return /^\/lookup\/\d{5}$/.test(window.location.pathname) ? "/lookup/[zip]" : window.location.pathname;
}
