"use client";

import { useEffect } from "react";
import { trackEvent } from "../lib/analytics";

export function PrintableView({ slug }: { slug: string }) { useEffect(() => { const source_page = `/resources/printables/${slug}`; trackEvent("printable_view", { printable_slug: slug, source_page }); if (slug === "internet-setup-checklist") trackEvent("internet_checklist_view", { source_page }); }, [slug]); return null; }
export function FirstThirtyDaysView() { useEffect(() => { trackEvent("first_30_days_view", { source_page: "/first-30-days" }); }, []); return null; }
