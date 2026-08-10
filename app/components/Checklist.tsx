"use client";

import Link from "next/link";
import type { MoveTaskPhase } from "../lib/my-move";

export type ChecklistItem = { id: string; title: string; description?: string; href?: string; phase: MoveTaskPhase | string; added?: boolean };

export function Checklist({ items, completed, onToggle, onDismiss, emptyMessage = "No tasks in this section." }: { items: ChecklistItem[]; completed: Set<string>; onToggle: (id: string, checked: boolean) => void; onDismiss?: (id: string) => void; emptyMessage?: string }) {
  if (!items.length) return <p className="checklist-empty">{emptyMessage}</p>;
  return <ul className="interactive-checklist">{items.map((item) => <li className={completed.has(item.id) ? "complete" : undefined} key={item.id}><label><input type="checkbox" checked={completed.has(item.id)} onChange={(event) => onToggle(item.id, event.currentTarget.checked)} /><span><strong>{item.title}</strong>{item.description ? <small>{item.description}</small> : null}{item.href ? item.href.startsWith("http") ? <a href={item.href} target="_blank" rel="noopener noreferrer">Review official requirements</a> : <Link href={item.href}>Open related guide</Link> : null}{item.added ? <em>Added from a guide</em> : null}</span></label>{onDismiss ? <button type="button" onClick={() => onDismiss(item.id)} aria-label={`Mark ${item.title} as not needed`}>Not needed</button> : null}</li>)}</ul>;
}
