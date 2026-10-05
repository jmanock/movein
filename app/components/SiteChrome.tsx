"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { signOut } from "../lib/auth/client";
import { primaryNavigation } from "../data/site";

function Brand() {
  return <Link href="/" className="brand" aria-label="MoveIn home"><span className="brand-mark"><House size={18} aria-hidden="true" /></span><span>Move<span>In</span></span></Link>;
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/auth-status', { cache: 'no-store', signal: controller.signal }).then(response => response.json()).then(data => setAuthenticated(data.authenticated === true)).catch(() => {});
    return () => controller.abort();
  }, [pathname]);
  async function logout() {
    setSignOutError('');
    try {
      await signOut();
      // Full navigation clears private component state and the client router cache after logout.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign('/sign-in');
    }
    catch { setSignOutError('Could not sign out. Please try again.'); }
  }
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  return <>
    <header className="site-header"><div className="shell nav-wrap"><div className="brand-wrap"><Brand /><span>Everything after the keys.</span></div><nav id="primary-navigation" className={open ? "nav-links open" : "nav-links"} aria-label="Primary navigation">{primaryNavigation.map((item) => <Link key={item.href} href={item.href} className={item.href === "/receipts" ? "nav-receipt" : undefined} onClick={() => setOpen(false)} aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ? "page" : undefined}>{item.label}</Link>)}{authenticated ? <button type="button" className="nav-auth-button" onClick={() => void logout()}>Sign out</button> : <Link href="/sign-in" onClick={() => setOpen(false)}>Sign in</Link>}</nav><button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="primary-navigation" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button></div></header>
    {signOutError && <p role="alert" className="shell receipt-error">{signOutError}</p>}
    {children}
    <footer><div className="shell footer-grid"><div><Brand /><p>Turn receipts into useful home records and find the essentials for your new address.</p><small>Independent information. No paid rankings.</small></div><div><h2>Explore</h2><Link href="/my-home">My Home</Link><Link href="/receipts">Receipts</Link><Link href="/homeowners">Homeowners</Link><Link href="/renters">Renters</Link><Link href="/learn-your-area">Learn Your Area</Link><Link href="/resources">Resources</Link></div><div><h2>Coverage & help</h2><Link href="/coverage">Current Coverage</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link><Link href="/corrections">Report a Correction</Link><Link href="/site-map">HTML Sitemap</Link></div><div><h2>Trust & policy</h2><Link href="/about">About</Link><Link href="/data-sources">Data Sources</Link><Link href="/editorial-policy">Editorial Policy</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/disclosure">Disclosure</Link></div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} MoveIn</span><span>Not a utility company or government agency · Five-county Florida pilot</span></div></footer>
  </>;
}
