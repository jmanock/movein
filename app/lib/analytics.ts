export type MoveInEvent =
  | "homepage_cta_click"
  | "entry_card_select"
  | "timeline_start"
  | "timeline_task_complete"
  | "timeline_reset"
  | "florida_guide_visit"
  | "checklist_download"
  | "newsletter_submit"
  | "outbound_resource_click"
  | "affiliate_link_click"
  | "qr_campaign_visit";

export function trackEvent(name: MoveInEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const payload = { event: name, ...properties };
  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  win.dataLayer = win.dataLayer ?? [];
  win.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("movein:analytics", { detail: payload }));
}
