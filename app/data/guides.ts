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
  featuredZips?: { zip: string; city: string }[];
  published: string;
  reviewed: string;
  sections: GuideSection[];
  faqs?: { question: string; answer: string }[];
  related: string[];
  sources: OfficialResource[];
};

const reviewed = "2026-07-29";
const fcc: OfficialResource = { title: "National Broadband Map", organization: "Federal Communications Commission", url: "https://broadbandmap.fcc.gov/home", checked: "2026-08-10", note: "Search provider-reported fixed broadband availability and technology by complete street address." };
const floridaPsc: OfficialResource = { title: "Find Your Utility Service Territories", organization: "Florida Public Service Commission", url: "https://www.psc.state.fl.us/find-utility-service", checked: "2026-08-10", note: "Official Florida map for electric and other utility service-territory research." };
const usps: OfficialResource = { title: "Official USPS Change of Address", organization: "United States Postal Service", url: "https://moversguide.usps.com/", checked: "2026-08-17", note: "Submit an official mail-forwarding request directly with USPS and avoid lookalike third-party services." };
const uspsAddressBasics: OfficialResource = { title: "Change of Address — The Basics", organization: "United States Postal Service", url: "https://faq.usps.com/articles/Knowledge/Change-of-Address-The-Basics", checked: "2026-08-17", note: "USPS guidance about online and in-person requests, identity verification, forwarding, and official channels." };
const ready: OfficialResource = { title: "Power Outages", organization: "Ready.gov", url: "https://www.ready.gov/power-outages", checked: reviewed, note: "Federal preparedness guidance for power outages and household safety." };
const cpsc: OfficialResource = { title: "Home Safety Education", organization: "U.S. Consumer Product Safety Commission", url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Home", checked: reviewed, note: "Federal home-safety guidance covering common household risks." };
const readyPlan: OfficialResource = { title: "Plan Ahead for Disasters", organization: "Ready.gov", url: "https://www.ready.gov/", checked: "2026-08-01", note: "Federal guidance for household emergency plans, alerts, and supply kits." };
const floridaRentersInsurance: OfficialResource = { title: "Renters' Insurance Overview", organization: "Florida Department of Financial Services", url: "https://www.myfloridacfo.com/division/consumers/understanding-insurance/renters-insurance", checked: "2026-08-01", note: "Official Florida consumer information about renters' insurance coverage and questions to ask." };
const floridaLandlordTenant: OfficialResource = { title: "Landlord/Tenant Law in Florida", organization: "Florida Department of Agriculture and Consumer Services", url: "https://www.fdacs.gov/Consumer-Resources/Landlord-Tenant-Law-in-Florida", checked: "2026-08-01", note: "Official state summary covering move-in condition records, deposits, notices, and responsibilities; it is not legal advice." };
const floridaSecurityDeposits: OfficialResource = { title: "Florida Statutes § 83.49 — Deposit money and advance rent", organization: "Florida Legislature", url: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0083/Sections/0083.49.html", checked: "2026-08-11", note: "Current statutory text governing Florida residential deposit money and advance rent. Read the statute and obtain qualified advice for a specific dispute." };
const spectrumAvailability: OfficialResource = { title: "Spectrum address check", organization: "Spectrum", url: "https://www.spectrum.com/address/localization", checked: "2026-08-07", note: "Confirm Spectrum service and available technology for the complete address." };
const attAvailability: OfficialResource = { title: "AT&T internet availability", organization: "AT&T", url: "https://www.att.com/buy/broadband/availability.html", checked: "2026-08-07", note: "Check the exact address for available AT&T internet technology." };
const tMobileAvailability: OfficialResource = { title: "T-Mobile Home Internet eligibility", organization: "T-Mobile", url: "https://www.t-mobile.com/home-internet/eligibility", checked: "2026-08-10", note: "Eligibility depends on the exact service address and current network capacity." };
const verizonAvailability: OfficialResource = { title: "Verizon Home Internet availability", organization: "Verizon", url: "https://www.verizon.com/home/internet/5g/", checked: "2026-08-10", note: "Check the complete address for 5G or LTE Home Internet eligibility." };
const flhsmvAddress: OfficialResource = { title: "Name and Address Changes", organization: "Florida Highway Safety and Motor Vehicles", url: "https://www.flhsmv.gov/name-and-address-changes/", checked: "2026-08-10", note: "Review current official driver license and motor-vehicle address requirements and use the authorized service channel." };
const floridaVoter: OfficialResource = { title: "Register or Update Voter Information", organization: "Florida Department of State", url: "https://registertovoteflorida.gov/home", checked: "2026-08-10", note: "Review eligibility and submit or update Florida voter registration through the official state system." };
const floridaHomestead: OfficialResource = { title: "Property Tax Exemptions", organization: "Florida Department of Revenue", url: "https://floridarevenue.com/property/pages/Taxpayers_Exemptions.aspx", checked: "2026-08-17", note: "Review official Florida exemption information, then use the applicable county property appraiser for property-specific filing and mailing details." };
const irsAddress: OfficialResource = { title: "Update My Information", organization: "Internal Revenue Service", url: "https://www.irs.gov/filing/individuals/update-my-information", checked: "2026-08-17", note: "Review current official options for notifying the IRS when an address changes. Submit sensitive tax information only through an authorized IRS method." };

export const guides: Guide[] = [
  {
    path: "/resources/find-electric-company", section: "resources", slug: "find-electric-company",
    title: "Find Your Electric Company by ZIP Code", description: "Use a ZIP code to find possible electric utilities, understand Florida service territories, and confirm the exact address before starting or transferring service.",
    h1: "How to find your electric company", eyebrow: "Electric service",
    directAnswer: "Start with your ZIP code to identify possible electric utilities, then confirm the complete service address with the utility. Electric territories can divide a ZIP code, so a mailing city alone is not proof of service.",
    published: "2026-07-29", reviewed: "2026-08-10",
    sections: [
      { heading: "Use the ZIP result as a shortlist", paragraphs: ["A MoveIn ZIP result can show municipal utilities, electric cooperatives, investor-owned utilities, or more than one possible provider. Read the coverage note beside each record before choosing an action."], steps: ["Enter the property ZIP code.", "Review every possible electric provider shown.", "Open the official start-service or address-check page.", "Confirm the complete address before paying a deposit or scheduling service."] },
      { heading: "Why more than one utility may appear", paragraphs: ["Electric service territories follow infrastructure and regulatory boundaries rather than postal routes. Two homes sharing a ZIP code—or even a mailing city—can have different utilities.", "When the evidence does not support one ZIP-wide provider, MoveIn lists the supported possibilities instead of guessing."] },
      { heading: "Know the main utility types", paragraphs: ["An investor-owned utility serves an approved territory as a regulated company. A municipal utility is owned by a city or public authority. An electric cooperative is member-owned and serves its defined territory. The organization name or mailing city does not prove which one serves a particular meter."] },
      { heading: "Start or transfer electric service", paragraphs: ["After confirming the provider, use its official start, stop, or move workflow. Ask for the current lead time, deposit or identity requirements, responsibility date, and confirmation method; those details vary by utility and account."], steps: ["Confirm the service address with the utility.", "Choose the date responsibility begins under the lease or closing documents.", "Use only the official provider payment and document channel.", "Check the first statement for the correct address and date."] },
      { heading: "Save outage information before you need it", paragraphs: ["After confirming the provider, save its outage-reporting number and official outage map. Use the utility’s emergency channel for electrical hazards and call 911 for immediate danger."], steps: ["Save the outage phone number in your contacts.", "Bookmark the official outage map.", "Know where the electrical panel is, but do not open sealed utility equipment."] },
    ],
    faqs: [
      { question: "How do I find my electric company?", answer: "Use the ZIP code as a shortlist, then confirm the complete street address with the possible utility or Florida's official territory map before opening an account." },
      { question: "Can more than one electric utility serve the same ZIP code?", answer: "Yes. A ZIP can cross municipal, cooperative, and investor-owned utility territories, even though one address normally has one assigned electric provider." },
      { question: "How do I report an electric outage?", answer: "Use the confirmed utility's official outage number, app, or outage map. Call 911 for immediate danger and stay away from downed lines." },
      { question: "How soon before moving should I start electric service?", answer: "Contact the confirmed utility after the move and responsibility dates are firm. Ask for its current lead time rather than assuming every provider follows the same schedule." },
    ],
    featuredZips: [{ zip: "32720", city: "DeLand" }, { zip: "32757", city: "Mount Dora" }, { zip: "34748", city: "Leesburg" }, { zip: "32801", city: "Orlando" }, { zip: "32746", city: "Lake Mary" }],
    related: ["/homeowners/set-up-utilities", "/homeowners/save-outage-information", "/resources/why-providers-vary-by-zip", "/resources/change-your-address"], sources: [floridaPsc, ready],
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
    directAnswer: "Use MoveIn's ZIP lookup to identify providers that may serve the area, then use the FCC National Broadband Map and each provider's official address checker. Final availability, technology, installation timing, and speeds must be confirmed for the exact street address and unit.",
    image: { src: "/images/resources/internet-move-setup.webp", alt: "Internet router, modem, fiber cable, moving box, and house keys ready for a move", width: 1440, height: 960 },
    published: "2026-07-29", reviewed: "2026-08-10",
    sections: [
      { heading: "Check the exact address in two places", paragraphs: ["Provider-reported coverage can differ between neighboring homes, buildings, and units. New construction may also be missing from one system even when nearby service exists."], steps: ["Enter the complete address in the FCC National Broadband Map.", "Review the providers and technologies reported for that location.", "Open each provider's official address checker.", "Confirm the exact unit, serviceability, installation date, and any construction work before ordering."] },
      { heading: "Why a ZIP-code list is incomplete", paragraphs: ["ZIP codes describe mail delivery areas, not broadband networks. A cable line may stop at one building, fiber may reach only part of a neighborhood, and an apartment may use a building-wide or preferred-provider arrangement. MoveIn ZIP pages therefore show possible providers and address tools rather than guaranteed coverage."] },
      { heading: "Why you should check more than one provider", paragraphs: ["The first familiar company may not be the only option. Checking both wired and wireless home Internet can reveal a different connection type, installation path, or ongoing service terms."], steps: ["Use MoveIn to review the market-supported shortlist.", "Open every realistic provider's address checker.", "Record the technology each provider actually offers at the address.", "Compare installation, equipment, regular terms, and support before ordering."] },
      { heading: "Understand the connection types", paragraphs: ["Fiber-to-the-premises runs optical fiber to the home or building. Cable typically uses coaxial or hybrid fiber-coaxial infrastructure. DSL uses copper telephone wiring. Fixed wireless connects to a nearby radio network, while satellite connects through equipment with a suitable view of the sky. Availability, latency, reliability, upload performance, and installation needs differ by address and technology."], steps: ["Filter the FCC map by fiber to check reported fiber availability.", "Confirm the technology again on the provider's address result.", "Ask whether the connection reaches the unit or only the building."] },
      { heading: "Compare the full service, not a temporary price", paragraphs: ["MoveIn does not rank providers or reproduce promotional offers. Compare the regular price after any introductory period, equipment terms, installation charges, data policies, contract or cancellation terms, support options, and the technology actually available at the address."], steps: ["Ask for the regular monthly price and all recurring fees.", "Confirm whether the modem, router, or gateway is included, rented, or customer-owned.", "Ask what must be returned when service ends.", "Keep the order confirmation and equipment receipt privately."] },
      { heading: "Why advertised speeds may not match the order", paragraphs: ["An advertised maximum can describe a plan, technology, or broader market rather than the serviceable option at one address. The provider's address result, selected plan, network conditions, in-home Wi-Fi, equipment, building wiring, and device capability can all affect the delivered experience. Ask which download and upload tier is actually orderable at the address and whether the result describes wired service or Wi-Fi performance."] },
      { heading: "Schedule installation before the move", paragraphs: ["Appointment availability, equipment delivery, technician access, and new wiring can add lead time. Schedule early enough to avoid relying on a promised same-day activation, but do not overlap two paid accounts longer than needed."], steps: ["Ask the current provider whether service can transfer to the new address.", "Confirm the final service date at the old home and start date at the new one.", "Return or move equipment only as instructed.", "Keep temporary overlap only when it is necessary for work, school, or access."] },
      { heading: "Apartments, HOAs, and communities need an extra check", paragraphs: ["Ask management whether the unit is already wired, whether internet is included or billed through the property, whether a preferred provider serves the building, and whether drilling, exterior cable, equipment placement, or technician access needs approval. An HOA may also control exterior installations or shared conduit without choosing the household's service plan."] },
      { heading: "Confirm service at a new-construction address", paragraphs: ["A newly assigned address may not appear in every provider system. Search the FCC map, contact the provider's serviceability team, and ask the builder or community manager which physical networks reach the parcel. Do not assume that service at the model home proves service at the new residence."] },
      { heading: "Questions to ask before ordering", paragraphs: ["Get the address-specific answer in writing or in the provider's order summary."], steps: ["Which technology and plan are orderable at this exact unit?", "Does activation require a technician, construction, or property access?", "Is the modem, router, or gateway rented, included, or customer-owned?", "What recurring fees, data terms, contract terms, and return requirements apply?", "What date can service reliably begin, and how can the appointment be changed?"] },
    ],
    faqs: [
      { question: "How do I find every internet provider at my address?", answer: "Start with the FCC National Broadband Map, then verify each reported option with the provider's own address checker. The FCC map reflects provider reports, so direct confirmation is still necessary." },
      { question: "Can two houses in the same ZIP code have different internet options?", answer: "Yes. Networks, building wiring, unit access, and provider serviceability can vary between neighboring addresses even when they share a ZIP code." },
      { question: "How do I check whether fiber is available?", answer: "Search the complete address on the FCC map, filter for fiber, and then confirm the result with the provider's official address checker. Ask whether fiber reaches the residence or only the building or neighborhood." },
      { question: "When should I schedule internet installation before moving?", answer: "Check availability and appointment lead time as soon as the move date is firm. Choose a start date that provides needed access without creating unnecessary duplicate service." },
      { question: "Can renters install their own internet service?", answer: "Often, but the lease and building rules control physical changes and technician access. Confirm whether service is included, preferred, or restricted before authorizing drilling or new wiring." },
    ],
    featuredZips: [{ zip: "32720", city: "DeLand" }, { zip: "32757", city: "Mount Dora" }, { zip: "34748", city: "Leesburg" }, { zip: "32801", city: "Orlando" }, { zip: "32746", city: "Lake Mary" }],
    related: ["/resources/check-internet-availability", "/resources/fiber-internet-availability", "/resources/transfer-internet-when-moving", "/renters/internet-installation"], sources: [fcc, spectrumAvailability, attAvailability, tMobileAvailability, verizonAvailability],
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
    related: ["/resources/find-internet-providers", "/resources/fiber-internet-availability", "/resources/transfer-internet-when-moving", "/renters/internet-installation"], sources: [fcc],
  },
  {
    path: "/resources/fiber-internet-availability", section: "resources", slug: "fiber-internet-availability",
    title: "How to Check Fiber Internet Availability", description: "Check whether fiber-to-the-premises is reported at an exact address, distinguish fiber from cable or fiber-fed networks, and confirm installation details.",
    h1: "How to check fiber internet availability at an address", eyebrow: "Fiber address check",
    directAnswer: "Search the complete address on the FCC National Broadband Map, filter the fixed-broadband results for fiber to the premises, and then confirm the address with the named provider. A fiber network near the property does not prove that fiber reaches the home or apartment unit.",
    published: "2026-08-10", reviewed: "2026-08-10",
    sections: [
      { heading: "Filter the address result for fiber", paragraphs: ["Use the location point for the complete address rather than a city or ZIP result."], steps: ["Open the fixed-broadband view on the FCC map.", "Enter the complete address and select the correct location.", "Filter or review the result for fiber to the premises.", "Open the provider's official address checker.", "Confirm that fiber—not another technology—is orderable before paying."] },
      { heading: "Fiber nearby is not the same as fiber at home", paragraphs: ["A provider can have fiber in a neighborhood, use fiber deeper in a cable network, or reach a multifamily building without extending fiber to every unit. Ask whether the final connection to the residence is fiber, coaxial cable, copper, or fixed wireless."] },
      { heading: "Apartments and new construction need extra verification", paragraphs: ["Building wiring, shared telecommunications rooms, access approval, and a newly assigned address can change the answer. Ask management or the builder which networks physically enter the property, then request a provider serviceability review when address tools disagree."] },
      { heading: "Confirm the installation before ordering", paragraphs: ["Ask whether a technician, optical network terminal, new cable path, exterior equipment, or property approval is needed. Renters and HOA residents should obtain any required authorization before physical changes."] },
    ],
    faqs: [
      { question: "Can I check fiber availability by ZIP code?", answer: "A ZIP can suggest providers, but it cannot confirm fiber for a residence. Search the complete address and unit, then verify with the provider." },
      { question: "Does a provider's fiber advertisement mean my address has fiber?", answer: "No. Marketing can describe a broader market. Confirm the technology that is actually orderable at the complete address." },
      { question: "Why is fiber shown at my building but not my unit?", answer: "The network may reach the property without reaching every unit, or the provider and building records may disagree. Ask management and the provider for a unit-level serviceability review." },
    ],
    related: ["/resources/find-internet-providers", "/resources/check-internet-availability", "/renters/internet-installation", "/resources/transfer-internet-when-moving"], sources: [fcc, spectrumAvailability, attAvailability],
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
      { heading: "Match the provider name to the official account", paragraphs: ["Older records or equipment may use a corporate or legacy name. For example, Comcast and Xfinity refer to the same provider identity in this workflow; do not create two comparison entries or two transfer tasks for them. Use the current official account and address checker."] },
    ],
    faqs: [
      { question: "Can I keep the same internet provider when I move?", answer: "Only if the provider confirms service at the exact new address. Available technology and plan terms may differ." },
      { question: "Should I cancel internet before moving?", answer: "Wait until the new address, installation plan, and dates are confirmed. Schedule the old shutoff to avoid a gap or an unnecessary long overlap." },
      { question: "Do I take the router and modem with me?", answer: "Follow the provider's instructions. Some equipment transfers with the account, while other devices must be exchanged or returned." },
    ],
    related: ["/resources/find-internet-providers", "/resources/check-internet-availability", "/resources/when-to-transfer-utilities", "/resources/change-your-address", "/renters/internet-installation"], sources: [fcc, spectrumAvailability, attAvailability, tMobileAvailability, verizonAvailability],
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
    related: ["/renters/what-utilities-do-renters-pay", "/homeowners/set-up-utilities", "/resources/mailing-city-vs-utility-jurisdiction"], sources: [],
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
    title: "When to Transfer Utilities When Moving", description: "Use a practical 1–2 week, final-days, move-in-day, and after-move schedule for electricity, water, internet, trash, renters, and homeowners.",
    h1: "When should you transfer utilities before moving?", eyebrow: "Moving coordination",
    directAnswer: "Begin after the move date and responsibility date are firm. Confirm each provider by address, ask about lead time, schedule electricity and water for the responsibility date, arrange internet early, and verify trash service before the first collection day.",
    published: "2026-07-29", reviewed: "2026-08-10",
    sections: [
      { heading: "1–2 weeks before moving", paragraphs: ["This is a planning window, not a universal provider deadline. Work backward from the date the lease or closing documents make the household responsible, then ask each confirmed provider for its actual lead time. A same-city move can still cross service territories; a long-distance move makes provider changes more likely."], steps: ["Confirm the responsibility date and exact service address.", "Identify possible electricity, water, sewer, internet, and trash providers.", "Ask each provider about current lead time, deposits, documents, and access.", "Check internet availability and technician timing early.", "Confirm whether the lease, HOA, or property handles any service."] },
      { heading: "A few days before moving", paragraphs: ["Reconfirm the essential starts and property access without changing another occupant's account."], steps: ["Reconfirm electricity and water for the responsibility date.", "Reconfirm internet equipment delivery or technician access.", "Confirm whether trash starts automatically or needs an account.", "Keep confirmation details privately.", "Plan only the old/new service overlap the household actually needs."] },
      { heading: "Move-in day", paragraphs: ["Do not request a shutoff for another person's account and do not manipulate meters or sealed equipment."], steps: ["Confirm essential service is active at the new address.", "Record visible meter readings when appropriate.", "Make sure an expected technician can enter approved areas.", "Report missing, leaking, or unsafe service through the official provider or property contact."] },
      { heading: "Immediately after move-in", paragraphs: ["Close or transfer old accounts on the authorized date, return rented internet equipment as instructed, and verify the first statements."], steps: ["Check the service address and start or stop date on every account.", "Confirm deposits and approved charges.", "Save electric outage and water or sewer emergency contacts.", "Find the current trash and recycling schedule.", "Contact the provider promptly if the first statement is wrong."] },
      { heading: "Renters and homeowners use the same sequence differently", paragraphs: ["Renters should start with the lease because water, trash, or internet may be included or billed through management. Homeowners typically coordinate every service and should also save utility emergency contacts and locate safe household controls."] },
    ],
    faqs: [
      { question: "How far before moving should I transfer utilities?", answer: "Ask each confirmed provider as soon as the move date is firm. Lead times vary, and internet or new service construction may require more time than an account transfer." },
      { question: "Should electricity be on before move-in day?", answer: "Schedule electricity for the date responsibility begins so cooling, lighting, refrigeration, alarms, and other essential systems can operate." },
      { question: "Do I transfer utilities for a same-city move?", answer: "Often, but first confirm that the same providers serve the new address. Utility territories can change within one city or ZIP code." },
    ],
    related: ["/resources/transfer-internet-when-moving", "/resources/moving-utility-checklist", "/resources/change-your-address", "/homeowners/set-up-utilities", "/renters/set-up-utilities"], sources: [floridaPsc, fcc],
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
    title: "Change of Address Checklist: Who to Notify When You Move", description: "Use this moving address-change checklist to update USPS, Florida records, banks, insurance, utilities, your employer, subscriptions, and other important accounts.",
    h1: "How to change your address after moving", eyebrow: "Change of address checklist",
    directAnswer: "Start with the official USPS Movers Guide for mail forwarding, then update government records, financial accounts, insurance, work, health care, subscriptions, and household services directly. USPS forwarding is a temporary safety net—not a replacement for changing the address held by each organization.",
    published: "2026-07-29", reviewed: "2026-08-17",
    sections: [
      { heading: "1. Submit mail forwarding through USPS", paragraphs: ["Go directly to the official USPS Movers Guide or visit a Post Office. USPS describes separate online and in-person processes and may require identity verification. A paid third-party website is not necessary.", "Choose the move type and forwarding start date that fit the household. Save the USPS confirmation privately so you can manage the request later."], steps: ["Confirm the web address is moversguide.usps.com or usps.com.", "Choose individual, family, or business forwarding accurately.", "Enter personal details only in the official USPS process.", "Keep confirmation information out of this public checklist and analytics."] },
      { heading: "2. Update Florida identity and civic records", paragraphs: ["Mail forwarding does not change a Florida driver license, state identification card, vehicle record, or voter registration. Review each agency's current instructions and eligibility requirements on its official website."], steps: ["Review Florida Highway Safety and Motor Vehicles address-change instructions.", "Update the applicable driver, identification, vehicle, and title records through an authorized channel.", "Review and update voter information through RegisterToVoteFlorida.gov.", "Keep receipts and confirmations privately."] },
      { heading: "3. Update money, insurance, and work", paragraphs: ["Change the address directly with organizations that send statements, replacement cards, tax documents, claim information, or other sensitive mail. Use a saved bookmark, official app, statement, or verified phone number—not a link in an unexpected message."], steps: ["Banks, credit unions, credit cards, loans, investment accounts, and payment services.", "Home, renters, auto, health, life, and other insurers.", "Employer payroll, benefits, and retirement administrators.", "Tax, benefits, licensing, or professional agencies that actually hold your address."] },
      { heading: "4. Update health, education, and household records", paragraphs: ["Finish the records that do not always forward cleanly or that affect service at the new home. Update only accounts that apply to the household."], steps: ["Health providers, pharmacy, health plan, school, or childcare records.", "Electric, water, internet, mobile phone, trash, and property accounts.", "Shopping profiles, recurring shipments, subscriptions, and membership organizations.", "Veterinarian, pet license, and microchip contact records.", "Friends, family, and emergency contacts who need the new mailing information."] },
      { heading: "5. Check old and new addresses for mistakes", paragraphs: ["Look for saved shipping addresses, autopay statements, returned mail, and service records still tied to the old home. Remove an old default address only after current orders, returns, and account access are settled.", "Do not place an exact street address, account number, identity document, or private confirmation in MoveIn analytics. The checklist below stores completion status only in this browser."] },
      { heading: "Renter and homeowner follow-up", paragraphs: ["Renters may also need to update the landlord or property manager, renters insurance, parking registration, pet records, and building access systems. Use the lease and written property instructions to decide what applies.", "Homeowners may need to update homeowners insurance, the mortgage servicer, an HOA, and the property-tax mailing address. Review homestead-exemption eligibility only through the official Florida and county property-appraiser resources; not every household or property qualifies."] },
      { heading: "Avoid change-of-address scams and duplicate fees", paragraphs: ["Advertisements and lookalike forms can appear official. Start from the government agency's known domain, read the destination before entering information, and do not send identity or payment details through an unverified moving-service link."] },
    ],
    faqs: [
      { question: "Is USPS mail forwarding enough after a move?", answer: "No. It can redirect eligible mail temporarily, but it does not update the address held by banks, insurers, government agencies, employers, health providers, utilities, or subscriptions." },
      { question: "Where should I change my address online?", answer: "Begin with the official USPS Movers Guide for mail forwarding. Update every other record through that organization's verified website, app, office, or phone number." },
      { question: "Does MoveIn save my new street address?", answer: "No. The progress checklist stores only completed item identifiers in the current browser. The printable information sheet is filled out by you and is not submitted to MoveIn." },
      { question: "Which Florida records should I review?", answer: "Review current FLHSMV instructions for driver, identification, vehicle, and title records, and use the official Florida voter-registration service for voter information. Requirements depend on the record and situation." },
    ],
    related: ["/resources/things-people-forget-when-moving", "/resources/when-to-transfer-utilities", "/resources/transfer-internet-when-moving", "/homeowners/set-up-utilities"], sources: [usps, uspsAddressBasics, flhsmvAddress, floridaVoter, irsAddress, floridaHomestead],
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
    related: ["/renters/what-utilities-do-renters-pay", "/renters/internet-installation", "/resources/utility-setup-documents", "/resources/when-to-transfer-utilities"], sources: [],
  },
  {
    path: "/renters/what-utilities-do-renters-pay", section: "renters", slug: "what-utilities-do-renters-pay",
    title: "What Utilities Do Renters Usually Pay?", description: "Use the lease to determine whether a renter pays electricity, water, sewer, trash, internet, or property-billed utility charges.",
    h1: "Which utilities do renters usually pay?", eyebrow: "Renter utility responsibilities",
    directAnswer: "Renters often open electricity and internet accounts, while water, sewer, or trash may be included or billed through the property. The lease and written billing disclosures—not the ZIP code or a prior rental—control what this tenant must pay.",
    published: "2026-07-29", reviewed: "2026-08-11",
    sections: [
      { heading: "Services the tenant commonly opens", paragraphs: ["A tenant may be expected to open electricity, internet, or another individually metered account. Even common arrangements are not universal."], steps: ["Find the lease clause for electricity.", "Confirm whether internet is optional, included, or property-billed.", "Ask which provider serves the exact unit.", "Confirm the date each tenant account must begin."] },
      { heading: "Services the property may include or allocate", paragraphs: ["Water, sewer, trash, pest service, or internet may be included in rent, charged as a separate property fee, or allocated from a shared account. Ask for the written calculation and billing schedule instead of assuming “included” means free or unlimited."] },
      { heading: "Use a renter utility checklist", paragraphs: ["Turn every service into a written answer before move-in."], steps: ["Who bills electricity?", "Who bills water and sewer?", "Where does trash and recycling go?", "Can the tenant choose an internet provider?", "Are any accounts shared or allocated?", "Are deposits, connection charges, or equipment charges due?", "Who handles outages and building-system repairs?"] },
      { heading: "Keep billing and maintenance separate", paragraphs: ["Paying a utility bill does not automatically make the tenant responsible for repairing a building system. Follow the lease’s maintenance process and report urgent problems through the designated channel."] },
    ],
    faqs: [
      { question: "Do renters usually pay electricity?", answer: "Many renters open an electricity account, but the lease and property arrangement control the answer for the unit." },
      { question: "Is water normally included in rent?", answer: "It may be included, allocated, separately billed by the property, or placed in the tenant's name. Confirm the written billing method." },
      { question: "Can a ZIP code identify which utilities a renter pays?", answer: "No. A ZIP can suggest possible providers, but only the lease and property billing terms determine responsibility." },
    ],
    related: ["/renters/set-up-utilities", "/renters/internet-installation", "/resources/find-trash-service", "/resources/utility-deposits"], sources: [],
  },
  {
    path: "/renters/internet-installation", section: "renters", slug: "internet-installation",
    title: "Internet Setup for a New Apartment", description: "Confirm unit-level internet availability, building access, preferred providers, wiring rules, equipment, and landlord permission before installation.",
    h1: "How to set up internet in a new apartment", eyebrow: "Apartment internet setup",
    directAnswer: "Check provider availability for the exact unit, review the lease and building rules, and obtain permission before drilling, running exterior cable, or changing shared wiring.",
    published: "2026-07-29", reviewed: "2026-08-10",
    sections: [
      { heading: "Confirm the unit, not just the building", paragraphs: ["A provider may report service at the street address while a particular unit lacks the required wiring or access."], steps: ["Search the full address and unit.", "Ask whether the building has an approved or exclusive arrangement.", "Confirm equipment and installation charges.", "Coordinate access with management."] },
      { heading: "Get permission for physical changes", paragraphs: ["Do not authorize drilling, new exterior lines, roof access, or wiring changes without the permission required by the lease or property manager."] },
      { heading: "Ask what the building already provides", paragraphs: ["Some apartments include internet, bill it through the property, maintain a preferred-provider arrangement, or have limited wiring paths. Ask what is included, whether residents may order another provider, and how service issues are handled before opening a separate account."] },
      { heading: "Record equipment and return terms", paragraphs: ["Keep serial numbers, receipts, and return instructions for rented equipment. Confirm how service should be canceled or transferred at move-out."] },
    ],
    faqs: [
      { question: "Can an apartment restrict internet providers?", answer: "Building wiring, access, included service, or property agreements can limit practical options. Review the lease and ask management what residents may order for the exact unit." },
      { question: "Can a provider serve the building but not my unit?", answer: "Yes. Unit wiring, prior service, access, or provider records can differ. Ask for a unit-level serviceability check." },
      { question: "Do I need permission for internet installation?", answer: "Obtain any permission required by the lease or property before drilling, exterior cable, shared-room access, or other physical changes." },
    ],
    related: ["/resources/find-internet-providers", "/resources/fiber-internet-availability", "/renters/set-up-utilities", "/renters/what-utilities-do-renters-pay"], sources: [fcc],
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
    related: ["/renters/what-to-photograph-before-moving-in", "/renters/renters-insurance-and-deposits", "/renters/maintenance-parking-and-pet-checklist", "/renters/what-utilities-do-renters-pay"], sources: [floridaLandlordTenant],
  },
  {
    path: "/renters/renters-insurance-and-deposits", section: "renters", slug: "renters-insurance-and-deposits",
    title: "Renters Insurance, Security Deposits & Move-In Costs", description: "Understand renters insurance coverage, security and utility deposits, deductibles, exclusions, move-in expenses, condition records, and receipts.",
    h1: "Renters insurance, security deposits, and move-in costs", eyebrow: "Renter financial setup",
    directAnswer: "Renters insurance may cover personal property, liability, and additional living expenses after a covered loss, while security and utility deposits secure different obligations. Read the policy and lease separately, document the rental before unpacking, and keep an itemized record of every charge and receipt.",
    image: { src: "/images/resources/renter-move-in-records.webp", alt: "Apartment move-in checklist, phone camera, key ring, document folder, and moving box", width: 1440, height: 960 },
    published: "2026-08-01", reviewed: "2026-08-10",
    sections: [
      { heading: "What renters insurance generally covers", paragraphs: ["A renters policy commonly addresses covered loss or damage to personal belongings, personal liability, and additional living expenses after a covered event. The landlord's building policy generally protects the building owner's interests rather than replacing the tenant's belongings coverage."], steps: ["Confirm the covered causes of loss.", "Review personal-property and liability limits.", "Ask when additional living expenses apply.", "Check special limits for valuable categories."] },
      { heading: "Deductibles, claim settlement, and exclusions", paragraphs: ["A deductible is the amount applied to a covered claim under the policy terms. Actual-cash-value and replacement-cost settlement can produce different results. Policies can exclude or limit flood, pests, gradual damage, business property, particular valuables, and other losses, so do not infer coverage from a general description."], steps: ["Read the declarations, exclusions, limits, and endorsements.", "Ask how the deductible applies.", "Confirm actual-cash-value or replacement-cost treatment.", "Ask specifically about belongings while packing, moving, or in storage."] },
      { heading: "Why a landlord may require coverage", paragraphs: ["A lease may require proof of insurance, a liability limit, or notice if coverage ends. A property requirement is not a recommendation from MoveIn, and it does not establish that a particular policy is appropriate. Confirm the written requirement and send proof only through the authorized property process."] },
      { heading: "Create a private belongings record", paragraphs: ["Photograph rooms and significant belongings, retain receipts or model information when useful, and keep a protected backup away from the rental. Do not upload an inventory, policy, receipt, or serial number to MoveIn."], steps: ["Capture wide room views.", "Add useful close views of significant items.", "Preserve originals and purchase records privately.", "Ask the insurer what documentation it recommends."] },
      { heading: "What a security deposit is", paragraphs: ["A security deposit is money held under the rental agreement to secure specified tenant obligations. It is different from rent, a utility deposit, an application fee, or a nonrefundable charge. The lease and applicable law determine how it is handled."], steps: ["Request an itemized move-in statement.", "Identify deposits separately from fees and rent.", "Keep the signed lease and each receipt.", "Save written communication about the deposit."] },
      { heading: "Document condition and communication", paragraphs: ["Before unpacking, use wide and close photographs or video to record existing conditions, complete the required inspection form, and report issues through the lease's authorized method. Photos can support a record but do not guarantee a deposit outcome."], steps: ["Preserve timestamped originals.", "Keep a copy of the submitted condition form.", "Request confirmation of receipt.", "Save maintenance correspondence throughout the tenancy."] },
      { heading: "Utility deposits are separate", paragraphs: ["Electric, water, or other providers may require a separate account deposit. Internet service can also involve equipment, installation, or activation charges. Requirements can depend on the provider, account history, existing-customer status, payment history, and applicable rules; confirm current terms directly and do not assume a dollar amount."], steps: ["Confirm the official provider.", "Ask whether a deposit or activation charge applies.", "Ask about written waiver and refund terms.", "Keep the provider receipt privately."] },
      { heading: "Florida-specific deposit information", paragraphs: ["For Florida rentals, the current text of section 83.49, Florida Statutes, and the Florida Department of Agriculture and Consumer Services consumer summary describe deposit handling and notice rules. These rules are separate from the general planning guidance above and can depend on the facts, current law, lease, and delivery of notice. Review the current official sources or obtain qualified legal advice for a specific dispute."] },
    ],
    faqs: [
      { question: "Does renters insurance cover moving damage?", answer: "It depends on the policy, cause of loss, property involved, exclusions, and any moving coverage. Ask the insurer whether damage during packing, transit, storage, or unloading is covered." },
      { question: "Can a landlord require renters insurance?", answer: "A lease may require renters insurance or a particular liability limit. Review the lease and policy terms; requirements and legal rules vary." },
      { question: "What should I photograph before moving in?", answer: "Photograph each room, walls, floors, ceilings, doors, windows, fixtures, appliances, keys, and existing damage. Follow the lease's condition-report process and keep proof of submission." },
      { question: "Are utility deposits separate from the security deposit?", answer: "Usually they are separate payments to different parties for different purposes. Confirm every amount and refund term in writing before paying." },
      { question: "Does a landlord's insurance cover a renter's belongings?", answer: "The building owner's policy generally does not replace a tenant's personal-property coverage. Review the renter policy and the landlord's written requirements separately." },
      { question: "Do security-deposit rules vary by state?", answer: "Yes. Deposit handling, notices, deadlines, and remedies can depend on state law, the lease, and the facts. Use current official sources for the rental's jurisdiction." },
    ],
    related: ["/renters/move-in-costs", "/renters/document-move-in-condition", "/renters/what-to-photograph-before-moving-in", "/resources/utility-deposits"], sources: [floridaRentersInsurance, floridaLandlordTenant, floridaSecurityDeposits],
  },
  {
    path: "/renters/move-in-costs", section: "renters", slug: "move-in-costs",
    title: "Apartment Move-In Costs for Renters", description: "Plan rent, deposits, application and pet charges, utility starts, insurance, internet, moving, parking, access, and first-week household costs.",
    h1: "What apartment move-in costs should renters plan for?", eyebrow: "Renter move-in budget",
    directAnswer: "Build the budget from the lease and written property terms: application or screening charges, rent due before occupancy, security and pet charges, utility deposits, insurance, internet setup, moving, parking, access devices, and first-week household needs.",
    published: "2026-08-07", reviewed: "2026-08-10",
    sections: [
      { heading: "Before signing", paragraphs: ["Ask for written amounts and refund terms before treating a rental as affordable."], steps: ["Application or screening charge where applicable.", "Holding deposit or reservation charge where applicable.", "Security-deposit or deposit-alternative terms.", "Pet, parking, amenity, or administration charges.", "Required insurance and utility responsibilities."] },
      { heading: "Before move-in", paragraphs: ["Separate every deposit, fee, rent payment, and third-party cost so the total is understandable."], steps: ["First month's rent and any other rent due under the written terms.", "Security and pet deposits or charges.", "Electric or water account deposits.", "Renters-insurance amount due before occupancy.", "Internet equipment or installation.", "Parking, keys, fobs, elevator, or access arrangements.", "Movers, truck, storage, supplies, and transportation."] },
      { heading: "After move-in", paragraphs: ["Keep room for costs that become clear only after the unit is accessible."], steps: ["Basic kitchen, bathroom, cleaning, and laundry supplies.", "Utility bills and property-allocated charges.", "Parking permits or replacement access devices where relevant.", "Approved window coverings, bulbs, or small household needs."] },
      { heading: "Use amounts from the actual rental", paragraphs: ["MoveIn does not publish an unsourced national average. Use the written lease, property statement, official providers, insurer, and moving vendors. Enter optional amounts in the calculator or use the blank expense planner, then keep payment and account details privately."] },
    ],
    faqs: [
      { question: "What costs should a renter expect before move-in?", answer: "Common categories include rent due at signing, deposits and property fees, utility starts, insurance, internet setup, moving services, parking, and access devices. The lease and written property terms control the actual list." },
      { question: "Is a pet fee the same as a pet deposit?", answer: "Not necessarily. The written terms should identify whether a charge is refundable and what it covers." },
      { question: "Can utility companies require separate deposits?", answer: "Yes. Utility account requirements are separate from the landlord's security deposit and vary by provider and applicant." },
    ],
    related: ["/renters/renters-insurance-and-deposits", "/renters/set-up-utilities", "/resources/utility-deposits", "/renters/questions-before-signing-a-lease"], sources: [floridaRentersInsurance, floridaLandlordTenant, floridaPsc],
  },
  {
    path: "/renters/what-to-photograph-before-moving-in", section: "renters", slug: "what-to-photograph-before-moving-in",
    title: "What Renters Should Photograph Before Unpacking", description: "Create a clear photo and video record of apartment walls, floors, appliances, fixtures, doors, windows, water damage, safety equipment, and existing wear.",
    h1: "What should renters photograph before moving in?", eyebrow: "Rental condition photos",
    directAnswer: "Before boxes cover the rental, photograph each room from a wide angle and add close-ups of existing damage, stains, scratches, appliance condition, fixtures, doors, windows, and visible safety equipment. Preserve the originals, submit issues through the lease's process, and keep proof of delivery.",
    published: "2026-08-11", reviewed: "2026-08-11",
    sections: [
      { heading: "Start with wide views, then add detail", paragraphs: ["Wide views show where an issue is located; close views show its condition. Keep a consistent room-by-room sequence so the files remain understandable later."], steps: ["Capture the entry and each full room.", "Photograph walls, ceilings, floors, and trim.", "Add close-ups of stains, holes, chips, scratches, or swelling.", "Include an object for scale when it helps without hiding the issue."] },
      { heading: "Record fixtures, appliances, and access", paragraphs: ["Photograph the refrigerator and freezer interior, stove, oven, dishwasher, sink, cabinets, counters, bathroom fixtures, windows, blinds, doors, locks, keys, remotes, and included furniture where applicable."], steps: ["Record visible appliance condition before first use.", "Capture doors and windows both closed and at problem areas.", "Photograph keys or access devices without exposing codes.", "Do not dismantle equipment to create a photograph."] },
      { heading: "Look for water and safety concerns", paragraphs: ["Record visible water stains, active leaks, damaged flooring, discoloration, missing covers, smoke alarms, carbon-monoxide alarms where present or required, HVAC controls, hot-water problems, and breaker-panel access. Report urgent conditions promptly instead of treating photography as the repair request."] },
      { heading: "Add relevant exterior or meter records", paragraphs: ["Where the lease and property rules allow, photograph the assigned parking area, storage space, exterior condition connected to the unit, and visible utility meter readings. Do not enter restricted areas or open sealed utility equipment."] },
      { heading: "Preserve originals and written communication", paragraphs: ["Keep the original files with their dates, maintain a second protected copy, complete the property's condition form, and save the message or portal receipt showing what was reported. Do not delete the originals after sending copies. Photos and video can support a record but do not guarantee a deposit outcome."] },
    ],
    faqs: [
      { question: "Should renters take pictures before unpacking?", answer: "Yes. Clear surfaces make it easier to record the rental's starting condition and distinguish existing issues from belongings." },
      { question: "Are photographs enough without an inspection form?", answer: "No. Complete the form and reporting process required by the lease or property, and keep proof that it was received." },
      { question: "Should renters keep the original files?", answer: "Yes. Preserve originals and a protected backup throughout the tenancy rather than keeping only compressed copies sent through a portal." },
    ],
    related: ["/renters/document-move-in-condition", "/renters/renters-insurance-and-deposits", "/renters/maintenance-parking-and-pet-checklist"], sources: [floridaLandlordTenant],
  },
  {
    path: "/renters/questions-before-signing-a-lease", section: "renters", slug: "questions-before-signing-a-lease",
    title: "Questions to Ask Before Signing a Lease", description: "Ask practical questions about utilities, insurance, deposits, internet, parking, pets, maintenance, condition records, and move-in access before signing.",
    h1: "Questions to ask before signing a lease", eyebrow: "Before committing",
    directAnswer: "Before signing, get written answers about included utilities, accounts the tenant opens, insurance and deposits, internet choices, parking, pets, maintenance reporting, condition documentation, and move-in access. This checklist supports practical planning; it is not legal lease review.",
    published: "2026-08-11", reviewed: "2026-08-11",
    sections: [
      { heading: "Utilities and internet", paragraphs: ["Ask which services are included, separately billed by the property, allocated from a shared account, or opened directly by the tenant."], steps: ["Who opens electricity?", "How are water and sewer billed?", "Who handles trash and recycling?", "Can the tenant choose an internet provider?", "Are utility deposits or connection charges expected?", "Are there technician-access or wiring restrictions?"] },
      { heading: "Insurance, deposits, and move-in charges", paragraphs: ["Request an itemized written amount rather than relying on a verbal total."], steps: ["Is renters insurance required, and what proof is requested?", "Which amounts are rent, deposits, or nonrefundable fees?", "Are pet, parking, key, or amenity charges separate?", "When is each payment due?", "What written terms govern refunds or deposit alternatives?"] },
      { heading: "Maintenance and documentation", paragraphs: ["Know how to report both existing damage and future maintenance."], steps: ["How are routine requests submitted?", "What is the emergency maintenance channel?", "Which move-in condition form is required?", "When and how should existing damage be reported?", "Will the property confirm receipt in writing?"] },
      { heading: "Access, parking, pets, and move-in day", paragraphs: ["Confirm the practical rules that can delay a move or create an unexpected charge."], steps: ["What keys, fobs, permits, or access devices are issued?", "Where may residents, guests, and moving vehicles park?", "Are elevators or loading areas reserved?", "What pet approvals and records are required?", "Are there move-in date, time, or insurance restrictions for movers?"] },
      { heading: "Keep the final answers with the lease", paragraphs: ["Ask for promises, changes, included services, and charges to appear in the signed documents or authorized written communication. MoveIn does not review or store the lease; obtain qualified advice if you need help interpreting legal rights or obligations."] },
    ],
    faqs: [
      { question: "Which utility question matters most before signing?", answer: "Ask for a written list of services included in rent, services billed by the property, and accounts the tenant must open." },
      { question: "Should move-in charges be itemized?", answer: "Request a written itemization that distinguishes rent, refundable deposits, nonrefundable charges, and third-party costs." },
      { question: "Does this checklist replace lease review?", answer: "No. It organizes practical questions but does not interpret the lease or provide legal advice." },
    ],
    related: ["/renters/move-in-costs", "/renters/what-utilities-do-renters-pay", "/renters/renters-insurance-and-deposits", "/renters/maintenance-parking-and-pet-checklist"], sources: [floridaLandlordTenant],
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
  {
    path: "/resources/things-people-forget-when-moving", section: "resources", slug: "things-people-forget-when-moving",
    title: "Things People Forget to Do After Moving", description: "A practical list of address, utility, safety, insurance, household, pet, emergency, and home-record tasks people often miss after moving.",
    h1: "Things people forget to do after moving", eyebrow: "The list after the list",
    directAnswer: "After the essential utilities work, check the records and household details that moving day pushes aside: government and financial addresses, old account stop dates, trash routines, alarm tests, meter photos, outage contacts, pet records, emergency information, and first-month home records.",
    published: "2026-08-10", reviewed: "2026-08-10",
    sections: [
      { heading: "Update more than USPS", paragraphs: ["Mail forwarding is a safety net, not a complete address update. Use official channels and update only organizations that actually hold your information."], steps: ["Review driver license or state ID requirements.", "Review vehicle registration and voter registration information.", "Update banks, cards, investment accounts, insurers, employer, payroll, and retirement accounts.", "Update doctors, dentists, pharmacies, schools, professional licenses, and emergency contacts.", "Update recurring deliveries, subscriptions, loyalty accounts, shopping profiles, veterinarian, and pet microchip contact details."] },
      { heading: "Close the utility handoff", paragraphs: ["Take a photo of visible meter readings before the moving truck leaves. It gives you a private record of where service started without touching sealed equipment."], steps: ["Confirm new electricity and water start dates.", "Close or transfer old accounts only on the authorized date.", "Return rented internet equipment and verify the new installation.", "Confirm trash day, recycling rules, and moving-box disposal.", "Save electric outage and water or sewer emergency contacts."] },
      { heading: "Learn the controls before an emergency", paragraphs: ["Recognition and documentation matter more than DIY repair. Ask a property manager or qualified professional when equipment is damaged, unfamiliar, or unsafe."], steps: ["Locate the homeowner-accessible water shutoff and electrical panel.", "Test smoke and carbon-monoxide alarms using their instructions.", "Confirm keys, locks, fobs, garage remotes, and access codes.", "Review county alerts, evacuation information, and household emergency supplies."] },
      { heading: "Create first-month records", paragraphs: ["A short private record prevents model numbers, receipts, and inspection priorities from disappearing into moving boxes."], steps: ["Inspect the HVAC filter and record its size and manufacturer guidance.", "Create a private home inventory.", "Record appliance models, serial numbers, warranties, and service contacts privately.", "Review HOA, lease, parking, pet, package, and maintenance routines.", "Turn inspection or move-in condition findings into a prioritized follow-up list."] },
      { heading: "Use a checklist without giving up your data", paragraphs: ["My Move stores progress in the current browser without an account. The printable version works without an email and can be saved as a PDF through the browser print dialog."], steps: ["Add the forgotten-item review to My Move.", "Open the printable for an offline copy.", "Keep account numbers, access codes, identity documents, exact addresses, and private notes out of analytics and public worksheets."] },
    ],
    faqs: [
      { question: "What is most often forgotten after moving?", answer: "Address updates beyond USPS, old utility stop dates, trash routines, meter photos, outage contacts, pet records, alarm tests, HVAC filter information, and a private home inventory are common practical misses." },
      { question: "What should I do before unpacking?", answer: "Photograph rental or property condition, visible meter readings, rooms, fixtures, and existing issues before boxes hide the details. Keep the images private." },
      { question: "Should I update every address at once?", answer: "Prioritize government, financial, insurance, employer, health, and essential service records, then work through recurring deliveries and household accounts. Use official channels." },
    ],
    related: ["/resources/change-your-address", "/resources/when-to-transfer-utilities", "/homeowners/first-week-home-safety", "/renters/document-move-in-condition"], sources: [usps, flhsmvAddress, floridaVoter, cpsc, readyPlan],
  },
];

export const guidesByPath = new Map(guides.map((guide) => [guide.path, guide]));
export function getGuide(section: Guide["section"], slug: string) { return guides.find((guide) => guide.section === section && guide.slug === slug); }
export function guidesFor(section: Guide["section"]) { return guides.filter((guide) => guide.section === section); }
