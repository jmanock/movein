import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { validateNewsletterPayload } from "../app/lib/newsletter.ts";
import { calculateProgress } from "../app/lib/progress.ts";
import { clearCompletion, loadCompletion, saveCompletion, TIMELINE_STORAGE_KEY } from "../app/lib/timelineStorage.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("homepage renders the MoveIn decision path", async () => {
  const [page, homepage] = await Promise.all([read("../app/page.tsx"), read("../app/components/Homepage.tsx")]);
  assert.match(`${page}${homepage}`, /MoveIn/);
  assert.match(homepage, /You have the keys/);
  assert.match(homepage, /Start My Move Timeline/);
  assert.match(homepage, /Explore the Florida Guide/);
  assert.doesNotMatch(page, /Welcome Home Florida/);
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
