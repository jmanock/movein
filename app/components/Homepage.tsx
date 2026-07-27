"use client";

import Link from "next/link";
import { ArrowRight, Check, Compass, MapPin } from "lucide-react";
import { entryCards } from "../data/site";
import { timelineStages } from "../data/timeline";
import { trackEvent } from "../lib/analytics";
import { Icon } from "./Icon";
import { NewsletterForm } from "./NewsletterForm";

export function Homepage() {
  return <main id="main-content">
    <section className="hero section-pad">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <span className="brand-kicker">MoveIn <i>Everything after the keys.</i></span>
          <h1>You have the keys.<br /><em>Now what?</em></h1>
          <p className="hero-lede">MoveIn helps homeowners and renters figure out what to do next, from the first day through the first year.</p>
          <div className="hero-actions"><Link className="button" href="/timeline" onClick={() => trackEvent("homepage_cta_click", { cta: "timeline" })}>Start My Move Timeline <ArrowRight size={17} /></Link><Link className="text-link" href="/florida" onClick={() => trackEvent("homepage_cta_click", { cta: "florida" })}>Explore the Florida Guide <ArrowRight size={17} /></Link></div>
          <div className="trust-row"><span><Check size={16} /> No account required</span><span><Check size={16} /> Progress saves on your device</span></div>
        </div>
        <div className="move-map" aria-label="An organized path from move-in day through the first year" role="img">
          <div className="map-path" />
          <div className="map-key"><span><Icon name="KeyRound" size={24} /></span><b>Keys in hand</b><small>Your timeline begins</small></div>
          {timelineStages.slice(0, 5).map((stage, index) => <div className={`map-stop stop-${index + 1}`} key={stage.slug}><span>{index + 1}</span><p>{stage.shortLabel}</p></div>)}
          <div className="map-home"><Icon name="House" size={33} /><b>Feeling at home</b></div>
        </div>
      </div>
    </section>

    <section className="section-pad start-section">
      <div className="shell"><div className="section-heading"><div><span className="kicker">Choose your starting point</span><h2>What best describes your move?</h2></div><p>Start where you are. Every path leads to practical, pressure-free guidance.</p></div>
        <div className="path-grid">{entryCards.map((card) => <Link href={card.href} className={`path-card ${card.tone}`} key={card.title} onClick={() => trackEvent("entry_card_select", { path: card.href })}><span className="path-icon"><Icon name={card.icon} /></span><span className="card-eyebrow">{card.eyebrow}</span><h3>{card.title}</h3><p>{card.description}</p><span className="card-link">{card.cta} <ArrowRight size={16} /></span></Link>)}</div>
      </div>
    </section>

    <section className="section-pad journey-section">
      <div className="shell journey-shell"><div className="journey-intro"><span className="kicker light">My Move Timeline</span><h2>One clear next step at a time.</h2><p>MoveIn organizes the transition into eight manageable stages. Check off tasks, return later, and see what matters now.</p><Link className="button button-light" href="/timeline" onClick={() => trackEvent("timeline_start", { source: "homepage_timeline" })}>Open my timeline <ArrowRight size={17} /></Link></div>
        <div className="journey-list">{timelineStages.map((stage, index) => <Link className="journey-item" href={`/timeline/${stage.slug}`} key={stage.slug}><div className="journey-number">{String(index + 1).padStart(2, "0")}</div><div><span>{stage.shortLabel}</span><h3>{stage.label}</h3><p>{stage.intro}</p></div><ArrowRight size={18} /></Link>)}</div>
      </div>
    </section>

    <section className="section-pad florida-preview">
      <div className="shell florida-callout"><div><span className="eyebrow"><MapPin size={15} /> Regional guide 01</span><h2>Welcome Home, Florida.</h2><p>Everything you need to settle in, get organized, and feel at home.</p><Link className="button" href="/florida" onClick={() => trackEvent("florida_guide_visit", { source: "homepage" })}>Explore the Florida Guide <ArrowRight size={17} /></Link></div><div className="florida-compass"><Compass size={64} strokeWidth={1.2} /><span>Utilities</span><span>Storms</span><span>Vehicles</span><span>Homestead</span></div></div>
    </section>

    <section className="newsletter-section"><div className="shell newsletter-card"><div className="newsletter-copy"><span className="kicker light">Useful reminders, not marketing clutter</span><h2>Know what to do next.</h2><p>Get practical reminders based on where you are in your move, from the first week through the first year.</p></div><NewsletterForm /></div></section>
  </main>;
}
