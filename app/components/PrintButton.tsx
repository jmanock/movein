"use client";

import { Printer } from "lucide-react";
import { trackEvent } from "../lib/analytics";

export function PrintButton({ label = "Print this checklist" }: { label?: string }) {
  return <button className="button print-button" type="button" onClick={() => { trackEvent("print_resource"); window.print(); }}><Printer size={17} aria-hidden="true" />{label}</button>;
}
