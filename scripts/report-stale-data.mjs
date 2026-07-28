import { openDatabase } from "./lib/database.mjs";

const days = Number(process.env.STALE_AFTER_DAYS ?? 180);
if (!Number.isInteger(days) || days < 1) throw new Error("STALE_AFTER_DAYS must be a positive integer");
const { database } = openDatabase();
const stale = database.prepare(`SELECT 'provider' AS record_type, p.slug AS identifier, p.name, p.last_verified_at,
  CAST(julianday('now') - julianday(p.last_verified_at) AS INTEGER) AS age_days
  FROM providers p WHERE p.status != 'inactive' AND (p.last_verified_at IS NULL OR julianday('now') - julianday(p.last_verified_at) > ?)
  ORDER BY p.last_verified_at`).all(days);
console.table(stale);
const staleZips = database.prepare(`SELECT 'zip' AS record_type, z.zip_code AS identifier, ci.name,
  z.last_verified_at, CAST(julianday('now') - julianday(z.last_verified_at) AS INTEGER) AS age_days
  FROM zip_codes z LEFT JOIN cities ci ON ci.id=z.primary_city_id
  WHERE z.is_active=1 AND (z.last_verified_at IS NULL OR julianday('now') - julianday(z.last_verified_at) > ?)
  ORDER BY z.last_verified_at`).all(days);
console.table(staleZips);
const total = stale.length + staleZips.length;
console.log(total ? `${total} records need review.` : `No provider or ZIP records are older than ${days} days.`);
database.close();
