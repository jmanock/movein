# Google Search launch checklist

## Before deployment

- [x] Canonical origin is `https://movein.guide`; route metadata emits self-referencing canonicals.
- [x] Parameter lookup requests redirect to clean `/lookup/[zip]` URLs; correction parameters remain noindex.
- [x] Campaign, state, county, and city copies are not generated.
- [x] `/robots.txt`, `/sitemap.xml`, and `/site-map` are available.
- [x] XML sitemap ZIP entries come only from the database quality gate.
- [x] Visible FAQ, Article, WebPage, Organization/WebSite, and breadcrumb data match page content.
- [x] `npm run seo:duplicates`, `npm run seo:audit`, build, runtime crawl, and link crawl pass.

## Search Console owner steps

1. Verify the `movein.guide` Domain property using the DNS record provided by Search Console.
2. Submit `https://movein.guide/sitemap.xml` in the Sitemaps report.
3. Inspect the homepage, each hub, one guide per hub, and one qualifying ZIP per pilot county.
4. Confirm the live URL is accessible and the Google-selected canonical matches the declared canonical, then request indexing for representative pages only.
5. Do not request indexing for pending, empty, parameter-only, campaign, or placeholder location pages.

Representative ZIPs: `/lookup/32771` (Seminole), `/lookup/32801` (Orange), `/lookup/32720` (Volusia), `/lookup/32757` (Lake), and `/lookup/34769` (Osceola), provided each remains in the generated sitemap.

## Monitoring

- Weekly for the first month: Page indexing exclusions, sitemap processing, manual actions/security issues, Core Web Vitals, and performance queries/pages.
- Monthly: compare indexed ZIP URLs with the generated quality-gated sitemap; inspect unexpected duplicate-canonical selections; review stale evidence and broken official links.
- After meaningful content changes: inspect the affected canonical URL and resubmit the sitemap rather than repeatedly requesting every URL.

Record verification date, property owner, sitemap submission date, and any indexing anomalies in the release log. Verification cannot be completed from the repository alone.
