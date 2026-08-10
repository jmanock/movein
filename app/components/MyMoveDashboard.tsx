"use client";

import { CalendarDays, CheckCircle2, MapPin, Printer, RotateCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { emptyMyMoveState, getBrowserStorage, type MoveProfile, type MyMoveState, phaseForMoveDate, readMyMoveState, tasksForProfile, writeMyMoveState } from "../lib/my-move";
import { Checklist } from "./Checklist";
import { DontForget } from "./DontForget";

type LocationState = { kind: "idle" | "loading" | "supported" | "unsupported" | "error"; county?: string; city?: string; providerSummary?: Array<{ label: string; names: string[] }> };
const phases = ["Before the move", "Move-in day", "First week", "First 30 days"] as const;

export function MyMoveDashboard() {
  const [state, setState] = useState<MyMoveState>(emptyMyMoveState());
  const [draft, setDraft] = useState<MoveProfile>({ moveDate: "", zip: "", audience: "homeowner" });
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState<LocationState>({ kind: "idle" });

  useEffect(() => {
    const storage = getBrowserStorage();
    const loaded = readMyMoveState(storage);
    queueMicrotask(() => { setState(loaded.state); setStorageAvailable(loaded.available); setReady(true); if (loaded.state.profile) setDraft(loaded.state.profile); });
    const refresh = () => { const next = readMyMoveState(storage).state; setState(next); if (next.profile) setDraft(next.profile); };
    window.addEventListener("movein:my-move-updated", refresh);
    return () => window.removeEventListener("movein:my-move-updated", refresh);
  }, []);

  useEffect(() => {
    if (!state.profile?.zip) return;
    let active = true; queueMicrotask(() => { if (active) setLocation({ kind: "loading" }); });
    fetch(`/api/lookup?zip=${state.profile.zip}`).then(async (response) => {
      if (!active) return;
      if (response.status === 404) { setLocation({ kind: "unsupported" }); return; }
      if (!response.ok) { setLocation({ kind: "error" }); return; }
      const result = await response.json();
      const groups = [["Electricity", result.providers.electricity], ["Water and sewer", [...result.providers.water, ...result.providers.sewer]], ["Internet", result.providers.internet], ["Trash and recycling", result.providers.trashRecycling]] as const;
      setLocation({ kind: "supported", county: result.county, city: result.city, providerSummary: groups.map(([label, providers]) => ({ label, names: [...new Set(providers.filter((provider: { providerType?: string }) => provider.providerType !== "official_lookup").map((provider: { name: string }) => provider.name))].slice(0, 3) as string[] })) });
    }).catch(() => { if (active) setLocation({ kind: "error" }); });
    return () => { active = false; };
  }, [state.profile?.zip]);

  const timing = phaseForMoveDate(state.profile?.moveDate ?? "");
  const visibleTasks = useMemo(() => tasksForProfile(state.profile).filter((task) => !state.dismissedTaskIds.includes(task.id)), [state]);
  const completed = useMemo(() => new Set(state.completedTaskIds), [state.completedTaskIds]);
  const persist = (next: MyMoveState) => { setState(next); const saved = writeMyMoveState(next, getBrowserStorage()); setStorageAvailable(saved); if (saved) window.dispatchEvent(new CustomEvent("movein:my-move-updated")); };
  const submit = (event: FormEvent) => {
    event.preventDefault(); setMessage("");
    if (!/^\d{5}$/.test(draft.zip)) { setMessage("Enter a valid five-digit ZIP code."); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.moveDate)) { setMessage("Choose your move date."); return; }
    const started = !state.profile;
    persist({ ...state, profile: draft });
    setMessage(started ? "My Move is ready." : "Move details updated.");
    if (started) trackEvent("my_move_started", { homeowner_or_renter: draft.audience, move_phase: phaseForMoveDate(draft.moveDate).phase, source_page: "/my-move" });
  };
  const reset = () => {
    if (!window.confirm("Reset My Move and remove all saved progress from this browser?")) return;
    const previous = state.profile; persist(emptyMyMoveState()); setDraft({ moveDate: "", zip: "", audience: "homeowner" }); setLocation({ kind: "idle" }); setMessage("My Move was reset.");
    trackEvent("my_move_reset", { homeowner_or_renter: previous?.audience, move_phase: previous ? phaseForMoveDate(previous.moveDate).phase : undefined, source_page: "/my-move" });
  };

  if (!ready) return <div className="my-move-loading" aria-live="polite">Loading your local checklist…</div>;
  return <>
    <section className="my-move-setup" aria-labelledby="move-details-heading"><div><span className="eyebrow">Private by design</span><h2 id="move-details-heading">{state.profile ? "Your move details" : "Build your checklist"}</h2><p>Your checklist is saved only in this browser unless you clear it. Nothing here is synced to MoveIn.</p></div><form onSubmit={submit} noValidate><label htmlFor="move-date">Move date</label><input id="move-date" type="date" value={draft.moveDate} onChange={(event) => setDraft({ ...draft, moveDate: event.currentTarget.value })} required /><label htmlFor="move-zip">ZIP code</label><input id="move-zip" inputMode="numeric" autoComplete="postal-code" maxLength={5} pattern="[0-9]{5}" value={draft.zip} onChange={(event) => setDraft({ ...draft, zip: event.currentTarget.value.replace(/\D/g, "").slice(0, 5) })} required /><fieldset><legend>I am moving as a</legend><label><input type="radio" name="audience" checked={draft.audience === "homeowner"} onChange={() => setDraft({ ...draft, audience: "homeowner" })} /> Homeowner</label><label><input type="radio" name="audience" checked={draft.audience === "renter"} onChange={() => setDraft({ ...draft, audience: "renter" })} /> Renter</label></fieldset><button className="button" type="submit">{state.profile ? "Update My Move" : "Create My Move"}</button><p className={message.includes("valid") || message.includes("Choose") ? "form-message error" : "form-message"} aria-live="polite">{message}</p></form></section>
    {!storageAvailable ? <aside className="storage-warning" role="status"><ShieldCheck size={19} aria-hidden="true" /><p>Browser storage is unavailable. My Move still works during this visit, but progress may not return after you leave.</p></aside> : null}
    {state.profile ? <>
      <section className="move-status"><div><CalendarDays aria-hidden="true" /><span>Current phase</span><strong>{timing.label}</strong></div><div><CheckCircle2 aria-hidden="true" /><span>Progress</span><strong>{completed.size} of {visibleTasks.length} complete</strong></div><div><MapPin aria-hidden="true" /><span>Move</span><strong>{state.profile.audience === "homeowner" ? "Homeowner" : "Renter"} · {state.profile.zip}</strong></div></section>
      <LocationContext location={location} zip={state.profile.zip} />
      {state.internetProviders.length ? <section className="my-move-internet"><span className="eyebrow">Internet</span><h2>Possible providers you saved</h2><p>{state.internetProviders.join(" · ")}</p><p>Compare providers, check the exact address, schedule installation, and keep account details private.</p><Link href="/internet/compare">Continue comparing internet options</Link></section> : null}
      <div className="my-move-checklists">{phases.map((phase) => { const tasks = visibleTasks.filter((task) => task.phase === phase); return <section key={phase}><div className="checklist-section-heading"><div><span className="eyebrow">{phase}</span><h2>{phase === "Before the move" ? "Set up the handoff" : phase === "Move-in day" ? "Document and check the essentials" : phase === "First week" ? "Update records and learn the routine" : "Create the records future-you will need"}</h2></div><span>{tasks.filter((task) => completed.has(task.id)).length}/{tasks.length}</span></div><Checklist items={tasks.map((task) => ({ ...task, added: state.addedTaskIds.includes(task.id) }))} completed={completed} onToggle={(id, checked) => { const next = new Set(state.completedTaskIds); if (checked) next.add(id); else next.delete(id); persist({ ...state, completedTaskIds: [...next] }); if (checked) { const task = visibleTasks.find((item) => item.id === id); trackEvent("my_move_task_completed", { homeowner_or_renter: state.profile!.audience, task_category: task?.category ?? "other", move_phase: timing.phase, source_page: "/my-move" }); } }} onDismiss={(id) => persist({ ...state, dismissedTaskIds: [...new Set([...state.dismissedTaskIds, id])], completedTaskIds: state.completedTaskIds.filter((taskId) => taskId !== id) })} /></section>; })}</div>
      <DontForget sourcePage="/my-move" />
      <section className="my-move-actions no-print"><button type="button" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> Print / Save as PDF</button><button type="button" onClick={reset}><RotateCcw size={16} aria-hidden="true" /> Reset My Move</button></section>
    </> : null}
  </>;
}

