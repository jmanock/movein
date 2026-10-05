# MoveIn production launch checklist

**CODE READY — MANUAL PRODUCTION CONFIGURATION REMAINS.** [Task 10 patched-version evidence](task-10-release-readiness.md) supersedes the Tasks 8–9 blanket hold. Next 16.3.8 includes the applicable published fixes; runtime audit is zero. Historical advisory entries do not show the patched version is vulnerable. The pending-fix notice remains a watch item without a disclosed applicable ID/range, not an established actionable blocker under Task 10's release rule.

- **Code complete for the scoped first stage:** dependency patch evidence and local auth/upload/build/runtime gates pass. Five high dev-only braces cascade findings are documented tooling risk; omit dev packages after build.
- **Manual production configuration required:** manual account provisioning, protected stable secrets, HTTPS/proxy, persistent database/migrations/backups and target-host testing.
- **First launch:** RECEIPT_EXTRACTOR=disabled is explicit in the fill-in environment template and PM2 defaults; no demo fallback. Auth/My Home/history/public content work with manually provisioned accounts.

Use [staged-production-launch.md](staged-production-launch.md) for exact environment, SQLite/rollback commands, manual-account/proxy checks and the ten-step post-deploy test. This checklist retains the full ordered launch/operations procedure. No deployment, production migration, SMTP/DNS account/configuration or model install was performed. The verdict is not deployment authorization.

Use the approved release commit and a supported Node version (project minimum 22.13; local validation used Node 24.10). The intended platform is Ubuntu/DigitalOcean, Nginx → one PM2 fork process at `127.0.0.1:3006`, one persistent SQLite database. Do not use PM2 cluster mode, ephemeral filesystem storage, shared network SQLite files, or Workers/serverless for this release. Never copy macOS node_modules to Linux.

1. **Backup before any migration.** Keep the old app stopped throughout maintenance. As the app service user, prepare a 0700 backup directory. Set only the existing database path for this step:

   ```sh
   umask 077
   cd /var/www/movein
   export NODE_ENV=production
   export DATABASE_PATH=/var/lib/movein/movein.sqlite
   pm2 stop movein
   backup_stamp="$(date -u +%Y%m%dT%H%M%SZ)"
   # This helper belongs to the new release; it can read the old schema.
   npm run db:backup -- "/var/backups/movein/pre-release-${backup_stamp}.sqlite"
   ```

   Install release dependencies before invoking the helper if necessary, while the old app remains stopped. `DATABASE_PATH` must identify the existing database; never point the migration at an accidental empty checkout copy. For a genuinely new empty installation there is no old DB to back up: record that explicitly, create the directory with the service user's ownership and mode 0700, then initialize with the controlled runner. Keep backups outside the checkout. The helper uses SQLite's online backup API, refuses overwrite, and verifies integrity/foreign keys. Never copy only a live main database file.

2. **Security verification.** On the approved release checkout run `npm ci`, `npm audit`, and `npm audit --omit=dev`. Runtime audit must be clean. Full audit currently reports five high findings deriving from the unpatched development-only braces issue; see [advisory assessment](task-8-production-readiness.md). Build only trusted source/configuration in a restricted environment; don't accept user-supplied glob patterns or give untrusted PR builds production credentials. No forced major upgrades or advisory suppression were used. Recheck official advisories and runtime audit on launch day. Monitor the pending-fix notice; reassess only when an exact published range/applicability identifies the installed version as affected, and apply a stable fix if needed. After building, `npm prune --omit=dev` removes the affected lint chain from runtime installs.

