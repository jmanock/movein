# Florida pilot data report

Last reviewed: July 28, 2026

The launch dataset intentionally supports a small reviewed sample across five Central Florida pilot counties. It is a workflow test, not a claim of countywide or statewide coverage. The generated `docs/data-coverage-report.md` is the reproducible source for current gaps and queue priorities.

- Supported ZIP codes: 32114, 32703, 32720, 32746, 32757, 32771, 32789, 32801, 34711, 34741, 34748, 34769
- Fully verified and editorially approved ZIP codes: 32757, 32789, 32801, 34741, 34769
- Partially verified ZIP codes: 32114, 32703, 32720, 32746, 32771, 34711, 34748
- Pending ZIP codes: none in the current pilot

| County | ZIP | Primary city | Status | Known gaps |
| --- | --- | --- | --- | --- |
| Seminole | 32771, 32746 | Sanford, Lake Mary | Partial | Electric territory and natural gas need address-level confirmation |
| Orange | 32801, 32789, 32703 | Orlando, Winter Park, Apopka | Mixed | Apopka electric territory remains unresolved; natural gas varies |
| Volusia | 32720, 32114 | DeLand, Daytona Beach | Partial | Electric territory and natural gas need address-level confirmation |
| Lake | 34748, 32757, 34711 | Leesburg, Mount Dora, Clermont | Mixed | Leesburg utility records and Clermont electric territory remain incomplete |
| Osceola | 34741, 34769 | Kissimmee, St. Cloud | Verified | Trash arrangements and natural gas still require exact-address checks |

Current records include 41 provider or official-resource entries and 79 provider-to-ZIP coverage links. The shared internet record deliberately points to the FCC’s address-level broadband map because a ZIP alone cannot establish availability. Florida PSC territory finders are also identified as lookup tools rather than asserted providers.

Every public record has an official HTTPS website, a verification date, and at least one source. Run `npm run data:validate`, `npm run data:duplicates`, `npm run data:missing`, `npm run data:coverage`, `npm run data:stale`, and `npm run data:report` to reproduce the checks and report.

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
