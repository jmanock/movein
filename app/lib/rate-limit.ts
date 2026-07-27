import { createHash } from "node:crypto";

const requests = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const LIMIT = 120;

export function checkLookupRateLimit(request: Request) {
  const raw = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "unknown";
  const key = createHash("sha256").update(raw).digest("hex").slice(0, 16);
  const now = Date.now();
  const current = requests.get(key);
  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  return { allowed: current.count <= LIMIT, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}
