import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { guides } from "../app/data/guides.ts";
import { publicPages } from "../app/data/pages.ts";
import { canonicalUrl, SITE_URL } from "../app/lib/metadata.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("public page metadata and H1s are unique", () => {
  for (const field of ["path", "title", "description", "h1"]) assert.equal(new Set(publicPages.map((page) => page[field].toLowerCase())).size, publicPages.length, `${field} values must be unique`);
});

test("guides are substantive, dated, linked, and source-aware", () => {
  const paths = new Set(publicPages.map((page) => page.path));
  assert.ok(guides.length >= 15);
  for (const guide of guides) {
    assert.ok(guide.published && guide.reviewed);
    assert.ok(guide.directAnswer.length >= 100);
    assert.ok(guide.sections.length >= 2);
    assert.ok(guide.related.length >= 2);
    for (const related of guide.related) assert.ok(paths.has(related), `${guide.path} missing ${related}`);
  }
  for (const path of ["/resources/utilities-before-move-in-day", "/resources/moving-utility-checklist", "/resources/homeowner-first-week-checklist", "/resources/renter-first-week-checklist"]) {
    const guide = guides.find((item) => item.path === path);
    assert.ok(guide?.faqs && guide.faqs.length >= 3, `${path} needs substantive FAQs`);
  }
});

test("Search Console opportunity pages own distinct intents and remain substantive", () => {
  const byPath = new Map(guides.map((guide) => [guide.path, guide]));
  const internet = byPath.get("/resources/find-internet-providers");
  const renter = byPath.get("/renters/renters-insurance-and-deposits");
  assert.ok(internet?.sections.length >= 7);
  assert.ok(internet?.faqs?.length >= 5);
  assert.match(internet?.image?.src ?? "", /internet-move-setup\.webp/);
  assert.ok(renter?.sections.length >= 6);
  assert.ok(renter?.faqs?.length >= 4);
  assert.match(renter?.image?.src ?? "", /renter-move-in-records\.webp/);
  for (const path of ["/resources/check-internet-availability", "/resources/fiber-internet-availability", "/resources/transfer-internet-when-moving", "/renters/move-in-costs", "/renters/what-utilities-do-renters-pay", "/renters/what-to-photograph-before-moving-in", "/renters/questions-before-signing-a-lease"]) assert.ok(byPath.has(path), `${path} is missing`);
  assert.equal(byPath.has("/resources/find-isp-by-address"), false, "overlapping ISP page should not be created");
});

