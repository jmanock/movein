# MoveIn ZIP utility rebuild plan

## Repository audit

The pre-rebuild application was a standard Next.js 16 Node application with App Router, TypeScript, React, Lucide icons, CSS, and file-backed SQLite through `better-sqlite3`. It already used conventional `next dev`, `next build`, and `next start` scripts, Node 22, PM2, Nginx, port 3006, and the `https://movein.guide` canonical. A full search found no Cloudflare, Wrangler, Vinext, Workers binding, or Cloudflare environment dependency in production code or the lockfile.

The old route tree centered on a homepage, eight-stage localStorage timeline, homeowner/renter/checklist guide detail pages, a Florida Guide, two noindexed campaign pages, newsletter API, dynamic social cards, generic policy pages, robots, and sitemap. SQLite held only newsletter subscribers. Tests asserted the old homepage, timeline persistence, newsletter validation/storage, guide metadata, campaign canonicals, and Node deployment. Styling was a single global CSS file with Lucide-based code-native visuals. The PM2 process used one fork because SQLite is local.

## Product decisions

### Kept

- Next.js/Node deployment, TypeScript, SQLite, Lucide icons, accessible site shell, canonical host, robots, sitemap, policy routes, and official-source emphasis.
- One-process PM2 architecture and persistent `DATABASE_PATH`.
- Existing newsletter table data is left untouched by migrations for safe production rollback.

### Simplified

- Homepage becomes one ZIP lookup followed by service types, three steps, two audience cards, and one Learn Your Area link.
- Homeowner and renter guidance becomes short Start here / Soon after / Ongoing lists.
- Navigation is Home, Homeowners, Renters, Learn Your Area, Resources, and FAQ.
- At the original rebuild launch, analytics was absent and the product collected no lookup email or exact address. Google Analytics 4 was added later with coarse, privacy-safe event parameters only.

### Removed

- Timeline UI, localStorage progress, checklist navigation, long guide library, Florida Guide navigation, campaign pages, newsletter form/API, move-month fields, audience segmentation, promotional hero art, duplicate calls to action, and dynamic guide social cards.

### Archived by history

The old implementation remains recoverable from Git checkpoint `ada1f67`. It is not duplicated into a runtime archive directory because Git preserves it without shipping dead application code.

## Delivery sequence

1. Create the clean pre-rebuild checkpoint.
2. Add non-destructive SQL migration and five-county CSV import framework.
3. Add validation, coverage, and stale-review reports.
4. Build lookup API and server-rendered result pages.
5. Replace navigation, homepage, static guidance, trust pages, SEO, and policies.
6. Validate data, lint, test, build, run on port 3006, and test public/error/API routes.

## Hard constraints

- A ZIP code never silently becomes an exact service-territory claim.
- Water, sewer, internet, gas, and trash may depend on the exact property.
- Empty categories stay empty; there is no fabricated fallback provider.
- The first launch is a five-county pilot, not statewide Florida coverage.
