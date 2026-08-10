# Front-end validation report

Last validation: August 10, 2026. Target: Next.js production server on Node 22, port 3006.

## Automated scope

- `npm test`: 50 data, API, SEO, My Move, storage, date-phase, analytics, print, and unsupported-ZIP tests.
- `npm run lint`: Next.js and React rules.
- `npm run seo:audit`: runtime canonicals, metadata, schema, sitemap, links, and noindex safeguards.
- `npm run frontend:audit`: runtime headings, landmarks, alt text, reviewed dates, noindex rules, forms, mobile navigation, client boundaries, and image sizes.
- `npm run build`: production compilation, TypeScript, and static generation.

## Browser matrix

Desktop was checked at 1440 × 900. Mobile was checked at 390 × 844. The My Move setup form, native date input, labeled ZIP input, homeowner/renter controls, First 30 Days hub, mobile navigation, printable checklist, Add to My Move confirmation, and responsive stacking were inspected. The mobile pages had no horizontal overflow and browser console checks returned no warnings or errors.

Printable checkbox state survived a full reload. Add to My Move changed to a quiet inline confirmation with a screen-reader status message. Native date phase logic is additionally covered with fixed-calendar unit tests because the browser controller cannot reliably fill the operating system’s native date picker.

The 390-pixel mobile layout is narrower than a typical 200%-zoom desktop CSS viewport and remained usable without horizontal scrolling. Focus styles, 44-pixel controls, reduced-motion rules, labeled form controls, native checkboxes, confirmation dialogs, and print-only hiding rules are present. This is not a substitute for a full assistive-technology audit.

## Current result

- 50/50 tests passed and lint passed.
- SEO audit: zero errors and zero warnings during the production crawl.
- Front-end audit: no serious failures across 77 source files, 18 representative routes, 124 internal targets, 14 small client components, and six images.
- Internal links: 94 canonical routes and 120 targets, with no broken links, redirects, or orphans.
- Production build generated 77 static pages plus expected dynamic routes.
- The application started normally on port 3006 and emitted no runtime errors during route and browser testing.

The increase from eight to 14 client components is intentional and limited to storage, checklist, print, analytics, reminder, navigation, and form interactions. The main content and route shells remain server-rendered, and no state library, animation package, PDF generator, account SDK, or payment dependency was added.
