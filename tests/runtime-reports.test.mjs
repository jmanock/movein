import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("generated audits write only to the ignored runtime report directory", async () => {
  const [ignore, seo, duplicates, links, data, health, provider] = await Promise.all([read("../.gitignore"), read("../scripts/seo-audit.mjs"), read("../scripts/content-duplication.mjs"), read("../scripts/check-internal-links.mjs"), read("../scripts/generate-data-coverage-report.mjs"), read("../scripts/production-health-report.mjs"), read("../scripts/check-provider-links.mjs")]);
  assert.match(ignore, /\/runtime-reports\//);
  for (const source of [seo, duplicates, links, data, health]) {
    assert.match(source, /writeRuntimeReport/);
    assert.doesNotMatch(source, /writeFile\([^\n]*(?:docs|data-coverage-report|production-health-report)/);
  }
  assert.match(provider, /runtimeReportPath\("provider-link-status\.csv"\)/);
  assert.match(provider, /runtimeReportPath\("link-validation-report\.md"\)/);
  assert.doesNotMatch(provider, /join\(root, "docs"|join\(root, "data", "florida", "provider-link-status/);
});

test("runtime report helper creates its output directory", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "movein-reports-"));
  const previous = process.env.RUNTIME_REPORT_DIR;
  process.env.RUNTIME_REPORT_DIR = temporary;
  const reportHelpers = await import(`../scripts/lib/runtime-reports.mjs?test=${Date.now()}`);
  const target = await reportHelpers.writeRuntimeReport("probe.md", "safe\n");
  assert.equal(await readFile(target, "utf8"), "safe\n");
  if (previous === undefined) delete process.env.RUNTIME_REPORT_DIR; else process.env.RUNTIME_REPORT_DIR = previous;
  await rm(temporary, { recursive: true });
});
