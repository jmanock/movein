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

type MyMoveParameters = {
  homeowner_or_renter?: "homeowner" | "renter";
  move_phase?: string;
  task_category?: string;
  source_page: string;
};

type InternetParameters = {
  provider?: string;
  technology?: string;
  county?: string;
  state?: string;
  source_page: string;
  coverage_status?: string;
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
  guide_to_zip_lookup: { guide_slug: string; source_page: string };
  county_page_navigation: { county: string; source_page: string };
  correction_form_success: { source_page: string };
  printable_resource_click: { resource_slug: string; source_page: string; action?: "open" | "print" };
  my_move_started: MyMoveParameters;
  my_move_task_completed: MyMoveParameters;
  my_move_reset: MyMoveParameters;
  add_to_my_move: { task_category: string; source_page: string };
  printable_view: { printable_slug: string; source_page: string };
  printable_print: { printable_slug: string; source_page: string };
  first_30_days_view: { source_page: string };
  dont_forget_impression: { reminder_id: string; source_page: string };
  dont_forget_action: { reminder_id: string; source_page: string };
  utility_added_to_my_move: { task_category: string; source_page: string };
  internet_hub_view: InternetParameters;
  internet_zip_search: InternetParameters;
  internet_provider_view: InternetParameters;
  internet_provider_saved: InternetParameters;
  internet_provider_removed: InternetParameters;
  internet_compare_view: InternetParameters;
  internet_availability_click: InternetParameters;
  internet_transfer_click: InternetParameters;
  internet_technology_filter: InternetParameters;
  internet_checklist_view: InternetParameters;
  internet_checklist_print: InternetParameters;
  renter_hub_view: { source_page: string; homeowner_or_renter: "renter" };
  renter_insurance_guide_view: { source_page: string; homeowner_or_renter: "renter" };
  move_in_cost_guide_view: { source_page: string; homeowner_or_renter: "renter" };
  move_in_calculator_started: { source_page: string; homeowner_or_renter: "renter" };
  move_in_calculator_completed: { source_page: string; homeowner_or_renter: "renter"; expense_category_count: number };
  renter_condition_checklist_view: { source_page: string; homeowner_or_renter: "renter" };
  renter_condition_checklist_print: { source_page: string; homeowner_or_renter: "renter" };
  renter_expense_planner_print: { source_page: string; homeowner_or_renter: "renter" };
  free_renter_kit_view: { source_page: string; homeowner_or_renter: "renter" };
  renter_add_to_my_move: { source_page: string; task_category: string; homeowner_or_renter: "renter" };
  change_address_page_view: { source_page: string };
  address_checklist_started: { source_page: string };
  address_task_completed: { source_page: string; task_category: string };
  address_checklist_print: { source_page: string };
  address_tasks_added_to_my_move: { source_page: string; task_category: string; task_count: number };
  official_usps_click: { source_page: string; link_type: string };
  government_address_resource_click: { source_page: string; organization: string; link_type: string };
  address_progress_return_visit: { source_page: string };
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
  const blockedKeys = new Set(["email", "reply_email", "zip", "zip_code", "move_date", "notes", "checklist_text", "task_text", "street_address", "exact_address", "phone_number", "account_number", "details", "description", "ssn", "amount", "cost", "rent", "deposit", "dollar", "lease_details"]);
  return Object.fromEntries(Object.entries(parameters).filter(([key, value]) => value !== undefined && !blockedKeys.has(key)).map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 100) : value]));
}
