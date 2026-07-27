"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, House, Menu, Moon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { primaryNavigation } from "../data/site";
import { trackEvent } from "../lib/analytics";

function Brand() {
  return (
    <Link href="/" className="brand" aria-label="MoveIn, home">
      <span className="brand-mark"><House size={17} strokeWidth={2.2} /></span>
      <span className="brand-type">Move<span>In</span></span>
    </Link>
  );
}

function CampaignTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const current = new URL(window.location.href);
    const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "campaign"];
    const values = campaignKeys.flatMap((key) => current.searchParams.has(key) ? [[key, current.searchParams.get(key)!] as const] : []);
    if (values.length) sessionStorage.setItem("movein.campaign", JSON.stringify(Object.fromEntries(values)));
    if (pathname.startsWith("/welcome/")) {
      const campaign = pathname.split("/").pop() ?? "unknown";
      trackEvent("qr_campaign_visit", { campaign });
      trackEvent("campaign_landing_visit", { campaign });
    }

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor || !values.length) return;
      const destination = new URL(anchor.href, current.origin);
      if (destination.origin !== current.origin) return;
      values.forEach(([key, value]) => { if (!destination.searchParams.has(key)) destination.searchParams.set(key, value); });
      anchor.href = destination.toString();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);
  return null;
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleTheme = () => {
    const next = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("movein.theme", next ? "dark" : "light");
  };

  return (
    <>
      <CampaignTracker />
      <header className="site-header">
        <div className="shell nav-wrap">
          <Brand />
          <nav id="primary-navigation" className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
            {primaryNavigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
          </nav>
          <div className="nav-actions">
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle color theme"><Moon size={18} aria-hidden="true" /></button>
            <Link className="button button-small" href="/timeline" onClick={() => trackEvent("timeline_start", { source: "header" })}>Start My Timeline <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </header>
      {children}
      <footer>
        <div className="shell footer-grid">
          <div><Brand /><p>Everything after the keys.</p><span>Practical guidance for homeowners and renters.</span></div>
          <div><h3>Get started</h3><Link href="/timeline">My Move Timeline</Link><Link href="/homeowners">Homeowners</Link><Link href="/renters">Renters</Link><Link href="/florida">Florida Guide</Link></div>
          <div><h3>Explore</h3><Link href="/checklists">Checklists</Link><Link href="/resources">Resources</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div>
          <div><h3>MoveIn</h3><p>movein.guide</p><Link href="/editorial-policy">Editorial policy</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/disclosure">Disclosure</Link></div>
        </div>
        <div className="shell footer-disclaimer">MoveIn provides general educational information and is not a substitute for professional legal, financial, insurance, safety, construction, or real estate advice.</div>
        <div className="shell footer-bottom"><span>© {new Date().getFullYear()} MoveIn</span><span>Everything after the keys.</span></div>
      </footer>
    </>
  );
}
