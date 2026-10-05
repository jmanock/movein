import { requirePageHousehold } from '../lib/households/page-context';
import type { Metadata } from 'next';
import { Breadcrumbs, PageHero } from '../components/PageHero';
import { HomeInventory } from '../components/HomeInventory';
import { pageMetadata } from '../lib/metadata';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = pageMetadata('My Home: Household Inventory', 'Keep useful purchase records for the things in your home. Explore household inventory in MoveIn’s local development flow.', '/my-home', { noindex: true });
export default async function MyHomePage() {
  const household = await requirePageHousehold('/my-home');
  return <main id="main-content" className="home-tool-page"><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'My Home' }]} /></div><PageHero eyebrow="My Home" title="Your home, a little more organized." description="A useful record of the household purchases you choose to keep track of." /><div className="shell receipt-page"><HomeInventory enabled developmentHousehold={household.access === 'local-development'} /></div></main>;
}
