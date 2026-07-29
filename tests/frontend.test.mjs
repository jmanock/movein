import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("front-end growth routes and states remain explicit", async () => {
  const [home, coverage, lookup, resources] = await Promise.all([read("../app/page.tsx"), read("../app/coverage/page.tsx"), read("../app/lookup/[zip]/page.tsx"), read("../app/resources/page.tsx")]);
  assert.match(home, /context="homepage_hero"/);
  assert.match(home, /pathway-icon/);
  assert.match(coverage, /getIndexableZipResults/);
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
