import { openDatabase } from "./lib/database.mjs";

const days = Number(process.env.STALE_AFTER_DAYS ?? 180);
if (!Number.isInteger(days) || days < 1) throw new Error("STALE_AFTER_DAYS must be a positive integer");
const { database } = openDatabase();
const stale = database.prepare(`SELECT p.slug, p.name, p.last_verified_at,
  CAST(julianday('now') - julianday(p.last_verified_at) AS INTEGER) AS age_days
  FROM providers p WHERE p.status != 'inactive' AND (p.last_verified_at IS NULL OR julianday('now') - julianday(p.last_verified_at) > ?)
  ORDER BY p.last_verified_at`).all(days);
console.table(stale);
console.log(stale.length ? `${stale.length} records need review.` : `No records are older than ${days} days.`);
database.close();
