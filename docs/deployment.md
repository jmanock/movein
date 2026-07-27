# DigitalOcean deployment

This application runs as a standard Next.js Node server behind Nginx.

## Server prerequisites

- Ubuntu DigitalOcean Droplet
- Node.js 22.13 or newer
- Git, Nginx, PM2, and build tools for native Node packages
- Repository: `https://github.com/jmanock/movein.git`
- Application port: `3006`
- Domain: `movein.guide`

Install the usual Ubuntu prerequisites as a sudo-capable administrator:

```bash
sudo apt update
sudo apt install -y git nginx build-essential python3
sudo npm install -g pm2
```

Install Node 22 using the team's normal supported method and confirm `node --version` reports at least `v22.13.0`.

## First release

Example application path:

```bash
sudo mkdir -p /var/www/movein /var/lib/movein
sudo chown -R "$USER":"$USER" /var/www/movein /var/lib/movein
git clone https://github.com/jmanock/movein.git /var/www/movein
cd /var/www/movein
npm ci
npm run lint
npm test
npm run build
```

The PM2 application user must have read/write access to `/var/lib/movein`. Start the checked-in process definition:

```bash
cd /var/www/movein
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Run the final command printed by `pm2 startup` so the process returns after a reboot.

The equivalent direct smoke-test command is:

```bash
PORT=3006 DATABASE_PATH=/var/lib/movein/movein.sqlite npm run start
```

## Nginx reverse proxy

Create `/etc/nginx/sites-available/movein.guide`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name movein.guide www.movein.guide;

    client_max_body_size 2m;

    location / {
        proxy_pass http://127.0.0.1:3006;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
    }
}
```

Enable and validate it:

```bash
sudo ln -s /etc/nginx/sites-available/movein.guide /etc/nginx/sites-enabled/movein.guide
sudo nginx -t
sudo systemctl reload nginx
```

After DNS points to the Droplet, use Certbot or the team's normal ACME client to issue a certificate and redirect HTTP to HTTPS. Keep the upstream on loopback; only Nginx should be internet-facing.

## Updates

```bash
cd /var/www/movein
git pull --ff-only origin main
source ~/.bashrc
nvm use 22
npm ci
npm run lint
npm test
npm run build
pm2 restart movein --update-env
pm2 save
BASE_URL=http://127.0.0.1:3006 npm run check:links
```

Verify:

```bash
curl -I http://127.0.0.1:3006/
curl -I https://movein.guide/
curl -I https://movein.guide/timeline
curl -I https://movein.guide/florida
curl -I https://movein.guide/robots.txt
curl -I https://movein.guide/sitemap.xml
pm2 logs movein --lines 100
```

## SQLite operations

- Production path: `/var/lib/movein/movein.sqlite`
- The application creates the directory and schema when permissions allow.
- Back up the database file and its `-wal`/`-shm` companions together, or use SQLite's online backup tooling.
- Do not run multiple PM2 instances against a single local SQLite database. The checked-in configuration uses one forked instance.
- If horizontal scaling is later required, migrate the small `db/index.ts` adapter to managed PostgreSQL before adding application instances.

## Runtime configuration

- `PORT=3006` — supplied by PM2; required for the specified deployment
- PM2 passes `-H 127.0.0.1` to `next start`, keeping the application on the Nginx loopback upstream
- `NODE_ENV=production` — supplied by PM2
- `DATABASE_PATH=/var/lib/movein/movein.sqlite` — recommended persistent production path; when set, this must be absolute

No third-party email or analytics credentials are currently required.

## Rollback

Check out the previous known-good commit, run `npm ci && npm run build`, then `pm2 reload movein --update-env`. Do not delete or replace the SQLite database during an application rollback.
