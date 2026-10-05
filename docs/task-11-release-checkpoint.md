# Task 11: production release paused at email configuration

October 5, 2026. Production release was authorized, but the required live Better Auth/SMTP configuration is absent. **NOT DEPLOYED.** Per Task 11's stop condition, no production backup/migration/push/build/restart/configuration change or email request was performed. The existing site remains online. The prepared local release commit contains this checkpoint; its hash is reported in the chat and available through git log.

## A. Architecture detected

Verified through existing known-host SSH access and live configuration: server 162.243.4.99, Ubuntu/Nginx TLS virtual host movein.guide → 127.0.0.1:3006 → one root-owned PM2 movein fork, cwd /var/www/movein. Actual live DATABASE_PATH is /var/lib/movein/movein.sqlite. GitHub repo jmanock/movein has no Actions workflows or registered deployments; the inspected established mechanism is direct SSH/PM2, not App Platform or a GitHub Actions rollout. Do not infer hidden webhook behavior from this; no push occurred.

## B. Release source

Production remains on main at **b8b7006be1ef13d62cbea41c57d775d6dfbe8abe**, clean checkout, manifest Next 16.2.12 with no Better Auth. Local release retains Tasks 1–10: Next 16.3.8, Sharp 0.35.5, Better Auth 1.7.7, receipt/home refresh, private household/auth foundations and safe disabled first-launch PM2 defaults. Commit title: **MoveIn Home receipt MVP and private household foundation**. Local branch main; origin https://github.com/jmanock/movein.git. Commit is local only until configuration/delivery gates are satisfied. No force push.

Reviewed tracked diff/new-file manifest and heuristic secrets scan. Real env files, local SQLite/WAL, receipt images/evaluation reports, private logs, node_modules/builds/outputs are ignored/excluded. .env.example and docs/first-launch.env.example are blank-credential templates, not live configuration. Generated AGENTS/CLAUDE instructions are retained as instructed. No production credentials were printed or committed.

## C. Backup

**Not created**: stop condition reached before migration preparation. A timestamped online backup outside the checkout must be created and independently verified when resuming; do not migrate first. Exact backup/restore commands are in [staged launch runbook](staged-production-launch.md). No rollback backup path is claimed.

## D–E. Migration level / applied

Read-only live SQLite checks: integrity **ok**, foreign-key errors **0**, **50 ZIPs / 56 providers**. Applied ledger is 001–006, ending 006_retire_natural_gas.sql. Current level remains 006; **no migration applied**. Pending local files are 007_receipts_and_inventory.sql, 008_receipt_save_requests.sql, 009_receipt_intelligence.sql, 010_household_ownership.sql and 011_authentication.sql. Apply only through the existing runner after verified backup and configuration readiness. Preserve actual production public-data counts; do not seed over this DB or add fake purchases.

## F–I. Release mechanism / URL / HTTPS / public checks

Mechanism positively identified as direct SSH/PM2 but **not executed**. URL: https://movein.guide. Baseline HTTPS GET returned 200 with valid system-trusted TLS and nginx/1.24.0 (Ubuntu); both root/www resolve to the inspected server. Nginx virtual host proxies to the expected loopback port. This is a pre-release baseline, not successful post-deployment verification. Full public/mobile/assets/canonical/HTTP redirect release checks remain pending.

## J–M. Authentication / households / My Home / extraction

Live process and .env.production have no BETTER_AUTH_SECRET, BETTER_AUTH_URL, AUTH_EMAIL_MODE/FROM or AUTH_SMTP_HOST/PORT/USER/PASS. /etc/movein/movein.env is absent. No sign-in email was sent or production test account created. Therefore production authentication, new household/re-login, My Home and authenticated receipt-page behavior remain **unverified and not enabled by this release**. No auth bypass.

Local staged config explicitly sets RECEIPT_EXTRACTOR=disabled and false development/debug flags. Do not install Ollama/models. When resumed, verify actual PM2 runtime receives disabled mode, then check authenticated unavailable copy/no upload form/no demo or model calls. Local isolated production-mode proof is documented in Task 10; it does not replace real HTTPS/SMTP validation.

## N. Logs

No new release logs exist because nothing was launched. Live environment inspection captured and summarized values in memory without dumping credentials; no tokens were requested. Post-release sanitized auth/SQLite/origin/migration/extractor/error log review remains pending.

## O. Required/optional configuration and manual actions

