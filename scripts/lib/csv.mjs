import { readFile } from "node:fs/promises";

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") { row.push(field); field = ""; }
    else if (character === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (character !== "\r") field += character;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows.shift().map((value) => value.trim());
  return rows.filter((values) => values.some(Boolean)).map((values, rowIndex) =>
    Object.fromEntries(headers.map((header, index) => [header, (values[index] ?? "").trim()]).concat([["__row", String(rowIndex + 2)]])),
  );
}

export async function readCsv(path) {
  return parseCsv(await readFile(path, "utf8"));
}
