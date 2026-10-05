import Link from 'next/link';
import { ArrowRight, ReceiptText } from 'lucide-react';

export function ReceiptIntro() {
  return <section className="section receipt-intro" aria-labelledby="receipt-intro-title"><div className="shell receipt-intro-grid">
    <div><span className="eyebrow">After the boxes are gone</span><h2 id="receipt-intro-title">Turn receipts into useful home records.</h2><p>We’re building a simpler way to keep track of household purchases. Start with a receipt, review the details, and choose what belongs in your home inventory.</p><Link className="button" href="/receipts">Explore receipts <ArrowRight size={16} aria-hidden="true" /></Link></div>
    <aside className="receipt-intro-note"><ReceiptText size={32} aria-hidden="true" /><h3>A record worth keeping.</h3><p>A new fridge. A sofa. The tools you’ll use for years. The aim is to remember the useful details without keeping every piece of paper.</p><small>Try the receipt-to-inventory flow in the local development flow.</small></aside>
  </div></section>;
}
