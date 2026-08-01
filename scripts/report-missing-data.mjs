import { openDatabase } from "./lib/database.mjs";

const { database } = openDatabase();
const rows = database.prepare(`SELECT z.zip_code, ci.name AS city,
  SUM(CASE WHEN pc.slug='electricity' AND COALESCE(p.provider_type,'')!='official_lookup' THEN 1 ELSE 0 END) AS electricity,
  SUM(CASE WHEN pc.slug='water' THEN 1 ELSE 0 END) AS water,
  SUM(CASE WHEN pc.slug='sewer' THEN 1 ELSE 0 END) AS sewer,
  SUM(CASE WHEN pc.slug='trash-recycling' THEN 1 ELSE 0 END) AS trash,
  SUM(CASE WHEN pc.slug='internet' THEN 1 ELSE 0 END) AS internet_guidance,
  SUM(CASE WHEN pc.slug='local-government' THEN 1 ELSE 0 END) AS local_government
  FROM zip_codes z LEFT JOIN cities ci ON ci.id=z.primary_city_id LEFT JOIN service_areas sa ON sa.zip_code_id=z.id
  LEFT JOIN providers p ON p.id=sa.provider_id AND p.status!='inactive' LEFT JOIN provider_categories pc ON pc.id=p.category_id
  WHERE z.is_active=1 GROUP BY z.id ORDER BY z.zip_code`).all();
console.table(rows);
const missingSources = database.prepare(`SELECT p.slug, p.name FROM providers p LEFT JOIN data_sources ds ON ds.provider_id=p.id WHERE p.status!='inactive' GROUP BY p.id HAVING COUNT(ds.id)=0`).all();
const missingPhones = database.prepare(`SELECT p.slug, p.name FROM providers p JOIN provider_categories category ON category.id=p.category_id LEFT JOIN provider_contacts pc ON pc.provider_id=p.id WHERE p.status!='inactive' AND COALESCE(p.provider_type,'')!='official_lookup' AND category.slug NOT IN ('internet','local-government') GROUP BY p.id HAVING COUNT(pc.id)=0`).all();
console.log(`Records missing sources: ${missingSources.length}`); console.table(missingSources);
console.log(`Non-lookup records missing phones: ${missingPhones.length}`); console.table(missingPhones);
database.close();