3. **Supply production environment.** Store `/etc/movein/movein.env` outside Git, readable only by the service user (0600); directory 0700. After saving it, export it without printing it: `set -a; . /etc/movein/movein.env; set +a`. Do not deploy .env.local files. Use this variable list:

   | Variable | Required production value |
   | --- | --- |
   | NODE_ENV | production |
   | DATABASE_PATH | /var/lib/movein/movein.sqlite; absolute, persistent, matches PM2 config |
   | BETTER_AUTH_SECRET | Generate 48 random bytes as base64url; stable and private; never use example/test secrets |
   | BETTER_AUTH_URL | https://movein.guide (or the approved actual HTTPS root origin, matching the served host) |
   | AUTH_EMAIL_MODE | disabled; optional |
   | RECEIPT_EXTRACTOR | disabled for initial launch, or ollama after real target-host validation |
   | OLLAMA_BASE_URL | If enabled: http://127.0.0.1:11434 or a configured loopback port; no direct remote URL |
   | OLLAMA_RECEIPT_MODEL | If enabled: already installed local vision model; no cloud model |
   | OLLAMA_RECEIPT_TIMEOUT_MS | If enabled: 1000–600000; default 180000; proxy timeout must exceed it |
   | RECEIPT_PROMPT_VERSION | movein-receipt-v2 (existing default) |
   | NEXT_PUBLIC_GA_MEASUREMENT_ID | Public MoveIn ID G-QC9FYWHVZZ before build; it must match the analytics audit/PM2 config |
   | AUTH_DEV_LOG_MAGIC_LINKS / AUTH_DEV_HOUSEHOLD / RECEIPT_EXTRACTION_DEBUG / NEXT_PUBLIC_GA_DEBUG / NEXT_PUBLIC_GA_ENABLE_DEV | false or unset |
   | PORT | 3006; Node listens only on 127.0.0.1 |

   Generate the secret privately with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`; save it to the protected file, not a shared log. No auth/SMTP/database/Ollama secret may use NEXT_PUBLIC_. Analytics IDs are public. `AUTH_DEV_PORT` is development-only. Build does not need auth secrets; build with public settings and a suitable local/public-data SQLite snapshot rather than placing private production DBs in CI.

4. **Controlled database migration, only during this separately authorized launch.** With the app stopped, environment exported, backup verified, and `DATABASE_PATH` checked:

   ```sh
   npm run db:migrate
   npm run db:migrate # ledger makes this a no-op verification
   node --input-type=module -e 'import Database from "better-sqlite3"; const db=new Database(process.env.DATABASE_PATH,{readonly:true,fileMustExist:true}); if(db.pragma("integrity_check",{simple:true})!=="ok"||db.pragma("foreign_key_check").length)process.exitCode=1; console.log(db.prepare("SELECT name FROM schema_migrations ORDER BY name").all()); db.close();'
   chmod 700 /var/lib/movein
   chmod 600 /var/lib/movein/movein.sqlite
   ```

   The runner applies only missing numbered SQL files, including 007–011, in sorted order, one transaction per migration. Do not call Better Auth automatic migration, db:generate, db:seed, or provider imports for this release. Compare receipt/item/inventory counts and facts with the backup; migration 010 changes only their intended owner/provenance protections, and 011 adds auth tables. Keep legacy data quarantined in its seeded household. Never manually mark a conflicting table migration as applied without review.

5. **Manual account setup.** No SMTP configuration or email delivery is required. Use the protected interactive operator commands documented in [authentication](authentication.md). Create only one controlled test user for release validation.

6. **HTTPS/domain/reverse proxy.** Valid certificate and matching DNS; HTTP redirects to HTTPS; unknown hosts rejected. Bind Node and Ollama to loopback and block direct access. Nginx must overwrite X-Real-IP with the actual trusted client IP, preserve Host/Origin, and set X-Forwarded-Proto=https. If another proxy sits in front, trust only its known network and configured real-IP mechanism. Strip client-supplied identity/forwarding headers; do not use an untrusted forwarded chain. Do not cache auth/private responses. Use no query strings in auth access logs, never log Cookie/Authorization/request bodies, and redact monitoring traces. Serve only Next public assets, not repository, .env, DB or backup files.

   Receipt upload location needs `client_max_body_size 9m` (app still enforces 8 MB plus 64 KB multipart overhead), `client_body_timeout 30s`, `proxy_request_buffering off`, and `proxy_read_timeout`/`proxy_send_timeout` above the configured inference deadline (e.g. 210s for 180s, 630s for 600s). Streaming prevents Nginx's default request-buffer spill from leaving receipt bytes in proxy temporary files. Use a bounded connection/request limit at the proxy too. HSTS belongs on the validated HTTPS host; decide subdomain coverage deliberately. The app supplies nosniff, frame denial, referrer and permissions headers. See [Nginx proxy reference](https://nginx.org/en/docs/http/ngx_http_proxy_module.html).

7. **Auth review.** `npm run production:check` must pass after migration/configuration. It is read-only and prints labels, not values. It validates env shape, DB permissions/ledger/integrity, and the chosen extractor state; it does not verify public DNS/certificate, manual account authentication, disk capacity, offsite backups, or proxy correctness. Verify HttpOnly/Secure/SameSite=Lax cookies, exact trusted origin, seven-day database session, operator-provisioned passwords, 5/minute password login and 100/minute general auth limits, destination restriction, CSRF rejection, and logout revocation. Production console delivery and legacy access are forbidden. Preserve the random auth secret across restarts.

8. **Extractor decision.** Recommended first release: `RECEIPT_EXTRACTOR=disabled`, keeping sign-in, My Home/history and public content available while receipt upload honestly shows unavailable. Enable only a provisioned, capacity-tested real local Ollama vision model. Nothing installs/downloads automatically, and production demo mode fails. See the option comparison in [readiness report](task-8-production-readiness.md). Production processing allows five attempts per household and ten per IP in ten minutes, one active job for this one-process MVP, 8 MB and 20 MP image limits. Rate windows reset on restart; no queue or distributed limit is promised.

9. **Build/validate.** Run `npm test`, `npm run lint`, `npm run data:validate`, `npm run seo:duplicates`, `npm run secrets:check`, `npm run build`, and `npm run analytics:check`. Keep the explicit DB path and public GA setting available to build. Confirm no dev secret/logging flags. Prune development dependencies only after validation/build; leave runtime dependencies, scripts and SQL migrations present.

10. **Deploy/restart, only when separately authorized.** Check PM2 config matches the environment, one fork and loopback binding. `pm2 start ecosystem.config.cjs` for a first launch, or `pm2 restart movein --update-env` for an existing process, then `pm2 save`. Ensure the same protected environment is exported to PM2 on reboot. Read sanitized service logs without dumping the PM2 environment. Inspect both Node and model memory/disk use; a 512 MB Node restart threshold does not provide memory for Ollama.

11. **Non-destructive smoke and audits.** Run `SMOKE_BASE_URL=https://movein.guide npm run production:smoke` on the host with the exported DB path; it makes no sign-in/email/upload/user writes. It checks HTTP/public lookup, sign-in, boolean status, private 307/401 and local DB integrity. Then `SEO_BASE_URL=https://movein.guide npm run seo:audit`, `BASE_URL=https://movein.guide npm run check:links`, and `FRONTEND_AUDIT_URL=https://movein.guide npm run frontend:audit`. The existing health:report includes a rebuild, so run it during maintenance and restart the server afterwards; it is not a zero-impact live monitor.

