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
export const indexablePilotZips = ["32801", "32789", "32757", "34741", "34769"] as const;
export const supportedPilotZips = ["32771", "32746", "32801", "32789", "32703", "32720", "32114", "34748", "34711", "32757", "34741", "34769"] as const;

export const faqItems = [
  ["How do I find my electric company?", "Enter your ZIP code for possible providers, then confirm your street address on the utility’s official website or by phone. Electric territories can split a ZIP code."],
  ["Can more than one utility serve the same ZIP code?", "Yes. ZIP codes are mail-delivery areas, not utility boundaries. One ZIP may include municipal utilities, cooperatives, investor-owned utilities, private systems, wells, or septic systems."],
  ["Why does my provider depend on my exact address?", "Utility territories follow city limits, service maps, infrastructure, and agreements that rarely line up with ZIP boundaries."],
  ["How do I find my water company?", "Start with the possible water records shown for your ZIP. Confirm with the provider, city, county, landlord, seller, or closing documents. Some homes use a private well."],
  ["How do I find internet providers at my address?", "Use the FCC National Broadband Map and enter the complete address. Internet availability can differ between neighboring buildings and even between units."],
  ["When should I transfer utilities?", "Contact each confirmed provider before move-in and ask for the earliest appropriate start date. Do not schedule a shutoff for someone else’s active account."],
  ["What utilities do renters usually need to set up?", "Your lease should say which services are your responsibility. Common examples are electricity, internet, water, gas, or trash, but arrangements vary."],
  ["What utilities do homeowners usually need to set up?", "Common services include electricity, water or well systems, sewer or septic, internet, gas where available, and trash collection."],
  ["How do I find trash and recycling information?", "Check the city or county record shown in results. Collection often depends on city limits, a franchise area, an HOA, or a private hauler."],
  ["Does MoveIn sell my information?", "No. MoveIn does not ask for an email or street address for this lookup and does not sell ZIP searches."],
  ["Is MoveIn a utility company?", "No. MoveIn is an independent information tool. It does not sell, activate, or bill for utility service."],
  ["Is MoveIn affiliated with the government?", "No. MoveIn links to official government and provider sources but is not a government agency and is not endorsed by them."],
  ["Is the information guaranteed to be current?", "No. Records show a verification date, but service areas and contact details can change. Always confirm with the official provider."],
  ["How can I report incorrect information?", "Use the Corrections page and include the ZIP code, record, and an official source when possible."],
  ["Will MoveIn support states outside Florida?", "The database supports multiple states, but the first launch is limited to verified pilot records in five Central Florida counties."],
] as const;
