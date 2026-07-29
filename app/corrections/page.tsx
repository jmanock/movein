import type { Metadata } from "next";
import { CorrectionForm } from "../components/CorrectionForm";
import { Breadcrumbs, PageHero } from "../components/PageHero";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Report a Utility Data Correction", "Report an incorrect provider, phone number, link, missing utility, or outdated service-area note.", "/corrections", { noindex: true });
export default async function CorrectionsPage({ searchParams }: { searchParams: Promise<{ zip?: string }> }) { const { zip = "" } = await searchParams; return <main id="main-content"><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Corrections" }]} /></div><PageHero eyebrow="Corrections" title="Help us correct a service record." description="No account is required. Please do not include account numbers, passwords, or sensitive personal information." /><section className="section"><div className="shell correction-card"><h2>Send the details for review</h2><p>Corrections are reviewed against an official provider or government source before public records change. An email is optional and is used only if the reviewer needs clarification.</p><CorrectionForm initialZip={/^\d{5}$/.test(zip) ? zip : ""} /></div></section></main>; }
