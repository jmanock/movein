"use client";

import { Printer } from "lucide-react";
import { trackEvent } from "../lib/analytics";

export function PrintButton({ resourceSlug, label = "Print this checklist" }: { resourceSlug: string; label?: string }) {
  return <button className="button print-button" type="button" onClick={() => { trackEvent("printable_resource_click", { resource_slug: resourceSlug, source_page: `/resources/printables/${resourceSlug}`, action: "print" }); window.print(); }}><Printer size={17} aria-hidden="true" />{label}</button>;
}
