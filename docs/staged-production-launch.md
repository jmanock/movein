# MoveIn first staged production launch

**CODE READY — MANUAL PRODUCTION CONFIGURATION REMAINS.** See [Task 10 advisory evidence](task-10-release-readiness.md). No deployment, production migration, DNS/email account configuration or model installation was performed. These are operator commands for a later authorized launch.

## First-launch mode

Use the existing DigitalOcean Ubuntu → Nginx → one PM2 fork → Next `127.0.0.1:3006` architecture. Use service-owned persistent local SQLite, never an ephemeral or network-shared DB. Keep real scanning explicitly **off**: `RECEIPT_EXTRACTOR=disabled`. Public homepage/ZIP/providers/guides/resources and sign-in remain available. Configured SMTP/auth provisions private households, My Home and receipt history. The receipt page shows “Receipt reading is unavailable.” and processing returns 503 for an authenticated request. Saved records remain usable. Production demo mode fails closed; no fake extraction or provider fallback.

## Exact manual variables

Fill [first-launch.env.example](first-launch.env.example), copy privately to `/etc/movein/movein.env` (0600, service-owned; directory 0700). Do not deploy developer .env.local or commit the filled file. Quote values containing spaces/shell characters because commands below source the file.

| Name used by current implementation | Supply / handling |
| --- | --- |
| NODE_ENV | production |
| PORT | 3006, matching PM2 and loopback proxy target |
| DATABASE_PATH | Existing approved absolute persistent path; default PM2 target /var/lib/movein/movein.sqlite |
| BETTER_AUTH_SECRET | Private stable random secret, at least 32 characters; recommended 48 random bytes as base64url; preserve across restarts |
| BETTER_AUTH_URL | Exact actual HTTPS root origin (no path/query/credentials), matching browser/proxy origin; use the staging HTTPS host if this is a separate stage |
| AUTH_EMAIL_MODE | smtp; console prohibited in production |
| AUTH_EMAIL_FROM | Verified sender mailbox or quoted display name + mailbox; no CR/LF |
| AUTH_SMTP_HOST | Provider's authenticated SMTP hostname |
| AUTH_SMTP_PORT | Usually 587 STARTTLS, or 465 implicit TLS; provider-specified |
| AUTH_SMTP_SECURE | false for mandatory STARTTLS / true for implicit TLS; certificate verification remains on |
| AUTH_SMTP_USER / AUTH_SMTP_PASS | Private provider login / password or provider-issued SMTP API credential |
| RECEIPT_EXTRACTOR | **disabled** for the first stage |
| NEXT_PUBLIC_GA_MEASUREMENT_ID | Public approved MoveIn ID G-QC9FYWHVZZ before build, matching audit/PM2; not a secret |
| NEXT_PUBLIC_GA_DEBUG / NEXT_PUBLIC_GA_ENABLE_DEV | false |
| AUTH_DEV_LOG_MAGIC_LINKS / AUTH_DEV_HOUSEHOLD / RECEIPT_EXTRACTION_DEBUG | false |

Generate the auth secret manually in a private terminal with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`, then store it privately. Never prefix auth/SMTP/DB secrets with NEXT_PUBLIC_. No new environment names were invented for application config.

Only if later enabling a provisioned real extractor: `RECEIPT_EXTRACTOR=ollama`, `OLLAMA_BASE_URL=http://127.0.0.1:11434` (or loopback IPv6/port), `OLLAMA_RECEIPT_MODEL=<already-installed-local-vision-model>`, optional `OLLAMA_RECEIPT_TIMEOUT_MS=180000` (1000–600000), and `RECEIPT_PROMPT_VERSION=movein-receipt-v2` (current default). No direct remote URL/cloud model, automatic downloads or demo. None of these Ollama settings is required while disabled. For a later approved enablement, update the explicit PM2 RECEIPT_EXTRACTOR entry too; its first-stage disabled value overrides an exported shell setting.

