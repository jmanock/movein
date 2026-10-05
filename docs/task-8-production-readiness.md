# Task 8 production-readiness checkpoint

**Historical checkpoint: Task 10 supersedes the release verdict below. Current verdict: CODE READY — MANUAL PRODUCTION CONFIGURATION REMAINS. See [patched-version evidence and staged plan](task-10-release-readiness.md).**

Task 9 reverified the current registry/security state and release gate. See [task-9-release-gate.md](task-9-release-gate.md) for the latest A–M checkpoint; the vendor hold remains.

October 4, 2026. Audit/hardening only: no new product features, production deployment/migration, DNS change, external mail signup, Ollama installation, or provider switch occurred. Existing Tasks 1–7 working-tree changes were preserved.

## A. Release verdict

**NOT READY TO DEPLOY.** Compatible hardening is implemented and local validation passes. SMTP, HTTPS/proxy, persistent DB/backup provisioning and target-host validation remain manual. An additional security hold remains: [Next.js's official September notice](https://nextjs.org/blog/upcoming-nextjs-security-release-september-2026) says one critical and one high fix are pending upstream coordination. Publicly available details do not identify affected paths/ranges sufficiently to establish this app is unaffected. A clean npm runtime audit does not clear that unknown. Resolve it through a vendor patch or a documented applicability assessment before public launch; do not infer confirmed exploitability from the notice alone.

## B. Dependency/advisory status

Initial npm audit: **1 critical + 21 high** findings, including parent packages inheriting transitive issues. After compatible updates: **5 high, 0 critical** in the full audit; **zero findings** with `npm audit --omit=dev`. The full audit exits nonzero and is not represented as passing. Remaining packages are eslint-config-next 16.3.8 → @next/eslint-plugin-next 16.3.8 → fast-glob 3.3.1 → micromatch 4.0.8 → braces 3.0.3. They represent one unpatched root issue, not five independent exploits. No known npm advisory is reported for Better Auth 1.7.7, better-sqlite3 13.0.3 or Nodemailer 10.0.14 in this snapshot.

Installed-version assessment below uses the before/after lockfile and official advisories. “Affected” refers to realistic code paths, not proof that an exploit was executed. We did not run exploits against a production host.

| Package / advisory | Before; vulnerable range | Severity | MoveIn applicability | Compatible resolution / code effect |
| --- | --- | --- | --- | --- |
| Next.js [Windows RCE](https://github.com/advisories/GHSA-p293-qw3h-jr36) | 16.2.12; >=16.0.0 <16.3.3 | Critical | Planned Ubuntu host avoids the Windows prerequisite; portability still warrants patching | 16.3.8; same major, no feature rewrite |
| Next.js [AVIF optimizer RCE](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) | 16.2.12; >=16.0.0 <16.3.3 | Critical | Image optimization exists; sources are controlled local assets, no remote allowlist or public receipt uploads | 16.3.8; tested public images/build |
| Next.js [next/og RCE](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j) | 16.2.12; >=16.2.0 <16.3.6 | Critical | `/og` uses Node ImageResponse with bounded query text; this surface exists | 16.3.8; route/build smoke verified |
| Sharp [libheif issues](https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c) | 0.35.3; <0.35.4 | High | Next image backend uses Sharp; hardening also now decodes untrusted JPG/PNG through it | 0.35.5; patch, direct pin and override; native decoder tests |
| brace-expansion [deep rewrite work](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) | 5.0.9; >=4.0.0 <5.0.12 | Moderate | Lint/glob tooling, trusted repo/config patterns; no HTTP-provided glob | 5.0.12 override; no application rewrite |
| brace-expansion [nested braces](https://github.com/advisories/GHSA-qhr7-859c-m2p7) | 5.0.9; >=4.0.0 <5.0.11 | High | Same build/tooling exposure | 5.0.12 override |
| brace-expansion [comma recursion](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) | 5.0.9; >=4.0.0 <5.0.10 | High | Same build/tooling exposure | 5.0.12 override |
| js-yaml [merge work exhaustion](https://github.com/advisories/GHSA-2883-xcg3-v3hh) | 4.3.1; >=4.0.0 <4.3.2 | High | ESLint config input, not receipt/auth request parsing | 4.3.2 patch override; avoided latest major 5.x |
| braces [AST recursion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | 3.0.3; <=3.0.3 | High | Development lint glob chain; no untrusted glob API in the application | **No patched version published**; no unsafe override, major downgrade or suppression. Build trusted inputs only, isolate tooling, prune dev packages after build |

All initial advisory parent/cascade entries are retained in ignored `outputs/task8/audit-before.json`; full/runtime results are `audit-after.json` and `audit-runtime.json`. Parent packages whose warnings disappeared inherit the patched brace-expansion/js-yaml/Sharp issue; they were not hidden as harmless merely because they were transitive.

### Additional Next.js release advisories

The [16.3.8 release](https://github.com/vercel/next.js/releases/tag/v16.3.8) also lists seven September fixes. These were reviewed even though the npm snapshot did not list all of them. Several official advisory version fields still contain literal `16.3.?` / `15.5.?` placeholders; the release explicitly identifies 16.3.8 as including these fixes. We preserve that uncertainty rather than inventing version ranges. All rows refer to Next.js 16.2.12 before and 16.3.8 now, with no breaking major or additional product code required.

| Advisory | Published range (16.x) / severity | Applicability |
| --- | --- | --- |
| [Optimizer SSRF](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4) | >=16.0.0 <16.3.?; high | Official workaround says no remotePatterns means unaffected; this app has none |
| [Metadata image parameter bypass](https://github.com/vercel/next.js/security/advisories/GHSA-f87g-xv8r-7p7x) | >=16.0.0, patch field 16.3.?; medium | No dynamicParams-based metadata-image authorization; private authorization is in pages/APIs/repositories |
| [Self-hosted SSG cache poisoning](https://github.com/vercel/next.js/security/advisories/GHSA-4jqv-mc3x-m676) | >=16.0.0, patch field 16.3.?; medium | Official impact requires Pages Router SSG/ISR; MoveIn uses App Router; patched regardless |
| [SSG/ISR content substitution](https://github.com/vercel/next.js/security/advisories/GHSA-mcj8-r9mp-w47p) | >=16.0.0, patch field 16.3.?; medium | Official impact requires a root catch-all page, absent here; private routes remain dynamic/no-store |
| [Draft cache fill](https://github.com/vercel/next.js/security/advisories/GHSA-3w37-wq28-93x7) | 16.3.0, patch field 16.3.?; medium | No Draft Mode/use-cache feature here; original version was 16.2.12 |
| [Nested cache/root parameters](https://github.com/vercel/next.js/security/advisories/GHSA-h694-7cp9-m8p3) | 16.3.0; medium; fixed 16.3.8 | No nested use-cache functions; original version outside the published range |
| [Dev MCP disclosure](https://github.com/vercel/next.js/security/advisories/GHSA-39w2-rjm5-chcv) | >=16.0.0, patch field 16.3.?; low | Development server is loopback-only and will not be exposed in production |

Official GitHub advisory metadata is saved in ignored `outputs/task8/next-release-advisories.json`. Unknown pending critical/high vendor items have no publicly established package/range/patch in the notice; no claim of non-applicability is made for them.

## C. Upgrades made

Next, @next/env and eslint-config-next **16.2.12 → 16.3.8**; Sharp **0.35.3 → 0.35.5**; better-sqlite3 **13.0.1 → 13.0.3**; brace-expansion override **5.0.9 → 5.0.12**; js-yaml override **4.3.1 → 4.3.2**. Better Auth remains current stable **1.7.7**. Same major/minor-compatible updates; no `npm audit fix --force`, ESLint major upgrade, new ORM, or app feature migration. Sharp is now an explicit runtime dependency for image validation, not merely an implicit Next dependency.

## D. Auth production hardening

Existing protections remain tested: HttpOnly, Secure in production, SameSite=Lax, exact origin/trusted origin, HTTPS base URL, hashed ten-minute single-use links, database sessions expiring after seven days, daily refresh, cookie cache off, 5/minute/IP magic links and 100/minute/IP general auth, restricted destinations and endpoint allowlist, HTTP CSRF plus private-mutation exact-Origin checks, session revocation on logout, verified membership isolation.

Production now rejects trivial repeated/whitespace secrets and loopback public origins; these are shape checks, not a proof of randomness—generate the documented random secret. SMTP sender rejects header injection/invalid TLS mode and transport has 10s connection/greeting and 20s socket timeouts with mandatory TLS/certificate verification. Auth HTTP failures use canned messages, preserve bounded retry headers and recover failed verification via the sign-in page. Logging never prints configured values. Full navigation on logout deliberately clears client router/private component state; one narrowly documented lint exception permits this security behavior.

## E. Production environment and secrets

The complete table is in [launch checklist](production-launch-checklist.md), including explicit persistent DATABASE_PATH, public HTTPS auth origin, secret, interchangeable SMTP settings, extractor choice, optional loopback model/timeout/prompt and public GA ID. `.env.example` has blank identity/credential/public-ID placeholders and disabled extraction by default. Public analytics values are not secrets. There is no server secret under NEXT_PUBLIC_. Environment files are ignored; only .env.example is tracked. The heuristic secret scan includes working-tree app/config/docs and reachable committed history; it reports file/commit labels only, never matching values. No secret pattern was detected; this is not a guarantee against all possible formats.

Production DB access requires an explicit absolute path and an existing file; there is no checkout-local production fallback or accidental empty DB creation. New DB directories/files use restrictive modes; existing directory permissions must be fixed by the operator and checked. No actual production secret/host/mail credential was supplied during this task.

## F. Email still required

Supply provider/host, authenticated port/TLS choice, username, private password/API credential, verified sender address and domain settings (SPF/DKIM/DMARC as appropriate). Standard SMTP is interchangeable. No provider account was created. Console links require development and explicit opt-in and cannot activate in production. Configuration presence is not evidence of delivered mail: actual mailbox/spam and failure testing remains required.

## G. Production extraction options

| Option | Complexity/infrastructure | Privacy/reliability | Supported now? |
| --- | --- | --- | --- |
| Disabled for first launch | Small conventional Next/SQLite server; no model resources | Upload UI/API honestly unavailable; saved inventory/history and public site remain functional | **Yes; recommended initial choice** |
| A: same-host Ollama | Provision/update a private loopback model service and capacity; benchmark memory, cold loads, CPU/GPU latency, timeout and Node memory budget separately | Images remain on the app host; monitor model uptime and avoid payload logging | **Yes**, already-installed local vision models only; no auto-install or cloud fallback |
| B: private separate extraction host | Another machine, authenticated private gateway/tunnel, networking, capacity, timeout/availability operations | Images leave the web host over a private authenticated channel; update/review privacy claims and retention on both machines | Direct remote URLs **not supported**. An operator loopback tunnel could reuse the protocol but changes the trust/privacy model and needs separate review/testing; not configured here |
| C: future hosted vision provider | New isolated adapter, credentials, spend/rate limits and provider contract | External processor receives receipt bytes; retention/privacy/deliverability contracts and reliability must be evaluated | **Not supported**, no provider switch or paid API activation |

For scale, the example [qwen2.5vl:7b artifact](https://ollama.com/library/qwen2.5vl:7b) is about **6 GB** on disk; runtime also needs vision/context/cache memory. An **8–16+ GB** model-host RAM planning range is an engineering estimate, not a tested capacity guarantee; reserve more for web/OS and benchmark actual receipt images. GPU acceleration may materially reduce latency and adds infrastructure cost; no current price quote or capacity assertion is made. A small web droplet/PM2's 512 MB restart threshold does not supply model memory.

Availability is now a bounded three-second metadata-only local-model probe with no pulls or raw output. Disabled, unreachable, non-vision or remote models disable the upload form; API failures remain honest 503/504 and never sample purchases. My Home/history are independent. One active receipt job and bounded attempt windows protect the one-process MVP; restarts reset those in-memory limits.

## H. Database migration procedure

No new Task 8 SQL migration was needed. The existing runner/ledger applies missing files in order with individual transactions. 007 creates purchase/item/inventory tables; 008 adds nullable retry/fingerprint and index; 009 adds defaulted classification columns; 010 adds households/legacy owner backfill, scoped retry index, owner/provenance integrity triggers; 011 adds library auth tables and unique user membership. These are additive column/table changes; 010 deliberately replaces the global retry index and introduces restrictions, so rollback is not just “drop new tables.”

A disposable populated fixture exercised the real runner through 007–011, repeated it idempotently, preserved merchant/item/inventory facts and checked the full migration ledger, integrity and foreign keys. No production migration ran. Exact stop/backup/migrate/verify commands and legacy quarantine are in the launch checklist. WAL and busy_timeout=5000 remain enabled. Use one process on one host, a private local disk and explicit absolute DB path.

## I. Backup process

`npm run db:backup -- /absolute/new/backup.sqlite` uses the existing better-sqlite3 online backup API, atomically reserves a new filename, refuses overwrites, sets 0600, and verifies integrity/FKs. The test backed up committed data while its source was in WAL mode, reopened the copy as an isolated restore and verified stored purchase facts. No live main-file-only copy or production backup was performed.

Minimum proposed operations: daily backups (explicit 24-hour potential loss window), seven daily/four weekly copies, encrypted off-host copy daily, 0700 directory outside the checkout, alert on missing/failed backup >26h, and monthly/pre-release isolated restore tests. Increase frequency if 24h loss is unacceptable. No scheduler, remote storage or destructive retention task was installed. Backups contain private structured data and sessions; protect them accordingly.

## J. Remaining risks and behavior reviewed

- **Release hold:** pending critical/high vendor issues lack enough public applicability detail; resolve before public exposure.
- Unpatched braces/tooling chain: restricted trusted builds, no public glob input, prune dev dependencies for runtime; re-evaluate when a compatible fix exists.
- Real SMTP delivery, public certificate/domain/proxy, target-host storage/permissions/backup/restore and model capacity are unverified manual actions.
- Basic per-IP auth limits rely on a trusted overwritten X-Real-IP and blocked direct Node access. Receipt limits allow 5 attempts/household and 10/IP per ten minutes, one active job; busy/rate errors include Retry-After. They are one-process ephemeral controls, not distributed quotas or a queue. Authenticated structured-record growth has no account storage quota; monitor disk use.
- Raw images have no app disk/public-directory path; request bodies are bounded before multipart parsing, files require allowlisted MIME/extension/signature, and real images must fully decode below 20 MP. Filenames never select paths. PDFs are rejected by real extraction; no OCR added. Nginx streaming is necessary to avoid its default temporary request-body disk buffering; disable model/proxy payload logs too.
- Model envelopes are bounded at 256 KB, normalized/allowlisted, and never persisted as raw payloads. Only human-confirmed structured purchases/items persist. Email remains sign-in-only; household reads/writes stay isolated. Original images are discarded; failures and debug state do not save them.
- Consumer errors do not include stack/SQL/path/env/provider values. Generic auth and receipt availability/save errors were hardened. Model failure logs contain a bounded application error code, not raw responses. The app adds nosniff/frame/referrer/permissions headers; HTTPS/HSTS, trusted host/IP, upload/request timeouts, logging redaction, no private caches, and static-file exposure are operator duties.
- No target production infrastructure was inspected or changed; source/local checks cannot prove its configuration. No major security upgrade was forced and no unsupported remote inference was silently enabled.

## K. Full validation

Final validation results are recorded below and in ignored `outputs/task8` / `runtime-reports`. New hardening tests cover decoded image rejection before model contact, admission/concurrency/release/window behavior, metadata-only availability, production config restrictions, and real populated migrations/WAL backup/restore. Task 7's real-library cookie/link/CSRF/session/isolation tests remain intact.

| Check | Result / remaining warning |
| --- | --- |
| `npm test` | **126 passed**, zero failed/skipped; includes real Better Auth protections and five new hardening tests |
| `npm run lint` | PASS, zero warnings |
| `npm run build` | PASS on Next 16.3.8 with explicit local DB path; consolidated health run rebuilt final code |
| `npm audit` | **Nonzero: 5 high dev-only cascade findings**, unpatched braces root described above |
| `npm audit --omit=dev` | PASS, zero findings; does not resolve the vendor's pending critical/high notice |
| `npm run check:links` | PASS, 110 canonical routes / 139 internal targets; no broken links, redirects or orphans |
| `npm run seo:audit` | PASS, zero errors/warnings |
| `npm run seo:duplicates` | PASS, 81 pages / 34 guides, zero blocking duplicates |
| `npm run frontend:audit` | PASS, 140 source files / 20 representative routes / 142 internal targets / 6 images; **existing warning: 26 client components, review bundle impact** |
| `npm run analytics:check` | PASS, one root/tag owner, expected public ID in production HTML/bundle, manual page-view and privacy checks |
| `npm run health:report` | PASS, all five automated checks; 29 verified / 21 pending ZIPs, zero verified-ZIP gaps, 74 latest reported official URLs with zero broken/uncertain links. This consumes the existing provider-link report, not a fresh external-link crawl. Pending ZIPs retain 84 missing core-provider items and remain noindex |
| `npm run secrets:check` | PASS, 250 working-tree files / 25 reachable commits, zero heuristic findings |
| `npm run production:smoke` | PASS against final loopback production-mode build, including public routes, private 307/401 and read-only DB checks |
| Isolated authenticated disabled-extractor runtime QA | PASS, real captured magic link/session (no SMTP delivery), `/my-home` and `/receipts` 200, unavailable receipt copy/no file form, empty private inventory, processing 503, logout revocation. `production:check` passed with isolated valid-shaped settings/0700 directory/0600 DB. Temporary DB/session fixture was removed |
| Main local DB after QA | Zero auth users and receipts; integrity `ok`, zero FK errors; isolated QA did not write main user/purchase data |
| Production infrastructure | **Not tested or deployed**: actual SMTP delivery, HTTPS/proxy/certificate, migrations, backup schedule/offsite restore and Ollama capacity remain manual |

Runtime audits were repeated after the health script's rebuild and a clean local server restart. Test/command logs are ignored under `/tmp/movein-task8-*.log`; dependency/advisory evidence is under ignored `outputs/task8`. The health report now explicitly distinguishes functional/content health from release security clearance. Full audit failures, the client-component warning, pending content work and vendor uncertainty are retained, not suppressed.

## L. Exact launch checklist

[production-launch-checklist.md](production-launch-checklist.md) is the single ordered operator checklist: backup, security, environment, migrations, email, HTTPS/proxy, auth, extractor choice, build, separately authorized restart, non-destructive smoke, real auth, household isolation, upload if enabled, backups/restore and rollback. Added commands: `production:check`, `production:smoke`, `db:backup`, `secrets:check`. The smoke command never sends mail, uploads files, creates users or migrates; it checks a running endpoint plus a read-only local configured DB. Do not run it against real production as part of this task; only local mode was exercised.

## M. Deployment recommendation

**No immediate public deployment recommendation after configuration alone.** Clear the pending vendor security issue, then complete the checklist and actual target-server tests. Once those pass, a small staged release with extraction explicitly disabled is the lowest-complexity path. Enable real Ollama only after target-host privacy/capacity/failure tests. This checkpoint is not deployment authorization.
