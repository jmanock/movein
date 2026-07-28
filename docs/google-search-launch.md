# Google Search launch checklist

- [x] Canonical domain is `https://movein.guide`.
- [x] `/robots.txt` is crawlable and references the sitemap.
- [x] `/sitemap.xml` contains canonical public pages and the 12 useful pilot ZIP pages.
- [x] Pending, empty, invalid, correction, and internal-review URLs are noindex or return 404.
- [x] Homepage, FAQ, About, and Data Sources metadata are present.
- [x] FAQ schema mirrors visible FAQ content; organization, website, and breadcrumb data are present where applicable.
- [x] HTTPS is expected at the Nginx edge.
- [x] 320px and 375px layouts were checked.
- [x] Internal links and production console were checked locally.

Submit `https://movein.guide/sitemap.xml` in Google Search Console. Inspect these first:

1. `https://movein.guide/`
2. `https://movein.guide/learn-your-area`
3. `https://movein.guide/homeowners`
4. `https://movein.guide/renters`
5. `https://movein.guide/resources`
6. `https://movein.guide/faq`
7. `https://movein.guide/data-sources`
8. `https://movein.guide/lookup/32771` (Seminole)
9. `https://movein.guide/lookup/32801` (Orange)
10. `https://movein.guide/lookup/32720` (Volusia)
11. `https://movein.guide/lookup/32757` (Lake)
12. `https://movein.guide/lookup/34769` (Osceola)

After deployment, use URL Inspection on each URL, confirm the declared and selected canonical match, run the live test, then request indexing. Do not request indexing for any future pending or placeholder-only ZIP page.
