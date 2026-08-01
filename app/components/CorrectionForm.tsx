"use client";

import { FormEvent, useRef, useState } from "react";
import { correctionCategories, correctionIssueTypes } from "../lib/corrections";
import { trackEvent } from "../lib/analytics";

type FieldErrors = Record<string, string>;

export function CorrectionForm({ initialZip = "" }: { initialZip?: string }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const startedAt = useRef(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setMessage(""); setErrors({});
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/corrections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, startedAt: startedAt.current }) });
      const payload = await response.json() as { error?: string; message?: string; fields?: FieldErrors };
      if (!response.ok) { setErrors(payload.fields ?? {}); setMessage(payload.error ?? "We could not submit the correction."); return; }
      form.reset(); setMessage(payload.message ?? "Thanks. Your correction was received."); startedAt.current = 0; trackEvent("correction_form_success", { source_page: "/corrections" });
    } catch { setMessage("We could not reach MoveIn. Check your connection and try again."); }
    finally { setPending(false); }
  }

  const error = (name: string) => errors[name] ? <small className="field-error" id={`${name}-error`}>{errors[name]}</small> : null;
  return <form className="correction-form" onSubmit={submit} onFocus={() => { if (!startedAt.current) startedAt.current = Date.now(); }} noValidate>
    <div className="form-row"><label>ZIP code<input name="zipCode" inputMode="numeric" autoComplete="postal-code" maxLength={5} defaultValue={initialZip} aria-invalid={Boolean(errors.zipCode)} aria-describedby={errors.zipCode ? "zipCode-error" : undefined} required /></label>{error("zipCode")}</div>
    <div className="form-row"><label>Issue type<select name="issueType" defaultValue="" aria-invalid={Boolean(errors.issueType)} aria-describedby={errors.issueType ? "issueType-error" : undefined} required><option value="" disabled>Select an issue</option>{correctionIssueTypes.map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}</select></label>{error("issueType")}</div>
    <div className="form-row"><label>Service category <span>(optional)</span><select name="category" defaultValue="" aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "category-error" : undefined}><option value="">Select a category</option>{correctionCategories.map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}</select></label>{error("category")}</div>
    <div className="form-row"><label>Provider name <span>(optional)</span><input name="providerName" maxLength={120} placeholder="Example: City water utility" aria-invalid={Boolean(errors.providerName)} aria-describedby={errors.providerName ? "providerName-error" : undefined} /></label>{error("providerName")}</div>
    <div className="form-row"><label>What should be corrected?<textarea name="details" rows={6} maxLength={2000} placeholder="Tell us what is incorrect or missing. Do not include account numbers or passwords." aria-invalid={Boolean(errors.details)} aria-describedby={errors.details ? "details-error" : undefined} required /></label>{error("details")}</div>
    <div className="form-row"><label>Supporting URL <span>(optional)</span><input name="sourceUrl" type="url" inputMode="url" placeholder="https://…" maxLength={500} aria-invalid={Boolean(errors.sourceUrl)} aria-describedby={errors.sourceUrl ? "sourceUrl-error" : undefined} /></label>{error("sourceUrl")}</div>
    <div className="form-row"><label>Reply email <span>(optional)</span><input name="replyEmail" type="email" autoComplete="email" maxLength={254} aria-invalid={Boolean(errors.replyEmail)} aria-describedby={errors.replyEmail ? "replyEmail-error" : undefined} /></label>{error("replyEmail")}</div>
    <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <button className="button" type="submit" disabled={pending}>{pending ? "Submitting…" : "Submit correction"}</button>
    {message ? <p className={Object.keys(errors).length ? "form-message error" : "form-message"} role="status" aria-live="polite">{message}</p> : null}
  </form>;
}