function LocationContext({ location, zip }: { location: LocationState; zip: string }) {
  if (location.kind === "loading") return <section className="location-context" aria-live="polite"><p>Checking reviewed local information…</p></section>;
  if (location.kind === "unsupported") return <section className="location-context"><span className="eyebrow">Local coverage</span><h2>Your general checklist is ready.</h2><p>MoveIn does not support ZIP {zip} yet. Local provider coverage is expanding, but that never blocks My Move.</p><Link href={`/request-zip?zip=${zip}`}>Request this ZIP</Link></section>;
  if (location.kind === "error") return <section className="location-context"><p>Local information is temporarily unavailable. Your saved checklist still works.</p></section>;
  if (location.kind !== "supported") return null;
  return <section className="location-context"><span className="eyebrow">Reviewed local starting points</span><h2>{location.city ? `${location.city}, Florida` : `ZIP ${zip}`}{location.county ? ` · ${location.county} County` : ""}</h2><p>These are possible providers, not address-level guarantees. Confirm the complete address before starting service.</p><div>{location.providerSummary?.map((group) => <article key={group.label}><strong>{group.label}</strong><span>{group.names.length ? group.names.join(" · ") : "Confirm by address"}</span></article>)}</div><nav><Link href={`/lookup/${zip}`}>Open full ZIP result</Link>{location.county ? <Link href={`/${location.county.toLowerCase()}-county-utilities`}>Open county utility guide</Link> : null}</nav></section>;
}
