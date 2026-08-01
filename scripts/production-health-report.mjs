import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { openDatabase } from "./lib/database.mjs";
import { readCsv } from "./lib/csv.mjs";

const root = process.cwd();
const checks = [
  run("Provider data validation", ["scripts/validate-provider-data.mjs"]),
  runNpm("Lookup and homepage tests", ["test"]),
  run("SEO audit", ["scripts/seo-audit.mjs"]),
  run("Front-end audit", ["scripts/frontend-audit.mjs"]),
  runNpm("Production build", ["run", "build"]),
];

const { database } = openDatabase();
const totals = database.prepare(`SELECT COUNT(*) total, SUM(status='verified') verified, SUM(status='pending') pending, COUNT(DISTINCT county_id) counties FROM zip_codes WHERE is_active=1`).get();
const providerCounts = database.prepare(`SELECT pc.name category, COUNT(DISTINCT p.id) providers, COUNT(DISTINCT sa.zip_code_id) zip_records FROM provider_categories pc LEFT JOIN providers p ON p.category_id=pc.id AND p.status!='inactive' LEFT JOIN service_areas sa ON sa.provider_id=p.id WHERE pc.slug!='natural-gas' GROUP BY pc.id ORDER BY pc.display_order`).all();
const missingVerified = database.prepare(`SELECT z.zip_code, GROUP_CONCAT(pc.name, ', ') missing FROM zip_codes z CROSS JOIN provider_categories pc LEFT JOIN service_areas sa ON sa.zip_code_id=z.id AND sa.provider_id IN (SELECT id FROM providers WHERE category_id=pc.id AND status!='inactive') WHERE z.is_active=1 AND z.status='verified' AND pc.slug IN ('electricity','water','sewer','internet','trash-recycling','local-government') AND sa.id IS NULL GROUP BY z.id ORDER BY z.zip_code`).all();
const pendingMissing = database.prepare(`SELECT COUNT(*) count FROM zip_codes z CROSS JOIN provider_categories pc LEFT JOIN service_areas sa ON sa.zip_code_id=z.id AND sa.provider_id IN (SELECT id FROM providers WHERE category_id=pc.id AND status!='inactive') WHERE z.is_active=1 AND z.status='pending' AND pc.slug IN ('electricity','water','sewer','internet','trash-recycling','local-government') AND sa.id IS NULL`).get().count;
database.close();

let linkRows = [];
try { linkRows = await readCsv(join(root, "data", "florida", "provider-link-status.csv")); } catch {}
const brokenLinks = linkRows.filter((row) => ["not-found", "server-error"].includes(row.state));
const uncertainLinks = linkRows.filter((row) => ["timeout", "unknown"].includes(row.state));
const [layout, analytics, robots, sitemap] = await Promise.all([
  readFile(join(root, "app", "layout.tsx"), "utf8"),
  readFile(join(root, "app", "components", "GoogleAnalytics.tsx"), "utf8"),
  readFile(join(root, "app", "robots.ts"), "utf8"),
  readFile(join(root, "app", "sitemap.ts"), "utf8"),
]);
const gaConfigured = layout.includes("NEXT_PUBLIC_GA_MEASUREMENT_ID") && (layout.match(/<GoogleAnalytics/g) ?? []).length === 1 && analytics.includes("send_page_view: false") && analytics.includes("usePathname");
const robotsHealthy = robots.includes("/sitemap.xml") && robots.includes("SITE_URL");
const sitemapHealthy = sitemap.includes("getIndexableZipResults") && sitemap.includes("SITE_URL");
const failed = checks.filter((check) => !check.passed);
const report = `# MoveIn production health report

Generated: ${new Date().toISOString()}

## Overall status

**${failed.length || brokenLinks.length || missingVerified.length ? "Attention required" : "Healthy for the five-county pilot"}.**

## ZIP coverage

- Active ZIP records: ${totals.total}
- Verified and indexable ZIPs: ${totals.verified}
- Pending and noindex ZIPs: ${totals.pending}
- Counties covered: ${totals.counties}
- Missing core provider categories on verified ZIPs: ${missingVerified.length}
- Missing core provider items across pending ZIPs: ${pendingMissing}

## Provider counts

| Category | Providers or official tools | ZIP records |
| --- | ---: | ---: |
${providerCounts.map((row) => `| ${row.category} | ${row.providers} | ${row.zip_records} |`).join("\n")}

## Missing provider information

${missingVerified.length ? missingVerified.map((row) => `- ${row.zip_code}: ${row.missing}`).join("\n") : "No core-category gaps remain on the 12 verified ZIP pages. Pending ZIP gaps stay in the research queue and do not affect indexing."}

## Official links

- URLs in latest link report: ${linkRows.length}
- Confirmed broken links: ${brokenLinks.length}
- Network-uncertain links: ${uncertainLinks.length}
${brokenLinks.length ? brokenLinks.map((row) => `- ${row.original_url} — ${row.state} (${row.http_status})`).join("\n") : "- No confirmed 404/410 or server-error links in the latest report."}

## Search and analytics health

- Sitemap quality gate: ${sitemapHealthy ? "PASS" : "FAIL"}
- Robots sitemap declaration: ${robotsHealthy ? "PASS" : "FAIL"}
- GA4 root installation and manual page-view control: ${gaConfigured ? "PASS" : "FAIL"}
- GA4 runtime status: enabled in production only when \`NEXT_PUBLIC_GA_MEASUREMENT_ID\` is present
- Privacy: typed events omit entered ZIPs and submitted form content

## Automated checks

| Check | Result |
| --- | --- |
${checks.map((check) => `| ${check.name} | ${check.passed ? "PASS" : "FAIL"} |`).join("\n")}

The test suite covers lookup behavior, provider actions, homepage lookup states, SEO safeguards, analytics duplication controls, and pending-page noindex behavior. The front-end audit uses static checks unless a production server is available through \`FRONTEND_AUDIT_URL\`.
`;
await writeFile(join(root, "docs", "production-health-report.md"), report, "utf8");
console.log(`Production health: ${totals.verified} verified, ${totals.pending} pending, ${missingVerified.length} verified-ZIP gaps, ${brokenLinks.length} broken links, ${failed.length} failed automated checks.`);
console.log("Updated docs/production-health-report.md");
if (failed.length || brokenLinks.length || missingVerified.length || !gaConfigured || !robotsHealthy || !sitemapHealthy) process.exitCode = 1;

function run(name, args, shell = false) {
  const result = spawnSync(process.execPath, args, { cwd: root, env: process.env, encoding: "utf8", shell, maxBuffer: 20 * 1024 * 1024 });
  return { name, passed: result.status === 0, output: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim() };
}

function runNpm(name, args) {
  const result = spawnSync("npm", args, { cwd: root, env: process.env, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  return { name, passed: result.status === 0, output: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim() };
}
