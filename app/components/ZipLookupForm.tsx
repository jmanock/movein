"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useId, useState, useTransition } from "react";
import { trackEvent } from "../lib/analytics";

export function ZipLookupForm({ compact = false, initialZip = "" }: { compact?: boolean; initialZip?: string }) {
  const router = useRouter();
  const inputId = useId();
  const routerErrorId = `${inputId}-message`;
  const [zip, setZip] = useState(initialZip);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = zip.trim();
    if (!/^\d{5}$/.test(normalized)) {
      setError("Enter a valid five-digit ZIP code.");
      return;
    }
    trackEvent("zip_lookup_submitted");
    setError("");
    try {
      const response = await fetch(`/api/lookup?zip=${normalized}`);
      if (!response.ok) {
        const payload = await response.json() as { error?: string };
        const outsidePilot = response.status === 404 && /pilot area/i.test(payload.error ?? "");
        trackEvent(outsidePilot ? "zip_lookup_outside_pilot" : "zip_lookup_unknown");
        setError(payload.error ?? "We could not find that ZIP code.");
        return;
      }
      trackEvent("zip_lookup_success");
      startTransition(() => router.push(`/lookup/${normalized}`));
    } catch { setError("We could not reach MoveIn. Check your connection and try again."); }
  }

  function submitWithEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  return <form className={compact ? "zip-form compact" : "zip-form"} onSubmit={submit} noValidate aria-busy={pending}>
    <label htmlFor={inputId}>ZIP code</label>
    <div className="zip-controls">
      <input
        id={inputId}
        name="zip"
        value={zip}
        onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
        onKeyDown={submitWithEnter}
        inputMode="numeric"
        autoComplete="postal-code"
        enterKeyHint="search"
        placeholder="Enter ZIP code"
        maxLength={5}
        aria-invalid={Boolean(error)}
        aria-describedby={routerErrorId}
      />
      <button className="button" type="submit" disabled={pending}><Search size={19} aria-hidden="true" />{pending ? "Finding…" : "Find My Services"}</button>
    </div>
    <p className={error ? "form-message error" : "form-message"} id={routerErrorId} role={error ? "alert" : "status"} aria-live="polite">{error || "Florida is available first. More states will be added as data is verified."}</p>
  </form>;
}
