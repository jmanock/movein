# Provider verification

## Required evidence

Before adding a public provider-to-ZIP link, record the provider name, category, provider type, official website, authoritative source title and URL, retrieval date, verification date, method, coverage note, confidence, and whether address confirmation is required. Add start-service, outage, address-check, hours, and technology fields only when the official source supports them.

Municipal service is linked as `primary_municipal` only as a likely city-system starting point; the page must still state that a mailing ZIP can extend beyond city limits. Use `possible`, `multiple_possible`, `address_required`, or `varies` when a territory cannot be reduced safely to one provider. Use `not_generally_available` only when a current authoritative source supports that statement.

## Category rules

- Electricity: prefer an official territory map, start-service page, outage phone, and outage page. Use the Florida PSC territory finder when the provider is unresolved.
- Water and sewer: identify city, county, authority, private utility, well, or septic possibilities separately. Never infer a connection from the mailing city.
- Internet: use the FCC address lookup. Store technologies only when verified; never publish unverified speeds, rankings, or prices.
- Natural gas: absence of a record is not proof of unavailability. Use the PSC territory tool until an address-level provider is verified.
- Trash: distinguish city, county, HOA, landlord, apartment, and private-hauler arrangements.

Run validation, duplicate, missing-data, stale-data, research-queue, and coverage-report commands before review. A verified-row change requires the explicit `--confirm-verified` import flag and a reviewed diff.