PM2 currently pins DB path/port/public analytics, disabled extraction and false debug/development flags in ecosystem.config.cjs. Verify those match the supplied values before a future launch; preserve the exported private environment in PM2/reboot setup. Public NEXT_PUBLIC_ values are frozen into builds; runtime PM2 changes cannot repair an incorrectly built analytics bundle. Read the installed Next self-hosting/environment guide when making deployment-code changes.

## SMTP and delivery requirements

Choose the provider manually. Current adapter uses **Nodemailer SMTP**, not a generic HTTP email API. A provider “API key” works only if its SMTP service accepts that credential; an HTTP-only API requires separate work and is not configured here. Supply host/port/auth/TLS plus a verified From mailbox/domain. Configure the provider's sender/domain verification, SPF (avoid duplicate SPF records), DKIM selectors and DMARC policy/alignment as instructed by that provider. Ensure outbound SMTP is permitted from the droplet. No external account or DNS record was created.

Transport requires TLS/certificate verification, has 10s connect/greeting and 20s socket bounds, no body/token debug logging. Development console links cannot activate in production. Test through the actual HTTPS sign-in page using a mailbox you control: request once, receive in inbox/spam, inspect expected sender/domain and exact HTTPS link origin, open within ten minutes, confirm sign-in, then confirm reuse is rejected. Test expired links and a controlled staging delivery failure; users should receive safe errors and no account-access fallback. Do not log tokens or paste links into monitoring.

## Exact SQLite sequence (manual, not executed)

Use the approved release checkout with installed dependencies and protected environment. An administrator must prepare service-owned directories before these steps. When running as the intended app service user, the ownership values are:

```sh
sudo install -d -m 700 -o "$(id -un)" -g "$(id -gn)" /var/lib/movein /var/backups/movein /etc/movein
# Store the manually filled private environment file with that owner and mode 0600.
```

Verify this user is the PM2 service owner; do not substitute a different SSH/admin user's ownership. Existing directory contents must be inspected before changing their ownership. Use the approved release checkout with installed dependencies and protected environment. For an existing deployment, stop all writers for maintenance. If there is no PM2 process yet, skip the stop; if no old database exists, explicitly record a new installation, initialize through migrations, and use the reviewed public-data provisioning procedure. Do not invent private records or silently seed over an existing DB.

### 1. Identify the existing path and baseline

```sh
umask 077
cd /var/www/movein
set -a
. /etc/movein/movein.env
set +a
# Verify the absolute path matches PM2 and refers to the actual current database.
test -n "$DATABASE_PATH"
test -f "$DATABASE_PATH"
pm2 stop movein  # existing process only; skip for a first installation
# Run as the service owner; provision owner-only backup directory beforehand.
node --input-type=module <<'JS'
import Database from 'better-sqlite3';
const db=new Database(process.env.DATABASE_PATH,{readonly:true,fileMustExist:true});
if(db.pragma('integrity_check',{simple:true})!=='ok'||db.pragma('foreign_key_check').length)throw new Error('Source integrity failed');
for(const name of ['zip_codes','providers','receipts','receipt_items','inventory_items']) {
 if(db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(name)) console.log(name,db.prepare(`SELECT count(*) n FROM ${name}`).get().n);
}
db.close();
JS
```

Record counts privately for before/after comparison. Do not dump purchase rows, emails or sessions. If PM2's currently running path differs, resolve it before backup/migration; do not accidentally migrate an empty checkout copy.

### 2–3. Online backup and verify

```sh
backup_stamp="$(date -u +%Y%m%dT%H%M%SZ)"
release_backup="/var/backups/movein/pre-stage-${backup_stamp}.sqlite"
npm run db:backup -- "$release_backup"
# Helper refuses overwrite and already verifies integrity/FKs; independently reopen it.
node --input-type=module - "$release_backup" <<'JS'
import Database from 'better-sqlite3';
const db=new Database(process.argv[2],{readonly:true,fileMustExist:true});
if(db.pragma('integrity_check',{simple:true})!=='ok'||db.pragma('foreign_key_check').length)throw new Error('Backup integrity failed');
console.log('Backup reopens cleanly');db.close();
JS
```

