export type AnalyticsEvent = "zip_lookup_submitted" | "zip_lookup_success" | "zip_lookup_unknown" | "zip_lookup_outside_pilot" | "lookup_result_supported" | "lookup_result_partial" | "lookup_result_unsupported" | "provider_official_link_click" | "provider_phone_click" | "provider_source_click" | "start_service_click" | "outage_link_click" | "related_guide_click" | "coverage_link_click" | "coverage_page_visit" | "corrections_link_click" | "print_resource" | "homeowners_hub_visit" | "renters_hub_visit" | "faq_interaction" | "correction_submission";

export function trackEvent(name: AnalyticsEvent, context?: { category?: string; context?: string }) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("movein:analytics", { detail: { name, ...(context?.category ? { category: context.category } : {}), ...(context?.context ? { context: context.context } : {}) } }));
}
