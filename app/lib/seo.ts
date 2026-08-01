import type { LookupResult } from "../../db/lookup.ts";
import { getActiveZipCodes, getLookupResult, isValidZip } from "../../db/lookup.ts";

export function isZipResultIndexable(result: LookupResult | null): boolean {
  if (!result || !isValidZip(result.zipCode) || !result.city || !result.county || !result.lastLocationReview || !result.isIndexable) return false;
  if (!["verified", "mostly_verified"].includes(result.status)) return false;
  const realProviders = Object.entries(result.providers).flatMap(([category, providers]) => providers.filter((provider) => provider.providerType !== "official_lookup" && provider.isVerified && provider.sources.length).map(() => category));
  const categories = new Set(realProviders);
  const major = categories.has("electricity") || categories.has("water") || categories.has("sewer");
  return categories.size >= 2 || (major && categories.has("local-government"));
}

export function getIndexableZipResults() {
  return getActiveZipCodes()
    .map((zip) => { try { return getLookupResult(zip); } catch { return null; } })
    .filter((result): result is LookupResult => Boolean(result))
    .filter(isZipResultIndexable);
}

export function getCoverageResults() {
  return getActiveZipCodes().map((zip) => { try { return getLookupResult(zip); } catch { return null; } }).filter((result): result is LookupResult => Boolean(result));
}

export function getRelatedAreas(result: LookupResult, limit = 3) {
  return getIndexableZipResults().filter((candidate) => candidate.zipCode !== result.zipCode && candidate.county === result.county).slice(0, limit).map((candidate) => ({ zipCode: candidate.zipCode, city: candidate.city!, county: candidate.county! }));
}
