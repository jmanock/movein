import { getDatabase, lookupSchemaExists } from "./index.ts";

export type LookupStatus = "verified" | "partial" | "pending";
export type CoverageType = "primary" | "possible" | "address_required" | "varies" | "unverified";
export type ProviderContact = { type: string; label: string; phone: string; phoneHref: string };
export type LookupProvider = {
  name: string;
  slug: string;
  description: string | null;
  officialWebsite: string;
  serviceNotes: string | null;
  coverageType: CoverageType;
  coverageLabel: string;
  coverageNotes: string;
  confidenceLevel: string;
  isVerified: boolean;
  lastVerifiedAt: string | null;
  contacts: ProviderContact[];
  sources: Array<{ name: string; url: string; type: string; retrievedAt: string }>;
};
export type LookupResult = {
  zipCode: string;
  city: string | null;
  county: string | null;
  state: string;
  stateName: string;
  status: LookupStatus;
  isIndexable: boolean;
  providers: Record<string, LookupProvider[]>;
  lastUpdated: string | null;
  disclaimer: string;
};

type LocationRow = { zip_code: string; city: string | null; county: string | null; state: string; state_name: string; status: LookupStatus; is_indexable: number };
type ProviderRow = { provider_id: number; name: string; slug: string; category_slug: string; description: string | null; official_website: string; service_notes: string | null; coverage_type: CoverageType; coverage_notes: string; confidence_level: string; is_verified: number; last_verified_at: string | null };

export function getLookupResult(zipCode: string): LookupResult | null {
  const database = getDatabase();
  if (!lookupSchemaExists(database)) throw new Error("LOOKUP_DATABASE_NOT_MIGRATED");
  const location = database.prepare(`SELECT z.zip_code, ci.name AS city, c.name AS county, s.code AS state, s.name AS state_name, z.status, z.is_indexable
    FROM zip_codes z JOIN states s ON s.id=z.state_id LEFT JOIN counties c ON c.id=z.county_id LEFT JOIN cities ci ON ci.id=z.primary_city_id
    WHERE z.zip_code=? AND z.is_active=1`).get(zipCode) as LocationRow | undefined;
  if (!location) return null;
  const providerRows = database.prepare(`SELECT p.id AS provider_id, p.name, p.slug, pc.slug AS category_slug, p.description, p.official_website, p.service_notes,
    sa.coverage_type, sa.coverage_notes, sa.confidence_level, p.is_verified, p.last_verified_at
    FROM service_areas sa JOIN providers p ON p.id=sa.provider_id JOIN provider_categories pc ON pc.id=p.category_id JOIN zip_codes z ON z.id=sa.zip_code_id
    WHERE z.zip_code=? AND p.status!='inactive' ORDER BY pc.display_order, sa.is_primary DESC, p.name`).all(zipCode) as ProviderRow[];
  const providers: Record<string, LookupProvider[]> = {};
  for (const row of providerRows) {
    const contacts = database.prepare("SELECT contact_type AS type, label, phone FROM provider_contacts WHERE provider_id=? ORDER BY CASE contact_type WHEN 'outage' THEN 1 WHEN 'emergency' THEN 2 ELSE 3 END").all(row.provider_id) as Array<{ type: string; label: string; phone: string }>;
    const sources = database.prepare("SELECT source_name AS name, source_url AS url, source_type AS type, retrieved_at AS retrievedAt FROM data_sources WHERE provider_id=? ORDER BY retrieved_at DESC").all(row.provider_id) as LookupProvider["sources"];
    (providers[row.category_slug] ??= []).push({
      name: row.name, slug: row.slug, description: row.description, officialWebsite: row.official_website,
      serviceNotes: row.service_notes, coverageType: row.coverage_type, coverageLabel: coverageLabel(row.coverage_type),
      coverageNotes: row.coverage_notes, confidenceLevel: row.confidence_level, isVerified: Boolean(row.is_verified),
      lastVerifiedAt: row.last_verified_at,
      contacts: contacts.map((contact) => ({ ...contact, phoneHref: `tel:${contact.phone.replace(/\D/g, "")}` })), sources,
    });
  }
  const dates = providerRows.map((row) => row.last_verified_at).filter((date): date is string => Boolean(date)).sort();
  return {
    zipCode: location.zip_code, city: location.city, county: location.county, state: location.state,
    stateName: location.state_name, status: location.status, isIndexable: Boolean(location.is_indexable), providers,
    lastUpdated: dates.at(-1) ?? null,
    disclaimer: "ZIP codes do not match utility territories exactly. These are possible providers or official starting points; confirm service for your exact address.",
  };
}

export function coverageLabel(type: CoverageType) {
  return ({ primary: "Primary provider", possible: "Possible provider", address_required: "Confirm by address", varies: "Coverage varies", unverified: "Not currently verified" } as const)[type];
}

export function isValidZip(value: string) {
  return /^\d{5}$/.test(value);
}