| Application setting | Requirement / detected state |
| --- | --- |
| NODE_ENV | production required; preserve established PM2 mode and verify after restart |
| DATABASE_PATH | Required, positively verified live /var/lib/movein/movein.sqlite |
| BETTER_AUTH_SECRET | **Missing**; provision a stable private random secret in protected server configuration; can be generated privately when resuming |
| BETTER_AUTH_URL | **Missing**; exact HTTPS root origin https://movein.guide |
| Trusted origin / SITE_URL | No separate auth trusted-origin variable; library derives trustedOrigins from BETTER_AUTH_URL. Public canonical SITE_URL is code-defined as https://movein.guide |
| AUTH_EMAIL_MODE | **Missing**; smtp, never production console |
| AUTH_EMAIL_FROM | **Missing**; verified sender mailbox/domain, no CR/LF |
| AUTH_SMTP_HOST | **Missing**; provider's authenticated SMTP host |
| AUTH_SMTP_PORT / AUTH_SMTP_SECURE | **Missing**; provider port and TLS mode, usually 587/false mandatory STARTTLS or 465/true implicit TLS |
| AUTH_SMTP_USER / AUTH_SMTP_PASS | **Missing**; private SMTP login/password or provider-issued SMTP credential |
| NEXT_PUBLIC_GA_MEASUREMENT_ID | Existing app uses public ID G-QC9FYWHVZZ; preserve in build/PM2 and reverify actual production HTML/bundle |
| RECEIPT_EXTRACTOR | Required first-release value disabled; absent in old process, explicit in prepared new PM2 config |
| AUTH_DEV_LOG_MAGIC_LINKS / AUTH_DEV_HOUSEHOLD / RECEIPT_EXTRACTION_DEBUG / NEXT_PUBLIC_GA_DEBUG / NEXT_PUBLIC_GA_ENABLE_DEV | false required for this release |
| OLLAMA_BASE_URL / OLLAMA_RECEIPT_MODEL / OLLAMA_RECEIPT_TIMEOUT_MS / RECEIPT_PROMPT_VERSION | Not needed while disabled; do not enable inference or provision models |
| PORT | Existing 3006, keep one fork and loopback binding |

Supply provider/SMTP host, port/TLS, username, credential and verified From address; complete provider domain verification/SPF/DKIM/DMARC as required. **Do not paste secrets into chat.** Put credentials in the service-owned protected /etc/movein/movein.env (directory 0700/file 0600), or use an established secure provisioning method. Fill the documented stable secret and HTTPS auth URL too. No vendor account is created automatically. Current adapter is SMTP, not a generic HTTP-only email API.

Designate a controlled test mailbox. If inbox access is unavailable to automation, the human must receive/click the real link; then verify secure cookies, one household, My Home empty state, logout revocation, re-login to the same household, anonymous rejection and disabled receipt UI. No destructive real-user isolation testing.

After configuration is supplied: verify env/delivery without logging values; run target preflight; take/verify online backup; apply pending migrations; verify FKs/ledger/public counts; deploy the approved commit using the existing one-process SSH/PM2 procedure; run public/auth/disabled-extractor/log gates. Existing deployment authorization remains; no need to reauthorize routine steps unless scope changes.

## P. Health / local release gate

**New launch not performed; cannot label it HEALTHY.** Baseline homepage/SQLite/PM2 are healthy, and the application-code gate remains ready. Production blocker is absent email/auth configuration, not a demonstrated new code defect.

| Local gate | Result |
| --- | --- |
| npm ci | PASS, clean dependency installation |
| npm test | **126 passed**, zero failures/skips |
| Lint / build | PASS, no lint warnings, production Next 16.3.8 build |
| Runtime dependency audit | PASS, zero findings |
| Full npm audit | Five high development-only braces cascade findings, zero critical; retained as documented tooling risk |
| Links / SEO / analytics | PASS; 110 canonical routes/139 link targets, zero SEO errors/warnings, expected public analytics ID/single tag owner/privacy gates |
| SEO duplication | PASS, 81 pages/34 guides, zero blocking duplicates |
| Frontend | PASS, existing 26-client-component bundle review warning retained |
| Runtime health | PASS, all five health-report gates; health rebuild followed by clean local server restart |
| Production smoke | PASS against local loopback production-mode build; no user/mail/upload/migration writes |
| Local production:check | Expected FAIL because actual production SMTP/auth, owner-only provisioned storage and explicit runtime extractor choice are not supplied in local environment. This is not target-host readiness; target preflight awaits configuration |
| Secrets/staging review | No heuristic findings; intended source/templates only, no private DB/images/env/log artifacts staged |

The existing provider-link snapshot is reused by health reporting, not a fresh external crawl; 21 pending/noindex ZIPs remain in the research queue. No target deployment/authentication outcome is inferred from local checks.

See [Task 10 readiness](task-10-release-readiness.md), [launch checklist](production-launch-checklist.md), [staged runbook](staged-production-launch.md) and [fill-in template](first-launch.env.example). Existing source-control/deployment state is preserved until safe continuation.
