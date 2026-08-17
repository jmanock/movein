# Search Console opportunities

Manual planning snapshot: August 10, 2026

This is a user-supplied early Search Console snapshot, not an automated export. The application does not scrape Search Console, and these small numbers are prioritization signals rather than proof of ranking or conversion changes.

## Baseline

- 181 impressions
- 0 clicks
- 0% click-through rate
- Average position 40.2
- Approximately 63 queries

| Page | Impressions |
| --- | ---: |
| `/resources/find-internet-providers` | 57 |
| `/renters/renters-insurance-and-deposits` | 18 |
| `/lookup/32720` | 13 |
| `/lookup/32757` | 10 |
| `/resources/when-to-transfer-utilities` | 10 |
| `/resources/printables/address-update-checklist` | 8 |
| `/lookup/34748` | 8 |
| `/lookup/32801` | 7 |
| `/lookup/32746` | 5 |

## Decisions from this sprint

1. Keep `/resources/find-internet-providers` as the primary address-level provider guide and add only one distinct supporting intent: `/resources/fiber-internet-availability`. Do not publish a competing `find-isp-by-address` copy.
2. Strengthen electric-company, transfer-timing, renter-insurance, apartment-internet, and renter-cost pages with direct answers, task-specific FAQs, and descriptive links.
3. Treat free, ungated printables as the first experiment beyond articles and ZIP pages: utility setup, renter move-in, emergency numbers, and new-home contacts. Keep the address-update and new-home checklists useful and distinct. Do not monetize or require email at this stage.
4. Add indexable ZIP pages only after official-source review and the shared coverage gate. Eustis ZIP 32726 was the one new reviewed Lake County addition; the other research-stage ZIPs remain noindex.
5. Consolidate `www` and aliases instead of generating campaign, city, county-template, or location copies.

## Leading indicator to watch

The clearest wedge is `/resources/find-internet-providers`. At the next review, first check whether it moves from 57 to 100+ impressions and whether average position improves. That result would support deeper investment in the internet cluster. It would not, by itself, prove clicks or conversions.

The address-update printable's eight impressions justify testing genuinely useful tools. Watch printable impressions, clicks, print actions, and organic links before considering a designed PDF, moving kit, or paid product.

## Weekly comparison log

Append a row each week; retain prior observations.

| Review date | Date range | Impressions | Clicks | CTR | Avg. position | Internet-guide impressions | Address-printable impressions | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 2026-08-10 | User-supplied baseline | 181 | 0 | 0% | 40.2 | 57 | 8 | Pre-release baseline |

Also compare query growth for address-level internet, fiber, transfer timing, renter costs, electric-company lookup, exact ZIPs, county hubs, and printable terms. Do not claim ranking improvement without a comparable Search Console date range.

## August 17, 2026 change-of-address sprint

This is a second user-supplied Search Console snapshot, not an automated export. It shows approximately 261 query variations. The standout signal is `/resources/change-your-address`, which reached 181 impressions and became the primary content opportunity for this sprint.

| Page | Impressions | Clicks |
| --- | ---: | ---: |
| `/resources/change-your-address` | 181 | Not supplied |
| `/resources/find-internet-providers` | 59 | Not supplied |
| `/resources/check-internet-availability` | 49 | Not supplied |
| `/resources/transfer-internet-when-moving` | 44 | Not supplied |
| `/internet/providers/verizon` | 23 | Not supplied |
| `/renters/renters-insurance-and-deposits` | 18 | Not supplied |
| `/resources/set-up-utilities` | 17 | Not supplied |
| `/resources/when-to-transfer-utilities` | 16 | Not supplied |
| `/lookup/32720` | 14 | Not supplied |
| `/lookup/32757` | 11 | 1 |

Visible themes include change of address, renters-insurance moving expenses, electric provider by ZIP, Internet provider/address lookup, ISP by address, moving Comcast Internet, checking address availability, and the ambiguous phrase “HSI eligibility.” Decisions:

1. Keep `/resources/change-your-address` as the sole canonical page for the core intent. Redirect `/change-of-address` to it and do not create overlapping USPS, bank, insurance, “who to notify,” or “after moving” articles until distinct landing-page/query evidence appears.
2. Connect the flagship guide to one interactive browser-only progress experience, the existing printable checklist, a distinct new-address information sheet, My Move, and an organized `/resources/moving-admin` task hub.
3. Preserve the Internet cluster. Treat Comcast and Xfinity as one provider identity in moving guidance, and strengthen contextual links without creating duplicate provider pages.
4. Continue using `/resources/find-electric-company` for electric-provider-by-ZIP intent rather than publishing a competing page.
5. Use `/lookup/32757` as an early clicked-page QA benchmark while keeping all ZIP claims address-qualified.

### HSI eligibility investigation

The supplied snapshot did not include a landing-page association for “HSI eligibility,” so it cannot be attributed to a MoveIn page from the available evidence. Current official search results predominantly use HSI for the U.S. Department of Education’s Hispanic-Serving Institution eligibility context. Searches of official Verizon, Xfinity, AT&T, and Spectrum domains did not establish “HSI eligibility” as current consumer home-Internet terminology. A weak historical nonofficial usage can mean “high-speed Internet eligibility,” but that is not enough to alter content or create an acronym-targeted page.

Decision: do not target or define HSI on MoveIn now. If a future Search Console export associates sustained HSI impressions with an Internet landing page, inspect the exact query/page pairs and provider context before changing copy.

### Next comparison

Evaluate the flagship change-address page’s impressions, clicks, click-through rate, and average position; address-checklist impressions and print actions; the moving-admin hub’s discovery; Internet address-lookup and transfer themes; the electric-provider-by-ZIP theme; and `/lookup/32757` clicks. Analytics was not available for this planning decision, so no behavior or conversion conclusion is claimed.
