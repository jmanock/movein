# MoveIn

MoveIn is a focused Florida utility and local-services lookup. A visitor enters a five-digit ZIP code, sees reviewed possible providers and official starting points, and is reminded to confirm the exact street address.

The reviewed dataset contains 12 representative pilot ZIPs in Seminole, Orange, Volusia, Lake, and Osceola counties. It does not claim countywide or statewide coverage.

## Stack

- Next.js 16 App Router, React 19, TypeScript, and Node.js 22
- Standard `next start` server behind PM2 and Nginx on port 3006
- SQLite through `better-sqlite3`
- Explicit SQL migrations and idempotent CSV imports
- Server-rendered lookup pages and a controlled JSON API

## Local setup

Node.js 22.13 or newer is required.

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Checks:

```bash
npm run data:validate
npm run data:duplicates
npm run data:import -- --dry-run
npm run data:import -- --confirm-verified
npm run data:coverage
npm run data:stale
npm run data:missing
npm run data:research-queue
npm run data:links
npm run data:report
npm run seo:duplicates
npm run seo:audit
npm run frontend:audit
npm run lint
npm test
npm run build
PORT=3006 npm run start
```

## Environment

`DATABASE_PATH` is optional in development and defaults to `./data/movein.sqlite`. In production it must be an absolute path on persistent storage, such as:

```bash
DATABASE_PATH=/var/lib/movein/movein.sqlite
```

`STALE_AFTER_DAYS` is an optional CLI-only value for `npm run data:stale`; it defaults to 180.

`NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QC9FYWHVZZ` enables Google Analytics in production. Analytics is disabled during tests and ordinary local development. See `docs/google-analytics.md` for the explicit local opt-in and duplicate-page-view safeguard.

## Product routes

- `/` — primary ZIP lookup
- `/lookup/[zip]` — server-rendered utility, recently-moved, emergency, and official local-resource page
- `/api/lookup?zip=32771` — controlled JSON lookup
- `/homeowners`, `/renters` — focused hubs with substantive setup guides
- `/learn-your-area`, `/resources`, `/coverage`, `/faq`
- `/resources/printables/[slug]` — maintainable HTML checklists with print CSS
- `/data-sources`, `/corrections` — correction submissions are reviewed before public data changes
- `/about`, `/contact`, `/privacy`, `/terms`, `/disclosure`, `/editorial-policy`, `/site-map`

Retired timeline, checklist, Florida Guide, campaign, and guide-detail routes redirect only where a clear replacement exists. The newsletter endpoint and public email collection were removed.

## Data workflow

Edit the reviewed CSV files in `data/florida`, then run:

```bash
npm run data:validate
npm run db:migrate
npm run db:seed
npm run data:coverage
```

The seed is idempotent and non-deleting. A changed verified row is refused unless the reviewer supplies `--confirm-verified`; use `--dry-run` first. Run migrations before importing. See `docs/database.md`, `docs/data-methodology.md`, and `docs/provider-verification.md` before adding coverage.

## Documentation

- `docs/rebuild-plan.md` — audit and product decisions
- `docs/removed-features.md` — kept, simplified, removed, and archived behavior
- `docs/database.md` — schema, migrations, backups, and rollback
- `docs/florida-data-acquisition.md` — county-by-county research process
- `docs/data-verification.md` — source and confidence rules
- `docs/current-data-audit.md` — pre-expansion inventory and risks
- `docs/data-methodology.md` — approximation, source hierarchy, confidence, and updates
- `docs/provider-verification.md` — category-specific acceptance rules
- `docs/florida-research-plan.md` — expansion priorities and queue workflow
- `docs/data-coverage-report.md` — generated internal coverage summary
- `docs/research-queue-summary.md` — generated unresolved-task summary
- `docs/link-validation-report.md` — generated official-link status report
- `docs/corrections-workflow.md` — private review lifecycle
- `docs/google-search-launch.md` — canonical, sitemap, and Search Console launch checklist
- `docs/pilot-data-report.md` — current pilot coverage, gaps, and next verification work
- `docs/image-manifest.md` — homepage image provenance, optimization, and replacement guidance
- `docs/deployment.md` — DigitalOcean, PM2, Nginx, and release commands
- `docs/seo.md` — canonicals, ZIP indexing, sitemap, and structured data
- `docs/seo-audit.md` and `docs/seo-validation-report.md` — baseline findings and generated release checks
- `docs/seo-strategy.md`, `docs/content-architecture.md`, and `docs/internal-linking.md` — search intent and discovery design
- `docs/structured-data.md`, `docs/image-seo.md`, and `docs/editorial-policy.md` — implementation and governance
- `docs/content-duplication-report.md` and `docs/internal-link-report.md` — generated content/link reports
- `docs/privacy.md` — application data-handling notes
- `docs/frontend-growth-audit.md` — baseline UX findings and rebuild decisions
- `docs/design-system.md` — tokens, components, and ZIP states
- `docs/search-intent-map.md` — intent ownership and supporting paths
- `docs/frontend-validation-report.md` — browser, journey, and release checks
- `docs/accessibility.md` and `docs/performance.md` — front-end quality guardrails
- `docs/analytics-events.md` — privacy-safe event names and integration boundary
- `docs/google-analytics.md` — GA4 setup, event parameters, testing, privacy, and duplicate prevention
- `docs/phase-3-quality-audit.md` — full-site authority audit, remediation, guardrails, and release evidence
