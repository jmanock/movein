# SEO audit and remediation log

Baseline commit: `f1f0e83` (July 29, 2026). The approved product was a fast, account-free ZIP lookup with 12 reviewed Central Florida records, clear address-confirmation warnings, and no Cloudflare runtime coupling.

## Baseline findings

- Canonicals, robots, XML sitemap, homepage Organization/WebSite schema, and visible FAQ schema already existed.
- Main-page titles and H1s were distinct, but the homeowner, renter, resources, and area hubs were thin and there were no substantive guide routes.
- ZIP pages showed sourced providers but lacked a service-coverage summary, local jurisdiction explanation, contextual guide links, visible local FAQs, and same-county navigation.
- Indexability logic was duplicated between metadata and the sitemap, creating drift risk.
- There was no HTML sitemap, Article schema, breadcrumb schema, duplication check, or full runtime SEO crawler.
- Broad homeowner/renter redirects prevented future guide routes. Old campaign routes were redirects rather than indexable copies, which was correct.
- The default social image was oversized, and several legacy public images were unused.

## Resolved in this release

- Added a single database-backed ZIP quality gate used by metadata, XML sitemap, HTML sitemap, and related areas.
- Added focused homeowner, renter, and utility guides with direct answers, review dates, official sources where relevant, Article schema, breadcrumbs, and related reading.
- Expanded ZIP pages without pretending ZIP-level certainty; added local context and address confirmation throughout.
- Added route-specific dynamic social cards, an optimized default card, HTML sitemap, structured-data documentation, duplication checks, and static/runtime SEO audits.
- Preserved noindex for lookup query/utility pages and did not generate campaign, city, county, or state templates without sufficient unique sourced value.

## Intentionally open

- Search Console and Bing verification require production-owner access after deployment.
- County/city/state landing pages remain deferred until the database can support substantial unique local guidance and a page-level review workflow.
- Google Analytics 4 is configured as one root-level tag with manual App Router page views and coarse, privacy-safe custom events. Its operational safeguards are documented in `docs/google-analytics.md`.
