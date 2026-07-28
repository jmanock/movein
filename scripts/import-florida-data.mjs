import { basename, join, resolve } from "node:path";
import { openDatabase } from "./lib/database.mjs";
import { readCsv } from "./lib/csv.mjs";

const root = join(process.cwd(), "data", "florida");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const confirmVerified = args.includes("--confirm-verified");
const fileArgument = args.find((value) => value.startsWith("--file="))?.slice(7);
const providerFile = fileArgument ? resolve(process.cwd(), fileArgument) : join(root, "florida-providers.csv");
if (fileArgument && basename(providerFile) !== "florida-providers.csv") throw new Error("--file currently accepts data/florida/florida-providers.csv only");
const [zipRows, providerRows, areaRows, contactRows, sourceRows] = await Promise.all([
  readCsv(join(root, "florida-zip-codes.csv")),
  readCsv(providerFile),
  readCsv(join(root, "florida-service-areas.csv")),
  readCsv(join(root, "florida-provider-contacts.csv")),
  readCsv(join(root, "florida-data-sources.csv")),
]);

const { database, path } = openDatabase();
const hasSchema = database.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='zip_codes'").get();
if (!hasSchema) throw new Error("Lookup schema is missing. Run npm run db:migrate first.");

for (const row of zipRows) {
  const existing = database.prepare(`SELECT z.status, z.is_indexable, z.last_verified_at, z.confidence_status, z.jurisdiction_notes, z.locality_source_url,
    s.code AS state_code, c.name AS county_name, ci.name AS city_name FROM zip_codes z JOIN states s ON s.id=z.state_id
    LEFT JOIN counties c ON c.id=z.county_id LEFT JOIN cities ci ON ci.id=z.primary_city_id WHERE z.zip_code=?`).get(row.zip_code);
  if (!existing || (existing.status !== "verified" && !existing.is_indexable)) continue;
  assertConfirmedChange(`verified ZIP '${row.zip_code}'`, existing, {
    status: row.status, is_indexable: Number(row.is_indexable), last_verified_at: row.last_verified_at || null,
    confidence_status: row.confidence_status || row.status, jurisdiction_notes: row.jurisdiction_notes || null,
    locality_source_url: row.locality_source_url, state_code: row.state_code, county_name: row.county_name, city_name: row.city_name,
  });
}
for (const row of providerRows) {
  const existing = database.prepare(`SELECT name, category_id, description, official_website, service_notes, status, is_verified, last_verified_at,
    provider_type, start_service_url, address_check_url, outage_url, hours, technology_type FROM providers WHERE slug=?`).get(row.slug);
  if (!existing?.is_verified) continue;
  const category = database.prepare("SELECT slug FROM provider_categories WHERE id=?").get(existing.category_id)?.slug;
  assertConfirmedChange(`verified provider '${row.slug}'`, { ...existing, category_slug: category }, {
    name: row.name, category_slug: row.category_slug, description: row.description || null, official_website: row.official_website,
    service_notes: row.service_notes || null, status: row.status, is_verified: Number(row.is_verified), last_verified_at: row.last_verified_at || null,
    provider_type: row.provider_type || null, start_service_url: row.start_service_url || null, address_check_url: row.address_check_url || null,
    outage_url: row.outage_url || null, hours: row.hours || null, technology_type: row.technology_type || null,
  });
}
for (const row of areaRows) {
  const existing = database.prepare(`SELECT sa.coverage_type, sa.coverage_notes, sa.confidence_level, sa.is_primary, sa.service_availability,
    sa.requires_address_confirmation, sa.jurisdiction_notes, p.is_verified FROM service_areas sa JOIN providers p ON p.id=sa.provider_id
    JOIN zip_codes z ON z.id=sa.zip_code_id WHERE p.slug=? AND z.zip_code=?`).get(row.provider_slug, row.zip_code);
  if (!existing?.is_verified) continue;
  assertConfirmedChange(`verified service-area '${row.provider_slug}|${row.zip_code}'`, existing, {
    coverage_type: row.coverage_type, coverage_notes: row.coverage_notes, confidence_level: row.confidence_level,
    is_primary: Number(row.is_primary), service_availability: row.service_availability || null,
    requires_address_confirmation: Number(row.requires_address_confirmation || 1), jurisdiction_notes: row.jurisdiction_notes || null,
  });
}

