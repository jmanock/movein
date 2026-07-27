import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { validateNewsletterPayload } from "../app/lib/newsletter.ts";
import { calculateProgress } from "../app/lib/progress.ts";
import { clearCompletion, loadCompletion, saveCompletion, TIMELINE_STORAGE_KEY } from "../app/lib/timelineStorage.ts";
import { guides } from "../app/data/guides.ts";
import { entryCards } from "../app/data/site.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("homepage renders the MoveIn decision path", async () => {
  const [page, homepage] = await Promise.all([read("../app/page.tsx"), read("../app/components/Homepage.tsx")]);
  assert.match(`${page}${homepage}`, /MoveIn/);
  assert.match(homepage, /You have the keys/);
  assert.match(homepage, /Start My Move Timeline/);
  assert.match(homepage, /Explore the Florida Guide/);
  assert.doesNotMatch(page, /Welcome Home Florida/);
  assert.match(homepage, /next\/image/);
  assert.match(homepage, /movein-branded-hero\.webp/);
  assert.match(homepage, /width=\{1200\} height=\{630\}/);
  assert.match(homepage, /preload/);
  assert.match(homepage, /fetchPriority="high"/);
  assert.doesNotMatch(homepage, /className="brand-kicker">MoveIn/);
});

test("pathway cards render mapped, high-contrast icons instead of empty boxes", async () => {
  const [iconComponent, css] = await Promise.all([read("../app/components/Icon.tsx"), read("../app/globals.css")]);
  for (const card of entryCards) assert.match(iconComponent, new RegExp(`\\b${card.icon}\\b`));
  assert.match(css, /\.path-icon[^}]*background:\s*var\(--card-accent\)/s);
  assert.match(css, /\.path-icon[^}]*color:\s*#fff/s);
});

test("primary navigation uses real routes and has an accessible mobile control", async () => {
  const [navigation, chrome] = await Promise.all([read("../app/data/site.ts"), read("../app/components/SiteChrome.tsx")]);
  for (const route of ["/timeline", "/homeowners", "/renters", "/florida", "/checklists", "/resources"]) assert.match(navigation, new RegExp(route.replaceAll("/", "\\/")));
  assert.match(chrome, /aria-expanded=\{menuOpen\}/);
  assert.match(chrome, /aria-controls="primary-navigation"/);
});

test("calculates timeline progress", () => {
  assert.deepEqual(calculateProgress(["a", "b", "c", "d"], { a: true, b: false, c: true }), { completed: 2, total: 4, percentage: 50 });
  assert.deepEqual(calculateProgress([], {}), { completed: 0, total: 0, percentage: 0 });
});

test("persists and resets timeline completion", () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
  saveCompletion(storage, { "24-water": true, "24-panel": false });
  assert.equal(values.has(TIMELINE_STORAGE_KEY), true);
  assert.deepEqual(loadCompletion(storage), { "24-water": true, "24-panel": false });
  clearCompletion(storage);
  assert.deepEqual(loadCompletion(storage), {});
});

test("validates newsletter fields and spam signals", () => {
  const now = 10_000;
  assert.equal(validateNewsletterPayload({ email: "bad", audience: "homeowner", startedAt: 1 }, now).ok, false);
  assert.equal(validateNewsletterPayload({ email: "a@example.com", audience: "invalid", startedAt: 1 }, now).ok, false);
  assert.equal(validateNewsletterPayload({ email: "a@example.com", audience: "renter", startedAt: now - 100 }, now).ok, false);
  const valid = validateNewsletterPayload({ email: " A@Example.com ", audience: "renter", moveMonth: "2026-09", state: " Florida ", startedAt: 1 }, now);
  assert.equal(valid.ok, true);
  assert.equal(valid.ok && valid.email, "a@example.com");
});

test("persists newsletter subscribers with the Node SQLite adapter", async () => {
  const directory = await mkdtemp(join(tmpdir(), "movein-db-"));
  const path = join(directory, "newsletter.sqlite");
  process.env.DATABASE_PATH = path;
  const { getDatabase } = await import(`../db/index.ts?test=${Date.now()}`);
  const database = getDatabase();
  database.prepare("INSERT INTO newsletter_subscribers (email, source, audience) VALUES (?, ?, ?)")
    .run("test@example.com", "test", "homeowner");
  const subscriber = database.prepare("SELECT email, audience FROM newsletter_subscribers WHERE email = ?")
    .get("test@example.com");
  assert.deepEqual(subscriber, { email: "test@example.com", audience: "homeowner" });
  database.close();
  globalThis.moveInDatabase = undefined;
  delete process.env.DATABASE_PATH;
  await rm(directory, { recursive: true, force: true });
});

