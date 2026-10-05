# Task 9: Next.js security and compatibility release gate

**Historical checkpoint: Task 10 supersedes the release verdict below. Current verdict: CODE READY — MANUAL PRODUCTION CONFIGURATION REMAINS. See [patched-version evidence and staged plan](task-10-release-readiness.md).**

Verified October 4, 2026. **B. NOT READY — CODE/SECURITY ISSUE REMAINS.** Functional checks pass; the pending vendor critical/high disclosure still prevents security clearance. No deployment, production migration, SMTP configuration, provider change or product feature work occurred. Existing Tasks 1–8 changes were preserved.

## A. Previous Next.js version and inspection

At Task 9 start, installed/locked Next.js was **16.3.8**, already upgraded by Task 8 from **16.2.12**. React and React DOM were **19.2.8**. Inspected next.config.ts, proxy.ts, images, ImageResponse, caching/actions and server launch assumptions before reinstalling.

App Router uses Node route handlers and standard next start/one PM2 fork, with better-sqlite3 externalized. No custom server, middleware.ts, Server Actions, i18n, Draft Mode or use-cache features were found. Proxy handles canonical host/ZIP redirects, not private authorization. Pages/APIs/repositories enforce session/membership. Private pages are force-dynamic/noindex; private APIs no-store. Public static generation and metadata remain. GuideArticle uses next/image with local sources; /og uses Node ImageResponse with bounded div text. Existing AVIF/WebP output config was retained; no AVIF receipt support was added.

## B. New version and minimum upgrade path

