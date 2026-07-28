# Florida pilot data report

Last reviewed: July 27, 2026

The launch dataset intentionally supports one reviewed ZIP in each pilot county. It is a workflow test, not a claim of countywide or statewide coverage.

- Supported ZIP codes: 32771, 32801, 32720, 34748, 34741
- Fully verified ZIP codes: 32801, 34741
- Partially verified ZIP codes: 32771, 32720, 34748
- Pending ZIP codes: none in the current pilot

| County | ZIP | Primary city | Status | Known gaps |
| --- | --- | --- | --- | --- |
| Seminole | 32771 | Sanford | Partial | Electricity, natural gas |
| Orange | 32801 | Orlando | Verified | Sewer, natural gas, trash/recycling |
| Volusia | 32720 | DeLand | Partial | Electricity, natural gas |
| Lake | 34748 | Leesburg | Partial | Water, sewer, natural gas, trash/recycling |
| Osceola | 34741 | Kissimmee | Verified | Natural gas, trash/recycling |

Current records include 18 provider or official-resource entries and 22 provider-to-ZIP coverage links. Provider counts by category are: electricity 3, water 4, sewer 3, natural gas 0, internet 1, trash/recycling 2, and local government 5. The internet record deliberately points to the FCC’s address-level broadband map because a ZIP alone cannot establish availability.

Every public provider record has an official HTTPS website, a verification date, and at least one source. Sources are the official sites of Sanford, Orlando Utilities Commission, Orlando, DeLand, SECO Energy, Leesburg, Kissimmee Utility Authority, Toho Water Authority, Kissimmee, and the FCC. Run `npm run data:validate`, `npm run data:coverage`, and `npm run data:stale` to reproduce the structural checks and coverage report.

## Source URLs

- https://sanfordfl.gov/government/public-works-utilities/water_and_sewer/
- https://sanfordfl.gov/government/public-works-utilities/
- https://www.ouc.com/about/newsroom/
- https://www.ouc.com/about/water-services/
- https://deland.org/476/Billing-Information
- https://secoenergy.com/service-territory
- https://kua.com/about-kua/service-territory/
- https://www.tohowater.com/about-us/our-service-area
- https://help.bdc.fcc.gov/hc/en-us/articles/10467446103579-How-to-Use-the-FCC-s-National-Broadband-Map
- https://www.seminolecountyfl.gov/
- https://www.ocfl.net/
- https://www.volusia.org/
- https://www.lakecountyfl.gov/
- https://www.osceola.org/

Next verification work should fill the explicitly missing categories above, confirm boundaries using exact-address tools, add a second verified ZIP per county, and review every record again before the 180-day stale-data threshold. A ZIP should move to `verified` only after the documented source and confidence rules are satisfied.
