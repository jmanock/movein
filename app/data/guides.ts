export type OfficialResource = {
  title: string;
  organization: string;
  url: string;
  checked: string;
  note: string;
};

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  steps?: string[];
};

export type Guide = {
  path: string;
  section: "homeowners" | "renters" | "resources";
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  directAnswer: string;
  published: string;
  reviewed: string;
  sections: GuideSection[];
  related: string[];
  sources: OfficialResource[];
};

const reviewed = "2026-07-29";
const fcc: OfficialResource = { title: "National Broadband Map", organization: "Federal Communications Commission", url: "https://broadbandmap.fcc.gov/home", checked: reviewed, note: "Search reported fixed broadband availability by complete street address." };
const floridaPsc: OfficialResource = { title: "Find Your Utility", organization: "Florida Public Service Commission", url: "https://www.floridapsc.com/find-utility-service", checked: reviewed, note: "Official starting point for regulated electric and natural-gas utility territory information in Florida." };
const usps: OfficialResource = { title: "Official USPS Change of Address", organization: "United States Postal Service", url: "https://moversguide.usps.com/", checked: reviewed, note: "Submit an official mail-forwarding request directly with USPS." };
const ready: OfficialResource = { title: "Power Outages", organization: "Ready.gov", url: "https://www.ready.gov/power-outages", checked: reviewed, note: "Federal preparedness guidance for power outages and household safety." };
const cpsc: OfficialResource = { title: "Home Safety Education", organization: "U.S. Consumer Product Safety Commission", url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Home", checked: reviewed, note: "Federal home-safety guidance covering common household risks." };

export const guides: Guide[] = [
  {
    path: "/resources/find-electric-company", section: "resources", slug: "find-electric-company",
    title: "How to Find Your Electric Company", description: "Find the electric utility that may serve a Florida address, understand overlapping ZIP territories, and confirm service before opening an account.",
    h1: "How to find your electric company", eyebrow: "Electric service",
    directAnswer: "Start with your ZIP code to identify possible electric utilities, then confirm the complete service address with the utility. Electric territories can divide a ZIP code, so a mailing city alone is not proof of service.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Use the ZIP result as a shortlist", paragraphs: ["A MoveIn ZIP result can show municipal utilities, electric cooperatives, investor-owned utilities, or more than one possible provider. Read the coverage note beside each record before choosing an action."], steps: ["Enter the property ZIP code.", "Review every possible electric provider shown.", "Open the official start-service or address-check page.", "Confirm the complete address before paying a deposit or scheduling service."] },
      { heading: "Why more than one utility may appear", paragraphs: ["Electric service territories follow infrastructure and regulatory boundaries rather than postal routes. Two homes sharing a ZIP code—or even a mailing city—can have different utilities.", "When the evidence does not support one ZIP-wide provider, MoveIn lists the supported possibilities instead of guessing."] },
      { heading: "Save outage information before you need it", paragraphs: ["After confirming the provider, save its outage-reporting number and official outage map. Use the utility’s emergency channel for electrical hazards and call 911 for immediate danger."], steps: ["Save the outage phone number in your contacts.", "Bookmark the official outage map.", "Know where the electrical panel is, but do not open sealed utility equipment."] },
    ],
    related: ["/homeowners/set-up-utilities", "/homeowners/save-outage-information", "/resources/why-providers-vary-by-zip"], sources: [floridaPsc, ready],
  },
  {
    path: "/resources/find-water-provider", section: "resources", slug: "find-water-provider",
    title: "How to Find Your Water and Sewer Provider", description: "Find the city, county, private utility, well, sewer, or septic starting point for a new Florida address.",
    h1: "How to find your water and sewer provider", eyebrow: "Water and sewer",
    directAnswer: "Check possible water and sewer authorities for the ZIP, then confirm the parcel with the provider or local government. Water and sewer may be handled by different organizations, and a private well or septic system may apply.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Confirm water and sewer separately", paragraphs: ["A city may provide water but not sewer, a county or private utility may serve outside city limits, and a connected sewer system can end at a jurisdiction boundary."], steps: ["Review both the water and sewer sections of the ZIP result.", "Check the provider’s official service or billing page.", "Ask the seller, landlord, closing agent, or local utility to confirm the parcel.", "Confirm whether the property uses sewer or septic before opening an account."] },
      { heading: "Mailing city is not utility jurisdiction", paragraphs: ["Postal names help deliver mail; they do not establish city limits or utility territory. Annexation, unincorporated areas, and utility agreements can change which authority serves a property."] },
      { heading: "Information to gather", paragraphs: ["Providers may request the service address, move-in date, identification, lease or closing documents, and previous-account information. Requirements vary, and MoveIn does not collect these documents."], steps: ["Ask for the customer-service and after-hours emergency numbers.", "Confirm whether irrigation or reclaimed-water accounts are separate.", "For a well or septic system, locate maintenance records and qualified local guidance."] },
    ],
    related: ["/homeowners/find-water-shutoff", "/resources/mailing-city-vs-utility-jurisdiction", "/resources/utility-setup-documents"], sources: [],
  },
  {
    path: "/resources/find-internet-providers", section: "resources", slug: "find-internet-providers",
    title: "How to Find Internet Providers at Your Address", description: "Use official address-level tools to identify reported internet providers and confirm installation options for a specific home or apartment.",
    h1: "How to find internet providers at your address", eyebrow: "Internet availability",
    directAnswer: "Internet availability is building-specific. Use the FCC National Broadband Map with the complete address, then confirm availability, technology, installation timing, and building access directly with each provider.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Search by address, not ZIP alone", paragraphs: ["Provider-reported coverage can differ between neighboring buildings and between units in one property. A ZIP result should point you to an address search rather than promise availability."], steps: ["Search the complete address in the FCC National Broadband Map.", "Review the reported providers and technologies for that location.", "Open each provider’s official availability tool.", "Confirm the exact unit and installation requirements before ordering."] },
      { heading: "Check the technology and the property", paragraphs: ["Fiber, cable, DSL, fixed wireless, and satellite have different installation needs. Apartments and rentals may also have wiring, access, drilling, or approved-provider rules."] },
      { heading: "Avoid temporary-offer confusion", paragraphs: ["Compare the regular monthly cost, equipment, installation, contract, and cancellation terms on the provider’s current official page. MoveIn does not rank providers, display promotional prices, or guarantee speeds."], steps: ["Ask whether equipment is rented or purchased.", "Confirm the earliest installation date.", "For a rental, obtain required landlord or property-management approval."] },
    ],
    related: ["/renters/internet-installation", "/resources/why-providers-vary-by-zip", "/resources/utility-setup-documents"], sources: [fcc],
  },
  {
    path: "/resources/find-trash-service", section: "resources", slug: "find-trash-service",
    title: "How to Find Trash and Recycling Service", description: "Determine whether a city, county, HOA, landlord, apartment manager, franchise hauler, or private hauler handles collection.",
    h1: "How to find trash and recycling service", eyebrow: "Collection service",
    directAnswer: "Start with the city or county collection information connected to the ZIP, then confirm jurisdiction and property type. Trash service may be arranged by a municipality, HOA, landlord, apartment manager, franchise, or private hauler.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Identify who is responsible", paragraphs: ["A mailing city does not prove that a property receives city collection. Unincorporated homes, multifamily buildings, and HOA communities often have different arrangements."], steps: ["Check the trash and local-government sections of the ZIP result.", "Use the official address or collection-day lookup when available.", "Ask the HOA, landlord, or property manager whether service is included.", "Confirm rules for carts, recycling, yard waste, and bulk items."] },
      { heading: "Collection schedules can be property-specific", paragraphs: ["Pickup days, accepted materials, holiday changes, and bulk-waste procedures can change. Use the current official schedule rather than relying on a neighbor’s routine or an old calendar."] },
      { heading: "Before move-in day", paragraphs: ["Ask when carts should already be at the property, how to request missing containers, and what to do with moving boxes. Apartment residents should also confirm dumpster, recycling-room, and access rules."] },
    ],
    related: ["/renters/utility-responsibilities", "/homeowners/set-up-utilities", "/resources/mailing-city-vs-utility-jurisdiction"], sources: [],
  },
  {
    path: "/resources/utility-setup-documents", section: "resources", slug: "utility-setup-documents",
    title: "Documents You May Need to Start Utilities", description: "Prepare the common information utilities may request without sending sensitive documents to MoveIn.",
    h1: "What documents may be needed to start utilities?", eyebrow: "Prepare before calling",
    directAnswer: "Requirements vary, but providers commonly ask for the service address, start date, identification, lease or closing evidence, prior-account details, and a payment method. Gather them privately and submit them only through the confirmed provider.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Common information", paragraphs: ["The provider decides what is required for identity, occupancy, deposits, and account transfers."], steps: ["Complete service address and requested start date.", "Government-issued identification if required.", "Lease, closing statement, or other occupancy evidence if requested.", "Previous account number for a transfer.", "A payment method for approved charges or deposits."] },
      { heading: "Protect sensitive information", paragraphs: ["MoveIn never asks for identification documents, payment details, utility credentials, leases, closing files, or Social Security numbers. Use only the official provider website or confirmed telephone number for sensitive account steps."] },
      { heading: "Ask before submitting", paragraphs: ["Confirm why a document is needed, how it will be transmitted, and whether a less sensitive alternative is accepted. Do not email confidential files to an address you have not independently verified."] },
    ],
    related: ["/resources/when-to-transfer-utilities", "/homeowners/set-up-utilities", "/renters/set-up-utilities"], sources: [],
  },
  {
    path: "/resources/when-to-transfer-utilities", section: "resources", slug: "when-to-transfer-utilities",
    title: "When to Transfer Utilities Before Moving", description: "Plan utility start and transfer dates without interrupting the current occupant or leaving the property without essential service.",
    h1: "When should you transfer utilities before moving?", eyebrow: "Moving coordination",
    directAnswer: "Contact each confirmed provider before move-in, ask about lead time, and schedule service for the date you become responsible for the property. Do not request a shutoff for another person’s active account.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Work backward from responsibility", paragraphs: ["Your closing documents, lease, seller, landlord, or property manager should establish when responsibility changes. Installation services such as internet may need more lead time than an account transfer."], steps: ["Confirm the responsibility date.", "Identify the provider for the exact address.", "Ask each provider for its current lead time.", "Keep confirmation numbers and scheduled dates."] },
      { heading: "Coordinate, do not guess", paragraphs: ["Electric, water, gas, and internet providers have different processes. Some transfers are immediate; others require deposits, appointments, or access to the property."] },
      { heading: "Check the first bill", paragraphs: ["Confirm the service address, start date, meter information when shown, and approved charges. Contact the provider promptly if the account reflects the wrong property or date."] },
    ],
    related: ["/resources/utility-setup-documents", "/homeowners/set-up-utilities", "/renters/set-up-utilities"], sources: [],
  },
  {
    path: "/resources/why-providers-vary-by-zip", section: "resources", slug: "why-providers-vary-by-zip",
    title: "Why Utility Providers Vary Within One ZIP Code", description: "Understand why ZIP codes can contain multiple electric, water, internet, gas, and trash service arrangements.",
    h1: "Why providers can vary within the same ZIP code", eyebrow: "Service boundaries",
    directAnswer: "ZIP codes organize mail delivery; utility service follows infrastructure, municipal borders, districts, franchises, and property connections. A ZIP can therefore contain multiple possible providers.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Different systems use different boundaries", paragraphs: ["Electric territories, water systems, sewer connections, trash franchises, and broadband networks were not designed around one shared postal map. Each service can have a different boundary inside the same ZIP."] },
      { heading: "Property conditions also matter", paragraphs: ["A house may use a private well or septic system. A multifamily property may have a master utility account or building-wide internet arrangement. Natural gas infrastructure may stop before reaching a particular street."] },
      { heading: "How MoveIn handles uncertainty", paragraphs: ["MoveIn labels records as possible, multiple providers possible, address confirmation required, or coverage varies when the evidence cannot support a ZIP-wide claim."], steps: ["Use the ZIP result to identify official starting points.", "Read the coverage and jurisdiction notes.", "Confirm the complete address directly before opening service."] },
    ],
    related: ["/resources/find-electric-company", "/resources/find-internet-providers", "/resources/mailing-city-vs-utility-jurisdiction"], sources: [floridaPsc, fcc],
  },
  {
    path: "/resources/mailing-city-vs-utility-jurisdiction", section: "resources", slug: "mailing-city-vs-utility-jurisdiction",
    title: "Mailing City vs. Utility Jurisdiction", description: "Learn why the city in a postal address may differ from the municipality or utility authority serving the property.",
    h1: "Mailing city versus utility jurisdiction", eyebrow: "Location context",
    directAnswer: "The city name in a mailing address supports mail delivery. It does not necessarily show city limits, incorporated status, utility territory, or trash responsibility.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "One address can have several location labels", paragraphs: ["A property can use a nearby city name for mail while sitting in an unincorporated county area. It may also be inside one municipality but served by a regional or neighboring utility authority."] },
      { heading: "Why this affects new residents", paragraphs: ["Water, sewer, trash, permitting, non-emergency services, and local taxes can depend on jurisdiction. Using only the mailing city can send a resident to the wrong department."] },
      { heading: "Confirm the authority that serves the parcel", paragraphs: ["Use the jurisdiction note and official links in the ZIP result, then verify with the city, county, or provider."], steps: ["Check whether the address is inside city limits.", "Confirm each utility separately.", "Ask who handles trash and recycling for the property type.", "Save both city and county contacts when the boundary is unclear."] },
    ],
    related: ["/resources/find-water-provider", "/resources/find-trash-service", "/resources/why-providers-vary-by-zip"], sources: [],
  },
  {
    path: "/resources/change-your-address", section: "resources", slug: "change-your-address",
    title: "How to Change Your Address After Moving", description: "Use the official USPS change-of-address service and update important organizations directly after a move.",
    h1: "How to change your address after moving", eyebrow: "Address changes",
    directAnswer: "Submit mail forwarding through the official USPS Movers Guide, then update important organizations directly. Forwarding does not replace changing the address on financial, government, insurance, and service accounts.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Start with official mail forwarding", paragraphs: ["Use the USPS website directly and verify that the domain is USPS-operated before entering personal information."], steps: ["Choose the correct individual, family, or business move type.", "Use the date mail should begin forwarding.", "Keep the confirmation information privately."] },
      { heading: "Update important records directly", paragraphs: ["Notify financial institutions, insurers, employers, licensing agencies, subscriptions, and other organizations according to their official processes. Some government records have separate deadlines."] },
      { heading: "Protect against impersonation", paragraphs: ["Avoid advertisements that resemble official government forms. Do not send personal or payment information through an unverified moving-service link."] },
    ],
    related: ["/resources/utility-setup-documents", "/resources/when-to-transfer-utilities", "/homeowners/set-up-utilities"], sources: [usps],
  },
  {
    path: "/homeowners/set-up-utilities", section: "homeowners", slug: "set-up-utilities",
    title: "Utility Setup for New Homeowners", description: "Set up electricity, water, sewer or septic, internet, gas, and trash service for a newly purchased home.",
    h1: "How to set up utilities for a new home", eyebrow: "Homeowner guide",
    directAnswer: "Confirm each provider for the exact address, schedule service for the responsibility date, save confirmations and emergency contacts, and verify the first bill. Treat water, sewer, gas, internet, and trash as separate address checks.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Start with the essential accounts", paragraphs: ["Use the ZIP lookup to identify likely providers, then confirm the property with each official source."], steps: ["Electricity and outage contacts.", "Water plus sewer or septic status.", "Internet installation and property access.", "Natural gas only where available.", "Trash, recycling, yard waste, and bulk collection."] },
      { heading: "Learn the house while service starts", paragraphs: ["Locate the main water shutoff and electrical panel, test smoke and carbon-monoxide alarms, and keep inspection findings available. Do not open sealed utility equipment or attempt unsafe repairs."] },
      { heading: "Keep a clean record", paragraphs: ["Save start dates, confirmation numbers, account contacts, deposits, meter information when provided, and the first bill. MoveIn does not collect or store these account materials."] },
    ],
    related: ["/resources/find-electric-company", "/resources/find-water-provider", "/resources/utility-setup-documents", "/homeowners/save-outage-information"], sources: [cpsc],
  },
  {
    path: "/homeowners/save-outage-information", section: "homeowners", slug: "save-outage-information",
    title: "How to Save Outage and Emergency Information", description: "Prepare official utility outage numbers, maps, and household contacts before an interruption happens.",
    h1: "How to save outage and emergency numbers", eyebrow: "Home preparedness",
    directAnswer: "After confirming each provider, save its official outage or emergency number, bookmark the outage map, and keep a non-digital copy with household emergency information.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Use confirmed provider contacts", paragraphs: ["An outage number is useful only when it belongs to the utility serving the property. Confirm the provider before saving the number."], steps: ["Electric outage phone and map.", "Water or sewer emergency line.", "Natural-gas emergency line when gas is present.", "City or county non-emergency contact."] },
      { heading: "Know which channel to use", paragraphs: ["Use 911 for immediate danger. Report utility outages, leaks, or service problems through the provider’s official emergency channel. Never investigate a suspected gas leak or downed power line yourself."] },
      { heading: "Keep information available during an outage", paragraphs: ["Store contacts on the phone and on paper. Keep devices charged, follow official public-safety instructions, and avoid relying on social-media posts for restoration estimates."] },
    ],
    related: ["/resources/find-electric-company", "/homeowners/set-up-utilities", "/homeowners/find-water-shutoff"], sources: [ready],
  },
  {
    path: "/homeowners/find-water-shutoff", section: "homeowners", slug: "find-water-shutoff",
    title: "How to Find Your Home Water Shutoff", description: "Locate and label the homeowner-accessible main water shutoff without disturbing sealed utility equipment.",
    h1: "How to find the main water shutoff", eyebrow: "Home safety",
    directAnswer: "Look for the homeowner-accessible shutoff where the water line enters the home or near the meter area, but do not open sealed utility equipment. Ask the seller, inspector, plumber, or water utility if the location is unclear.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Common locations vary", paragraphs: ["The valve may be in a garage, utility room, basement, exterior wall box, or another protected location. Climate, construction type, and local practice affect placement."] },
      { heading: "Identify it safely", paragraphs: ["Do not force a corroded valve, enter a confined space, or operate equipment marked for utility personnel."], steps: ["Ask for the shutoff location during inspection or handoff.", "Label the homeowner-accessible valve.", "Keep the path clear.", "Ask a qualified plumber to inspect a damaged or uncertain valve."] },
      { heading: "Also save the utility emergency number", paragraphs: ["The homeowner shutoff may not address a street-side leak, meter problem, or utility-main issue. Save the confirmed water provider’s emergency contact from the ZIP result."] },
    ],
    related: ["/resources/find-water-provider", "/homeowners/save-outage-information", "/homeowners/set-up-utilities"], sources: [cpsc],
  },
  {
    path: "/renters/set-up-utilities", section: "renters", slug: "set-up-utilities",
    title: "Utility Setup for Renters", description: "Use the lease and official provider tools to identify which utility accounts a renter must open before move-in.",
    h1: "How to set up utilities for a rental", eyebrow: "Renter guide",
    directAnswer: "Read the lease first, list the services the tenant must open, confirm each provider for the exact unit, and coordinate start dates with the landlord or property manager.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Separate included services from tenant accounts", paragraphs: ["Electricity, water, gas, trash, and internet responsibilities vary by lease and building."], steps: ["Mark every utility the lease says is included.", "List accounts the tenant must open.", "Confirm providers for the exact unit.", "Ask about shared meters, billing allocations, or required providers."] },
      { heading: "Coordinate installation access", paragraphs: ["Internet or other installation work may require an appointment, building access, or written permission before drilling or modifying wiring."] },
      { heading: "Document the handoff", paragraphs: ["Keep utility confirmations with the lease and move-in condition report. Photograph visible meter readings when lawful and practical, and notify management promptly about mismatches or service problems."] },
    ],
    related: ["/renters/utility-responsibilities", "/renters/internet-installation", "/resources/utility-setup-documents", "/resources/when-to-transfer-utilities"], sources: [],
  },
  {
    path: "/renters/utility-responsibilities", section: "renters", slug: "utility-responsibilities",
    title: "Renter Utility Responsibilities", description: "Understand how a lease, property type, and local service arrangements determine utility responsibility.",
    h1: "Which utilities are renters responsible for?", eyebrow: "Read the lease",
    directAnswer: "The lease controls which utilities are included and which accounts the tenant must open. Never assume that water, trash, gas, or internet is included because it was included at another property.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Build a responsibility list", paragraphs: ["Review utility clauses, addenda, building rules, and any separate billing disclosures."], steps: ["Electric account responsibility.", "Water and sewer billing method.", "Natural gas where present.", "Trash and recycling arrangement.", "Internet and installation rules."] },
      { heading: "Ask about shared or allocated bills", paragraphs: ["Some multifamily properties bill through management or divide a master account. Ask how charges are calculated, when they are due, and where disputes should be directed."] },
      { heading: "Keep maintenance roles separate", paragraphs: ["Opening a utility account does not necessarily make the tenant responsible for repairing building systems. Use the lease’s maintenance process and report emergencies through the designated contact."] },
    ],
    related: ["/renters/set-up-utilities", "/renters/internet-installation", "/resources/find-trash-service"], sources: [],
  },
  {
    path: "/renters/internet-installation", section: "renters", slug: "internet-installation",
    title: "Internet Installation for Renters", description: "Confirm address-level internet availability, building access, wiring rules, and landlord permission before installation.",
    h1: "How renters can arrange internet installation", eyebrow: "Rental internet",
    directAnswer: "Check provider availability for the exact unit, review the lease and building rules, and obtain permission before drilling, running exterior cable, or changing shared wiring.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Confirm the unit, not just the building", paragraphs: ["A provider may report service at the street address while a particular unit lacks the required wiring or access."], steps: ["Search the full address and unit.", "Ask whether the building has an approved or exclusive arrangement.", "Confirm equipment and installation charges.", "Coordinate access with management."] },
      { heading: "Get permission for physical changes", paragraphs: ["Do not authorize drilling, new exterior lines, roof access, or wiring changes without the permission required by the lease or property manager."] },
      { heading: "Record equipment and return terms", paragraphs: ["Keep serial numbers, receipts, and return instructions for rented equipment. Confirm how service should be canceled or transferred at move-out."] },
    ],
    related: ["/resources/find-internet-providers", "/renters/set-up-utilities", "/renters/utility-responsibilities"], sources: [fcc],
  },
  {
    path: "/resources/set-up-utilities", section: "resources", slug: "set-up-utilities",
    title: "How to Set Up Utilities After a Move", description: "A practical order for finding, confirming, and starting electric, water, internet, gas, and trash service at a new address.",
    h1: "How to set up utilities after a move", eyebrow: "Utility setup",
    directAnswer: "List the services the household is responsible for, use the ZIP lookup to find possible providers, confirm the complete address with each official source, and schedule service for the date responsibility begins.", published: reviewed, reviewed,
    sections: [
      { heading: "Start with responsibility, not provider names", paragraphs: ["Homeowners usually arrange every service. Renters should read the lease first because water, trash, or gas may be included or billed through management."], steps: ["List every service needed.", "Mark who is responsible.", "Confirm the exact address.", "Ask about deposits and lead times.", "Save official outage contacts."] },
      { heading: "Use a sensible order", paragraphs: ["Start electricity and water first, then schedule internet or other appointment-based work. Confirm trash rules and natural gas only where they apply."] },
      { heading: "Verify the first bill", paragraphs: ["Check service dates, address, deposits, and rate details. Keep confirmations privately; MoveIn does not collect account or payment information."] },
    ], related: ["/resources/utility-setup-documents", "/resources/when-to-transfer-utilities", "/resources/find-electric-company"], sources: [floridaPsc],
  },
  {
    path: "/resources/utility-deposits", section: "resources", slug: "utility-deposits",
    title: "Utility Deposits and Account Requirements", description: "Understand common utility deposit, identification, credit, and start-service requirements without sharing sensitive details with MoveIn.",
    h1: "What to know about utility deposits", eyebrow: "Account requirements",
    directAnswer: "Deposits and waivers vary by provider, service, and account history. Confirm the amount, refund policy, accepted documents, and payment channel directly with the official provider before paying.", published: reviewed, reviewed,
    sections: [{ heading: "Ask before you pay", paragraphs: ["Request the written deposit amount, due date, refund or credit policy, and official payment method."], steps: ["Confirm the official provider.", "Ask which documents are required.", "Ask whether a waiver or installment option exists.", "Keep the receipt privately."] }, { heading: "Protect sensitive information", paragraphs: ["Do not send identification, bank details, or lease documents through unofficial links. MoveIn never requests them."] }, { heading: "Check the first statement", paragraphs: ["Confirm that the deposit, service address, start date, and any promised waiver or credit appear correctly. Contact the official provider promptly if they do not."] }], related: ["/resources/set-up-utilities", "/resources/utility-setup-documents", "/resources/when-to-transfer-utilities"], sources: [floridaPsc],
  },
  {
    path: "/resources/city-vs-county-water-service", section: "resources", slug: "city-vs-county-water-service",
    title: "City vs. County Water Service", description: "Understand why a mailing city does not always identify the water or sewer utility for a Florida address.",
    h1: "Does the city or county provide the water?", eyebrow: "Water jurisdiction",
    directAnswer: "A postal city name does not prove that an address is inside city limits or served by that city utility. Confirm the parcel with the city, county, utility district, or property records.", published: reviewed, reviewed,
    sections: [{ heading: "Postal names and service areas differ", paragraphs: ["ZIP codes support mail delivery. Utility systems follow pipes, annexations, districts, and agreements that can cross those postal labels."] }, { heading: "Confirm both water and sewer", paragraphs: ["One provider may supply water while a different authority handles sewer, or the property may use a private well or septic system."], steps: ["Check city limits or parcel jurisdiction.", "Ask the listed water utility to confirm the address.", "Confirm sewer separately.", "Ask about well or septic records when relevant."] }, { heading: "Use the parcel when names conflict", paragraphs: ["If the mailing city, municipality, and utility name disagree, use the full service address or parcel record with the official utility. Do not choose from the postal label alone."] }], related: ["/resources/find-water-provider", "/resources/mailing-city-vs-utility-jurisdiction", "/resources/why-providers-vary-by-zip"], sources: [],
  },
  {
    path: "/homeowners/hoa-utility-responsibilities", section: "homeowners", slug: "hoa-utility-responsibilities",
    title: "HOA Utility Responsibilities for Homeowners", description: "Clarify which services an HOA may arrange and which accounts a homeowner still needs to open.",
    h1: "Which utilities can an HOA handle?", eyebrow: "HOA basics",
    directAnswer: "An HOA may coordinate trash, irrigation, private water, cable, or shared-area service, but the governing documents and closing disclosures—not the neighborhood name—control the answer.", published: reviewed, reviewed,
    sections: [{ heading: "Build a written responsibility list", paragraphs: ["Review the declaration, budget, fee schedule, and resale or estoppel materials."], steps: ["Identify services paid through assessments.", "Confirm individual meters and accounts.", "Ask about approved vendors or access rules.", "Get emergency contacts for shared systems."] }, { heading: "Still confirm public utilities", paragraphs: ["HOA involvement does not prove the public or private utility serving the parcel. Confirm the address with the official source."] }, { heading: "Separate shared and household emergencies", paragraphs: ["Save both the HOA contact for common systems and the confirmed provider contacts for the home. Know which party handles irrigation, lift stations, gates, and common-area outages."] }], related: ["/homeowners/set-up-utilities", "/resources/find-trash-service", "/resources/find-water-provider"], sources: [],
  },
];

export const guidesByPath = new Map(guides.map((guide) => [guide.path, guide]));
export function getGuide(section: Guide["section"], slug: string) { return guides.find((guide) => guide.section === section && guide.slug === slug); }
export function guidesFor(section: Guide["section"]) { return guides.filter((guide) => guide.section === section); }
