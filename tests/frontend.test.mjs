import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("front-end growth routes and states remain explicit", async () => {
  const [home, coverage, lookup, resources] = await Promise.all([read("../app/page.tsx"), read("../app/coverage/page.tsx"), read("../app/lookup/[zip]/page.tsx"), read("../app/resources/page.tsx")]);
  assert.match(home, /context="homepage_hero"/);
  assert.match(home, /pathway-icon/);
  assert.match(coverage, /getCoverageResults/);
  assert.match(coverage, /isZipResultIndexable/);
  assert.match(lookup, /UnsupportedZip/);
  assert.match(lookup, /See current coverage/);
  assert.match(resources, /printables\.map/);
});

test("print resources and responsive system have accessibility safeguards", async () => {
  const [printPage, printButton, css] = await Promise.all([read("../app/resources/printables/[slug]/page.tsx"), read("../app/components/PrintButton.tsx"), read("../app/globals.css")]);
  assert.match(printPage, /aria-hidden="true"/);
  assert.match(printButton, /window\.print/);
  assert.match(css, /@media print/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /prefers-reduced-motion/);
});

test("front-end audit checks serious quality regressions", async () => {
  const audit = await read("../scripts/frontend-audit.mjs");
  for (const check of ["Placeholder copy", "H1 elements", "image without alt text", "Unsupported ZIP page is indexable", "Client component count", "Oversized image"]) assert.match(audit, new RegExp(check));
  assert.match(audit, /process\.exitCode = 1/);
});

test("Phase 3 ZIP pages include practical local authority content", async () => {
  const [results, localResources, styles] = await Promise.all([read("../app/components/LookupResults.tsx"), read("../app/data/local-resources.ts"), read("../app/globals.css")]);
  for (const section of ["Recently moved?", "Things to check during the first week", "Emergency information", "Moving to this ZIP code"]) assert.match(results, new RegExp(section.replace("?", "\\?")));
  for (const action of ["Change your mailing address", "Update your license or vehicle record", "Register or update your voter record", "Check flood risk", "Prepare for Florida hazards"]) assert.match(localResources, new RegExp(action));
  for (const county of ["Seminole", "Orange", "Volusia", "Lake", "Osceola"]) assert.match(localResources, new RegExp(`${county}:`));
  assert.equal((localResources.match(/^\s+"\d{5}":/gm) ?? []).length, 50);
  assert.match(results, /provider\.serviceNotes/);
  assert.match(results, /Official source/);
  assert.match(styles, /\.local-resource-grid/);
  assert.match(styles, /\.emergency-grid/);
});

test("GA4 loads once from the root and manually measures App Router page views", async () => {
  const [layout, component, analytics, environment, declarations] = await Promise.all([read("../app/layout.tsx"), read("../app/components/GoogleAnalytics.tsx"), read("../app/lib/analytics.ts"), read("../.env.example"), read("../types/gtag.d.ts")]);
  assert.match(layout, /<GoogleAnalytics/);
  assert.equal((layout.match(/<GoogleAnalytics/g) ?? []).length, 1);
  assert.match(layout, /NEXT_PUBLIC_GA_MEASUREMENT_ID/);
  assert.match(component, /usePathname/);
  assert.match(component, /send_page_view: false/);
  assert.match(component, /strategy="afterInteractive"/);
  assert.match(component, /process\.env\.NODE_ENV === "test"/);
  assert.match(component, /doNotTrack/);
  assert.match(analytics, /"page_view"/);
  for (const eventName of [
    "zip_lookup_submit",
    "zip_lookup_success",
    "zip_lookup_partial",
    "zip_lookup_unsupported",
    "zip_coverage_request",
    "provider_official_link_click",
    "provider_phone_click",
    "provider_start_service_click",
    "provider_address_check_click",
    "outage_phone_click",
    "outage_map_click",
    "guide_link_click",
    "guide_to_zip_lookup",
    "county_page_navigation",
    "correction_form_success",
    "printable_resource_click",
  ]) assert.match(analytics, new RegExp(`${eventName}:`));
  assert.match(analytics, /blockedKeys/);
  assert.match(declarations, /gtag\?: GtagFunction/);
  assert.match(environment, /G-QC9FYWHVZZ/);
});

test("county hubs and demand-driven ZIP requests form a crawl-safe content network", async () => {
  const [countyPage, floridaPage, countyData, requestPage, requestForm, lookup, sitemap] = await Promise.all([
    read("../app/components/CountyUtilitiesPage.tsx"),
    read("../app/florida-utilities/page.tsx"),
    read("../app/data/counties.ts"),
    read("../app/request-zip/page.tsx"),
    read("../app/components/ZipRequestForm.tsx"),
    read("../app/lookup/[zip]/page.tsx"),
    read("../app/sitemap.ts"),
  ]);
  for (const county of ["Orange", "Seminole", "Lake", "Volusia", "Osceola"]) assert.match(countyData, new RegExp(`name: "${county}"`));
  for (const requirement of ["CollectionPage", "FAQPage", "BreadcrumbList", "RelatedGuides", "LocalResourceCards"]) assert.match(countyPage, new RegExp(requirement));
  assert.match(floridaPage, /countyProfiles\.map/);
  assert.match(requestPage, /noindex: true/);
  assert.match(requestForm, /zip_coverage_request/);
  assert.match(requestForm, /requested_zip/);
  assert.match(lookup, /Request this ZIP/);
  assert.doesNotMatch(sitemap, /request-zip/);
});

test("Phase 2 coverage and health reporting preserve the indexability gate", async () => {
  const [coverage, health, pkg] = await Promise.all([read("../app/coverage/page.tsx"), read("../scripts/production-health-report.mjs"), read("../package.json")]);
  assert.match(coverage, /verified and indexable/);
  assert.match(coverage, /pending research/);
  assert.match(coverage, /excluded from the XML sitemap/);
  assert.match(health, /GA4 root installation and manual page-view control/);
  assert.match(health, /Production build/);
  assert.equal(JSON.parse(pkg).scripts["health:report"], "node scripts/production-health-report.mjs");
});
