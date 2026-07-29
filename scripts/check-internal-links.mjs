import { writeFile } from "node:fs/promises";

const baseUrl = (process.env.BASE_URL ?? "http://127.0.0.1:3006").replace(/\/$/, "");
const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const paths = [...sitemap.matchAll(/<loc>https:\/\/movein\.guide([^<]*)<\/loc>/g)].map((match) => match[1] || "/");
const failures = []; const redirects = []; const inbound = new Map(paths.map((route) => [route, 0])); const discovered = new Set();

for (const route of paths) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  if (response.status >= 300 && response.status < 400) redirects.push({ route, status: response.status, location: response.headers.get("location") });
  else if (response.status !== 200) failures.push({ route, status: response.status });
  if (!response.headers.get("content-type")?.includes("text/html")) continue;
  const html = await response.text();
  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const target = match[1].replace(/\/$/, "") || "/";
    if (target.startsWith("/_next") || target.startsWith("/api")) continue;
    discovered.add(target);
    if (inbound.has(target) && target !== route) inbound.set(target, inbound.get(target) + 1);
  }
}

for (const target of discovered) {
  const response = await fetch(`${baseUrl}${target}`, { redirect: "manual" });
  if (response.status >= 400) failures.push({ route: target, status: response.status });
}
const orphans = paths.filter((route) => route !== "/" && (inbound.get(route) ?? 0) === 0);
const report = `# Internal Link Report\n\nGenerated: 2026-07-29\n\nCrawled ${paths.length} canonical sitemap routes and checked ${discovered.size} distinct internal targets against ${baseUrl}.\n\n## Broken targets\n\n${failures.length ? failures.map((item) => `- ${item.route}: HTTP ${item.status}`).join("\n") : "None."}\n\n## Canonical routes that redirect\n\n${redirects.length ? redirects.map((item) => `- ${item.route}: HTTP ${item.status} → ${item.location}`).join("\n") : "None."}\n\n## Sitemap routes with no discovered inbound link\n\n${orphans.length ? orphans.map((route) => `- ${route}`).join("\n") : "None."}\n\nInbound counts intentionally ignore self-links, fragments, and query strings. The HTML sitemap and contextual guide cards are part of the crawl.\n`;
await writeFile(new URL("../docs/internal-link-report.md", import.meta.url), report);
if (failures.length || redirects.length || orphans.length) {
  console.error(`Link audit failed: ${failures.length} broken, ${redirects.length} canonical redirects, ${orphans.length} orphans.`);
  process.exitCode = 1;
} else console.log(`Checked ${paths.length} canonical routes and ${discovered.size} internal targets: no broken links, redirects, or orphans.`);
