export const INTERNET_COMPARISON_KEY = "movein:internet-comparison:v1";
export const INTERNET_COMPARISON_LIMIT = 4;

export type SavedInternetProvider = {
  slug: string;
  providerName: string;
  technologyTypes: string[];
  providerType: "wired" | "fixed-wireless";
  availabilityCheckerUrl: string;
  movingOrTransferUrl?: string;
  lastReviewedAt: string;
  zip?: string;
};

export function parseInternetComparison(value: string | null): SavedInternetProvider[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedProvider).slice(0, INTERNET_COMPARISON_LIMIT);
  } catch { return []; }
}

export function readInternetComparison(storage = browserStorage()) {
  if (!storage) return { providers: [] as SavedInternetProvider[], available: false };
  try { return { providers: parseInternetComparison(storage.getItem(INTERNET_COMPARISON_KEY)), available: true }; }
  catch { return { providers: [] as SavedInternetProvider[], available: false }; }
}

export function saveInternetProvider(provider: SavedInternetProvider, storage = browserStorage()) {
  const current = readInternetComparison(storage).providers;
  const providers = [provider, ...current.filter((item) => item.slug !== provider.slug)].slice(0, INTERNET_COMPARISON_LIMIT);
  return write(providers, storage);
}

export function removeInternetProvider(slug: string, storage = browserStorage()) {
  return write(readInternetComparison(storage).providers.filter((provider) => provider.slug !== slug), storage);
}

export function clearInternetComparison(storage = browserStorage()) { return write([], storage); }

function write(providers: SavedInternetProvider[], storage: Storage | null) {
  if (!storage) return { providers, available: false };
  try { storage.setItem(INTERNET_COMPARISON_KEY, JSON.stringify(providers)); return { providers, available: true }; }
  catch { return { providers, available: false }; }
}

function browserStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage; } catch { return null; }
}

function isSavedProvider(value: unknown): value is SavedInternetProvider {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.slug === "string" && typeof item.providerName === "string" && Array.isArray(item.technologyTypes) && typeof item.availabilityCheckerUrl === "string" && (item.providerType === "wired" || item.providerType === "fixed-wireless");
}
