"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Printable } from "../data/printables";
import { Checklist } from "./Checklist";
import { trackEvent } from "../lib/analytics";

export function InteractiveChecklist({ printable }: { printable: Printable }) {
  const key = `movein:printable:${printable.slug}:v1`;
  const items = useMemo(() => printable.sections.flatMap((section, sectionIndex) => section.kind && section.kind !== "checklist" ? [] : section.items.map((title, itemIndex) => ({ id: `${sectionIndex}-${itemIndex}`, title, phase: section.title }))), [printable]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [started, setStarted] = useState(false);
  useEffect(() => { queueMicrotask(() => { try { const saved = JSON.parse(localStorage.getItem(key) ?? "[]"); if (Array.isArray(saved)) { const valid = saved.filter((item) => typeof item === "string"); setCompleted(new Set(valid)); if (printable.slug === "address-update-checklist" && valid.length) trackEvent("address_progress_return_visit", { source_page: `/resources/printables/${printable.slug}` }); } } catch { setStorageAvailable(false); } }); }, [key, printable.slug]);
  const save = (next: Set<string>) => { setCompleted(next); try { localStorage.setItem(key, JSON.stringify([...next])); } catch { setStorageAvailable(false); } };
  if (!items.length) return null;
  return <div className="web-checklist no-print"><div className="web-checklist-heading"><div><span className="eyebrow">Use it online</span><h2>Check items off in this browser</h2><p>{storageAvailable ? `Progress stays on this device. ${completed.size} of ${items.length} complete.` : "Browser storage is unavailable. You can still use and print the checklist during this visit."}</p></div><button type="button" onClick={() => { if (window.confirm("Reset this checklist on this browser?")) save(new Set()); }}><RotateCcw size={15} aria-hidden="true" /> Reset</button></div>{printable.sections.map((section, sectionIndex) => (!section.kind || section.kind === "checklist") ? <section key={section.title}><h3>{section.title}</h3><Checklist items={items.filter((item) => item.id.startsWith(`${sectionIndex}-`))} completed={completed} onToggle={(id, checked) => { const next = new Set(completed); if (checked) next.add(id); else next.delete(id); save(next); if (printable.slug === "address-update-checklist") { const source_page = `/resources/printables/${printable.slug}`; if (!started) { setStarted(true); trackEvent("address_checklist_started", { source_page }); } if (checked) trackEvent("address_task_completed", { source_page, task_category: section.analyticsCategory ?? "other" }); } }} /></section> : null)}</div>;
}
