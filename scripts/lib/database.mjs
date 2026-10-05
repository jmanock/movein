import Database from "better-sqlite3";
import { mkdirSync, chmodSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";

export function resolveDatabasePath() {
  const configured = process.env.DATABASE_PATH?.trim();
  if (process.env.NODE_ENV === "production" && !configured) throw new Error("DATABASE_PATH is required in production");
  if (configured && !isAbsolute(configured)) throw new Error("DATABASE_PATH must be absolute");
  return configured || join(process.cwd(), "data", "movein.sqlite");
}

export function openDatabase() {
  const path = resolveDatabasePath();
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const database = new Database(path);
  chmodSync(path, 0o600);
  database.pragma("foreign_keys = ON");
  database.pragma("journal_mode = WAL");
  database.pragma("busy_timeout = 5000");
  return { database, path };
}
