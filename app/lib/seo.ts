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
  const candidates = getIndexableZipResults().filter((candidate) => candidate.zipCode !== result.zipCode);
  const preferred = relatedZipClusters[result.zipCode] ?? [];
  return candidates
    .filter((candidate) => candidate.county === result.county)
    .sort((a, b) => {
      const preferredA = preferred.indexOf(a.zipCode); const preferredB = preferred.indexOf(b.zipCode);
      if (preferredA !== -1 || preferredB !== -1) return (preferredA === -1 ? 999 : preferredA) - (preferredB === -1 ? 999 : preferredB);
      const sameCityA = a.city === result.city ? 0 : 1; const sameCityB = b.city === result.city ? 0 : 1;
      return sameCityA - sameCityB || a.zipCode.localeCompare(b.zipCode);
    })
    .slice(0, limit)
    .map((candidate) => ({ zipCode: candidate.zipCode, city: candidate.city!, county: candidate.county! }));
}

const relatedZipClusters: Record<string, string[]> = {
  "32720": ["32724", "32114", "32117"],
  "32757": ["32726", "34748", "34788"],
  "32726": ["32757", "34748", "34788"],
  "34748": ["34788", "32757", "34711"],
  "32801": ["32803", "32804", "32806"],
  "32746": ["32771", "32773", "32703"],
  "34769": ["34771", "34772", "34743"],
  "32809": ["32806", "32801", "32803"],
  "34771": ["34769", "34772", "34743"],
  "34772": ["34769", "34771", "34743"],
};
