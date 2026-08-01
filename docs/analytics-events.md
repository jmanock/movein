# Privacy-safe front-end events

MoveIn dispatches the typed GA4 events documented in `docs/google-analytics.md`. The implementation never serializes form fields and does not include entered ZIP codes, addresses, email, correction text, account numbers, or phone numbers in custom-event parameters.

The shared utility in `app/lib/analytics.ts` sends to `window.gtag` only when GA4 is enabled and available. It also dispatches a browser-local `movein:analytics` event containing the same allowlisted event name and coarse parameters for non-vendor testing. Both paths fail silently when tracking is disabled or blocked.
