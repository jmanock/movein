import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { pageMetadata } from "../lib/metadata";
export const metadata: Metadata = pageMetadata("Contact MoveIn", "Contact MoveIn with product, accessibility, or general questions.", "/contact");
export default function ContactPage() { return <main id="main-content"><PageHero eyebrow="Contact" title="Questions about MoveIn?" description="For provider-data issues, use the Corrections page so we receive the ZIP code and official source details." /><section className="section"><div className="shell correction-card"><h2>General contact</h2><p>Email us for product feedback, accessibility help, or other questions. Do not send utility account numbers or passwords.</p><a className="button" href="mailto:hello@movein.guide"><Mail size={18} aria-hidden="true" /> hello@movein.guide</a></div></section></main>; }
