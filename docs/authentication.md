# MoveIn early-access authentication

Better Auth 1.7.7 supplies email/password login, its own password hashing, and signed database sessions. Email is a login identifier. No email delivery, verification message, reset message, social login or public registration is enabled. Reviewed against the installed implementation and [official password documentation](https://better-auth.com/docs/authentication/email-password).

## Operator commands

Run from the release checkout with Node >=22.13, applied migrations, and the same protected DATABASE_PATH, BETTER_AUTH_SECRET and BETTER_AUTH_URL as the app. Production examples:

```sh
cd /var/www/movein
set -a
. /etc/movein/movein.env
set +a
npm run user:create
npm run user:list
npm run user:reset-password
```

Create prompts for email, a hidden initial password and hidden confirmation. Passwords must contain 12–128 characters. Never put passwords in arguments, shell history, environment variables, chat or logs. Deliver credentials manually through an approved private channel. Create uses Better Auth's supported server signUpEmail API in a separate operator instance, with auto-sign-in disabled; it does not create a session. Operator approval marks the identifier approved using the library adapter, preserving the existing verified-user resolver. This approval does not claim inbox verification occurred.

Provisioning creates a household and membership in the existing idempotent SQLite transaction. Retry preserves the account password and household. If interrupted after auth creation, rerun to finish membership. An incomplete account without credentials needs an operator reset first. Listing emits only email, creation date, household ID and approved/incomplete state.

Reset prompts for email and hidden new password/confirmation. It uses Better Auth requestPasswordReset/resetPassword; the callback captures the token only in process memory and sends nothing. The token is consumed/cleaned, the library hashes the new password, and **all existing sessions are revoked**. Deliver replacement credentials manually. Reset does not change household ownership. There is no public reset route or form. Commands require local OS/database access, are never web endpoints, reject credential arguments, and require an interactive TTY for password entry.

For local testing, set a stable private secret and BETTER_AUTH_URL=http://127.0.0.1:3007 in .env.local, apply local migrations, run user:create, then dev:auth. Both commands must use the same database/secret/origin. Without a stable secret dev:auth uses an ephemeral one and restarting signs out sessions. The helper never enables mail. Legacy fixtures remain restricted to explicit loopback development with no real auth configuration.

## Public sign-in and security

/sign-in has Email and Password fields and a Sign in button, plus “MoveIn is currently in early access.” Invalid credentials receive the same generic message for unknown email and wrong password. No signup form or account recovery emails exist.

The web auth instance sets enabled=true, disableSignUp=true, autoSignIn=false and requireEmailVerification=true. Its catch-all route permits only POST /sign-in/email, GET /get-session and POST /sign-out. All signup/reset/admin/magic-link paths return 404. The separate operator instance is imported only by scripts. No custom hashing or plaintext password storage is used.

Session/household protection is retained: seven-day database sessions, daily refresh, no cookie cache, HttpOnly/SameSite=Lax/Secure production cookies, exact HTTPS trusted origin, server-side membership resolution and private mutation Origin checks. Browser user/household IDs never grant access. Logout deletes its session; manual reset revokes every session. The reserved legacy household is never authenticated access. No schema change is required beyond existing migration 011's password column.

Database rate limiting allows five email/password attempts per minute per IP and 100 general auth requests per minute per IP. Nginx must overwrite X-Real-IP and Node must stay loopback-only. Auth logging is disabled; proxy logs must omit bodies, cookies, credentials and auth query strings. Analytics remain excluded from private/sign-in pages.

## Production configuration and future upgrade

Only a protected stable random BETTER_AUTH_SECRET, exact HTTPS BETTER_AUTH_URL and persistent DATABASE_PATH are required for auth. authConfig always selects disabled mail, ignoring stale SMTP variables. Production still rejects weak secrets, non-HTTPS/loopback origins and development flags. Keep RECEIPT_EXTRACTOR=disabled.

The provider-neutral email sender and futureAuthEmailConfig validation remain isolated for a later upgrade. Setting SMTP variables alone cannot enable magic links. Future activation requires a deliberate reviewed plugin/endpoint/UI change, delivery configuration and invite policy testing. It reuses the same auth users, sessions and household resolver without rewriting receipt/ownership logic. Do not configure SMTP now.

Follow [staged launch](staged-production-launch.md) and [release checkpoint](task-11-release-checkpoint.md) for backup, pending migrations, release verification and HTTPS smoke tests.
