# Task 7 checkpoint: private MoveIn authentication

Implemented locally on October 4, 2026. No production deployment, production migration, DNS changes, or external email service signup occurred. Task 8 has not begun.

## A. Better Auth version

**1.7.7**, exact pin. Current stable npm version and the installed API were checked against official [Next.js App Router](https://better-auth.com/docs/integrations/next), [SQLite](https://better-auth.com/docs/adapters/sqlite), and [magic-link](https://better-auth.com/docs/plugins/magic-link) documentation. Next route handlers delegate Web Requests to the library handler. Real browser callback cookies were verified.

## B. Files changed for Task 7

- New auth boundary: `app/lib/auth/{config,email,server,membership,destination,client}.ts`.
- New routes/UI: `app/api/auth/[...all]/route.ts`, `app/api/auth-status/route.ts`, `app/sign-in/page.tsx`, `app/components/SignInForm.tsx`.
- Household boundary: `app/lib/households/{current,page-context}.ts`; all three existing receipt/inventory API handlers now await the resolver.
- Consumer integration: receipts/My Home pages, ReceiptWorkspace, HomeInventory, SiteChrome, GoogleAnalytics, privacy page, legacy private-access redirect, robots, globals CSS, Next logging config.
- Database/dependencies: `db/migrations/011_authentication.sql`, package.json, package-lock.json. Better Auth uses the existing better-sqlite3 connection; there is no application ORM conversion. Nodemailer 10.0.14 adds only the isolated SMTP sender; its type package is development-only.
- Validation/setup: `tests/auth.test.mjs`, explicit legacy flags/asynchronous resolver assertions in existing household and receipt-flow tests, frontend audit sign-in redirect expectations, `scripts/dev-auth.mjs`, `.env.example`, README, database, receipt and household documentation, `docs/authentication.md`, this checkpoint.

Earlier Tasks 1–6 changes remain in the working tree. No commit or release was created.

## C. Additive schema

Migration 011 adds `auth_user`, `auth_session`, `auth_account`, `auth_verification`, `auth_rate_limit`, and `household_memberships`, plus library/membership indexes. Schema was generated from the installed library against an empty SQLite database, reviewed, and checked into the existing controlled SQL runner. No library automatic migration runs on startup.

The generated core schema contains required name/image/account credential columns; unused optional fields remain null. No profiles, avatars, passwords, social providers, or new account-management endpoints are enabled. Membership has a unique user key and foreign keys to users and households.

Only the local database was migrated, after a restrictive-permission SQLite backup including WAL state. Receipt/line/inventory content was identical before/after (all three counts were zero in this local database); integrity was `ok`, foreign-key violations zero. The legacy household remains intact. Private evidence/backup is in ignored `outputs/task7`.

## D. Magic-link architecture

Sign-in form → POST auth route → Better Auth hashed verification token → isolated email sender → single-use verification callback → verified session → private destination. Links expire in **10 minutes**. Loading, native invalid-email validation, delivery failure, sent status, signed-in state, and invalid/expired/reused-link recovery are handled. Redirect input is restricted to `/receipts` and `/my-home`. Passwords and social login are disabled; unsupported auth endpoints return 404.

## E. Development delivery

`npm run dev:auth` explicitly enables development-only console delivery, generates an ephemeral secret if necessary, binds to 127.0.0.1, and disables legacy household fallback. Links are private credentials; do not share terminal output. Restarting with a generated secret signs out prior sessions. Ordinary auth logging is disabled and the token-bearing verification route is excluded from Next development request logs; this exclusion was checked in the captured QA logs. No real mail was sent during tests.

## F. Production delivery

SMTP delivery requires explicit sender, host, port, TLS mode, username, and password configuration. The isolated Nodemailer transport enforces TLS and disables transport logging. Missing settings produce a 503 sign-in response and no private access. Console delivery is rejected in production even when its opt-in flag is set. Production SMTP delivery and domain deliverability have **not** been tested against a live provider.

## G. User → household

The session-creation hook requires a verified user. A SQLite transaction finds their existing membership or creates one fresh UUID household and its membership. The unique user key makes repeats idempotent. New accounts never inherit seeded legacy records or fake inventory. Both sequential real logins and the underlying idempotent provisioner are covered.

## H. Session → household

`getCurrentHousehold` verifies the signed, unexpired database session through the auth boundary, requires email verification, joins stored membership to its household, and rejects the reserved development household. Cookie caching is disabled, so logout revocation takes effect on private access. Browser household/user IDs never select ownership. Receipt repositories still know only the trusted household context. Unsafe private requests additionally require the configured exact Origin and reject cross-site fetches.

Sessions last **seven days**, refresh at most daily, and use HttpOnly/SameSite=Lax cookies with Secure enforced in production. Sign-out revokes the current session; separately signed-in sessions remain active.

## I. Routes and navigation

Private pages redirect to `/sign-in?next=...`, preserving the intended private destination. All private APIs return no-store 401 without verified access, before parsing input. Public MoveIn content remains accessible. Navigation adds Sign in or Sign out alongside My Home and Upload receipt. First login shows the existing useful empty state and receipt CTA. The status endpoint exposes only a boolean. Private/sign-in pages are noindex and absent from the public sitemap.

Legacy tests require `AUTH_DEV_HOUSEHOLD=true`, development/loopback, and absent real auth configuration. Missing, invalid, or revoked real sessions cannot fall back to legacy records. The older `/private-access` notice now redirects to sign-in.

Privacy explains email access, authentication/session metadata, household membership, private records, and discarded original images. Private pages suppress analytics, including pausing an already loaded public-page tag. Receipt extraction and review/persistence rules were unchanged.

## J. Security results

The five new real-library integration tests cover: unauthenticated rejection; verified session resolution; A/B repository and API isolation; forged household/user headers and save body rejection; one fresh household per user; repeat-login idempotence; actual session revocation; independent sessions remaining valid; HttpOnly/Secure/SameSite cookies; hashed/single-use links; expired/invalid token rejection; invalid email and untrusted callback rejection; cross-origin/missing-Origin mutation rejection; production console prohibition; and missing production configuration failing closed.

Better Auth database rate limiting is enabled in both environments: **5 magic-link requests per IP per 60 seconds**, general auth **100 per IP per 60 seconds**. The sixth same-IP email request returns 429. Production must supply a trustworthy overwritten X-Real-IP through its reverse proxy and block direct Node access.

## K. Validation and limits

- `npm test`: **121 passed**, zero failures (116 foundation + 5 auth integration tests).
- `npm run lint`: passed.
- `npm run build`: passed.
- Internal links: **110 canonical routes, 139 targets**, no broken links, canonical redirects, or orphans.
- SEO: zero errors/warnings; duplication audit zero blocking findings.
- Frontend audit: passed, **137 source files, 20 representative routes, 142 internal targets**. One existing-style warning: client component count is now 26.
- Analytics configuration check: passed; no event sent to Google by this check.
- Runtime health report: zero failed checks, 29 verified ZIPs, 21 pending, zero verified coverage gaps/broken provider links.
- Final local production-mode HTTP smoke: **13 checks passed**, including private redirects/401, missing-mail 503, failed-verification recovery, disabled password endpoint, status privacy, robots and sitemap.
- Browser QA on an isolated temporary local database: form submission/sent state, `/receipts` restoration, empty My Home/history, authenticated navigation, corrected HTTP logout, post-logout private redirect, reused-link recovery. No test accounts or inventory were added to the real local database.

**Release blocker:** dependency audit reports existing Next.js critical advisories and a Sharp high advisory. Production-only audit: **1 critical, 1 high**; full audit: **1 critical, 21 high**, mostly existing tooling/transitive findings. No Better Auth/Nodemailer dependency finding was reported. Authentication-only work did not broaden into framework/tooling upgrades; resolve these before production exposure. Passing product checks do not override that blocker. Audit JSON is retained privately in ignored `outputs/task7`.

## L. Exact local commands

Run from the MoveIn repository root:

```sh
node --input-type=module -e "import nextEnv from '@next/env'; nextEnv.loadEnvConfig(process.cwd(), true); await import('./scripts/db-migrate.mjs')"
npm run dev:auth
```

Open `http://127.0.0.1:3007/sign-in`. Enter a test email, open the private link from that terminal using the same hostname/browser, and visit My Home or receipts. For the full labeled fixture flow without installing a model: `RECEIPT_EXTRACTOR=demo npm run dev:auth`. For actual image reading use the existing Ollama setup in `docs/receipts.md`; no extractor is silently selected by the auth helper. If a local server occupies 3007, stop that server first or use `AUTH_DEV_PORT=3008 npm run dev:auth` and the matching URL. The Task 7 QA server is stopped at completion.

## M. Exact remaining production configuration

Set privately: `NODE_ENV=production`, `DATABASE_PATH=/absolute/persistent/path/movein.sqlite`, `BETTER_AUTH_SECRET=<48 random bytes encoded as base64url>`, `BETTER_AUTH_URL=https://YOUR_REAL_HOST`, `AUTH_EMAIL_MODE=smtp`, `AUTH_EMAIL_FROM`, `AUTH_SMTP_HOST`, `AUTH_SMTP_PORT`, `AUTH_SMTP_SECURE`, `AUTH_SMTP_USER`, `AUTH_SMTP_PASS`. Set `AUTH_DEV_LOG_MAGIC_LINKS=false` and `AUTH_DEV_HOUSEHOLD=false`. Use implicit TLS when secure=true (usually port 465), otherwise mandatory STARTTLS (usually 587). Keep the existing separately documented receipt configuration.

Also required: patched dependency baseline; trusted SMTP service and validated sender domain/SPF/DKIM/DMARC; HTTPS; reverse proxy overwriting X-Real-IP and preserving Host/Origin; Node bound to loopback; no auth query/cookie/body logging; protected secret storage; backed-up persistent SQLite; separately authorized production migration/deployment; post-release real-delivery and security smoke tests. The ordered production checklist is in `docs/authentication.md`. None of these external production actions was performed.

## N. Recommended Task 8

Production release readiness and an explicitly approved staged rollout: dependency patches, live SMTP deliverability, proxy/HTTPS configuration, database backups and migration rehearsal, monitoring redaction, and production smoke tests. Do not treat this recommendation as deployment authorization.
