# Domain migration: movein.guide

## DNS target

Point `movein.guide` at the DigitalOcean Droplet with the records appropriate to the DNS provider:

- Apex `A` record → Droplet public IPv4 address
- Apex `AAAA` record → Droplet public IPv6 address, only when IPv6 is configured
- `www` `CNAME` → `movein.guide`

Remove conflicting records only after recording the previous values for rollback. DNS is managed outside this repository.

## HTTPS and canonical setup

- Nginx terminates TLS and proxies to `127.0.0.1:3006`.
- Issue certificates for `movein.guide` and `www.movein.guide` with Certbot or another ACME client.
- Redirect HTTP to HTTPS and choose `https://movein.guide` as the single canonical host.
- The application already emits canonical, Open Graph, sitemap, robots, and structured-data URLs for `https://movein.guide`.
- Add the domain to Search Console and submit `https://movein.guide/sitemap.xml` after launch.

## Redirect plan

| Old URL or concept | New URL | Status | Notes |
|---|---|---:|---|
| Old homepage | `/` | 301 | MoveIn national homepage |
| `/#journey` | `/timeline` | Update source links | Fragments do not reach Nginx or Node |
| `/#homeowners` | `/homeowners` | Update source links | Replace campaign links |
| `/#renters` | `/renters` | Update source links | Replace campaign links |
| `/#florida` | `/florida` | Update source links | Florida content is retained |
| `/#resources` | `/resources` | Update source links | Replace campaign links |
| Old production host, known path | Equivalent MoveIn path | 301 | Avoid redirect chains |

## Launch verification

- Confirm redirects resolve in one hop to HTTPS.
- Confirm query parameters such as `utm_source`, `utm_campaign`, and `campaign` survive.
- Verify the homepage, newsletter API, timeline, Florida guide, sitemap, robots file, social preview, and canonical tags.
- Review Nginx access/error logs and `pm2 logs movein`.

## Rollback

Restore the previous DNS values if the Droplet or TLS configuration fails. Keep the previous application revision available until the domain, certificate, database writes, and critical routes are stable.
