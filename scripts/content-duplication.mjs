import { writeFile } from "node:fs/promises";
import { guides } from "../app/data/guides.ts";
import { zipMoveOverviews } from "../app/data/local-resources.ts";
import { publicPages } from "../app/data/pages.ts";
import { supportedPilotZips } from "../app/data/site.ts";

const findings = [];
const pairs = (items) => items.flatMap((item, index) => items.slice(index + 1).map((other) => [item, other]));
const normalized = (value) => value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const tokens = (value) => new Set(normalized(value).split(" ").filter((word) => word.length > 2));
const similarity = (left, right) => {
  const a = tokens(left); const b = tokens(right);
  const intersection = [...a].filter((word) => b.has(word)).length;
  return intersection / Math.max(1, new Set([...a, ...b]).size);
};

for (const field of ["title", "description", "h1"]) {
  const seen = new Map();
  for (const page of publicPages) {
    const value = normalized(page[field]);
    if (seen.has(value)) findings.push({ level: "error", check: `duplicate ${field}`, pages: [seen.get(value), page.path], score: 1 });
    else seen.set(value, page.path);
  }
}

for (const [left, right] of pairs(guides)) {
  const leftBody = `${left.directAnswer} ${left.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.steps ?? [])]).join(" ")}`;
  const rightBody = `${right.directAnswer} ${right.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.steps ?? [])]).join(" ")}`;
  const score = similarity(leftBody, rightBody);
  if (score >= .72) findings.push({ level: score >= .88 ? "error" : "warning", check: "near-duplicate guide copy", pages: [left.path, right.path], score });
}
for (const zip of supportedPilotZips) if (!zipMoveOverviews[zip]) findings.push({ level: "error", check: "missing ZIP-specific moving overview", pages: [`/lookup/${zip}`], score: 1 });
for (const [[leftZip, leftCopy], [rightZip, rightCopy]] of pairs(Object.entries(zipMoveOverviews))) {
  const score = similarity(leftCopy, rightCopy);
  if (score >= .72) findings.push({ level: score >= .88 ? "error" : "warning", check: "near-duplicate ZIP overview", pages: [`/lookup/${leftZip}`, `/lookup/${rightZip}`], score });
}

const errors = findings.filter((finding) => finding.level === "error");
const report = `# Content Duplication Report\n\nGenerated: 2026-08-01\n\n## Scope\n\nChecked ${publicPages.length} public-page titles, descriptions, and H1s, ${guides.length} guide bodies, and ${Object.keys(zipMoveOverviews).length} ZIP-specific moving overviews using normalized exact matching and Jaccard token similarity. Shared navigation, legal disclaimers, provider data, and reusable CTA copy are excluded from body comparison.\n\n## Result\n\n${findings.length ? findings.map((finding) => `- **${finding.level.toUpperCase()}** ${finding.check}: ${finding.pages.join(" and ")} (${Math.round(finding.score * 100)}% similarity)`).join("\n") : "No exact metadata duplicates, missing ZIP overviews, or high-similarity guide and ZIP overview bodies were found."}\n\n## Release rule\n\nExact duplicate metadata, a missing reviewed-ZIP overview, or content similarity at or above 88% fails the command. Similarity from 72% through 87% is a manual-review warning. Campaign, state, county, and city pages must not be generated without distinct sourced value and an explicit indexability decision.\n`;
await writeFile(new URL("../docs/content-duplication-report.md", import.meta.url), report);
console.log(`Checked ${publicPages.length} pages and ${guides.length} guides: ${errors.length} blocking duplication finding(s).`);
if (errors.length) process.exitCode = 1;
