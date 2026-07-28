import { join } from "node:path";
import { readCsv } from "./lib/csv.mjs";

const root = join(process.cwd(), "data", "florida");
const [zips, providers, areas] = await Promise.all([readCsv(join(root, "florida-zip-codes.csv")), readCsv(join(root, "florida-providers.csv")), readCsv(join(root, "florida-service-areas.csv"))]);
const duplicates = [
  ...find(zips, (row) => row.zip_code, "ZIP"),
  ...find(providers, (row) => row.slug, "provider slug"),
  ...find(providers, (row) => `${row.state_code}|${row.category_slug}|${row.name.toLowerCase()}`, "provider identity"),
  ...find(areas, (row) => `${row.provider_slug}|${row.zip_code}`, "service-area link"),
];
if (duplicates.length) { console.error(duplicates.join("\n")); process.exitCode = 1; }
else console.log(`No duplicates across ${zips.length} ZIPs, ${providers.length} providers, and ${areas.length} service-area links.`);
function find(rows, key, label) { const seen = new Set(); const output = []; for (const row of rows) { const value = key(row); if (seen.has(value)) output.push(`Duplicate ${label}: ${value}`); seen.add(value); } return output; }
