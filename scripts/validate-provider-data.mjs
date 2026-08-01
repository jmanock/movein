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
const validConfidence = new Set(["verified", "probable", "partial", "pending", "conflicting"]);
const validAvailability = new Set(["confirmed", "primary_municipal", "possible", "multiple_possible", "address_required", "varies", "unverified", "not_generally_available"]);
const pilotCounties = new Set(["Seminole", "Orange", "Volusia", "Lake", "Osceola"]);
const contactTypes = new Set(["customer_service", "outage", "emergency", "general"]);
const today = new Date().toISOString().slice(0, 10);
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
  if (!/^3\d{4}$/.test(row.zip_code)) errors.push(`Invalid Florida ZIP '${row.zip_code}'`);
  if (!pilotCounties.has(row.county_name)) errors.push(`ZIP ${row.zip_code} is outside the five-county pilot`);
  if (!row.mailing_city_name) errors.push(`ZIP ${row.zip_code} lacks a mailing city`);
  if (!["incorporated", "unincorporated", "mixed", "unknown"].includes(row.jurisdiction_status)) errors.push(`ZIP ${row.zip_code} has invalid jurisdiction status`);
  if (!['verified', 'partial', 'pending'].includes(row.status)) errors.push(`Invalid ZIP status at row ${row.__row}`);
  if (!validConfidence.has(row.confidence_status)) errors.push(`Invalid ZIP confidence at row ${row.__row}`);
  if (!row.jurisdiction_notes) errors.push(`ZIP ${row.zip_code} lacks jurisdiction notes`);
  if (!row.last_verified_at) errors.push(`ZIP ${row.zip_code} lacks a verification date`);
  if (row.last_verified_at > today) errors.push(`ZIP ${row.zip_code} has a future verification date`);
  if (!/^https:\/\//.test(row.locality_source_url)) errors.push(`ZIP ${row.zip_code} lacks an HTTPS locality source`);
}
for (const row of providers) {
  if (!validCategories.has(row.category_slug)) errors.push(`Provider ${row.slug} has unknown category '${row.category_slug}'`);
  if (row.category_slug === "natural-gas" && row.status !== "inactive") errors.push(`Retired natural-gas provider ${row.slug} must remain inactive`);
  if (!isHttpsUrl(row.official_website)) errors.push(`Provider ${row.slug} lacks a valid HTTPS official website`);
  if (!row.last_verified_at) errors.push(`Provider ${row.slug} lacks a verification date`);
  for (const field of ["start_service_url", "address_check_url", "support_url", "outage_url", "outage_map_url", "collection_info_url"]) if (row[field] && !isHttpsUrl(row[field])) errors.push(`Provider ${row.slug} has invalid ${field}`);
  if (row.category_slug === "internet" && row.provider_type !== "official_lookup" && (!row.address_check_url || !row.support_url || !row.technology_type)) errors.push(`Internet provider ${row.slug} needs an availability checker, support link, and technology label`);
  if (row.last_verified_at > today) errors.push(`Provider ${row.slug} has a future verification date`);
  if (!row.provider_type) errors.push(`Provider ${row.slug} lacks a provider type`);
  const identity = `${row.state_code}|${row.category_slug}|${row.name.trim().toLowerCase()}`;
  if (providerIdentities.has(identity)) errors.push(`Duplicate provider identity '${row.name}' in ${row.category_slug}`);
  providerIdentities.add(identity);
}
const areaKeys = new Set();
for (const row of areas) {
  if (!zipSet.has(row.zip_code)) errors.push(`Unknown ZIP ${row.zip_code} in service areas`);
  if (!providerSet.has(row.provider_slug)) errors.push(`Unknown provider ${row.provider_slug} in service areas`);
  if (!['primary', 'possible', 'address_required', 'varies', 'unverified'].includes(row.coverage_type)) errors.push(`Invalid coverage type at row ${row.__row}`);
  if (!validAvailability.has(row.service_availability)) errors.push(`Invalid service availability at row ${row.__row}`);
  if (!['0', '1'].includes(row.requires_address_confirmation)) errors.push(`Invalid address-confirmation flag at row ${row.__row}`);
  if (!row.jurisdiction_notes) errors.push(`Service area at row ${row.__row} lacks jurisdiction notes`);
  const provider = providers.find((provider) => provider.slug === row.provider_slug);
  if (["internet", "water", "sewer", "trash-recycling", "natural-gas"].includes(provider?.category_slug) && row.requires_address_confirmation !== "1") errors.push(`Address confirmation must be required for ${row.provider_slug}|${row.zip_code}`);
  const key = `${row.provider_slug}|${row.zip_code}`;
  if (areaKeys.has(key)) errors.push(`Duplicate service-area link '${key}'`);
  areaKeys.add(key);
}
for (const row of contacts) {
  if (!providerSet.has(row.provider_slug)) errors.push(`Unknown provider ${row.provider_slug} in contacts`);
  if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(row.phone)) errors.push(`Unformatted phone '${row.phone}' at row ${row.__row}`);
  if (!contactTypes.has(row.contact_type)) errors.push(`Unknown contact type '${row.contact_type}' at row ${row.__row}`);
}
const contactKeys = new Set();
for (const row of contacts) { const key = `${row.provider_slug}|${row.contact_type}|${row.phone}`; if (contactKeys.has(key)) errors.push(`Duplicate contact '${key}'`); contactKeys.add(key); }
const contactsByProvider = Object.groupBy(contacts, (row) => row.provider_slug);
for (const row of providers.filter((provider) => provider.status !== "inactive")) {
  const providerContacts = contactsByProvider[row.slug] ?? [];
  if (row.category_slug === "electricity" && row.provider_type !== "official_lookup") {
    if (!row.start_service_url || !row.outage_url) errors.push(`Electric provider ${row.slug} needs start-service and outage links`);
    if (!providerContacts.some((contact) => contact.contact_type === "customer_service")) errors.push(`Electric provider ${row.slug} needs a customer-service phone`);
    if (!providerContacts.some((contact) => contact.contact_type === "outage")) errors.push(`Electric provider ${row.slug} needs an outage phone`);
    if (!row.outage_map_url && !/no stable public outage map/i.test(row.service_notes)) errors.push(`Electric provider ${row.slug} needs an outage map or an explicit official-source limitation`);
  }
  if (["water", "sewer"].includes(row.category_slug) && (!row.start_service_url || providerContacts.length === 0)) errors.push(`${row.category_slug} provider ${row.slug} needs a start-service link and phone`);
  if (row.category_slug === "trash-recycling" && (!row.collection_info_url || providerContacts.length === 0)) errors.push(`Trash provider ${row.slug} needs collection information and a phone`);
}
for (const row of sources) {
  if (!providerSet.has(row.provider_slug)) errors.push(`Unknown provider ${row.provider_slug} in sources`);
  if (!isHttpsUrl(row.source_url)) errors.push(`Invalid or non-HTTPS source at row ${row.__row}`);
  if (!row.retrieved_at) errors.push(`Source at row ${row.__row} lacks a retrieved date`);
  if (row.retrieved_at > today) errors.push(`Source at row ${row.__row} has a future retrieval date`);
  if (!row.source_name || !row.source_type) errors.push(`Source at row ${row.__row} lacks title or type`);
}
const sourced = new Set(sources.map((row) => row.provider_slug));
for (const slug of providerSet) if (!sourced.has(slug)) errors.push(`Provider ${slug} has no source`);
const linkedZips = new Set(areas.map((row) => row.zip_code));
for (const zip of zipSet) if (!linkedZips.has(zip)) errors.push(`ZIP ${zip} has no service-area links`);
const linkedProviders = new Set(areas.map((row) => row.provider_slug));
for (const slug of providerSet) if (!linkedProviders.has(slug)) errors.push(`Provider ${slug} has no service-area links`);
for (const zip of zips.filter((row) => row.status === "verified")) {
  const categories = new Set(areas.filter((area) => area.zip_code === zip.zip_code).map((area) => providers.find((provider) => provider.slug === area.provider_slug)).filter((provider) => provider?.status !== "inactive").map((provider) => provider.category_slug));
  for (const category of ["electricity", "water", "sewer", "internet", "trash-recycling", "local-government"]) if (!categories.has(category)) errors.push(`Verified ZIP ${zip.zip_code} lacks ${category}`);
}
const contacted = new Set(contacts.map((row) => row.provider_slug));
for (const row of providers) if (!contacted.has(row.slug) && row.provider_type !== "official_lookup" && !['internet', 'local-government'].includes(row.category_slug)) warnings.push(`No phone number for ${row.slug}`);
if (warnings.length) console.warn(`Warnings:\n- ${warnings.join("\n- ")}`);
if (errors.length) { console.error(`Validation failed:\n- ${errors.join("\n- ")}`); process.exitCode = 1; }
else console.log(`Validated ${zips.length} ZIPs, ${providers.length} providers, ${areas.length} service-area links, ${contacts.length} contacts, and ${sources.length} sources.`);

function isHttpsUrl(value) { try { return new URL(value).protocol === "https:"; } catch { return false; } }
