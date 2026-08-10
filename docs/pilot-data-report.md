# Florida pilot data report

Last reviewed: August 10, 2026

MoveIn’s five-county pilot contains 50 ZIP records in Seminole, Orange, Volusia, Lake, and Osceola counties. Twenty-nine ZIPs have complete reviewed records for the public core categories and are indexable. Twenty-one expansion ZIPs are deliberately pending and noindex while utility research continues.

## Current coverage

- Verified and indexable ZIPs: 32114, 32117, 32118, 32119, 32703, 32720, 32724, 32726, 32746, 32757, 32771, 32773, 32789, 32801, 32803, 32804, 32806, 32809, 34711, 34715, 34741, 34743, 34744, 34746, 34748, 34769, 34771, 34772, 34788
- Pending and noindex ZIPs: 21
- Missing core categories on verified ZIPs: 0
- Confirmed broken official links in the latest generated check: see `docs/link-validation-report.md`

Every verified page includes official starting points for electricity, water, sewer, trash and recycling, internet, and local government. Electric records include customer-service and outage contacts, a start-service link, and an outage map or an explicit evidence-based limitation when no stable public map was found. Water and sewer records include official start-service and phone details. Trash records link to official collection information. Local resources include county or municipal emergency-management guidance.

Internet results use multiple provider-owned availability checkers and the FCC National Broadband Map. The cards name the likely technology but do not claim that a provider serves every address in a ZIP. Every page instructs the visitor to confirm availability using the exact service address.

The 21 pending records include an official county starting point, an FCC address-level broadband lookup, a unique locality introduction, and a Census ZCTA-to-county relationship source. They remain noindex and are excluded from the sitemap until all core utility categories are researched and approved.

## Important limitations

ZIP codes are postal areas, not utility boundaries. A reviewed record is a useful possible-provider starting point, not a guarantee for a street address. Municipal limits, utility territories, franchises, wells, septic systems, and building-specific internet infrastructure can divide a ZIP.

The City of Mount Dora publishes an official electric outage phone and emergency guidance, but the review did not find a stable public outage-map URL. The result says so explicitly instead of inventing a map.

## Reproduce the release checks

```bash
npm run data:validate
npm run data:duplicates
npm run data:missing
npm run data:coverage
npm run data:stale
npm run data:links
npm run data:research-queue
npm run data:report
npm run health:report
```

The generated `docs/data-coverage-report.md`, `docs/research-queue-summary.md`, `docs/link-validation-report.md`, and `docs/production-health-report.md` contain the reproducible current state.
