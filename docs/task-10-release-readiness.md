# Task 10: patched-version release decision

**CODE READY — MANUAL PRODUCTION CONFIGURATION REMAINS.** Evaluated October 4, 2026 against installed/locked Next.js **16.3.8**, Sharp **0.35.5**, React/React DOM **19.2.8** and Better Auth **1.7.7**. No deployment, production migrations, DNS/SMTP configuration, model installation, provider change or product feature work occurred.

## A. Advisory-by-advisory Next.js table

Reviewed all 69 published official Next repository advisory records. Every published critical/high record is included below, including older affected release lines for completeness. Each link is the official primary advisory; raw metadata is saved in ignored outputs/task10/next-advisories.json. Where multiple release lines exist, the 16.x record is shown; otherwise the historical lines are retained. “No” means the installed stable release has the published fix or is on a later unaffected release line, not that the underlying feature can never be attacked.

| Advisory | Severity | Official affected range | Official patched version(s) / evidence | Installed | Vulnerable? |
| --- | --- | --- | --- | --- | --- |
| [GHSA-vcvr-r3jv-pc5j](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j) — Remote Code Execution in next/og ImageResponse | critical | `>= 16.2.0 < 16.3.6` | 16.3.6 | 16.3.8 | **No — resolved** |
| [GHSA-cjq9-62q9-8jv4](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4) — Server-Side Request Forgery in Image Optimization | high | `>= 16.0.0 < 16.3.?` | 16.3.8 (release explicitly includes fix; metadata says 16.3.?) | 16.3.8 | **No — resolved** |
| [GHSA-2xp9-vwfh-vxw4](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4) — Unauthenticated Remote Code Execution in Image Optimization API when AVIF files are used | critical | `< 16.3.3` | 16.3.3 | 16.3.8 | **No — resolved** |
| [GHSA-p293-qw3h-jr36](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36) — Unauthenticated Remote Code Execution on windows-hosted servers | critical | `>= 16.0 < 16.3.3` | 16.3.3 | 16.3.8 | **No — resolved** |
| [GHSA-p9j2-gv94-2wf4](https://github.com/vercel/next.js/security/advisories/GHSA-p9j2-gv94-2wf4) — Server-Side Request Forgery in rewrites via attacker-controlled destination hostname | high | `>= 16.0.0 < 16.2.11` | 16.2.11 | 16.3.8 | **No — resolved** |
| [GHSA-89xv-2m56-2m9x](https://github.com/vercel/next.js/security/advisories/GHSA-89xv-2m56-2m9x) — Server-Side Request Forgery in Server Actions on custom servers | high | `>= 16.0.0 < 16.2.11` | 16.2.11 | 16.3.8 | **No — resolved** |
| [GHSA-6gpp-xcg3-4w24](https://github.com/vercel/next.js/security/advisories/GHSA-6gpp-xcg3-4w24) — Middleware / Proxy bypass in App Router applications using Turbopack and single locale | high | `>= 16.0.0 < 16.2.11` | 16.2.11 | 16.3.8 | **No — resolved** |
| [GHSA-m99w-x7hq-7vfj](https://github.com/vercel/next.js/security/advisories/GHSA-m99w-x7hq-7vfj) — Denial of Service in App Router using Server Actions | high | `>= 16.0.0 < 16.2.11` | 16.2.11 | 16.3.8 | **No — resolved** |
| [GHSA-26hh-7cqf-hhc6](https://github.com/vercel/next.js/security/advisories/GHSA-26hh-7cqf-hhc6) — Middleware / Proxy bypass in App Router applications via segment-prefetch routes - Incomplete Fix Follow-Up | high | `>= 16.0.0 < 16.2.6` | 16.2.6 | 16.3.8 | **No — resolved** |
| [GHSA-267c-6grr-h53f](https://github.com/vercel/next.js/security/advisories/GHSA-267c-6grr-h53f) — Middleware / Proxy bypass in App Router applications via segment-prefetch routes | high | `>= 16.0.0 < 16.2.5` | 16.2.5 | 16.3.8 | **No — resolved** |
| [GHSA-mg66-mrh9-m8jx](https://github.com/vercel/next.js/security/advisories/GHSA-mg66-mrh9-m8jx) — Denial of Service via connection exhaustion in applications using Cache Components | high | `>=16.0.0 < 16.2.5` | 16.2.5 | 16.3.8 | **No — resolved** |
| [GHSA-492v-c6pp-mqqv](https://github.com/vercel/next.js/security/advisories/GHSA-492v-c6pp-mqqv) — Middleware / Proxy bypass through dynamic route parameter injection | high | `>= 16.0.0 < 16.2.5` | 16.2.5 | 16.3.8 | **No — resolved** |
| [GHSA-c4j6-fc7j-m34r](https://github.com/vercel/next.js/security/advisories/GHSA-c4j6-fc7j-m34r) — Server-side request forgery in applications using WebSocket upgrades | high | `>= 16.0.0 < 16.2.5` | 16.2.5 | 16.3.8 | **No — resolved** |
| [GHSA-36qx-fr4f-26g5](https://github.com/vercel/next.js/security/advisories/GHSA-36qx-fr4f-26g5) — Middleware / Proxy bypass in Pages Router applications using i18n | high | `>= 16.0.0 < 16.2.5` | 16.2.5 | 16.3.8 | **No — resolved** |
| [GHSA-8h8q-6873-q5fj](https://github.com/vercel/next.js/security/advisories/GHSA-8h8q-6873-q5fj) — Denial of Service with Server Components | high | `>= 16.0.0 < 16.2.5` | 16.2.5 | 16.3.8 | **No — resolved** |
| [GHSA-q4gf-8mx6-v5v3](https://github.com/vercel/next.js/security/advisories/GHSA-q4gf-8mx6-v5v3) — Denial of Service with Server Components | high | `>=13.0.0 < 15.5.15, >= 16.0 < 16.2.3` | 15.5.15, 16.2.3 | 16.3.8 | **No — resolved** |
| [GHSA-h25m-26qc-wcjf](https://github.com/vercel/next.js/security/advisories/GHSA-h25m-26qc-wcjf) — Denial of Service with Server Components | high | `>=13.0.0 <15.0.8, >=15.0.0 <15.6.0-canary.61, >=16.0.0 <16.1.5` | 15.0.8, 15.1.12, 15.2.9, 15.3.9, 15.4.11, 15.5.10, 15.6.0-canary.61, 16.0.11, 16.1.5 | 16.3.8 | **No — resolved** |
| [GHSA-5j59-xgg2-r9c4](https://github.com/vercel/next.js/security/advisories/GHSA-5j59-xgg2-r9c4) — Denial of Service with Server Components - Incomplete Fix Follow-Up | high | `>= 13.3, >= 14, >=15, >=16` | 14.2.35, 15.0.7, 15.1.11, 15.2.8, 15.3.8, 15.4.10, 15.5.9, 15.6.0-canary.60, 16.0.10, 16.1.0-canary.19 | 16.3.8 | **No — resolved** |
| [GHSA-mwv6-3258-q52c](https://github.com/vercel/next.js/security/advisories/GHSA-mwv6-3258-q52c) — Denial of Service with Server Components | high | `>= 13.3, >= 14, >=15, >=16` | 16.0.9, 15.5.8, 15.4.9, 15.3.7, 15.2.7, 15.1.10, 15.0.6, 14.2.34, 15.6.0-canary.59, 16.1.0-canary.17 | 16.3.8 | **No — resolved** |
| [GHSA-9qr9-h5gf-34mp](https://github.com/vercel/next.js/security/advisories/GHSA-9qr9-h5gf-34mp) — RCE in React Server Components | critical | `>=14.3.0-canary.77, >=15, >=16` | v16.0.7, v15.5.7, v15.4.8, v15.3.6, v15.2.6, v15.1.9, v15.0.5, 15.6.0-canary.58, 16.1.0-canary.12 | 16.3.8 | **No — resolved** |
| [GHSA-67rr-84xm-4c7r](https://github.com/vercel/next.js/security/advisories/GHSA-67rr-84xm-4c7r) — DoS via cache poisoning  | high | `>15.0.4 and <15.2.0` | ≤15.0.4 and ≥15.2.0 | 16.3.8 | **No — resolved** |
| [GHSA-f82v-jwr5-mffw](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw) — Authorization Bypass in Next.js Middleware | critical | `=> 11.1.4 < 12.3.5; =>14.0 <14.2.25; =>15.0 <15.2.3; >= 13.0.0, < 13.5.9` | 12.3.5; 14.2.25; 15.2.3; 13.5.9 | 16.3.8 | **No — resolved** |
| [GHSA-7gfc-8cq8-jh5f](https://github.com/vercel/next.js/security/advisories/GHSA-7gfc-8cq8-jh5f) — Authorization bypass in Next.js | high | `>=9.5.5 <=14.2.14` | 14.2.15 | 16.3.8 | **No — resolved** |
| [GHSA-gp8f-8m3g-qvj9](https://github.com/vercel/next.js/security/advisories/GHSA-gp8f-8m3g-qvj9) — Cache Poisoning | high | `>=13.5.1; <14.2.10` | 13.5.7; 14.2.10 | 16.3.8 | **No — resolved** |
| [GHSA-fq54-2j52-jc42](https://github.com/vercel/next.js/security/advisories/GHSA-fq54-2j52-jc42) — Denial of Service (DoS) condition | high | `>=13.3.1 <13.5` | >=13.5 | 16.3.8 | **No — resolved** |
| [GHSA-77r5-gw3j-2mpf](https://github.com/vercel/next.js/security/advisories/GHSA-77r5-gw3j-2mpf) — HTTP Request Smuggling | high | `>=13.4 <13.5.1` | >=13.5.1 | 16.3.8 | **No — resolved** |
| [GHSA-fr5h-rqp8-mj6g](https://github.com/vercel/next.js/security/advisories/GHSA-fr5h-rqp8-mj6g) — Server-Side Request Forgery in Server Actions | high | `>=13.4 <14.1.1` | 14.1.1 | 16.3.8 | **No — resolved** |
| [GHSA-25mp-g6fv-mqxx](https://github.com/vercel/next.js/security/advisories/GHSA-25mp-g6fv-mqxx) — Unexpected server crash in Next.js versions above 11.1.0 and below 12.0.5 | high | `< 12.0.5` | 12.0.5,11.1.3 | 16.3.8 | **No — resolved** |

Some old records omit upper bounds (e.g. >=16) while listing a patched release. Those fields must be read together with the patch: they do **not** mean all future releases stay vulnerable. Several September records retain literal 16.3.? placeholders; the [official v16.3.8 release](https://github.com/vercel/next.js/releases/tag/v16.3.8) explicitly identifies the fixes. No invented numeric range replaces those fields. Next.js 16.3.8 is newer than the named next/og 16.3.6, AVIF/Windows 16.3.3, July SSRF/action/proxy 16.2.11 and prior RSC/proxy patch points.

All September 30 published items, including medium/low:

| Advisory | Severity | Official affected range | Patched evidence | Installed | Vulnerable? |
| --- | --- | --- | --- | --- | --- |
| [GHSA-h694-7cp9-m8p3](https://github.com/vercel/next.js/security/advisories/GHSA-h694-7cp9-m8p3) | medium | `16.3.0` | 16.3.8 explicit release fix list | 16.3.8 | **No — resolved** |
| [GHSA-3w37-wq28-93x7](https://github.com/vercel/next.js/security/advisories/GHSA-3w37-wq28-93x7) | medium | `16.3.0` | 16.3.8 explicit release fix list | 16.3.8 | **No — resolved** |
| [GHSA-cjq9-62q9-8jv4](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4) | high | `>= 16.0.0 < 16.3.?` | 16.3.8 explicit release fix list | 16.3.8 | **No — resolved** |
| [GHSA-39w2-rjm5-chcv](https://github.com/vercel/next.js/security/advisories/GHSA-39w2-rjm5-chcv) | low | `>= 16.0.0` | 16.3.8 explicit release fix list | 16.3.8 | **No — resolved** |
| [GHSA-4jqv-mc3x-m676](https://github.com/vercel/next.js/security/advisories/GHSA-4jqv-mc3x-m676) | medium | `>= 16.0.0` | 16.3.8 explicit release fix list | 16.3.8 | **No — resolved** |
| [GHSA-mcj8-r9mp-w47p](https://github.com/vercel/next.js/security/advisories/GHSA-mcj8-r9mp-w47p) | medium | `>= 16.0.0` | 16.3.8 explicit release fix list | 16.3.8 | **No — resolved** |
| [GHSA-f87g-xv8r-7p7x](https://github.com/vercel/next.js/security/advisories/GHSA-f87g-xv8r-7p7x) | medium | `>= 16.0.0` | 16.3.8 explicit release fix list | 16.3.8 | **No — resolved** |

Application assessment remains: controlled local next/image sources/no remotePatterns; bounded div text in Node /og; proxy only redirects, private auth in pages/APIs/repositories; no Server Actions/custom server, Pages Router, root catch-all, single-locale i18n, Draft Mode or use-cache. Patching is the primary disposition; feature absence did not justify keeping an affected package.

## B. Is 16.3.8 patched?

**Yes for all reviewed published applicable issues.** Registry latest remains 16.3.8; no canary/unrelated upgrade is necessary. The advisory index preserves historical records and is not proof of current vulnerability.

Task 9's earlier hold was based on the [separate pending-fix notice](https://nextjs.org/blog/upcoming-nextjs-security-release-september-2026), not solely the index. That notice still mentions an undisclosed critical/high pair but supplies no exact advisory ID or affected range establishing that installed 16.3.8 is vulnerable. Under Task 10's explicit known-applicable-vulnerability release rule, this is a **watch item**, not an established actionable blocker. Do not claim those undisclosed items were patched or proven non-applicable; recheck official disclosures and runtime audit before the actual staged launch. No published unresolved vulnerability with an exact affected range covering this patched release was identified.

## C. Production audit

Re-run `npm audit --omit=dev`: **zero findings**, exit 0. No reported actionable high/critical (or lower-severity) production findings. Full `npm audit`: **five high development-only cascade entries**, zero critical; it remains nonzero and is not labelled passing. JSON results are in ignored outputs/task10/audit-runtime.json and audit-full.json.

## D. Development-only braces

Five high cascade findings represent one root [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), braces <=3.0.3; no published patch. Chain:

`eslint-config-next@16.3.8 → @next/eslint-plugin-next@16.3.8 → fast-glob@3.3.1 → micromatch@4.0.8 → braces@3.0.3`.

The plugin is dev tooling. Runtime-only npm ls has no braces; a separate clean `npm ci --omit=dev` installation also verified braces, micromatch, fast-glob and eslint-config-next absent. Temporary install was removed. This audited chain has no production dependency/request path or user-supplied glob endpoint in MoveIn. A malicious lint/build glob could crash tooling, so build trusted source/config in a restricted environment without production secrets for untrusted PR jobs; prune dev dependencies after all build-time gates. Newer fast-glob still depends on the unpatched braces chain; npm's forced eslint-config-next 14 downgrade is disruptive and was rejected. Treat this as documented development-tooling risk, not a staged production launch blocker. Full audit remains nonzero and visible.

## E. Revised verdict and validation

**CODE READY — MANUAL PRODUCTION CONFIGURATION REMAINS.** Published dependency patch evidence, zero runtime findings, auth/session/upload tests and local functional gates meet Task 10's release rule. The prior blanket hold is superseded, while future-disclosure monitoring remains ordinary release hygiene. This verdict is not deployment authorization or proof that unsupplied SMTP/HTTPS/storage works on a target host.

| Gate | Task 10 result |
| --- | --- |
| Tests | **126/126 passed**, zero failures/skips, including real-library auth/session/household and multipart/image/save tests |
| Lint / whitespace | PASS, no lint warnings or diff whitespace errors |
| Production build / health report | PASS on Next 16.3.8; all five health checks pass, 29 verified/21 pending ZIPs, no verified gaps/broken links |
| Links | PASS, 110 canonical routes / 139 targets, no broken links/redirects/orphans |
| SEO / duplicate content | PASS, zero SEO errors/warnings; 81 pages / 34 guides, zero blocking duplicates |
| Analytics | PASS, one root/tag owner and expected public ID in HTML/bundle, privacy gates pass |
| Frontend | PASS, 140 files / 20 routes / 142 targets / six images; existing **26-client-component bundle review warning** retained |
| Runtime production smoke | PASS on final clean loopback server after health rebuild; private 307/401, public/sign-in 200, read-only DB integrity/FKs |
| Disabled production-mode authenticated QA | PASS, real captured sign-in/session, My Home/history usable, receipt unavailable/no file form, processing 503, logout revocation; all production:check checks pass with isolated valid-shaped config/permissions. No real mail sent |
| Production-only install | PASS, separate clean npm ci --omit=dev; flagged tooling chain absent, zero install audit findings; temporary install removed |
| PM2 first-stage defaults | PASS, config parses, one fork, explicit disabled extractor and false development/debug flags |
| Secrets heuristic | PASS; zero pattern findings, not proof against every secret format |

The health script includes another build/tests and uses the existing provider-link report, not a new external-link crawl. Its 74 URLs have zero broken/uncertain entries; pending/noindex ZIPs still retain 84 missing provider items. Task 9's clean full npm ci and browser magic-link/navigation checks remain valid; no application dependency versions changed in Task 10. Fresh isolated production-mode QA confirms the disabled stage. Real public HTTPS, SMTP delivery, target-host migration/storage/backup/model capacity remain unverified manual actions, not code gate failures.

## F. Exact manual environment variables

[staged-production-launch.md](staged-production-launch.md#exact-manual-variables) lists every actual application variable and handling requirement. [first-launch.env.example](first-launch.env.example) is the fill-in template: NODE_ENV, PORT, DATABASE_PATH, BETTER_AUTH_SECRET, BETTER_AUTH_URL, AUTH_EMAIL_MODE/FROM, AUTH_SMTP_HOST/PORT/SECURE/USER/PASS, RECEIPT_EXTRACTOR, NEXT_PUBLIC_GA_MEASUREMENT_ID, and false development/debug flags. Ollama variables are only needed after a later deliberate enablement. No live secrets were generated, printed or committed.

## G. Exact database migration/backup sequence

The [manual SQLite procedure](staged-production-launch.md#exact-sqlite-sequence-manual-not-executed) provides path/baseline verification → online backup → independent integrity/restore verification → ordered pending migrations → FKs/ledger/auth/household/public-data checks → health/build → separately authorized restart → safe rollback/quarantine commands. It distinguishes an existing DB from a new install requiring public-data provisioning. No production command ran. Keep one persistent local DB/process, owner-only permissions and daily verified/off-host backups.

## H. Email configuration

The [SMTP requirements](staged-production-launch.md#smtp-and-delivery-requirements) specify provider/host, authenticated port/TLS, private credential, verified From/domain and SPF/DKIM/DMARC as provider requires, plus actual delivered-link/expiration/reuse/error testing. Current adapter is standard interchangeable **SMTP**, not a generic HTTP email API. Development console cannot activate in production. No vendor signup/account or external DNS change occurred.

## I. HTTPS/proxy requirements

The [DigitalOcean/Nginx verification list](staged-production-launch.md#https--nginx--secure-sessions) covers HTTPS certificate/DNS/unknown hosts, exact trusted origin, Host/forwarded proto/IP, secure cookies, blocked direct Node/model access, no private caching/token logs, 9m proxy/8 MB app file limit, streaming and bounded requests. Later inference timeouts must exceed the configured deadline. No external infrastructure was changed.

## J. Safe first-launch configuration

`NODE_ENV=production`, `AUTH_EMAIL_MODE=smtp` with manually supplied delivery settings, exact HTTPS origin/stable secret/persistent DB, and **RECEIPT_EXTRACTOR=disabled**. Login/verified private household creation/My Home/history and public site work; receipt page honestly shows unavailable/no file form, processing 503, no sample purchases/fake fallback. Isolated production-mode QA verified this with captured test delivery, not real SMTP, and removed its fixture. No Ollama configuration is needed initially.

## K. Ordered post-deploy smoke

The [ten-step controlled-account plan](staged-production-launch.md#short-ordered-post-deploy-smoke-controlled-account-no-destructive-tests) is homepage → ZIP → request link → receive → sign in → empty My Home → logout → repeat sign-in/same household → unauthenticated rejection → honest disabled extraction. No destructive tests. Automated production:smoke creates no accounts/mail/upload/migration writes; manual sign-in uses an explicitly controlled account after authorized deployment.
