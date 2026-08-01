# Phase 3 quality audit

Date: August 1, 2026. Baseline commit: `a63e4d7`.

## Scope

The audit covered every public route and guide, all 12 reviewed ZIP records, provider contacts and sources, navigation and internal-link reports, metadata and structured data, responsive CSS, client-component count, public image sizes, form behavior, and production build output. The automated baseline included the data validator, coverage/missing/stale/duplicate reports, content-duplication audit, SEO audit, front-end audit, test suite, and a production crawl.

## Findings before this update

- The utility records were careful and source-backed, but most ZIP-page supporting copy was shared. A result read more like a provider record than a complete moving landing page.
- ZIP pages did not connect the user to address changes, driver and vehicle records, voter registration, local libraries, emergency management, homestead information, flood maps, or Florida hazard planning.
- Provider cards omitted stored service notes and gave the official source less visual weight than account actions.
- Police/fire guidance and utility-emergency routing were distributed across provider cards and guides rather than presented in one scannable section.
- Homeowner content did not fully cover locks, GFCI awareness, appliance records, filter schedules, or insurance inventories. Renter content did not fully cover move-in evidence, renters insurance, deposits, parking, pets, and maintenance records.
- `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `Article`, and `WebPage` schema existed. Working lookup `SearchAction`, hub `CollectionPage`, and ZIP-page `Service` schema were absent.
- Several obsolete CSS blocks remained from an earlier interface even though their components no longer existed.
- The existing audits reported no blocking metadata duplication, broken schema architecture, stale provider records, duplicated provider data, or Cloudflare runtime coupling. All 12 ZIP records had official sources, but five county-government directory records appropriately lacked account-service phone numbers because they are reference portals rather than utilities.

## Remediation

- Added a hand-written moving overview for every reviewed ZIP. The duplication audit now fails if a reviewed ZIP lacks its overview and flags overly similar overview copy.
- Added official state and county resource profiles for the five-county pilot, with centralized types so links can be reviewed and expanded without creating speculative location pages.
- Added Recently moved, first-week, and emergency sections to every supported ZIP result while preserving the exact-address warning.
- Exposed provider service notes, explicit no-phone context, verified dates, official-source labels, source links, and source check dates.
- Added five substantive guides: two for homeowners and three for renters. Dynamic guide routing, the sitemap, HTML sitemap, and hub listings pick them up automatically.
- Added truthful `SearchAction`, `CollectionPage`, and information-service `Service` schema. The `Service` object describes MoveIn's lookup, not the utility provider, and explicitly says service must be confirmed by address.
- Added a lookup action to the FAQ journey and strengthened hub-to-guide and guide-to-lookup paths.
- Removed unused legacy CSS for retired hero, audience-card, service-card, and resource-group layouts. No new image or client-side state was required.

## Guardrails

- ZIP pages remain indexable only through the existing database quality gate.
- No city, county, state, or campaign templates were generated.
- County and statewide links are official starting points, not claims that a service applies to every address.
- Police, fire, and medical emergencies direct users to 911; non-emergency contacts remain with the responsible official jurisdiction.
- Future multi-state expansion should add a state resource module, verified county profiles, hand-written ZIP context, and an explicit indexing review rather than copying Florida pages.

## Ongoing manual review

- Recheck official local links and provider actions during the normal 180-day data-review cycle or sooner after an agency redesign.
- Review representative municipal, cooperative, mixed-jurisdiction, and apartment-heavy ZIP pages after each data import.
- Use field Core Web Vitals and assistive-technology testing after deployment; static audits cannot replace real-user data or screen-reader review.
- Do not add contractor, comparison, dashboard, favorite-provider, or multistate UI until its data, privacy, and product model is complete.

## Release validation

- Clean install: 358 packages audited, zero known vulnerabilities.
- TypeScript production build: passed on Next.js 16.2.12 and generated 55 pages.
- Automated tests: 33 passed, zero failed.
- Data validation: 12 ZIPs, 52 providers, 98 service-area links, 67 contacts, and 57 official sources passed.
- Local resource review: all 33 new state, county, library, property, school, and transit URLs returned successfully after correcting three initial stale or invalid targets.
- SEO audit: zero errors and zero warnings across 44 manifest pages, 24 guides, and 12 quality-gated ZIP pages.
- Content duplication: no blocking metadata, guide, or ZIP-overview findings.
- Runtime front-end audit: 13 representative routes, 64 internal targets, seven client components, four raster images, and no serious failures.
- Full internal-link crawl: 56 canonical routes, 60 discovered targets, zero broken links, zero canonical redirects, and zero orphan sitemap routes.
- Production smoke checks: homepage, core hubs, new guides, supported and unsupported ZIP states, FAQ, robots, and sitemap all returned HTTP 200.
