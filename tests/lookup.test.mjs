import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test, { after } from "node:test";

const root = new URL("..", import.meta.url).pathname;
const temporaryDirectory = await mkdtemp(join(tmpdir(), "movein-lookup-"));
process.env.DATABASE_PATH = join(temporaryDirectory, "movein.sqlite");
for (const script of ["scripts/db-migrate.mjs", "scripts/import-florida-data.mjs"]) {
  const result = spawnSync(process.execPath, [script], { cwd: root, env: process.env, encoding: "utf8" });
  assert.equal(result.status, 0, `${script} failed: ${result.stderr}`);
}
const { getLookupResult, isValidZip } = await import("../db/lookup.ts");
const { GET } = await import("../app/api/lookup/route.ts");
const { POST } = await import("../app/api/corrections/route.ts");
const { getDatabase } = await import("../db/index.ts");
const { validateCorrection } = await import("../app/lib/corrections.ts");
const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

after(async () => {
  if (globalThis.moveInDatabase?.open) globalThis.moveInDatabase.close();
  globalThis.moveInDatabase = undefined;
  delete process.env.DATABASE_PATH;
  await rm(temporaryDirectory, { recursive: true, force: true });
});

test("accepts exactly five numeric digits", () => {
  assert.equal(isValidZip("32771"), true);
  for (const value of ["3277", "327711", "32A71", " 32771 ", ""]) assert.equal(isValidZip(value), false);
});

test("returns grouped verified results with multiple possible electric and water providers", () => {
  const database = getDatabase();
  const categoryId = database.prepare("SELECT id FROM provider_categories WHERE slug='electricity'").get().id;
  const stateId = database.prepare("SELECT id FROM states WHERE code='FL'").get().id;
  const zipId = database.prepare("SELECT id FROM zip_codes WHERE zip_code='34741'").get().id;
  const inserted = database.prepare(`INSERT INTO providers (name, slug, category_id, state_id, official_website, status, is_verified, last_verified_at)
    VALUES ('Test Alternate Electric', 'test-alternate-electric', ?, ?, 'https://example.gov/electric', 'verified', 1, '2026-07-27')`).run(categoryId, stateId);
  database.prepare(`INSERT INTO service_areas (provider_id, zip_code_id, coverage_type, coverage_notes, confidence_level)
    VALUES (?, ?, 'possible', 'Test fixture used only in the temporary database.', 'high')`).run(inserted.lastInsertRowid, zipId);
  database.prepare(`INSERT INTO data_sources (provider_id, source_name, source_url, source_type, retrieved_at)
    VALUES (?, 'Test source', 'https://example.gov/electric', 'test', '2026-07-27')`).run(inserted.lastInsertRowid);
  const waterCategoryId = database.prepare("SELECT id FROM provider_categories WHERE slug='water'").get().id;
  const alternateWater = database.prepare(`INSERT INTO providers (name, slug, category_id, state_id, official_website, status, is_verified, last_verified_at, provider_type)
    VALUES ('Test Alternate Water', 'test-alternate-water', ?, ?, 'https://example.gov/water', 'verified', 1, '2026-07-27', 'municipal')`).run(waterCategoryId, stateId);
  database.prepare(`INSERT INTO service_areas (provider_id, zip_code_id, coverage_type, coverage_notes, confidence_level, service_availability, requires_address_confirmation, jurisdiction_notes)
    VALUES (?, ?, 'possible', 'Test fixture used only in the temporary database.', 'high', 'multiple_possible', 1, 'Confirm by address.')`).run(alternateWater.lastInsertRowid, zipId);
  database.prepare(`INSERT INTO data_sources (provider_id, source_name, source_url, source_type, retrieved_at)
    VALUES (?, 'Test water source', 'https://example.gov/water', 'test', '2026-07-27')`).run(alternateWater.lastInsertRowid);
  const result = getLookupResult("34741");
  assert.equal(result?.city, "Kissimmee");
  assert.equal(result?.county, "Osceola");
  assert.equal(result?.status, "verified");
  assert.equal(result?.isIndexable, true);
  assert.ok(result.providers.electricity.length >= 2);
  assert.ok(result.providers.water.length >= 2);
  assert.ok(result.providers.sewer.length >= 1);
  assert.ok(Object.values(result.providers).flat().length >= 5);
  assert.equal(result.providers.electricity[0].coverageLabel, "Possible provider");
});

test("returns verified core data with address-level internet providers", () => {
  const result = getLookupResult("32771");
  assert.equal(result?.status, "verified");
  assert.equal(result?.isIndexable, true);
  assert.ok(result.providers.water.length > 0);
  assert.equal(result.providers["natural-gas"], undefined);
  const internetProviders = result.providers.internet.filter((provider) => provider.providerType !== "official_lookup");
  assert.equal(internetProviders.length, 4);
  for (const provider of internetProviders) {
    assert.match(provider.addressCheckUrl, /^https:/);
    assert.match(provider.supportUrl, /^https:/);
    assert.ok(provider.technologyType);
    assert.equal(provider.requiresAddressConfirmation, true);
  }
  assert.match(result.disclaimer, /exact street address/i);
});

