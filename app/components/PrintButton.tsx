"use client";

import { Printer } from "lucide-react";
import { trackEvent } from "../lib/analytics";

export function PrintButton({ resourceSlug, label = "Print this checklist", sourcePage }: { resourceSlug: string; label?: string; sourcePage?: string }) {
  const print = () => {
    const source_page = sourcePage ?? window.location.pathname;
    trackEvent("printable_resource_click", { resource_slug: resourceSlug, source_page, action: "print" });
    trackEvent("printable_print", { printable_slug: resourceSlug, source_page });
    if (resourceSlug === "internet-setup-checklist") trackEvent("internet_checklist_print", { source_page });
    try { window.print(); } catch { /* Printing is browser-controlled and must never break the page. */ }
  };
  return <button className="button print-button" type="button" onClick={print}><Printer size={17} aria-hidden="true" />{label}</button>;
}
