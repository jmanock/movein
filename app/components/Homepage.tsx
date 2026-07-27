"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Compass, MapPin } from "lucide-react";
import { entryCards, helpTopics } from "../data/site";
import { timelineStages } from "../data/timeline";
import { trackEvent } from "../lib/analytics";
import { Icon } from "./Icon";
import { NewsletterForm } from "./NewsletterForm";

export function Homepage() {
  return <main id="main-content">
    <section className="hero section-pad">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <h1><span>You have the keys.</span><br /><em>Now what?</em></h1>
          <p className="hero-lede">MoveIn helps homeowners and renters figure out what to do next, from the first day through the first year.</p>
          <div className="hero-actions"><Link className="button" href="/timeline" onClick={() => trackEvent("homepage_cta_click", { cta: "timeline" })}>Start My Move Timeline <ArrowRight size={17} aria-hidden="true" /></Link><Link className="text-link" href="/florida" onClick={() => trackEvent("homepage_cta_click", { cta: "florida" })}>Explore the Florida Guide <ArrowRight size={17} aria-hidden="true" /></Link></div>
          <div className="trust-row"><span><Check size={16} /> No account required</span><span><Check size={16} /> Progress saves on your device</span></div>
        </div>
        <figure className="hero-art">
          <Image className="hero-art-image" src="/images/homepage/movein-branded-hero.webp" alt="MoveIn — Everything after the keys, with a moving box, house key, and path toward home" width={1200} height={630} quality={88} preload fetchPriority="high" sizes="(max-width: 700px) calc(100vw - 28px), (max-width: 1080px) calc(100vw - 40px), 700px" />
        </figure>
      </div>
    </section>

    <section className="section-pad start-section">
      <div className="shell"><div className="section-heading"><div><span className="kicker">Choose your starting point</span><h2>What best describes your move?</h2></div><p>Start where you are. Every path leads to practical, pressure-free guidance.</p></div>
        <div className="path-grid">{entryCards.map((card) => <Link href={card.href} className={`path-card ${card.tone}`} key={card.title} onClick={() => trackEvent("entry_card_select", { path: card.href })}><span className="path-icon"><Icon name={card.icon} size={27} /></span><span className="card-eyebrow">{card.eyebrow}</span><h3>{card.title}</h3><p>{card.description}</p><span className="card-link">{card.cta} <ArrowRight size={17} aria-hidden="true" /></span></Link>)}</div>
      </div>
    </section>

    <section className="section-pad help-section">
      <div className="shell"><div className="section-heading"><div><span className="kicker">What MoveIn helps with</span><h2>A clearer way to learn your new place.</h2></div><p>Start with the task in front of you, then keep the records and routines that make the next one easier.</p></div><div className="help-grid">{helpTopics.map((topic) => <article className="help-card" key={topic.title}><span><Icon name={topic.icon} size={24} /></span><h3>{topic.title}</h3><p>{topic.description}</p></article>)}</div></div>
    </section>

    <section className="section-pad journey-section">
      <div className="shell journey-shell"><div className="journey-intro"><span className="kicker light">My Move Timeline</span><h2>One clear next step at a time.</h2><p>MoveIn organizes the transition into eight manageable stages. Check off tasks, return later, and see what matters now.</p><Link className="button button-light" href="/timeline" onClick={() => trackEvent("timeline_start", { source: "homepage_timeline" })}>Open my timeline <ArrowRight size={17} aria-hidden="true" /></Link></div>
        <div className="journey-list">{timelineStages.map((stage, index) => <Link className="journey-item" href={`/timeline/${stage.slug}`} key={stage.slug}><div className="journey-number">{String(index + 1).padStart(2, "0")}</div><div><span>{stage.shortLabel}</span><h3>{stage.label}</h3><p>{stage.intro}</p></div><ArrowRight size={18} /></Link>)}</div>
      </div>
    </section>

    <section className="section-pad florida-preview">
      <div className="shell florida-callout"><div><span className="eyebrow"><MapPin size={15} aria-hidden="true" /> Regional guide 01</span><h2>Welcome Home, Florida.</h2><p>Everything you need to settle in, get organized, and feel at home.</p><Link className="button" href="/florida" onClick={() => trackEvent("florida_guide_visit", { source: "homepage" })}>Explore the Florida Guide <ArrowRight size={17} aria-hidden="true" /></Link></div><div className="florida-compass"><Compass size={64} strokeWidth={1.2} aria-hidden="true" /><span>Utilities</span><span>Storms</span><span>Vehicles</span><span>Homestead</span></div></div>
    </section>

    <section className="newsletter-section"><div className="shell newsletter-card"><div className="newsletter-copy"><span className="kicker light">Useful reminders, not marketing clutter</span><h2>Know what to do next.</h2><p>Get practical reminders based on where you are in your move, from the first week through the first year.</p></div><NewsletterForm /></div></section>
  </main>;
}
