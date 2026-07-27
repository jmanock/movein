"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Backpack, Bookmark, Building2, Bug,
  CalendarDays, Car, Check, CircleCheck, ClipboardCheck, Clock3, CloudRainWind,
  CloudSun, Droplets, FileText, House, HousePlus, KeyRound, Landmark, Mail, MapPin,
  Menu, Moon, PackageOpen, Palmtree, PawPrint, Printer, Radio, ReceiptText, Save,
  Shield, ShieldCheck, Sparkles, Sun, Umbrella, Waves, Wifi, X,
  type LucideIcon,
} from "lucide-react";
import { articles, floridaGuides, journey, ownerChecklist, renterItems, resources, startPaths } from "./siteData";

const iconMap: Record<string, LucideIcon> = {
  Backpack, Building2, Bug, CalendarDays, Car, ClipboardCheck, CloudRainWind,
  CloudSun, Droplets, FileText, House, HousePlus, KeyRound, Landmark, MapPin,
  PackageOpen, Palmtree, PawPrint, ReceiptText, Shield, ShieldCheck, Sparkles,
  Sun, Umbrella, Waves, Wifi,
};

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const Component = iconMap[name];
  return Component ? <Component size={size} strokeWidth={1.8} aria-hidden /> : null;
}

function Brand() {
  return (
    <a href="#top" className="brand" aria-label="Welcome Home Florida, home">
      <span className="brand-mark"><House size={17} strokeWidth={2.2} /></span>
      <span>Welcome Home <b>Florida</b></span>
    </a>
  );
}

