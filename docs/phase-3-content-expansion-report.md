# Phase 3 content expansion report

Release date: August 3, 2026

## Coverage expansion

MoveIn now has 25 verified/indexable ZIP pages and 25 pending/noindex ZIP records across Orange, Seminole, Lake, Volusia, and Osceola counties. Phase 3 promoted these 13 ZIPs after completing all public core categories:

- Seminole: 32773
- Orange: 32803, 32804, 32806
- Volusia: 32117, 32118, 32119, 32724
- Lake: 34715, 34788
- Osceola: 34743, 34744, 34746

The provider cards continue to describe possible service and require address confirmation. A ZIP is not treated as a utility boundary, and internet results lead to provider-owned or FCC address checkers instead of claiming whole-ZIP availability.

## Authority and discovery pages

Phase 3 adds a statewide Florida utility hub and one substantive hub for each pilot county. The hubs expose verified coverage, pending research, county resources, relevant moving guides, FAQs, and crawlable links to reviewed ZIP pages. Four evergreen resources cover pre-move utilities, a moving utility checklist, the first homeowner week, and the first renter week.

## Unsupported ZIP requests

The noindex `/request-zip` page lets a visitor request a syntactically valid unsupported ZIP without providing an email address or any other personal information. The client first checks the lookup API. It records `zip_coverage_request` only after the API confirms that the ZIP is unsupported, and it never records the event for an already supported or malformed value. Routine lookup analytics continue to omit ZIP values.

## Search controls

- Only verified ZIP pages enter the XML sitemap.
- Pending, unsupported, and request pages remain noindex.
- State and county hubs use canonical URLs on `https://movein.guide`.
- County pages include CollectionPage, FAQPage, and BreadcrumbList structured data.
- Internal links connect the statewide hub, county hubs, ZIP pages, and related guides.

## Reproducible checks

Run the following before release:

```bash
npm run data:validate
npm run data:duplicates
npm run data:import -- --dry-run
npm run data:coverage
npm run data:missing
npm run data:stale
npm run data:links
npm run data:research-queue
npm run data:report
npm run lint
npm test
npm run seo:duplicates
npm run seo:audit
npm run build
PORT=3006 npm run start
```

The generated coverage, research queue, link-validation, SEO, and production-health reports provide the release-specific results.
