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

export const helpTopics = [
  { icon: "ShieldCheck", title: "Safety", description: "Find shutoffs, test alarms, and build a safer household baseline." },
  { icon: "PlugZap", title: "Utilities", description: "Coordinate service, save outage contacts, and track account details." },
  { icon: "Wrench", title: "Maintenance", description: "Turn observations, manuals, and inspection notes into manageable routines." },
  { icon: "FileText", title: "Documents", description: "Keep leases, closing records, warranties, receipts, and photos findable." },
  { icon: "Umbrella", title: "Insurance basics", description: "Know which questions to take to a licensed insurance professional." },
  { icon: "CloudRainWind", title: "Emergency preparation", description: "Plan alerts, supplies, contacts, pets, medications, and evacuation." },
  { icon: "MapPinned", title: "Local requirements", description: "Use official state, county, utility, and property resources." },
  { icon: "CalendarDays", title: "Seasonal reminders", description: "Revisit filters, drainage, equipment, records, and changing weather." },
] as const;

export const floridaGuides = [
  { href: "/florida/moving-to-florida-checklist", icon: "Map", title: "Moving to Florida checklist", description: "The first state and local steps for new Florida residents." },
  { href: "/florida/new-florida-homeowner-guide", icon: "House", title: "New Florida homeowner guide", description: "Climate, storms, maintenance, records, and local routines." },
  { href: "/renters/renter-move-in-checklist", icon: "Building2", title: "Renter move-in checklist", description: "Condition records, utilities, safety, and deposit protection." },
  { href: "/florida/hurricane-preparation", icon: "CloudRainWind", title: "Hurricane preparation", description: "A calm plan for alerts, supplies, documents, pets, and evacuation." },
  { href: "/florida/homestead-exemption", icon: "Landmark", title: "Homestead exemption", description: "A plain-language overview and the official sources to verify." },
  { href: "/florida/driver-vehicle-setup", icon: "Car", title: "Driver and vehicle setup", description: "Use current FLHSMV resources to plan documents and appointments." },
  { href: "/florida/sunpass-toll-roads", icon: "ReceiptText", title: "SunPass and toll roads", description: "Official account, transponder, vehicle, and toll-map resources." },
  { href: "/florida/flood-zones", icon: "Waves", title: "Flood zones and insurance basics", description: "Understand maps, local context, and coverage questions." },
  { href: "/florida/utilities", icon: "PlugZap", title: "Utility setup", description: "Questions to ask when connecting essential services." },
  { href: "/florida/hoa-basics", icon: "FileText", title: "HOA basics", description: "Organize governing documents, contacts, and responsibilities." },
  { href: "/florida/wildlife-pests", icon: "Bug", title: "Wildlife and pests", description: "Reduce attractants and find the right qualified or official help." },
  { href: "/florida/seasonal-home-maintenance", icon: "Sun", title: "Seasonal home maintenance", description: "A climate-aware routine for heat, humidity, rain, and storms." },
  { href: "/florida/emergency-resources", icon: "Shield", title: "Emergency resources", description: "Build a reliable state, county, utility, and household contact list." },
] as const;

