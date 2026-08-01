import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { openDatabase } from "./lib/database.mjs";
import { readCsv } from "./lib/csv.mjs";

const root = process.cwd();
const { database } = openDatabase();
const totals = database.prepare(`SELECT COUNT(*) total,SUM(status='verified') verified,SUM(status='partial') partial,SUM(status='pending') pending FROM zip_codes WHERE is_active=1`).get();
const mostly = database.prepare(`SELECT COUNT(DISTINCT z.id) count FROM zip_codes z WHERE z.is_active=1 AND z.status='partial' AND NOT EXISTS (SELECT 1 FROM provider_categories pc WHERE pc.slug IN ('electricity','water','sewer','trash-recycling','local-government') AND NOT EXISTS (SELECT 1 FROM service_areas sa JOIN providers p ON p.id=sa.provider_id WHERE sa.zip_code_id=z.id AND p.category_id=pc.id AND p.status!='inactive' AND COALESCE(p.provider_type,'')!='official_lookup'))`).get().count;
const counties = database.prepare(`SELECT c.name,COUNT(*) zips FROM zip_codes z JOIN counties c ON c.id=z.county_id WHERE z.is_active=1 GROUP BY c.id ORDER BY c.name`).all();
const categories = database.prepare(`SELECT pc.name,COUNT(DISTINCT p.id) providers FROM provider_categories pc LEFT JOIN providers p ON p.category_id=pc.id AND p.status!='inactive' WHERE pc.slug!='natural-gas' GROUP BY pc.id ORDER BY pc.display_order`).all();
const missingSources = database.prepare(`SELECT COUNT(*) count FROM providers p WHERE p.status!='inactive' AND NOT EXISTS(SELECT 1 FROM data_sources ds WHERE ds.provider_id=p.id)`).get().count;
const missingPhones = database.prepare(`SELECT COUNT(*) count FROM providers p WHERE p.status!='inactive' AND COALESCE(p.provider_type,'')!='official_lookup' AND p.category_id NOT IN (SELECT id FROM provider_categories WHERE slug IN ('internet','local-government')) AND NOT EXISTS(SELECT 1 FROM provider_contacts pc WHERE pc.provider_id=p.id)`).get().count;
const missingDates = database.prepare(`SELECT COUNT(*) count FROM providers WHERE status!='inactive' AND last_verified_at IS NULL`).get().count;
const stale = database.prepare(`SELECT COUNT(*) count FROM providers WHERE status!='inactive' AND (last_verified_at IS NULL OR julianday('now')-julianday(last_verified_at)>180)`).get().count;
const corrections = database.prepare(`SELECT COUNT(*) count FROM correction_submissions WHERE workflow_status IN ('new','reviewing','accepted')`).get().count;
database.close();

const queue = await readCsv(join(root, "data", "florida", "research-queue.csv"));
let links = [];
try { links = await readCsv(join(root, "data", "florida", "provider-link-status.csv")); } catch {}
const linkCounts = Object.entries(Object.groupBy(links, (row) => row.state)).map(([state, rows]) => `${state}: ${rows.length}`).join(", ") || "not run";
const missingByZip = Object.entries(Object.groupBy(queue.filter((row) => row.task_type === "missing-provider"), (row) => row.zip_code)).map(([zip, rows]) => `- ${zip}: ${rows.map((row) => row.missing_category).join(", ")}`).join("\n");
const ready = missingSources === 0 && missingDates === 0 && stale === 0 && !links.some((row) => ["not-found", "server-error"].includes(row.state));
const markdown = `# Data coverage report

Generated: ${new Date().toISOString().slice(0, 10)}

## Readiness

**${ready ? "Ready for limited public pilot promotion" : "Not yet ready for public promotion"}.** Address-level internet tasks remain documented; this is not statewide coverage.

## Coverage

- Total active ZIP codes: ${totals.total}
- Verified ZIP codes: ${totals.verified}
- Mostly verified ZIP codes: ${mostly}
- Partial ZIP codes: ${Number(totals.partial) - mostly}
- Pending ZIP codes: ${totals.pending}
- Records missing sources: ${missingSources}
- Records missing phone numbers: ${missingPhones}
- Records missing verification dates: ${missingDates}
- Records older than 180 days: ${stale}
- Corrections awaiting review: ${corrections}
- Remaining research tasks: ${queue.length}
- Official links: ${linkCounts}

## ZIPs by county

${counties.map((row) => `- ${row.name}: ${row.zips}`).join("\n")}

## Providers by category

${categories.map((row) => `- ${row.name}: ${row.providers}`).join("\n")}

## Missing categories by ZIP

${missingByZip || "None."}

The remaining rows are retained because ZIP-wide internet assignments and local utility boundaries cannot be determined responsibly without stronger address-level evidence. See \`data/florida/research-queue.csv\`.
`;
await writeFile(join(root, "docs", "data-coverage-report.md"), markdown, "utf8");
console.log("Updated docs/data-coverage-report.md");
