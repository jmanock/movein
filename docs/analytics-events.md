# Privacy-safe front-end events

MoveIn dispatches the typed GA4 events documented in `docs/google-analytics.md`. The implementation never serializes complete forms and does not include addresses, email, correction text, account numbers, or phone numbers in custom-event parameters. Ordinary lookup events use county, state, status, and category counts rather than the entered ZIP.

The explicit `zip_coverage_request` event is the only ZIP-specific exception. It sends a validated five-digit unsupported ZIP and `source_page=/request-zip` without any other visitor identifier so aggregate demand can prioritize future research. `county_page_navigation` records only the public county name and source page.

The shared utility in `app/lib/analytics.ts` sends to `window.gtag` only when GA4 is enabled and available. It also dispatches a browser-local `movein:analytics` event containing the same allowlisted event name and coarse parameters for non-vendor testing. Both paths fail silently when tracking is disabled or blocked.
