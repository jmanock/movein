"use client";

import { CheckCircle2, MapPin } from "lucide-react";
import { FormEvent, useId, useState, useTransition } from "react";
import { trackEvent } from "../lib/analytics";

export function ZipRequestForm({ initialZip = "" }: { initialZip?: string }) {
  const id = useId();
  const [zip, setZip] = useState(initialZip.replace(/\D/g, "").slice(0, 5));
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requestedZip = zip.trim();
    setSuccess(false);
    if (!/^\d{5}$/.test(requestedZip)) { setMessage("Enter a valid five-digit ZIP code."); return; }
    startTransition(async () => {
      try {
        const response = await fetch(`/api/lookup?zip=${requestedZip}`);
        if (response.ok) {
          setMessage(`ZIP Code ${requestedZip} is already available. Use the lookup to see its current result.`);
          return;
        }
        if (response.status !== 404) { setMessage("We could not check that ZIP right now. Please try again."); return; }
        trackEvent("zip_coverage_request", { requested_zip: requestedZip, source_page: "/request-zip" });
        setSuccess(true);
        setMessage(`Thanks. Your request for ZIP Code ${requestedZip} will help prioritize future coverage.`);
      } catch { setMessage("We could not reach MoveIn. Check your connection and try again."); }
    });
  }

  return <form className="zip-request-form" onSubmit={submit} noValidate aria-busy={pending}><label htmlFor={id}>ZIP code to request</label><div className="zip-controls"><input id={id} name="requested_zip" value={zip} onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))} inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="Enter ZIP code" aria-describedby={`${id}-message`} aria-invalid={Boolean(message) && !success} /><button className="button" disabled={pending} type="submit"><MapPin size={18} aria-hidden="true" />{pending ? "Checking…" : "Request this ZIP"}</button></div><p id={`${id}-message`} className={success ? "form-message success" : message ? "form-message error" : "form-message"} role={message ? "status" : undefined} aria-live="polite">{success ? <CheckCircle2 size={17} aria-hidden="true" /> : null}{message || "No email, account, or street address is required."}</p></form>;
}
