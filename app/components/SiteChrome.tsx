"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { primaryNavigation } from "../data/site";

function Brand() {
  return <Link href="/" className="brand" aria-label="MoveIn home"><span className="brand-mark"><House size={18} aria-hidden="true" /></span><span>Move<span>In</span></span></Link>;
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  return <>
    <header className="site-header"><div className="shell nav-wrap"><div className="brand-wrap"><Brand /><span>Everything after the keys.</span></div><nav id="primary-navigation" className={open ? "nav-links open" : "nav-links"} aria-label="Primary navigation">{primaryNavigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ? "page" : undefined}>{item.label}</Link>)}</nav><button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="primary-navigation" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button></div></header>
    {children}
    <footer><div className="shell footer-grid"><div><Brand /><p>Find possible utility and local-service providers, then confirm your exact address with the official source.</p><small>Independent information. No paid rankings.</small></div><div><h2>Explore</h2><Link href="/">Home</Link><Link href="/homeowners">Homeowners</Link><Link href="/renters">Renters</Link><Link href="/learn-your-area">Learn Your Area</Link><Link href="/resources">Resources</Link></div><div><h2>Coverage & help</h2><Link href="/coverage">Current Coverage</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link><Link href="/corrections">Report a Correction</Link><Link href="/site-map">HTML Sitemap</Link></div><div><h2>Trust & policy</h2><Link href="/about">About</Link><Link href="/data-sources">Data Sources</Link><Link href="/editorial-policy">Editorial Policy</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/disclosure">Disclosure</Link></div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} MoveIn</span><span>Not a utility company or government agency · Five-county Florida pilot</span></div></footer>
  </>;
}
