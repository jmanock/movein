import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl = process.env.FRONTEND_AUDIT_URL || "http://127.0.0.1:3006";
const routes = ["/", "/homeowners", "/renters", "/learn-your-area", "/resources", "/faq", "/coverage", "/resources/find-electric-company", "/lookup/32757", "/lookup/32771", "/lookup/99999", "/robots.txt", "/sitemap.xml"];
const failures = [];
const warnings = [];

async function filesUnder(directory) {
  directory = directory instanceof URL ? fileURLToPath(directory) : directory;
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".next", "node_modules", ".git"].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await filesUnder(path)); else output.push(path);
  }
  return output;
}

const sourceFiles = (await filesUnder(new URL("../app", import.meta.url))).filter((file) => /\.(tsx|ts|css)$/.test(file));
const source = (await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")))).join("\n");
if (/lorem ipsum|todo copy|coming soon/i.test(source)) failures.push("Placeholder copy detected");
if (/>\s*(Click here|Learn more|Read more|Go)\s*</i.test(source)) warnings.push("Generic button or link label detected");
if (/<section(?:\s[^>]*)?>\s*<\/section>/i.test(source)) failures.push("Empty page section detected");
if (!/aria-label="Toggle navigation"/.test(source)) failures.push("Mobile navigation is missing its accessible label");
if (!/<label htmlFor=/.test(source)) failures.push("ZIP form label is missing");
if (/cloudflare:|wrangler|vinext|@cloudflare/i.test(source)) failures.push("Cloudflare-specific production code detected");
const clientFiles = await Promise.all(sourceFiles.filter((file) => file.endsWith(".tsx")).map(async (file) => ({ file, text: await readFile(file, "utf8") })));
const clients = clientFiles.filter(({ text }) => text.startsWith('"use client"')).map(({ file }) => relative(new URL("../", import.meta.url).pathname, file));
if (clients.length > 8) warnings.push(`Client component count is ${clients.length}; review bundle impact`);

const images = (await filesUnder(new URL("../public", import.meta.url))).filter((file) => /\.(png|jpe?g|webp|avif)$/i.test(file));
for (const file of images) { const bytes = (await stat(file)).size; if (bytes > 1_000_000) warnings.push(`Oversized image (${Math.round(bytes / 1024)} KB): ${relative(new URL("../", import.meta.url).pathname, file)}`); }

let runtimeAvailable = true;
const internalLinks = new Set();
for (const route of routes) {
  let response;
  try { response = await fetch(`${baseUrl}${route}`, { redirect: "follow" }); } catch { runtimeAvailable = false; break; }
  const html = await response.text();
  if (!response.ok) failures.push(`${route} returned ${response.status}`);
  if (route.endsWith(".txt") || route.endsWith(".xml")) continue;
  for (const match of html.matchAll(/href="(\/[^"#]*)/g)) internalLinks.add(match[1]);
  const h1s = [...html.matchAll(/<h1(?:\s[^>]*)?>/gi)].length;
  if (h1s !== 1) failures.push(`${route} has ${h1s} H1 elements`);
  if (!/<main(?:\s[^>]*)?id="main-content"/.test(html)) failures.push(`${route} has no main content target`);
  if (/<img(?![^>]*\salt=)[^>]*>/i.test(html)) failures.push(`${route} contains an image without alt text`);
  if (route === "/lookup/99999" && !/<meta name="robots" content="noindex/.test(html)) failures.push("Unsupported ZIP page is indexable");
  if (route.startsWith("/resources/") && !/Last reviewed/.test(html)) failures.push(`${route} is missing a reviewed date`);
  if (html.length < 4_000 && !route.includes("lookup/99999")) warnings.push(`${route} may have too little visible value`);
  if (!/<form|class="button|class="text-link|provider-actions|resource-columns|faq-layout/.test(html)) warnings.push(`${route} has no obvious primary action`);
}
if (!runtimeAvailable) warnings.push(`Runtime checks skipped: start the app or set FRONTEND_AUDIT_URL (tried ${baseUrl})`);
if (runtimeAvailable) {
  for (const target of internalLinks) {
    const cleanTarget = target.replaceAll("&amp;", "&");
    const response = await fetch(`${baseUrl}${cleanTarget}`, { redirect: "manual" });
    if (response.status >= 400) failures.push(`Broken internal link: ${cleanTarget} returned ${response.status}`);
  }
}

console.log(`Frontend audit: ${sourceFiles.length} source files, ${routes.length} representative routes, ${internalLinks.size} internal targets, ${clients.length} client components, ${images.length} images`);
for (const warning of warnings) console.log(`WARN  ${warning}`);
for (const failure of failures) console.error(`FAIL  ${failure}`);
if (failures.length) process.exitCode = 1; else console.log("PASS  No serious front-end audit failures");
