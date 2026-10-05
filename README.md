# MoveIn

MoveIn helps with the administrative side of having a home. Its receipt flow turns reviewed purchases into useful home records and a household inventory in My Home. Receipt processing and household records currently run locally; private production access is still being prepared. The Florida ZIP lookup remains available for reviewed possible providers and official address checks.

The pilot dataset contains 50 ZIP records in Seminole, Orange, Volusia, Lake, and Osceola counties. Twenty-nine ZIPs have complete reviewed core-service records and are indexable; 21 expansion ZIPs remain pending and noindex while utility research continues. It does not claim countywide or statewide coverage.

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
npm run health:report
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

- `/` — receipt-led product introduction, My Home preview, and Florida ZIP lookup
- `/my-move` — private browser-saved homeowner or renter checklist; no account or email
- `/first-30-days` — four-phase move-in planning hub
- `/internet` — independent wired and wireless Internet discovery hub
- `/internet/compare` — browser-saved, neutral provider comparison with no account or street address
- `/internet/providers/[slug]` — source-backed provider availability and moving guidance
- `/lookup/[zip]` — server-rendered utility, recently-moved, emergency, and official local-resource page
- `/request-zip` — privacy-safe demand signal for unsupported five-digit ZIPs; no email is collected
- `/api/lookup?zip=32771` — controlled JSON lookup
- `/florida-utilities` and the five county utility hubs — reviewed coverage discovery and local context
- `/homeowners`, `/renters` — focused hubs with substantive setup guides
- `/learn-your-area`, `/resources`, `/coverage`, `/faq`
- `/resources/utility-setup` — task-oriented setup hub for electricity, water, internet, trash, transfers, documents, and deposits
- `/resources/printables` and `/resources/printables/[slug]` — free, ungated HTML checklists and fillable worksheets with browser persistence and print CSS
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
- `docs/my-move.md`, `docs/printables.md`, and `docs/content-retention-strategy.md` — local checklist, free-tool, and retention architecture
- `docs/movein-home-product-concept.md` — future product boundary and evidence requirements; no paid UI is implemented
- `docs/internet-data-model.md`, `docs/internet-provider-sources.md`, and `docs/internet-comparison.md` — provider evidence, relationship rules, and comparison behavior
- `docs/internet-deals-strategy.md` — disabled future promotion architecture and neutrality safeguards
- `docs/google-analytics.md` — GA4 setup, event parameters, testing, privacy, and duplicate prevention
- `docs/search-console-opportunities.md` — query/page signals, sprint decisions, and the next manual review cadence
- `docs/domain-canonicalization.md` — non-www application fallback and the required Nginx redirect boundary
- `docs/weekend-growth-sprint-report.md` — content, ZIP coverage, analytics, and release changes from the Search Console sprint
- `docs/phase-3-quality-audit.md` — full-site authority audit, remediation, guardrails, and release evidence
- `docs/phase-3-content-expansion-report.md` — ZIP promotions, authority hubs, request flow, and release evidence
- `docs/production-health-report.md` — generated coverage, link, search, analytics, test, and build health

## Receipts and My Home with local Ollama

Set `RECEIPT_EXTRACTOR=ollama`, `OLLAMA_BASE_URL=http://127.0.0.1:11434`, and `OLLAMA_RECEIPT_MODEL` to an already installed vision model (see `.env.example`). Start Ollama, run `npm run db:migrate`, then `npm run dev -- --hostname 127.0.0.1`. Open `/receipts`: JPG/PNG → local extraction → review/correction → explicit save → `/my-home`. `npm run receipt:test -- /absolute/path/receipt.jpg` runs the same extraction without saving anything. For a corpus, `npm run receipt:eval -- ./receipt-lab --report ./receipt-eval-reports/run1.json` compares optional `<stem>.expected.json` annotations and reports separate field metrics; `RECEIPT_PROMPT_VERSION` selects preserved v1 or default v2. To try the fixture, explicitly set `RECEIPT_EXTRACTOR=demo` in development; there is no automatic demo fallback.

Original receipt files are discarded. Confirmed purchase records persist in this computer’s shared local SQLite database. Production uploads, saves, and inventory endpoints stay disabled until private household access is ready. See [docs/receipts.md](docs/receipts.md) for setup, schema, prompt, troubleshooting, and current limitations.

## Household ownership

Migration 010 assigns legacy local receipt records to a named development household. All receipt and My Home repository instances require a household ID; ownership comes from the server resolver, never the browser. Run the existing migration process after a verified backup. Private pages redirect to `/sign-in` and private APIs return uncached HTTP 401 without a verified session and membership. Better Auth magic-link sign-in is implemented; production remains fail-closed until explicit session and SMTP configuration is present. Public guides and lookup stay available. See [household architecture and operator migration steps](docs/household-ownership.md).

## Private sign-in

Better Auth 1.7.7 provides email sign-in links and database-backed sessions. See [authentication setup](docs/authentication.md) for local testing, privacy, rate limits, and the future production checklist. `npm run dev:auth` explicitly enables private local console links; ordinary `npm run dev` does not grant household access by default.

## Production readiness

See [ordered launch checklist](docs/production-launch-checklist.md) and [Task 8 audit](docs/task-8-production-readiness.md). `npm run production:check` validates configured production readiness without sending mail or writing records; `npm run production:smoke` checks running HTTP routes and a read-only configured DB. `npm run db:backup -- /absolute/new/backup.sqlite` creates and verifies an online SQLite snapshot. Production requires an explicit persistent DB path, SMTP and HTTPS auth origin. Choose `RECEIPT_EXTRACTOR=disabled` to launch with saved records/authentication while real extraction is not provisioned.

Current release verdict: **CODE READY — MANUAL PRODUCTION CONFIGURATION REMAINS.** See [Task 10 patched-version evidence](docs/task-10-release-readiness.md), [first staged launch runbook](docs/staged-production-launch.md) and [fill-in environment template](docs/first-launch.env.example). PM2 explicitly disables extraction for the first stage. SMTP/secrets/HTTPS/persistent DB/backups and actual target tests remain manual; nothing has been deployed.
