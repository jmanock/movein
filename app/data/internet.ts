import { indexablePilotZips, supportedPilotZips } from "./site.ts";

export type InternetTechnology = "fiber" | "cable" | "dsl" | "fixed-wireless" | "5g-home" | "lte-home" | "internet-air" | "satellite" | "other";
export type InternetRelationshipStatus = "possible" | "likely" | "limited" | "address-check-required" | "research-pending";

export type InternetOfferFields = {
  offerTitle?: string;
  offerDescription?: string;
  offerUrl?: string;
  offerType?: string;
  validFrom?: string;
  validThrough?: string;
  promoCode?: string;
  affiliate?: boolean;
  affiliateDisclosure?: string;
  lastVerifiedAt?: string;
};

export type InternetProviderRecord = InternetOfferFields & {
  id: string;
  slug: string;
  providerName: string;
  providerType: "wired" | "fixed-wireless";
  technologyTypes: InternetTechnology[];
  officialWebsite: string;
  availabilityCheckerUrl: string;
  movingOrTransferUrl?: string;
  supportUrl?: string;
  sourceUrl: string;
  sourceCheckedAt: string;
  notes: string;
  active: boolean;
  installationNote: string;
};

export type InternetZipRelationship = {
  zip: string;
  provider: string;
  relationshipStatus: InternetRelationshipStatus;
  evidenceSource: string;
  evidenceCheckedAt: string;
  notes: string;
};

const reviewed = "2026-08-10";
const spectrumMarket = "https://www.spectrum.com/locations/internet-wifi-service/orlando-fl-i091";
const attMarket = "https://about.att.com/story/2024/fiber-central-florida.html";
const tMobileMarket = "https://www.t-mobile.com/news/network/florida-georgia-north-carolina-and-south-carolina-yall-have-even-more-t-mobile-home-internet";
const verizonMarket = "https://www.verizon.com/home/internet/fios-fastest-internet/availability/";

export const internetProviders: InternetProviderRecord[] = [
  {
    id: "spectrum-internet", slug: "spectrum", providerName: "Spectrum", providerType: "wired", technologyTypes: ["cable"],
    officialWebsite: "https://www.spectrum.com/internet-service", availabilityCheckerUrl: "https://www.spectrum.com/address/localization",
    movingOrTransferUrl: "https://www.spectrum.com/resources/internet-wifi/what-internet-is-available-in-my-area", supportUrl: "https://www.spectrum.net/support/internet",
    sourceUrl: spectrumMarket, sourceCheckedAt: reviewed, notes: "Spectrum publishes Central Florida city service pages, but service and the final connection still vary by address.", active: true,
    installationNote: "Self-installation or a technician visit may be required after the address check.",
  },
  {
    id: "att-internet", slug: "att", providerName: "AT&T", providerType: "wired", technologyTypes: ["fiber", "dsl"],
    officialWebsite: "https://www.att.com/internet/", availabilityCheckerUrl: "https://www.att.com/buy/broadband/availability.html",
    movingOrTransferUrl: "https://www.att.com/help/moving/", supportUrl: "https://www.att.com/support/internet/",
    sourceUrl: attMarket, sourceCheckedAt: reviewed, notes: "AT&T documents internet and fiber availability in Central Florida communities; the address result determines the actual technology.", active: true,
    installationNote: "The address result determines whether self-installation, a technician, or construction is needed.",
  },
  {
    id: "t-mobile-home-internet", slug: "t-mobile", providerName: "T-Mobile Home Internet", providerType: "fixed-wireless", technologyTypes: ["5g-home", "fixed-wireless"],
    officialWebsite: "https://www.t-mobile.com/home-internet", availabilityCheckerUrl: "https://www.t-mobile.com/home-internet/eligibility",
    movingOrTransferUrl: "https://www.t-mobile.com/home-internet/transfer-internet-service", supportUrl: "https://www.t-mobile.com/support/home-internet",
    sourceUrl: tMobileMarket, sourceCheckedAt: reviewed, notes: "T-Mobile identifies both Central Florida pilot metros as Home Internet markets, while eligibility still depends on address and network capacity.", active: true,
    installationNote: "Usually self-installed, but eligibility and usable signal must be confirmed for the approved service address.",
  },
  {
    id: "verizon-home-internet", slug: "verizon", providerName: "Verizon Home Internet", providerType: "fixed-wireless", technologyTypes: ["5g-home", "lte-home", "fixed-wireless"],
    officialWebsite: "https://www.verizon.com/home/internet/", availabilityCheckerUrl: "https://www.verizon.com/home/internet/5g/",
    movingOrTransferUrl: "https://www.verizon.com/support/residential/account/manage-service/move.html", supportUrl: "https://www.verizon.com/support/5g-home/",
    sourceUrl: verizonMarket, sourceCheckedAt: reviewed, notes: "Verizon lists Orlando as a 5G Home Internet market. Only Orlando mailing ZIPs are associated until broader official evidence is reviewed.", active: true,
    installationNote: "Self-setup is common, but signal, equipment placement, and building restrictions can affect installation.",
  },
];

const relationship = (zip: string, provider: InternetProviderRecord, evidenceSource: string, notes: string): InternetZipRelationship => ({
  zip, provider: provider.id, relationshipStatus: "address-check-required", evidenceSource, evidenceCheckedAt: reviewed, notes,
});

const [spectrum, att, tMobile, verizon] = internetProviders;
export const internetZipRelationships: InternetZipRelationship[] = [
  ...indexablePilotZips.map((zip) => relationship(zip, spectrum, spectrumMarket, "Possible wired option based on official Central Florida market pages; confirm the complete address.")),
  ...indexablePilotZips.map((zip) => relationship(zip, att, attMarket, "Possible AT&T option in the documented Central Florida footprint; the address checker determines technology and serviceability.")),
  ...supportedPilotZips.map((zip) => relationship(zip, tMobile, tMobileMarket, "Possible fixed-wireless option in a documented pilot metro; eligibility depends on address and available network capacity.")),
  ...["32801", "32803", "32804", "32806", "32809"].map((zip) => relationship(zip, verizon, verizonMarket, "Possible Verizon Home Internet option in the officially listed Orlando market; confirm the complete address.")),
];

export const internetProviderById = new Map(internetProviders.map((provider) => [provider.id, provider]));
export const internetProviderBySlug = new Map(internetProviders.map((provider) => [provider.slug, provider]));

export function internetProvidersForZip(zip: string) {
  const ids = new Set(internetZipRelationships.filter((item) => item.zip === zip && item.relationshipStatus !== "research-pending").map((item) => item.provider));
  return internetProviders.filter((provider) => ids.has(provider.id)).sort((a, b) => a.providerName.localeCompare(b.providerName));
}

export function technologyLabel(technology: InternetTechnology) {
  return ({ fiber: "Fiber", cable: "Cable", dsl: "DSL", "fixed-wireless": "Fixed wireless", "5g-home": "5G Home", "lte-home": "LTE Home", "internet-air": "Internet Air", satellite: "Satellite", other: "Other" } as const)[technology];
}
