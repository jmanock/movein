# Analytics event contract

MoveIn exposes a vendor-neutral event layer in `app/lib/analytics.ts`. Events are pushed to `window.dataLayer` and dispatched as `movein:analytics` browser events. A future analytics provider can consume either interface without changing feature components.

Never include email addresses, move dates, names, street addresses, free-form form values, or other personally identifying information in event properties.

| Event | Trigger | Safe properties |
|---|---|---|
| `homepage_cta_click` | Primary or Florida homepage CTA | `cta` |
| `entry_card_select` | Homepage intent card | `path` |
| `timeline_start` | Header or homepage timeline CTA | `source` |
| `timeline_task_complete` | Visitor checks a task | `task_id` |
| `timeline_completion` | All tasks in the current timeline scope are complete | `scope` |
| `timeline_reset` | Visitor resets progress | `scope` |
| `checklist_interaction` | Visitor checks or unchecks a timeline task | `task_id`, `complete` |
| `florida_guide_visit` | Florida guide CTA or card | `source`, `guide` |
| `checklist_download` | Print or download action | `checklist_id` |
| `newsletter_submit` | Successful newsletter save | `form` only |
| `newsletter_success` | Successful newsletter save | `form` only |
| `newsletter_error` | Client validation or request failure | `form`, non-sensitive `reason` |
| `outbound_resource_click` | Non-affiliate external resource | `label`, `destination_host` |
| `outbound_official_resource_click` | Visitor opens a government or other official source | `label`, `destination_host` |
| `related_guide_click` | Visitor opens a related internal guide | `path` |
| `affiliate_link_click` | Clearly labeled affiliate link | `label`, `destination_host` |
| `qr_campaign_visit` | `/welcome/[campaign]` load | `campaign` |
| `campaign_landing_visit` | Whitelisted campaign landing page load | `campaign` |

## Campaign parameters

The client remembers `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `campaign` in session storage and carries them into internal navigation when present. Campaign identifiers must not encode personal information.

## Provider setup

No analytics provider is configured in this version. When one is added:

1. Load it with a consent approach appropriate to the target jurisdictions.
2. Subscribe to the existing event contract rather than adding component-specific vendor calls.
3. Disable automatic collection that captures form values or full URLs containing sensitive query strings.
4. Document the public measurement identifier in `.env.example`; store any secret or server credential only in hosted runtime configuration.
5. Validate events in a non-production property before enabling production collection.