12. **Manual auth test.** Provision one controlled account, sign in with email/password, check the intended /receipts or /my-home destination and empty first household; log out and verify APIs are 401, then sign in again to the same household. Inspect cookie flags through HTTPS. Check rate limiting from the real proxy.

13. **Household isolation sanity test.** With explicitly isolated test accounts in separate browser profiles, create a reviewed record for A; B must have separate inventory/history. Forged user/household inputs must not switch ownership. Arrange test-data handling before creating live records; the automated smoke does not create them.

14. **Receipt upload if enabled.** On the target host, use an authorized test image and verify actual extraction, corrections, save and history, malformed/oversized rejection, busy/rate responses, and no raw-image/payload logs or disk files. Stop Ollama temporarily in staging to verify honest unavailable behavior and intact saved records. Do not claim capacity/reliability from mocked local tests.

15. **Backup/restore verification.** Configure the daily job, encrypted off-host copy and expiry policy below; actually restore a recent copy into an isolated directory and check integrity/rows. Never perform a restore rehearsal on the live DB. Alert on a missing/failed backup older than 26 hours. Add more frequent backups if a 24-hour loss window is unacceptable.

16. **Rollback.** Stop all app writers; preserve a fresh backup of the current/failed DB and logs before doing anything. Prefer reverting the app while retaining the newer additive schema if the old app is verified compatible and private functionality can stay closed. If a DB restore is necessary, restore the verified pre-release backup into a new filename, integrity-check it, then while stopped move the current DB and its -wal/-shm companions aside together; atomically replace the DB with the verified copy, fix ownership/0600, and start the compatible old app. Do not leave stale WAL companions next to a restored main DB. Any post-backup users/records must be reconciled before discarding them; a restore loses newer writes. No down/drop migrations or automatic rollback are included.

## Minimum SQLite backup routine

Daily at a low-traffic time, run the SQLite API helper with a timestamped filename outside `/var/www/movein`; online backup incorporates committed WAL data safely. Example scheduler body, under the service user (configure it manually; no cron was installed):

```sh
umask 077
set -a
. /etc/movein/movein.env
set +a
cd /var/www/movein
backup_stamp="$(date -u +%Y%m%dT%H%M%SZ)"
npm run db:backup -- "/var/backups/movein/daily-${backup_stamp}.sqlite"
```

Keep at least seven daily copies plus four weekly copies, and one encrypted off-host copy refreshed daily. Restrict directory 0700/files 0600, disk usage and access: backups contain private emails, sessions and purchase data. Apply retention only to verified timestamped backups and only after confirming the newest backup/offsite copy; no destructive retention script was added. Restore-test monthly and before schema releases on a disposable DB; verify integrity, foreign keys, migration ledger, row counts and representative purchase facts. Never copy a live SQLite main file alone. The helper is based on the [SQLite backup API](https://www.sqlite.org/backup.html).
