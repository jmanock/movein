import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("contains the finished Welcome Home Florida experience", async () => {
  const [client, data, layout, css] = await Promise.all([
    readFile(new URL("../app/ClientHome.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/siteData.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /Welcome Home Florida/);
  assert.match(client, /The 30-Day/);
  assert.match(client, /Florida, decoded/);
  assert.match(client, /api\/newsletter/);
  assert.match(data, /First 24 hours/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(`${client}${layout}`, /codex-preview|react-loading-skeleton/i);
});