test("metadata and discovery files use the movein.guide canonical", async () => {
  const [metadata, sitemap, robots, manifest] = await Promise.all([read("../app/lib/metadata.ts"), read("../app/sitemap.ts"), read("../app/robots.ts"), read("../public/manifest.webmanifest")]);
  assert.match(metadata, /https:\/\/movein\.guide/);
  assert.match(sitemap, /SITE_URL/);
  assert.match(robots, /sitemap\.xml/);
  assert.match(manifest, /"name": "MoveIn"/);
  assert.doesNotMatch(`${metadata}${manifest}`, /welcomehomeflorida|welcome-home-florida/i);
});

test("guide metadata titles, descriptions, and canonical paths are unique", () => {
  assert.equal(new Set(guides.map((guide) => guide.title)).size, guides.length);
  assert.equal(new Set(guides.map((guide) => guide.description)).size, guides.length);
  assert.equal(new Set(guides.map((guide) => `/${guide.category}/${guide.slug}`)).size, guides.length);
  for (const guide of guides) {
    assert.ok(guide.steps.length >= 4);
    assert.ok(guide.related.length >= 3);
    assert.ok(guide.description.length >= 80);
  }
});

test("sitemap includes useful guides and excludes campaign and redirect duplicates", async () => {
  const sitemap = await read("../app/sitemap.ts");
  assert.match(sitemap, /guides\.map/);
  assert.doesNotMatch(sitemap, /welcome\//);
  assert.doesNotMatch(sitemap, /hurricane-prep["'`]/);
  assert.match(sitemap, /changeFrequency/);
  assert.match(sitemap, /priority/);
});

test("campaign pages are whitelisted, noindexed, canonicalized, and return 404 for unknown slugs", async () => {
  const [campaign, proxy] = await Promise.all([read("../app/welcome/[campaign]/page.tsx"), read("../proxy.ts")]);
  assert.match(campaign, /generateStaticParams/);
  assert.match(campaign, /Object\.keys\(campaigns\)/);
  assert.match(campaign, /robots: \{ index: false, follow: true/);
  assert.match(campaign, /canonical: "\/timeline\/first-week"/);
  assert.match(campaign, /canonical: "\/florida\/moving-to-florida-checklist"/);
  assert.match(campaign, /if \(!page\) notFound\(\)/);
  assert.match(proxy, /NextResponse\.rewrite\(notFoundUrl, \{ status: 404 \}\)/);
});

test("guide pages expose visible breadcrumbs and valid reusable JSON-LD", async () => {
  const [guidePage, jsonLd] = await Promise.all([read("../app/components/GuidePage.tsx"), read("../app/components/JsonLd.tsx")]);
  assert.match(guidePage, /Breadcrumbs/);
  assert.match(guidePage, /BreadcrumbList/);
  assert.match(guidePage, /Article/);
  assert.match(guidePage, /HowTo/);
  assert.match(jsonLd, /JSON\.stringify/);
  assert.match(jsonLd, /replaceAll\("<"/);
});

test("dynamic content routes reject unknown slugs", async () => {
  const routes = await Promise.all([
    read("../app/checklists/[slug]/page.tsx"),
    read("../app/homeowners/[slug]/page.tsx"),
    read("../app/renters/[slug]/page.tsx"),
    read("../app/florida/[slug]/page.tsx"),
    read("../app/timeline/[stage]/page.tsx"),
  ]);
  for (const route of routes) assert.match(route, /notFound\(\)/);
  for (const route of routes) assert.doesNotMatch(route, /dynamicParams = false/);
});

test("standard Node production scripts contain no Cloudflare or Vinext coupling", async () => {
  const [pkg, lock, api, db] = await Promise.all([read("../package.json"), read("../package-lock.json"), read("../app/api/newsletter/route.ts"), read("../db/index.ts")]);
  const packageData = JSON.parse(pkg);
  assert.equal(packageData.scripts.dev, "next dev");
  assert.equal(packageData.scripts.build, "next build");
  assert.equal(packageData.scripts.start, "next start");
  assert.equal(packageData.engines.node, ">=22.13.0");
  assert.doesNotMatch(`${pkg}${lock}${api}${db}`, /cloudflare:|wrangler|vinext|@cloudflare/i);
});

test("newsletter provides accessible errors and preserves form values on failure", async () => {
  const form = await read("../app/components/NewsletterForm.tsx");
  assert.match(form, /aria-invalid/);
  assert.match(form, /aria-describedby/);
  assert.match(form, /role=\{status === "error" \? "alert" : "status"\}/);
  assert.match(form, /disabled=\{status === "loading"\}/);
  assert.match(form, /const formElement = event\.currentTarget/);
  assert.match(form, /formElement\.reset\(\)/);
  assert.doesNotMatch(form, /event\.currentTarget\.reset\(\)/);
  assert.match(form, /Practical reminders only\. Unsubscribe anytime\./);
});

test("documents important legacy redirects", async () => {
  const redirects = await read("../docs/domain-migration.md");
  assert.match(redirects, /Old homepage/);
  assert.match(redirects, /\/timeline/);
  assert.match(redirects, /\/florida/);
  assert.match(redirects, /301/);
});

test("preserves reduced motion and visible focus treatment", async () => {
  const css = await read("../app/globals.css");
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /skip-link/);
});
