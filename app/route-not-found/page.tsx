import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };
export default function LookupNotFound() { return <main id="main-content"><section className="section"><div className="shell narrow not-found"><span className="eyebrow">ZIP lookup</span><h1>We could not find that ZIP code.</h1><p>Check the number and try again.</p><p>MoveIn currently covers a verified pilot in Seminole, Orange, Volusia, Lake, and Osceola counties.</p><Link className="button" href="/#zip-lookup">Try another ZIP code</Link></div></section></main>; }
