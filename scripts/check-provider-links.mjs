import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { readCsv } from "./lib/csv.mjs";

const providers = await readCsv(join(process.cwd(), "data", "florida", "florida-providers.csv"));
const urls = [...new Set(providers.flatMap((row) => [row.official_website, row.start_service_url, row.address_check_url, row.outage_url]).filter(Boolean))];
const results = [];
for (const url of urls) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(8000), headers: { "User-Agent": "MoveIn-Data-Verification/1.0" } });
    const state = response.status === 404 || response.status === 410 ? "broken" : response.ok ? "reachable" : "blocked-or-unknown";
    results.push({ url, state, status: response.status });
  } catch { results.push({ url, state: "blocked-or-unknown", status: "network-error" }); }
}
const csv = ["url,state,http_status", ...results.map((row) => `"${row.url}",${row.state},${row.status}`)].join("\n") + "\n";
await writeFile(join(process.cwd(), "data", "florida", "provider-link-status.csv"), csv, "utf8");
console.log(`Checked ${results.length} official action URLs: ${results.filter((row) => row.state === "broken").length} confirmed broken.`);
