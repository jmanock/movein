# MoveIn authentication

Better Auth **1.7.7** (exact pin) supplies magic-link-only login and signed, database-backed sessions. Verified against the installed implementation and current official [Next.js](https://better-auth.com/docs/integrations/next), [SQLite](https://better-auth.com/docs/adapters/sqlite), [magic-link](https://better-auth.com/docs/plugins/magic-link), and [rate-limit](https://better-auth.com/docs/concepts/rate-limit) documentation. The existing better-sqlite3 connection is passed directly to Better Auth; its internal SQL adapter is isolated within auth. MoveIn has no new application ORM or migration runner. Nodemailer 10.0.14 is the isolated, provider-neutral TLS SMTP sender.

## Local sign-in

From the repository root, stop an older server occupying port 3007, then:

```sh
# Apply additive migrations to the LOCAL database. This loads .env.local consistently with Next.
node --input-type=module -e "import nextEnv from '@next/env'; nextEnv.loadEnvConfig(process.cwd(), true); await import('./scripts/db-migrate.mjs')"
npm run dev:auth
```

Open `http://127.0.0.1:3007/receipts` or `/my-home`. Enter a test email on the sign-in page; the terminal prints the **private, single-use** URL. Open it using the same browser and the same `127.0.0.1` hostname. New users see an empty household. Receipt reading uses the existing extractor configuration: follow `docs/receipts.md` to select a locally installed Ollama model. For a labeled fixture-only development flow, start with `RECEIPT_EXTRACTOR=demo npm run dev:auth`. The auth helper does not choose or change the extractor. Repeat with a different email in a separate browser to check isolation. Sign out and confirm private pages return to sign-in. Reopen a consumed link to see its error. Links expire in 10 minutes.

`dev:auth` opts in to console delivery and disables legacy fallback. It generates a secret in memory if none is supplied; restarting then invalidates older signed cookies. Set a private, stable `BETTER_AUTH_SECRET` in .env.local if persistent local sessions are wanted. Do not share terminal links or logs. `AUTH_DEV_PORT=3008 npm run dev:auth` changes both port and callback origin. If `DATABASE_PATH` is set, it must be absolute. Migration and app must target the same database.

Legacy receipt fixtures remain available with `NODE_ENV=development`, `AUTH_DEV_HOUSEHOLD=true`, and **no** `BETTER_AUTH_SECRET` or `BETTER_AUTH_URL`. This remains a shared loopback test mode, not an account. Real auth configuration always takes precedence, including invalid/revoked sessions. Existing legacy records are preserved; no automatic reassignment or migration of their ownership occurs.

## Schema and household lifecycle

Migration 011 adds the five library tables and a membership table keyed by user ID. Required library name/image/account-token/password columns follow the generated base schema; no profile UI, avatars, passwords, or social providers are enabled. Unused optional fields remain null. Session rows may contain IP/user-agent information. Verification identifiers are hashed; verification records are consumed atomically by Better Auth.

Before the first verified session is created, a SQLite transaction checks email verification, finds an existing membership, or creates a fresh UUID household and its membership. The unique user key makes repeat login idempotent. Receipt business code still receives only a household context; it has no Better Auth dependency. The reserved legacy household never grants authenticated access. No fake inventory is seeded.

The central resolver verifies the Better Auth session against SQLite on every private request (cookie cache disabled), requires a verified user and a real household membership, and ignores query/body/header ownership claims. Unsafe private requests also require the configured exact Origin and reject cross-site fetches. Receipts/My Home redirect to `/sign-in?next=...`; destinations are restricted to those two pages. Private APIs return 401 with no-store before parsing uploads or bodies. Public content stays anonymous. The catch-all auth handler exposes only magic-link request/verification, current session, and sign-out. Navigation status returns only a boolean, not identity or membership IDs.

## Sessions, abuse, and delivery

Sessions expire after seven days, refresh at most daily, use HttpOnly and SameSite=Lax cookies, and require Secure cookies in production. Sign-out deletes the current database session. Other independently signed-in sessions remain active. Better Auth checks auth endpoint origins; the household resolver separately protects receipt mutations.

Database rate limiting is enabled in development and production: magic-link requests allow **5 per 60 seconds per IP**; other auth endpoints allow **100 per 60 seconds per IP**. These limits apply to the HTTP handler, not direct library API calls. Private APIs never call a sign-in library API. This is basic abuse prevention, not a distributed anti-abuse system. One SQLite database is shared by this app instance.

Development console delivery requires both `NODE_ENV=development` and `AUTH_DEV_LOG_MAGIC_LINKS=true`. Production console mode is rejected even with that flag. SMTP mode requires every sender/credential variable; it enforces TLS (implicit TLS or STARTTLS) and disables mail transport logging. Missing configuration gives a clear 503 sign-in response and no private access. No email service account was created. SMTP connectivity/deliverability must be tested by the operator before release; presence of config is not proof of delivery.

Ordinary auth logging is disabled; Next development request logging omits the token-bearing verification route. Production reverse-proxy and monitoring logs must omit query strings on auth routes, redact cookies/Authorization, and never capture email bodies. Sign-in, receipt, and My Home pages do not initialize analytics or emit page views. Raw receipt images remain in-memory and discarded; the extraction pipeline is unchanged.

## Eventual production checklist — not performed

1. Review the full checkpoint and release diff. Address dependency audit findings before exposing the service (see checkpoint). Provision a trusted SMTP service and sender domain; configure SPF/DKIM/DMARC and verify delivery. No automatic provider signup is included.
2. Set `NODE_ENV=production`, a private stable random `BETTER_AUTH_SECRET` (at least 32 characters, generate 48 random bytes), and `BETTER_AUTH_URL=https://YOUR_REAL_HOST` with no path/query. Never use development console delivery or the legacy flag.
3. Set `AUTH_EMAIL_MODE=smtp`, `AUTH_EMAIL_FROM`, `AUTH_SMTP_HOST`, `AUTH_SMTP_PORT`, `AUTH_SMTP_SECURE`, `AUTH_SMTP_USER`, `AUTH_SMTP_PASS`. Store secrets outside Git. `AUTH_SMTP_SECURE=true` uses implicit TLS; otherwise STARTTLS is mandatory. Set dev flags false. Configure the receipt extractor separately using its existing documented settings.
4. Serve HTTPS through a trusted reverse proxy. Bind Node to loopback; overwrite `X-Real-IP` with the real client address, strip untrusted forwarded identity headers, preserve Host and Origin, and configure auth logs without query strings or credentials. Direct access to Node must be blocked so clients cannot spoof the IP used for rate limiting. This app does not trust browser household/user headers.
5. Stop writers, take a SQLite backup including WAL state with restrictive permissions, verify the copy, set the absolute production `DATABASE_PATH`, and **only with separate production authorization** apply the checked-in SQL migrations using the existing runner. Verify foreign keys, integrity, receipt counts, and legacy preservation. Do not use Better Auth automatic migrations.
6. Run tests/lint/build and local runtime/link/SEO/frontend checks with release configuration; deploy only when separately authorized. Verify HTTPS cookie flags, real delivered single-use links, two-user isolation, empty first household, destination restoration, logout, and rate limits. Keep a database rollback/backup plan; do not remove additive tables over existing user data.

No production deployment, production database migration, DNS change, external signup, or Task 8 work was performed. Recommended Task 8: production release readiness and explicitly approved staged authentication rollout, including dependency patches, email delivery, backups, proxy hardening, and live smoke checks.

## Task 8 production hardening

Use the [current launch checklist](production-launch-checklist.md). Production now requires an explicit absolute DATABASE_PATH and an existing database; it cannot silently create a checkout-local DB. Production auth rejects trivially weak/whitespace secrets and loopback public origins. SMTP validates sender/TLS mode and uses bounded timeouts. HTTP auth errors are normalized into safe consumer messages. Secure session/origin/CSRF behavior and built-in limits remain unchanged.
