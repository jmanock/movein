export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const allowedAudiences = new Set(["homeowner", "renter", "planning"]);

export type NewsletterPayload = { email?: string; audience?: string; moveMonth?: string; state?: string; website?: string; startedAt?: number };

export function validateNewsletterPayload(body: NewsletterPayload, now = Date.now()) {
  if (body.website) return { ok: true as const, honeypot: true as const };
  if (typeof body.startedAt === "number" && now - body.startedAt < 500) return { ok: false as const, error: "Please wait a moment and try again.", status: 429 };
  const email = body.email?.trim().toLowerCase() ?? "";
  const audience = body.audience?.trim() ?? "";
  if (!emailPattern.test(email)) return { ok: false as const, error: "Enter a valid email address.", status: 400 };
  if (!allowedAudiences.has(audience)) return { ok: false as const, error: "Choose homeowner, renter, or still planning.", status: 400 };
  return { ok: true as const, honeypot: false as const, email, audience, state: body.state?.trim().slice(0, 30) || null, moveMonth: /^\d{4}-\d{2}$/.test(body.moveMonth ?? "") ? body.moveMonth! : null };
}
