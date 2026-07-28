import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { openDatabase } from "./lib/database.mjs";

const categories = [
  ["electricity", 1, "https://www.floridapsc.com/find-utility-service"],
  ["water", 2, "Official city or county utility department"],
  ["sewer", 2, "Official city or county utility department"],
  ["trash-recycling", 3, "Official city or county solid-waste department"],
  ["internet", 4, "https://broadbandmap.fcc.gov/home"],
  ["natural-gas", 5, "https://www.floridapsc.com/find-utility-service"],
];
const { database } = openDatabase();
const zips = database.prepare(`SELECT z.id, z.zip_code, ci.name AS city, c.name AS county, z.status
  FROM zip_codes z LEFT JOIN cities ci ON ci.id=z.primary_city_id LEFT JOIN counties c ON c.id=z.county_id
  WHERE z.is_active=1 ORDER BY c.name, z.zip_code`).all();
const hasCategory = database.prepare(`SELECT 1 FROM service_areas sa JOIN providers p ON p.id=sa.provider_id
  JOIN provider_categories pc ON pc.id=p.category_id WHERE sa.zip_code_id=? AND pc.slug=?
  AND p.status!='inactive' AND COALESCE(p.provider_type, '')!='official_lookup' LIMIT 1`);
const rows = [];
for (const zip of zips) for (const [category, priority, source] of categories) {
  if (!hasCategory.get(zip.id, category)) rows.push({ zip_code: zip.zip_code, city: zip.city, county: zip.county, missing_category: category, current_status: zip.status, priority, suggested_official_source: source, last_researched_date: "", research_notes: "Confirm exact-address boundaries; do not assign from ZIP alone." });
}
database.close();
const headers = ["zip_code", "city", "county", "missing_category", "current_status", "priority", "suggested_official_source", "last_researched_date", "research_notes"];
const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(","))].join("\n") + "\n";
const output = process.env.RESEARCH_QUEUE_PATH ?? join(process.cwd(), "data", "florida", "research-queue.csv");
await writeFile(output, csv, "utf8");
console.log(`Wrote ${rows.length} research tasks to ${output}`);

function escapeCsv(value) { const text = String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }
