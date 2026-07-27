import { env } from "cloudflare:workers";
import { type NewsletterPayload, validateNewsletterPayload } from "../../lib/newsletter";

async function ensureSchema() {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    source TEXT NOT NULL DEFAULT 'homepage',
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    audience TEXT,
    move_month TEXT,
    state TEXT,
    consent_at INTEGER
  )`).run();
  const result = await env.DB.prepare("PRAGMA table_info('newsletter_subscribers')").all<{ name: string }>();
  const columns = new Set(result.results.map((column) => column.name));
  const missing = [
    ["audience", "ALTER TABLE newsletter_subscribers ADD COLUMN audience TEXT"],
    ["move_month", "ALTER TABLE newsletter_subscribers ADD COLUMN move_month TEXT"],
    ["state", "ALTER TABLE newsletter_subscribers ADD COLUMN state TEXT"],
    ["consent_at", "ALTER TABLE newsletter_subscribers ADD COLUMN consent_at INTEGER"],
  ].filter(([name]) => !columns.has(name));
  if (missing.length) await env.DB.batch(missing.map(([, sql]) => env.DB.prepare(sql)));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NewsletterPayload;
    const validation = validateNewsletterPayload(body);
    if (!validation.ok) return Response.json({ error: validation.error }, { status: validation.status });
    if (validation.honeypot) return Response.json({ ok: true }, { status: 201 });

    await ensureSchema();
    await env.DB.prepare(`INSERT INTO newsletter_subscribers (email, source, audience, move_month, state, consent_at)
      VALUES (?, ?, ?, ?, ?, unixepoch())
      ON CONFLICT(email) DO UPDATE SET audience = excluded.audience, move_month = excluded.move_month, state = excluded.state, consent_at = excluded.consent_at`)
      .bind(validation.email, "movein-homepage", validation.audience, validation.moveMonth, validation.state).run();
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "We couldn’t save that right now. Please try again." }, { status: 500 });
  }
}
