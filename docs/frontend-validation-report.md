# Front-end validation report

Last automated validation: August 7, 2026. Target: Next.js production server on Node 22, port 3006.

## Automated scope

- `npm test`: data, API, SEO, UI safeguards, print resources, and unsupported ZIP behavior.
- `npm run lint`: Next.js ESLint rules.
- `npm run seo:audit`: canonical, metadata, schema, sitemap, links, and noindex safeguards.
- `npm run frontend:audit`: runtime H1, landmark, alt, reviewed-date, noindex checks plus static placeholder, form-label, mobile-nav, client-component, Cloudflare, and image-size checks.
- `npm run build`: production compilation and static generation.

## Representative matrix

The static and live audits cover the homepage, audience hubs, resources, the new internet and renter opportunity guides, the utility setup hub, verified ZIPs, unsupported ZIP behavior, robots, and sitemap output. Checks include headings, landmarks, alternative text, reviewed dates, noindex rules, internal targets, client-component count, image size, and placeholder copy.

## User journeys

1. Homepage → 32757 → electric evidence → official action.
2. Homepage → 32771 → coverage warning → water guide.
3. Homepage → 99999 → useful noindex fallback → coverage.
4. Electric guide → ZIP lookup → result.
5. Renter setup guide → renter hub lookup.
6. Result → outage link.
7. Result → correction form.
8. Mobile menu → Homeowners → ZIP lookup.

## Current local result

- 41/41 Node tests passed; lint passed without warnings.
- SEO audit: 0 errors, 0 warnings, including runtime crawl.
- Front-end audit: no serious failures across 67 source files, 18 representative routes, 118 internal targets, eight client components, and six public images.
- Internal links: 85 canonical routes and 112 targets; no broken links, redirects, or orphans.
- Production build compiled and generated 69 static pages, plus the expected dynamic routes.
- Every requested sprint route returned HTTP 200. The retired utility path returned a permanent 308 redirect to `/resources/utility-setup`.
- The production server started normally on `127.0.0.1:3006` and emitted no runtime errors during the crawl.

External provider links require periodic revalidation and were inspected without changing third-party state.
