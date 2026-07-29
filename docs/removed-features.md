# Removed and redirected features

## Removed from the product

- Eight-stage My Move Timeline and device-local completion tracking
- Checklist hubs and the former timeline-style homeowner, renter, and Florida guide pages
- Welcome Home Florida as a primary navigation or product section
- Newsletter form, move month, audience segmentation, and `/api/newsletter`
- Campaign landing routes and campaign parameter persistence
- Homepage pathway cards, branded hero image, decorative timeline diagrams, duplicate CTAs, and timeline buttons

## Redirects

| Retired route | Destination | Reason |
|---|---|---|
| `/timeline/:path*` | `/homeowners` | Concise homeowner next steps are the closest useful replacement. |
| `/checklists/:path*` | `/resources` | The resource hub replaces generic checklists. |
| `/florida/:path*` | `/learn-your-area` | Local Florida discovery now starts with the ZIP lookup. |
| `/welcome/:path*` | `/` | Campaign pages are retired; the homepage is the only acquisition surface. |
| `/blog` | `/resources` | Official resources replace the thin editorial hub. |

Unknown ZIPs and unrelated paths return 404. Campaign URLs are no longer generated as indexable copies.

## Data retention

The migration does not drop the existing `newsletter_subscribers` table. The application no longer exposes a form or endpoint that writes to it. Back it up with the rest of the SQLite database and decide on a separate retention/deletion policy before removing historical subscriber data.
