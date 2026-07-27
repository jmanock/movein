const baseUrl = (process.env.BASE_URL ?? "http://127.0.0.1:3006").replace(/\/$/, "");

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const paths = [...sitemap.matchAll(/<loc>https:\/\/movein\.guide([^<]*)<\/loc>/g)].map((match) => match[1] || "/");
const failures = [];

for (const path of paths) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  if (response.status !== 200) failures.push({ path, status: response.status });
}

if (failures.length) {
  console.error("Internal canonical routes with non-200 responses:", failures);
  process.exitCode = 1;
} else {
  console.log(`Checked ${paths.length} canonical internal routes: all returned 200.`);
}
