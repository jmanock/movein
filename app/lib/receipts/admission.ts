import { createHash } from 'node:crypto';
type Entry = { count: number; until: number };
/** One-process MVP bounds. No upload, email or raw IP is retained. Restarts reset these windows. */
export function createReceiptAdmission(now = Date.now) {
  const entries = new Map<string, Entry>();
  let active = false;
  function consume(key: string, limit: number) {
    const time = now();
    for (const [id, entry] of entries) if (entry.until <= time) entries.delete(id);
    let entry = entries.get(key);
    if (!entry) {
      if (entries.size >= 10_000) return 60;
      entry = { count: 0, until: time + 600_000 }; entries.set(key, entry);
    }
    entry.count += 1;
    return entry.count > limit ? Math.max(1, Math.ceil((entry.until - time) / 1000)) : 0;
  }
  return function enter(householdId: string, request: Request) {
    if (process.env.NODE_ENV === 'production') {
      const ip = createHash('sha256').update((request.headers.get('x-real-ip') || 'unknown').slice(0, 200)).digest('hex');
      const retryAfter = consume('ip:'+ip, 10) || consume('household:'+householdId, 5);
      if (retryAfter) return { allowed: false as const, status: 429, retryAfter };
    }
    if (active) return { allowed: false as const, status: 503, retryAfter: 5 };
    active = true;
    let released = false;
    return { allowed: true as const, release() { if (!released) { active = false; released = true; } } };
  };
}
export const enterReceiptProcessing = createReceiptAdmission();
