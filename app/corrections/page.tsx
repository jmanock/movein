import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Report a Utility Data Correction", "Report an incorrect provider, phone number, link, missing utility, or outdated service-area note.", "/corrections");
const subject = encodeURIComponent("MoveIn utility data correction");
const body = encodeURIComponent("ZIP code:\nRecord or provider:\nProblem (incorrect provider, phone, broken link, missing utility, or service area):\nOfficial source URL, if available:\nDetails:\n");
export default function CorrectionsPage() { return <main id="main-content"><PageHero eyebrow="Corrections" title="Help us correct a service record." description="No account is required. Please do not include account numbers, passwords, or sensitive personal information." /><section className="section"><div className="shell correction-card"><h2>What to include</h2><ul><li>The ZIP code shown on MoveIn</li><li>The provider or record that needs attention</li><li>Whether the problem is a phone number, link, missing utility, provider, or service-area note</li><li>An official provider or government source when available</li></ul><a className="button" href={`mailto:hello@movein.guide?subject=${subject}&body=${body}`}><Mail size={18} aria-hidden="true" /> Email a correction</a><p>Your email app will open with a structured template. MoveIn does not receive a submission unless you choose to send it.</p></div></section></main>; }
