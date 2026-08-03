# DigitalOcean deployment

MoveIn runs as a conventional long-lived Next.js Node server on Ubuntu, managed by PM2 and proxied by Nginx to `127.0.0.1:3006`. Do not deploy it to Cloudflare Workers.

## Pre-migration backup

Stop or quiesce the app, create a timestamped SQLite online backup of `/var/lib/movein/movein.sqlite`, and retain it outside `/var/www/movein`. If copying files directly, copy the database and its `-wal` and `-shm` companions together after a clean stop. Confirm the PM2 user owns `/var/lib/movein`.

```bash
sudo install -d -o "$USER" -g "$USER" /var/backups/movein
sqlite3 /var/lib/movein/movein.sqlite ".backup '/var/backups/movein/movein-before-phase-3.sqlite'"
test -s /var/backups/movein/movein-before-phase-3.sqlite
```

## Release commands for this front-end release

```bash
cd /var/www/movein
git pull --ff-only origin main
source ~/.bashrc
nvm use 22
export NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QC9FYWHVZZ
export DATABASE_PATH=/var/lib/movein/movein.sqlite
npm ci
npm run data:validate
npm run db:migrate
npm run data:import -- --dry-run
npm run data:import -- --confirm-verified
npm run seo:duplicates
npm run seo:audit
npm run lint
npm test
npm run build
npm run data:coverage
pm2 restart movein --update-env
pm2 save
```

This release adds reviewed CSV coverage without a new schema migration. Keep the idempotent migration step in the release sequence, back up the persistent database, dry-run the import, then apply it with the verified-row confirmation shown above. The exact direct smoke-test command is:

```bash
PORT=3006 DATABASE_PATH=/var/lib/movein/movein.sqlite npm run start -- -H 127.0.0.1
```

`ecosystem.config.cjs` already sets port 3006, loopback host, production mode, one instance, and the persistent database path. GA4 is a public build-time value; export it before `npm run build`, then use `pm2 restart movein --update-env` so dynamic responses receive the same value.

## Nginx expectations

Nginx should proxy the public HTTPS host to `http://127.0.0.1:3006` and pass `Host`, `X-Real-IP`, `X-Forwarded-For`, and `X-Forwarded-Proto`. The app trusts these only for a short-lived hashed in-memory rate-limit key; it does not write the IP to SQLite.

## Verification

```bash
curl -I http://127.0.0.1:3006/
curl -I http://127.0.0.1:3006/homeowners
curl -I http://127.0.0.1:3006/renters
curl -I http://127.0.0.1:3006/learn-your-area
curl -I http://127.0.0.1:3006/resources
curl -I http://127.0.0.1:3006/florida-utilities
curl -I http://127.0.0.1:3006/orange-county-utilities
curl -I 'http://127.0.0.1:3006/request-zip?zip=99999'
curl -I http://127.0.0.1:3006/resources/moving-utility-checklist
curl -I http://127.0.0.1:3006/faq
curl -I http://127.0.0.1:3006/data-sources
curl -I http://127.0.0.1:3006/corrections
curl -I http://127.0.0.1:3006/lookup/32801
curl -I http://127.0.0.1:3006/lookup/32803
curl -I http://127.0.0.1:3006/lookup/99999
curl -I http://127.0.0.1:3006/robots.txt
curl -I http://127.0.0.1:3006/sitemap.xml
curl 'http://127.0.0.1:3006/api/lookup?zip=34741'
pm2 logs movein --lines 100
```

Then run `SEO_BASE_URL=http://127.0.0.1:3006 npm run seo:audit` and `BASE_URL=http://127.0.0.1:3006 npm run check:links`.

## Rollback

Check out the previous known-good commit, run `npm ci && npm run build`, and restart PM2. No schema or seed rollback is needed for this release. If unrelated production data must be rolled back, stop PM2, move the current database aside, restore the verified backup to `/var/lib/movein/movein.sqlite`, confirm ownership, and restart. Never drop tables during an application rollback.
