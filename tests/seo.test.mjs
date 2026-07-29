import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { guides } from "../app/data/guides.ts";
import { publicPages } from "../app/data/pages.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("public page metadata and H1s are unique", () => {
  for (const field of ["path", "title", "description", "h1"]) assert.equal(new Set(publicPages.map((page) => page[field].toLowerCase())).size, publicPages.length, `${field} values must be unique`);
});

test("guides are substantive, dated, linked, and source-aware", () => {
  const paths = new Set(guides.map((guide) => guide.path));
  assert.ok(guides.length >= 15);
  for (const guide of guides) {
    assert.ok(guide.published && guide.reviewed);
    assert.ok(guide.directAnswer.length >= 100);
    assert.ok(guide.sections.length >= 3);
    assert.ok(guide.related.length >= 2);
    for (const related of guide.related) assert.ok(paths.has(related), `${guide.path} missing ${related}`);
  }
});

test("metadata, canonicals, social cards, and noindex rules share one architecture", async () => {
  const [metadata, layout, lookup, corrections] = await Promise.all([read("../app/lib/metadata.ts"), read("../app/layout.tsx"), read("../app/lookup/[zip]/page.tsx"), read("../app/corrections/page.tsx")]);
  assert.match(metadata, /alternates: \{ canonical \}/);
  assert.match(metadata, /\/og\?title=/);
  assert.match(layout, /movein-og-2026\.png/);
  assert.match(lookup, /isZipResultIndexable/);
  assert.match(corrections, /noindex: true/);
});

test("schema and sitemap implementations use visible source data", async () => {
  const [breadcrumbs, guide, faq, zip, sitemap, htmlMap] = await Promise.all([read("../app/components/PageHero.tsx"), read("../app/components/GuideArticle.tsx"), read("../app/faq/page.tsx"), read("../app/components/LookupResults.tsx"), read("../app/sitemap.ts"), read("../app/site-map/page.tsx")]);
  assert.match(breadcrumbs, /BreadcrumbList/);
  assert.match(guide, /"Article"/);
  assert.match(faq, /faqItems\.map/);
  assert.match(zip, /buildLocalFaq/);
  assert.match(sitemap, /getIndexableZipResults/);
  assert.match(htmlMap, /getIndexableZipResults/);
});

test("campaign and broad location templates are not indexable copies", async () => {
  const [config, pages] = await Promise.all([read("../next.config.ts"), read("../app/data/pages.ts")]);
  assert.match(config, /\/welcome\/:path\*/);
  assert.doesNotMatch(pages, /\/welcome\/|\/florida\/|\/county\/|\/city\//);
});

test("privacy-safe analytics never sends form or ZIP values", async () => {
  const analytics = await read("../app/lib/analytics.ts");
  assert.match(analytics, /movein:analytics/);
  assert.doesNotMatch(analytics, /fetch\(|XMLHttpRequest/);
  assert.match(analytics, /context\?: \{ category\?: string \}/);
  assert.doesNotMatch(analytics, /context\?: \{[^}]*email|context\?: \{[^}]*street|context\?: \{[^}]*zip/i);
});
