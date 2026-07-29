# Content architecture

- `/` — primary ZIP lookup and service explanation
- `/homeowners` — homeowner hub
  - utility setup, outages, water-shutoff guides
- `/renters` — renter hub
  - setup, responsibility, and installation guides
- `/learn-your-area` — service categories and ZIP lookup education
- `/resources` — provider-finding, setup, address, printable, and official-tool library
  - `/resources/printables/[slug]` — substantive HTML checklists with print CSS
- `/coverage` — database-derived county and quality-gated ZIP directory
- `/lookup/[zip]` — database-backed results; supported pages are indexable only through the quality gate, while valid unsupported ZIPs provide a `noindex` fallback
- `/faq` — sitewide visible questions and matching FAQ schema
- `/about`, `/data-sources`, `/editorial-policy`, policies, corrections — trust and governance
- `/site-map` and `/sitemap.xml` — human and crawler discovery

Guide content lives in `app/data/guides.ts`; printable content lives in `app/data/printables.ts`; the indexable static-page manifest lives in `app/data/pages.ts`. This keeps metadata, sitemap entries, related links, and review dates auditable without adding a CMS or account system.
