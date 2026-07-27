import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";

const configuredPath = process.env.DATABASE_PATH?.trim();
if (configuredPath && !isAbsolute(configuredPath)) {
  throw new Error("DATABASE_PATH must be an absolute filesystem path");
}
export const databasePath = configuredPath ?? join(process.cwd(), "data", "movein.sqlite");

declare global {
  var moveInDatabase: Database.Database | undefined;
}

function initialize(database: Database.Database) {
  database.pragma("journal_mode = WAL");
  database.pragma("busy_timeout = 5000");
  database.exec(`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    source TEXT NOT NULL DEFAULT 'homepage',
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    audience TEXT,
    move_month TEXT,
    state TEXT,
    consent_at INTEGER
  )`);

  const columns = new Set(
    database.prepare("PRAGMA table_info('newsletter_subscribers')").all()
      .map((column) => (column as { name: string }).name),
  );
  const additions = [
    ["audience", "ALTER TABLE newsletter_subscribers ADD COLUMN audience TEXT"],
    ["move_month", "ALTER TABLE newsletter_subscribers ADD COLUMN move_month TEXT"],
    ["state", "ALTER TABLE newsletter_subscribers ADD COLUMN state TEXT"],
    ["consent_at", "ALTER TABLE newsletter_subscribers ADD COLUMN consent_at INTEGER"],
  ] as const;
  for (const [column, statement] of additions) {
    if (!columns.has(column)) database.exec(statement);
  }
}

export function getDatabase() {
  if (!globalThis.moveInDatabase) {
    mkdirSync(dirname(databasePath), { recursive: true });
    const database = new Database(databasePath);
    initialize(database);
    globalThis.moveInDatabase = database;
  }
  return globalThis.moveInDatabase;
}
