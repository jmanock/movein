# Search and metadata architecture

MoveIn uses `https://movein.guide` as its only canonical origin. The App Router metadata helper in `app/lib/metadata.ts` supplies page-specific titles, descriptions, canonical URLs, Open Graph fields, X card fields, and 1200 × 630 images.

## Indexable page rules

- Canonical hubs, timeline stages, substantive guide pages, policy pages, and trust pages are indexable.
- API and Open Graph image endpoints are not listed in the sitemap.
- Redirect sources are excluded from the sitemap.
- `/welcome/[campaign]` supports only the two checked-in campaign identifiers. Both pages emit `noindex,follow` and canonicalize to the substantive destination page. Unknown campaign identifiers return 404.
- Query parameters do not change the canonical URL. Tracking parameters remain useful for attribution without creating indexable copies.
- New city, county, campaign, or keyword variants must not be added unless the page has distinct, maintained public value.

## Structured data

- Homepage: `Organization` and `WebSite`.
- Guide pages: `BreadcrumbList` and `Article`.
- Checklist pages: visible steps are also represented as `HowTo`.
- FAQ schema is emitted only when the matching questions and answers are visible on the page.
- JSON is serialized through `app/components/JsonLd.tsx`, which escapes `<` before insertion.

Do not add reviews, ratings, local-business claims, credentials, partnerships, or services that are not real and visible.

## Sitemap and robots

`app/sitemap.ts` lists canonical public pages with differentiated priorities and update frequencies. Campaign pages, API routes, Open Graph endpoints, redirects, and unknown dynamic parameters are excluded. `app/robots.ts` allows normal crawling and points to `https://movein.guide/sitemap.xml`.

Run the production server and use `npm run check:links` to verify every sitemap URL returns 200.

## Social images

- Homepage default: `/images/seo/movein-social-card.jpg`
- Timeline: `/og/timeline`
- Homeowners: `/og/homeowners`
- Renters: `/og/renters`
- Florida: `/og/florida`
- Checklists: `/og/checklists`

The dynamic image route accepts only those identifiers and returns 404 for others.
