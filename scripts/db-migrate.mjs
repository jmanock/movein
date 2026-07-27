import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { openDatabase } from "./lib/database.mjs";

const { database, path } = openDatabase();
database.exec("CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
const migrations = (await readdir(join(process.cwd(), "db", "migrations"))).filter((name) => name.endsWith(".sql")).sort();
const applied = new Set(database.prepare("SELECT name FROM schema_migrations").all().map(({ name }) => name));
const apply = database.transaction((name, sql) => {
  database.exec(sql);
  database.prepare("INSERT INTO schema_migrations (name) VALUES (?)").run(name);
});
for (const name of migrations) {
  if (applied.has(name)) continue;
  apply(name, await readFile(join(process.cwd(), "db", "migrations", name), "utf8"));
  console.log(`Applied ${name}`);
}
database.close();
console.log(`Database is current: ${path}`);
