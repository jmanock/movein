import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { addTaskToState, emptyMyMoveState, MY_MOVE_STORAGE_KEY, normalizeMyMoveState, phaseForMoveDate, readMyMoveState, tasksForProfile, writeMyMoveState } from "../app/lib/my-move.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const homeowner = { moveDate: "2026-08-28", zip: "32720", audience: "homeowner" };
const renter = { ...homeowner, audience: "renter" };

test("My Move creates, persists, restores, and resets a privacy-limited profile", () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const state = { ...emptyMyMoveState(), profile: homeowner, completedTaskIds: ["electricity"], dismissedTaskIds: ["trash"], addedTaskIds: ["internet"] };
  assert.equal(writeMyMoveState(state, storage), true);
  assert.equal(values.has(MY_MOVE_STORAGE_KEY), true);
  assert.deepEqual(readMyMoveState(storage).state, state);
  assert.equal(writeMyMoveState(emptyMyMoveState(), storage), true);
  assert.equal(readMyMoveState(storage).state.profile, null);
});

test("My Move safely handles unavailable and corrupted browser storage", () => {
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  assert.equal(readMyMoveState(blocked).available, false);
  assert.equal(readMyMoveState(blocked).state.profile, null);
  assert.equal(writeMyMoveState(emptyMyMoveState(), blocked), false);
  assert.equal(normalizeMyMoveState({ profile: { moveDate: "bad", zip: "abc", audience: "renter" }, completedTaskIds: ["safe", 4] }).profile, null);
});

test("homeowner and renter checklists expose distinct responsibilities", () => {
  const ownerIds = new Set(tasksForProfile(homeowner).map((task) => task.id));
  const renterIds = new Set(tasksForProfile(renter).map((task) => task.id));
  for (const id of ["water-shutoff", "breaker-panel", "homestead-review", "hvac-filter"]) assert.equal(ownerIds.has(id), true, id);
  for (const id of ["condition-photos", "renter-maintenance", "renter-rules"]) assert.equal(renterIds.has(id), true, id);
  assert.equal(ownerIds.has("condition-photos"), false);
  assert.equal(renterIds.has("homestead-review"), false);
});

test("Add to My Move persists one copy and restores a dismissed task", () => {
  const start = { ...emptyMyMoveState(), dismissedTaskIds: ["internet"] };
  const first = addTaskToState(start, "internet");
  assert.equal(first.added, true);
  assert.deepEqual(first.state.addedTaskIds, ["internet"]);
  assert.equal(first.state.dismissedTaskIds.includes("internet"), false);
  const duplicate = addTaskToState(first.state, "internet");
  assert.equal(duplicate.added, false);
  assert.deepEqual(duplicate.state.addedTaskIds, ["internet"]);
});

test("date phases use calendar days without time-of-day drift", () => {
  const now = new Date(2026, 7, 10, 23, 55);
  assert.deepEqual(phaseForMoveDate("2026-08-10", now), { phase: "move_in_day", label: "Move-in day", days: 0 });
  assert.equal(phaseForMoveDate("2026-08-15", now).phase, "move_in_week");
  assert.equal(phaseForMoveDate("2026-08-05", now).phase, "first_week");
  assert.equal(phaseForMoveDate("2026-07-20", now).phase, "first_month");
});

test("My Move UI validates ZIPs, keeps unsupported ZIPs useful, and exposes accessible controls", async () => {
  const [dashboard, storage] = await Promise.all([
    read("../app/components/MyMoveDashboard.tsx"),
    read("../app/lib/my-move.ts"),
  ]);
  for (const requirement of ["Enter a valid five-digit ZIP code", "Choose your move date", "does not support ZIP", "general checklist is ready", "Reset My Move", "aria-live", "type=\"date\"", "inputMode=\"numeric\""]) assert.match(dashboard, new RegExp(requirement));
  assert.match(dashboard, /getBrowserStorage/);
  assert.match(storage, /window\.localStorage/);
  assert.match(dashboard, /window\.confirm/);
  assert.doesNotMatch(dashboard, /email|password|phone number/i);
});

test("printable and retention tools share checklist logic and privacy-safe analytics", async () => {
  const [printablePage, printButton, checklist, analytics, css, data] = await Promise.all([read("../app/resources/printables/[slug]/page.tsx"), read("../app/components/PrintButton.tsx"), read("../app/components/InteractiveChecklist.tsx"), read("../app/lib/analytics.ts"), read("../app/globals.css"), read("../app/data/printables.ts")]);
  assert.match(printablePage, /InteractiveChecklist/);
  assert.match(printablePage, /AddToMyMoveButton/);
  assert.match(printButton, /window\.print/);
  assert.match(checklist, /localStorage/);
  assert.match(css, /@media print/);
  assert.match(css, /site-header.*display: none/s);
  for (const event of ["my_move_started", "my_move_task_completed", "my_move_reset", "add_to_my_move", "printable_view", "printable_print", "first_30_days_view", "dont_forget_impression", "dont_forget_action", "utility_added_to_my_move"]) assert.match(analytics, new RegExp(`${event}:`));
  for (const blocked of ["move_date", "notes", "checklist_text", "task_text"]) assert.match(analytics, new RegExp(blocked));
  for (const slug of ["first-30-days-new-home", "address-update-checklist", "utility-setup-checklist", "new-home-contacts", "things-people-forget-after-moving", "renter-move-in-checklist", "new-home-checklist", "utility-contact-information"]) assert.match(data, new RegExp(slug));
});
