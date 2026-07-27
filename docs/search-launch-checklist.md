# Search launch checklist

1. Verify the `movein.guide` domain property in Google Search Console using the DNS record requested by Google.
2. Confirm `https://movein.guide` is the canonical origin and that HTTP and `www` redirect to it in one hop.
3. Submit `https://movein.guide/sitemap.xml`.
4. Inspect the homepage and confirm Google sees the rendered canonical, title, description, and indexable status.
5. Request indexing once for the homepage and the major hub pages after the release is live.
6. Review Page Indexing reports for 404s, duplicate canonicals, unexpected noindex pages, and redirected sitemap URLs.
7. Review Core Web Vitals after enough field data becomes available; lab scores are diagnostic rather than field evidence.
8. Confirm the HTTPS report is clean and all canonical assets load securely.
9. Test representative guide pages with Google’s Rich Results Test. Breadcrumb and supported article or checklist markup must match visible content.
10. Monitor Manual Actions and Security Issues.
11. Connect Google Analytics only if desired and only once. Use the existing privacy-safe event abstraction and never send newsletter values or other form content.
12. Do not repeatedly request indexing for unchanged pages.

## First URLs to inspect

- `https://movein.guide/`
- `https://movein.guide/timeline`
- `https://movein.guide/homeowners`
- `https://movein.guide/renters`
- `https://movein.guide/florida`
- `https://movein.guide/checklists`
- `https://movein.guide/checklists/move-in-checklist`
- `https://movein.guide/checklists/new-homeowner-checklist`
- `https://movein.guide/florida/moving-to-florida-checklist`
- `https://movein.guide/florida/hurricane-preparation`
- `https://movein.guide/sitemap.xml`

Campaign URLs under `/welcome/` should show `noindex,follow` and a canonical to their substantive destination. Do not submit them for indexing.
