import { getDatabase, lookupSchemaExists } from "./index.ts";

export type LookupStatus = "verified" | "mostly_verified" | "partial" | "pending";
export type CoverageType = "primary" | "possible" | "address_required" | "varies" | "unverified";
export type ProviderContact = { type: string; label: string; phone: string; phoneHref: string };
export type LookupProvider = {
  name: string;
  slug: string;
  description: string | null;
  officialWebsite: string;
  providerType: string | null;
  startServiceUrl: string | null;
  addressCheckUrl: string | null;
  outageUrl: string | null;
  outageMapUrl: string | null;
  collectionInfoUrl: string | null;
  hours: string | null;
  technologyType: string | null;
  serviceNotes: string | null;
  coverageType: CoverageType;
  coverageLabel: string;
  coverageNotes: string;
  confidenceLevel: string;
  availabilityStatus: string | null;
  requiresAddressConfirmation: boolean;
  jurisdictionNotes: string | null;
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
  confidenceStatus: string;
  jurisdictionNotes: string | null;
  isIndexable: boolean;
  providers: Record<string, LookupProvider[]>;
  lastUpdated: string | null;
  lastLocationReview: string | null;
  disclaimer: string;
};

type LocationRow = { zip_code: string; city: string | null; county: string | null; state: string; state_name: string; status: "verified" | "partial" | "pending"; confidence_status: string | null; jurisdiction_notes: string | null; is_indexable: number; last_verified_at: string | null };
type ProviderRow = { provider_id: number; name: string; slug: string; category_slug: string; description: string | null; official_website: string; provider_type: string | null; start_service_url: string | null; address_check_url: string | null; outage_url: string | null; outage_map_url: string | null; collection_info_url: string | null; hours: string | null; technology_type: string | null; service_notes: string | null; coverage_type: CoverageType; coverage_notes: string; confidence_level: string; service_availability: string | null; requires_address_confirmation: number; jurisdiction_notes: string | null; is_verified: number; last_verified_at: string | null };

