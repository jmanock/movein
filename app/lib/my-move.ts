export const MY_MOVE_STORAGE_KEY = "movein:my-move:v1";

export type MoveAudience = "homeowner" | "renter";
export type MovePhase = "before_move" | "move_in_week" | "move_in_day" | "first_week" | "first_month" | "later";
export type MoveTaskPhase = "Before the move" | "Move-in day" | "First week" | "First 30 days";

export type MoveProfile = { moveDate: string; zip: string; audience: MoveAudience };
export type MyMoveState = {
  version: 1;
  profile: MoveProfile | null;
  completedTaskIds: string[];
  dismissedTaskIds: string[];
  addedTaskIds: string[];
  internetProviders: string[];
};

export type MoveTask = {
  id: string;
  title: string;
  description?: string;
  phase: MoveTaskPhase;
  category: string;
  audience?: MoveAudience;
  href?: string;
};

export const emptyMyMoveState = (): MyMoveState => ({ version: 1, profile: null, completedTaskIds: [], dismissedTaskIds: [], addedTaskIds: [], internetProviders: [] });

export const moveTasks: MoveTask[] = [
  { id: "local-utilities", title: "Review local utility possibilities and official address checks", phase: "Before the move", category: "utilities", href: "/#zip-lookup" },
  { id: "electricity", title: "Confirm electricity", phase: "Before the move", category: "electricity", href: "/resources/find-electric-company" },
  { id: "water-sewer", title: "Confirm water and sewer", phase: "Before the move", category: "water", href: "/resources/find-water-provider" },
  { id: "internet-compare", title: "Compare possible internet providers", phase: "Before the move", category: "internet", href: "/internet/compare" },
  { id: "internet-address-check", title: "Check each provider for the exact address", phase: "Before the move", category: "internet", href: "/internet" },
  { id: "internet", title: "Schedule internet installation", phase: "Before the move", category: "internet", href: "/resources/transfer-internet-when-moving" },
  { id: "trash", title: "Confirm trash and recycling", phase: "Before the move", category: "trash", href: "/resources/find-trash-service" },
  { id: "address-updates", title: "Submit USPS change of address", phase: "Before the move", category: "address", href: "/resources/change-your-address" },
  { id: "insurance", title: "Update the property address with your insurer", phase: "Before the move", category: "insurance" },
  { id: "essential-box", title: "Prepare an essential move-in box", description: "Include medications, chargers, basic tools, documents, water, and first-night supplies.", phase: "Before the move", category: "planning" },
  { id: "access", title: "Confirm key, fob, parking, or move-in access", phase: "Before the move", category: "access" },
  { id: "renter-insurance", title: "Confirm renters-insurance proof requirements", phase: "Before the move", category: "insurance", audience: "renter", href: "/renters/renters-insurance-and-deposits" },
  { id: "hoa-handoff", title: "Review HOA access and move-in rules", phase: "Before the move", category: "hoa", audience: "homeowner", href: "/homeowners/hoa-utility-responsibilities" },
  { id: "meter-photos", title: "Photograph visible utility meter readings", description: "Keep the photos privately as a record of where service started.", phase: "Move-in day", category: "utilities" },
  { id: "breaker-panel", title: "Locate the electrical panel", description: "Recognize and document it; do not attempt unsafe electrical work.", phase: "Move-in day", category: "safety", audience: "homeowner", href: "/homeowners/first-week-home-safety" },
  { id: "water-shutoff", title: "Locate the main water shutoff", phase: "Move-in day", category: "safety", audience: "homeowner", href: "/homeowners/find-water-shutoff" },
  { id: "smoke-alarms", title: "Test smoke alarms", phase: "Move-in day", category: "safety", href: "/homeowners/first-week-home-safety" },
  { id: "co-alarms", title: "Test carbon monoxide alarms where present", phase: "Move-in day", category: "safety", href: "/homeowners/first-week-home-safety" },
  { id: "condition-photos", title: "Photograph the property condition before unpacking", phase: "Move-in day", category: "documentation", audience: "renter", href: "/renters/document-move-in-condition" },
  { id: "outage-contacts", title: "Save utility outage and emergency numbers", phase: "Move-in day", category: "emergency", href: "/resources/printables/outage-emergency-numbers" },
  { id: "internet-status", title: "Confirm internet installation status", phase: "Move-in day", category: "internet" },
  { id: "internet-installation-record", title: "Save the installation date and support details privately", phase: "First week", category: "internet", href: "/resources/printables/internet-setup-checklist" },
  { id: "driver-license", title: "Review driver license address requirements", phase: "First week", category: "address" },
  { id: "vehicle-registration", title: "Review vehicle registration address requirements", phase: "First week", category: "address" },
  { id: "voter-registration", title: "Review voter registration address information", phase: "First week", category: "address" },
  { id: "banks", title: "Update banks and credit cards", phase: "First week", category: "address" },
  { id: "payroll", title: "Update employer and payroll address", phase: "First week", category: "address" },
  { id: "shipping-addresses", title: "Update default shopping and shipping addresses", phase: "First week", category: "address" },
  { id: "community-rules", title: "Review HOA or community rules", phase: "First week", category: "community", audience: "homeowner" },
  { id: "renter-rules", title: "Confirm maintenance, trash, parking, and building rules", phase: "First week", category: "renter", audience: "renter", href: "/renters/maintenance-parking-and-pet-checklist" },
  { id: "trash-schedule", title: "Confirm trash and recycling days", phase: "First week", category: "trash" },
  { id: "hvac-filter", title: "Inspect the HVAC filter and record its size", phase: "First 30 days", category: "maintenance", audience: "homeowner", href: "/homeowners/home-records-and-maintenance" },
  { id: "home-inventory", title: "Create a private home inventory", phase: "First 30 days", category: "records", href: "/homeowners/home-records-and-maintenance" },
  { id: "emergency-supplies", title: "Review household emergency supplies", phase: "First 30 days", category: "emergency" },
  { id: "emergency-links", title: "Save local emergency-management information", phase: "First 30 days", category: "emergency" },
  { id: "insurance-documents", title: "Confirm insurance documents and private storage", phase: "First 30 days", category: "insurance" },
  { id: "appliance-records", title: "Record appliance model and serial numbers privately", phase: "First 30 days", category: "records", audience: "homeowner", href: "/homeowners/home-records-and-maintenance" },
  { id: "maintenance-responsibilities", title: "Review home maintenance responsibilities", phase: "First 30 days", category: "maintenance", audience: "homeowner" },
  { id: "renter-maintenance", title: "Confirm routine and emergency maintenance contacts", phase: "First 30 days", category: "renter", audience: "renter" },
  { id: "homestead-review", title: "Review Florida homestead exemption eligibility", description: "Use the county property appraiser and official state guidance; this is not tax advice.", phase: "First 30 days", category: "florida", audience: "homeowner", href: "https://floridarevenue.com/property/pages/Taxpayers_Exemptions.aspx" },
  { id: "forgotten-items", title: "Review the things people often forget after moving", phase: "First week", category: "planning", href: "/resources/things-people-forget-when-moving" },
  { id: "utilities-transfer", title: "Transfer or close old utility accounts on the authorized date", phase: "Before the move", category: "utilities", href: "/resources/when-to-transfer-utilities" },
];

