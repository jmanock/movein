"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, LoaderCircle, PackageOpen, PackageCheck } from 'lucide-react';
import type { InventoryItem, ReceiptHistoryEntry } from '../lib/receipts/types';
import { formatMoney } from '../lib/receipts/review';

export function HomeInventory({ enabled, developmentHousehold = false }: { enabled: boolean; developmentHousehold?: boolean }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [receipts, setReceipts] = useState<ReceiptHistoryEntry[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState('');
  async function retry() {
    setLoading(true); setError('');
    try { const data = await fetchInventory(); setItems(data.items); setReceipts(data.receipts); }
    catch (problem) { setError(problem instanceof Error ? problem.message : 'My Home could not be loaded.'); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    void fetchInventory(controller.signal).then((data) => {
      if (!controller.signal.aborted) { setItems(data.items); setReceipts(data.receipts); }
    }).catch((problem) => {
      if (!controller.signal.aborted) setError(problem instanceof Error ? problem.message : 'My Home could not be loaded.');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [enabled]);
  if (!enabled) return <div className="receipt-status"><h2>My Home is being prepared.</h2><p>The inventory is available in the local development flow. Private household access is still being planned.</p><Link className="text-link" href="/receipts">Explore receipts</Link></div>;
  const values = new Map<string, { total: number; count: number }>();
  for (const item of items) if (item.purchasePriceMinor !== null) {
    const value = values.get(item.currency) ?? { total: 0, count: 0 };
    values.set(item.currency, { total: value.total + item.purchasePriceMinor, count: value.count + 1 });
  }
  return <section className="home-inventory" aria-busy={loading}>
    <div className="receipt-tool-nav"><Link href="/my-home" aria-current="page">My Home</Link><Link href="/receipts">Add a receipt <ArrowRight size={16} aria-hidden="true" /></Link></div>
    {developmentHousehold && <p className="receipt-demo-note"><strong>Local development</strong> This local app uses one development household. Purchase records belong to that household and are shared by local browsers. This is separate from your My Move checklist.</p>}
    {loading ? <p className="receipt-loading" role="status"><LoaderCircle className="receipt-spinner" aria-hidden="true" />Loading your home inventory…</p> : error ? <div className="receipt-error" role="alert"><p>{error}</p><button className="button" type="button" onClick={() => void retry()}>Try again</button></div> : items.length ? <>
      <div className="inventory-summary"><div><span>Household items</span><strong>{items.length}</strong></div>{Array.from(values, ([currency, value]) => <div key={currency}><span>Recorded purchase value · {currency}</span><strong>{formatMoney(value.total, currency)}</strong><small>{value.count} items with a recorded price</small></div>)}</div>
      <div className="inventory-heading"><h2>Your household inventory</h2><span>{items.length} {items.length === 1 ? 'item' : 'items'}</span></div>
      <ul className="inventory-grid">{items.map((item) => <li key={item.id}><span className="inventory-item-icon"><PackageCheck size={26} aria-hidden="true" /></span><p className="eyebrow">{item.category ?? 'Household item'}</p><h3>{item.name}</h3><strong className="inventory-price">{formatMoney(item.purchasePriceMinor, item.currency)}</strong><dl><div><dt>Purchased</dt><dd>{item.purchaseDate ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${item.purchaseDate}T00:00:00Z`)) : 'Date not recorded'}</dd></div><div><dt>From</dt><dd>{item.merchant ?? 'Store not recorded'}</dd></div></dl><small>Added from a reviewed receipt</small></li>)}</ul>
    </> : <div className="inventory-empty"><PackageOpen size={48} aria-hidden="true" /><h2>A place for the things worth remembering.</h2><p>Start with a receipt. Review its purchases and choose household items to add here, with less manual entry.</p><Link className="button" href="/receipts">Add your first receipt <ArrowRight size={18} aria-hidden="true" /></Link></div>}
    {!loading && !error && <section className="receipt-history" aria-labelledby="receipt-history-title"><div className="inventory-heading"><h2 id="receipt-history-title">Receipt history</h2><span>{receipts.length} saved</span></div><p>Purchase information from reviewed receipts. Original receipt images are not stored.</p>{receipts.length ? <ul>{receipts.map(receipt => <li key={receipt.id}><div><h3>{receipt.merchant ?? 'Store not recorded'}</h3><p>{receipt.purchaseDate ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${receipt.purchaseDate}T00:00:00Z`)) : 'Date not recorded'}</p></div><strong>{formatMoney(receipt.totalMinor, receipt.currency)}</strong><div className="history-counts"><span>{receipt.itemCount} purchase lines</span><span>{receipt.inventoryCount} added to My Home</span></div></li>)}</ul> : <div className="history-empty">Your saved receipts will appear here, including purchases you choose to keep off your inventory.</div>}</section>}
  </section>;
}

async function fetchInventory(signal?: AbortSignal): Promise<{ items: InventoryItem[]; receipts: ReceiptHistoryEntry[] }> {
  const response = await fetch('/api/my-home', { cache: 'no-store', signal });
  const data = await response.json();
  if (!response.ok || !Array.isArray(data.items) || !Array.isArray(data.receipts)) throw new Error(data.error || 'My Home could not be loaded.');
  return data;
}
