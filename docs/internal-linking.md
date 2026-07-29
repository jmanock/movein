# Internal linking rules

- Each guide links to its parent hub, two to four related guides, the ZIP lookup, and corrections.
- Hubs link to their full guide set and the primary ZIP action.
- ZIP pages link to electric, water, internet, homeowner, renter, and methodology guidance, plus up to three indexable same-county areas.
- Footer links expose trust pages and the HTML sitemap without turning the primary navigation into a directory.
- Link labels describe the destination; repeated “learn more” labels are avoided.
- Same-county links are database-derived and only include ZIPs that pass the same indexability gate.

Run `BASE_URL=http://127.0.0.1:3006 npm run check:links`. The generated `docs/internal-link-report.md` fails on broken targets, redirects among canonical sitemap URLs, or orphaned sitemap routes.
