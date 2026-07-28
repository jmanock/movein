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
const validCategories = new Set(["electricity", "water", "sewer", "natural-gas", "internet", "trash-recycling", "local-government"]);
const unique = (rows, key, label) => {
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row[key])) errors.push(`${label} duplicate '${row[key]}' at row ${row.__row}`);
    else seen.add(row[key]);
  }
};
unique(zips, "zip_code", "ZIP");
unique(providers, "slug", "Provider slug");
const providerIdentities = new Set();
const zipSet = new Set(zips.map((row) => row.zip_code));
const providerSet = new Set(providers.map((row) => row.slug));
for (const row of zips) {
  if (!/^\d{5}$/.test(row.zip_code)) errors.push(`Invalid ZIP '${row.zip_code}'`);
  if (!['verified', 'partial', 'pending'].includes(row.status)) errors.push(`Invalid ZIP status at row ${row.__row}`);
  if (!row.last_verified_at) errors.push(`ZIP ${row.zip_code} lacks a verification date`);
  if (!/^https:\/\//.test(row.locality_source_url)) errors.push(`ZIP ${row.zip_code} lacks an HTTPS locality source`);
}
for (const row of providers) {
  if (!validCategories.has(row.category_slug)) errors.push(`Provider ${row.slug} has unknown category '${row.category_slug}'`);
  if (!isHttpsUrl(row.official_website)) errors.push(`Provider ${row.slug} lacks a valid HTTPS official website`);
  if (!row.last_verified_at) errors.push(`Provider ${row.slug} lacks a verification date`);
  const identity = `${row.state_code}|${row.category_slug}|${row.name.trim().toLowerCase()}`;
  if (providerIdentities.has(identity)) errors.push(`Duplicate provider identity '${row.name}' in ${row.category_slug}`);
  providerIdentities.add(identity);
}
const areaKeys = new Set();
for (const row of areas) {
  if (!zipSet.has(row.zip_code)) errors.push(`Unknown ZIP ${row.zip_code} in service areas`);
  if (!providerSet.has(row.provider_slug)) errors.push(`Unknown provider ${row.provider_slug} in service areas`);
  if (!['primary', 'possible', 'address_required', 'varies', 'unverified'].includes(row.coverage_type)) errors.push(`Invalid coverage type at row ${row.__row}`);
  const key = `${row.provider_slug}|${row.zip_code}`;
  if (areaKeys.has(key)) errors.push(`Duplicate service-area link '${key}'`);
  areaKeys.add(key);
}
for (const row of contacts) {
  if (!providerSet.has(row.provider_slug)) errors.push(`Unknown provider ${row.provider_slug} in contacts`);
  if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(row.phone)) errors.push(`Unformatted phone '${row.phone}' at row ${row.__row}`);
}
for (const row of sources) {
  if (!providerSet.has(row.provider_slug)) errors.push(`Unknown provider ${row.provider_slug} in sources`);
  if (!isHttpsUrl(row.source_url)) errors.push(`Invalid or non-HTTPS source at row ${row.__row}`);
  if (!row.retrieved_at) errors.push(`Source at row ${row.__row} lacks a retrieved date`);
}
const sourced = new Set(sources.map((row) => row.provider_slug));
for (const slug of providerSet) if (!sourced.has(slug)) errors.push(`Provider ${slug} has no source`);
const linkedZips = new Set(areas.map((row) => row.zip_code));
for (const zip of zipSet) if (!linkedZips.has(zip)) errors.push(`ZIP ${zip} has no service-area links`);
const linkedProviders = new Set(areas.map((row) => row.provider_slug));
for (const slug of providerSet) if (!linkedProviders.has(slug)) errors.push(`Provider ${slug} has no service-area links`);
const contacted = new Set(contacts.map((row) => row.provider_slug));
for (const row of providers) if (!contacted.has(row.slug) && !['internet', 'local-government'].includes(row.category_slug)) warnings.push(`No phone number for ${row.slug}`);
if (warnings.length) console.warn(`Warnings:\n- ${warnings.join("\n- ")}`);
if (errors.length) { console.error(`Validation failed:\n- ${errors.join("\n- ")}`); process.exitCode = 1; }
else console.log(`Validated ${zips.length} ZIPs, ${providers.length} providers, ${areas.length} service-area links, ${contacts.length} contacts, and ${sources.length} sources.`);

function isHttpsUrl(value) { try { return new URL(value).protocol === "https:"; } catch { return false; } }
