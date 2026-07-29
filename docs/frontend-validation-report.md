# Front-end validation report

Date: July 29, 2026. Target: Next.js production server on Node 22, port 3006.

## Automated scope

- `npm test`: data, API, SEO, UI safeguards, print resources, and unsupported ZIP behavior.
- `npm run lint`: Next.js ESLint rules.
- `npm run seo:audit`: canonical, metadata, schema, sitemap, links, and noindex safeguards.
- `npm run frontend:audit`: runtime H1, landmark, alt, reviewed-date, noindex checks plus static placeholder, form-label, mobile-nav, client-component, Cloudflare, and image-size checks.
- `npm run build`: production compilation and static generation.

## Browser matrix

Desktop 1280×900 and mobile 320×800: homepage, homeowners, renters, Learn Your Area, resources, FAQ, coverage, electric guide, verified ZIP 32757, mostly-verified ZIP 32771, unsupported ZIP 99999, and invalid page. Checks include overflow, headings, navigation, images, provider hierarchy, error copy, and focusable controls.

## User journeys

1. Homepage → 32757 → electric evidence → official action.
2. Homepage → 32771 → coverage warning → water guide.
3. Homepage → 99999 → useful noindex fallback → coverage.
4. Electric guide → ZIP lookup → result.
5. Renter setup guide → renter hub lookup.
6. Result → outage link.
7. Result → correction form.
8. Mobile menu → Homeowners → ZIP lookup.

## Final local result

- 31/31 Node tests passed; lint passed without warnings.
- SEO audit: 0 errors, 0 warnings, including runtime crawl.
- Front-end audit: no serious failures across 53 source files, 13 representative routes, six client components, and four public images.
- Internal links: 51 canonical routes and 55 targets; no broken links, redirects, or orphans.
- Production build compiled and generated 50 pages.
- Runtime routes returned HTTP 200 for every representative page, including the useful `noindex` unsupported-ZIP state.
- Browser checks found one H1, no horizontal overflow, and no missing rendered images on every desktop route tested. At 320px, the H1 begins at 167px, the hero image loads below the primary action, and the mobile menu and supported/unsupported form journeys work.

External provider links require periodic revalidation and were inspected without changing third-party state.
