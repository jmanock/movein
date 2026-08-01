# SEO architecture reference

`https://movein.guide` is the only canonical origin. Static and guide pages use `pageMetadata`; ZIP metadata is database-derived. `/lookup?zip=…` redirects to `/lookup/[zip]`, while correction query strings retain a clean canonical and noindex.

## ZIP indexing

`app/lib/seo.ts` is the shared gate. A ZIP needs a valid active record, city, county, location review date, editorial `isIndexable` approval, verified/mostly-verified derived status, sources, and sufficient verified real-provider categories. Pending, empty, partial, unknown, and malformed pages are excluded or 404. New database rows therefore update results automatically but never become indexable merely by existing.

## Discovery and duplicates

The XML and HTML sitemaps use the public-page manifest and the quality gate. Campaign routes remain redirects and never become indexable copies. State/county/city templates are deferred. Run `npm run seo:duplicates`, `npm run seo:audit`, then runtime audits with `SEO_BASE_URL` and `BASE_URL`.

## Performance and privacy

Content and ZIP pages remain server components. No maps, carousel, video, animation library, CMS, or search engine was introduced. Google Analytics loads once from the root layout only when its public environment variable is present; its typed custom events include coarse operational context and exclude entered ZIP values, email, street addresses, account data, correction text, and visitor phone numbers.
