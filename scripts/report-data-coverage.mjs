import { openDatabase } from "./lib/database.mjs";

const { database } = openDatabase();
const rows = database.prepare(`SELECT c.name AS county, z.zip_code AS zip, z.status,
  COUNT(DISTINCT CASE WHEN p.id IS NOT NULL THEN sa.provider_id END) AS records,
  COUNT(DISTINCT CASE WHEN pc.slug NOT IN ('internet','local-government','natural-gas') AND p.status!='inactive' THEN pc.slug END) AS utility_categories
  FROM zip_codes z JOIN counties c ON c.id=z.county_id
  LEFT JOIN service_areas sa ON sa.zip_code_id=z.id
  LEFT JOIN providers p ON p.id=sa.provider_id AND p.status!='inactive'
  LEFT JOIN provider_categories pc ON pc.id=p.category_id
  WHERE z.is_active=1 GROUP BY c.name, z.zip_code, z.status ORDER BY c.name, z.zip_code`).all();
console.table(rows);
const totals = database.prepare("SELECT status, COUNT(*) AS zip_count FROM zip_codes WHERE is_active=1 GROUP BY status ORDER BY status").all();
console.table(totals);
const categories = database.prepare(`SELECT pc.name AS category, COUNT(DISTINCT p.id) AS providers,
  COUNT(DISTINCT sa.zip_code_id) AS supported_zips FROM provider_categories pc
  LEFT JOIN providers p ON p.category_id=pc.id AND p.status!='inactive'
  LEFT JOIN service_areas sa ON sa.provider_id=p.id WHERE pc.slug!='natural-gas' GROUP BY pc.id ORDER BY pc.display_order`).all();
console.table(categories);
const missing = database.prepare(`SELECT z.zip_code AS zip,
  GROUP_CONCAT(pc.name, ', ') AS categories_needing_verification
  FROM zip_codes z CROSS JOIN provider_categories pc
  LEFT JOIN service_areas sa ON sa.zip_code_id=z.id
    AND sa.provider_id IN (SELECT id FROM providers WHERE category_id=pc.id AND status!='inactive')
  WHERE z.is_active=1 AND pc.slug NOT IN ('natural-gas','local-government') AND sa.id IS NULL
  GROUP BY z.id ORDER BY z.zip_code`).all();
console.table(missing);
database.close();
