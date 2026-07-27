# Database and migrations

## Technology and location

MoveIn uses SQLite through `better-sqlite3`. The default development database is `data/movein.sqlite`. Production should set the absolute path `DATABASE_PATH=/var/lib/movein/movein.sqlite` and run one PM2 instance.

## Schema

Migration `db/migrations/001_zip_utility_lookup.sql` adds:

- `states`, `counties`, `cities`, and `zip_codes`
- `provider_categories` and `providers`
- `service_areas` with explicit coverage type and confidence
- normalized `provider_contacts`
- `data_sources` and append-only `verification_records`
- lookup, category, state, service-area, active-status, and verification-date indexes

Coverage types are `primary`, `possible`, `address_required`, `varies`, and `unverified`. ZIP statuses are `verified`, `partial`, and `pending`. `is_indexable` is separate from status so editorial value can be controlled explicitly.

## Commands

```bash
npm run db:generate   # reports checked-in SQL migration sources
npm run db:migrate    # applies unapplied SQL migrations transactionally
npm run db:seed       # idempotently imports reviewed Florida CSV files
npm run data:validate
npm run data:coverage
npm run data:stale
```

Migrations are never run automatically during `next start`. A release operator controls the change.

## Backup and rollback

Before migration, use SQLite's online backup command while PM2 is stopped or copy the database together with its `-wal` and `-shm` files after a clean shutdown. Keep the timestamped backup outside the release directory.

Application rollback: check out the previous commit, rebuild, and restart PM2. Schema migration 001 is additive and the older app ignores its new tables. It deliberately does not drop the historical newsletter table. A schema rollback should restore the pre-migration database backup; do not hand-edit production tables.

## Seed scope

The checked-in seed is a small reviewed production pilot: five ZIPs and official provider/government starting points in Seminole, Orange, Volusia, Lake, and Osceola counties. It is not a complete county or statewide dataset. The import uses upserts and does not delete records absent from CSV.
