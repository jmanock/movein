type LookupParameters = {
  county?: string;
  state?: string;
  coverage_status?: string;
  provider_category_count?: number;
  source_page: string;
};

type ProviderParameters = {
  service_category?: string;
  provider_name?: string;
  county?: string;
  link_type?: string;
};

export type AnalyticsEventParameters = {
  zip_lookup_submit: { source_page: string };
  zip_lookup_success: LookupParameters;
  zip_lookup_partial: LookupParameters;
  zip_lookup_unsupported: { source_page: string };
  zip_coverage_request: { requested_zip: string; source_page: string };
  provider_official_link_click: ProviderParameters;
  provider_phone_click: ProviderParameters & { phone_type?: string };
  provider_start_service_click: ProviderParameters;
  provider_address_check_click: ProviderParameters;
  outage_phone_click: ProviderParameters & { phone_type: string };
  outage_map_click: ProviderParameters;
  guide_link_click: { guide_slug: string; source_page: string };
  county_page_navigation: { county: string; source_page: string };
  correction_form_success: { source_page: string };
  printable_resource_click: { resource_slug: string; source_page: string; action?: "open" | "print" };
};

export type AnalyticsEvent = keyof AnalyticsEventParameters;

export function trackEvent<Name extends AnalyticsEvent>(name: Name, parameters: AnalyticsEventParameters[Name]) {
  if (!analyticsIsAvailable()) return;
  try {
    const safeParameters = sanitizeParameters(parameters);
    window.gtag?.("event", name, safeParameters);
    window.dispatchEvent(new CustomEvent("movein:analytics", { detail: { name, ...safeParameters } }));
  } catch {
    // Tracking is intentionally non-critical. Ad blockers and tag failures must not affect the site.
  }
}

export function trackPageView(pathname: string) {
  if (!analyticsIsAvailable() || !pathname.startsWith("/")) return;
  try {
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}`,
      page_title: document.title,
    });
  } catch {
    // Page rendering and navigation never depend on analytics.
  }
}

function analyticsIsAvailable() {
  if (typeof window === "undefined" || process.env.NODE_ENV === "test") return false;
  if (navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true) return false;
  return typeof window.gtag === "function";
}

function sanitizeParameters(parameters: Record<string, string | number | boolean | undefined>) {
  const blockedKeys = new Set(["email", "reply_email", "zip", "zip_code", "street_address", "exact_address", "phone_number", "account_number", "details", "description", "ssn"]);
  return Object.fromEntries(Object.entries(parameters).filter(([key, value]) => value !== undefined && !blockedKeys.has(key)).map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 100) : value]));
}
