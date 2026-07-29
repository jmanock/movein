export type AnalyticsEvent = "zip_lookup_submitted" | "zip_lookup_success" | "zip_lookup_unknown" | "zip_lookup_outside_pilot" | "provider_official_link_click" | "start_service_click" | "outage_link_click" | "related_guide_click" | "homeowners_hub_visit" | "renters_hub_visit" | "faq_interaction" | "correction_submission";

export function trackEvent(name: AnalyticsEvent, context?: { category?: string }) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("movein:analytics", { detail: { name, ...(context?.category ? { category: context.category } : {}) } }));
}
