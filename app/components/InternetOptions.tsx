import { RadioTower, Router, Wifi } from "lucide-react";
import Link from "next/link";
import type { LookupProvider } from "../../db/lookup";
import { InternetProviderCard } from "./InternetProviderCard";
import { AddToMyMoveButton } from "./AddToMyMoveButton";

export function InternetOptions({ providers, zip, sourcePage }: { providers: LookupProvider[]; zip?: string; sourcePage: string }) {
  const commercial = providers.filter((provider) => provider.providerType !== "official_lookup").sort((a, b) => a.name.localeCompare(b.name));
  const officialTools = providers.filter((provider) => provider.providerType === "official_lookup");
  const wired = commercial.filter((provider) => !/T-Mobile|Verizon/i.test(provider.name));
  const wireless = commercial.filter((provider) => /T-Mobile|Verizon/i.test(provider.name));
  return <section className="internet-options" id="internet">
    <header className="internet-options-heading"><span className="eyebrow">Internet options</span><h2>Compare possibilities. Confirm the address.</h2><p>Internet availability can vary by exact address—even within the same ZIP code. Check your address with each provider below.</p><div><Link href={zip ? `/internet/compare?zip=${zip}` : "/internet/compare"}>Compare side by side</Link><AddToMyMoveButton taskId="internet-compare" label="Add Internet setup to My Move" sourcePage={sourcePage} /></div></header>
    {wired.length ? <ProviderGroup title="Wired internet" description="Cable, fiber, and DSL use physical network connections. The address result determines what reaches the property." icon={<Router aria-hidden="true" />} providers={wired} zip={zip} sourcePage={sourcePage} /> : null}
    {wireless.length ? <ProviderGroup title="Wireless home internet" description="5G and LTE home internet use a cellular network. Eligibility can change with address, signal, and capacity." icon={<RadioTower aria-hidden="true" />} providers={wireless} zip={zip} sourcePage={sourcePage} /> : null}
    {officialTools.length ? <div className="internet-official-tools"><Wifi size={21} aria-hidden="true" /><div><strong>Check the FCC National Broadband Map too</strong><p>It shows provider-reported fixed broadband at an exact location. Provider confirmation is still required.</p></div>{officialTools.map((tool) => <a href={tool.addressCheckUrl ?? tool.officialWebsite} target="_blank" rel="noopener noreferrer" key={tool.slug}>Open official broadband map</a>)}</div> : null}
    {!commercial.length ? <div className="internet-empty"><h3>Commercial provider research is still limited for this ZIP.</h3><p>Use the official broadband map and provider address tools. MoveIn will not invent options to fill the list.</p><Link href="/internet">Open the Internet hub</Link></div> : null}
  </section>;
}

function ProviderGroup({ title, description, icon, providers, zip, sourcePage }: { title: string; description: string; icon: React.ReactNode; providers: LookupProvider[]; zip?: string; sourcePage: string }) {
  return <section className="internet-provider-group"><header>{icon}<div><h3>{title}</h3><p>{description}</p></div></header><div className="internet-provider-grid">{providers.map((provider) => <InternetProviderCard provider={provider} zip={zip} sourcePage={sourcePage} key={provider.slug} />)}</div></section>;
}