export function tasksForProfile(profile: MoveProfile | null) {
  return moveTasks.filter((task) => !task.audience || !profile || task.audience === profile.audience);
}

export function normalizeMyMoveState(value: unknown): MyMoveState {
  if (!value || typeof value !== "object") return emptyMyMoveState();
  const candidate = value as Partial<MyMoveState>;
  const profile = normalizeProfile(candidate.profile);
  return { version: 1, profile, completedTaskIds: stringArray(candidate.completedTaskIds), dismissedTaskIds: stringArray(candidate.dismissedTaskIds), addedTaskIds: stringArray(candidate.addedTaskIds), internetProviders: stringArray(candidate.internetProviders).slice(0, 4) };
}

export function parseMyMoveState(raw: string | null) {
  if (!raw) return emptyMyMoveState();
  try { return normalizeMyMoveState(JSON.parse(raw)); } catch { return emptyMyMoveState(); }
}

export function readMyMoveState(storage?: Pick<Storage, "getItem"> | null) {
  try { return { state: parseMyMoveState(storage?.getItem(MY_MOVE_STORAGE_KEY) ?? null), available: Boolean(storage) }; }
  catch { return { state: emptyMyMoveState(), available: false }; }
}

export function getBrowserStorage() {
  if (typeof window === "undefined") return null;
  try { return window.localStorage; } catch { return null; }
}

export function writeMyMoveState(state: MyMoveState, storage?: Pick<Storage, "setItem"> | null) {
  try { if (!storage) return false; storage.setItem(MY_MOVE_STORAGE_KEY, JSON.stringify(normalizeMyMoveState(state))); return true; }
  catch { return false; }
}

export function addTaskToState(state: MyMoveState, taskId: string) {
  if (!moveTasks.some((task) => task.id === taskId) || state.addedTaskIds.includes(taskId)) return { state, added: false };
  return { state: { ...state, dismissedTaskIds: state.dismissedTaskIds.filter((id) => id !== taskId), addedTaskIds: [...state.addedTaskIds, taskId] }, added: true };
}

export function saveInternetProviderToMyMove(providerName: string) {
  if (!providerName || providerName.length > 80) return false;
  const storage = getBrowserStorage();
  const current = readMyMoveState(storage).state;
  const internetProviders = [...new Set([...current.internetProviders, providerName])].sort().slice(0, 4);
  const addedTaskIds = [...new Set([...current.addedTaskIds, "internet-compare", "internet-address-check", "internet"] )];
  const saved = writeMyMoveState({ ...current, internetProviders, addedTaskIds }, storage);
  if (saved) window.dispatchEvent(new CustomEvent("movein:my-move-updated"));
  return saved;
}

export function phaseForMoveDate(moveDate: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(moveDate)) return { phase: "before_move" as MovePhase, label: "Add a move date for timing guidance", days: null };
  const [year, month, day] = moveDate.split("-").map(Number);
  const target = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((target - today) / 86_400_000);
  if (days > 7) return { phase: "before_move" as MovePhase, label: `${days} days to go`, days };
  if (days > 1) return { phase: "move_in_week" as MovePhase, label: "Move-in week", days };
  if (days === 1) return { phase: "move_in_week" as MovePhase, label: "Move-in day is tomorrow", days };
  if (days === 0) return { phase: "move_in_day" as MovePhase, label: "Move-in day", days };
  if (days >= -6) return { phase: "first_week" as MovePhase, label: `${Math.abs(days)} ${Math.abs(days) === 1 ? "day" : "days"} since move-in`, days };
  if (days >= -30) return { phase: "first_month" as MovePhase, label: "First month", days };
  return { phase: "later" as MovePhase, label: `${Math.abs(days)} days since move-in`, days };
}

function normalizeProfile(value: unknown): MoveProfile | null {
  if (!value || typeof value !== "object") return null;
  const profile = value as Partial<MoveProfile>;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(profile.moveDate ?? "") || !/^\d{5}$/.test(profile.zip ?? "") || !["homeowner", "renter"].includes(profile.audience ?? "")) return null;
  return { moveDate: profile.moveDate!, zip: profile.zip!, audience: profile.audience as MoveAudience };
}

function stringArray(value: unknown) { return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string" && item.length < 80))] : []; }
