# SEO architecture

`https://movein.guide` is the only canonical origin. Static content pages have self-referencing canonicals. Query-parameter lookup pages are not created; `/lookup` is noindexed and successful results use `/lookup/[zip]`.

## ZIP indexing

- A ZIP must be `verified`, contain substantial reviewed records, and have `is_indexable=1` to be indexable.
- Partial, pending, empty, or editorially thin ZIP pages emit `noindex,follow` and stay out of the sitemap.
- Unknown and malformed ZIP routes return 404.
- The sitemap contains only approved useful ZIPs 32801, 32789, 32757, 34741, and 34769. The other pilot ZIPs remain useful but noindexed while coverage is partial.
- Do not generate thousands of pages from ZIP lists. A new page needs meaningful data, current sources, and visible address-confirmation guidance.

## Campaign and duplicate URLs

Campaign pages are retired and redirected to the homepage. No `/welcome/[campaign]` pages are generated, submitted, or canonicalized as copies. Tracking parameters do not alter canonical URLs.

## Structured data

- Homepage: `WebSite` and `Organization`.
- FAQ: `FAQPage` matching visible questions and answers.
- No fake `LocalBusiness`, reviews, ratings, products, contractors, or claimed service territories.
- Dataset schema is omitted until the public dataset and licensing record justify it.

## Discovery

`robots.txt` allows public pages, disallows `/api/`, and points to the canonical sitemap. The sitemap excludes API routes, redirects, `/lookup`, campaign routes, and noindexed ZIPs. Run the link checker against the production server before release.
