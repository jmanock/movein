# Task 11: invite-only early-access release

October 5, 2026. **DEPLOYED — MoveIn production is HEALTHY for the early-access configuration.** Live URL: https://movein.guide. Email/password accounts are manually approved; email delivery, public signup and receipt extraction remain disabled.

## Release identity and architecture

Verified application release **73a7fca543cb6284665da5eb887681261c5d0440**, including the terminal-echo hardening, with clean local and target checkouts. Parent 212e62caa8c1ce6c99ec8d718fd4fc1261b744e9 contains the authentication implementation and carries forward the previously approved Tasks 1–10 release. Both were pushed normally to jmanock/movein main and fast-forwarded on the host. A subsequent checkpoint-only commit updates documentation without changing the verified application build.

Existing architecture retained: Ubuntu 162.243.4.99 → Nginx HTTPS → one root-owned PM2 MoveIn fork → Next.js 16.3.8, React 19.2.8, Better Auth 1.7.7, SQLite at /var/lib/movein/movein.sqlite. MoveIn uses the already-installed Node **22.23.1**, not the SSH shell's Node 20 default. Other PM2 applications were not restarted or reconfigured. Port 3006 now binds only **127.0.0.1**.

## A–N checkpoint

| Item | Verified result |
| --- | --- |
| A. Better Auth password configuration | enabled=true, disableSignUp=true, autoSignIn=false, requireEmailVerification=true; operator approval supplies the existing verified-user invariant. Library hashing, database sessions and secure cookies retained. Password policy 12–128 characters. |
| B. Manual provisioning | `npm run user:create`: interactive email, hidden password/confirmation; library server API creates credentials, library adapter records operator approval, transactional membership resolution creates exactly one household. Retries preserve password/household. `user:list` prints only administrative fields. |
| C. Manual reset | `npm run user:reset-password`: hidden new password/confirmation; supported library reset flow captures its token in memory, sends nothing, consumes/cleans the token, and revokes all existing sessions. |
| D. Public signup prevention | Better Auth disableSignUp plus route allowlist. Signup, reset, admin and magic-link HTTP routes return 404; no public signup/reset form. Operator modules are imported only by scripts. |
| E. Sign-in behavior | Email/Password/Sign in, early-access copy; generic unknown-user/wrong-password error, existing-account sessions and destination restoration. Live sign-in, logout and re-login passed. |
| F. SMTP/email dependency | No SMTP variables required or configured. authConfig selects disabled delivery regardless of stale mail variables. No magic-link plugin mounted and no email sent. Future isolated sender/validation retained. |
| G. Security tests | 129/129 full tests pass locally and on target; lint, production build, runtime audit (zero vulnerabilities), health report and production preflight pass. Tests cover provisioning/retry, credentials, signup denial, rate limits, A/B isolation, forged IDs, CSRF, logout, reset/session revocation, no SMTP dependency and disabled extraction. |
| H. Production backup | Verified online SQLite backup, mode 0600, owner-only directory, independently reopened and restore-tested; path below. |
| I. Migrations | Only pending 007–011 applied, each via the existing transactional ledger runner. Second run was a no-op. Integrity ok, zero foreign-key errors; 50 ZIPs/56 providers preserved. |
| J. Deployment | Verified commit installed with clean Linux dependencies and build tooling, built on target, started through protected explicit Node 22 PM2 configuration; one fork saved, HTTPS and public/private smoke pass. |
| K. Production test user | Exactly ONE controlled account created through the interactive CLI with a generated hidden password. No additional production users created. Test credential discarded from process memory; use the manual reset command before reuse. Final sessions: zero. |
| L. My Home | Authenticated page and API passed with empty inventory/history. One approved household and one membership; logout denied access; re-login resolved the same household. Reserved legacy household remains separate. No receipts/fake purchases added. |
| M. Logs | Sanitized new application logs reviewed without dumping credentials, sessions or environment. No new auth/SQLite/origin/model errors or credential patterns detected. Production auth logging disabled; Nginx auth access logs disabled and client IP overwritten. |
| N. Production health | **HEALTHY** for invite-only accounts, My Home/history and public content with receipt extraction disabled. This does not claim SMTP delivery or receipt-model readiness. |

