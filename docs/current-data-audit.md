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

The baseline contains 18 provider or official-resource records, 22 provider-to-ZIP links, 21 phone contacts, and 18 sources. Categories present are electricity (3 records), water (4), sewer (3), internet (1 official address lookup), trash/recycling (2), and local government (5). Natural gas has no provider record.

Providers present: City of Sanford Water Utilities, City of Sanford Wastewater Utilities, City of Sanford Solid Waste Division, Orlando Utilities Commission electric and water, City of DeLand Water Utility, City of DeLand Sewer Utility, City of DeLand Solid Waste Service, SECO Energy, Kissimmee Utility Authority, Toho Water Authority water and sewer, FCC National Broadband Map, and the five pilot county governments.

## Source and verification coverage

All 18 baseline records have an HTTPS official website, a stored source URL, and a `last_verified_at` date. All five ZIP rows have a locality source and verification date. The CSV validator reports no duplicate ZIPs, duplicate provider slugs, duplicate provider identities, orphaned service-area rows, malformed phones, missing sources, or missing dates.

The source hierarchy is generally appropriate: municipal utilities and governments, utility-owned service-area pages, and the FCC address-level broadband map. The OUC electric source is a general newsroom page rather than the strongest available service-territory or start-service source and should be replaced. County-government rows are useful jurisdiction starting points but are not utility-provider assignments.

## Missing and potentially misleading information

- No provider stores a separate start-service URL, outage URL, address-check URL, operating hours, provider type, or internet technology.
- Natural-gas availability is entirely unverified.
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
