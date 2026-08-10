# Privacy-safe front-end events

MoveIn dispatches the typed GA4 events documented in `docs/google-analytics.md`. The implementation never serializes complete forms and does not include addresses, email, correction text, account numbers, or phone numbers in custom-event parameters. Ordinary lookup events use county, state, status, and category counts rather than the entered ZIP.

The explicit `zip_coverage_request` event is the only ZIP-specific exception. It sends a validated five-digit unsupported ZIP and `source_page=/request-zip` without any other visitor identifier so aggregate demand can prioritize future research. `county_page_navigation` records only the public county name and source page. `guide_to_zip_lookup` records the guide slug and source page when a visitor submits a guide's ZIP form; the entered ZIP remains excluded.

The shared utility in `app/lib/analytics.ts` sends to `window.gtag` only when GA4 is enabled and available. It also dispatches a browser-local `movein:analytics` event containing the same allowlisted event name and coarse parameters for non-vendor testing. Both paths fail silently when tracking is disabled or blocked.

## My Move and retention events

| Event | Allowed parameters |
| --- | --- |
| `my_move_started` | `homeowner_or_renter`, derived `move_phase`, `source_page` |
| `my_move_task_completed` | audience, `task_category`, derived phase, source page |
| `my_move_reset` | audience, derived phase, source page |
| `add_to_my_move` | allowlisted task category and source page |
| `utility_added_to_my_move` | utility task category and source page |
| `printable_view` / `printable_print` | public printable slug and source page |
| `first_30_days_view` | source page |
| `dont_forget_impression` / `dont_forget_action` | public reminder ID and source page |

Never add the move date, full checklist or task text, notes, exact address, name, email, phone, account information, home inventory, or form contents. The shared sanitizer blocks `move_date`, `notes`, `checklist_text`, and `task_text` in addition to existing personal-data keys.

For weekly organic-growth reviews, use page paths to compare supported ZIP traffic, `zip_coverage_request` to prioritize unsupported areas, `printable_resource_click` to distinguish opens from print actions, `county_page_navigation` for hub discovery, and `guide_to_zip_lookup` for guide-assisted searches. Never join these events to email, exact street address, correction text, or other personally identifying form content.
