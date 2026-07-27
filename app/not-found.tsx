import { ArrowRight, House } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="status-page"><section className="status-card"><span className="status-icon"><House size={30} aria-hidden="true" /></span><span className="kicker">404 · Page not found</span><h1>That page is not in the moving box.</h1><p>The address may be outdated, or the guide may have moved. Choose a useful place to continue.</p><div className="status-links"><Link href="/timeline">Open My Move Timeline <ArrowRight size={17} aria-hidden="true" /></Link><Link href="/homeowners">Homeowner guides</Link><Link href="/renters">Renter guides</Link><Link href="/florida">Florida guide</Link></div></section></main>;
}
