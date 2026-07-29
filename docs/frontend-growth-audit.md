# Front-end growth audit

Date: July 29, 2026. Baseline commit: `e1159a9`. Scope: public Next.js interface, representative desktop/mobile routes, ZIP states, content architecture, trust signals, and organic-search journeys.

## Findings before the rebuild

- The homepage was calm and technically sound, but sparse: five sections, four in-content links, six identical service cards, and repeated rounded-card treatments.
- Hub pages shared nearly identical hero, lookup, grid, and guide patterns. Homeowner and renter intent did not feel sufficiently distinct.
- Provider results were accurate but dense. Primary, phone, outage, and source actions competed in a single card flow.
- Unknown ZIPs ended at a generic 404. That protected index quality but failed a user who had entered a valid, currently unsupported ZIP.
- Mobile full-page inspection at 320px exposed large blank capture regions around the sticky header. The rebuilt layout removes reliance on the old background composition and was rechecked at 320px.
- The four high-level paths needed unmistakable icons; empty icon containers are a defect, not a visual style.
- Coverage was described in copy but had no public, database-derived coverage page.
- Resources lacked a printable, task-oriented layer. High-intent setup, deposit, HOA, and water-jurisdiction content had gaps.
- Analytics did not distinguish form placement, provider category, phone, source, coverage, or print actions.

## Decisions

The rebuild uses an editorial hierarchy: a two-part hero, service ribbon, three-step process line, four explicit pathways, numbered resource list, dark coverage statement, and closing lookup. Coverage remains limited to quality-gated database records. Valid unsupported ZIP routes are useful and `noindex`; invalid ZIP-like routes remain 404s. No account, email capture, paid ranking, or new infrastructure was added.

## Manual review items

- Confirm the five-county statement after each data expansion.
- Review social-card text rendering whenever the image is replaced.
- Inspect a municipal, cooperative, and multi-provider ZIP after every database import.
- Verify print output in Chrome and Safari after typography changes.
- Do not publish campaign or location-template copies without unique evidence and an indexing decision.
