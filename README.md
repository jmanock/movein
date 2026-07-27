# MoveIn

MoveIn is a focused Florida utility and local-services lookup. A visitor enters a five-digit ZIP code, sees reviewed possible providers and official starting points, and is reminded to confirm the exact street address.

The first usable dataset is intentionally limited to pilot records in Seminole, Orange, Volusia, Lake, and Osceola counties. It does not claim statewide coverage.

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
npm run data:coverage
npm run data:stale
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

## Product routes

- `/` — primary ZIP lookup
- `/lookup/[zip]` — server-rendered result page
- `/api/lookup?zip=32771` — controlled JSON lookup
- `/homeowners`, `/renters` — concise setup guidance
- `/learn-your-area`, `/resources`, `/faq`
- `/data-sources`, `/corrections`
- `/about`, `/contact`, `/privacy`, `/terms`, `/disclosure`, `/editorial-policy`

Retired timeline, checklist, Florida Guide, campaign, and guide-detail routes redirect only where a clear replacement exists. The newsletter endpoint and public email collection were removed.

## Data workflow

Edit the reviewed CSV files in `data/florida`, then run:

```bash
npm run data:validate
npm run db:migrate
npm run db:seed
npm run data:coverage
```

The seed is idempotent. It updates known rows without deleting unrelated or retired production data. See `docs/database.md`, `docs/florida-data-acquisition.md`, and `docs/data-verification.md` before adding coverage.

## Documentation

- `docs/rebuild-plan.md` — audit and product decisions
- `docs/removed-features.md` — kept, simplified, removed, and archived behavior
- `docs/database.md` — schema, migrations, backups, and rollback
- `docs/florida-data-acquisition.md` — county-by-county research process
- `docs/data-verification.md` — source and confidence rules
- `docs/deployment.md` — DigitalOcean, PM2, Nginx, and release commands
- `docs/seo.md` — canonicals, ZIP indexing, sitemap, and structured data
- `docs/privacy.md` — application data-handling notes
