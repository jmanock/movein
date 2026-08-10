import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { readCsv } from "./lib/csv.mjs";

const root = process.cwd();
const providerPath = process.env.PROVIDER_DATA_PATH ?? join(root, "data", "florida", "florida-providers.csv");
const outputPath = process.env.LINK_STATUS_PATH ?? join(root, "data", "florida", "provider-link-status.csv");
const reportPath = process.env.LINK_REPORT_PATH ?? join(root, "docs", "link-validation-report.md");
const providers = await readCsv(providerPath);
const fields = ["official_website", "start_service_url", "address_check_url", "support_url", "outage_url", "outage_map_url", "collection_info_url"];
const urls = [...new Set(providers.filter((row) => row.status !== "inactive").flatMap((row) => fields.map((field) => row[field]).filter(Boolean)))];
const results = [];

for (const originalUrl of urls) results.push(await check(originalUrl));

const headers = ["original_url", "final_url", "state", "method", "http_status", "checked_at", "notes"];
await writeFile(outputPath, [headers.join(","), ...results.map((row) => headers.map((key) => csv(row[key])).join(","))].join("\n") + "\n", "utf8");
const counts = Object.groupBy(results, (row) => row.state);
const serious = results.filter((row) => ["not-found", "server-error"].includes(row.state));
await writeFile(reportPath, `# Link validation report\n\nGenerated: ${new Date().toISOString()}\n\nThe checker uses HEAD first and a lightweight GET fallback when HEAD is blocked or unsupported. It follows redirects without crawling site content.\n\n## Status totals\n\n${Object.entries(counts).sort().map(([state, rows]) => `- ${state}: ${rows.length}`).join("\n")}\n\n## Confirmed failures\n\n${serious.length ? serious.map((row) => `- ${row.original_url} — ${row.state} (${row.http_status})`).join("\n") : "No confirmed 404/410 or 5xx failures."}\n`, "utf8");
console.log(`Checked ${results.length} official URLs: ${serious.length} confirmed failure(s).`);
if (serious.length) process.exitCode = 1;

async function check(originalUrl) {
  const checkedAt = new Date().toISOString();
  try {
    const head = await request(originalUrl, "HEAD");
    if ([403, 405, 429, 501].includes(head.status)) {
      const get = await request(originalUrl, "GET");
      const state = classify(get.status, get.redirected, true);
      return { original_url: originalUrl, final_url: get.url, state, method: "GET", http_status: get.status, checked_at: checkedAt, notes: `HEAD returned ${head.status}; GET fallback used.` };
    }
    return { original_url: originalUrl, final_url: head.url, state: classify(head.status, head.redirected, false), method: "HEAD", http_status: head.status, checked_at: checkedAt, notes: head.redirected ? "Redirect followed." : "" };
  } catch (error) {
    const timeout = error?.name === "TimeoutError" || error?.name === "AbortError";
    return { original_url: originalUrl, final_url: originalUrl, state: timeout ? "timeout" : "unknown", method: "HEAD", http_status: "network-error", checked_at: checkedAt, notes: error instanceof Error ? error.message : "Network error" };
  }
}

function request(url, method) { return fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(Number(process.env.LINK_TIMEOUT_MS ?? 8000)), headers: { "User-Agent": "MoveIn-Data-Verification/2.0", ...(method === "GET" ? { Range: "bytes=0-2047" } : {}) } }); }
function classify(status, redirected, fallback) {
  if (status === 404 || status === 410) return "not-found";
  if (status >= 500) return "server-error";
  if (status === 403 || status === 401 || status === 429) return "forbidden";
  if (status >= 200 && status < 400) return fallback ? "head-blocked-get-reachable" : redirected ? "redirected" : "reachable";
  return "unknown";
}
function csv(value) { const text = String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }
