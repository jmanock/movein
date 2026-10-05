# Deployment

For the current receipts/authentication MVP, follow [production launch checklist](production-launch-checklist.md) and [Task 10 readiness report](task-10-release-readiness.md), with the [staged launch runbook](staged-production-launch.md). They include migrations, backups, manual accounts, HTTPS, private features and extractor gating.

The historical Internet-sprint commands below do not describe the current schema/auth release; do not use their “no migration” or rollback assumptions for this release.

# DigitalOcean deployment

MoveIn runs as a conventional long-lived Next.js Node server on Ubuntu, managed by PM2 and proxied by Nginx to `127.0.0.1:3006`. Do not deploy it to Cloudflare Workers.

## Pre-migration backup

Stop or quiesce the app, create a timestamped SQLite online backup of `/var/lib/movein/movein.sqlite`, and retain it outside `/var/www/movein`. If copying files directly, copy the database and its `-wal` and `-shm` companions together after a clean stop. Confirm the PM2 user owns `/var/lib/movein`.

```bash
sudo install -d -o "$USER" -g "$USER" /var/backups/movein
sqlite3 /var/lib/movein/movein.sqlite ".backup '/var/backups/movein/movein-before-internet-sprint.sqlite'"
test -s /var/backups/movein/movein-before-internet-sprint.sqlite
```

## Release commands

```bash
cd /var/www/movein
git pull --ff-only origin main
source ~/.bashrc
nvm use 22
export DATABASE_PATH=/var/lib/movein/movein.sqlite
test -f .env.production
grep -x 'NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QC9FYWHVZZ' .env.production
set -a
. ./.env.production
set +a
npm ci
npm run data:validate
npm run seo:duplicates
npm run seo:audit
npm run lint
npm test
npm run build
npm run analytics:check
npm run data:coverage
pm2 restart movein --update-env
pm2 save
FRONTEND_AUDIT_URL=http://127.0.0.1:3006 npm run frontend:audit
SEO_BASE_URL=http://127.0.0.1:3006 npm run seo:audit
BASE_URL=http://127.0.0.1:3006 npm run check:links
npm run health:report
git status --short
```

This release does not change the database schema or provider seed data. Do not run a data import for this release. Runtime reports write to the ignored `runtime-reports/` directory, so the final `git status --short` should print nothing. The exact direct smoke-test command is:

```bash
PORT=3006 DATABASE_PATH=/var/lib/movein/movein.sqlite NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QC9FYWHVZZ npm run start -- -H 127.0.0.1
```

`ecosystem.config.cjs` sets port 3006, loopback host, production mode, one instance, the persistent database path, the public GA4 measurement ID, and debug mode false. GA4 is still a build-time value: `.env.production` must contain `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QC9FYWHVZZ` before `npm run build`. PM2 cannot repair a build that omitted it. Use `pm2 restart movein --update-env` so dynamic responses receive the same value.

After building, `npm run analytics:check` must pass. To inspect the public value without printing unrelated environment settings:

```bash
grep -x 'NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QC9FYWHVZZ' .env.production
rg -l 'G-QC9FYWHVZZ' .next/server .next/static | head
rg -o 'googletagmanager\.com/gtag/js\?id=G-[A-Z0-9]+' .next/server/app/index.html
```

The GA measurement ID is public. Do not dump the rest of `.env.production` or the PM2 environment into logs.

## Nginx expectations

Nginx should proxy the public HTTPS host to `http://127.0.0.1:3006` and pass `Host`, `X-Real-IP`, `X-Forwarded-For`, and `X-Forwarded-Proto`. The app trusts these only for a short-lived hashed in-memory rate-limit key; it does not write the IP to SQLite.

## Verification

```bash
curl -I http://127.0.0.1:3006/
curl -I http://127.0.0.1:3006/homeowners
curl -I http://127.0.0.1:3006/renters
curl -I http://127.0.0.1:3006/learn-your-area
curl -I http://127.0.0.1:3006/resources
curl -I http://127.0.0.1:3006/resources/find-internet-providers
curl -I http://127.0.0.1:3006/resources/check-internet-availability
curl -I http://127.0.0.1:3006/resources/transfer-internet-when-moving
curl -I http://127.0.0.1:3006/internet/transfer-or-switch
curl -I http://127.0.0.1:3006/internet
curl -I 'http://127.0.0.1:3006/internet/compare?zip=32801'
curl -I http://127.0.0.1:3006/internet/providers/spectrum
curl -I http://127.0.0.1:3006/internet/providers/att
curl -I http://127.0.0.1:3006/internet/providers/t-mobile
curl -I http://127.0.0.1:3006/internet/providers/verizon
curl -I http://127.0.0.1:3006/resources/printables/internet-setup-checklist
curl -I http://127.0.0.1:3006/resources/utility-setup
curl -I http://127.0.0.1:3006/renters/renters-insurance-and-deposits
curl -I http://127.0.0.1:3006/renters/move-in-costs
curl -I http://127.0.0.1:3006/renters/move-in-cost-calculator
curl -I http://127.0.0.1:3006/renters/what-to-photograph-before-moving-in
curl -I http://127.0.0.1:3006/renters/what-utilities-do-renters-pay
curl -I http://127.0.0.1:3006/renters/questions-before-signing-a-lease
curl -I http://127.0.0.1:3006/renters/free-move-in-kit
curl -I http://127.0.0.1:3006/resources/printables/renter-move-in-expense-planner
curl -I http://127.0.0.1:3006/resources/printables/renter-move-in-condition-checklist
curl -I http://127.0.0.1:3006/my-move
curl -I http://127.0.0.1:3006/florida-utilities
curl -I http://127.0.0.1:3006/orange-county-utilities
curl -I 'http://127.0.0.1:3006/request-zip?zip=99999'
curl -I http://127.0.0.1:3006/resources/moving-utility-checklist
curl -I http://127.0.0.1:3006/faq
curl -I http://127.0.0.1:3006/data-sources
curl -I http://127.0.0.1:3006/corrections
curl -I http://127.0.0.1:3006/lookup/32801
curl -I http://127.0.0.1:3006/lookup/32803
curl -I http://127.0.0.1:3006/lookup/32809
curl -I http://127.0.0.1:3006/lookup/34771
curl -I http://127.0.0.1:3006/lookup/34772
curl -I http://127.0.0.1:3006/lookup/99999
curl -I http://127.0.0.1:3006/robots.txt
curl -I http://127.0.0.1:3006/sitemap.xml
curl 'http://127.0.0.1:3006/api/lookup?zip=34741'
pm2 logs movein --lines 100
npm run analytics:check
```

Then run `SEO_BASE_URL=http://127.0.0.1:3006 npm run seo:audit` and `BASE_URL=http://127.0.0.1:3006 npm run check:links`.

## Rollback

Check out the previous known-good commit, run `npm ci && npm run build`, and restart PM2. No schema or seed rollback is needed for this release. If unrelated production data must be rolled back, stop PM2, move the current database aside, restore the verified backup to `/var/lib/movein/movein.sqlite`, confirm ownership, and restart. Never drop tables during an application rollback.
