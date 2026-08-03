import type { Metadata } from "next";
import { CountyUtilitiesPage } from "../components/CountyUtilitiesPage";
import { countyProfiles } from "../data/counties";
import { pageMetadata } from "../lib/metadata";

const county = countyProfiles.find((profile) => profile.name === "Osceola")!;
export const metadata: Metadata = pageMetadata("Osceola County Utilities and Moving Resources", county.description, `/${county.slug}`);
export default function Page() { return <CountyUtilitiesPage county={county} />; }
