import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";

export function resolveDatabasePath() {
  const configured = process.env.DATABASE_PATH?.trim();
  if (configured && !isAbsolute(configured)) throw new Error("DATABASE_PATH must be absolute");
  return configured ?? join(process.cwd(), "data", "movein.sqlite");
}

export function openDatabase() {
  const path = resolveDatabasePath();
  mkdirSync(dirname(path), { recursive: true });
  const database = new Database(path);
  database.pragma("foreign_keys = ON");
  database.pragma("journal_mode = WAL");
  database.pragma("busy_timeout = 5000");
  return { database, path };
}
