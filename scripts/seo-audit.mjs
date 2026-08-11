import { readFile } from "node:fs/promises";
import { publicPages } from "../app/data/pages.ts";
import { guides, guidesByPath } from "../app/data/guides.ts";
import { getIndexableZipResults } from "../app/lib/seo.ts";
import { writeRuntimeReport } from "./lib/runtime-reports.mjs";

const errors = []; const warnings = []; const runtimeRows = [];
const unique = (field) => {
  const seen = new Map();
  for (const page of publicPages) {
    const value = page[field].trim().toLowerCase();
    if (seen.has(value)) errors.push(`Duplicate ${field}: ${seen.get(value)} and ${page.path}`);
    else seen.set(value, page.path);
  }
};
for (const field of ["title", "description", "h1"]) unique(field);
for (const page of publicPages) {
  if (!page.path.startsWith("/")) errors.push(`Non-canonical path: ${page.path}`);
  const renderedTitle = page.title.includes("MoveIn") ? page.title : `${page.title} | MoveIn`;
  if (renderedTitle.length < 10 || renderedTitle.length > 65) warnings.push(`${page.path} rendered title length is ${renderedTitle.length}`);
  if (page.description.length < 70 || page.description.length > 170) warnings.push(`${page.path} description length is ${page.description.length}`);
}
for (const guide of guides) {
  if (!guide.published || !guide.reviewed) errors.push(`${guide.path} lacks content dates`);
  if (guide.sections.length < 3) errors.push(`${guide.path} has fewer than three substantive sections`);
  for (const related of guide.related) if (!guidesByPath.has(related)) errors.push(`${guide.path} links to missing guide ${related}`);
}
const [metadataSource, sitemapSource, robotsSource, breadcrumbSource, lookupSource, homeSource, resourcesSource] = await Promise.all([
  readFile(new URL("../app/lib/metadata.ts", import.meta.url), "utf8"), readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"), readFile(new URL("../app/robots.ts", import.meta.url), "utf8"), readFile(new URL("../app/components/PageHero.tsx", import.meta.url), "utf8"), readFile(new URL("../app/lookup/[zip]/page.tsx", import.meta.url), "utf8"), readFile(new URL("../app/page.tsx", import.meta.url), "utf8"), readFile(new URL("../app/resources/page.tsx", import.meta.url), "utf8"),
]);
if (!metadataSource.includes("alternates: { canonical }")) errors.push("Metadata helper lacks canonical output");
if (!metadataSource.includes("/og?title=")) errors.push("Metadata helper lacks route-specific social cards");
if (!sitemapSource.includes("getIndexableZipResults")) errors.push("Sitemap bypasses the ZIP quality gate");
if (!robotsSource.includes('sitemap: `${SITE_URL}/sitemap.xml`')) errors.push("robots.ts lacks sitemap declaration");
if (!breadcrumbSource.includes('"BreadcrumbList"')) errors.push("Breadcrumb schema is missing");
if (!lookupSource.includes("isZipResultIndexable")) errors.push("ZIP metadata bypasses the quality gate");
if (!lookupSource.includes('"@type": "WebPage"')) errors.push("ZIP pages lack factual WebPage schema");
if (lookupSource.includes('"@type": "Service"')) errors.push("ZIP pages must not imply that MoveIn supplies utility service");
if (!homeSource.includes("SearchAction")) errors.push("Homepage lacks SearchAction schema for the working ZIP lookup route");
if (!resourcesSource.includes("CollectionPage")) errors.push("Resource hub lacks CollectionPage schema");

let zipCount = 0;
try { zipCount = getIndexableZipResults().length; } catch (error) { warnings.push(`Database-backed ZIP audit unavailable: ${error.message}`); }

const baseUrl = process.env.SEO_BASE_URL?.replace(/\/$/, "");
if (baseUrl) {
  const paths = [...publicPages.map((page) => page.path), ...getIndexableZipResults().map((result) => `/lookup/${result.zipCode}`), "/robots.txt", "/sitemap.xml"];
  for (const path of paths) {
    const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
    const row = { path, status: response.status };
    if (response.status !== 200) errors.push(`${path} returned ${response.status}`);
    if (response.headers.get("content-type")?.includes("text/html")) {
      const html = await response.text();
      row.h1 = (html.match(/<h1[ >]/g) ?? []).length;
      row.canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "missing";
      row.title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "missing";
      if (row.h1 !== 1) errors.push(`${path} has ${row.h1} H1 elements`);
      if (row.canonical === "missing") errors.push(`${path} lacks a canonical`);
      if (!html.includes("application/ld+json")) warnings.push(`${path} has no JSON-LD`);
    }
    runtimeRows.push(row);
  }
  for (const special of ["/lookup?zip=32771", "/corrections?zip=32771"]) {
    const response = await fetch(`${baseUrl}${special}`, { redirect: "manual" });
    if (special.startsWith("/lookup") && response.status !== 307 && response.status !== 308) errors.push(`${special} did not redirect to its clean ZIP URL`);
    if (special.startsWith("/corrections") && response.status !== 200) errors.push(`${special} returned ${response.status}`);
  }
}

const report = `# SEO Validation Report\n\nGenerated: 2026-07-29\n\n## Scope\n\n- ${publicPages.length} manifest-backed public pages\n- ${guides.length} substantive guides\n- ${zipCount} database-backed ZIP pages that pass the indexability gate\n- metadata, canonicals, H1s, schema hooks, sitemap/robots integration, related-guide targets, and content dates\n${baseUrl ? `- runtime crawl against ${baseUrl}` : "- static mode; set SEO_BASE_URL to add the runtime crawl"}\n\n## Blocking findings\n\n${errors.length ? errors.map((item) => `- ${item}`).join("\n") : "None."}\n\n## Warnings\n\n${warnings.length ? warnings.map((item) => `- ${item}`).join("\n") : "None."}\n\n## Runtime results\n\n${runtimeRows.length ? `| Route | Status | H1 | Canonical |\n| --- | ---: | ---: | --- |\n${runtimeRows.map((row) => `| ${row.path} | ${row.status} | ${row.h1 ?? "—"} | ${row.canonical ?? "—"} |`).join("\n")}` : "Not run in static mode."}\n`;
await writeRuntimeReport("seo-validation-report.md", report.replace("Generated: 2026-07-29", `Generated: ${new Date().toISOString().slice(0, 10)}`));
console.log(`SEO audit: ${errors.length} error(s), ${warnings.length} warning(s).`);
if (errors.length) process.exitCode = 1;