test("renter growth pages have distinct tools, safe analytics, and legacy redirects", async () => {
  const [hub, calculator, kit, printables, analytics, redirects] = await Promise.all([read("../app/renters/page.tsx"), read("../app/components/MoveInCostCalculator.tsx"), read("../app/renters/free-move-in-kit/page.tsx"), read("../app/data/printables.ts"), read("../app/lib/analytics.ts"), read("../next.config.ts")]);
  for (const phrase of ["Six practical steps", "Free renter tools", "Questions before signing"]) assert.match(hub, new RegExp(phrase));
  for (const field of ["monthlyRent", "securityDeposit", "utilityDeposits", "internetSetup", "movingCosts", "petCosts", "insurance"]) assert.match(calculator, new RegExp(field));
  assert.doesNotMatch(calculator, /localStorage|fetch\(/);
  assert.match(kit, /Free · Private · Ungated/);
  for (const slug of ["renter-move-in-expense-planner", "renter-move-in-condition-checklist"]) assert.match(printables, new RegExp(slug));
  for (const event of ["renter_hub_view", "move_in_calculator_started", "move_in_calculator_completed", "renter_condition_checklist_print", "renter_expense_planner_print", "free_renter_kit_view", "renter_add_to_my_move"]) assert.match(analytics, new RegExp(`${event}:`));
  assert.match(redirects, /renters\/renter-move-in-costs.*renters\/move-in-costs/s);
  assert.match(redirects, /renters\/utility-responsibilities.*renters\/what-utilities-do-renters-pay/s);
});

test("metadata, canonicals, social cards, and noindex rules share one architecture", async () => {
  const [metadata, layout, lookup, corrections] = await Promise.all([read("../app/lib/metadata.ts"), read("../app/layout.tsx"), read("../app/lookup/[zip]/page.tsx"), read("../app/corrections/page.tsx")]);
  assert.match(metadata, /alternates: \{ canonical \}/);
  assert.match(metadata, /\/og\?title=/);
  assert.match(layout, /movein-og-2026-v2\.png/);
  assert.match(lookup, /isZipResultIndexable/);
  assert.match(corrections, /noindex: true/);
});

test("canonical URL generation always consolidates on the secure non-www host", () => {
  assert.equal(SITE_URL, "https://movein.guide");
  assert.equal(canonicalUrl("/lookup/32720?source=test"), "https://movein.guide/lookup/32720?source=test");
  assert.equal(canonicalUrl("http://www.movein.guide/lookup/32720?source=test"), "https://movein.guide/lookup/32720?source=test");
});

test("schema and sitemap implementations use visible source data", async () => {
  const [breadcrumbs, guide, faq, zip, zipPage, home, resources, sitemap, htmlMap] = await Promise.all([read("../app/components/PageHero.tsx"), read("../app/components/GuideArticle.tsx"), read("../app/faq/page.tsx"), read("../app/components/LookupResults.tsx"), read("../app/lookup/[zip]/page.tsx"), read("../app/page.tsx"), read("../app/resources/page.tsx"), read("../app/sitemap.ts"), read("../app/site-map/page.tsx")]);
  assert.match(breadcrumbs, /BreadcrumbList/);
  assert.match(guide, /"Article"/);
  assert.match(guide, /"FAQPage"/);
  assert.match(guide, /"BreadcrumbList"/);
  assert.match(faq, /faqItems\.map/);
  assert.match(zip, /buildLocalFaq/);
  assert.match(zipPage, /"@type": "WebPage"/);
  assert.doesNotMatch(zipPage, /"@type": "Service"/);
  assert.match(home, /SearchAction/);
  assert.match(resources, /CollectionPage/);
  assert.match(sitemap, /getIndexableZipResults/);
  assert.match(htmlMap, /getIndexableZipResults/);
});

test("the utility setup hub and guide-to-lookup journey are crawlable and measurable", async () => {
  const [hub, article, form, analytics] = await Promise.all([read("../app/resources/utility-setup/page.tsx"), read("../app/components/GuideArticle.tsx"), read("../app/components/ZipLookupForm.tsx"), read("../app/lib/analytics.ts")]);
  assert.match(hub, /CollectionPage/);
  assert.match(hub, /BreadcrumbList/);
  assert.match(article, /Open the complete utility setup hub/);
  assert.match(form, /guide_to_zip_lookup/);
  assert.match(analytics, /guide_to_zip_lookup: \{ guide_slug: string; source_page: string \}/);
});

test("campaign and broad location templates are not indexable copies", async () => {
  const [config, pages] = await Promise.all([read("../next.config.ts"), read("../app/data/pages.ts")]);
  assert.match(config, /\/welcome\/:path\*/);
  assert.doesNotMatch(pages, /\/welcome\/|\/florida\/|\/county\/|\/city\//);
});

test("www traffic has an application fallback while Nginx remains the primary redirect", async () => {
  const [proxy, config] = await Promise.all([read("../proxy.ts"), read("../next.config.ts")]);
  assert.match(proxy, /host === "www\.movein\.guide"/);
  assert.match(proxy, /canonicalUrl\.hostname = "movein\.guide"/);
  assert.match(config, /florida-utilities/);
});

test("privacy-safe analytics sends a ZIP only for an explicit coverage request", async () => {
  const [analytics, requestForm, privacy] = await Promise.all([read("../app/lib/analytics.ts"), read("../app/components/ZipRequestForm.tsx"), read("../app/privacy/page.tsx")]);
  assert.match(analytics, /movein:analytics/);
  assert.doesNotMatch(analytics, /fetch\(|XMLHttpRequest/);
  assert.match(analytics, /AnalyticsEventParameters/);
  assert.match(analytics, /blockedKeys/);
  assert.doesNotMatch(analytics, /zip_lookup_(?:submit|success|partial|unsupported): \{[^}]*zip/i);
  assert.match(analytics, /zip_coverage_request: \{ requested_zip: string/);
  assert.match(requestForm, /if \(!\/\^\\d\{5\}\$\//);
  assert.match(requestForm, /response\.status !== 404/);
  assert.match(privacy, /only ZIP-specific custom event is an explicit unsupported-coverage request/);
});

test("county and statewide hubs have unique indexable metadata and structured content", async () => {
  const [countyComponent, florida, pages, counties] = await Promise.all([read("../app/components/CountyUtilitiesPage.tsx"), read("../app/florida-utilities/page.tsx"), read("../app/data/pages.ts"), read("../app/data/counties.ts")]);
  for (const slug of ["orange-county-utilities", "seminole-county-utilities", "lake-county-utilities", "volusia-county-utilities", "osceola-county-utilities"]) assert.match(counties, new RegExp(slug));
  assert.match(pages, /florida-utilities/);
  assert.match(countyComponent, /hasPart/);
  assert.match(countyComponent, /FAQPage/);
  assert.match(countyComponent, /BreadcrumbList/);
  assert.match(florida, /CollectionPage/);
});
