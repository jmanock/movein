import { requirePageHousehold } from '../lib/households/page-context';
import type { Metadata } from 'next';
import { Breadcrumbs, PageHero } from '../components/PageHero';
import { ReceiptWorkspace } from '../components/ReceiptWorkspace';
import { receiptReadiness } from '../lib/receipts/readiness';
import { receiptExtractorConfig } from '../lib/receipts/config';
import { pageMetadata } from '../lib/metadata';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = pageMetadata('Receipts & Home Records', 'Review purchases, choose household items, and save useful home records. Try the receipt-to-inventory flow in the local development flow.', '/receipts', { noindex: true });
export default async function ReceiptsPage() {
  const household = await requirePageHousehold('/receipts');
  let mode: 'demo' | 'ollama' | null = null, timeoutMs = 180000, debug = false;
  const unavailableMessage = 'Receipt reading is unavailable right now. You can still view your saved receipts and home records.';
  try { const config = receiptExtractorConfig(); mode = (await receiptReadiness()).available ? config.provider : null; timeoutMs = config.timeoutMs; debug = config.debug; } catch { /* Keep setup details out of consumer copy. */ }
  return <main id="main-content" className="home-tool-page"><div className="shell page-breadcrumb-wrap"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Receipts' }]} /></div>
    <PageHero eyebrow="Receipts & home records" title="A receipt today. A home record tomorrow." description="Turn purchases worth remembering into useful records for your home." />
    <div className="shell receipt-page"><ReceiptWorkspace developmentHousehold={household.access === 'local-development'} enabled={mode !== null} mode={mode} timeoutMs={timeoutMs} debug={debug} unavailableMessage={unavailableMessage} /></div>
  </main>;
}