Backup must be outside the checkout, directory 0700/file 0600, service-owned. Restore-test an isolated copy before migrating. SQLite online backup includes committed WAL contents; never copy just the live main file. Minimum daily verified backup with seven daily/four weekly retention, encrypted daily off-host copy, >26h stale alert and monthly isolated restore; 24h potential loss window must be acceptable.

### 4. Ordered pending migrations

```sh
npm run db:migrate
npm run db:migrate  # verification: ledger should make this a no-op
chmod 700 "$(dirname "$DATABASE_PATH")"
chmod 600 "$DATABASE_PATH"
```

Existing runner sorts all numbered migrations and applies missing files individually in transactions, including 007–011. No auth automatic migration. No db:generate, seed/import, drop or down migration for this existing-data release. Migration 010 quarantines legacy purchases in their seeded household; do not associate those rows with new sign-ins. For a brand-new DB, migrations alone do not populate ZIP/provider data: restore a verified intended public-data snapshot or separately follow the reviewed import procedure before launch.

### 5–7. Foreign keys, auth/households and public data

```sh
node --input-type=module <<'JS'
import Database from 'better-sqlite3';import {readdirSync} from 'node:fs';
const db=new Database(process.env.DATABASE_PATH,{readonly:true,fileMustExist:true});
if(db.pragma('integrity_check',{simple:true})!=='ok'||db.pragma('foreign_key_check').length)throw new Error('Post-migration integrity failed');
const ledger=new Set(db.prepare('SELECT name FROM schema_migrations').all().map(x=>x.name));
for(const name of readdirSync('db/migrations').filter(x=>x.endsWith('.sql')))if(!ledger.has(name))throw new Error('Missing migration');
for(const name of ['households','household_memberships','auth_user','auth_session','auth_account','auth_verification','auth_rate_limit','zip_codes','providers','receipts','receipt_items','inventory_items']) {
 if(!db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(name))throw new Error('Required table absent');
 console.log(name,db.prepare(`SELECT count(*) n FROM ${name}`).get().n);
}
if(!db.prepare('SELECT count(*) n FROM zip_codes').get().n||!db.prepare('SELECT count(*) n FROM providers').get().n)throw new Error('Public data empty');
console.log('Migration ledger, tables and foreign keys verified');db.close();
JS
npm run data:validate
npm run production:check
```

Compare ZIP/provider and purchase counts/facts with baseline/backup. Auth tables may be empty for a genuinely new stage; their existence/FKs and controlled sign-in prove readiness, not fabricated users. `production:check` verifies shapes/permissions/DB/extractor choice but does not prove SMTP delivery, public certificate, proxy, disk capacity or backups.

### 8. Health/build and separately authorized restart

Run npm ci/test/lint, full/runtime npm audit (dev-only braces documented separately), data/SEO/analytics gates and npm run build with public config + explicit DB path. Build before pruning dev dependencies. `health:report` also runs tests/build and needs development tooling; run during maintenance, then restart afterwards. `npm prune --omit=dev` is after all build-time checks. Verify the actual target Linux install, not copied macOS node_modules.

Only at a separately authorized launch: start the one-fork PM2 config or restart movein with `--update-env`, save/review reboot environment, then use `SMOKE_BASE_URL=https://<approved-host> npm run production:smoke` on the host. Run link/SEO/frontend/analytics audits against that target. Smoke makes no user, mail, upload or migration writes.

### 9. Rollback procedure