## Backup and database evidence

Backup: `/var/backups/movein/pre-manual-auth-2026-10-05T14-51-19-226Z.sqlite`. The source was checked before backup; SQLite online backup includes WAL state. A separate restored copy reopened cleanly with integrity/FK and public row-count checks before migrations. Backup directory mode 0700/file 0600; persistent database directory 0700 and SQLite/WAL/SHM files restricted to 0600. Restore procedures remain in [staged launch](staged-production-launch.md); no rollback was needed.

Applied: 007_receipts_and_inventory.sql, 008_receipt_save_requests.sql, 009_receipt_intelligence.sql, 010_household_ownership.sql, 011_authentication.sql. No seed/import, auth automatic migration, down migration or table deletion. Final database: 50 ZIPs, 56 providers, one auth user, one approved membership, two households (one reserved legacy + one approved), zero active sessions, zero receipts; integrity ok/FKs zero.

## Protected production operation

`/etc/movein/movein.env` is root-owned, mode 0600, directory 0700. It contains a privately generated stable random 48-byte auth secret, the exact HTTPS origin, existing persistent DB path, explicit disabled email/extractor, existing public GA ID and false development/debug flags. No SMTP credentials or Ollama settings were provisioned; no model service or social login enabled. Do not print or commit this file.

The protected host wrapper `/etc/movein/ecosystem.config.cjs` loads the tracked PM2 defaults, pins the installed Node 22 npm/interpreter paths, and explicitly passes the sourced auth secret/origin into this app's PM2 environment. Use its recognized `.config.cjs` filename. For an authorized future restart:

```sh
export PATH=/root/.nvm/versions/node/v22.23.1/bin:$PATH
cd /var/www/movein
set -a
. /etc/movein/movein.env
set +a
pm2 startOrRestart /etc/movein/ecosystem.config.cjs --only movein --update-env
pm2 save
chmod 600 /root/.pm2/dump.pm2
```

Run operator commands from this same protected shell. The saved PM2 environment retains the stable secret and disabled mode. Root PM2 dump is mode 0600. No reboot was performed or new startup service installed.

Unit fixture tests must not receive live auth secrets: `env -u BETTER_AUTH_SECRET -u BETTER_AUTH_URL npm test`. Legacy fixture cases intentionally require no real auth configuration; production configuration is verified separately with `npm run production:check` and actual HTTPS sessions. Target `npm ci --include=dev` supplies build/lint tooling during validation.

## Live validation

HTTPS certificate verified through system trust. Root returns 200; HTTP redirects 301 to HTTPS and HTTPS www redirects 308 to the root origin. Production smoke passed homepage, ZIP 32801, lookup API, sign-in, boolean auth status, private page redirects, anonymous API rejection and read-only SQLite checks. Live frontend audit passed across 20 representative routes and 140 internal targets, with the existing client-component-count warning. The audit was paced to respect Nginx request limits: an initial rapid crawl hit the existing limiter (503); pacing passed without changing protection. Auth cookies verified Secure, HttpOnly and SameSite=Lax.

Authenticated controlled-account receipt page showed unavailable copy and no file input; processing returned 503 before uploads/inference. My Home returned an empty inventory; logout invalidated the old cookie. Second sign-in kept the same household. The account was logged out again after testing. No passwords, password hashes, cookies, session tokens or reset tokens were printed or stored in test artifacts; the password existed only in memory.

Protected target validation logs are under `/var/backups/movein/release-*.log`; app-log offsets were used for post-release review. Public proxy auth logging is suppressed. Nginx config backup is `/var/backups/movein/nginx-before-manual-auth.conf`; it passed nginx -t before reload. Client forwarding/identity hints are overwritten/stripped for this site. Existing household resolution still ignores browser ownership claims.

The [authentication guide](authentication.md) documents manual provisioning/reset and a future reviewed magic-link/SMTP onboarding upgrade. The previous SMTP launch stop condition is superseded; no email configuration remains a release blocker.
