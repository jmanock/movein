"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FormEvent, useId, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("Practical reminders only. Unsubscribe anytime.");
  const [errors, setErrors] = useState<{ email?: string; audience?: string }>({});
  const startedAt = useRef(0);
  const statusId = useId();
  const privacyId = useId();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const nextErrors: { email?: string; audience?: string } = {};
    if (!/^\S+@\S+\.\S+$/.test(String(payload.email ?? "").trim())) nextErrors.email = "Enter a valid email address.";
    if (!payload.audience) nextErrors.audience = "Choose the option that best describes your move.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus("error");
      setMessage("Please review the highlighted fields and try again.");
      trackEvent("newsletter_error", { form: "primary", reason: "validation" });
      return;
    }
    setErrors({});
    setStatus("loading");
    setMessage("Saving your preferences…");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, startedAt: startedAt.current || Date.now() - 1000 }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Please try again.");
      setStatus("success");
      setMessage("You’re in. We’ll help you know what to do next.");
      event.currentTarget.reset();
      trackEvent("newsletter_submit", { form: "primary" });
      trackEvent("newsletter_success", { form: "primary" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We couldn’t save that. Please try again.");
      trackEvent("newsletter_error", { form: "primary", reason: "request" });
    }
  }

  return <form className="newsletter-form" onSubmit={submit} noValidate onFocusCapture={() => { if (!startedAt.current) startedAt.current = Date.now(); }} aria-describedby={`${privacyId} ${statusId}`}>
    <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="field-row"><label>Email <span aria-hidden="true">*</span><input name="email" type="email" autoComplete="email" required placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${statusId} email-error` : statusId} />{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</label><label>I’m a… <span aria-hidden="true">*</span><select name="audience" required defaultValue="" aria-invalid={!!errors.audience} aria-describedby={errors.audience ? `${statusId} audience-error` : statusId}><option value="" disabled>Choose one</option><option value="homeowner">Homeowner</option><option value="renter">Renter</option><option value="planning">Still planning</option></select>{errors.audience && <span className="field-error" id="audience-error">{errors.audience}</span>}</label></div>
    <div className="field-row"><label>Move month <input name="moveMonth" type="month" /></label><label>State <input name="state" maxLength={30} autoComplete="address-level1" placeholder="Florida" /></label></div>
    <p className="consent" id={privacyId}>By subscribing, you agree to receive practical MoveIn emails. See our <Link href="/privacy">privacy policy</Link>. Practical reminders only. Unsubscribe anytime.</p>
    <button className="button" type="submit" disabled={status === "loading"}>{status === "loading" ? "Saving…" : "Know what to do next"}<ArrowRight size={17} aria-hidden="true" /></button>
    <p id={statusId} className={`form-status ${status}`} role={status === "error" ? "alert" : "status"} aria-live="polite">{message}</p>
  </form>;
}