export function ClientHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [rooms, setRooms] = useState(4);
  const [distance, setDistance] = useState(30);

  useEffect(() => {
    const stored = window.localStorage.getItem("whf-checklist");
    if (stored) setChecked(JSON.parse(stored));
    const prefersDark = window.localStorage.getItem("whf-theme") === "dark";
    setDark(prefersDark);
    document.documentElement.dataset.theme = prefersDark ? "dark" : "light";
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("whf-theme", next ? "dark" : "light");
  };

  const toggleCheck = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    window.localStorage.setItem("whf-checklist", JSON.stringify(next));
  };

  const totalItems = ownerChecklist.reduce((sum, group) => sum + group.items.length, 0);
  const completeItems = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((completeItems / totalItems) * 100);
  const moveEstimate = useMemo(() => 325 + rooms * 145 + distance * 3.25, [rooms, distance]);

  async function subscribe(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!response.ok) throw new Error("Could not subscribe");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main id="top">
      <header className="site-header">
        <div className="shell nav-wrap">
          <Brand />
          <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
            <a href="#journey" onClick={() => setMenuOpen(false)}>30-day journey</a>
            <a href="#homeowners" onClick={() => setMenuOpen(false)}>Homeowners</a>
            <a href="#renters" onClick={() => setMenuOpen(false)}>Renters</a>
            <a href="#florida" onClick={() => setMenuOpen(false)}>Florida guides</a>
            <a href="#resources" onClick={() => setMenuOpen(false)}>Resources</a>
          </nav>
          <div className="nav-actions">
            <button className="icon-btn" onClick={toggleTheme} aria-label={dark ? "Use light mode" : "Use dark mode"}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <a className="button button-small" href="#start">Start here <ArrowUpRight size={16} /></a>
            <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </header>

      <section className="hero section-pad">
        <div className="shell hero-grid">
          <div className="hero-copy reveal">
            <span className="eyebrow"><MapPin size={15} /> Your new Florida home base</span>
            <h1>Welcome home.<br /><em>We’ll help you settle in.</em></h1>
            <p className="hero-lede">Whether you just bought your first house or signed a lease, find everything you actually need—without the gimmicks, sales calls, or confusing checklists.</p>
            <div className="hero-actions">
              <a className="button" href="#start">Find my starting point <ArrowDown size={17} /></a>
              <a className="text-link" href="#journey">See the 30-day journey <ArrowRight size={17} /></a>
            </div>
            <div className="trust-row"><span><CircleCheck size={16} /> Free, practical guidance</span><span><Bookmark size={16} /> Made to bookmark</span></div>
          </div>
          <div className="home-illustration" aria-label="A welcoming Florida home at sunrise" role="img">
            <div className="sun" />
            <div className="cloud cloud-one" /><div className="cloud cloud-two" />
            <div className="palm"><span /><i /><b /></div>
            <div className="house-shape"><div className="roof" /><div className="window left" /><div className="window right" /><div className="door" /><div className="step" /></div>
            <div className="plant plant-one" /><div className="plant plant-two" />
            <div className="hero-note"><span><Check size={14} /></span><div><b>Day 1</b><small>Find your shutoffs</small></div></div>
          </div>
        </div>
      </section>

      <section id="start" className="section-pad start-section">
        <div className="shell">
          <div className="section-heading"><div><span className="kicker">Start here</span><h2>What brought you home?</h2></div><p>Choose the path that fits today. We’ll make the next steps feel manageable.</p></div>
          <div className="path-grid">{startPaths.map((path) => <a href={path.href} className={`path-card ${path.color}`} key={path.title}><span className="path-icon"><Icon name={path.icon} /></span><span className="card-eyebrow">{path.eyebrow}</span><h3>{path.title}</h3><p>{path.text}</p><span className="card-link">Open my checklist <ArrowUpRight size={17} /></span></a>)}</div>
        </div>
      </section>

      <section id="journey" className="section-pad journey-section">
        <div className="shell journey-shell">
          <div className="journey-intro"><span className="kicker light">Your first month, made simpler</span><h2>The 30-Day<br />Home Journey</h2><p>Not another giant list. A thoughtful sequence that tells you what matters now—and what can wait.</p><a className="button button-light" href="#homeowners">Begin the journey <ArrowRight size={17} /></a></div>
          <div className="journey-list">{journey.map((item, index) => <article className="journey-item" key={item.step}><div className="journey-number">{String(index + 1).padStart(2, "0")}</div><span className="journey-icon"><Icon name={item.icon} /></span><div><span>{item.step}</span><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
        </div>
      </section>

      <section id="homeowners" className="section-pad">
        <div className="shell">
          <div className="section-heading owner-heading"><div><span className="kicker">For homeowners</span><h2>Your first-month essentials</h2></div><div className="progress-card"><div><span>Your progress</span><b>{completeItems} of {totalItems}</b></div><div className="progress-track"><i style={{ width: `${progress}%` }} /></div></div></div>
          <div className="checklist-grid">{ownerChecklist.map((group, groupIndex) => <article className="checklist-card" key={group.title}><div className="checklist-top"><span>0{groupIndex + 1}</span><div><h3>{group.title}</h3><p>{group.description}</p></div></div><div className="checks">{group.items.map((item, itemIndex) => { const id = `${groupIndex}-${itemIndex}`; return <label className={checked[id] ? "checked" : ""} key={item}><input type="checkbox" checked={!!checked[id]} onChange={() => toggleCheck(id)} /><span><Check size={13} /></span>{item}</label>; })}</div></article>)}</div>
          <p className="local-note"><Save size={15} /> Your progress is saved on this device.</p>
        </div>
      </section>

      <section id="florida" className="section-pad florida-section">
        <div className="shell"><div className="section-heading"><div><span className="kicker">Florida, decoded</span><h2>Live like a local, sooner.</h2></div><p>Clear answers for the practical parts of Florida life—from storm season to toll roads.</p></div><div className="guide-grid">{floridaGuides.map((guide) => <a href="#newsletter" className="guide-card" key={guide.title}><span><Icon name={guide.icon} /></span><div><h3>{guide.title}</h3><p>{guide.text}</p></div><ArrowUpRight className="guide-arrow" size={17} /></a>)}</div></div>
      </section>

      <section id="emergency" className="section-pad emergency-section">
        <div className="shell emergency-grid"><div className="emergency-copy"><span className="eyebrow dark"><Radio size={15} /> Storm-ready, not storm-worried</span><h2>A little preparation brings a lot of calm.</h2><p>Build your plan before the forecast gets busy. Cover water, food, power, insurance photos, pets, emergency contacts, and evacuation routes.</p><a className="button button-dark" href="#resources">Open the hurricane checklist <ArrowRight size={17} /></a></div><div className="kit-card"><div className="kit-top"><span><Backpack size={25} /></span><div><small>Emergency kit</small><h3>The calm-before-the-storm list</h3></div></div><div className="kit-grid">{["7 days of water", "Shelf-stable food", "Flashlights + batteries", "Weather radio", "Pet supplies", "Insurance photos"].map((item, i) => <div key={item}><span>{String(i + 1).padStart(2, "0")}</span>{item}</div>)}</div></div></div>
      </section>

      <section id="renters" className="section-pad">
        <div className="shell"><div className="section-heading"><div><span className="kicker">For renters</span><h2>Move in. Protect yourself. Exhale.</h2></div><p>The practical paperwork and setup steps that make renting feel more like home.</p></div><div className="renter-grid">{renterItems.map((item) => <article className="renter-card" key={item.title}><span><Icon name={item.icon} /></span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div>
      </section>

      <section id="resources" className="section-pad resources-section">
        <div className="shell"><div className="section-heading"><div><span className="kicker">Resource library</span><h2>Keep the useful stuff handy.</h2></div><p>Print-friendly plans and worksheets made for refrigerators, folders, and moving-day clipboards.</p></div><div className="resource-grid">{resources.map((resource) => <article className="resource-card" key={resource.title}><div><span className="resource-type">{resource.category}</span><h3>{resource.title}</h3><p>{resource.detail}</p></div><div className="resource-footer"><span><Clock3 size={15} /> {resource.time}</span><button onClick={() => window.print()} aria-label={`Print ${resource.title}`}><Printer size={18} /></button></div></article>)}</div>
          <div className="tool-card"><div><span className="kicker">Quick tool</span><h3>Moving budget estimator</h3><p>A simple starting estimate for a local move. Actual quotes will vary.</p></div><div className="tool-inputs"><label>Rooms <input type="range" min="1" max="8" value={rooms} onChange={(e) => setRooms(Number(e.target.value))} /><b>{rooms}</b></label><label>Miles <input type="range" min="5" max="200" step="5" value={distance} onChange={(e) => setDistance(Number(e.target.value))} /><b>{distance}</b></label></div><div className="estimate"><small>Planning estimate</small><strong>${Math.round(moveEstimate).toLocaleString()}</strong></div></div>
        </div>
      </section>

      <section className="section-pad stories-section"><div className="shell"><div className="section-heading"><div><span className="kicker">From the guidebook</span><h2>Good advice for the next chapter.</h2></div><a className="text-link" href="#newsletter">Get new guides monthly <ArrowRight size={17} /></a></div><div className="article-grid">{articles.map((article, i) => <article className="article-card" key={article.title}><div className={`article-visual ${article.color}`}><span>0{i + 1}</span><Icon name={i === 0 ? "HousePlus" : i === 1 ? "Landmark" : "CloudRainWind"} size={38} /></div><div><span className="card-eyebrow">{article.category}</span><h3>{article.title}</h3><p>{article.read}</p></div></article>)}</div></div></section>

      <section id="newsletter" className="newsletter-section"><div className="shell newsletter-card"><div className="newsletter-copy"><span className="eyebrow light"><Mail size={15} /> The Welcome Note</span><h2>Florida life,<br />one useful email at a time.</h2><p>Monthly home tips, seasonal alerts, money-saving ideas, and new guides. No clutter. Unsubscribe anytime.</p></div><form className="subscribe-form" onSubmit={subscribe}><label htmlFor="email">Email address</label><div><input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /><button type="submit" disabled={status === "loading"}>{status === "loading" ? "Joining…" : "Join the list"} <ArrowRight size={17} /></button></div><p role="status">{status === "success" ? "You’re on the list. Welcome home!" : status === "error" ? "We couldn’t add you just now. Please try again." : "One thoughtful email a month. That’s it."}</p></form></div></section>

      <footer><div className="shell footer-grid"><div><Brand /><p>Everything you need after getting the keys.</p><span>Made with care for Florida’s newest neighbors.</span></div><div><h3>Explore</h3><a href="#homeowners">Homeowners</a><a href="#renters">Renters</a><a href="#florida">Florida guides</a><a href="#resources">Resources</a></div><div><h3>Essentials</h3><a href="#journey">30-day journey</a><a href="#emergency">Emergency prep</a><a href="#newsletter">Newsletter</a><a href="mailto:hello@welcomehomeflorida.com">Contact</a></div><div><h3>Stay in the loop</h3><p>Useful Florida guidance, once a month.</p><a className="footer-cta" href="#newsletter">Subscribe <ArrowUpRight size={16} /></a></div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} Welcome Home Florida</span><div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Accessibility</a></div></div></footer>
    </main>
  );
}
