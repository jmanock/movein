import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";

const configuredPath = process.env.DATABASE_PATH?.trim();
if (configuredPath && !isAbsolute(configuredPath)) throw new Error("DATABASE_PATH must be an absolute filesystem path");
export const databasePath = configuredPath ?? join(process.cwd(), "data", "movein.sqlite");

declare global {
  var moveInDatabase: Database.Database | undefined;
}

export function getDatabase() {
  if (!globalThis.moveInDatabase) {
    mkdirSync(dirname(databasePath), { recursive: true });
    const database = new Database(databasePath);
    database.pragma("foreign_keys = ON");
    database.pragma("journal_mode = WAL");
    database.pragma("busy_timeout = 5000");
    globalThis.moveInDatabase = database;
  }
  return globalThis.moveInDatabase;
}

export function lookupSchemaExists(database = getDatabase()) {
  return Boolean(database.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='zip_codes'").get());
}
