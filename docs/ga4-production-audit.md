# GA4 production audit

Audit date: August 29, 2026  
Property: MoveIn Guide  
Expected measurement ID: `G-QC9FYWHVZZ`

## Finding

The current public deployment is not missing its Google tag. A direct production check returned HTTP 200 and found exactly one `googletagmanager.com/gtag/js?id=G-QC9FYWHVZZ` reference in the rendered homepage. The Google tag endpoint returned HTTP 200. Nginx did not send a Content Security Policy that blocks Google Analytics. The deployed client bundle contains the `gtag` initialization, `send_page_view: false`, and manual page-view code.

Therefore the current zero-data GA4 screen cannot be attributed to an absent tag, wrong public ID, duplicate tag, blocking CSP, or missing root mount on the audited deployment. Search Console impressions are search-result appearances, not visits; a page can earn impressions without producing a GA session. The supplied Search Console history has shown very few clicks, so zero or near-zero measurable users can be consistent with the available evidence. Ad blockers, Do Not Track, Global Privacy Control, GA data filters, a mismatched GA property/data stream, reporting date or timezone, and a lack of unblocked visits remain account- or visitor-level possibilities that public source code cannot resolve.

## Previous implementation

- `app/layout.tsx` reads `NEXT_PUBLIC_GA_MEASUREMENT_ID`, validates the `G-*` format, enables Analytics in production, and mounts one `GoogleAnalytics` component.
- `GoogleAnalytics` uses one `next/script` tag with `afterInteractive`.
- It initializes `window.dataLayer` and `window.gtag`, configures GA4 with `send_page_view: false`, and disables Google signals and ad-personalization signals.
- `usePathname` and a last-path reference own manual App Router page views.
- `trackEvent` is the single typed custom-event abstraction and silently tolerates blocking.
- Do Not Track, Global Privacy Control, `ga-disable-{measurementId}`, tests, and ordinary development disable collection.
- No Google Tag Manager, `@next/third-parties`, second tag component, or second page-view owner exists.

## Reliability defect and repair

The previous deployment instructions relied on a shell export before `npm run build`. A PM2 runtime value cannot retroactively supply a public value to an already-created static build, and there was no executable release check proving that the environment value reached `.next` or that the rendered production HTML contained the enabled tag. A future build without the export could therefore deploy normally while silently omitting Analytics.

The repair adds the public ID and an explicit false debug default to the PM2 configuration for runtime consistency, while still requiring `.env.production` to supply the ID before the build. It also adds `npm run analytics:check`. The command fails unless the current environment has a valid, expected measurement ID, the root integration is singular, no conflicting tag is present, the production bundle contains the ID, the rendered homepage contains exactly one enabled tag reference, the custom event layer exists, and the privacy blocklist is present. It writes only to ignored `runtime-reports/analytics-check.md` and never contacts Google.

Debug logging now reports sanitized page-view and event calls only when `NEXT_PUBLIC_GA_DEBUG=true`. Production remains false by default.

## What production verification can prove

Application verification can prove that the configured tag is rendered, the client bundle initializes the expected property, one logical page view is queued per path, custom events use the shared abstraction, and sensitive fields are excluded. Only GA4 Realtime or DebugView can prove that Google accepted an event into the intended property. Complete that account-side check after deployment using the steps in `docs/google-analytics.md`.
