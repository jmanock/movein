export type Printable = {
  slug: string;
  title: string;
  description: string;
  audience: string;
  intro: string;
  reviewed: string;
  sections: Array<{ title: string; kind?: "checklist" | "fields"; items: string[] }>;
  related: Array<{ label: string; href: string }>;
};

const reviewed = "2026-08-10";

export const printables: Printable[] = [
  {
    slug: "utility-setup-checklist",
    title: "Utility Setup Checklist for Moving",
    description: "Print a step-by-step checklist for electricity, water, internet, trash, transfers, service dates, account records, and outage contacts.",
    audience: "Every move",
    intro: "Plan the handoff without guessing. Ask each confirmed provider for its current lead time, schedule service for the date you become responsible, and keep sensitive account details off this sheet.",
    reviewed,
    sections: [
      { title: "1–2 weeks before moving", items: ["Confirm the exact service address and responsibility date", "Identify possible electric, water, sewer, internet, and trash providers", "Ask each provider about current lead time, deposits, documents, and appointments", "Check internet availability for the complete address and unit", "Decide whether a short old/new internet overlap is actually necessary"] },
      { title: "A few days before moving", items: ["Reconfirm electricity and water start dates", "Reconfirm internet delivery or technician access", "Ask whether trash starts automatically or needs an account", "Review the lease, closing statement, HOA, or property instructions", "Store confirmations privately—not on this printable"] },
      { title: "Move-in day", items: ["Confirm electricity and water are active", "Check for leaks, unsafe equipment, or missing service", "Record visible meter readings when appropriate", "Make sure an internet technician can access approved areas", "Locate official outage and utility-emergency contacts"] },
      { title: "Immediately after", items: ["Close or transfer old accounts on the authorized date", "Return rented internet equipment as instructed", "Check the new service address and dates on first statements", "Confirm trash and recycling days", "Save provider support, outage, and emergency numbers"] },
    ],
    related: [
      { label: "When to transfer utilities", href: "/resources/when-to-transfer-utilities" },
      { label: "Complete utility setup hub", href: "/resources/utility-setup" },
      { label: "Find possible providers by ZIP", href: "/#zip-lookup" },
    ],
  },
  {
    slug: "renter-move-in-checklist",
    title: "Renter Move-In Checklist",
    description: "Print a renter checklist for lease responsibilities, utilities, internet access, deposits, condition photos, keys, parking, and move-in records.",
    audience: "Renters",
    intro: "Use the lease and written property instructions to decide what applies. This checklist organizes the questions; it does not replace your lease or state law.",
    reviewed,
    sections: [
      { title: "Before paying", items: ["Request an itemized move-in amount", "Separate rent, deposits, and nonrefundable fees", "Confirm pet, parking, key, elevator, and building charges", "Confirm renters-insurance requirements and proof method", "Keep every receipt and written term privately"] },
      { title: "Utilities and internet", items: ["List utilities included in rent", "List accounts the tenant must open", "Ask about shared meters or allocated billing", "Check internet for the exact unit", "Get approval before drilling, exterior cable, or wiring changes"] },
      { title: "Document the condition", items: ["Complete the required move-in condition form", "Take dated wide and close photos of existing damage", "Record appliance, fixture, wall, floor, window, and door condition", "Submit the record through the authorized method", "Keep proof that management received it"] },
      { title: "Access and first week", items: ["Count keys, fobs, parking passes, and mailbox access", "Save routine and emergency maintenance contacts", "Confirm trash location and collection rules", "Test smoke and carbon-monoxide alarms as permitted", "Store the lease, condition record, and account confirmations"] },
    ],
    related: [
      { label: "Plan renter move-in costs", href: "/renters/renter-move-in-costs" },
      { label: "Insurance, deposits, and records", href: "/renters/renters-insurance-and-deposits" },
      { label: "Set up utilities as a renter", href: "/renters/set-up-utilities" },
    ],
  },
  {
    slug: "outage-emergency-numbers",
    title: "Outage and Emergency Numbers Sheet",
    description: "Print a household reference sheet for electric outages, water emergencies, property maintenance, local alerts, and trusted emergency contacts.",
    audience: "Every household",
    intro: "Fill this in from official provider, property, and local-government sources. Call 911 for immediate police, fire, or medical danger; never approach a downed line.",
    reviewed,
    sections: [
      { title: "Utility emergencies", kind: "fields", items: ["Electric provider", "Electric outage number", "Official outage map", "Water or sewer emergency", "Internet support"] },
      { title: "Property help", kind: "fields", items: ["Landlord or property manager", "After-hours maintenance", "HOA or community contact", "Building access contact", "Insurance claims contact"] },
      { title: "Local information", kind: "fields", items: ["County emergency management", "Local non-emergency line", "Emergency alert signup", "Nearest shelter information", "Trash or debris updates"] },
      { title: "Household contacts", kind: "fields", items: ["Primary household contact", "Out-of-area contact", "Trusted nearby contact", "Medical equipment plan", "Pet or accessibility support"] },
    ],
    related: [
      { label: "Save outage information", href: "/homeowners/save-outage-information" },
      { label: "Find verified provider contacts", href: "/#zip-lookup" },
      { label: "Ready.gov power outage guidance", href: "https://www.ready.gov/power-outages" },
    ],
  },
  {
    slug: "new-home-contacts",
    title: "New-Home Contacts Sheet",
    description: "Print one organized sheet for utility, property, repair, insurance, local-government, and household contacts after moving into a home.",
    audience: "New homeowners",
    intro: "Keep useful public and household contact details in one place. Do not write account numbers, passwords, Social Security numbers, or payment information on this sheet.",
    reviewed,
    sections: [
      { title: "Essential services", kind: "fields", items: ["Electric provider", "Water and sewer provider", "Internet provider", "Trash and recycling", "City or county utility help"] },
      { title: "Property and protection", kind: "fields", items: ["Home insurance", "Warranty or builder contact", "HOA or community association", "Alarm or monitoring service", "Property records location"] },
      { title: "Home systems", kind: "fields", items: ["HVAC service", "Plumbing service", "Electrical service", "Appliance service", "Pest or termite records"] },
      { title: "Local and household", kind: "fields", items: ["County emergency management", "Local non-emergency line", "Trusted neighbor", "Out-of-area contact", "Veterinarian or pet contact"] },
    ],
    related: [
      { label: "New-home first week checklist", href: "/resources/printables/new-home-checklist" },
      { label: "Home records and maintenance", href: "/homeowners/home-records-and-maintenance" },
      { label: "Find possible providers by ZIP", href: "/#zip-lookup" },
    ],
  },
  {
    slug: "address-update-checklist",
    title: "Address Update Checklist After Moving",
    description: "Print a thorough change-of-address checklist for government records, finances, insurance, work, health care, schools, subscriptions, and household services.",
    audience: "Every move",
    intro: "Update only organizations that actually hold your information, begin with official websites, and never send identity documents through an unverified link.",
    reviewed,
    sections: [
      { title: "Government and identity", items: ["USPS mail forwarding", "Driver license or state identification", "Vehicle registration and title records", "Voter registration", "Tax or benefit agencies that hold your address"] },
      { title: "Money and insurance", items: ["Banks and credit unions", "Credit cards and lenders", "Home, renters, auto, and other insurers", "Employer payroll and retirement accounts", "Professional or business registrations"] },
      { title: "Health, work, and education", items: ["Employer and benefits administrator", "Health providers and pharmacy", "Health insurance account", "Schools, childcare, or student records", "Licensing or membership organizations"] },
      { title: "Home and everyday services", items: ["Electric, water, internet, and trash accounts", "Mobile phone and delivery profiles", "Subscriptions and recurring shipments", "Friends, family, and emergency contacts", "Pet registration, veterinarian, and microchip record"] },
    ],
    related: [
      { label: "Official address-change guide", href: "/resources/change-your-address" },
      { label: "Utility setup checklist", href: "/resources/printables/utility-setup-checklist" },
      { label: "Official USPS change of address", href: "https://moversguide.usps.com/" },
    ],
  },
  {
    slug: "new-home-checklist",
    title: "New-Home First Week Checklist",
    description: "Print a focused first-week checklist for utilities, safety, house controls, records, deliveries, trash, and essential homeowner contacts.",
    audience: "Homeowners",
    intro: "Prioritize active services, safety, and accurate records before cosmetic projects. Use qualified help for anything unsafe or beyond normal homeowner access.",
    reviewed,
    sections: [
      { title: "Services and access", items: ["Confirm active utility accounts and service address", "Test internet in important work areas", "Confirm trash and recycling days", "Count keys, remotes, and access devices", "Save official outage and emergency contacts"] },
      { title: "Know the house", items: ["Locate the homeowner-accessible water shutoff", "Identify and label the electrical panel", "Review HVAC filter size and thermostat operation", "Find fire extinguishers and safe exits", "Do not open sealed utility equipment"] },
      { title: "Safety checks", items: ["Test smoke and carbon-monoxide alarms", "Review inspection priorities", "Check visible leaks or unsafe conditions", "Plan for medicines or equipment needing power", "Review local emergency alerts and evacuation information"] },
      { title: "Records and follow-up", items: ["Store closing, inspection, warranty, and service records", "Make a list of urgent and later repairs", "Update the mailing address where needed", "Record trusted service and insurance contacts", "Schedule only qualified help for specialized work"] },
    ],
    related: [
      { label: "New-home contacts sheet", href: "/resources/printables/new-home-contacts" },
      { label: "First-week home safety guide", href: "/homeowners/first-week-home-safety" },
      { label: "Homeowner resource hub", href: "/homeowners" },
    ],
  },
];

export const printableBySlug = new Map(printables.map((item) => [item.slug, item]));
