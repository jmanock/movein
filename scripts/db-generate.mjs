import { readdir } from "node:fs/promises";
import { join } from "node:path";

const files = (await readdir(join(process.cwd(), "db", "migrations"))).filter((name) => name.endsWith(".sql")).sort();
if (!files.length) throw new Error("No SQL migrations found");
console.log(`Migration source is explicit SQL. Found ${files.length}: ${files.join(", ")}`);
