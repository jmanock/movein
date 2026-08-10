import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { internetProviders, internetProvidersForZip, internetZipRelationships } from "../app/data/internet.ts";
import { clearInternetComparison, readInternetComparison, removeInternetProvider, saveInternetProvider } from "../app/lib/internet-comparison.ts";
import { getLookupResult } from "../db/lookup.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const fakeStorage = () => { const values = new Map(); return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }; };

test("Internet model contains four neutral providers and evidence-backed relationships", () => {
  assert.deepEqual(internetProviders.map((provider) => provider.providerName).toSorted(), ["AT&T", "Spectrum", "T-Mobile Home Internet", "Verizon Home Internet"]);
  assert.equal(internetZipRelationships.length, 113);
  assert.equal(internetZipRelationships.every((item) => item.relationshipStatus === "address-check-required" && item.evidenceSource.startsWith("https://") && item.evidenceCheckedAt), true);
  assert.deepEqual(internetProvidersForZip("32801").map((provider) => provider.providerName), ["AT&T", "Spectrum", "T-Mobile Home Internet", "Verizon Home Internet"]);
  assert.deepEqual(internetProvidersForZip("32701").map((provider) => provider.providerName), ["T-Mobile Home Internet"]);
});

test("lookup exposes multiple providers without a ZIP-wide guarantee", () => {
  const orlando = getLookupResult("32801").providers.internet.filter((provider) => provider.providerType !== "official_lookup");
  assert.equal(orlando.length, 4);
  assert.deepEqual(orlando.map((provider) => provider.name), ["AT&T", "Spectrum", "T-Mobile Home Internet", "Verizon Home Internet"]);
  for (const provider of orlando) {
    assert.equal(provider.requiresAddressConfirmation, true);
    assert.equal(provider.availabilityStatus, "address_required");
    assert.match(provider.addressCheckUrl, /^https:/);
    assert.ok(provider.technologyTypes.length);
  }
});

test("saved comparison persists, deduplicates, removes, and clears without personal data", () => {
  const storage = fakeStorage();
  const provider = { slug: "spectrum-internet", providerName: "Spectrum", technologyTypes: ["Cable"], providerType: "wired", availabilityCheckerUrl: "https://example.com/check", lastReviewedAt: "2026-08-10", zip: "32757" };
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