**16.3.8 → 16.3.8**, retained deliberately. Registry latest=16.3.8; 16.4.0-canary.59 is prerelease. The [official release](https://github.com/vercel/next.js/releases/tag/v16.3.8) identifies seven September fixes. @next/env/eslint-config-next remain aligned at 16.3.8; React/DOM 19.2.8 satisfy Next's peer ranges. No further dependency/lockfile change or compatibility code fix was necessary. No canary, unrelated major upgrade or audit force was used.

The [official September notice](https://nextjs.org/blog/upcoming-nextjs-security-release-september-2026) still says one critical and one high fix await upstream coordination and a later release. Public notice/advisory metadata lacks enough detail to assess those items. No newer stable registry patch resolves that evidence gap today. This is the hold retained from Task 8, not proof that MoveIn is exploitable.

## C. Sharp before/after

**0.35.5 → 0.35.5**; Task 8 already upgraded 0.35.3. Registry latest is 0.35.5, outside [GHSA-rgj7-g3m4-5g8c](https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c)'s <0.35.4 range. Direct dependency/override resolve to one version. Valid JPG/PNG decode, truncation, MIME mismatch and valid-CRC pixel-bomb rejection pass before model contact with the 20 MP cap. No receipt AVIF support or OCR added.

## D. Advisories reviewed

Fetched all 69 published official repository advisories, current notice/release, registry tags and npm audits. Evidence: ignored outputs/task9/next-advisories.json, next-dist-tags.json, dependency-tree.txt and audit JSON/text. The table covers every July–September 2026 repository advisory.

**Task 9's previous and final version is 16.3.8.** All table rows are patched at both points by their numeric fix or explicit September release evidence. The historical column refers to **16.2.12 before Task 8**. Six official records retain literal 16.3.? fields or omit range upper bounds; we preserve these rather than inventing a semver range. The release's explicit fix list provides evidence of resolution where a numerical comparison is unreliable.

| Advisory / severity | Published 16.x affected range | Published patch / release evidence | Historical 16.2.12 in range? | Feature use / configuration implications |
| --- | --- | --- | --- | --- |
| [GHSA-h694-7cp9-m8p3](https://github.com/vercel/next.js/security/advisories/GHSA-h694-7cp9-m8p3) — Cache leak across root param values in nested 'use cache' functions (medium) | `16.3.0` | `16.3.8` | No (16.3.0 only) | No nested use-cache/root-param functions; cacheComponents disabled. |
| [GHSA-vcvr-r3jv-pc5j](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j) — Remote Code Execution in next/og ImageResponse (critical) | `>= 16.2.0 < 16.3.6` | `16.3.6` | Yes | Node /og exists; bounded query text in divs, no attacker SVG/attributes/styles. |
| [GHSA-3w37-wq28-93x7](https://github.com/vercel/next.js/security/advisories/GHSA-3w37-wq28-93x7) — Pending `use cache` fill can leak Draft Mode content into regular responses and persisted pages (medium) | `16.3.0` | `16.3.?` → 16.3.8 release | No (16.3.0 only) | No cacheComponents/useCache or Draft Mode. |
| [GHSA-cjq9-62q9-8jv4](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4) — Server-Side Request Forgery in Image Optimization (high) | `>= 16.0.0 < 16.3.?` | `16.3.?` → 16.3.8 release | Pre-fix 16.x; upper absent/incomplete | No images.remotePatterns; official workaround says unaffected. Keep source allowlist absent. |
| [GHSA-39w2-rjm5-chcv](https://github.com/vercel/next.js/security/advisories/GHSA-39w2-rjm5-chcv) — Information disclosure in the Next.js development server's Model Context Protocol endpoint (low) | `>= 16.0.0` | `16.3.?` → 16.3.8 release | Pre-fix 16.x; upper absent/incomplete | Only loopback dev server; production next start does not serve dev MCP. |
| [GHSA-4jqv-mc3x-m676](https://github.com/vercel/next.js/security/advisories/GHSA-4jqv-mc3x-m676) — Cache poisoning of SSG and ISR pages in self-hosted Next.js applications (medium) | `>= 16.0.0` | `16.3.?` → 16.3.8 release | Pre-fix 16.x; upper absent/incomplete | Official impact requires Pages Router SSG/ISR. MoveIn uses App Router. |
| [GHSA-mcj8-r9mp-w47p](https://github.com/vercel/next.js/security/advisories/GHSA-mcj8-r9mp-w47p) — Cache poisoning in Next.js SSG/ISR rendering leads to cross-user content substitution and persistent denial of service (medium) | `>= 16.0.0` | `16.3.?` → 16.3.8 release | Pre-fix 16.x; upper absent/incomplete | No root catch-all page. Existing [slug] routes are not catch-alls. |
| [GHSA-f87g-xv8r-7p7x](https://github.com/vercel/next.js/security/advisories/GHSA-f87g-xv8r-7p7x) — Information disclosure in Next.js App Router metadata image routes via dynamicParams bypass (medium) | `>= 16.0.0` | `16.3.?` → 16.3.8 release | Pre-fix 16.x; upper absent/incomplete | No dynamic metadata-image files or dynamicParams image authorization; build is Turbopack, not webpack. |
| [GHSA-2xp9-vwfh-vxw4](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4) — Unauthenticated Remote Code Execution in Image Optimization API when AVIF files are used (critical) | `< 16.3.3` | `16.3.3` | Yes | Optimizer exists for controlled local guide images. Existing AVIF output config; receipts reject AVIF. |
| [GHSA-p293-qw3h-jr36](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36) — Unauthenticated Remote Code Execution on windows-hosted servers (critical) | `>= 16.0 < 16.3.3` | `16.3.3` | Yes | App Router exists; macOS locally and planned Ubuntu, not Windows. |
| [GHSA-p9j2-gv94-2wf4](https://github.com/vercel/next.js/security/advisories/GHSA-p9j2-gv94-2wf4) — Server-Side Request Forgery in rewrites via attacker-controlled destination hostname (high) | `>= 16.0.0 < 16.2.11` | `16.2.11` | No | No external rewrites/redirects with captured hostname; config destinations fixed/local. |
| [GHSA-4c39-4ccg-62r3](https://github.com/vercel/next.js/security/advisories/GHSA-4c39-4ccg-62r3) — Unbounded Server Action payload in Edge runtime (medium) | `>= 16.0.0 < 16.2.11` | `16.2.11` | No | No Server Actions or Edge action runtime. Bounded Node upload route handlers. |
| [GHSA-89xv-2m56-2m9x](https://github.com/vercel/next.js/security/advisories/GHSA-89xv-2m56-2m9x) — Server-Side Request Forgery in Server Actions on custom servers (high) | `>= 16.0.0 < 16.2.11` | `16.2.11` | No | No actions/custom server; standard next start. Trusted Host/forwarded headers required. |
| [GHSA-68g3-v927-f742](https://github.com/vercel/next.js/security/advisories/GHSA-68g3-v927-f742) — Cache confusion of response bodies for requests with bodies (medium) | `>= 16.0.0 < 16.2.11` | `16.2.11` | No | No mismatched Request/init cached fetch; model requests use no-store. |
| [GHSA-6gpp-xcg3-4w24](https://github.com/vercel/next.js/security/advisories/GHSA-6gpp-xcg3-4w24) — Middleware / Proxy bypass in App Router applications using Turbopack and single locale (high) | `>= 16.0.0 < 16.2.11` | `16.2.11` | No | Proxy redirects only; no i18n/single locale. Page/API/repository auth is independent. |
| [GHSA-m99w-x7hq-7vfj](https://github.com/vercel/next.js/security/advisories/GHSA-m99w-x7hq-7vfj) — Denial of Service in App Router using Server Actions (high) | `>= 16.0.0 < 16.2.11` | `16.2.11` | No | App Router exists but no Server Actions; route-handler POSTs are not actions. |
| [GHSA-4633-3j49-mh5q](https://github.com/vercel/next.js/security/advisories/GHSA-4633-3j49-mh5q) — Cache confusion of response bodies for requests with bodies containing invalid UTF-8 byte sequences (medium) | `>= 16.0.0 < 16.2.11` | `16.2.11` | No | No mismatched Request/init caching; private/model responses no-store. |
| [GHSA-q8wf-6r8g-63ch](https://github.com/vercel/next.js/security/advisories/GHSA-q8wf-6r8g-63ch) — Denial of Service in the Image Optimization API using SVGs (medium) | `>= 16.0.0 < 16.2.11` | `16.2.11` | No | No untrusted SVG optimizer input; controlled guide sources, receipt SVG rejected. |
| [GHSA-955p-x3mx-jcvp](https://github.com/vercel/next.js/security/advisories/GHSA-955p-x3mx-jcvp) — Unauthenticated disclosure of internal Server Function endpoints (medium) | `>= 16.0.0 < 16.2.11` | `16.2.11` | No | No application Server Functions/Actions; auth/receipt APIs use route handlers. |

Additional relevant prior advisories:

| Advisory | Range / patch | Previous/current applicability |
| --- | --- | --- |
| [GHSA-267c-6grr-h53f](https://github.com/vercel/next.js/security/advisories/GHSA-267c-6grr-h53f), segment-prefetch proxy bypass | >=16.0.0 <16.2.5; patched 16.2.5 | 16.2.12/16.3.8 outside; auth in underlying page/API/data path |
| [GHSA-26hh-7cqf-hhc6](https://github.com/vercel/next.js/security/advisories/GHSA-26hh-7cqf-hhc6), incomplete middleware fix | >=16.0.0 <16.2.6; patched 16.2.6 | Both outside; proxy handles public redirects only |
| [GHSA-492v-c6pp-mqqv](https://github.com/vercel/next.js/security/advisories/GHSA-492v-c6pp-mqqv), dynamic-route injection | >=16.0.0 <16.2.5; patched 16.2.5 | Both outside; no proxy-only auth |
| [GHSA-f82v-jwr5-mffw](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw), middleware authorization bypass | Published 11–15 ranges; patched 12.3.5/13.5.9/14.2.25/15.2.3 | Both 16.x versions outside; reject untrusted internal identity headers at edge |
| [GHSA-4342-x723-ch2f](https://github.com/vercel/next.js/security/advisories/GHSA-4342-x723-ch2f), middleware SSRF | Published <14.2.32 / <15.4.7; patched 14.2.32/15.4.7 | Both on later 16.x; proxy does not reflect request headers into response headers |
| [GHSA-fr5h-rqp8-mj6g](https://github.com/vercel/next.js/security/advisories/GHSA-fr5h-rqp8-mj6g), Server Actions SSRF | >=13.4.0 <14.1.1; patched 14.1.1 | Both outside; no actions/custom server; trusted proxy Host still required |
| [GHSA-7m27-7ghc-44w9](https://github.com/vercel/next.js/security/advisories/GHSA-7m27-7ghc-44w9), action DoS | >=13.0.0 <14.2.21 or >=15.0.0 <15.1.1; published fixes 13.5.8/14.2.21/15.1.2 | Both 16.x versions outside; no actions; proxy connection/body timeouts required |

Refined Task 8's conservative feature assessment: the SSG disclosure requires Pages Router and the substitution disclosure a root catch-all; MoveIn has neither. next/og impact concerns attacker-controlled SVG content/attributes/styles, while this route uses bounded div text. These prerequisites do not replace patching the dependency.

## E. Cleared items and retained hold

Published next/og, AVIF/libheif, Windows RCE, SSRF, proxy bypass, Server Action and September fixes are installed. Numeric bounded ranges are avoided; incomplete records have explicit release evidence. Maintain trusted proxy headers, restricted optimizer sources, private no-store, loopback-only Node/model/dev access and bounded uploads.

**Uncleared:** pending critical/high items have no disclosed IDs, affected ranges or applicability details in the notice. Do not invent CVEs or assert 16.3.8 fixes them. Require a stable vendor patch or documented non-applicability evidence. A build and npm audit cannot establish that alone.

## F. Remaining production findings

`npm audit --omit=dev`: **zero findings**, exit 0. No reported runtime findings for Next 16.3.8, React/DOM 19.2.8, Sharp 0.35.5, Better Auth 1.7.7, better-sqlite3 13.0.3 or Nodemailer 10.0.14 in this snapshot. This does not cover undisclosed vendor items or infrastructure correctness.

## G. Remaining development-only findings

Full audit: **exit 1, five high cascade findings**, one root [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), braces <=3.0.3, no published fix.

`eslint-config-next@16.3.8 → @next/eslint-plugin-next@16.3.8 → fast-glob@3.3.1 → micromatch@4.0.8 → braces@3.0.3`.

Latest braces remains 3.0.3; latest micromatch 4.0.8 still depends on it. Newer fast-glob 3.3.3 still depends on micromatch ^4.0.8, so a compatible override cannot remove the root issue. Next's plugin pins fast-glob 3.3.1. `npm ls --omit=dev braces` is empty; no application imports/user glob endpoint was found. Practical exposure is an attacker-controlled lint/build pattern crashing tooling, not a demonstrated production HTTP path.

Documented residual dev risk: trusted builds/config only, restricted tooling permissions, no production secrets for untrusted PR builds, prune dev dependencies after validation/build, recheck a compatible fix. npm's force proposal downgrades eslint-config-next to 14.2.35, breaking Next 16 alignment; rejected. Findings remain visible and the full audit is not counted as passing.

## H. Better Auth regression

**1.7.7 retained.** Real-library tests pass for cookie flags, verified session/membership, hashed ten-minute/single-use/expired links, destinations, CSRF, DB rate limits, household isolation/forged identity rejection and logout.

Browser smoke used an isolated copied SQLite DB and npm run dev:auth on loopback 3007: homepage/navigation loaded; Upload receipt redirected to sign-in; form generated an explicitly enabled development console link; captured local link opened /receipts; My Home showed empty inventory/history; Sign out returned to sign-in; revisiting My Home redirected with destination preserved. Fixture: one verified user/membership, **zero sessions after logout**, clean FKs. No SMTP delivery. Test DB/token log/local link bridge removed after stopping processes. Screenshot: ignored outputs/task9/authenticated-my-home.png.

## I. Receipt and compatibility regression

Tests pass for multipart/file routes, JPG/JPEG/PNG MIME/signature/decode, body/size limits, malformed images, in-memory release, extractor cancellation/timeout/local-only boundary, review corrections/selections, transactional/idempotent save, inventory/history and ownership. Synthetic valid images/isolated mocks require no live Ollama. Browser receipt UI showed honest unavailable state while My Home/history worked. No new disk/public receipt path or AI adapter.

App Router/route handlers, private dynamic/no-store rendering, public static generation/metadata, component boundaries, cookies/sessions, native SQLite/Sharp after reinstall, proxy redirects, guide image handling and build output passed existing checks. No compatibility code change or new suppression required. Prior documented logout navigation lint exception remains. Live Ollama smoke was optional and not performed; no real user receipt image was supplied.

## J. npm ci / reproducibility

**PASS:** clean node_modules installation added 381 packages and audited 382. Native libraries loaded and tests/build passed. Manifest/lock remain consistent; no Task 9 dependency/lock changes were necessary. Existing Task 8 changes remain. Versions reconfirmed using npm ls after reinstall.

## K. Full release gate

| Check | Result |
| --- | --- |
| npm ci | PASS, 381 packages installed; five high dev findings reported |
| npm test | PASS, **126/126**, zero failures/skips |
| npm run lint | PASS, no warnings |
| npm run build | PASS, Next 16.3.8 Turbopack, TypeScript/static generation/proxy output valid |
| npm audit | **FAIL/exit 1: five high dev-only cascade findings**, detailed above |
| npm audit --omit=dev | PASS/exit 0, zero findings |
| Links | PASS, 110 canonical routes/139 internal targets, no broken links/redirects/orphans |
| SEO / duplicates | PASS, zero errors/warnings; 81 pages/34 guides, zero blocking duplicates |
| Analytics | PASS, expected public GA ID, single root/tag owner, HTML/bundle/event privacy gates |
| Frontend | PASS, 140 source files, 20 representative routes, 142 internal targets, six images; **existing warning: 26 client components, review bundle impact** |
| Provider data | PASS, 50 ZIPs, 57 providers, 349 service-area links, 66 contacts, 70 sources |
| Runtime health / health report | PASS, all five automated checks including another production build. 29 verified/21 pending ZIPs, zero verified gaps/broken links. Existing provider-link report has 74 URLs/zero uncertain links; this is not a fresh external-link crawl. Pending/noindex ZIPs still have 84 missing provider items |
| Production smoke | PASS on loopback production-mode server, public/sign-in 200, private pages 307, private APIs 401 and read-only DB integrity/FKs |
| Browser smoke | PASS, isolated development console link → receipt UI → My Home → logout → protected My Home redirect; no SMTP delivery |
| Main local DB after isolated QA | Zero users/receipts, integrity ok, zero FK errors; no QA user/purchase writes |
| Secrets heuristic | PASS, 251 working-tree files/25 commits, zero pattern findings; not a guarantee for all secret formats |
| production:check on current local environment | **FAIL/exit 1 as expected without production provisioning**: auth/SMTP configuration, persistent DB owner-only directory requirement and explicit extractor choice are unsupplied; debug/analytics checks pass. This operator preflight remains required on the target host; integrity/FKs were separately verified above |
| Production infrastructure | Not deployed/tested: real SMTP, HTTPS/proxy, production migrations/backups/model capacity remain manual |

Runtime smoke/link/frontend checks were repeated after the health report's build and clean server restart. Command logs are local /tmp/movein-task9-*.log; public audit/version evidence is in ignored outputs/task9. The temporary private auth fixture/log was removed. No failures/advisories/warnings were suppressed. Functional health does not grant security release clearance.

## L. Updated verdict

**B. NOT READY — CODE/SECURITY ISSUE REMAINS.** Functional compatibility: PASS. Published fixes: installed. Runtime audit: PASS. Security clearance: **HOLD**. Manual production configuration is a separate required category, not an application defect. Checklist explicitly distinguishes these statuses; it cannot truthfully say CODE COMPLETE while clearance is unresolved.

## M. Exact remaining manual launch steps

First clear the vendor issue using a stable patch or documented applicability evidence and rerun the security gate. Then follow [production-launch-checklist.md](production-launch-checklist.md) in order:

1. Provision service-owned persistent local SQLite storage (0700 directory/0600 file), verify existing path, take and restore-test a WAL-safe pre-migration backup. Record no prior DB for genuinely new installs.
2. Supply protected stable random Better Auth secret, approved HTTPS root origin, public analytics ID; disable all development/debug flags.
3. Supply SMTP host, authenticated port/TLS, username/private credential, verified sender/domain; verify SPF/DKIM/DMARC as required, mailbox delivery and failures.
4. In an authorized maintenance window stop writers, run controlled missing migrations through 011, verify ledger/integrity/FKs/purchase facts and quarantine legacy purchases.
5. Verify DNS/certificate/HTTPS, trusted Host/Origin/forwarded IP/proto, blocked direct Node access, request/body/timeouts, proxy streaming, private cache/log exclusions and no DB/backups/repository served.
6. Explicitly select disabled extraction initially or provision/capacity-test an installed local private Ollama vision model. No demo/provider fallback.
7. Pass production:check and release gates, then separately authorize one-process PM2 launch/restart and target-host smoke/auth/cookies/household-isolation/enabled-upload tests.
8. Configure daily verified encrypted off-host backups, seven daily/four weekly retention, stale-backup alerts/monthly isolated restores; verify rollback/write reconciliation.

No production action ran. Task 9 ends at this checkpoint; no next task begun.
