import { getDatabase } from "../../../db";
import { type NewsletterPayload, validateNewsletterPayload } from "../../lib/newsletter";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NewsletterPayload;
    const validation = validateNewsletterPayload(body);
    if (!validation.ok) {
      return Response.json({ error: validation.error }, { status: validation.status });
    }
    if (validation.honeypot) return Response.json({ ok: true }, { status: 201 });

    const database = getDatabase();
    database.prepare(`INSERT INTO newsletter_subscribers
      (email, source, audience, move_month, state, consent_at)
      VALUES (?, ?, ?, ?, ?, unixepoch())
      ON CONFLICT(email) DO UPDATE SET
        audience = excluded.audience,
        move_month = excluded.move_month,
        state = excluded.state,
        consent_at = excluded.consent_at`)
      .run(
        validation.email,
        "movein-homepage",
        validation.audience,
        validation.moveMonth,
        validation.state,
      );
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Newsletter subscription failed", error);
    return Response.json(
      { error: "We couldn’t save that right now. Please try again." },
      { status: 500 },
    );
  }
}
