"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useId, useState, useTransition } from "react";
import { trackEvent } from "../lib/analytics";

export function ZipLookupForm({ compact = false, initialZip = "", context = "inline" }: { compact?: boolean; initialZip?: string; context?: string }) {
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
    if (/^\/(?:resources|homeowners|renters)\//.test(context)) trackEvent("guide_to_zip_lookup", { guide_slug: context.split("/").at(-1) ?? "guide", source_page: context });
    trackEvent("zip_lookup_submit", { source_page: context });
    setError("");
    try {
      const response = await fetch(`/api/lookup?zip=${normalized}`);
      if (!response.ok) {
        const payload = await response.json() as { error?: string };
        if (response.status === 404) { trackEvent("zip_lookup_unsupported", { source_page: context }); startTransition(() => router.push(`/lookup/${normalized}`)); return; }
        setError(payload.error ?? "We could not find that ZIP code.");
        return;
      }
      const payload = await response.json() as { county?: string; state?: string; status?: string; providers?: Record<string, unknown[]> };
      const analytics = { county: payload.county, state: payload.state, coverage_status: payload.status, provider_category_count: Object.values(payload.providers ?? {}).filter((providers) => providers.length > 0).length, source_page: context };
      trackEvent("zip_lookup_success", analytics);
      if (payload.status && payload.status !== "verified") trackEvent("zip_lookup_partial", analytics);
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
    <p className={error ? "form-message error" : "form-message"} id={routerErrorId} role={error ? "alert" : "status"} aria-live="polite">{error || "Selected Central Florida ZIPs are available. No email or account required."}</p>
  </form>;
}