const categoryRows = [
  ["electricity", "Electricity", 10], ["water", "Water", 20], ["sewer", "Sewer", 30],
  ["natural-gas", "Natural gas", 40], ["internet", "Internet", 50],
  ["trash-recycling", "Trash & recycling", 60], ["local-government", "Local information", 70],
];

const importData = database.transaction(() => {
  const upsertState = database.prepare("INSERT INTO states (code, name, is_active) VALUES (?, ?, 1) ON CONFLICT(code) DO UPDATE SET name=excluded.name, is_active=1");
  const upsertCounty = database.prepare("INSERT INTO counties (state_id, name) VALUES ((SELECT id FROM states WHERE code=?), ?) ON CONFLICT(state_id, name) DO NOTHING");
  const upsertCity = database.prepare("INSERT INTO cities (state_id, county_id, name, slug) VALUES ((SELECT id FROM states WHERE code=?), (SELECT c.id FROM counties c JOIN states s ON s.id=c.state_id WHERE s.code=? AND c.name=?), ?, ?) ON CONFLICT(state_id, county_id, name) DO UPDATE SET slug=excluded.slug");
  const upsertZip = database.prepare(`INSERT INTO zip_codes (zip_code, state_id, county_id, primary_city_id, status, is_indexable, is_active, last_verified_at, confidence_status, jurisdiction_notes, locality_source_url)
    VALUES (?, (SELECT id FROM states WHERE code=?), (SELECT c.id FROM counties c JOIN states s ON s.id=c.state_id WHERE s.code=? AND c.name=?), (SELECT ci.id FROM cities ci JOIN states s ON s.id=ci.state_id JOIN counties c ON c.id=ci.county_id WHERE s.code=? AND c.name=? AND ci.name=?), ?, ?, 1, ?, ?, ?, ?)
    ON CONFLICT(zip_code) DO UPDATE SET state_id=excluded.state_id, county_id=excluded.county_id, primary_city_id=excluded.primary_city_id, status=excluded.status, is_indexable=excluded.is_indexable, is_active=1, last_verified_at=excluded.last_verified_at, confidence_status=excluded.confidence_status, jurisdiction_notes=excluded.jurisdiction_notes, locality_source_url=excluded.locality_source_url`);
  const upsertCategory = database.prepare("INSERT INTO provider_categories (slug, name, display_order) VALUES (?, ?, ?) ON CONFLICT(slug) DO UPDATE SET name=excluded.name, display_order=excluded.display_order");
  const upsertProvider = database.prepare(`INSERT INTO providers (slug, name, category_id, state_id, description, official_website, service_notes, status, is_verified, last_verified_at, provider_type, start_service_url, address_check_url, outage_url, hours, technology_type)
    VALUES (?, ?, (SELECT id FROM provider_categories WHERE slug=?), (SELECT id FROM states WHERE code=?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET name=excluded.name, category_id=excluded.category_id, state_id=excluded.state_id, description=excluded.description, official_website=excluded.official_website, service_notes=excluded.service_notes, status=excluded.status, is_verified=excluded.is_verified, last_verified_at=excluded.last_verified_at, provider_type=excluded.provider_type, start_service_url=excluded.start_service_url, address_check_url=excluded.address_check_url, outage_url=excluded.outage_url, hours=excluded.hours, technology_type=excluded.technology_type`);
  const upsertArea = database.prepare(`INSERT INTO service_areas (provider_id, zip_code_id, coverage_type, coverage_notes, confidence_level, is_primary, service_availability, requires_address_confirmation, jurisdiction_notes)
    VALUES ((SELECT id FROM providers WHERE slug=?), (SELECT id FROM zip_codes WHERE zip_code=?), ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(provider_id, zip_code_id) DO UPDATE SET coverage_type=excluded.coverage_type, coverage_notes=excluded.coverage_notes, confidence_level=excluded.confidence_level, is_primary=excluded.is_primary, service_availability=excluded.service_availability, requires_address_confirmation=excluded.requires_address_confirmation, jurisdiction_notes=excluded.jurisdiction_notes`);
  const upsertContact = database.prepare(`INSERT INTO provider_contacts (provider_id, contact_type, label, phone)
    VALUES ((SELECT id FROM providers WHERE slug=?), ?, ?, ?) ON CONFLICT(provider_id, contact_type, phone) DO UPDATE SET label=excluded.label`);
  const upsertSource = database.prepare(`INSERT INTO data_sources (provider_id, source_name, source_url, source_type, retrieved_at, notes)
    VALUES ((SELECT id FROM providers WHERE slug=?), ?, ?, ?, ?, ?) ON CONFLICT(provider_id, source_url) DO UPDATE SET source_name=excluded.source_name, source_type=excluded.source_type, retrieved_at=excluded.retrieved_at, notes=excluded.notes`);
  const addVerification = database.prepare("INSERT INTO verification_records (provider_id, verified_at, verification_method, verified_by, notes) SELECT id, ?, 'official-web-page', 'MoveIn data review', ? FROM providers WHERE slug=? AND NOT EXISTS (SELECT 1 FROM verification_records vr WHERE vr.provider_id=providers.id AND vr.verified_at=?)");

  for (const row of zipRows) {
    upsertState.run(row.state_code, row.state_name);
    upsertCounty.run(row.state_code, row.county_name);
    upsertCity.run(row.state_code, row.state_code, row.county_name, row.city_name, slugify(row.city_name));
    upsertZip.run(row.zip_code, row.state_code, row.state_code, row.county_name, row.state_code, row.county_name, row.city_name, row.status, Number(row.is_indexable), row.last_verified_at || null, row.confidence_status || row.status, row.jurisdiction_notes || null, row.locality_source_url);
    database.prepare(`INSERT INTO zip_jurisdictions (zip_code_id, city_id, jurisdiction_type, is_confirmed, source_url, notes)
      SELECT z.id, z.primary_city_id, 'primary_mailing_city', 1, ?, ? FROM zip_codes z WHERE z.zip_code=?
      ON CONFLICT(zip_code_id, city_id, jurisdiction_type) DO UPDATE SET source_url=excluded.source_url, notes=excluded.notes`).run(row.locality_source_url, row.jurisdiction_notes || null, row.zip_code);
  }
  for (const row of categoryRows) upsertCategory.run(...row);
  for (const row of providerRows) upsertProvider.run(row.slug, row.name, row.category_slug, row.state_code, row.description, row.official_website, row.service_notes, row.status, Number(row.is_verified), row.last_verified_at || null, row.provider_type || null, row.start_service_url || null, row.address_check_url || null, row.outage_url || null, row.hours || null, row.technology_type || null);
  for (const row of areaRows) upsertArea.run(row.provider_slug, row.zip_code, row.coverage_type, row.coverage_notes, row.confidence_level, Number(row.is_primary), row.service_availability || null, Number(row.requires_address_confirmation || 1), row.jurisdiction_notes || null);
  for (const row of contactRows) upsertContact.run(row.provider_slug, row.contact_type, row.label, row.phone);
  for (const row of sourceRows) {
    upsertSource.run(row.provider_slug, row.source_name, row.source_url, row.source_type, row.retrieved_at, row.notes || null);
    addVerification.run(row.retrieved_at, row.notes || "Verified against official source", row.provider_slug, row.retrieved_at);
  }
});

if (dryRun) console.log(`Dry run: ${zipRows.length} ZIPs, ${providerRows.length} providers, ${areaRows.length} service-area links, ${contactRows.length} contacts, and ${sourceRows.length} sources are ready to import.`);
else importData();
database.close();
if (!dryRun) console.log(`Imported ${zipRows.length} pilot ZIPs, ${providerRows.length} records, and ${areaRows.length} service-area links into ${path}`);

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function assertConfirmedChange(label, existing, incoming) {
  const changed = Object.entries(incoming).some(([key, value]) => (existing[key] ?? null) !== (value ?? null));
  if (changed && !confirmVerified) throw new Error(`${label} would change. Review the diff and rerun with --confirm-verified.`);
}
