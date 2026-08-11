"use client";

import { useEffect } from "react";
import { trackEvent } from "../lib/analytics";

export function RenterAnalytics({ path }: { path: string }) {
  useEffect(() => {
    if (path === "/renters") trackEvent("renter_hub_view", { source_page: path, homeowner_or_renter: "renter" });
    if (path === "/renters/renters-insurance-and-deposits") trackEvent("renter_insurance_guide_view", { source_page: path, homeowner_or_renter: "renter" });
    if (path === "/renters/move-in-costs") trackEvent("move_in_cost_guide_view", { source_page: path, homeowner_or_renter: "renter" });
    if (path === "/renters/free-move-in-kit") trackEvent("free_renter_kit_view", { source_page: path, homeowner_or_renter: "renter" });
  }, [path]);
  return null;
}
