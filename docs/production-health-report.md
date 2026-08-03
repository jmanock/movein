# MoveIn production health report

Generated: 2026-08-03T11:41:27.013Z

## Overall status

**Healthy for the five-county pilot.**

## ZIP coverage

- Active ZIP records: 50
- Verified and indexable ZIPs: 25
- Pending and noindex ZIPs: 25
- Counties covered: 5
- Missing core provider categories on verified ZIPs: 0
- Missing core provider items across pending ZIPs: 100

## Provider counts

| Category | Providers or official tools | ZIP records |
| --- | ---: | ---: |
| Electricity | 8 | 25 |
| Water | 11 | 25 |
| Sewer | 11 | 25 |
| Internet | 5 | 50 |
| Trash & recycling | 12 | 25 |
| Local information | 5 | 50 |

## Missing provider information

No core-category gaps remain on the 25 verified ZIP pages. Pending ZIP gaps stay in the research queue and do not affect indexing.

## Official links

- URLs in latest link report: 66
- Confirmed broken links: 0
- Network-uncertain links: 0
- No confirmed 404/410 or server-error links in the latest report.

## Search and analytics health

- Sitemap quality gate: PASS
- Robots sitemap declaration: PASS
- GA4 root installation and manual page-view control: PASS
- GA4 runtime status: enabled in production only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is present
- Privacy: typed events omit routine lookup ZIPs and submitted form content; a ZIP is sent only when a visitor explicitly requests unsupported coverage

## Automated checks

| Check | Result |
| --- | --- |
| Provider data validation | PASS |
| Lookup and homepage tests | PASS |
| SEO audit | PASS |
| Front-end audit | PASS |
| Production build | PASS |

The test suite covers lookup behavior, provider actions, homepage lookup states, SEO safeguards, analytics duplication controls, and pending-page noindex behavior. The front-end audit uses static checks unless a production server is available through `FRONTEND_AUDIT_URL`.
