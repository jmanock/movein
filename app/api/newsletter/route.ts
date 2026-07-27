import { env } from "cloudflare:workers";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };
    const normalized = email?.trim().toLowerCase() ?? "";
    if (!emailPattern.test(normalized)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });

    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL DEFAULT 'homepage',
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )`).run();
    await env.DB.prepare("INSERT OR IGNORE INTO newsletter_subscribers (email, source) VALUES (?, ?)").bind(normalized, "homepage").run();
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "We could not save that email right now." }, { status: 500 });
  }
}
