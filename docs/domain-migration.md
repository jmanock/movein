# Domain migration: movein.guide

## Goal

Make `https://movein.guide` the canonical public origin for MoveIn while preserving the existing Welcome Home Florida deployment as a regional-content source and redirect origin where supported.

## DNS and hosting checklist

1. Add `movein.guide` as a custom domain in the Sites hosting settings for the existing MoveIn project.
2. Use only the DNS records supplied by the hosting platform. A typical setup uses an apex `A`, `AAAA`, `ALIAS`, or `CNAME` flattening record and may use a `CNAME` for `www`, but the exact records must come from Sites.
3. Remove conflicting apex and `www` records only after the required Sites records are confirmed.
4. Confirm the platform has issued and attached a valid TLS certificate for both the apex and any supported `www` host. Expect HTTPS to be mandatory.
5. Decide whether `www.movein.guide` redirects permanently to `movein.guide` or is not used. Keep one canonical host.
6. Verify `/`, `/timeline`, `/florida`, `/sitemap.xml`, `/robots.txt`, and the newsletter endpoint on the custom domain.

Do not make unsupported DNS changes from this repository.

## Canonical and discovery updates

- The application already emits canonicals, Open Graph URLs, sitemap URLs, robots host, and structured data for `https://movein.guide`.
- Add and verify both the old deployment property and `movein.guide` in Google Search Console and any other webmaster tools in use.
- Submit `https://movein.guide/sitemap.xml` after the domain is serving the production release.
- Use Search Console's change-of-address workflow only if the prior deployment is a domain property that the tool supports.
- Update analytics property settings, referral exclusions, campaign builders, QR targets, and email templates to the new origin.

## Redirect plan

The prior site was a single-page experience with section anchors rather than established content routes. Recommended redirects:

| Old URL or concept | New URL | Status | Notes |
|---|---|---:|---|
| Old homepage | `/` | 301 | MoveIn national homepage |
| `/#journey` | `/timeline` | 301 where fragment-free server mapping is possible | URL fragments never reach the server; update links at their source |
| `/#homeowners` | `/homeowners` | Same limitation | Update campaigns and referring pages |
| `/#renters` | `/renters` | Same limitation | Update campaigns and referring pages |
| `/#florida` | `/florida` | Same limitation | Florida content retained under MoveIn |
| `/#resources` | `/resources` | Same limitation | Update links at their source |
| Old production origin, any unmatched path | Equivalent MoveIn path or `/` | 301 after mapping | Avoid blanket redirects when a meaningful equivalent exists |

Keep the old origin available long enough to validate redirects. Do not redirect the old origin until the custom domain is stable.

## Redirect testing

- Test exact status codes without a browser cache.
- Confirm each redirect resolves in one hop to HTTPS on `movein.guide`.
- Confirm query parameters such as `utm_source`, `utm_campaign`, and `campaign` survive.
- Check for redirect loops, mixed-content warnings, and old-domain canonicals.
- Crawl the most important routes after launch and review 404 logs.

## Rollback

Keep the last known-good Sites version and the prior domain mapping until the custom domain, certificate, D1 binding, signup flow, and critical redirects are confirmed. If launch fails, restore the prior saved version and domain mapping first; do not change DNS repeatedly while certificate issuance is in progress.
