import type { Metadata } from "next";
import { PageHero } from "../components/PageHero";
import { ZipLookupForm } from "../components/ZipLookupForm";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Florida Utility Lookup", "Enter a five-digit Florida ZIP code to find possible utility providers.", "/lookup", { noindex: true });
export default function LookupPage() {
  return <main id="main-content"><PageHero eyebrow="Florida pilot" title="Find possible providers by ZIP code." description="ZIP codes are a starting point. You will still need to confirm your exact street address."><ZipLookupForm /></PageHero></main>;
}
