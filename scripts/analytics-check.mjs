import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadNextEnvironment } from "./lib/next-env.mjs";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
loadNextEnvironment(root);
const expectedMeasurementId = "G-QC9FYWHVZZ";
const configuredMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
const sourceFiles = await collectFiles(join(root, "app"), (file) => /\.(?:ts|tsx)$/.test(file));
const sources = await Promise.all(sourceFiles.map(async (file) => ({ file, content: await readFile(file, "utf8") })));
const layout = await readFile(join(root, "app", "layout.tsx"), "utf8");
const component = await readFile(join(root, "app", "components", "GoogleAnalytics.tsx"), "utf8");
const analytics = await readFile(join(root, "app", "lib", "analytics.ts"), "utf8");
const productionHtmlPath = join(root, ".next", "server", "app", "index.html");
const productionHtml = await readOptional(productionHtmlPath);
const buildFiles = await collectFiles(join(root, ".next"), (file) => /\.(?:js|html|rsc|txt)$/.test(file));
const buildContainsId = configuredMeasurementId ? await anyFileContains(buildFiles, configuredMeasurementId) : false;
const googleTagSourceCount = countAcross(sources, /https:\/\/www\.googletagmanager\.com\/gtag\/js/g);
const googleAnalyticsMountCount = (layout.match(/<GoogleAnalytics\b/g) ?? []).length;
const conflictingTagCount = countAcross(sources, /GoogleTagManager|GTM-[A-Z0-9]+|@next\/third-parties/g);
const htmlTagReferenceCount = configuredMeasurementId && productionHtml ? (productionHtml.match(new RegExp(`googletagmanager\\.com/gtag/js\\?id=${configuredMeasurementId}`, "g")) ?? []).length : 0;
const blockedKeys = ["email", "reply_email", "street_address", "exact_address", "phone_number", "account_number", "notes", "description", "ssn", "amount", "cost", "rent", "deposit", "lease_details"];

const checks = [
  ["Measurement ID configured", Boolean(configuredMeasurementId), configuredMeasurementId || "MISSING"],
  ["Measurement ID format", /^G-[A-Z0-9]+$/.test(configuredMeasurementId), "expected G-*"],
  ["Expected MoveIn measurement ID", configuredMeasurementId === expectedMeasurementId, expectedMeasurementId],
  ["Root integration", googleAnalyticsMountCount === 1 && layout.includes("NEXT_PUBLIC_GA_MEASUREMENT_ID"), `${googleAnalyticsMountCount} root mount(s)`],
  ["Duplicate tag check", googleTagSourceCount === 1 && conflictingTagCount === 0, `${googleTagSourceCount} Google tag source(s); ${conflictingTagCount} conflict(s)`],
  ["Production bundle check", buildContainsId, buildContainsId ? "measurement ID found" : "run a production build with the environment configured"],
  ["Production HTML check", htmlTagReferenceCount === 1, `${htmlTagReferenceCount} enabled tag reference(s)`],
  ["Manual page-view control", component.includes("send_page_view: false") && component.includes("nextPageView") && component.includes("trackPageView"), "one path-deduplicated owner"],
  ["Custom event layer", analytics.includes("export function trackEvent") && analytics.includes("sanitizeParameters"), "typed shared utility"],
  ["Privacy blocklist", blockedKeys.every((key) => analytics.includes(`\"${key}\"`)), "required sensitive keys blocked"],
];

const passed = checks.every(([, pass]) => pass);
const lines = [
  "# GA4 configuration check",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## GA4 CONFIGURATION",
  "",
  `Measurement ID configured: ${configuredMeasurementId ? "YES" : "NO"}`,
  `Measurement ID: ${configuredMeasurementId || "MISSING"}`,
  ...checks.slice(1).map(([name, pass, detail]) => `${name}: ${pass ? "PASS" : "FAIL"} (${detail})`),
  "",
  `Overall: ${passed ? "PASS" : "FAIL"}`,
  "",
  "The check reads local source and the existing production build. It does not contact Google or send an analytics event.",
];

console.log(lines.slice(4, -2).join("\n"));
await mkdir(join(root, "runtime-reports"), { recursive: true });
await writeFile(join(root, "runtime-reports", "analytics-check.md"), `${lines.join("\n")}\n`);
if (!passed) process.exitCode = 1;

async function collectFiles(directory, include) {
  const files = [];
  try {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) files.push(...await collectFiles(file, include));
      else if (include(file)) files.push(file);
    }
  } catch { return []; }
  return files;
}

async function readOptional(file) {
  try { return await readFile(file, "utf8"); } catch { return ""; }
}

async function anyFileContains(files, value) {
  for (const file of files) if ((await readOptional(file)).includes(value)) return true;
  return false;
}

function countAcross(files, pattern) {
  return files.reduce((count, item) => count + (item.content.match(pattern) ?? []).length, 0);
}
