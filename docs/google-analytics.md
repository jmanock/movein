# Google Analytics 4

## Configuration

MoveIn loads one Google tag from the root App Router layout when all of these are true:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QC9FYWHVZZ` is present and valid;
- the application is running in production, or local collection was explicitly enabled;
- the environment is not a test run; and
- browser Do Not Track, Global Privacy Control, or the standard `ga-disable-{measurementId}` flag has not disabled tracking.

No package or page installs another tag. The script uses Next.js `Script` with `afterInteractive`, so it does not block initial rendering. Tag or ad-blocker failures are ignored.

### Local setup

Analytics is off during ordinary `npm run dev`. To deliberately test from a local browser, create an uncommitted `.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QC9FYWHVZZ
NEXT_PUBLIC_GA_ENABLE_DEV=true
NEXT_PUBLIC_GA_DEBUG=true
```

Remove the two opt-in flags after testing. Never commit `.env.local`.

### Production setup

Set this in the production application environment before building and restarting:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QC9FYWHVZZ
```

Because `NEXT_PUBLIC_` values are embedded during `next build`, changing the ID requires a new production build and PM2 restart.

## Page views and duplicate prevention

`GoogleAnalytics` configures GA4 with `send_page_view: false` and sends exactly one manual `page_view` for the initial pathname and each App Router pathname change. Query strings are intentionally excluded. A last-path guard prevents repeat effects for the same route.

In the GA4 web data stream, open Enhanced Measurement → Page views → advanced settings and disable **Page changes based on browser history events**. Google documents that this property setting can otherwise send history-based page views even when the tag config uses `send_page_view: false`. Do not add GTM, another Google tag, or another route-change listener alongside this implementation.

## Custom events

| Event | Parameters |
|---|---|
| `zip_lookup_submit` | `source_page` |
| `zip_lookup_success` | `county`, `state`, `coverage_status`, `provider_category_count`, `source_page` |
| `zip_lookup_partial` | same aggregate lookup fields |
| `zip_lookup_unsupported` | `source_page` |
| `zip_coverage_request` | `requested_zip`, `source_page=/request-zip` |
| `provider_official_link_click` | `service_category`, `provider_name`, `county`, `link_type` |
| `provider_phone_click` | provider fields plus `phone_type` |
| `provider_start_service_click` | provider fields and `link_type` |
| `provider_address_check_click` | provider fields and `link_type` |
| `outage_phone_click` | provider fields plus `phone_type=outage` |
| `outage_map_click` | provider fields and `link_type=outage_map` |
| `guide_link_click` | `guide_slug`, normalized `source_page` |
| `guide_to_zip_lookup` | `guide_slug`, `source_page` |
| `county_page_navigation` | `county`, `source_page` |
| `correction_form_success` | `source_page=/corrections` only |
| `printable_resource_click` | `resource_slug`, `source_page`, `action` |

The lookup submit event is emitted only after five-digit client validation. Ordinary lookup events never include the entered ZIP value. `zip_coverage_request` is the one intentional exception: after confirming that a valid five-digit ZIP is unsupported, it sends that requested ZIP so aggregate demand can guide research. No email, name, phone, street address, or account identifier is collected with it. Result-page guide sources are normalized to `/lookup/[zip]`.

## Privacy restrictions

Do not add email, correction descriptions, full IP addresses, exact street addresses, utility accounts, Social Security numbers, visitor-entered phone numbers, or other form content to event parameters. Google signals and ad-personalization signals are disabled in the tag configuration. Provider names and published provider phone types are business-directory context; the telephone number itself is never sent.

## Testing

### Realtime

1. Deploy or use the explicit local opt-in above.
2. Open GA4 → Reports → Realtime.
3. Visit several pages, submit one supported and one unsupported lookup, and request one unsupported ZIP.
4. Confirm one `page_view` per pathname and the expected custom events.
5. Inspect parameters to confirm the requested ZIP appears only on `zip_coverage_request`, and that no email, address, phone, account, or correction content appears.

### DebugView

Use the local `NEXT_PUBLIC_GA_DEBUG=true` flag or Google Tag Assistant for your own browser, then open GA4 → Admin → Data display → DebugView. Navigate between App Router pages and confirm one page view per transition. Remove the debug flag when finished so developer traffic is not collected routinely.

## Search Console linking

In GA4, use Admin → Product links → Search Console links, choose the verified `https://movein.guide` Search Console property, select the MoveIn web stream, review, and submit. This is an account-level action and is not performed by application code. After linking, Search Console reporting can take time to populate.

## Growth questions this setup can answer

- Supported ZIP demand can be compared by the `/lookup/[zip]` page path; no custom lookup event sends that ZIP.
- Unsupported ZIP demand is counted only after the visitor explicitly requests a valid unsupported ZIP through `zip_coverage_request`.
- Printable discovery and print intent use `printable_resource_click` with a public resource slug and action.
- County navigation and guide-to-lookup journeys use coarse public route and county fields.
- Provider-link events measure exits to official sources without sending visitor-entered addresses or contact details.

## Troubleshooting duplicates

Use Tag Assistant and the browser Network panel to confirm there is one `gtag/js` request and one `page_view` collection request per pathname. If duplicates appear, check for GTM, an injected host-level tag, another layout script, or Enhanced Measurement history tracking. Keep one owner for page views: this root `GoogleAnalytics` component.
