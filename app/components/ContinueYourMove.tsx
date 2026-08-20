"use client";

import { ArrowRight, CheckCircle2, ListChecks, Wifi } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readInternetComparison } from "../lib/internet-comparison";
import { getBrowserStorage, readMyMoveState } from "../lib/my-move";

type Progress = { myMoveComplete: number; internetSaved: number; addressComplete: number };

export function ContinueYourMove() {
  const [progress, setProgress] = useState<Progress | null>(null);
  useEffect(() => {
    const refresh = () => {
      const storage = getBrowserStorage();
      if (!storage) return;
      const move = readMyMoveState(storage).state;
      const internetSaved = readInternetComparison(storage).providers.length;
      const addressComplete = Math.max(readCount(storage, "movein:address-progress:v1"), readCount(storage, "movein:printable:address-update-checklist:v1"));
      const next = { myMoveComplete: move.completedTaskIds.length, internetSaved, addressComplete };
      setProgress(move.profile || Object.values(next).some(Boolean) ? next : null);
    };
    queueMicrotask(refresh);
    window.addEventListener("movein:my-move-updated", refresh);
    window.addEventListener("movein:internet-comparison-updated", refresh);
    return () => { window.removeEventListener("movein:my-move-updated", refresh); window.removeEventListener("movein:internet-comparison-updated", refresh); };
  }, []);
  if (!progress) return null;
  return <aside className="continue-your-move no-print" aria-labelledby="continue-your-move-heading"><div><span className="eyebrow">Saved in this browser</span><h2 id="continue-your-move-heading">Continue your move</h2><p>No account or sync. Only this browser can see these progress counts.</p></div><div>{progress.addressComplete ? <Link href="/resources/change-your-address#address-checklist"><ListChecks aria-hidden="true" /><span><strong>{progress.addressComplete} address updates complete</strong><small>Continue the checklist</small></span><ArrowRight aria-hidden="true" /></Link> : null}{progress.internetSaved ? <Link href="/internet/compare"><Wifi aria-hidden="true" /><span><strong>{progress.internetSaved} Internet {progress.internetSaved === 1 ? "provider" : "providers"} saved</strong><small>Continue the comparison</small></span><ArrowRight aria-hidden="true" /></Link> : null}<Link href="/my-move"><CheckCircle2 aria-hidden="true" /><span><strong>{progress.myMoveComplete} My Move tasks complete</strong><small>Open My Move</small></span><ArrowRight aria-hidden="true" /></Link></div></aside>;
}

function readCount(storage: Storage, key: string) {
  try { const value = JSON.parse(storage.getItem(key) ?? "[]"); return Array.isArray(value) ? value.filter((item) => typeof item === "string").length : 0; }
  catch { return 0; }
}
