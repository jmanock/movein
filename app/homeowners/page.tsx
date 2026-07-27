import type { Metadata } from "next";
import { PageHero } from "../components/PageHero";
import { ZipLookupForm } from "../components/ZipLookupForm";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Homeowner Utility Setup Guide", "A concise starting point for utilities, safety, records, and basic routines after buying a home.", "/homeowners");
const groups = [
  ["Start here", ["Confirm electric, water, sewer or septic, internet, gas, and trash service.", "Locate the main water shutoff and breaker panel without opening sealed equipment.", "Test smoke and carbon-monoxide alarms and replace batteries if needed.", "Save closing, inspection, insurance, warranty, and utility records together."]],
  ["Soon after", ["Review insurance coverage and questions with a licensed professional.", "Record local emergency, utility outage, and non-emergency contacts.", "Learn the trash and recycling schedule for the exact address.", "Turn inspection findings into a prioritized maintenance list."]],
  ["Ongoing", ["Check for leaks, drainage issues, HVAC filter needs, and unusual utility use.", "Keep receipts, model numbers, service records, and home-inventory photos current.", "Reconfirm changing local rules and provider contacts from official sources."]],
] as const;
export default function HomeownersPage() { return <main id="main-content"><PageHero eyebrow="Homeowners" title="Set up the essentials. Learn the house." description="A short, practical list—without turning your first year into a complicated timeline."><ZipLookupForm compact /></PageHero><section className="section"><div className="shell guide-groups">{groups.map(([title, items]) => <section key={title}><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}</div></section></main>; }