Stop all writers, preserve a fresh online backup of the current/failed DB, and retain the verified pre-stage backup. Prefer the prior app with the newer schema only if compatibility/private gating is verified. If restoring the DB is necessary, verify the old backup again, reconcile newer writes (restoration loses them), and only while stopped:

```sh
# Set this to the verified pre-stage copy; do not use a failed or untested backup.
test -f "$release_backup"
rollback_stamp="$(date -u +%Y%m%dT%H%M%SZ)"
quarantine_dir="/var/backups/movein/failed-${rollback_stamp}"
mkdir -m 700 "$quarantine_dir"
# Copy a verified backup to a NEW candidate while the current DB remains intact.
rollback_candidate="${DATABASE_PATH}.restored-${rollback_stamp}"
test ! -e "$rollback_candidate"
cp -n "$release_backup" "$rollback_candidate"
chmod 600 "$rollback_candidate"
node --input-type=module - "$rollback_candidate" <<'JS'
import Database from 'better-sqlite3';
const db=new Database(process.argv[2],{readonly:true,fileMustExist:true});
if(db.pragma('integrity_check',{simple:true})!=='ok'||db.pragma('foreign_key_check').length)throw new Error('Restore candidate invalid');
db.close();
JS
mv "$DATABASE_PATH" "$quarantine_dir/database.sqlite"
for suffix in -wal -shm; do
 if test -e "${DATABASE_PATH}${suffix}"; then mv "${DATABASE_PATH}${suffix}" "$quarantine_dir/database.sqlite${suffix}"; fi
done
mv "$rollback_candidate" "$DATABASE_PATH"
# Restore service ownership if necessary, and start only the verified compatible prior app.
```

Keep the current DB and WAL/SHM companions together in quarantine; never leave stale WAL beside the restored main file. Do not drop additive tables or delete newer users/records without reconciliation. No rollback command was executed here.

## HTTPS / Nginx / secure sessions

Verify real DNS/certificate, HTTP→HTTPS, reject unknown hosts, preserve the actual approved Host and Origin, overwrite X-Forwarded-Proto with https, overwrite X-Real-IP from a trusted client source; strip untrusted incoming forwarding/identity headers. If another proxy precedes Nginx, trust only its configured network. Bind Node/Ollama to loopback; block direct 3006/11434 access. Use exact BETTER_AUTH_URL trusted origin, HttpOnly + Secure + SameSite=Lax cookie, ten-minute hashed single-use link and seven-day database session. No auth/private proxy caching. Redact query tokens/Cookie/Authorization/body logs and do not serve repository, env, SQLite or backups.

Set upload location client_max_body_size 9m (app file limit 8 MB + multipart cap), client_body_timeout 30s, proxy_request_buffering off to avoid raw receipt spill, and connection/request bounds. For later extraction, proxy_read_timeout/proxy_send_timeout exceed model deadline: 210s for 180s default; 630s for 600s maximum. Disabled scanning needs no model service. Inspect cookie flags through actual HTTPS, not plain loopback tests. Review HSTS only after certificate/host correctness. Existing app security headers remain.

## Short ordered post-deploy smoke (controlled account, no destructive tests)

1. Homepage loads; navigation works.
2. ZIP 32801 lookup shows reviewed providers/official links.
3. Open sign-in and request one link for a controlled test mailbox.
4. Receive it; verify sender and exact approved HTTPS origin.
5. Open within ten minutes; sign in and confirm secure cookie flags.
6. My Home shows the new household's empty inventory/history.
7. Sign out; private APIs return 401.
8. Sign in again to the same email; verify the same household/membership, not a newly created one (operator read-only membership comparison, no IDs in shared logs).
9. Signed out/in a separate private browser, /my-home and /receipts redirect to sign-in; /api/my-home rejects.
10. Signed in, receipt page honestly says reading unavailable, no upload form; no demo purchases, My Home/history still work.

This manual test creates only the explicitly controlled sign-in account/membership. Automated production:smoke creates none. No user records were created on production during this task.
