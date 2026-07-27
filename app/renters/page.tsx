import type { Metadata } from "next";
import { PageHero } from "../components/PageHero";
import { ZipLookupForm } from "../components/ZipLookupForm";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Renter Utility Setup Guide", "A concise starting point for utilities, move-in records, lease contacts, and deposit protection.", "/renters");
const groups = [
  ["Start here", ["Read the lease to see which utilities you must open and which are included.", "Confirm provider availability for the exact unit before ordering internet or other service.", "Photograph walls, floors, fixtures, appliances, and existing damage before unpacking.", "Save the condition report and send it using the notice method required by the lease."]],
  ["Soon after", ["Confirm the landlord or property manager’s routine and emergency maintenance contacts.", "Learn the building’s trash, recycling, parking, package, and access procedures.", "Keep utility start confirmations, receipts, lease notices, and correspondence together.", "Test alarms and report safety or maintenance concerns promptly in writing."]],
  ["Ongoing", ["Use the lease’s required process for maintenance requests and keep copies.", "Record any material condition changes and follow up on unresolved issues.", "Before moving out, review notice deadlines and the required deposit-return process."]],
] as const;
export default function RentersPage() { return <main id="main-content"><PageHero eyebrow="Renters" title="Know what you set up—and what the lease covers." description="Start with services, condition records, and clear landlord communication."><ZipLookupForm compact /></PageHero><section className="section"><div className="shell guide-groups">{groups.map(([title, items]) => <section key={title}><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}</div></section></main>; }
