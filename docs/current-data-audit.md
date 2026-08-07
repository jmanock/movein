# Current data audit

Audit date: July 28, 2026
Baseline commit: `99de587584ace97ba39d07dafb767c0125888c83`

## Inventory

The application uses a local SQLite database through `better-sqlite3`. Production selects the database with the absolute `DATABASE_PATH` environment variable; local development defaults to `data/movein.sqlite`, which is ignored by Git.

| ZIP | Primary mailing city | County | Public status | Indexable |
| --- | --- | --- | --- | --- |
| 32771 | Sanford | Seminole | Partial | No |
| 32801 | Orlando | Orange | Verified | Yes |
| 32720 | DeLand | Volusia | Partial | No |
| 34748 | Leesburg | Lake | Partial | No |
| 34741 | Kissimmee | Osceola | Verified | Yes |

The baseline contains 18 provider or official-resource records, 22 provider-to-ZIP links, 21 phone contacts, and 18 sources. Categories present are electricity (3 records), water (4), sewer (3), internet (1 official address lookup), trash/recycling (2), and local government (5).

Providers present: City of Sanford Water Utilities, City of Sanford Wastewater Utilities, City of Sanford Solid Waste Division, Orlando Utilities Commission electric and water, City of DeLand Water Utility, City of DeLand Sewer Utility, City of DeLand Solid Waste Service, SECO Energy, Kissimmee Utility Authority, Toho Water Authority water and sewer, FCC National Broadband Map, and the five pilot county governments.

## Source and verification coverage

All 18 baseline records have an HTTPS official website, a stored source URL, and a `last_verified_at` date. All five ZIP rows have a locality source and verification date. The CSV validator reports no duplicate ZIPs, duplicate provider slugs, duplicate provider identities, orphaned service-area rows, malformed phones, missing sources, or missing dates.

The source hierarchy is generally appropriate: municipal utilities and governments, utility-owned service-area pages, and the FCC address-level broadband map. The OUC electric source is a general newsroom page rather than the strongest available service-territory or start-service source and should be replaced. County-government rows are useful jurisdiction starting points but are not utility-provider assignments.

## Missing and potentially misleading information

- No provider stores a separate start-service URL, outage URL, address-check URL, operating hours, provider type, or internet technology.
- Electricity is absent for Sanford and DeLand; ZIP-level assignment should not be guessed.
- Water, sewer, and trash are absent for Leesburg; the current SECO record does not make the ZIP broadly complete.
- The primary USPS city is stored, but additional jurisdictions, incorporated/unincorporated status, and jurisdiction notes are not.
- Overall ZIP status and indexing are manually seeded rather than derived from record completeness.
- The existing `possible` and `address_required` labels are appropriately cautious, but a visitor could still mistake a municipal provider record for whole-ZIP coverage if the jurisdiction note is missed.
- Internet is correctly represented by the FCC address-check tool rather than fabricated provider or speed claims.

## Duplicate and unverified records

No duplicate or source-free records were found. `is_verified` is true for every baseline provider. This means the flag represents “reviewed against an official source,” not “serves every address in the linked ZIP.” Service-area confidence and coverage notes must remain visible to preserve that distinction.

## Database and migration risks

- The importer currently upserts verified rows without requiring explicit approval when a reviewed value changes.
- There is no import dry-run or row-level change summary.
- `proxy.ts`, the sitemap, and the supported/indexable ZIP arrays duplicate database state in application code, so new ZIPs require coordinated edits.
- The correction table's legacy `status` constraint does not include accepted or rejected outcomes.
- SQLite migrations are forward-only. Migration `002` adds a column directly and is safe when tracked by `schema_migrations`, but restoring an earlier application version after new columns are used requires restoring a database backup as well.
- The seed is idempotent and non-deleting, but a production backup remains mandatory before migrations or confirmed updates to verified records.

## Audit conclusion

The baseline is trustworthy but intentionally small. Expansion should add authoritative municipal records with explicit address/jurisdiction caveats, strengthen action URLs and outage contacts, generate research queues for unresolved categories, and require explicit confirmation before a verified row is changed. No uncertain baseline record should be deleted during that work.
# August 1, 2026 Phase 2 update

The dataset now contains 50 ZIP records: 12 verified/indexable records and 38 pending/noindex expansion records. The verified pages have complete electricity, water, sewer, internet guidance, trash/recycling, and local-government coverage, with cautious ZIP-to-territory wording. Address-level internet checkers replace ZIP-wide availability claims. The generated coverage, research-queue, link, and production-health reports are the authoritative current inventory.

# August 3, 2026 Phase 3 update

The dataset still contains 50 ZIP records, but the reviewed public set has expanded to 25 verified/indexable records while 25 records remain pending/noindex. Thirteen ZIPs were promoted only after all six core categories were represented with official sources, dates, contact paths, and explicit address-confirmation caveats. The new statewide and county hubs describe the pilot accurately without implying complete countywide or statewide service coverage.

# August 7, 2026 Search Console growth sprint

The five-county dataset remains capped at 50 ZIP records. Three existing neighboring-cluster records—32809, 34771, and 34772—were promoted after all six public categories passed the same official-source and address-confirmation gate. The current split is 28 verified/indexable and 22 pending/noindex, with zero core-category gaps on the public set and 110 tasks retained for unresolved research. No county or unsupported statewide claim was added.
