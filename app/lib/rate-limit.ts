import { createHash } from "node:crypto";

type RequestWindow = { count: number; resetAt: number };
const lookupRequests = new Map<string, RequestWindow>();
const correctionRequests = new Map<string, RequestWindow>();

export function checkLookupRateLimit(request: Request) {
  return checkRateLimit(lookupRequests, request, 120, 60_000);
}

export function checkCorrectionRateLimit(request: Request) {
  return checkRateLimit(correctionRequests, request, 5, 60 * 60_000);
}

function checkRateLimit(store: Map<string, RequestWindow>, request: Request, limit: number, windowMs: number) {
  const raw = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "unknown";
  const key = createHash("sha256").update(raw).digest("hex").slice(0, 16);
  const now = Date.now();
  if (store.size > 10_000) {
    for (const [storedKey, entry] of store) if (entry.resetAt <= now) store.delete(storedKey);
  }
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  return { allowed: current.count <= limit, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}
