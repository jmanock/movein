export const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "My Move Timeline", href: "/timeline" },
  { label: "Homeowners", href: "/homeowners" },
  { label: "Renters", href: "/renters" },
  { label: "Florida Guide", href: "/florida" },
  { label: "Checklists", href: "/checklists" },
  { label: "Resources", href: "/resources" },
] as const;

export const entryCards = [
  { icon: "House", eyebrow: "New owner", title: "I Just Bought a Home", description: "A practical checklist for your first days, weeks, and months as a homeowner.", cta: "Start the homeowner path", href: "/homeowners", tone: "coral" },
  { icon: "Building2", eyebrow: "New renter", title: "I’m Renting a New Place", description: "Set up your space, protect your deposit, organize utilities, and settle in faster.", cta: "Start the renter path", href: "/renters", tone: "blue" },
  { icon: "Palmtree", eyebrow: "Regional guide", title: "I’m Moving to Florida", description: "Florida-specific guidance for utilities, hurricanes, vehicles, homestead exemption, wildlife, and more.", cta: "Explore Florida", href: "/florida", tone: "green" },
  { icon: "KeyRound", eyebrow: "First home", title: "I’m a First-Time Homeowner", description: "Understand maintenance, safety, insurance, documents, and responsibilities without feeling overwhelmed.", cta: "See what comes next", href: "/timeline/first-24-hours", tone: "gold" },
] as const;

export const floridaGuides = [
  { slug: "getting-started", icon: "Map", title: "Getting started", description: "The first Florida-specific steps after your move." },
  { slug: "homeowners", icon: "House", title: "Florida homeowners", description: "Climate, maintenance, records, and local routines." },
  { slug: "renters", icon: "Building2", title: "Florida renters", description: "Move-in records, utilities, insurance, and deposits." },
  { slug: "hurricane-prep", icon: "CloudRainWind", title: "Hurricane preparation", description: "A calm plan for supplies, documents, pets, and evacuation." },
  { slug: "homestead-exemption", icon: "Landmark", title: "Homestead exemption", description: "A plain-language overview and where to verify details." },
  { slug: "utilities", icon: "PlugZap", title: "Utility setup", description: "Questions to ask when connecting power, water, gas, and internet." },
  { slug: "local-guides", icon: "MapPinned", title: "Local guides", description: "A scalable home for useful city and county information." },
  { slug: "flood-zones", icon: "Waves", title: "Flood zones", description: "Understand local risk and the questions worth asking." },
] as const;

export const sectionPages = {
  homeowners: { eyebrow: "For homeowners", title: "Own the home. Learn the home.", description: "A practical starting point for safety, maintenance, documents, utilities, insurance basics, emergency planning, and home inventory.", cards: ["First-time homeowner guide", "Home safety", "Maintenance", "Documents and warranties", "Utilities", "Insurance basics", "Emergency preparation", "Home inventory"] },
  renters: { eyebrow: "For renters", title: "Move in with your records—and your peace of mind—intact.", description: "Organize the details that protect your deposit, clarify your lease, and make a new rental feel like home.", cards: ["Move-in inspection", "Security deposit protection", "Utilities", "Renter insurance basics", "Apartment safety", "Roommate organization", "Pet and parking paperwork", "Moving-out preparation"] },
  checklists: { eyebrow: "Print, save, return", title: "Checklists for the moments that matter.", description: "Focused lists for move-in day, the first month, home safety, maintenance, and Florida storm preparation.", cards: ["Move-in checklist", "New homeowner checklist", "Renter move-in checklist", "First-week checklist", "First-month checklist", "Hurricane checklist", "Home safety checklist", "Home maintenance checklist"] },
  resources: { eyebrow: "Resource library", title: "Keep the useful stuff handy.", description: "Straightforward planners, explainers, and tools made for real homes and real move days.", cards: ["Moving budget planner", "Home maintenance calendar", "Emergency contact sheet", "First-month budget", "Home inventory worksheet", "Utilities setup list", "Document organizer", "Trusted external resources"] },
  blog: { eyebrow: "MoveIn journal", title: "Practical reading for the next chapter.", description: "Clear guidance on home safety, moving, renting, maintenance, and regional life—without the filler.", cards: ["What to do after buying a house", "Your first week in a new home", "How to document a rental move-in", "A maintenance calendar that works", "Preparing for Florida storm season", "Understanding your home records"] },
  about: { eyebrow: "About MoveIn", title: "A guide for everything after the keys.", description: "MoveIn helps homeowners and renters turn an overwhelming transition into a clear sequence of next steps.", cards: ["Calm over clutter", "Education over pressure", "Useful before monetized", "National platform, regional depth"] },
  contact: { eyebrow: "Contact", title: "Questions, corrections, or a useful local tip?", description: "MoveIn is designed to improve with thoughtful feedback. Reach us at hello@movein.guide.", cards: ["Editorial feedback", "Accessibility help", "Local guide suggestions", "Partnership inquiries"] },
} as const;

export const legalPages = {
  privacy: { title: "Privacy", intro: "This policy explains the limited information MoveIn collects and how it is used.", paragraphs: ["MoveIn stores newsletter information you choose to provide, including your email address and optional move details. We use it to send relevant reminders and improve the service.", "Timeline completion is stored only in your browser for this version. MoveIn does not receive those completed-task details.", "We do not send email addresses, move dates, or other personally identifying form values to analytics platforms. Contact hello@movein.guide with privacy questions."] },
  terms: { title: "Terms", intro: "MoveIn provides practical educational guidance, not professional advice.", paragraphs: ["Information may not reflect the rules, deadlines, conditions, or risks that apply to your specific home, lease, county, insurer, or situation.", "Use qualified legal, financial, insurance, safety, construction, electrical, structural, or real estate professionals when a decision requires professional judgment.", "By using MoveIn, you agree to verify critical information with the appropriate professional or official source."] },
  disclosure: { title: "Disclosure", intro: "Editorial trust comes first.", paragraphs: ["MoveIn may eventually earn commissions from qualifying links without increasing the visitor’s price. Any affiliate, sponsored, or local partner placement will be clearly labeled and visually separated from editorial guidance.", "We do not currently list invented partnerships or fake recommendations. Sponsored relationships will never change whether a safety or timeline task appears.", "External links can change. Review a provider’s own terms, privacy policy, licensing, and suitability before purchasing a product or service."] },
} as const;
