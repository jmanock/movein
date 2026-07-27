# Provider data verification policy

## Acceptable evidence

Use official provider websites, utility territory maps, municipal/county pages, Florida agency pages, and federal resources. Search-engine snippets can help locate a page but are not the stored evidence. Do not use unsourced directories, reviews, social posts, or memory as final proof.

## Record rules

- Provider name and official URL must match the source.
- Every active provider must have at least one source and retrieval date.
- Phone fields must use `(###) ###-####` and be attached to a specific contact type.
- A verified provider means the record and source were checked; it does not mean every address in the ZIP receives service.
- Coverage notes must state why address confirmation is needed.
- Missing categories remain empty. No generic fallback provider is generated.

## ZIP states

- `verified`: multiple useful records were reviewed; the page may still use possible/address-required coverage labels.
- `partial`: some reviewed records exist, but material categories remain incomplete.
- `pending`: the locality is known but provider research is not ready.

Only substantial verified pages explicitly approved with `is_indexable=1` enter the sitemap.

## Review cadence

Run `npm run data:stale` at least monthly. The default flags records older than 180 days. High-impact outage and emergency numbers should be checked more often. Run `npm run data:validate` before every import and `npm run data:coverage` after it.

## Corrections

Correction reports should identify the ZIP, record, problem type, and preferably an official source. Reproduce the issue, verify it independently, update the CSV, run all data checks, import to a non-production database, review the result page, then ship through the normal migration/seed release.
