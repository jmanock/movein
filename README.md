# MoveIn

MoveIn is a mobile-first guide for everything after the keys. It helps homeowners and renters work through practical next steps from before move-in through the first year. Welcome Home Florida is the platform's first regional guide.

## Stack

- Next.js App Router with TypeScript and React
- Vinext/Vite output for Cloudflare Workers
- Tailwind CSS entrypoint plus project CSS in `app/globals.css`
- Cloudflare D1 with Drizzle schema and migrations for newsletter subscribers
- Sites deployment metadata in `.openai/hosting.json`
- Lucide icons; no analytics or email-vendor SDK is required

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The local development server provides a simulated D1 binding. Useful checks:

```bash
npm run build
npm run lint
npm test
npm run db:generate
```

## Environment variables

No application environment variables are required for this version. The logical D1 binding is `DB` and is declared in `.openai/hosting.json`. The hosting platform provides the production database binding.

When an email provider or analytics platform is added later, keep vendor credentials in hosted runtime configuration and document matching non-secret key names in `.env.example`. Do not commit secrets.

## Routes

- `/` — national MoveIn homepage
- `/timeline` and `/timeline/[stage]` — persistent move timeline
- `/homeowners`, `/renters`, `/checklists`, `/resources` — user-intent hubs
- `/florida` and `/florida/[guide]` — Welcome Home Florida regional experience
- `/welcome/[campaign]` — reusable postcard and QR campaign landing pages
- `/blog`, `/about`, `/contact` — editorial and company pages
- `/privacy`, `/terms`, `/disclosure` — policy pages
- `/sitemap.xml`, `/robots.txt` — search engine discovery

Timeline progress is intentionally device-local under `movein.timeline.v1`. Newsletter records are durable in D1.

## Production deployment

Build the exact source intended for release, save the source revision, package the Vinext worker output plus `.openai` metadata and migrations, then publish the saved version through Sites. See `docs/deployment.md` for the release and custom-domain checklist.

## Documentation

- `docs/domain-migration.md` — `movein.guide` DNS, canonical, Search Console, redirect, and rollback plan
- `docs/content-migration.md` — old-to-new content disposition
- `docs/analytics-events.md` — privacy-safe event contract
- `docs/deployment.md` — production and custom-domain operations
