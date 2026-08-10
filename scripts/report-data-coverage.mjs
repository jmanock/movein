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
const internetSummary = database.prepare(`WITH internet_counts AS (
  SELECT z.id AS zip_id, COUNT(DISTINCT CASE WHEN pc.slug='internet' THEN p.id END) AS provider_count
  FROM zip_codes z
  LEFT JOIN service_areas sa ON sa.zip_code_id=z.id
  LEFT JOIN providers p ON p.id=sa.provider_id AND p.status!='inactive' AND COALESCE(p.provider_type,'')!='official_lookup'
  LEFT JOIN provider_categories pc ON pc.id=p.category_id
  WHERE z.is_active=1
  GROUP BY z.id
)
SELECT
  (SELECT COUNT(DISTINCT p.id) FROM providers p JOIN provider_categories pc ON pc.id=p.category_id WHERE pc.slug='internet' AND p.status!='inactive' AND COALESCE(p.provider_type,'')!='official_lookup') AS internet_providers,
  (SELECT COUNT(*) FROM service_areas sa JOIN providers p ON p.id=sa.provider_id JOIN provider_categories pc ON pc.id=p.category_id WHERE pc.slug='internet' AND p.status!='inactive' AND COALESCE(p.provider_type,'')!='official_lookup') AS provider_zip_relationships,
  SUM(provider_count>=1) AS zips_with_1_plus,
  SUM(provider_count>=2) AS zips_with_2_plus,
  SUM(provider_count>=3) AS zips_with_3_plus,
  SUM(provider_count>=4) AS zips_with_4_plus,
  SUM(provider_count=1) AS zips_with_only_one,
  SUM(provider_count=0) AS zips_with_none
FROM internet_counts`).get();
console.log("\nInternet coverage");
console.table([internetSummary]);
const internetTechnology = database.prepare(`SELECT p.technology_type AS technologies, COUNT(DISTINCT p.id) AS providers, COUNT(DISTINCT sa.zip_code_id) AS supported_zips
  FROM providers p JOIN provider_categories pc ON pc.id=p.category_id LEFT JOIN service_areas sa ON sa.provider_id=p.id
  WHERE pc.slug='internet' AND p.status!='inactive' AND COALESCE(p.provider_type,'')!='official_lookup'
  GROUP BY p.id ORDER BY p.name`).all();
console.table(internetTechnology);
const missing = database.prepare(`SELECT z.zip_code AS zip,
  GROUP_CONCAT(pc.name, ', ') AS categories_needing_verification
  FROM zip_codes z CROSS JOIN provider_categories pc
  LEFT JOIN service_areas sa ON sa.zip_code_id=z.id
    AND sa.provider_id IN (SELECT id FROM providers WHERE category_id=pc.id AND status!='inactive')
  WHERE z.is_active=1 AND pc.slug NOT IN ('natural-gas','local-government') AND sa.id IS NULL
  GROUP BY z.id ORDER BY z.zip_code`).all();
console.table(missing);
database.close();