test("returns null for an unknown ZIP", () => {
  assert.equal(getLookupResult("99999"), null);
});

test("returns a known empty ZIP as pending and never indexable", () => {
  const database = getDatabase();
  const stateId = database.prepare("SELECT id FROM states WHERE code='FL'").get().id;
  const countyId = database.prepare("SELECT id FROM counties WHERE state_id=? AND name='Seminole'").get(stateId).id;
  const cityId = database.prepare("SELECT id FROM cities WHERE state_id=? AND name='Sanford'").get(stateId).id;
  database.prepare(`INSERT INTO zip_codes (zip_code, state_id, county_id, primary_city_id, status, confidence_status, is_active, is_indexable, last_verified_at, jurisdiction_notes)
    VALUES ('32772', ?, ?, ?, 'pending', 'pending', 1, 0, '2026-07-28', 'Research fixture only.')`).run(stateId, countyId, cityId);
  const result = getLookupResult("32772");
  assert.equal(result?.status, "pending");
  assert.equal(result?.isIndexable, false);
  assert.equal(Object.values(result.providers).flat().length, 0);
});

test("seeded expansion ZIPs stay noindex while exposing safe starting points", () => {
  const result = getLookupResult("32701");
  assert.ok(result);
  assert.equal(result.isIndexable, false);
  assert.equal(result.status, "partial");
  assert.equal(result.providers.electricity, undefined);
  assert.equal(result.providers.water, undefined);
  assert.equal(result.providers.internet[0].providerType, "official_lookup");
  assert.equal(result.providers["local-government"][0].name, "Seminole County Government");
});

test("the reviewed pilot promotes exactly 29 ZIPs only after core coverage is present", () => {
  const database = getDatabase();
  const verified = database.prepare("SELECT zip_code FROM zip_codes WHERE status='verified' AND is_indexable=1 ORDER BY zip_code").all();
  assert.equal(verified.length, 29);
  for (const zipCode of ["32117", "32724", "32726", "32773", "32803", "32809", "34715", "34743", "34771", "34772", "34788"]) {
    const result = getLookupResult(zipCode);
    assert.equal(result?.status, "verified", zipCode);
    assert.equal(result?.isIndexable, true, zipCode);
    for (const category of ["electricity", "water", "sewer", "internet", "trash-recycling", "local-government"]) assert.ok(result?.providers[category]?.length, `${zipCode} missing ${category}`);
  }
});

test("formats phone links and exposes official source URLs", () => {
  const provider = getLookupResult("32801").providers.electricity[0];
  assert.match(provider.contacts[0].phone, /^\(\d{3}\) \d{3}-\d{4}$/);
  assert.match(provider.contacts[0].phoneHref, /^tel:\d{10}$/);
  assert.match(provider.officialWebsite, /^https:\/\//);
  assert.match(provider.sources[0].url, /^https:\/\//);
});

test("API controls invalid, unknown, and successful responses", async () => {
  const invalid = await GET(new Request("http://localhost/api/lookup?zip=abc"));
  assert.equal(invalid.status, 400);
  assert.deepEqual(await invalid.json(), { error: "Enter a valid five-digit ZIP code." });
  const unknown = await GET(new Request("http://localhost/api/lookup?zip=99999"));
  assert.equal(unknown.status, 404);
  const valid = await GET(new Request("http://localhost/api/lookup?zip=32720"));
  assert.equal(valid.status, 200);
  const payload = await valid.json();
  assert.equal(payload.status, "verified");
  assert.equal("naturalGas" in payload.providers, false);
  assert.ok(Array.isArray(payload.providers.internet));
  assert.ok(Array.isArray(payload.providers.trashRecycling));
  assert.equal("isIndexable" in payload, false);
  assert.match(valid.headers.get("cache-control"), /s-maxage/);
});

test("correction validation and API return controlled responses", async () => {
  assert.ok(validateCorrection({ zipCode: "bad" }).errors.zipCode);
  const invalid = await POST(new Request("http://localhost/api/corrections", { method: "POST", headers: { "content-type": "application/json", "x-real-ip": "198.51.100.5" }, body: JSON.stringify({}) }));
  assert.equal(invalid.status, 400);
  const validBody = { zipCode: "32771", issueType: "incorrect-phone", category: "water", providerName: "City water record", details: "The official contact page has a newer phone number.", sourceUrl: "https://sanfordfl.gov/", replyEmail: "", website: "", startedAt: Date.now() - 2000 };
  const valid = await POST(new Request("http://localhost/api/corrections", { method: "POST", headers: { "content-type": "application/json", "x-real-ip": "198.51.100.6" }, body: JSON.stringify(validBody) }));
  assert.equal(valid.status, 201);
  assert.equal((await valid.json()).ok, true);
  assert.equal(getDatabase().prepare("SELECT COUNT(*) AS count FROM correction_submissions WHERE zip_code='32771'").get().count, 1);
  assert.equal(getDatabase().prepare("SELECT issue_kind FROM correction_submissions WHERE zip_code='32771'").get().issue_kind, "incorrect-phone");
});

test("CSV validation catches no errors in the pilot dataset", () => {
  const result = spawnSync(process.execPath, ["scripts/validate-provider-data.mjs"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Validated 50 ZIPs/);
});

test("data operations support duplicate checks, a research queue, and a non-writing import preview", () => {
  for (const [script, expected] of [
    ["scripts/report-duplicates.mjs", /No duplicates across 50 ZIPs/],
    ["scripts/generate-research-queue.mjs", /Wrote \d+ research tasks/],
  ]) {
    const result = spawnSync(process.execPath, [script], { cwd: root, env: { ...process.env, RESEARCH_QUEUE_PATH: join(temporaryDirectory, "research-queue.csv"), RESEARCH_SUMMARY_PATH: join(temporaryDirectory, "research-summary.md") }, encoding: "utf8" });
    assert.equal(result.status, 0, `${script} failed: ${result.stderr}`);
    assert.match(result.stdout, expected);
  }
  const before = getDatabase().prepare("SELECT COUNT(*) AS count FROM providers").get().count;
  const dryRun = spawnSync(process.execPath, ["scripts/import-florida-data.mjs", "--dry-run", "--confirm-verified"], { cwd: root, env: process.env, encoding: "utf8" });
  assert.equal(dryRun.status, 0, dryRun.stderr);
  assert.match(dryRun.stdout, /Dry run: 50 ZIPs, 55 providers/);
  assert.equal(getDatabase().prepare("SELECT COUNT(*) AS count FROM providers").get().count, before);
});

test("homepage makes accessible ZIP lookups the primary and closing actions", async () => {
  const [page, form] = await Promise.all([read("../app/page.tsx"), read("../app/components/ZipLookupForm.tsx")]);
  assert.match(page, /You have the keys/);
  assert.match(page, /context="homepage_hero"/);
  assert.match(page, /context="homepage_footer"/);
  assert.match(form, /onSubmit=\{submit\}/);
  assert.match(form, /onKeyDown=\{submitWithEnter\}/);
  assert.match(form, /requestSubmit\(\)/);
  assert.match(form, /inputMode="numeric"/);
  assert.match(form, /enterKeyHint="search"/);
  assert.match(form, /aria-live="polite"/);
  assert.doesNotMatch(`${page}${form}`, /newsletter|Start My Timeline|branded-hero/i);
});

test("navigation excludes retired timeline, checklist, and Florida Guide items", async () => {
  const data = await read("../app/data/site.ts");
  const navigation = data.slice(0, data.indexOf("] as const;") + 11);
  for (const route of ["/homeowners", "/renters", "/learn-your-area", "/resources", "/coverage"]) assert.match(navigation, new RegExp(route));
  assert.doesNotMatch(navigation, /timeline|checklists|Florida Guide/i);
});

test("FAQ content is visible and its schema mirrors the same data", async () => {
  const [page, data] = await Promise.all([read("../app/faq/page.tsx"), read("../app/data/site.ts")]);
  assert.match(page, /FAQPage/);
  assert.match(page, /faqItems\.map/);
  assert.match(data, /Why can more than one provider serve one ZIP code/);
});

test("SEO includes only ZIP pages that pass the shared database quality gate", async () => {
  const [sitemap, data, lookupPage] = await Promise.all([read("../app/sitemap.ts"), read("../app/data/site.ts"), read("../app/lookup/[zip]/page.tsx")]);
  assert.match(data, /indexablePilotZips = \["32114", "32117", "32118"/);
  assert.match(sitemap, /getIndexableZipResults\(\)\.map/);
  assert.match(lookupPage, /isZipResultIndexable\(result\)/);
  assert.match(lookupPage, /if \(!result\) return <UnsupportedZip/);
  assert.match(lookupPage, /noindex: true/);
  assert.doesNotMatch(sitemap, /welcome\//);
});

test("dynamic ZIP routing is database-backed and query URLs become clean canonicals", async () => {
  const proxy = await read("../proxy.ts");
  const seo = await read("../app/lib/seo.ts");
  assert.doesNotMatch(proxy, /supportedPilotZips/);
  assert.match(proxy, /NextResponse\.redirect\(cleanUrl, 308\)/);
  assert.match(seo, /getActiveZipCodes\(\)/);
});

test("mobile layout and accessible focus treatment are preserved", async () => {
  const css = await read("../app/globals.css");
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.zip-controls \{ grid-template-columns: 1fr; \}/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});

test("results show every service category and an explicit missing-data state", async () => {
  const results = await read("../app/components/LookupResults.tsx");
  assert.match(results, /We are still verifying this service for your ZIP code/);
  for (const category of ["electricity", "water", "sewer", "internet", "trash-recycling", "local-government"]) assert.match(results, new RegExp(category));
  assert.doesNotMatch(results, /natural-gas|Natural gas/i);
  assert.match(results, /Report incorrect information/);
  assert.match(results, /Check availability at your address/);
  assert.match(results, /Availability and speeds vary by exact street address/);
  assert.match(results, /Internet availability depends on your exact address/);
  assert.match(results, /Provider support/);
  assert.match(results, /Trash service may be arranged by your city, county, HOA, landlord, or private hauler/);
  assert.match(results, /View outage map/);
  assert.match(results, /Verified \{formatDate\(provider\.lastVerifiedAt\)\}/);
});

test("electric records expose start service, outage contacts, and outage maps", () => {
  const providers = getLookupResult("32703").providers.electricity;
  const duke = providers.find((provider) => provider.slug === "duke-electric");
  assert.ok(duke);
  assert.match(duke.startServiceUrl, /^https:/);
  assert.match(duke.outageMapUrl, /^https:/);
  assert.ok(duke.contacts.some((contact) => contact.type === "outage" && contact.phoneHref.startsWith("tel:")));
});

test("research automation preserves address-level gaps and link checker has GET fallback", async () => {
  const queuePath = join(temporaryDirectory, "queue-expanded.csv");
  const queue = spawnSync(process.execPath, ["scripts/generate-research-queue.mjs"], { cwd: root, env: { ...process.env, RESEARCH_QUEUE_PATH: queuePath, RESEARCH_SUMMARY_PATH: join(temporaryDirectory, "queue.md") }, encoding: "utf8" });
  assert.equal(queue.status, 0, queue.stderr);
  const queueText = await readFile(queuePath, "utf8");
  assert.match(queueText, /sources_reviewed,next_recommended_action/);
  assert.match(queueText, /Review official provider address checkers/);
  assert.doesNotMatch(queueText, /natural-gas|Natural gas/i);
  const checker = await read("../scripts/check-provider-links.mjs");
  assert.match(checker, /HEAD returned \$\{head\.status\}; GET fallback used/);
  assert.match(checker, /head-blocked-get-reachable/);
});

test("corrections use a validated form with loading and duplicate-submit protection", async () => {
  const [page, form, route] = await Promise.all([read("../app/corrections/page.tsx"), read("../app/components/CorrectionForm.tsx"), read("../app/api/corrections/route.ts")]);
  assert.match(page, /noindex: true/);
  assert.match(form, /if \(pending\) return/);
  assert.match(form, /Submitting…/);
  assert.match(form, /aria-live="polite"/);
  assert.match(route, /workflow_status/);
  assert.match(form, /correctionIssueTypes/);
});

test("homepage hero uses an optimized meaningful Next image without layout shift", async () => {
  const page = await read("../app/page.tsx");
  assert.match(page, /from "next\/image"/);
  assert.match(page, /width=\{1600\}/);
  assert.match(page, /height=\{880\}/);
  assert.match(page, /sizes="\(max-width: 760px\) 100vw, 48vw"/);
  assert.match(page, /priority/);
  assert.match(page, /alt="A bright home entryway/);
});

test("standard Node scripts and dependencies have no Cloudflare coupling", async () => {
  const [pkg, lock] = await Promise.all([read("../package.json"), read("../package-lock.json")]);
  const parsed = JSON.parse(pkg);
  assert.equal(parsed.scripts.dev, "next dev");
  assert.equal(parsed.scripts.build, "next build");
  assert.equal(parsed.scripts.start, "next start");
  assert.equal(parsed.engines.node, ">=22.13.0");
  assert.doesNotMatch(`${pkg}${lock}`, /cloudflare:|wrangler|vinext|@cloudflare/i);
});

test("retired natural gas is absent from public application code and active providers", async () => {
  const files = ["../app/components/LookupResults.tsx", "../app/api/lookup/route.ts", "../app/data/site.ts", "../app/data/guides.ts", "../app/learn-your-area/page.tsx"];
  const publicSource = (await Promise.all(files.map(read))).join("\n");
  assert.doesNotMatch(publicSource, /natural gas|natural-gas/i);
  const activeGas = getDatabase().prepare(`SELECT COUNT(*) count FROM providers p JOIN provider_categories pc ON pc.id=p.category_id WHERE pc.slug='natural-gas' AND p.status!='inactive'`).get().count;
  assert.equal(activeGas, 0);
});
