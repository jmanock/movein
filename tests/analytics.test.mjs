import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { configureAnalyticsDebug, trackEvent, trackPageView } from "../app/lib/analytics.ts";
import { nextPageView } from "../app/lib/page-view.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("App Router path changes produce one logical page view each", () => {
  const routes = ["/", "/", "/internet", "/internet", "/resources/transfer-internet-when-moving", "/lookup/32757", "/resources/change-your-address", "/my-move", "/my-move"];
  let lastPath = null;
  const pageViews = [];
  for (const route of routes) {
    const next = nextPageView(lastPath, route);
    if (!next) continue;
    pageViews.push(next);
    lastPath = next;
  }
  assert.deepEqual(pageViews, ["/", "/internet", "/resources/transfer-internet-when-moving", "/lookup/32757", "/resources/change-your-address", "/my-move"]);
});

test("analytics emits allowlisted events and strips sensitive parameter keys", () => {
  const previousWindow = globalThis.window;
  const previousNavigator = globalThis.navigator;
  const previousDocument = globalThis.document;
  const calls = [];
  Object.defineProperty(globalThis, "window", { configurable: true, value: { gtag: (...args) => calls.push(args), dispatchEvent: () => undefined, location: { origin: "https://movein.guide" } } });
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { doNotTrack: "0", globalPrivacyControl: false } });
  Object.defineProperty(globalThis, "document", { configurable: true, value: { title: "MoveIn" } });
  configureAnalyticsDebug(false);
  trackEvent("provider_official_link_click", { provider_name: "Example Utility", service_category: "internet", source_page: "/internet", email: "visitor@example.com", notes: "private", amount: 99 });
  trackPageView("/internet");
  assert.equal(calls.length, 2);
  assert.equal(calls[0][0], "event");
  assert.equal(calls[0][1], "provider_official_link_click");
  assert.deepEqual(calls[0][2], { provider_name: "Example Utility", service_category: "internet", source_page: "/internet" });
  assert.equal(calls[1][1], "page_view");
  assert.equal(calls[1][2].page_path, "/internet");
  restoreGlobal("window", previousWindow);
  restoreGlobal("navigator", previousNavigator);
  restoreGlobal("document", previousDocument);
});

test("the GA4 diagnostic checks build output, duplicates, page views, and privacy", async () => {
  const [script, pkg] = await Promise.all([read("../scripts/analytics-check.mjs"), read("../package.json")]);
  for (const phrase of ["Measurement ID configured", "Duplicate tag check", "Production bundle check", "Production HTML check", "Manual page-view control", "Custom event layer", "Privacy blocklist"]) assert.match(script, new RegExp(phrase));
  assert.match(script, /runtime-reports.*analytics-check\.md/s);
  assert.equal(JSON.parse(pkg).scripts["analytics:check"], "node scripts/analytics-check.mjs");
});

test("the GA4 diagnostic environment loader reads Next.js project env files", async (context) => {
  const project = await mkdtemp(join(tmpdir(), "movein-next-env-"));
  context.after(() => rm(project, { recursive: true, force: true }));
  await writeFile(join(project, ".env.local"), "NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ENVFILE123\n");
  const loaderUrl = new URL("../scripts/lib/next-env.mjs", import.meta.url).href;
  const program = `import { loadNextEnvironment } from ${JSON.stringify(loaderUrl)}; loadNextEnvironment(${JSON.stringify(project)}); process.stdout.write(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "MISSING");`;
  const environment = { ...process.env };
  delete environment.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  delete environment.NODE_ENV;
  const result = spawnSync(process.execPath, ["--input-type=module", "--eval", program], { encoding: "utf8", env: environment });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "G-ENVFILE123");
});

function restoreGlobal(name, value) {
  if (value === undefined) delete globalThis[name];
  else Object.defineProperty(globalThis, name, { configurable: true, value });
}
