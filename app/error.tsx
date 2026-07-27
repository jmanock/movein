"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main id="main-content" className="status-page"><section className="status-card"><span className="eyebrow">Something went wrong</span><h1>We could not complete that lookup.</h1><p>Please try again. If the problem continues, the service database may be temporarily unavailable.</p><div className="status-links"><button className="button" onClick={reset}>Try again</button><Link href="/">Return home</Link></div></section></main>;
}
