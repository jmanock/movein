import { join } from "node:path";
import { readCsv } from "./lib/csv.mjs";

const root = join(process.cwd(), "data", "florida");
const [zips, providers, areas, contacts, sources] = await Promise.all([
  readCsv(join(root, "florida-zip-codes.csv")), readCsv(join(root, "florida-providers.csv")),
  readCsv(join(root, "florida-service-areas.csv")), readCsv(join(root, "florida-provider-contacts.csv")),
  readCsv(join(root, "florida-data-sources.csv")),
]);
const errors = [];
const warnings = [];
const unique = (rows, key, label) => {
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row[key])) errors.push(`${label} duplicate '${row[key]}' at row ${row.__row}`);
    else seen.add(row[key]);
  }
};
unique(zips, "zip_code", "ZIP");
unique(providers, "slug", "Provider slug");
const zipSet = new Set(zips.map((row) => row.zip_code));
const providerSet = new Set(providers.map((row) => row.slug));
for (const row of zips) {
  if (!/^\d{5}$/.test(row.zip_code)) errors.push(`Invalid ZIP '${row.zip_code}'`);
  if (!['verified', 'partial', 'pending'].includes(row.status)) errors.push(`Invalid ZIP status at row ${row.__row}`);
}
for (const row of providers) {
  if (!/^https:\/\//.test(row.official_website)) errors.push(`Provider ${row.slug} lacks an HTTPS official website`);
  if (row.status === "verified" && !row.last_verified_at) errors.push(`Verified provider ${row.slug} lacks a date`);
}
for (const row of areas) {
  if (!zipSet.has(row.zip_code)) errors.push(`Unknown ZIP ${row.zip_code} in service areas`);
  if (!providerSet.has(row.provider_slug)) errors.push(`Unknown provider ${row.provider_slug} in service areas`);
  if (!['primary', 'possible', 'address_required', 'varies', 'unverified'].includes(row.coverage_type)) errors.push(`Invalid coverage type at row ${row.__row}`);
}
for (const row of contacts) {
  if (!providerSet.has(row.provider_slug)) errors.push(`Unknown provider ${row.provider_slug} in contacts`);
  if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(row.phone)) errors.push(`Unformatted phone '${row.phone}' at row ${row.__row}`);
}
for (const row of sources) {
  if (!providerSet.has(row.provider_slug)) errors.push(`Unknown provider ${row.provider_slug} in sources`);
  if (!/^https:\/\//.test(row.source_url)) errors.push(`Non-HTTPS source at row ${row.__row}`);
}
const sourced = new Set(sources.map((row) => row.provider_slug));
for (const slug of providerSet) if (!sourced.has(slug)) errors.push(`Provider ${slug} has no source`);
const contacted = new Set(contacts.map((row) => row.provider_slug));
for (const row of providers) if (!contacted.has(row.slug) && !['internet', 'local-government'].includes(row.category_slug)) warnings.push(`No phone number for ${row.slug}`);
if (warnings.length) console.warn(`Warnings:\n- ${warnings.join("\n- ")}`);
if (errors.length) { console.error(`Validation failed:\n- ${errors.join("\n- ")}`); process.exitCode = 1; }
else console.log(`Validated ${zips.length} ZIPs, ${providers.length} providers, ${areas.length} service-area links, ${contacts.length} contacts, and ${sources.length} sources.`);
