# Domain canonicalization

Last verified: August 10, 2026

The only canonical origin is `https://movein.guide`. Application metadata, Open Graph URLs, JSON-LD, breadcrumbs, robots, and sitemap entries already use that origin. The application proxy now provides a defensive permanent redirect from a `www.movein.guide` Host header while preserving the path and query string.

## Production finding

The live origin currently behaves as follows:

- `http://movein.guide/...` → one 301 to `https://movein.guide/...` — correct.
- `http://www.movein.guide/...` → one 301 to `https://www.movein.guide/...` — incomplete.
- `https://www.movein.guide/...` → 200 — duplicate host risk.

The Nginx redirect should be the primary fix so duplicate-host requests never reach Next.js. Do not create a redirect chain through HTTPS `www`.

## Recommended Nginx configuration

Use the production certificate paths already installed on the server. `$request_uri` preserves both the path and query string.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name movein.guide www.movein.guide;
    return 301 https://movein.guide$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.movein.guide;

    ssl_certificate /etc/letsencrypt/live/movein.guide/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/movein.guide/privkey.pem;

    return 301 https://movein.guide$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name movein.guide;

    ssl_certificate /etc/letsencrypt/live/movein.guide/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/movein.guide/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3006;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Validate with `sudo nginx -t` before reloading. Then verify all three alternate origins return one permanent redirect directly to the non-www HTTPS URL.
