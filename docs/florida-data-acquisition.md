# Florida data acquisition

## Launch boundary

Start with Seminole, Orange, Volusia, Lake, and Osceola counties. Expand ZIP by ZIP only when the result adds honest public value. Do not bulk-create statewide pages from a postal list.

## County workflow

1. Build a ZIP working list from a licensed or public authoritative source and record the source version.
2. Identify incorporated places, unincorporated areas, special districts, and major service-boundary maps.
3. Research each public category separately: electric, water, sewer/septic context, internet, trash/recycling, and local government.
4. Prefer official provider territory maps, municipal/county utility pages, Florida Public Service Commission materials, FCC broadband data, and official solid-waste departments.
5. Record the exact source URL, retrieval date, contact type, normalized phone, and a plain-language limitation note.
6. Use `possible` or `address_required` whenever a ZIP crosses a boundary. Use `primary` only when source evidence supports the entire mapped record—not because a provider is common nearby.
7. Run validation and coverage reports, manually open every official link, and review a rendered result before marking a ZIP indexable.

## Internet

The public FCC National Broadband Map is address-level and provider-reported. For launch, link to that official address lookup rather than presenting a ZIP-wide provider as guaranteed. A future import may use permitted FCC Broadband Data Collection downloads, but must preserve the reporting date, technology, provider identity, challenge limitations, and location-level terms.

## Water, sewer, and trash

These services frequently follow city limits, utility districts, franchise contracts, parcel boundaries, or individual infrastructure. Research municipal and county maps and require exact-address confirmation. Include well/septic uncertainty in service notes when relevant; never infer either from a missing record.

## Phone and outage contacts

Take numbers only from an official contact, outage, or service page. Store customer service, outage, and emergency numbers as separate normalized records. Recheck any number before publishing and never copy one provider's number to another category without source support.

## Adding the next county

Add one ZIP as `pending`, import official local-government and FCC address-lookup starting points, then add provider categories as verified. Promote to `partial` when some useful records exist. Promote to `verified` and `is_indexable=1` only after every core category passes source review and rendered-page QA.
