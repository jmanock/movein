# DigitalOcean deployment

MoveIn runs as a conventional long-lived Next.js Node server on Ubuntu, managed by PM2 and proxied by Nginx to `127.0.0.1:3006`. Do not deploy it to Cloudflare Workers.

## Pre-migration backup

Stop or quiesce the app, create a timestamped SQLite online backup of `/var/lib/movein/movein.sqlite`, and retain it outside `/var/www/movein`. If copying files directly, copy the database and its `-wal` and `-shm` companions together after a clean stop. Confirm the PM2 user owns `/var/lib/movein`.

## Release commands

```bash
cd /var/www/movein
git pull --ff-only origin main
source ~/.bashrc
nvm use 22
npm ci
npm run data:validate
npm run lint
npm test
npm run build
DATABASE_PATH=/var/lib/movein/movein.sqlite npm run db:migrate
DATABASE_PATH=/var/lib/movein/movein.sqlite npm run data:import -- --dry-run --confirm-verified
DATABASE_PATH=/var/lib/movein/movein.sqlite npm run data:import -- --confirm-verified
DATABASE_PATH=/var/lib/movein/movein.sqlite npm run data:coverage
pm2 restart movein --update-env
pm2 save
```

Migration 003 and the reviewed import are required for this release. The confirmation flag is intentional: it prevents silent changes to previously verified records. The exact direct smoke-test command is:

```bash
PORT=3006 DATABASE_PATH=/var/lib/movein/movein.sqlite npm run start -- -H 127.0.0.1
```

`ecosystem.config.cjs` already sets port 3006, loopback host, production mode, one instance, and the persistent database path.

## Nginx expectations

Nginx should proxy the public HTTPS host to `http://127.0.0.1:3006` and pass `Host`, `X-Real-IP`, `X-Forwarded-For`, and `X-Forwarded-Proto`. The app trusts these only for a short-lived hashed in-memory rate-limit key; it does not write the IP to SQLite.

## Verification

```bash
curl -I http://127.0.0.1:3006/
curl -I http://127.0.0.1:3006/homeowners
curl -I http://127.0.0.1:3006/renters
curl -I http://127.0.0.1:3006/learn-your-area
curl -I http://127.0.0.1:3006/resources
curl -I http://127.0.0.1:3006/faq
curl -I http://127.0.0.1:3006/data-sources
curl -I http://127.0.0.1:3006/corrections
curl -I http://127.0.0.1:3006/lookup/32801
curl -I http://127.0.0.1:3006/lookup/99999
curl -I http://127.0.0.1:3006/robots.txt
curl -I http://127.0.0.1:3006/sitemap.xml
curl 'http://127.0.0.1:3006/api/lookup?zip=34741'
pm2 logs movein --lines 100
```

Then run `BASE_URL=http://127.0.0.1:3006 npm run check:links`.

## Rollback

Check out the previous known-good commit, run `npm ci && npm run build`, and restart PM2. Migration 001 is additive, so the prior app can ignore it. If the database itself must be rolled back, stop PM2 and restore the verified pre-migration backup. Never drop tables during an application rollback.
