import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { internetProviders, internetProvidersForZip, internetZipRelationships } from "../app/data/internet.ts";
import { clearInternetComparison, readInternetComparison, removeInternetProvider, saveInternetProvider } from "../app/lib/internet-comparison.ts";
import { getDatabase } from "../db/index.ts";
import { getLookupResult } from "../db/lookup.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const fakeStorage = () => { const values = new Map(); return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }; };

test("Internet model contains neutral providers and evidence-backed relationships", () => {
  const activeProviders = internetProviders.filter((provider) => provider.active);
  assert.ok(activeProviders.length >= 2, "comparison model needs multiple active providers");
  assert.equal(new Set(activeProviders.map((provider) => provider.id)).size, activeProviders.length);
  assert.equal(new Set(activeProviders.map((provider) => provider.providerName)).size, activeProviders.length);
  for (const provider of activeProviders) {
    assert.match(provider.officialWebsite, /^https:/);
    assert.match(provider.availabilityCheckerUrl, /^https:/);
    assert.ok(provider.providerType);
    assert.ok(provider.technologyTypes.length);
  }
  assert.ok(internetZipRelationships.length >= activeProviders.length);
  assert.equal(new Set(internetZipRelationships.map((item) => `${item.zip}|${item.provider}`)).size, internetZipRelationships.length);
  assert.equal(internetZipRelationships.every((item) => item.relationshipStatus === "address-check-required" && item.evidenceSource.startsWith("https://") && item.evidenceCheckedAt && activeProviders.some((provider) => provider.id === item.provider)), true);
  const expectedOrlandoIds = new Set(internetZipRelationships.filter((item) => item.zip === "32801" && item.relationshipStatus !== "research-pending").map((item) => item.provider));
  const orlandoProviders = internetProvidersForZip("32801");
  assert.ok(orlandoProviders.length >= 2, "fixture ZIP needs multiple comparison choices");
  assert.deepEqual(new Set(orlandoProviders.map((provider) => provider.id)), expectedOrlandoIds);
  assert.deepEqual(orlandoProviders.map((provider) => provider.providerName), orlandoProviders.map((provider) => provider.providerName).toSorted((a, b) => a.localeCompare(b)));
});

test("lookup exposes multiple providers without a ZIP-wide guarantee", () => {
  const result = getLookupResult("32801");
  const orlando = result.providers.internet.filter((provider) => provider.providerType !== "official_lookup");
  const expectedNames = expectedInternetNamesForZip("32801");
  assert.ok(orlando.length >= 2, "verified fixture ZIP must expose multiple real providers");
  assert.deepEqual(orlando.map((provider) => provider.name), expectedNames);
  assert.equal(new Set(orlando.map((provider) => provider.name)).size, orlando.length);
  assert.deepEqual(orlando.map((provider) => provider.name), orlando.map((provider) => provider.name).toSorted((a, b) => a.localeCompare(b)));
  for (const provider of orlando) {
    assert.equal(provider.requiresAddressConfirmation, true);
    assert.equal(provider.availabilityStatus, "address_required");
    assert.match(provider.addressCheckUrl, /^https:/);
    assert.ok(provider.providerType || provider.technologyTypes.length);
    assert.ok(provider.technologyTypes.length, `${provider.name} needs a technology fixture`);
  }
  assert.match(result.disclaimer, /exact street address/i);
});

test("saved comparison persists, deduplicates, removes, and clears without personal data", () => {
  const storage = fakeStorage();
  const provider = { slug: "fixture-internet", providerName: "Fixture Internet", technologyTypes: ["Cable"], providerType: "wired", availabilityCheckerUrl: "https://example.com/check", lastReviewedAt: "2026-08-10", zip: "32757" };
  saveInternetProvider(provider, storage);
  saveInternetProvider(provider, storage);
  assert.equal(readInternetComparison(storage).providers.length, 1);
  removeInternetProvider(provider.slug, storage);
  assert.equal(readInternetComparison(storage).providers.length, 0);
  saveInternetProvider(provider, storage); clearInternetComparison(storage);
  assert.deepEqual(readInternetComparison(storage).providers, []);
  assert.doesNotMatch(JSON.stringify(provider), /street|email|phone|account|notes/i);
});

test("Internet UI is a mobile-safe comparison tool without rankings or prices", async () => {
  const [hub, compare, card, options, chooser, css, analytics, config, printable] = await Promise.all([read("../app/internet/page.tsx"), read("../app/components/InternetCompare.tsx"), read("../app/components/InternetProviderCard.tsx"), read("../app/components/InternetOptions.tsx"), read("../app/components/MovingInternetChooser.tsx"), read("../app/globals.css"), read("../app/lib/analytics.ts"), read("../next.config.ts"), read("../app/data/printables.ts")]);
  for (const value of ["ZIP lookup finds possibilities", "Wired Internet", "Wireless home Internet", "Internet FAQ"]) assert.match(hub, new RegExp(value));
  assert.match(chooser, /Moving your Internet/);
  for (const value of ["Save for comparison", "Save provider to My Move", "Check your address", "opens in a new tab"]) assert.match(card, new RegExp(value));
  assert.match(options, /wired\.length/); assert.match(options, /wireless\.length/);
  assert.match(compare, /Clear comparison/); assert.match(compare, /internet_technology_filter/);
  assert.match(css, /@media \(max-width: 760px\).*\.internet-compare-grid/s);
  for (const event of ["internet_hub_view", "internet_zip_search", "internet_provider_saved", "internet_provider_removed", "internet_compare_view", "internet_availability_click", "internet_transfer_click", "internet_technology_filter", "internet_checklist_view", "internet_checklist_print"]) assert.match(analytics, new RegExp(`${event}:`));
  assert.match(config, /find-isp-by-address.*find-internet-providers/s);
  assert.match(printable, /internet-setup-checklist/);
  assert.doesNotMatch(`${hub}${compare}${card}`, /Editor's Choice|MoveIn Recommended|star rating|affiliate=true|\$\d+/i);
});

test("future deal fields exist but no public deals page or offer content ships", async () => {
  const [model, pages] = await Promise.all([read("../app/data/internet.ts"), read("../app/data/pages.ts")]);
  for (const field of ["offerTitle", "offerDescription", "offerUrl", "offerType", "validFrom", "validThrough", "promoCode", "affiliateDisclosure", "lastVerifiedAt"]) assert.match(model, new RegExp(field));
  assert.doesNotMatch(pages, /\/internet\/deals/);
  assert.equal(internetProviders.some((provider) => provider.offerTitle || provider.affiliate), false);
});

function expectedInternetNamesForZip(zip) {
  return getDatabase().prepare(`SELECT p.name FROM service_areas sa
    JOIN providers p ON p.id=sa.provider_id
    JOIN provider_categories pc ON pc.id=p.category_id
    JOIN zip_codes z ON z.id=sa.zip_code_id
    WHERE z.zip_code=? AND pc.slug='internet' AND p.status!='inactive' AND COALESCE(p.provider_type, '')!='official_lookup'
    ORDER BY p.name`).all(zip).map((row) => row.name);
}
