"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main id="main-content" className="status-page"><section className="status-card"><span className="kicker">Something went wrong</span><h1>We could not open that guide.</h1><p>Your saved timeline progress remains on this device. Try loading the page again, or return to the timeline.</p><div className="status-links"><button className="button" onClick={reset}>Try again</button><Link href="/timeline">Return to My Move Timeline</Link></div></section></main>;
}