export const sectionPages = {
  homeowners: { eyebrow: "For homeowners", title: "Own the home. Learn the home.", description: "A practical starting point for safety, maintenance, documents, utilities, insurance basics, emergency planning, and home inventory.", cards: [
    { title: "What to do after buying a house", description: "Secure the home, learn its systems, and turn inspection findings into a plan.", href: "/homeowners/what-to-do-after-buying-a-house" },
    { title: "Your first week in a new home", description: "Check early warning signs, organize records, and settle local routines.", href: "/homeowners/first-week-in-new-home" },
    { title: "First-month homeowner checklist", description: "Create repeatable maintenance, budget, and emergency routines.", href: "/homeowners/first-month-checklist" },
    { title: "Home maintenance checklist", description: "Focus on safety, water, air, exterior conditions, and records.", href: "/homeowners/home-maintenance-checklist" },
    { title: "New home safety checklist", description: "Review alarms, exits, shutoffs, access, and emergency information.", href: "/homeowners/home-safety-checklist" },
    { title: "Complete new homeowner checklist", description: "Follow the first day through the first year in a manageable sequence.", href: "/checklists/new-homeowner-checklist" },
  ] },
  renters: { eyebrow: "For renters", title: "Move in with your records—and your peace of mind—intact.", description: "Organize the details that protect your deposit, clarify your lease, and make a new rental feel like home.", cards: [
    { title: "Renter move-in checklist", description: "Document condition, confirm responsibilities, and protect the paper trail.", href: "/renters/renter-move-in-checklist" },
    { title: "Move-in day timeline", description: "Keep essentials, access, meters, and walkthrough records organized.", href: "/timeline/move-in-day" },
    { title: "First 24 hours", description: "Locate safety equipment, check services, and record the home’s condition.", href: "/timeline/first-24-hours" },
    { title: "Complete move-in checklist", description: "Use one list for the practical tasks shared by renters and owners.", href: "/checklists/move-in-checklist" },
  ] },
  checklists: { eyebrow: "Save, return, print", title: "Checklists for the moments that matter.", description: "Focused lists for move-in day, the first month, home safety, maintenance, and Florida storm preparation.", cards: [
    { title: "Move-in checklist", description: "What to do immediately after you receive the keys.", href: "/checklists/move-in-checklist" },
    { title: "New homeowner checklist", description: "A staged first-day-through-first-year plan.", href: "/checklists/new-homeowner-checklist" },
    { title: "Renter move-in checklist", description: "Condition photos, lease records, utilities, safety, and deposit protection.", href: "/renters/renter-move-in-checklist" },
    { title: "First-month checklist", description: "Turn one-time setup into useful home routines.", href: "/homeowners/first-month-checklist" },
    { title: "Florida hurricane preparation", description: "Plan alerts, evacuation, supplies, documents, pets, and medications.", href: "/florida/hurricane-preparation" },
    { title: "Home safety checklist", description: "Review alarms, exits, shutoffs, locks, and household risks.", href: "/homeowners/home-safety-checklist" },
    { title: "Home maintenance checklist", description: "Build a schedule around the home’s real systems and condition.", href: "/homeowners/home-maintenance-checklist" },
  ] },
  resources: { eyebrow: "Resource library", title: "Keep the useful stuff handy.", description: "Straightforward guides and official-source pathways for real homes and real move days.", cards: [
    { title: "My Move Timeline", description: "Save progress locally through eight move-in stages.", href: "/timeline" },
    { title: "Florida official resources", description: "Find emergency, vehicle, toll, tax, and insurance starting points.", href: "/florida" },
    { title: "Home safety planning", description: "Build a clear baseline for your household and property.", href: "/homeowners/home-safety-checklist" },
    { title: "Editorial policy", description: "See how MoveIn researches, reviews, updates, and corrects guidance.", href: "/editorial-policy" },
  ] },
  blog: { eyebrow: "MoveIn journal", title: "Practical reading for the next chapter.", description: "Clear guidance on home safety, moving, renting, maintenance, and regional life—without the filler.", cards: [
    { title: "What to do after buying a house", description: "The useful first steps after closing.", href: "/homeowners/what-to-do-after-buying-a-house" },
    { title: "Your first week in a new home", description: "A calm plan for the first seven days.", href: "/homeowners/first-week-in-new-home" },
    { title: "How to document a rental move-in", description: "Create a record that is clear, complete, and easy to retrieve.", href: "/renters/renter-move-in-checklist" },
    { title: "Preparing for Florida storm season", description: "Build a plan before a storm is in the forecast.", href: "/florida/hurricane-preparation" },
  ] },
  about: { eyebrow: "About MoveIn", title: "A guide for everything after the keys.", description: "MoveIn helps homeowners and renters turn an overwhelming transition into a clear sequence of next steps.", cards: [
    { title: "Calm over clutter", description: "We organize priorities by when they matter, not by how many tasks fit on a page." },
    { title: "Education over pressure", description: "MoveIn offers general guidance and clearly points to official or qualified sources when a decision needs them." },
    { title: "Useful before monetized", description: "Editorial inclusion is separate from future affiliate, sponsor, or partner relationships." },
    { title: "National platform, regional depth", description: "The core experience serves homeowners and renters nationally; Florida is the first in-depth regional guide." },
  ] },
  contact: { eyebrow: "Contact", title: "Questions, corrections, or a useful local tip?", description: "MoveIn is designed to improve with thoughtful feedback. Reach us at hello@movein.guide.", cards: [
    { title: "Editorial feedback", description: "Flag a factual concern, unclear step, or official source we should review." },
    { title: "Accessibility help", description: "Tell us about a barrier and include the page and device if you can." },
    { title: "Local guide suggestions", description: "Share a state or county resource that would make a guide more useful." },
    { title: "Partnership inquiries", description: "Commercial relationships never guarantee editorial inclusion or ranking." },
  ] },
} as const;

export const legalPages = {
  privacy: { title: "Privacy", intro: "This policy explains the limited information MoveIn collects and how it is used.", paragraphs: ["MoveIn stores newsletter information you choose to provide, including your email address and optional move details. We use it to send relevant reminders and improve the service.", "Timeline completion is stored only in your browser for this version. MoveIn does not receive those completed-task details.", "We do not send email addresses, move dates, or other personally identifying form values to analytics platforms. Contact hello@movein.guide with privacy questions."] },
  terms: { title: "Terms", intro: "MoveIn provides practical educational guidance, not professional advice.", paragraphs: ["Information may not reflect the rules, deadlines, conditions, or risks that apply to your specific home, lease, county, insurer, or situation.", "Use qualified legal, financial, insurance, safety, construction, electrical, structural, or real estate professionals when a decision requires professional judgment.", "By using MoveIn, you agree to verify critical information with the appropriate professional or official source."] },
  disclosure: { title: "Disclosure", intro: "Editorial trust comes first.", paragraphs: ["MoveIn may eventually earn commissions from qualifying links without increasing the visitor’s price. Any affiliate, sponsored, or local partner placement will be clearly labeled and visually separated from editorial guidance.", "We do not currently list invented partnerships or fake recommendations. Sponsored relationships will never change whether a safety or timeline task appears.", "External links can change. Review a provider’s own terms, privacy policy, licensing, and suitability before purchasing a product or service."] },
  "editorial-policy": { title: "Editorial Policy", intro: "How MoveIn researches, reviews, updates, and corrects practical guidance.", paragraphs: ["MoveIn selects topics by what homeowners and renters need to do after receiving the keys. Guidance is organized around safety, records, utilities, maintenance, emergency preparation, and local requirements—not around search volume alone.", "For changing government, tax, vehicle, emergency, and insurance information, we prefer primary official sources. We summarize in plain language, link to the source, and avoid copying official text or presenting general guidance as an individual determination.", "Pages show a review date where changing information matters. We review high-impact regional and safety content first, remove stale claims, and avoid unsupported deadlines, fees, rankings, credentials, or endorsements.", "Editorial guidance is independent from affiliate, sponsored, or partner relationships. MoveIn does not accept payment to rank a recommendation. Commercial placements, if introduced, will be labeled and separated from editorial content.", "Corrections are welcome at hello@movein.guide. Include the page URL, the statement in question, and a primary source when available. We review material corrections promptly and update the page when warranted."] },
} as const;
