"use client";

import { useState } from "react";
import { internetProviders } from "../data/internet";
import Link from "next/link";

export function MovingInternetChooser() {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  return <section className="moving-internet-tool"><div><span className="eyebrow">Moving your Internet</span><h2>Do you already have Internet service?</h2><p>Your answer changes the first useful step. MoveIn never collects the street address.</p><div><button type="button" aria-pressed={answer === "yes"} onClick={() => setAnswer("yes")}>Yes</button><button type="button" aria-pressed={answer === "no"} onClick={() => setAnswer("no")}>No</button></div></div>{answer === "yes" ? <div className="moving-internet-result"><h3>Check whether your current provider serves the new address.</h3><p>Do this before canceling. Technology, equipment, and appointment requirements may change.</p><div>{internetProviders.map((provider) => provider.movingOrTransferUrl ? <a href={provider.movingOrTransferUrl} target="_blank" rel="noopener noreferrer" key={provider.id}>{provider.providerName} transfer or move</a> : null)}</div></div> : answer === "no" ? <div className="moving-internet-result"><h3>Compare possible providers for the new ZIP.</h3><p>Check more than one address tool so a familiar provider does not become the only option by default.</p><Link className="button" href="/internet/compare">Compare Internet options</Link></div> : null}</section>;
}
