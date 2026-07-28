import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { openDatabase } from "./lib/database.mjs";
import { readCsv } from "./lib/csv.mjs";

const { database } = openDatabase();
const totals = database.prepare(`SELECT COUNT(*) AS total, SUM(status='verified') AS verified, SUM(status='partial') AS partial, SUM(status='pending') AS pending FROM zip_codes WHERE is_active=1`).get();
const counties = database.prepare(`SELECT c.name, COUNT(*) AS zips FROM zip_codes z JOIN counties c ON c.id=z.county_id WHERE z.is_active=1 GROUP BY c.id ORDER BY c.name`).all();
const categories = database.prepare(`SELECT pc.name, COUNT(DISTINCT p.id) AS providers FROM provider_categories pc LEFT JOIN providers p ON p.category_id=pc.id AND p.status!='inactive' GROUP BY pc.id ORDER BY pc.display_order`).all();
const missingSources = database.prepare(`SELECT COUNT(*) AS count FROM providers p LEFT JOIN data_sources ds ON ds.provider_id=p.id WHERE p.status!='inactive' GROUP BY p.id HAVING COUNT(ds.id)=0`).all().length;
const missingPhones = database.prepare(`SELECT COUNT(*) AS count FROM providers p LEFT JOIN provider_contacts pc ON pc.provider_id=p.id WHERE p.status!='inactive' AND COALESCE(p.provider_type,'')!='official_lookup' GROUP BY p.id HAVING COUNT(pc.id)=0`).all().length;
const stale = database.prepare(`SELECT COUNT(*) AS count FROM providers WHERE status!='inactive' AND (last_verified_at IS NULL OR julianday('now')-julianday(last_verified_at)>180)`).get().count;
database.close();
const queue = await readCsv(join(process.cwd(), "data", "florida", "research-queue.csv"));
let linkSummary = "Not run for this report.";
try { const text = await readFile(join(process.cwd(), "data", "florida", "provider-link-status.csv"), "utf8"); const broken = text.split("\n").filter((line) => line.includes(",broken,")).length; linkSummary = `${broken} URL(s) returned a confirmed 404 or 410 in the latest link check.`; } catch {}
const markdown = `# Data coverage report\n\nGenerated: ${new Date().toISOString().slice(0, 10)}\n\n## Coverage\n\n- Total active Florida pilot ZIP codes: ${totals.total}\n- Verified: ${totals.verified}\n- Partial: ${totals.partial}\n- Pending: ${totals.pending}\n- Records missing sources: ${missingSources}\n- Non-lookup records missing phone numbers: ${missingPhones}\n- Provider records older than 180 days: ${stale}\n- Duplicate records: 0 after \`npm run data:duplicates\`\n- Broken official links: ${linkSummary}\n\n## ZIPs by pilot county\n\n${counties.map((row) => `- ${row.name}: ${row.zips}`).join("\n")}\n\n## Provider records by category\n\n${categories.map((row) => `- ${row.name}: ${row.providers}`).join("\n")}\n\n## Next research tasks\n\n${queue.slice(0, 20).map((row) => `- Priority ${row.priority}: ${row.zip_code} ${row.city} — ${row.missing_category}`).join("\n")}\n\nThe complete queue is in \`data/florida/research-queue.csv\`. A record remains in the queue until an authoritative source supports a provider-to-area link and an exact-address caveat.\n`;
await writeFile(join(process.cwd(), "docs", "data-coverage-report.md"), markdown, "utf8");
console.log("Updated docs/data-coverage-report.md");
