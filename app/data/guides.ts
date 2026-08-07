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
  image?: { src: string; alt: string; width: number; height: number };
  published: string;
  reviewed: string;
  sections: GuideSection[];
  faqs?: { question: string; answer: string }[];
  related: string[];
  sources: OfficialResource[];
};

const reviewed = "2026-07-29";
const fcc: OfficialResource = { title: "National Broadband Map", organization: "Federal Communications Commission", url: "https://broadbandmap.fcc.gov/home", checked: reviewed, note: "Search reported fixed broadband availability by complete street address." };
const floridaPsc: OfficialResource = { title: "Find Your Utility", organization: "Florida Public Service Commission", url: "https://www.floridapsc.com/find-utility-service", checked: reviewed, note: "Official starting point for regulated electric utility territory information in Florida." };
const usps: OfficialResource = { title: "Official USPS Change of Address", organization: "United States Postal Service", url: "https://moversguide.usps.com/", checked: reviewed, note: "Submit an official mail-forwarding request directly with USPS." };
const ready: OfficialResource = { title: "Power Outages", organization: "Ready.gov", url: "https://www.ready.gov/power-outages", checked: reviewed, note: "Federal preparedness guidance for power outages and household safety." };
const cpsc: OfficialResource = { title: "Home Safety Education", organization: "U.S. Consumer Product Safety Commission", url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Home", checked: reviewed, note: "Federal home-safety guidance covering common household risks." };
const readyPlan: OfficialResource = { title: "Plan Ahead for Disasters", organization: "Ready.gov", url: "https://www.ready.gov/", checked: "2026-08-01", note: "Federal guidance for household emergency plans, alerts, and supply kits." };
const floridaRentersInsurance: OfficialResource = { title: "Renters' Insurance Overview", organization: "Florida Department of Financial Services", url: "https://www.myfloridacfo.com/division/consumers/understanding-insurance/renters-insurance", checked: "2026-08-01", note: "Official Florida consumer information about renters' insurance coverage and questions to ask." };
const floridaLandlordTenant: OfficialResource = { title: "Landlord/Tenant Law in Florida", organization: "Florida Department of Agriculture and Consumer Services", url: "https://www.fdacs.gov/Consumer-Resources/Landlord-Tenant-Law-in-Florida", checked: "2026-08-01", note: "Official state summary covering move-in condition records, deposits, notices, and responsibilities; it is not legal advice." };
const spectrumAvailability: OfficialResource = { title: "Spectrum address check", organization: "Spectrum", url: "https://www.spectrum.com/address/localization", checked: "2026-08-07", note: "Confirm Spectrum service and available technology for the complete address." };
const xfinityAvailability: OfficialResource = { title: "Xfinity internet availability", organization: "Xfinity", url: "https://www.xfinity.com/learn/internet-service", checked: "2026-08-07", note: "Use the provider's current address flow to confirm service at the property." };
const attAvailability: OfficialResource = { title: "AT&T internet availability", organization: "AT&T", url: "https://www.att.com/buy/broadband/availability.html", checked: "2026-08-07", note: "Check the exact address for available AT&T internet technology." };
const quantumAvailability: OfficialResource = { title: "Quantum Fiber address check", organization: "Quantum Fiber", url: "https://www.quantumfiber.com/shop/", checked: "2026-08-07", note: "Confirm whether fiber service is available at the complete address." };

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
    title: "Find Internet Providers at Your Address", description: "Find possible internet providers, compare fiber, cable, fixed wireless, DSL, and satellite, and confirm availability for your exact address.",
    h1: "How to find internet providers at your address", eyebrow: "Internet provider address lookup",
    directAnswer: "Use the FCC National Broadband Map and each provider's official address checker. A ZIP code can identify possible providers, but final availability, technology, installation timing, and speeds must be confirmed for the exact street address and unit.",
    image: { src: "/images/resources/internet-move-setup.webp", alt: "Internet router, modem, fiber cable, moving box, and house keys ready for a move", width: 1440, height: 960 },
    published: "2026-07-29", reviewed: "2026-08-07",
    sections: [
      { heading: "Check the exact address in two places", paragraphs: ["Provider-reported coverage can differ between neighboring homes, buildings, and units. New construction may also be missing from one system even when nearby service exists."], steps: ["Enter the complete address in the FCC National Broadband Map.", "Review the providers and technologies reported for that location.", "Open each provider's official address checker.", "Confirm the exact unit, serviceability, installation date, and any construction work before ordering."] },
      { heading: "Why a ZIP-code list is incomplete", paragraphs: ["ZIP codes describe mail delivery areas, not broadband networks. A cable line may stop at one building, fiber may reach only part of a neighborhood, and an apartment may use a building-wide or preferred-provider arrangement. MoveIn ZIP pages therefore show possible providers and address tools rather than guaranteed coverage."] },
      { heading: "Understand the connection types", paragraphs: ["Fiber-to-the-premises runs optical fiber to the home or building. Cable typically uses coaxial or hybrid fiber-coaxial infrastructure. DSL uses copper telephone wiring. Fixed wireless connects to a nearby radio network, while satellite connects through equipment with a suitable view of the sky. Availability, latency, reliability, upload performance, and installation needs differ by address and technology."], steps: ["Filter the FCC map by fiber to check reported fiber availability.", "Confirm the technology again on the provider's address result.", "Ask whether the connection reaches the unit or only the building."] },
      { heading: "Compare the full service, not a temporary price", paragraphs: ["MoveIn does not rank providers or reproduce promotional offers. Compare the regular price after any introductory period, equipment terms, installation charges, data policies, contract or cancellation terms, support options, and the technology actually available at the address."], steps: ["Ask for the regular monthly price and all recurring fees.", "Confirm whether the modem, router, or gateway is included, rented, or customer-owned.", "Ask what must be returned when service ends.", "Keep the order confirmation and equipment receipt privately."] },
      { heading: "Schedule installation before the move", paragraphs: ["Appointment availability, equipment delivery, technician access, and new wiring can add lead time. Schedule early enough to avoid relying on a promised same-day activation, but do not overlap two paid accounts longer than needed."], steps: ["Ask the current provider whether service can transfer to the new address.", "Confirm the final service date at the old home and start date at the new one.", "Return or move equipment only as instructed.", "Keep temporary overlap only when it is necessary for work, school, or access."] },
      { heading: "Apartments, HOAs, and communities need an extra check", paragraphs: ["Ask management whether the unit is already wired, whether internet is included or billed through the property, whether a preferred provider serves the building, and whether drilling, exterior cable, equipment placement, or technician access needs approval. An HOA may also control exterior installations or shared conduit without choosing the household's service plan."] },
      { heading: "Confirm service at a new-construction address", paragraphs: ["A newly assigned address may not appear in every provider system. Search the FCC map, contact the provider's serviceability team, and ask the builder or community manager which physical networks reach the parcel. Do not assume that service at the model home proves service at the new residence."] },
    ],
    faqs: [
      { question: "How do I find every internet provider at my address?", answer: "Start with the FCC National Broadband Map, then verify each reported option with the provider's own address checker. The FCC map reflects provider reports, so direct confirmation is still necessary." },
      { question: "Can two houses in the same ZIP code have different internet options?", answer: "Yes. Networks, building wiring, unit access, and provider serviceability can vary between neighboring addresses even when they share a ZIP code." },
      { question: "How do I check whether fiber is available?", answer: "Search the complete address on the FCC map, filter for fiber, and then confirm the result with the provider's official address checker. Ask whether fiber reaches the residence or only the building or neighborhood." },
      { question: "When should I schedule internet installation before moving?", answer: "Check availability and appointment lead time as soon as the move date is firm. Choose a start date that provides needed access without creating unnecessary duplicate service." },
      { question: "Can renters install their own internet service?", answer: "Often, but the lease and building rules control physical changes and technician access. Confirm whether service is included, preferred, or restricted before authorizing drilling or new wiring." },
    ],
    related: ["/resources/check-internet-availability", "/resources/transfer-internet-when-moving", "/renters/internet-installation", "/resources/why-providers-vary-by-zip"], sources: [fcc, spectrumAvailability, xfinityAvailability, attAvailability, quantumAvailability],
  },
  {
    path: "/resources/check-internet-availability", section: "resources", slug: "check-internet-availability",
    title: "Check Internet Availability at Your Address", description: "Check reported internet availability for a specific address, verify fiber or cable technology, and resolve missing or conflicting provider results.",
    h1: "How to check internet availability at an address", eyebrow: "Address availability check",
    directAnswer: "Search the complete address on the FCC National Broadband Map, review the providers and technologies reported there, and verify each option with the provider's own address checker before ordering service.",
    published: "2026-08-07", reviewed: "2026-08-07",
    sections: [
      { heading: "Run an address-level availability check", paragraphs: ["A city or ZIP search can narrow the field, but the final answer belongs to the individual location."], steps: ["Select the fixed-broadband view on the FCC map.", "Enter the complete street address and choose the correct location point.", "Review provider names and reported connection technologies.", "Open the official address checker for each realistic option.", "Confirm serviceability and installation requirements before placing an order."] },
      { heading: "Check fiber, cable, DSL, fixed wireless, and satellite separately", paragraphs: ["The FCC map lets visitors filter reported fixed service by technology. Fiber means fiber-to-the-premises in this context; cable uses coaxial or hybrid fiber-coaxial networks; DSL uses copper; fixed wireless and satellite use different radio systems. A provider may report more than one technology near the address."] },
      { heading: "Resolve missing or conflicting results", paragraphs: ["A new home, changed unit number, recent network build, or inaccurate provider report can create disagreement between tools."], steps: ["Confirm the postal format and unit number.", "Ask the provider for a serviceability review rather than assuming the address is unavailable.", "Ask the builder or property manager which networks physically reach the location.", "Use the FCC challenge process when the map's location or availability information appears wrong."] },
    ],
    faqs: [
      { question: "Is internet availability accurate by ZIP code?", answer: "A ZIP code can identify possible providers, but it cannot confirm service for an individual home or apartment. Use the complete address and unit." },
      { question: "Does the FCC Broadband Map guarantee service?", answer: "No. It displays availability reported by providers. Confirm serviceability, technology, and installation directly with the provider." },
      { question: "Why is my new address missing from an internet checker?", answer: "New construction and address-format differences may not have reached every provider system. Ask for a serviceability review and verify the location point on the FCC map." },
    ],
    related: ["/resources/find-internet-providers", "/resources/transfer-internet-when-moving", "/resources/why-providers-vary-by-zip", "/renters/internet-installation"], sources: [fcc],
  },
  {
    path: "/resources/transfer-internet-when-moving", section: "resources", slug: "transfer-internet-when-moving",
    title: "How to Transfer Internet When Moving", description: "Check whether existing internet service can move with you, coordinate old and new service dates, equipment, installation, and apartment access.",
    h1: "How to transfer internet service when moving", eyebrow: "Internet move planning",
    directAnswer: "First confirm that the current provider serves the exact new address. Then compare transfer and new-service options, schedule the new connection, coordinate the old shutoff, and follow the provider's equipment instructions.",
    published: "2026-08-07", reviewed: "2026-08-07",
    sections: [
      { heading: "Check whether the provider serves the new address", paragraphs: ["Being an existing customer does not mean the same technology or plan is available after the move."], steps: ["Run the provider's official address check.", "Confirm the technology available at the new residence.", "Ask whether the account, plan, discounts, and equipment can transfer.", "Compare the regular ongoing cost with other verified options at the new address."] },
      { heading: "Coordinate dates without unnecessary duplicate service", paragraphs: ["Some households need a short overlap for remote work, school, cameras, or property access. Others can stop the old connection after the new one is confirmed."], steps: ["Choose the earliest reliable installation or activation date at the new address.", "Keep the old connection only as long as the household actually needs it.", "Do not cancel before confirming the new appointment and access requirements.", "Record both confirmation numbers privately."] },
      { heading: "Handle equipment and property access", paragraphs: ["Ask whether to move, exchange, or return the modem, gateway, router, power supply, and other rented equipment. Renters should confirm technician entry and obtain required approval before drilling or wiring changes."] },
    ],
    faqs: [
      { question: "Can I keep the same internet provider when I move?", answer: "Only if the provider confirms service at the exact new address. Available technology and plan terms may differ." },
      { question: "Should I cancel internet before moving?", answer: "Wait until the new address, installation plan, and dates are confirmed. Schedule the old shutoff to avoid a gap or an unnecessary long overlap." },
      { question: "Do I take the router and modem with me?", answer: "Follow the provider's instructions. Some equipment transfers with the account, while other devices must be exchanged or returned." },
    ],
    related: ["/resources/find-internet-providers", "/resources/check-internet-availability", "/resources/when-to-transfer-utilities", "/renters/internet-installation"], sources: [fcc, spectrumAvailability, xfinityAvailability, attAvailability, quantumAvailability],
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
    title: "When Should You Transfer Utilities When Moving?", description: "Use a before-move, move-day, and after-move sequence for electricity, water, internet, trash, renter, and homeowner utility responsibilities.",
    h1: "When should you transfer utilities before moving?", eyebrow: "Moving coordination",
    directAnswer: "Begin after the move date and responsibility date are firm. Confirm each provider by address, ask about lead time, schedule electricity and water for the responsibility date, arrange internet early, and verify trash service before the first collection day.",
    published: "2026-07-29", reviewed: "2026-08-07",
    sections: [
      { heading: "Before the move", paragraphs: ["Work backward from the date the lease or closing documents make the household responsible. A same-city move can still cross electric, water, trash, or internet boundaries; a long-distance move makes provider changes more likely."], steps: ["Confirm the responsibility date and exact service address.", "Identify possible electricity, water, sewer, internet, and trash providers.", "Ask each provider for current lead time, deposits, documents, and access requirements.", "Schedule electricity and water for the responsibility date.", "Schedule internet early enough for equipment delivery or a technician visit.", "Confirm whether trash starts automatically, through a utility account, or through the property."] },
      { heading: "On move day", paragraphs: ["Do not request a shutoff for another person's account and do not manipulate meters or sealed equipment."], steps: ["Confirm essential service is active at the new address.", "Keep provider confirmations available privately.", "Record visible meter readings when appropriate.", "Make sure a technician can enter the property if an appointment is scheduled.", "Report missing or unsafe service through the official provider or property contact."] },
      { heading: "Immediately after the move", paragraphs: ["Close or transfer the old accounts on the authorized date, return rented internet equipment as instructed, and verify the first statements."], steps: ["Check the service address and start or stop date on every account.", "Confirm deposits and approved charges.", "Save electric outage and water or sewer emergency contacts.", "Find the current trash and recycling schedule.", "Contact the provider promptly if the first statement is wrong."] },
      { heading: "Renters and homeowners use the same sequence differently", paragraphs: ["Renters should start with the lease because water, trash, or internet may be included or billed through management. Homeowners typically coordinate every service and should also save utility emergency contacts and locate safe household controls."] },
    ],
    faqs: [
      { question: "How far before moving should I transfer utilities?", answer: "Ask each confirmed provider as soon as the move date is firm. Lead times vary, and internet or new service construction may require more time than an account transfer." },
      { question: "Should electricity be on before move-in day?", answer: "Schedule electricity for the date responsibility begins so cooling, lighting, refrigeration, alarms, and other essential systems can operate." },
      { question: "Do I transfer utilities for a same-city move?", answer: "Often, but first confirm that the same providers serve the new address. Utility territories can change within one city or ZIP code." },
    ],
    related: ["/resources/transfer-internet-when-moving", "/resources/utility-setup-documents", "/homeowners/set-up-utilities", "/renters/set-up-utilities"], sources: [floridaPsc, fcc],
  },
  {
    path: "/resources/why-providers-vary-by-zip", section: "resources", slug: "why-providers-vary-by-zip",
    title: "Why Utility Providers Vary Within One ZIP Code", description: "Understand why ZIP codes can contain multiple electric, water, internet, and trash service arrangements.",
    h1: "Why providers can vary within the same ZIP code", eyebrow: "Service boundaries",
    directAnswer: "ZIP codes organize mail delivery; utility service follows infrastructure, municipal borders, districts, franchises, and property connections. A ZIP can therefore contain multiple possible providers.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Different systems use different boundaries", paragraphs: ["Electric territories, water systems, sewer connections, trash franchises, and broadband networks were not designed around one shared postal map. Each service can have a different boundary inside the same ZIP."] },
      { heading: "Property conditions also matter", paragraphs: ["A house may use a private well or septic system. A multifamily property may have a master utility account or building-wide internet arrangement. Collection responsibility may also sit with an HOA or property manager."] },
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
    title: "Utility Setup for New Homeowners", description: "Set up electricity, water, sewer or septic, internet, and trash service for a newly purchased home.",
    h1: "How to set up utilities for a new home", eyebrow: "Homeowner guide",
    directAnswer: "Confirm each provider for the exact address, schedule service for the responsibility date, save confirmations and emergency contacts, and verify the first bill. Treat water, sewer, internet, and trash as separate address checks.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Start with the essential accounts", paragraphs: ["Use the ZIP lookup to identify likely providers, then confirm the property with each official source."], steps: ["Electricity and outage contacts.", "Water plus sewer or septic status.", "Internet installation and property access.", "Trash, recycling, yard waste, and bulk collection.", "City and county emergency information."] },
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
      { heading: "Use confirmed provider contacts", paragraphs: ["An outage number is useful only when it belongs to the utility serving the property. Confirm the provider before saving the number."], steps: ["Electric outage phone and map.", "Water or sewer emergency line.", "City or county non-emergency contact.", "Property-management emergency contact when applicable."] },
      { heading: "Know which channel to use", paragraphs: ["Use 911 for immediate danger. Report utility outages, leaks, or service problems through the provider’s official emergency channel. Never approach a downed power line or open sealed utility equipment."] },
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
      { heading: "Separate included services from tenant accounts", paragraphs: ["Electricity, water, trash, and internet responsibilities vary by lease and building."], steps: ["Mark every utility the lease says is included.", "List accounts the tenant must open.", "Confirm providers for the exact unit.", "Ask about shared meters, billing allocations, or required providers."] },
      { heading: "Coordinate installation access", paragraphs: ["Internet or other installation work may require an appointment, building access, or written permission before drilling or modifying wiring."] },
      { heading: "Document the handoff", paragraphs: ["Keep utility confirmations with the lease and move-in condition report. Photograph visible meter readings when lawful and practical, and notify management promptly about mismatches or service problems."] },
    ],
    related: ["/renters/utility-responsibilities", "/renters/internet-installation", "/resources/utility-setup-documents", "/resources/when-to-transfer-utilities"], sources: [],
  },
  {
    path: "/renters/utility-responsibilities", section: "renters", slug: "utility-responsibilities",
    title: "Renter Utility Responsibilities", description: "Understand how a lease, property type, and local service arrangements determine utility responsibility.",
    h1: "Which utilities are renters responsible for?", eyebrow: "Read the lease",
    directAnswer: "The lease controls which utilities are included and which accounts the tenant must open. Never assume that water, trash, or internet is included because it was included at another property.",
    published: "2026-07-29", reviewed,
    sections: [
      { heading: "Build a responsibility list", paragraphs: ["Review utility clauses, addenda, building rules, and any separate billing disclosures."], steps: ["Electric account responsibility.", "Water and sewer billing method.", "Trash and recycling arrangement.", "Internet and installation rules.", "Building-managed services and shared meters."] },
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
    path: "/resources/utility-deposits", section: "resources", slug: "utility-deposits",
    title: "Utility Deposits and Account Requirements", description: "Understand common utility deposit, identification, credit, and start-service requirements without sharing sensitive details with MoveIn.",
    h1: "What to know about utility deposits", eyebrow: "Account requirements",
    directAnswer: "Deposits and waivers vary by provider, service, and account history. Confirm the amount, refund policy, accepted documents, and payment channel directly with the official provider before paying.", published: reviewed, reviewed,
    sections: [{ heading: "Ask before you pay", paragraphs: ["Request the written deposit amount, due date, refund or credit policy, and official payment method."], steps: ["Confirm the official provider.", "Ask which documents are required.", "Ask whether a waiver or installment option exists.", "Keep the receipt privately."] }, { heading: "Protect sensitive information", paragraphs: ["Do not send identification, bank details, or lease documents through unofficial links. MoveIn never requests them."] }, { heading: "Check the first statement", paragraphs: ["Confirm that the deposit, service address, start date, and any promised waiver or credit appear correctly. Contact the official provider promptly if they do not."] }], related: ["/resources/utilities-before-move-in-day", "/resources/utility-setup-documents", "/resources/when-to-transfer-utilities"], sources: [floridaPsc],
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
  {
    path: "/homeowners/first-week-home-safety", section: "homeowners", slug: "first-week-home-safety",
    title: "First-Week Home Safety Checklist", description: "Check locks, alarms, the breaker panel, GFCI outlets, water shutoffs, garage access, and emergency contacts during the first week in a home.",
    h1: "A first-week safety check for a new home", eyebrow: "Home safety",
    directAnswer: "Start with controls and alarms you may need in an emergency: confirm keys and access codes, locate the main water shutoff and electrical panel, test alarms, identify GFCI protection, and save official emergency contacts. Do not dismantle equipment or attempt work you are not qualified to perform.",
    published: "2026-08-01", reviewed: "2026-08-01",
    sections: [
      { heading: "Secure the ways into the home", paragraphs: ["Account for exterior keys, garage remotes, gate credentials, keypad codes, and any smart-lock access left by prior occupants. Follow HOA or property rules where they apply."], steps: ["Confirm every exterior door and window closes and locks.", "Change or rekey locks when appropriate.", "Reset garage, gate, and alarm access with the authorized system owner.", "Keep one safe backup entry plan."] },
      { heading: "Find critical controls without experimenting", paragraphs: ["Label the homeowner-accessible water shutoff and electrical panel only after confirming what each control does. Do not open sealed meter equipment, touch exposed wiring, force a damaged valve, or reset a breaker that repeatedly trips."], steps: ["Locate the main water shutoff.", "Locate the electrical panel and confirm its directory.", "Identify GFCI outlets and use their built-in test instructions.", "Ask a qualified professional about damaged, warm, sparking, leaking, or unfamiliar equipment."] },
      { heading: "Test alerts and prepare for an interruption", paragraphs: ["Confirm smoke and carbon-monoxide alarms are present where required, follow the manufacturer's test and replacement instructions, and save provider outage contacts before an emergency."], steps: ["Test alarms using their test controls.", "Check alarm age and battery instructions.", "Bookmark the confirmed electric outage map.", "Keep flashlights and a basic emergency kit accessible."] },
    ],
    related: ["/homeowners/find-water-shutoff", "/homeowners/save-outage-information", "/homeowners/home-records-and-maintenance"], sources: [cpsc, readyPlan],
  },
  {
    path: "/homeowners/home-records-and-maintenance", section: "homeowners", slug: "home-records-and-maintenance",
    title: "Home Records and Maintenance Setup", description: "Create an appliance record, insurance inventory, filter schedule, warranty file, and practical maintenance calendar after moving in.",
    h1: "Set up home records before details get lost", eyebrow: "Home organization",
    directAnswer: "Create one private home record with major appliance models, warranty and registration details, an insurance inventory, filter sizes, inspection priorities, and recurring maintenance dates. Store sensitive documents securely; MoveIn does not collect them.",
    published: "2026-08-01", reviewed: "2026-08-01",
    sections: [
      { heading: "Build an appliance and equipment list", paragraphs: ["Record the manufacturer, model, serial number, approximate age, warranty information, filter or consumable size, and authorized service contact for major equipment."], steps: ["Photograph equipment labels for your private records.", "Register eligible products through the manufacturer's official site.", "Keep purchase, warranty, and service documents together.", "Never publish serial numbers or access codes."] },
      { heading: "Start a simple maintenance calendar", paragraphs: ["Use manufacturer instructions, inspection findings, and qualified service advice instead of a generic interval when the equipment specifies its own schedule."], steps: ["Record the HVAC filter size and next check date.", "Schedule inspection priorities by safety and urgency.", "Add alarm, irrigation, pest, roof, drainage, and appliance checks when applicable.", "Review the list after major weather or service work."] },
      { heading: "Create a private insurance inventory", paragraphs: ["Photograph rooms and significant belongings, retain receipts where useful, and ask the insurer what documentation would support a future claim. Keep a protected backup away from the home or in secure cloud storage."], steps: ["Capture wide room views and important items.", "Record purchase information privately where available.", "Review policy limits and exclusions with the insurer or agent.", "Update the inventory after major purchases."] },
    ],
    related: ["/homeowners/first-week-home-safety", "/homeowners/set-up-utilities", "/homeowners/save-outage-information"], sources: [readyPlan],
  },
  {
    path: "/renters/document-move-in-condition", section: "renters", slug: "document-move-in-condition",
    title: "How to Document Rental Move-In Condition", description: "Create a dated move-in record of rooms, fixtures, appliances, keys, meter readings, and existing damage, then submit it through the lease process.",
    h1: "Document the rental before unpacking", eyebrow: "Move-in records",
    directAnswer: "Before belongings cover the surfaces, make a dated room-by-room record of the rental's condition, complete the required move-in form, and send it using the method in the lease. Keep a copy and do not rely only on photos stored on one phone.",
    published: "2026-08-01", reviewed: "2026-08-01",
    sections: [
      { heading: "Record each room consistently", paragraphs: ["Use wide photographs for context and closer images for existing wear, damage, stains, missing items, or nonworking fixtures. Do not include people, account information, or sensitive documents in the images."], steps: ["Start at the entry and move room by room.", "Capture walls, floors, ceilings, windows, doors, and built-in fixtures.", "Test appliances and controls the lease permits you to use.", "Record keys, remotes, access devices, and visible meter readings when appropriate."] },
      { heading: "Use the required reporting process", paragraphs: ["Complete the landlord or property manager's condition form, follow the lease's delivery method and deadline, and request confirmation that the record was received."], steps: ["Describe issues plainly without diagnosing hidden causes.", "Submit urgent safety or maintenance issues separately through the emergency or maintenance channel.", "Save the submitted form, images, correspondence, and receipt together."] },
      { heading: "Keep the record useful", paragraphs: ["Retain the original files and a backup throughout the tenancy. Add dated records when maintenance work changes the condition of the unit."], steps: ["Avoid editing original images.", "Keep work orders and repair confirmations.", "Repeat the same room-by-room process before move-out."] },
    ],
    related: ["/renters/renters-insurance-and-deposits", "/renters/maintenance-parking-and-pet-checklist", "/renters/utility-responsibilities"], sources: [floridaLandlordTenant],
  },
  {
    path: "/renters/renters-insurance-and-deposits", section: "renters", slug: "renters-insurance-and-deposits",
    title: "Renters Insurance, Deposits and Move-In Costs", description: "Understand renters insurance, security and utility deposits, move-in condition evidence, pet charges, receipts, and official Florida consumer resources.",
    h1: "Renters insurance, deposits, and move-in records", eyebrow: "Renter insurance and costs",
    directAnswer: "Read the lease and policy separately, document the rental before unpacking, and keep receipts for every deposit and fee. Renters insurance, security deposits, utility deposits, pet charges, and move-in costs serve different purposes and follow different terms.",
    image: { src: "/images/resources/renter-move-in-records.webp", alt: "Apartment move-in checklist, phone camera, key ring, document folder, and moving box", width: 1440, height: 960 },
    published: "2026-08-01", reviewed: "2026-08-07",
    sections: [
      { heading: "What renters insurance generally covers", paragraphs: ["A renters policy commonly addresses covered loss or damage to personal belongings, personal liability, and additional living expenses after a covered event. The exact causes of loss, exclusions, deductibles, limits, replacement-cost treatment, and temporary-housing rules come from the policy—not a general guide. Ask the insurer or agent to explain them before purchasing."] },
      { heading: "What it generally does not cover", paragraphs: ["A policy may exclude particular causes of loss, property, business use, flooding, pests, gradual damage, or damage that happens during a move. Coverage also does not replace the landlord's duty to maintain the building or automatically reimburse every moving expense. Read the exclusions and endorsements that apply to the actual policy."] },
      { heading: "Why a landlord may require coverage", paragraphs: ["A lease may require a liability limit, proof of coverage, or notice if a policy ends. That requirement does not make the landlord's property policy a substitute for the tenant's belongings coverage. Confirm the lease wording and send proof only through the authorized property process."] },
      { heading: "Separate security, utility, and pet charges", paragraphs: ["A security deposit is tied to the lease and property obligations. Electric, water, or other utility providers may require separate account deposits. Pet deposits, refundable pet charges, and nonrefundable pet fees should be identified by the lease or written property terms. Do not assume one payment covers another."], steps: ["Request an itemized move-in amount.", "Identify which payments are deposits and which are fees.", "Confirm which charges are refundable and under what written terms.", "Keep a receipt for each payment and the document describing it."] },
      { heading: "Document the condition before unpacking", paragraphs: ["Use the lease's move-in form, deadline, and submission method. Take dated wide and close photographs of rooms, fixtures, appliances, keys, and existing damage without capturing people or sensitive paperwork."], steps: ["Complete the required condition report.", "Submit existing damage through the authorized channel.", "Keep proof that the report was received.", "Store original images and a backup throughout the tenancy."] },
      { heading: "Prepare for move-out and deposit review", paragraphs: ["Deposit rules depend on the state, current law, lease, facts, notices, and condition of the rental. Avoid unsupported deadline assumptions. Retain the lease, payment receipts, move-in record, maintenance correspondence, notices, and move-out evidence, then use official consumer information or qualified legal advice for a specific dispute."] },
    ],
    faqs: [
      { question: "Does renters insurance cover moving damage?", answer: "It depends on the policy, cause of loss, property involved, exclusions, and any moving coverage. Ask the insurer whether damage during packing, transit, storage, or unloading is covered." },
      { question: "Can a landlord require renters insurance?", answer: "A lease may require renters insurance or a particular liability limit. Review the lease and policy terms; requirements and legal rules vary." },
      { question: "What should I photograph before moving in?", answer: "Photograph each room, walls, floors, ceilings, doors, windows, fixtures, appliances, keys, and existing damage. Follow the lease's condition-report process and keep proof of submission." },
      { question: "Are utility deposits separate from the security deposit?", answer: "Usually they are separate payments to different parties for different purposes. Confirm every amount and refund term in writing before paying." },
    ],
    related: ["/renters/renter-move-in-costs", "/renters/document-move-in-condition", "/renters/maintenance-parking-and-pet-checklist", "/resources/utility-deposits"], sources: [floridaRentersInsurance, floridaLandlordTenant],
  },
  {
    path: "/renters/renter-move-in-costs", section: "renters", slug: "renter-move-in-costs",
    title: "Renter Move-In Costs Checklist", description: "Organize rent, deposits, application and pet charges, utility starts, insurance, internet, moving, parking, and building-access costs before signing.",
    h1: "Plan renter move-in costs before the keys", eyebrow: "Renter budget",
    directAnswer: "Build an itemized list from the lease and written property terms: rent due at signing, security and pet charges, utility deposits, insurance, internet installation, moving costs, parking, access devices, and any building fees.",
    published: "2026-08-07", reviewed: "2026-08-07",
    sections: [
      { heading: "Request an itemized amount before paying", paragraphs: ["Labels matter because a deposit, nonrefundable fee, utility payment, rent charge, and third-party service cost are not interchangeable."], steps: ["List rent due before occupancy.", "Separate security, pet, key, parking, and building charges.", "Add utility account deposits or connection charges.", "Add renters insurance and internet installation or equipment.", "Budget for the move, storage, parking, and required access reservations."] },
      { heading: "Confirm which utilities the tenant actually opens", paragraphs: ["The lease may include water or trash, allocate a shared bill, or require the tenant to open electricity and internet. Confirm the exact unit and provider before paying a deposit or scheduling installation."] },
      { heading: "Keep records without exposing account details", paragraphs: ["Save the lease, itemized charges, receipts, provider confirmations, insurance proof, and move-in condition record privately. MoveIn does not collect payment details, lease files, account numbers, or identity documents."] },
    ],
    faqs: [
      { question: "What costs should a renter expect before move-in?", answer: "Common categories include rent due at signing, deposits and property fees, utility starts, insurance, internet setup, moving services, parking, and access devices. The lease and written property terms control the actual list." },
      { question: "Is a pet fee the same as a pet deposit?", answer: "Not necessarily. The written terms should identify whether a charge is refundable and what it covers." },
      { question: "Can utility companies require separate deposits?", answer: "Yes. Utility account requirements are separate from the landlord's security deposit and vary by provider and applicant." },
    ],
    related: ["/renters/renters-insurance-and-deposits", "/renters/set-up-utilities", "/resources/utility-deposits", "/renters/document-move-in-condition"], sources: [floridaRentersInsurance, floridaLandlordTenant, floridaPsc],
  },
  {
    path: "/renters/maintenance-parking-and-pet-checklist", section: "renters", slug: "maintenance-parking-and-pet-checklist",
    title: "Rental Maintenance, Parking, and Pet Checklist", description: "Confirm maintenance reporting, emergency contacts, parking permits, pet registration, packages, trash, and building access after moving into a rental.",
    h1: "Confirm the rental rules you will need every week", eyebrow: "Property routines",
    directAnswer: "Before the first problem, save the routine and emergency maintenance channels, learn written-notice requirements, and confirm parking, pet, package, trash, guest, and building-access rules from the lease and property manager.",
    published: "2026-08-01", reviewed: "2026-08-01",
    sections: [
      { heading: "Separate emergency and routine maintenance", paragraphs: ["Save the property manager's emergency definition and contact method. Use 911 for immediate danger and the confirmed utility outage channel for service interruptions outside the property."], steps: ["Save the emergency maintenance number.", "Bookmark the routine work-order system.", "Learn the required written-notice method.", "Keep copies of requests, photos, entry notices, and completed-work confirmations."] },
      { heading: "Prevent avoidable access and parking problems", paragraphs: ["Confirm how resident and guest vehicles are registered, where moving trucks may stop, and what credentials are needed for gates, elevators, package rooms, or amenities."], steps: ["Register vehicles and obtain permits before enforcement begins.", "Confirm guest, accessible, and towing rules.", "Test keys, remotes, fobs, and access codes.", "Report lost access devices promptly."] },
      { heading: "Confirm pets, trash, and recurring lease reminders", paragraphs: ["Complete required pet records and fees through the authorized process, learn waste and recycling locations, and calendar notice dates or renewal decisions that the lease makes important."], steps: ["Verify pet registration and vaccination-document requirements.", "Find trash, recycling, bulk-item, and moving-box procedures.", "Record filter or tenant-care duties stated in the lease.", "Calendar renewal, inspection, and move-out notice dates."] },
    ],
    related: ["/renters/document-move-in-condition", "/renters/renters-insurance-and-deposits", "/resources/find-trash-service"], sources: [floridaLandlordTenant],
  },
  {
    path: "/resources/utilities-before-move-in-day", section: "resources", slug: "utilities-before-move-in-day",
    title: "Utilities to Turn On Before Move-In Day", description: "Prioritize electricity, water, sewer, internet, trash, and emergency contacts before taking responsibility for a new home or rental.",
    h1: "What utilities should be on before move-in day?", eyebrow: "Move-in essentials",
    directAnswer: "Electricity and water should usually be active when responsibility begins. Confirm sewer or septic, arrange appointment-based internet early, identify trash service, and save official outage and emergency contacts before the first night.",
    published: "2026-08-03", reviewed: "2026-08-03",
    sections: [
      { heading: "Start essential services first", paragraphs: ["Electricity supports cooling, refrigeration, lighting, alarms, and many water or septic systems. Water is needed for sanitation and for checking fixtures safely. Never request a shutoff on another person's active account."], steps: ["Confirm the date responsibility begins.", "Verify the electric and water providers for the complete address.", "Schedule start or transfer service with confirmation numbers.", "Ask whether an in-person appointment, deposit, or document is required."] },
      { heading: "Treat internet as an installation project", paragraphs: ["Internet may require an address check, equipment shipment, technician visit, building access, or landlord approval. Provider-reported availability does not guarantee that a specific unit is ready."], steps: ["Check the exact address with the FCC map and provider tools.", "Confirm technology and the earliest installation date.", "Ask about wiring, drilling, equipment, and access rules."] },
      { heading: "Know the local routines before boxes arrive", paragraphs: ["Confirm trash and recycling responsibility, moving-box rules, and collection days. Save the county emergency page, confirmed electric outage map, and water or sewer emergency number."], steps: ["Find the current collection schedule.", "Plan for flattened moving boxes and bulk items.", "Save official outage and emergency contacts offline."] },
    ],
    faqs: [
      { question: "Which utilities are most important before move-in day?", answer: "Electricity and water are usually the first essentials. Confirm sewer or septic responsibility, schedule internet early, identify trash service, and save official emergency contacts." },
      { question: "Can I choose a utility provider from the ZIP code alone?", answer: "No. Use a ZIP result as a possible-provider shortlist and confirm the complete service address with the official provider before opening an account." },
      { question: "When should internet installation be scheduled?", answer: "Check the address and ask providers about installation lead time as early as practical because equipment, building access, wiring, or a technician appointment may be required." },
    ],
    related: ["/resources/when-to-transfer-utilities", "/resources/moving-utility-checklist", "/resources/find-internet-providers"], sources: [floridaPsc, fcc, ready],
  },
  {
    path: "/resources/moving-utility-checklist", section: "resources", slug: "moving-utility-checklist",
    title: "Moving Utility Checklist", description: "Use a staged checklist to identify providers, schedule service, protect account details, verify the first bill, and save outage contacts.",
    h1: "A moving utility checklist that prevents missed steps", eyebrow: "Moving checklist",
    directAnswer: "Work from the date you become responsible for the property: identify every service, confirm providers by address, schedule starts or transfers, keep confirmations private, inspect service on arrival, and verify the first statements.",
    published: "2026-08-03", reviewed: "2026-08-03",
    sections: [
      { heading: "Two to four weeks before responsibility", paragraphs: ["Lead times vary. Start early without changing another occupant's account."], steps: ["List electricity, water, sewer or septic, internet, trash, and any community-managed services.", "Check the lease or closing documents for responsibility dates.", "Use the ZIP lookup as a shortlist and confirm the complete address.", "Ask providers about lead time, deposits, appointments, and documents."] },
      { heading: "During the final week", paragraphs: ["Keep service confirmations, but do not put account numbers, identification, or payment details into a public checklist."], steps: ["Confirm start dates and installation windows.", "Arrange authorized property access.", "Save electric outage and utility-emergency contacts.", "Find the current trash schedule and moving-box rules."] },
      { heading: "On arrival and after the first bill", paragraphs: ["Do not manipulate sealed meters or unfamiliar equipment. Report missing, unsafe, leaking, or repeatedly tripping systems through the appropriate provider, property manager, or qualified professional."], steps: ["Confirm essential service is active.", "Record visible meter readings privately when appropriate.", "Check the service address, dates, deposits, and approved charges on each first statement.", "Store provider and outage contacts where the household can reach them."] },
    ],
    faqs: [
      { question: "How early should I begin the moving utility checklist?", answer: "Start two to four weeks before the responsibility date when possible, then confirm each provider's current lead time and any appointment or document requirements." },
      { question: "Should I cancel the current occupant's utility service?", answer: "No. Schedule only the service start or transfer you are authorized to request, using the responsibility date established by the lease or closing documents." },
      { question: "What should I verify on the first utility bill?", answer: "Check the service address, responsibility date, deposit, meter information when shown, and every approved charge. Contact the provider if any detail is wrong." },
    ],
    related: ["/resources/utilities-before-move-in-day", "/resources/utility-setup-documents", "/resources/when-to-transfer-utilities"], sources: [floridaPsc, ready],
  },
  {
    path: "/resources/homeowner-first-week-checklist", section: "resources", slug: "homeowner-first-week-checklist",
    title: "Homeowner First-Week Checklist", description: "Organize utilities, safety controls, emergency contacts, locks, property records, trash routines, and maintenance priorities during the first week.",
    h1: "The first week in a new home", eyebrow: "Homeowner checklist",
    directAnswer: "Use the first week to confirm utilities, locate safe household controls, test alarms according to their instructions, secure access, document the property privately, learn local collection routines, and turn inspection findings into a maintenance plan.",
    published: "2026-08-03", reviewed: "2026-08-03",
    sections: [
      { heading: "Confirm the essentials and emergency contacts", paragraphs: ["Verify that each account matches the correct address and responsibility date."], steps: ["Confirm electric, water, sewer or septic, internet, and trash responsibility.", "Save official electric outage and water or sewer emergency contacts.", "Bookmark county emergency alerts and shelter guidance.", "Find the current collection schedule."] },
      { heading: "Learn the home without unsafe experimentation", paragraphs: ["Locate the homeowner-accessible water shutoff and electrical panel, but do not open sealed equipment, touch exposed wiring, force damaged valves, or repeatedly reset a tripping breaker."], steps: ["Confirm keys, locks, garage remotes, gates, and alarm access.", "Test smoke and carbon-monoxide alarms using manufacturer instructions.", "Record HVAC filter size and major equipment labels privately.", "Escalate safety concerns to a qualified professional."] },
      { heading: "Create a short, prioritized home record", paragraphs: ["Combine inspection findings, warranties, appliance information, insurance inventory, and recurring maintenance dates in secure private storage."], steps: ["Address urgent safety and water-intrusion issues first.", "Keep receipts and warranty documents together.", "Calendar the next filter, alarm, drainage, and equipment checks."] },
    ],
    faqs: [
      { question: "What should a new homeowner do first?", answer: "Confirm essential utilities and emergency contacts, then learn safe household controls, test alarms according to their instructions, secure access, and prioritize urgent inspection findings." },
      { question: "What home information should be kept private?", answer: "Keep account numbers, access codes, identification, payment details, insurance inventories, equipment serial numbers, and property records in secure private storage." },
      { question: "Should I reset a breaker that keeps tripping?", answer: "No. Do not repeatedly reset a tripping breaker or handle exposed or sealed electrical equipment. Use the utility emergency channel or a qualified professional as appropriate." },
    ],
    related: ["/homeowners/first-week-home-safety", "/homeowners/home-records-and-maintenance", "/resources/moving-utility-checklist"], sources: [cpsc, readyPlan],
  },
  {
    path: "/resources/renter-first-week-checklist", section: "resources", slug: "renter-first-week-checklist",
    title: "Renter First-Week Checklist", description: "Confirm utility responsibilities, document move-in condition, save maintenance contacts, and learn building, parking, trash, internet, and access rules.",
    h1: "The first week in a new rental", eyebrow: "Renter checklist",
    directAnswer: "Read the lease responsibility list, open only the accounts assigned to the tenant, document the unit before unpacking, submit existing issues through the required process, and save both emergency and routine property contacts.",
    published: "2026-08-03", reviewed: "2026-08-03",
    sections: [
      { heading: "Match every service to the lease", paragraphs: ["A property may include water or trash, allocate a master bill, or require tenants to open individual electric and internet accounts."], steps: ["List included, tenant-paid, and property-managed services.", "Confirm the exact unit with each provider.", "Ask about internet wiring and installation permission.", "Keep account and payment details private."] },
      { heading: "Document condition and report issues", paragraphs: ["Follow the lease's form, deadline, and delivery method. Use wide and close photographs without capturing people or sensitive documents."], steps: ["Record each room, fixture, appliance, key, remote, and existing issue.", "Submit urgent safety or maintenance problems separately.", "Keep copies and proof of delivery."] },
      { heading: "Learn the weekly property routines", paragraphs: ["Save routine and emergency maintenance channels and confirm how the property handles entry notices, packages, guests, parking, pets, trash, recycling, and bulk items."], steps: ["Register vehicles and pets when required.", "Test authorized access devices.", "Find waste and moving-box procedures.", "Calendar lease notice and renewal dates."] },
    ],
    faqs: [
      { question: "Which utilities does a renter usually open?", answer: "The lease controls responsibility. Confirm which services are included, billed by the property, or assigned to the tenant before opening any account." },
      { question: "How should move-in condition be documented?", answer: "Follow the lease's form, deadline, and delivery method. Take clear room and issue photographs without capturing people or sensitive documents, then retain proof of delivery." },
      { question: "Which property contacts should a renter save?", answer: "Save separate emergency and routine maintenance channels along with authorized building access, utility outage, and local emergency information." },
    ],
    related: ["/renters/document-move-in-condition", "/renters/maintenance-parking-and-pet-checklist", "/resources/moving-utility-checklist"], sources: [floridaLandlordTenant],
  },
];

export const guidesByPath = new Map(guides.map((guide) => [guide.path, guide]));
export function getGuide(section: Guide["section"], slug: string) { return guides.find((guide) => guide.section === section && guide.slug === slug); }
export function guidesFor(section: Guide["section"]) { return guides.filter((guide) => guide.section === section); }
