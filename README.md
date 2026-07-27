# MoveIn

MoveIn is a mobile-first Next.js guide for everything after the keys. It helps homeowners and renters work through practical next steps from before move-in through the first year. Welcome Home Florida is the platform's first regional guide.

## Stack

- Next.js 16 App Router, React 19, and TypeScript
- Standard long-running Node.js server (`next start`)
- Tailwind CSS entrypoint plus project CSS in `app/globals.css`
- File-backed SQLite through `better-sqlite3` for newsletter subscribers
- Lucide icons and vendor-neutral analytics events

The application uses the conventional Next.js development, build, and production commands.

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm test
npm run build
PORT=3006 npm run start
```

## Environment variables

`DATABASE_PATH` is optional. It defaults to `./data/movein.sqlite`, relative to the application directory. When set, it must be an absolute path. For production, point it at persistent storage owned by the PM2 application user:

```bash
DATABASE_PATH=/var/lib/movein/movein.sqlite
```

Copy `.env.example` when a local override is useful. Never commit the SQLite database or secrets.

## Routes

- `/` — national MoveIn homepage
- `/timeline` and `/timeline/[stage]` — persistent move timeline
- `/homeowners`, `/renters`, `/checklists`, `/resources` — user-intent hubs with substantial linked guides
- `/florida` and `/florida/[guide]` — Welcome Home Florida regional experience
- `/welcome/[campaign]` — whitelisted, noindex postcard and QR campaign landing pages canonicalized to useful guides
- `/blog`, `/about`, `/contact` — editorial and company pages
- `/privacy`, `/terms`, `/disclosure` — policy pages
- `/sitemap.xml`, `/robots.txt` — search engine discovery

Timeline progress remains device-local under `movein.timeline.v1`. Newsletter records are stored in SQLite.

## DigitalOcean production

The conventional production flow is:

```bash
npm ci
npm run build
PORT=3006 DATABASE_PATH=/var/lib/movein/movein.sqlite npm run start
```

Use `ecosystem.config.cjs` to manage the process with PM2 and proxy Nginx to `127.0.0.1:3006`. Full commands, permissions, Nginx configuration, TLS notes, health checks, and rollback steps are in `docs/deployment.md`.

## Documentation

- `docs/deployment.md` — DigitalOcean, PM2, Nginx, TLS, updates, and rollback
- `docs/domain-migration.md` — `movein.guide` DNS, canonical, Search Console, and redirects
- `docs/content-migration.md` — old-to-new content disposition
- `docs/analytics-events.md` — privacy-safe event contract
- `docs/seo.md` — canonicals, campaign indexing rules, structured data, sitemap, and social images
- `docs/content-strategy.md` — topic clusters, editorial standards, and duplication safeguards
- `docs/image-manifest.md` — asset sources, licensing status, alt text, dimensions, and replacement guidance
- `docs/search-launch-checklist.md` — Search Console and indexing handoff
- `docs/accessibility.md` — implemented safeguards and manual regression checks
- `docs/performance.md` — image, rendering, and Core Web Vitals approach
