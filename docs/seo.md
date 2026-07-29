# SEO architecture reference

`https://movein.guide` is the only canonical origin. Static and guide pages use `pageMetadata`; ZIP metadata is database-derived. `/lookup?zip=…` redirects to `/lookup/[zip]`, while correction query strings retain a clean canonical and noindex.

## ZIP indexing

`app/lib/seo.ts` is the shared gate. A ZIP needs a valid active record, city, county, location review date, editorial `isIndexable` approval, verified/mostly-verified derived status, sources, and sufficient verified real-provider categories. Pending, empty, partial, unknown, and malformed pages are excluded or 404. New database rows therefore update results automatically but never become indexable merely by existing.

## Discovery and duplicates

The XML and HTML sitemaps use the public-page manifest and the quality gate. Campaign routes remain redirects and never become indexable copies. State/county/city templates are deferred. Run `npm run seo:duplicates`, `npm run seo:audit`, then runtime audits with `SEO_BASE_URL` and `BASE_URL`.

## Performance and privacy

Content and ZIP pages remain server components. No maps, carousel, video, animation library, CMS, search engine, or analytics vendor was introduced. A small in-browser event abstraction emits only coarse event names/categories as `movein:analytics` custom events; it sends no network request and includes no ZIP, email, street address, account, correction text, or IP data.
