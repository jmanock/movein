import type { CompletionMap } from "./progress";

export const TIMELINE_STORAGE_KEY = "movein.timeline.v1";

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function loadCompletion(storage: StorageLike): CompletionMap {
  try {
    const raw = storage.getItem(TIMELINE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => typeof value === "boolean")) as CompletionMap;
  } catch {
    return {};
  }
}

export function saveCompletion(storage: StorageLike, completion: CompletionMap) {
  storage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(completion));
}

export function clearCompletion(storage: StorageLike) {
  storage.removeItem(TIMELINE_STORAGE_KEY);
}
