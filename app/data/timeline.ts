export type TimelinePriority = "Start here" | "Important" | "When ready";

export type TimelineTask = {
  id: string;
  title: string;
  explanation: string;
  priority: TimelinePriority;
  category: "Safety" | "Utilities" | "Documents" | "Maintenance" | "Money" | "Community" | "Moving";
  estimatedMinutes: number;
  relatedGuide?: { label: string; href: string };
  externalResource?: { label: string; href: string };
  affiliateDisclosure?: string;
  details?: string;
};

export type TimelineStage = {
  slug: string;
  label: string;
  shortLabel: string;
  intro: string;
  tasks: TimelineTask[];
};

const task = (
  id: string,
  title: string,
  category: TimelineTask["category"],
  priority: TimelinePriority = "Important",
  estimatedMinutes = 10,
  details?: string,
): TimelineTask => ({
  id,
  title,
  category,
  priority,
  estimatedMinutes,
  explanation: details ?? `Take a few minutes to ${title.toLowerCase()} and save any useful notes or records.`,
  details,
});

export const timelineStages: TimelineStage[] = [
  {
    slug: "before-move-in",
    label: "Before Move-In",
    shortLabel: "Before",
    intro: "Handle the details that make arrival day calmer.",
    tasks: [
      task("before-confirm-utilities", "Confirm utility start dates", "Utilities", "Start here", 15),
      task("before-insurance", "Confirm insurance begins before occupancy", "Money", "Start here", 20, "Verify effective dates and key coverage details with a licensed insurance professional."),
      task("before-documents", "Create a home documents folder", "Documents", "Important", 20),
      task("before-first-night", "Pack a first-night essentials box", "Moving", "Important", 25),
      task("before-access", "Confirm keys, codes, parking, and building access", "Moving", "Start here", 10),
      task("before-address", "Schedule mail forwarding", "Documents", "Important", 10),
    ],
  },
  {
    slug: "move-in-day",
    label: "Move-In Day",
    shortLabel: "Move day",
    intro: "Protect the space, direct the move, and keep essentials close.",
    tasks: [
      task("day-walkthrough", "Complete a move-in walkthrough", "Moving", "Start here", 30),
      task("day-photos", "Photograph rooms before unpacking", "Documents", "Start here", 20),
      task("day-meter", "Record utility meter readings", "Utilities", "Important", 10),
      task("day-damage", "Protect floors, walls, and doorways", "Moving", "Important", 15),
      task("day-essentials", "Set up one bathroom and sleeping area", "Moving", "Important", 30),
      task("day-safety", "Keep exits and safety equipment accessible", "Safety", "Start here", 10),
    ],
  },
  {
    slug: "first-24-hours",
    label: "First 24 Hours",
    shortLabel: "24 hours",
    intro: "Learn the home’s safety essentials and document what you received.",
    tasks: [
      task("24-water", "Locate the main water shutoff", "Safety", "Start here", 10, "Make sure every adult in the home knows where it is and how to close it. If access is unclear, ask the property manager or a qualified professional."),
      task("24-panel", "Locate the electrical panel", "Safety", "Start here", 10, "Identify the main disconnect without removing covers or touching exposed components. Use a licensed electrician for electrical concerns."),
      task("24-alarms", "Test smoke and carbon monoxide alarms", "Safety", "Start here", 15),
      task("24-doors", "Check exterior doors and windows", "Safety", "Important", 15),
      task("24-condition", "Photograph the condition of the home", "Documents", "Important", 30),
      task("24-services", "Confirm electricity, water, internet, and gas service", "Utilities", "Start here", 20),
      task("24-emergency", "Save emergency contact information", "Safety", "Important", 15),
      task("24-hvac", "Inspect the HVAC filter", "Maintenance", "Important", 10),
      task("24-extinguishers", "Identify fire extinguishers", "Safety", "Important", 10),
      task("24-locks", "Change or rekey exterior locks when appropriate", "Safety", "Important", 45),
    ],
  },
  {
    slug: "first-week",
    label: "First Week",
    shortLabel: "Week 1",
    intro: "Get organized, understand local routines, and catch early issues.",
    tasks: [
      task("week-address", "Update your mailing address", "Documents", "Start here", 20),
      task("week-trash", "Confirm trash and recycling days", "Community", "Important", 10),
      task("week-rules", "Review HOA or community rules", "Documents", "Important", 30),
      task("week-neighbors", "Introduce yourself to nearby neighbors", "Community", "When ready", 15),
      task("week-insurance", "Review insurance coverage", "Money", "Important", 30, "Coverage varies. Ask a licensed insurance professional about limits, exclusions, deductibles, and flood or wind coverage."),
      task("week-store-docs", "Store closing, lease, warranty, and inspection documents", "Documents", "Important", 30),
      task("week-leaks", "Check for leaks under sinks and near appliances", "Maintenance", "Start here", 20),
      task("week-models", "Confirm appliance model and serial numbers", "Documents", "When ready", 25),
      task("week-inventory", "Create a basic home inventory", "Documents", "Important", 45),
      task("week-emergency", "Review local emergency procedures", "Safety", "Important", 20),
    ],
  },
  {
    slug: "first-month",
    label: "First Month",
    shortLabel: "Month 1",
    intro: "Turn one-time setup into routines that protect your home and budget.",
    tasks: [
      task("month-calendar", "Build a maintenance calendar", "Maintenance", "Start here", 35),
      task("month-filters", "Replace filters if needed", "Maintenance", "Important", 20),
      task("month-seals", "Inspect caulking and weather seals", "Maintenance", "Important", 30),
      task("month-utilities", "Review utility usage", "Money", "Important", 20),
      task("month-garage", "Test garage door safety reversal", "Safety", "Important", 15),
      task("month-irrigation", "Check irrigation settings", "Maintenance", "When ready", 20),
      task("month-pests", "Review pest-control needs", "Maintenance", "When ready", 20),
      task("month-kit", "Create a hurricane or emergency kit", "Safety", "Important", 60),
      task("month-homestead", "Research homestead exemption eligibility", "Money", "Important", 30, "Eligibility and deadlines vary. Confirm requirements with the appropriate county property appraiser or a qualified advisor."),
      task("month-followup", "Schedule any inspection follow-up work", "Maintenance", "Important", 30),
    ],
  },
  {
    slug: "first-3-months",
    label: "First 3 Months",
    shortLabel: "3 months",
    intro: "Review spending, improve your records, and notice how the home behaves.",
    tasks: [
      task("3-expenses", "Review recurring home expenses", "Money", "Important", 30),
      task("3-batteries", "Check smoke-alarm batteries", "Safety", "Important", 15),
      task("3-vents", "Clean dryer vents and appliance filters", "Maintenance", "Important", 40),
      task("3-drainage", "Inspect drainage around the property", "Maintenance", "Important", 25),
      task("3-deductibles", "Review insurance deductibles", "Money", "Important", 25),
      task("3-warranties", "Organize warranties and receipts", "Documents", "When ready", 35),
      task("3-contacts", "Update emergency contacts", "Safety", "When ready", 15),
      task("3-seasonal", "Review seasonal maintenance needs", "Maintenance", "Important", 30),
    ],
  },
  {
    slug: "first-6-months",
    label: "First 6 Months",
    shortLabel: "6 months",
    intro: "Recheck early assumptions and refresh the systems you rely on.",
    tasks: [
      task("6-moisture", "Reinspect for leaks or moisture", "Maintenance", "Important", 30),
      task("6-hvac", "Service HVAC if appropriate", "Maintenance", "Important", 45),
      task("6-providers", "Review utility providers and plans", "Money", "When ready", 30),
      task("6-supplies", "Refresh emergency supplies", "Safety", "Important", 25),
      task("6-seals", "Inspect exterior seals and weatherproofing", "Maintenance", "Important", 35),
      task("6-inventory", "Review home inventory", "Documents", "When ready", 25),
      task("6-appliances", "Check major appliance maintenance needs", "Maintenance", "Important", 30),
    ],
  },
  {
    slug: "first-year",
    label: "First Year",
    shortLabel: "Year 1",
    intro: "Close the loop on year one and plan a more confident year two.",
    tasks: [
      task("year-inspection", "Complete an annual home inspection checklist", "Maintenance", "Start here", 90),
      task("year-insurance", "Review insurance renewal", "Money", "Important", 45),
      task("year-tax", "Review property-tax and exemption information", "Money", "Important", 30),
      task("year-systems", "Service major systems", "Maintenance", "Important", 60),
      task("year-safety", "Replace aging safety equipment", "Safety", "Important", 30),
      task("year-inventory", "Update home inventory", "Documents", "Important", 40),
      task("year-spending", "Review annual maintenance spending", "Money", "When ready", 30),
      task("year-projects", "Plan the next year’s home projects", "Maintenance", "When ready", 45),
    ],
  },
];

export const allTimelineTasks = timelineStages.flatMap((stage) => stage.tasks);

export function getStage(slug: string) {
  return timelineStages.find((stage) => stage.slug === slug);
}
