import { openDatabase } from "./lib/database.mjs";

const { database } = openDatabase();
const rows = database.prepare(`SELECT c.name AS county, z.zip_code AS zip, z.status,
  COUNT(DISTINCT sa.provider_id) AS records,
  COUNT(DISTINCT CASE WHEN pc.slug NOT IN ('internet','local-government') THEN pc.slug END) AS utility_categories
  FROM zip_codes z JOIN counties c ON c.id=z.county_id
  LEFT JOIN service_areas sa ON sa.zip_code_id=z.id
  LEFT JOIN providers p ON p.id=sa.provider_id
  LEFT JOIN provider_categories pc ON pc.id=p.category_id
  WHERE z.is_active=1 GROUP BY c.name, z.zip_code, z.status ORDER BY c.name, z.zip_code`).all();
console.table(rows);
const totals = database.prepare("SELECT status, COUNT(*) AS zip_count FROM zip_codes WHERE is_active=1 GROUP BY status ORDER BY status").all();
console.table(totals);
database.close();
