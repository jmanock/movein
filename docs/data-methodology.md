# Data methodology

MoveIn treats a ZIP code as a discovery aid rather than a utility boundary. ZIPs are postal delivery areas; electric territories, municipal limits, water systems, sewer connections, solid-waste franchises, wells, septic systems, and internet facilities follow different boundaries. Every result therefore keeps an exact-address confirmation step visible.

## Source hierarchy

1. Current provider-owned service-area, account, outage, or address-check pages
2. Current municipal, county, authority, cooperative, or Florida Public Service Commission sources
3. Federal sources such as the FCC National Broadband Map
4. Adopted government documents when a current web page does not describe an interlocal arrangement

Commercial directories, search snippets, affiliate pages, promotional pricing, crowdsourced claims, and unsourced ZIP lists do not establish provider coverage.

## Verification

A provider record is `verified` when a reviewer stores an authoritative source URL, retrieval date, verification date, method, coverage note, and confidence. That means the record is supported by its source; it does not mean the provider serves every address in the ZIP. Provider-to-ZIP links use plain-language availability labels and retain jurisdiction notes.

Overall ZIP status is derived at lookup time. A useful verified page needs local-government context, a non-lookup electric record, and a non-lookup water or sewer record. A ZIP with useful but incomplete records is partial. A known ZIP with no provider records is pending. Conflicting authoritative boundaries must be recorded for research and kept noindex until resolved.

## Update frequency and corrections

Records are reviewed at least every 180 days. The stale-data command identifies overdue records. User corrections are stored separately with no automatic production changes; a reviewer must confirm the report against an authoritative source before accepting and importing an update.

MoveIn never asks a visitor to enter a street address into its own lookup. Address confirmation happens on the linked official provider, FCC, PSC, city, or county destination.
