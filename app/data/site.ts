export const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "Homeowners", href: "/homeowners" },
  { label: "Renters", href: "/renters" },
  { label: "Learn Your Area", href: "/learn-your-area" },
  { label: "Resources", href: "/resources" },
  { label: "Coverage", href: "/coverage" },
] as const;

export const serviceTypes = [
  { slug: "electricity", name: "Electricity", icon: "Zap", description: "Possible electric utility and outage contact." },
  { slug: "water", name: "Water", icon: "Droplets", description: "Municipal or regional water starting point." },
  { slug: "internet", name: "Internet", icon: "Wifi", description: "Address-level availability lookup." },
  { slug: "trash-recycling", name: "Trash & recycling", icon: "Recycle", description: "Local collection agency or department." },
  { slug: "local-government", name: "Local information", icon: "Landmark", description: "Official city and county starting points." },
] as const;

export const categoryLabels: Record<string, string> = {
  electricity: "Electricity", water: "Water", sewer: "Sewer",
  internet: "Internet availability", "trash-recycling": "Trash & recycling", "local-government": "Local information",
};

export const pilotCounties = ["Seminole", "Orange", "Volusia", "Lake", "Osceola"] as const;
export const indexablePilotZips = ["32114", "32117", "32118", "32119", "32703", "32720", "32724", "32726", "32746", "32757", "32771", "32773", "32789", "32801", "32803", "32804", "32806", "32809", "34711", "34715", "34741", "34743", "34744", "34746", "34748", "34769", "34771", "34772", "34788"] as const;
export const supportedPilotZips = ["32114", "32117", "32118", "32119", "32127", "32129", "32168", "32174", "32701", "32703", "32707", "32708", "32714", "32720", "32724", "32726", "32746", "32750", "32757", "32765", "32766", "32771", "32773", "32778", "32789", "32801", "32803", "32804", "32806", "32809", "34711", "34715", "34731", "34736", "34739", "34741", "34743", "34744", "34746", "34747", "34748", "34753", "34758", "34761", "34769", "34771", "34772", "34786", "34787", "34788"] as const;

export const faqItems = [
  ["How do I find my electric company?", "Enter your ZIP code for possible providers, then confirm your street address on the utility’s official website or by phone. Electric territories can split a ZIP code."],
  ["How do I find my water provider?", "Review the possible water and sewer authorities shown, then confirm the parcel. A different utility, private well, or septic system may apply."],
  ["How do I find internet providers at my address?", "Use the FCC National Broadband Map with the complete address, then confirm the exact unit with each provider. Availability and technology can differ between neighboring buildings."],
  ["Who handles trash and recycling?", "Use the city or county collection link in the result. Responsibility may depend on city limits, property type, an HOA, landlord, apartment manager, or private hauler."],
  ["Why can more than one provider serve one ZIP code?", "ZIP codes are mail-delivery areas, not utility boundaries. One ZIP may cross municipal, cooperative, investor-owned, district, and private service territories."],
  ["Why do I still need to confirm my street address?", "Utility territories follow infrastructure, city limits, service districts, and property connections that rarely align with a whole ZIP code."],
  ["When should I transfer utilities?", "Contact each confirmed provider before move-in, ask about lead time, and schedule service for the date you become responsible for the property. Do not request a shutoff for another person’s account."],
  ["What documents might I need to start utilities?", "Requirements vary. A provider may request the service address, start date, identification, lease or closing evidence, prior-account details, and a payment method. MoveIn does not collect these materials."],
  ["Is MoveIn a utility company?", "No. MoveIn is an independent information tool and does not sell, activate, or bill for utility service."],
  ["Is MoveIn affiliated with the government?", "No. MoveIn links to official government and provider sources but is not a government agency and is not endorsed by one."],
  ["Does MoveIn sell my information?", "No. MoveIn does not ask for an email or street address for this lookup and does not sell ZIP searches."],
  ["Where does MoveIn get its data?", "MoveIn prefers official utility, city, county, state, and federal sources. Each provider record stores a source and verification date."],
  ["How often is information reviewed?", "Records show when they were last checked. Automated reports flag records older than 180 days, but official details can change sooner, so confirm before opening service."],
  ["How do I report incorrect information?", "Use the Corrections page and include the ZIP code, record, and a supporting official URL when possible. Reports are reviewed before public data changes."],
  ["Why is coverage limited to selected Florida counties?", "The pilot is deliberately limited to selected ZIP codes in Seminole, Orange, Volusia, Lake, and Osceola counties so each record can be researched carefully."],
  ["When will more states be added?", "After the Central Florida pilot remains accurate and useful in production. MoveIn will expand only as authoritative records can be verified."],
] as const;
