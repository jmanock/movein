export const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "Homeowners", href: "/homeowners" },
  { label: "Renters", href: "/renters" },
  { label: "Learn Your Area", href: "/learn-your-area" },
  { label: "Resources", href: "/resources" },
  { label: "FAQ", href: "/faq" },
] as const;

export const serviceTypes = [
  { slug: "electricity", name: "Electricity", icon: "Zap", description: "Possible electric utility and outage contact." },
  { slug: "water", name: "Water", icon: "Droplets", description: "Municipal or regional water starting point." },
  { slug: "internet", name: "Internet", icon: "Wifi", description: "Address-level availability lookup." },
  { slug: "natural-gas", name: "Gas", icon: "Flame", description: "Natural gas information when verified." },
  { slug: "trash-recycling", name: "Trash & recycling", icon: "Recycle", description: "Local collection agency or department." },
  { slug: "local-government", name: "Local information", icon: "Landmark", description: "Official city and county starting points." },
] as const;

export const categoryLabels: Record<string, string> = {
  electricity: "Electricity", water: "Water", sewer: "Sewer", "natural-gas": "Natural gas",
  internet: "Internet availability", "trash-recycling": "Trash & recycling", "local-government": "Local information",
};

export const pilotCounties = ["Seminole", "Orange", "Volusia", "Lake", "Osceola"] as const;
export const indexablePilotZips = ["32771", "32746", "32801", "32789", "32703", "32720", "32114", "34748", "34711", "32757", "34741", "34769"] as const;
export const supportedPilotZips = ["32771", "32746", "32801", "32789", "32703", "32720", "32114", "34748", "34711", "32757", "34741", "34769"] as const;

export const faqItems = [
  ["How do I find my electric company?", "Enter your ZIP code for possible providers, then confirm your street address on the utility’s official website or by phone. Electric territories can split a ZIP code."],
  ["Why can more than one provider appear?", "ZIP codes are mail-delivery areas, not utility boundaries. One ZIP may cross municipal, cooperative, and investor-owned service territories."],
  ["Why does MoveIn ask for only a ZIP code?", "A ZIP code gives a useful starting point without asking you to share an exact street address. Official provider tools handle the final address check."],
  ["Why do I still need to verify my street address?", "Utility territories follow infrastructure, city limits, service districts, and property connections that rarely align with a whole ZIP code."],
  ["How do I find my water and sewer provider?", "Review the possible water and sewer authorities shown, then confirm the parcel. A different utility, private well, or septic system may apply."],
  ["How do I find trash and recycling service?", "Use the city or county collection link in the result. Responsibility may depend on city limits, property type, an HOA, landlord, or private hauler."],
  ["Can internet availability vary within one ZIP?", "Yes. Providers, technologies, and speeds can differ by building or unit. Use the official FCC address search and each provider’s availability tool."],
  ["Is MoveIn a utility provider?", "No. MoveIn is an independent information tool and does not sell, activate, or bill for utility service."],
  ["Is MoveIn a government website?", "No. MoveIn links to official government and provider sources but is not a government agency and is not endorsed by one."],
  ["Does MoveIn sell my information?", "No. MoveIn does not ask for an email or street address for this lookup and does not sell ZIP searches."],
  ["How often is the data updated?", "Records show when they were last checked. Automated reports flag records older than 180 days, but official details can change sooner, so confirm before opening service."],
  ["How can I report incorrect information?", "Use the Corrections page and include the ZIP code, record, and an official source when possible."],
  ["Why are only certain Florida counties available?", "The first pilot is deliberately limited to selected ZIP codes in Seminole, Orange, Volusia, Lake, and Osceola counties so each record can be researched carefully."],
  ["When will more states be added?", "After the Central Florida pilot remains accurate and useful in production. MoveIn will expand only as authoritative records can be verified."],
] as const;
