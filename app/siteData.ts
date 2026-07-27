export const startPaths = [
  { icon: "House", eyebrow: "New owner", title: "I bought a home", text: "Your first-day, first-week, and first-month essentials.", href: "#homeowners", color: "coral" },
  { icon: "Building2", eyebrow: "New renter", title: "I rented a place", text: "Move in confidently, protect your deposit, and get connected.", href: "#renters", color: "blue" },
  { icon: "PackageOpen", eyebrow: "In transit", title: "I’m moving soon", text: "A practical timeline for the boxes, budget, and big day.", href: "#resources", color: "gold" },
  { icon: "Palmtree", eyebrow: "Florida 101", title: "I’m new to Florida", text: "The local know-how nobody puts in the welcome packet.", href: "#florida", color: "green" },
] as const;

export const journey = [
  { step: "Day 1", title: "Secure your home", text: "Change locks, find shutoffs, test detectors, and document the condition.", icon: "KeyRound" },
  { step: "Day 3", title: "Get connected", text: "Turn on utilities, internet, mail forwarding, and essential local services.", icon: "Wifi" },
  { step: "Week 1", title: "Learn your neighborhood", text: "Meet a neighbor, find collection days, and save important contacts.", icon: "MapPin" },
  { step: "Week 2", title: "Build your home rhythm", text: "Create a maintenance calendar and understand your lease or HOA rules.", icon: "CalendarDays" },
  { step: "Week 3", title: "Prepare for Florida weather", text: "Make a hurricane plan, check flood information, and stock essentials.", icon: "CloudSun" },
  { step: "Week 4", title: "Optimize and settle in", text: "Review insurance, organize finances, and make the space truly yours.", icon: "Sparkles" },
] as const;

export const ownerChecklist = [
  { title: "First 24 hours", description: "Make the home safe and learn its essentials.", items: ["Change or rekey exterior locks", "Locate the water and gas shutoffs", "Find and photograph the electrical panel", "Test smoke and carbon monoxide detectors", "Test GFCI outlets in wet areas", "Locate the HVAC filter and note its size", "Photograph every room and existing damage", "Collect appliance manuals and warranties"] },
  { title: "First week", description: "Connect services and handle Florida paperwork.", items: ["Set up internet and utilities", "Update your mailing address", "Start your Florida driver license update", "Register to vote", "Review Homestead Exemption eligibility", "Find trash, recycling, and yard-waste days", "Confirm home insurance coverage", "Meet a neighbor and exchange contact details", "Check the irrigation timer and HVAC filter"] },
  { title: "First month", description: "Create habits that protect your investment.", items: ["Create a seasonal maintenance calendar", "Inspect the attic for heat, moisture, and pests", "Trim limbs away from the roof", "Label every breaker", "Check fire extinguisher dates", "Photograph and inventory valuables", "Read your HOA documents", "Download trusted hurricane alerts", "Build a seven-day emergency kit"] },
] as const;

export const floridaGuides = [
  { icon: "CloudRainWind", title: "Hurricanes", text: "Know your zone, your plan, and when to act." },
  { icon: "Waves", title: "Flood zones", text: "Understand risk beyond the mortgage paperwork." },
  { icon: "Sun", title: "Heat safety", text: "Work, walk, and play safely in Florida heat." },
  { icon: "ShieldCheck", title: "Homestead", text: "A plain-English guide to the exemption." },
  { icon: "Car", title: "SunPass & tolls", text: "Navigate toll roads without surprise fees." },
  { icon: "Droplets", title: "Water rules", text: "Learn local watering days and restrictions." },
  { icon: "Bug", title: "Wildlife & pests", text: "Coexist smartly with Florida’s wild side." },
  { icon: "Umbrella", title: "Beaches", text: "Parking, flags, wildlife, and local etiquette." },
] as const;

export const renterItems = [
  { icon: "ClipboardCheck", title: "Move-in inspection", text: "Photograph every surface and submit your notes in writing." },
  { icon: "Shield", title: "Renter’s insurance", text: "Understand liability, belongings, storm, and displacement coverage." },
  { icon: "ReceiptText", title: "Security deposit", text: "Save receipts, timelines, notices, and proof of the home’s condition." },
  { icon: "FileText", title: "Lease essentials", text: "Spot rules for notice, guests, repairs, pets, parking, and renewals." },
  { icon: "Wifi", title: "Utilities & internet", text: "Compare providers, equipment costs, deposits, and start dates." },
  { icon: "PawPrint", title: "Pets & parking", text: "Get registrations, permits, and required paperwork squared away." },
] as const;

export const resources = [
  { category: "Checklist", title: "Florida move-in checklist", detail: "A room-by-room plan for a calmer move.", time: "12 min" },
  { category: "Planner", title: "Home maintenance calendar", detail: "Florida-specific seasonal reminders.", time: "10 min" },
  { category: "Emergency", title: "Hurricane readiness list", detail: "Supplies, contacts, insurance, and evacuation.", time: "15 min" },
  { category: "Worksheet", title: "First-month budget", detail: "Plan for deposits, repairs, fees, and essentials.", time: "8 min" },
] as const;

export const articles = [
  { category: "New homeowners", title: "25 things every new Florida homeowner should do", read: "9 min read", color: "coral" },
  { category: "Florida basics", title: "Florida Homestead Exemption, explained clearly", read: "6 min read", color: "green" },
  { category: "Storm season", title: "The hurricane kit you’ll actually be glad you made", read: "7 min read", color: "gold" },
] as const;
