import { join } from "node:path";
import { openDatabase } from "./lib/database.mjs";
import { readCsv } from "./lib/csv.mjs";

const root = join(process.cwd(), "data", "florida");
const [zipRows, providerRows, areaRows, contactRows, sourceRows] = await Promise.all([
  readCsv(join(root, "florida-zip-codes.csv")),
  readCsv(join(root, "florida-providers.csv")),
  readCsv(join(root, "florida-service-areas.csv")),
  readCsv(join(root, "florida-provider-contacts.csv")),
  readCsv(join(root, "florida-data-sources.csv")),
]);

const { database, path } = openDatabase();
const hasSchema = database.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='zip_codes'").get();
if (!hasSchema) throw new Error("Lookup schema is missing. Run npm run db:migrate first.");

const categoryRows = [
  ["electricity", "Electricity", 10], ["water", "Water", 20], ["sewer", "Sewer", 30],
  ["natural-gas", "Natural gas", 40], ["internet", "Internet", 50],
  ["trash-recycling", "Trash & recycling", 60], ["local-government", "Local information", 70],
];

const importData = database.transaction(() => {
  const upsertState = database.prepare("INSERT INTO states (code, name, is_active) VALUES (?, ?, 1) ON CONFLICT(code) DO UPDATE SET name=excluded.name, is_active=1");
  const upsertCounty = database.prepare("INSERT INTO counties (state_id, name) VALUES ((SELECT id FROM states WHERE code=?), ?) ON CONFLICT(state_id, name) DO NOTHING");
  const upsertCity = database.prepare("INSERT INTO cities (state_id, county_id, name, slug) VALUES ((SELECT id FROM states WHERE code=?), (SELECT c.id FROM counties c JOIN states s ON s.id=c.state_id WHERE s.code=? AND c.name=?), ?, ?) ON CONFLICT(state_id, county_id, name) DO UPDATE SET slug=excluded.slug");
  const upsertZip = database.prepare(`INSERT INTO zip_codes (zip_code, state_id, county_id, primary_city_id, status, is_indexable, is_active, locality_source_url)
    VALUES (?, (SELECT id FROM states WHERE code=?), (SELECT c.id FROM counties c JOIN states s ON s.id=c.state_id WHERE s.code=? AND c.name=?), (SELECT ci.id FROM cities ci JOIN states s ON s.id=ci.state_id JOIN counties c ON c.id=ci.county_id WHERE s.code=? AND c.name=? AND ci.name=?), ?, ?, 1, ?)
    ON CONFLICT(zip_code) DO UPDATE SET state_id=excluded.state_id, county_id=excluded.county_id, primary_city_id=excluded.primary_city_id, status=excluded.status, is_indexable=excluded.is_indexable, is_active=1, locality_source_url=excluded.locality_source_url`);
  const upsertCategory = database.prepare("INSERT INTO provider_categories (slug, name, display_order) VALUES (?, ?, ?) ON CONFLICT(slug) DO UPDATE SET name=excluded.name, display_order=excluded.display_order");
  const upsertProvider = database.prepare(`INSERT INTO providers (slug, name, category_id, state_id, description, official_website, service_notes, status, is_verified, last_verified_at)
    VALUES (?, ?, (SELECT id FROM provider_categories WHERE slug=?), (SELECT id FROM states WHERE code=?), ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET name=excluded.name, category_id=excluded.category_id, state_id=excluded.state_id, description=excluded.description, official_website=excluded.official_website, service_notes=excluded.service_notes, status=excluded.status, is_verified=excluded.is_verified, last_verified_at=excluded.last_verified_at`);
  const upsertArea = database.prepare(`INSERT INTO service_areas (provider_id, zip_code_id, coverage_type, coverage_notes, confidence_level, is_primary)
    VALUES ((SELECT id FROM providers WHERE slug=?), (SELECT id FROM zip_codes WHERE zip_code=?), ?, ?, ?, ?)
    ON CONFLICT(provider_id, zip_code_id) DO UPDATE SET coverage_type=excluded.coverage_type, coverage_notes=excluded.coverage_notes, confidence_level=excluded.confidence_level, is_primary=excluded.is_primary`);
  const upsertContact = database.prepare(`INSERT INTO provider_contacts (provider_id, contact_type, label, phone)
    VALUES ((SELECT id FROM providers WHERE slug=?), ?, ?, ?) ON CONFLICT(provider_id, contact_type, phone) DO UPDATE SET label=excluded.label`);
  const upsertSource = database.prepare(`INSERT INTO data_sources (provider_id, source_name, source_url, source_type, retrieved_at, notes)
    VALUES ((SELECT id FROM providers WHERE slug=?), ?, ?, ?, ?, ?) ON CONFLICT(provider_id, source_url) DO UPDATE SET source_name=excluded.source_name, source_type=excluded.source_type, retrieved_at=excluded.retrieved_at, notes=excluded.notes`);
  const addVerification = database.prepare("INSERT INTO verification_records (provider_id, verified_at, verification_method, verified_by, notes) SELECT id, ?, 'official-web-page', 'MoveIn data review', ? FROM providers WHERE slug=? AND NOT EXISTS (SELECT 1 FROM verification_records vr WHERE vr.provider_id=providers.id AND vr.verified_at=?)");

  for (const row of zipRows) {
    upsertState.run(row.state_code, row.state_name);
    upsertCounty.run(row.state_code, row.county_name);
    upsertCity.run(row.state_code, row.state_code, row.county_name, row.city_name, slugify(row.city_name));
    upsertZip.run(row.zip_code, row.state_code, row.state_code, row.county_name, row.state_code, row.county_name, row.city_name, row.status, Number(row.is_indexable), row.locality_source_url);
  }
  for (const row of categoryRows) upsertCategory.run(...row);
  for (const row of providerRows) upsertProvider.run(row.slug, row.name, row.category_slug, row.state_code, row.description, row.official_website, row.service_notes, row.status, Number(row.is_verified), row.last_verified_at || null);
  for (const row of areaRows) upsertArea.run(row.provider_slug, row.zip_code, row.coverage_type, row.coverage_notes, row.confidence_level, Number(row.is_primary));
  for (const row of contactRows) upsertContact.run(row.provider_slug, row.contact_type, row.label, row.phone);
  for (const row of sourceRows) {
    upsertSource.run(row.provider_slug, row.source_name, row.source_url, row.source_type, row.retrieved_at, row.notes || null);
    addVerification.run(row.retrieved_at, row.notes || "Verified against official source", row.provider_slug, row.retrieved_at);
  }
});

importData();
database.close();
console.log(`Imported ${zipRows.length} pilot ZIPs, ${providerRows.length} records, and ${areaRows.length} service-area links into ${path}`);

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
