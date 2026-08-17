"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { printableBySlug } from "../data/printables";
import { trackEvent } from "../lib/analytics";
import { Checklist } from "./Checklist";
import { AddAddressTasksToMyMoveButton } from "./AddAddressTasksToMyMoveButton";

const STORAGE_KEY = "movein:address-progress:v1";
const SOURCE_PAGE = "/resources/change-your-address";

export function AddressChangeProgress() {
  const printable = printableBySlug.get("address-update-checklist")!;
  const items = useMemo(() => printable.sections.flatMap((section, sectionIndex) => section.items.map((title, itemIndex) => ({ id: `${sectionIndex}-${itemIndex}`, title, phase: section.title, category: section.analyticsCategory ?? "other" }))), [printable]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [started, setStarted] = useState(false);
  useEffect(() => { queueMicrotask(() => { trackEvent("change_address_page_view", { source_page: SOURCE_PAGE }); try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); if (Array.isArray(saved)) { const valid = saved.filter((value): value is string => typeof value === "string" && items.some((item) => item.id === value)); setCompleted(new Set(valid)); if (valid.length) trackEvent("address_progress_return_visit", { source_page: SOURCE_PAGE }); } } catch { setStorageAvailable(false); } }); }, [items]);
  const save = (next: Set<string>) => { setCompleted(next); try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch { setStorageAvailable(false); } };
  return <section className="address-progress" id="address-checklist" aria-labelledby="address-progress-heading"><div className="address-progress-heading"><div><span className="eyebrow">Browser-only progress</span><h2 id="address-progress-heading">Work through every address update.</h2><p>{storageAvailable ? `Saved only on this device · ${completed.size} of ${items.length} complete` : `${completed.size} of ${items.length} complete during this visit`}</p></div><button type="button" onClick={() => { if (window.confirm("Reset address-change progress on this browser?")) save(new Set()); }}><RotateCcw size={15} aria-hidden="true" /> Reset</button></div><div className="address-progress-grid">{printable.sections.map((section, sectionIndex) => <section key={section.title}><h3>{section.title}</h3><Checklist items={items.filter((item) => item.id.startsWith(`${sectionIndex}-`))} completed={completed} onToggle={(id, checked) => { const next = new Set(completed); if (checked) next.add(id); else next.delete(id); save(next); if (!started) { setStarted(true); trackEvent("address_checklist_started", { source_page: SOURCE_PAGE }); } if (checked) trackEvent("address_task_completed", { source_page: SOURCE_PAGE, task_category: section.analyticsCategory ?? "other" }); }} /></section>)}</div><div className="address-progress-actions"><AddAddressTasksToMyMoveButton sourcePage={SOURCE_PAGE} /><Link href="/resources/printables/address-update-checklist">Open the printable checklist</Link><Link href="/resources/printables/new-address-information-sheet">Open the new-address information sheet</Link></div></section>;
}
