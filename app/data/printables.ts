export type Printable = { slug: string; title: string; description: string; audience: string; intro: string; sections: Array<{ title: string; items: string[] }> };

export const printables: Printable[] = [
  { slug: "utility-setup-checklist", title: "Utility setup checklist", description: "A printable checklist for confirming and starting essential home services.", audience: "Every move", intro: "Use this as a planning sheet. Confirm every provider for the complete service address before paying or scheduling.", sections: [
    { title: "Before move-in", items: ["Confirm electric provider and start date", "Confirm water and sewer responsibility", "Check internet availability for the exact unit", "Confirm trash and recycling responsibility", "Ask about deposits, identification, and appointment windows"] },
    { title: "Save for later", items: ["Electric outage number and map", "Water emergency contact", "Property maintenance contact", "City or county non-emergency contact", "Account confirmations stored privately"] },
  ] },
  { slug: "new-home-checklist", title: "New-home first week checklist", description: "A focused printable list for homeowners during the first week after closing.", audience: "Homeowners", intro: "Prioritize safety and confirmed service over cosmetic projects.", sections: [
    { title: "Services", items: ["Confirm all active utility accounts", "Test internet at key work areas", "Review trash collection days", "Save official outage and emergency contacts"] },
    { title: "Know the house", items: ["Locate homeowner-accessible water shutoff", "Label the electrical panel", "Test smoke and carbon-monoxide alarms", "Review inspection priorities", "Store closing, warranty, and service records"] },
  ] },
  { slug: "renter-move-in-checklist", title: "Renter move-in checklist", description: "A printable checklist for lease utilities, condition records, and service appointments.", audience: "Renters", intro: "Use the lease and property manager—not assumptions—to decide which accounts you must open.", sections: [
    { title: "Confirm responsibility", items: ["List utilities included in rent", "List accounts the tenant must open", "Ask about shared meters or allocated billing", "Confirm internet installation rules", "Save routine and emergency maintenance contacts"] },
    { title: "Document move-in", items: ["Photograph existing damage", "Complete the required condition form", "Record visible meter readings when appropriate", "Keep account and deposit confirmations privately"] },
  ] },
  { slug: "utility-contact-worksheet", title: "Utility contact worksheet", description: "A clean printable worksheet for official provider and outage contacts.", audience: "Every household", intro: "Write down only information you are comfortable storing on paper. MoveIn never needs your account numbers.", sections: [
    { title: "Provider contacts", items: ["Electric provider / service / outage", "Water and sewer / emergency", "Internet / technical support", "Trash and recycling / collection day", "Natural gas / emergency (if applicable)"] },
    { title: "Property contacts", items: ["Landlord or property manager", "HOA or community association", "City or county utilities", "Insurance contact", "Trusted local emergency contact"] },
  ] },
  { slug: "outage-preparation-sheet", title: "Outage preparation sheet", description: "A printable household reference for official outage contacts and basic preparation.", audience: "Every household", intro: "For immediate danger, call 911. Never approach downed lines or open sealed utility equipment.", sections: [
    { title: "Prepare", items: ["Save the official outage number", "Bookmark the official outage map", "Charge backup batteries", "Plan for medicines or equipment needing power", "Know where flashlights and water are stored"] },
    { title: "During an outage", items: ["Report through the official utility channel", "Keep away from downed lines", "Use generators only outdoors and away from openings", "Follow local emergency guidance", "Document prolonged outages if needed"] },
  ] },
  { slug: "address-update-checklist", title: "Address update checklist", description: "A printable checklist for common government, financial, household, and delivery address updates after a move.", audience: "Every move", intro: "Use official sites and update only organizations that actually hold your information.", sections: [
    { title: "Official and financial", items: ["USPS mail forwarding", "Driver license and vehicle records", "Voter registration", "Banks and cards", "Insurance providers"] },
    { title: "Household", items: ["Employer and benefits", "Health providers and pharmacy", "Schools or childcare", "Subscriptions and deliveries", "Trusted family and contacts"] },
  ] },
];

export const printableBySlug = new Map(printables.map((item) => [item.slug, item]));
