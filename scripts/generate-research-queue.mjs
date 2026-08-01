import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { openDatabase } from "./lib/database.mjs";
import { readCsv } from "./lib/csv.mjs";

const { database } = openDatabase();
const zips = database.prepare(`SELECT z.id,z.zip_code,ci.name city,c.name county,z.status FROM zip_codes z JOIN cities ci ON ci.id=z.primary_city_id JOIN counties c ON c.id=z.county_id WHERE z.is_active=1 ORDER BY c.name,z.zip_code`).all();
const actual = database.prepare(`SELECT 1 FROM service_areas sa JOIN providers p ON p.id=sa.provider_id JOIN provider_categories pc ON pc.id=p.category_id WHERE sa.zip_code_id=? AND pc.slug=? AND p.status!='inactive' AND COALESCE(p.provider_type,'')!='official_lookup' LIMIT 1`);
const categories = ["electricity", "water", "sewer", "trash-recycling", "internet", "local-government"];
const rows = [];
for (const zip of zips) for (const category of categories) if (!actual.get(zip.id, category)) {
  const addressLevel = category === "internet";
  const source = category === "internet" ? "https://broadbandmap.fcc.gov/home" : "Official city county or utility territory source";
  rows.push({ task_type: "missing-provider", zip_code: zip.zip_code, city: zip.city, county: zip.county, provider_slug: "", missing_category: category, current_status: zip.status, priority: addressLevel ? 4 : 1, suggested_official_source: source, last_researched_date: "2026-08-01", sources_reviewed: source, next_recommended_action: addressLevel ? "Review official provider address checkers and the FCC Broadband Map; never assign ZIP-wide availability." : "Locate and document an authoritative provider-to-area source.", research_notes: addressLevel ? "Internet providers and technology vary by exact address; keep address confirmation mandatory." : "A true provider record is still required." });
}
const providerIssues = database.prepare(`SELECT p.slug,p.official_website,p.last_verified_at,pc.slug category FROM providers p JOIN provider_categories pc ON pc.id=p.category_id WHERE p.status!='inactive' AND (p.last_verified_at IS NULL OR julianday('now')-julianday(p.last_verified_at)>180 OR NOT EXISTS(SELECT 1 FROM data_sources ds WHERE ds.provider_id=p.id))`).all();
for (const provider of providerIssues) rows.push({ task_type: !provider.last_verified_at ? "missing-verification-date" : "source-or-stale-review", zip_code: "", city: "", county: "", provider_slug: provider.slug, missing_category: provider.category, current_status: "provider-review", priority: 2, suggested_official_source: provider.official_website, last_researched_date: provider.last_verified_at ?? "", sources_reviewed: provider.official_website, next_recommended_action: "Review the official provider record and refresh its source and verification date.", research_notes: "Generated from provider evidence and staleness checks." });
for (const zip of zips.filter((row) => row.status === "conflicting")) rows.push({ task_type: "conflicting-jurisdiction", zip_code: zip.zip_code, city: zip.city, county: zip.county, provider_slug: "", missing_category: "local-government", current_status: zip.status, priority: 1, suggested_official_source: "Official municipal and county GIS sources", last_researched_date: "", sources_reviewed: "", next_recommended_action: "Resolve the conflicting jurisdiction evidence.", research_notes: "Do not promote until resolved." });
const placeholders = database.prepare(`SELECT z.zip_code,ci.name city,c.name county FROM zip_codes z JOIN cities ci ON ci.id=z.primary_city_id JOIN counties c ON c.id=z.county_id WHERE z.is_active=1 AND NOT EXISTS(SELECT 1 FROM service_areas sa JOIN providers p ON p.id=sa.provider_id WHERE sa.zip_code_id=z.id AND COALESCE(p.provider_type,'')!='official_lookup')`).all();
for (const zip of placeholders) rows.push({ task_type: "placeholder-only", zip_code: zip.zip_code, city: zip.city, county: zip.county, provider_slug: "", missing_category: "all", current_status: "pending", priority: 1, suggested_official_source: "Official provider and government sources", last_researched_date: "", sources_reviewed: "", next_recommended_action: "Research at least one true provider and local government record.", research_notes: "Official lookup tools alone are not sufficient for indexing." });
try {
  const links = await readCsv(process.env.LINK_STATUS_PATH ?? join(process.cwd(), "data", "florida", "provider-link-status.csv"));
  for (const link of links.filter((row) => ["not-found","server-error","unknown","timeout"].includes(row.state))) rows.push({ task_type: "official-link-review", zip_code: "", city: "", county: "", provider_slug: "", missing_category: "link", current_status: link.state, priority: 2, suggested_official_source: link.original_url || link.url, last_researched_date: (link.checked_at || "").slice(0,10), sources_reviewed: link.final_url || link.original_url || link.url, next_recommended_action: "Open the official site manually and update or document the URL.", research_notes: `Automated link check returned ${link.state}.` });
} catch {}
database.close();
const headers = ["task_type","zip_code","city","county","provider_slug","missing_category","current_status","priority","suggested_official_source","last_researched_date","sources_reviewed","next_recommended_action","research_notes"];
const output = process.env.RESEARCH_QUEUE_PATH ?? join(process.cwd(), "data", "florida", "research-queue.csv");
await writeFile(output, [headers.join(","), ...rows.map((row) => headers.map((key) => csv(row[key])).join(","))].join("\n") + "\n", "utf8");
const summary = `# Research queue summary\n\nGenerated: ${new Date().toISOString().slice(0,10)}\n\n- Open tasks: ${rows.length}\n- Internet address-level verification: ${rows.filter((r) => r.missing_category === "internet").length}\n- Other missing core categories: ${rows.filter((r) => r.missing_category !== "internet").length}\n\nThese tasks remain open deliberately. ZIP codes do not establish building-level internet availability or every utility boundary. Each row records sources reviewed and the next safe research action.\n`;
await writeFile(process.env.RESEARCH_SUMMARY_PATH ?? join(process.cwd(), "docs", "research-queue-summary.md"), summary, "utf8");
console.log(`Wrote ${rows.length} research tasks to ${output}`);
function csv(value) { const text = String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replaceAll('"','""')}"` : text; }
