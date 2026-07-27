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

test("returns grouped verified results with multiple possible providers", () => {
  const result = getLookupResult("34741");
  assert.equal(result?.city, "Kissimmee");
  assert.equal(result?.county, "Osceola");
  assert.equal(result?.status, "verified");
  assert.equal(result?.isIndexable, true);
  assert.ok(result.providers.electricity.length >= 1);
  assert.ok(result.providers.water.length >= 1);
  assert.ok(result.providers.sewer.length >= 1);
  assert.ok(Object.values(result.providers).flat().length >= 5);
  assert.equal(result.providers.electricity[0].coverageLabel, "Possible provider");
});

test("returns partial data without fabricated fallback categories", () => {
  const result = getLookupResult("32771");
  assert.equal(result?.status, "partial");
  assert.equal(result?.isIndexable, false);
  assert.ok(result.providers.water.length > 0);
  assert.equal(result.providers["natural-gas"], undefined);
  assert.match(result.disclaimer, /possible providers/i);
});

test("returns null for an unknown ZIP", () => {
  assert.equal(getLookupResult("99999"), null);
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
  assert.equal((await valid.json()).status, "partial");
  assert.match(valid.headers.get("cache-control"), /s-maxage/);
});

test("CSV validation catches no errors in the pilot dataset", () => {
  const result = spawnSync(process.execPath, ["scripts/validate-provider-data.mjs"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Validated 5 ZIPs/);
});

test("homepage makes one accessible ZIP lookup the primary action", async () => {
  const [page, form] = await Promise.all([read("../app/page.tsx"), read("../app/components/ZipLookupForm.tsx")]);
  assert.match(page, /Find the services for your new place/);
  assert.match(page, /<ZipLookupForm/);
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
  for (const route of ["/homeowners", "/renters", "/learn-your-area", "/resources", "/faq"]) assert.match(navigation, new RegExp(route));
  assert.doesNotMatch(navigation, /timeline|checklists|Florida Guide/i);
});

test("FAQ content is visible and its schema mirrors the same data", async () => {
  const [page, data] = await Promise.all([read("../app/faq/page.tsx"), read("../app/data/site.ts")]);
  assert.match(page, /FAQPage/);
  assert.match(page, /faqItems\.map/);
  assert.match(data, /Can more than one utility serve the same ZIP code/);
});

test("SEO includes only approved verified ZIP pages", async () => {
  const [sitemap, data, lookupPage] = await Promise.all([read("../app/sitemap.ts"), read("../app/data/site.ts"), read("../app/lookup/[zip]/page.tsx")]);
  assert.match(data, /indexablePilotZips = \["32801", "34741"\]/);
  assert.match(sitemap, /indexablePilotZips\.map/);
  assert.match(lookupPage, /noindex: !result\.isIndexable \|\| result\.status !== "verified"/);
  assert.match(lookupPage, /if \(!result\) notFound\(\)/);
  assert.doesNotMatch(sitemap, /32771|32720|34748|welcome\//);
});

test("unsupported dynamic ZIP routes are rewritten with a real 404", async () => {
  const proxy = await read("../proxy.ts");
  assert.match(proxy, /supportedPilotZips/);
  assert.match(proxy, /NextResponse\.rewrite\(notFoundUrl, \{ status: 404 \}\)/);
});

test("mobile layout and accessible focus treatment are preserved", async () => {
  const css = await read("../app/globals.css");
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.zip-controls \{ grid-template-columns: 1fr; \}/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
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