export function getLookupResult(zipCode: string): LookupResult | null {
  const database = getDatabase();
  if (!lookupSchemaExists(database)) throw new Error("LOOKUP_DATABASE_NOT_MIGRATED");
  const location = database.prepare(`SELECT z.zip_code, ci.name AS city, c.name AS county, s.code AS state, s.name AS state_name, z.status, z.confidence_status, z.jurisdiction_notes, z.is_indexable, z.last_verified_at
    FROM zip_codes z JOIN states s ON s.id=z.state_id LEFT JOIN counties c ON c.id=z.county_id LEFT JOIN cities ci ON ci.id=z.primary_city_id
    WHERE z.zip_code=? AND z.is_active=1`).get(zipCode) as LocationRow | undefined;
  if (!location) return null;
  const providerRows = database.prepare(`SELECT p.id AS provider_id, p.name, p.slug, pc.slug AS category_slug, p.description, p.official_website, p.provider_type, p.start_service_url, p.address_check_url, p.outage_url, p.outage_map_url, p.collection_info_url, p.hours, p.technology_type, p.service_notes,
    sa.coverage_type, sa.coverage_notes, sa.confidence_level, sa.service_availability, sa.requires_address_confirmation, sa.jurisdiction_notes, p.is_verified, p.last_verified_at
    FROM service_areas sa JOIN providers p ON p.id=sa.provider_id JOIN provider_categories pc ON pc.id=p.category_id JOIN zip_codes z ON z.id=sa.zip_code_id
    WHERE z.zip_code=? AND p.status!='inactive' ORDER BY pc.display_order, sa.is_primary DESC, p.name`).all(zipCode) as ProviderRow[];
  const providers: Record<string, LookupProvider[]> = {};
  for (const row of providerRows) {
    const contacts = database.prepare("SELECT contact_type AS type, label, phone FROM provider_contacts WHERE provider_id=? ORDER BY CASE contact_type WHEN 'outage' THEN 1 WHEN 'emergency' THEN 2 ELSE 3 END").all(row.provider_id) as Array<{ type: string; label: string; phone: string }>;
    const sources = database.prepare("SELECT source_name AS name, source_url AS url, source_type AS type, retrieved_at AS retrievedAt FROM data_sources WHERE provider_id=? ORDER BY retrieved_at DESC").all(row.provider_id) as LookupProvider["sources"];
    (providers[row.category_slug] ??= []).push({
      name: row.name, slug: row.slug, description: row.description, officialWebsite: row.official_website,
      providerType: row.provider_type, startServiceUrl: row.start_service_url, addressCheckUrl: row.address_check_url,
      outageUrl: row.outage_url, outageMapUrl: row.outage_map_url, collectionInfoUrl: row.collection_info_url, hours: row.hours, technologyType: row.technology_type,
      serviceNotes: row.service_notes, coverageType: row.coverage_type, coverageLabel: availabilityLabel(row.service_availability, row.coverage_type),
      coverageNotes: row.coverage_notes, confidenceLevel: row.confidence_level, availabilityStatus: row.service_availability,
      requiresAddressConfirmation: Boolean(row.requires_address_confirmation), jurisdictionNotes: row.jurisdiction_notes, isVerified: Boolean(row.is_verified),
      lastVerifiedAt: row.last_verified_at,
      contacts: contacts.map((contact) => ({ ...contact, phoneHref: `tel:${contact.phone.replace(/\D/g, "")}` })), sources,
    });
  }
  const dates = providerRows.map((row) => row.last_verified_at).filter((date): date is string => Boolean(date)).sort();
  const verifiedCategories = new Set(providerRows.filter((row) => row.is_verified && row.provider_type !== "official_lookup").map((row) => row.category_slug));
  const hasLocalContext = verifiedCategories.has("local-government");
  const hasElectric = verifiedCategories.has("electricity");
  const hasWater = verifiedCategories.has("water");
  const hasSewer = verifiedCategories.has("sewer");
  const hasTrash = verifiedCategories.has("trash-recycling");
  const hasCoreCoverage = hasLocalContext && hasElectric && hasWater && hasSewer && hasTrash;
  const derivedStatus: LookupStatus = providerRows.length === 0 ? "pending" : location.status === "verified" && hasCoreCoverage ? "verified" : hasCoreCoverage ? "mostly_verified" : "partial";
  return {
    zipCode: location.zip_code, city: location.city, county: location.county, state: location.state,
    stateName: location.state_name, status: derivedStatus, confidenceStatus: derivedStatus === "verified" ? "verified" : location.confidence_status ?? derivedStatus,
    jurisdictionNotes: location.jurisdiction_notes, isIndexable: Boolean(location.is_indexable) && (derivedStatus === "verified" || derivedStatus === "mostly_verified"), providers,
    lastUpdated: dates.at(-1) ?? location.last_verified_at ?? null, lastLocationReview: location.last_verified_at,
    disclaimer: "Provider availability can vary by exact street address. Confirm service directly with the provider before opening or transferring an account.",
  };
}

export function coverageLabel(type: CoverageType) {
  return ({ primary: "Primary provider", possible: "Possible provider", address_required: "Address confirmation required", varies: "Coverage varies", unverified: "Not yet verified" } as const)[type];
}

function availabilityLabel(value: string | null, fallback: CoverageType) {
  if (!value) return coverageLabel(fallback);
  return ({ confirmed: "Confirmed for ZIP", primary_municipal: "Primary municipal provider", possible: "Possible provider", multiple_possible: "Multiple providers possible", address_required: "Address confirmation required", varies: "Coverage varies by address", unverified: "Not verified", not_generally_available: "Not generally available" } as Record<string, string>)[value] ?? coverageLabel(fallback);
}

export function isValidZip(value: string) {
  return /^\d{5}$/.test(value);
}
