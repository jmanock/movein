# Weekend growth sprint report

Completed: August 7, 2026

## Search-led content work

- Rebuilt `/resources/find-internet-providers` around exact-address availability, technology types, move timing, building restrictions, and official verification tools.
- Added `/resources/check-internet-availability` for serviceability checks and `/resources/transfer-internet-when-moving` for transfer logistics. An overlapping `/resources/find-isp-by-address` page was intentionally not created.
- Expanded `/renters/renters-insurance-and-deposits`, added `/renters/renter-move-in-costs`, and strengthened the renter hub.
- Expanded `/resources/when-to-transfer-utilities` and introduced the canonical `/resources/utility-setup` task hub. The old `/resources/set-up-utilities` path permanently redirects to it.
- Added direct answers, page-specific FAQs, visible official sources, descriptive internal links, and Article, FAQPage, BreadcrumbList, or CollectionPage schema where appropriate.

## ZIP coverage work

- Refreshed the six opportunity pages: 32720, 32757, 34748, 32801, 32746, and 34769.
- Promoted neighboring pilot ZIPs 32809, 34771, and 34772 after official core-category evidence was present.
- That sprint ended with 28 verified/indexable and 22 pending/noindex ZIPs. The August 10 weekly sprint subsequently promoted Eustis 32726 after official-source review, bringing the current state to 29 verified and 21 pending without adding a countywide or statewide coverage claim.
- Related ZIPs now prefer reviewed same-county and same-city clusters instead of simple numeric proximity.

## Measurement and presentation

- Added the typed, privacy-safe `guide_to_zip_lookup` journey event. It sends the guide path and source page, never the entered ZIP.
- Added two original WebP editorial images through Next.js Image with explicit dimensions and responsive sizes.
- Recorded the supplied Search Console evidence and follow-up cadence in `docs/search-console-opportunities.md`.

## Release evidence

The August 7 release validator covered 50 ZIPs, 52 providers or official tools, 343 service-area links, 63 contacts, and 63 sources. Current counts live in `docs/data-coverage-report.md`; generated SEO, duplication, front-end, link, coverage, research-queue, and health reports should be regenerated as part of every release. The production database must be backed up, migrated, dry-run imported, and then imported with `--confirm-verified` before PM2 restarts.
