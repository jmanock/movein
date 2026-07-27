"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("Get useful reminders. Unsubscribe anytime.");
  const startedAt = useRef(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, startedAt: startedAt.current || Date.now() - 1000 }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Please try again.");
      setStatus("success");
      setMessage("You’re in. We’ll help you know what to do next.");
      event.currentTarget.reset();
      trackEvent("newsletter_submit", { form: "primary" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We couldn’t save that. Please try again.");
    }
  }

  return <form className="newsletter-form" onSubmit={submit} onFocusCapture={() => { if (!startedAt.current) startedAt.current = Date.now(); }} aria-describedby="newsletter-status">
    <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="field-row"><label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>I’m a…<select name="audience" required defaultValue=""><option value="" disabled>Choose one</option><option value="homeowner">Homeowner</option><option value="renter">Renter</option><option value="planning">Still planning</option></select></label></div>
    <div className="field-row"><label>Move month <input name="moveMonth" type="month" /></label><label>State <input name="state" maxLength={30} autoComplete="address-level1" placeholder="Florida" /></label></div>
    <p className="consent">By subscribing, you agree to receive practical MoveIn emails. See our <Link href="/privacy">privacy policy</Link>.</p>
    <button className="button" type="submit" disabled={status === "loading"}>{status === "loading" ? "Saving…" : "Know what to do next"}<ArrowRight size={17} /></button>
    <p id="newsletter-status" className={`form-status ${status}`} role="status">{message}</p>
  </form>;
}
