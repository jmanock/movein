# Front-end validation report

Last validation: August 10, 2026. Target: Next.js production server on Node 22, port 3006.

## Automated scope

- `npm test`: 55 data, API, SEO, My Move, Internet comparison, storage, date-phase, analytics, print, and unsupported-ZIP tests.
- `npm run lint`: Next.js and React rules.
- `npm run seo:audit`: runtime canonicals, metadata, schema, sitemap, links, and noindex safeguards.
- `npm run frontend:audit`: runtime headings, landmarks, alt text, reviewed dates, noindex rules, forms, mobile navigation, client boundaries, and image sizes.
- `npm run build`: production compilation, TypeScript, and static generation.

## Browser matrix

The Internet hub was checked at 1440 × 1000 and the comparison flow at 390 × 844. Provider ordering, ZIP results, wired and wireless filters, saved comparison restore and clear behavior, limited-coverage ZIP rendering, My Move save confirmation, the Internet printable, mobile navigation, and responsive stacking were inspected. The mobile pages had no horizontal overflow and browser console checks returned no warnings or errors.

Saved comparison state survived a full reload. Save to My Move produced a quiet inline confirmation with a screen-reader status message. Native date phase logic remains covered with fixed-calendar unit tests because browser automation cannot reliably operate the operating system’s native date picker.

The 390-pixel mobile layout is narrower than a typical 200%-zoom desktop CSS viewport and remained usable without horizontal scrolling. Focus styles, 44-pixel controls, reduced-motion rules, labeled form controls, native checkboxes, confirmation dialogs, and print-only hiding rules are present. This is not a substitute for a full assistive-technology audit.

## Current result

- 55/55 tests passed and lint passed.
- SEO audit: zero errors and zero warnings during the production crawl.
- Front-end audit: no serious failures across 88 source files, 18 representative routes, 133 internal targets, 19 small client components, and six images.
- Internal links: 101 canonical routes and 127 targets, with no broken links, redirects, or orphans.
- Production build generated 84 static pages plus expected dynamic routes.
- The application started normally on port 3006 and emitted no runtime errors during route and browser testing.

The increase to 19 client components is intentional and limited to storage, checklist, Internet comparison, print, analytics, reminder, navigation, and form interactions. The main content and route shells remain server-rendered, and no state library, animation package, PDF generator, account SDK, or payment dependency was added.
