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

Migration `003_service_actions_jurisdictions_and_review_workflow.sql` is additive. It adds provider action URLs, hours and type, service availability and jurisdiction notes, ZIP confidence and jurisdiction records, and the five-state correction review workflow. It does not drop or rewrite existing records.

Migration `004_pilot_completion_fields.sql` is additive. It adds USPS mailing-city and incorporated/unincorporated context, outage-map and collection-information actions, and the expanded correction issue taxonomy. Existing legacy correction types remain intact.

Migration `007_receipts_and_inventory.sql` adds structured `receipts`, `receipt_items`, and `inventory_items` with linked provenance. It stores no raw documents. See [receipts.md](receipts.md) for money conventions, relationships, and the processing boundary.

Migration `008_receipt_save_requests.sql` adds nullable receipt save-request IDs/fingerprints and a unique request index for transactional, retry-safe reviewed saves. No provider data changes. Receipt APIs remain local-development-only.

## Commands

```bash
npm run db:generate   # reports checked-in SQL migration sources
npm run db:migrate    # applies unapplied SQL migrations transactionally
npm run db:seed       # idempotently imports reviewed Florida CSV files
npm run data:validate
npm run data:duplicates
npm run data:import -- --dry-run
npm run data:import -- --confirm-verified
npm run data:coverage
npm run data:stale
```

Migrations are never run automatically during `next start`. A release operator controls the change.

## Backup and rollback

Before migration, create an online backup outside the release directory: `sqlite3 /var/lib/movein/movein.sqlite ".backup '/var/backups/movein/movein-before-004.sqlite'"`. Verify the backup exists before continuing.

Application rollback requires schema compatibility review before checking out an earlier commit. Migration 010 requires household ownership on new receipt inserts, so receipt-writing code from Tasks 1–5 must not run against schema 010. Stop writes and restore the verified pre-migration database backup together with the matching application release when rolling back ownership. A schema rollback should restore the verified pre-migration database backup; do not hand-edit production tables.

## Seed scope

The checked-in seed is a reviewed 12-ZIP pilot. It is not a complete county or statewide dataset. The import uses upserts and does not delete records absent from CSV. Identical repeated imports are safe; changed verified rows require `--confirm-verified` after review.

## Receipt intelligence (Task 4)

Migration 009 adds checked receipt_type and item_role fields, defaulting historical rows to unknown/other. Date evidence and model uncertainty remain transient. Apply explicitly after a verified backup; the local development database was backed up to ignored outputs/movein-before-intelligence.sqlite before applying 009. No production database was changed. The receipt evaluator does not import or write SQLite.

## Household ownership (Task 6)

Migration 010 adds households and receipts.household_id with FK/index protection, backfills all existing receipts to the documented local/legacy household, replaces the global save-request index with a household-specific unique index, and prevents receipt/item/inventory provenance reassignment. Inventory and receipt items inherit household ownership from their receipt root. Required ownership is enforced with insert/update triggers because SQLite cannot add a required FK column to an existing nonempty table without a rebuild or non-null default. No private records are deleted or copied.

Apply only through the existing migration runner after backup. No automatic production migration occurs. See [household-ownership.md](household-ownership.md) for the exact operator steps, verification queries, authentication boundary, and rollback constraints.

## Authentication migration 011

Additive migration 011 installs Better Auth 1.7.7 SQLite tables (`auth_user`, `auth_session`, `auth_account`, `auth_verification`, `auth_rate_limit`) plus `household_memberships`. Its schema was compiled with the installed library against an empty SQLite database, reviewed, and checked into the existing SQL runner. No automatic library migrations run at startup. See [authentication](authentication.md). Receipt migrations and historical ownership are unchanged.

## Production safety (Task 8)

Production requires an explicit absolute `DATABASE_PATH`; app startup requires an existing database. Use the manual migration, permissions and rollback sequence in [production-launch-checklist.md](production-launch-checklist.md). `npm run db:backup -- /absolute/new/backup.sqlite` takes an integrity-checked online SQLite backup and refuses to overwrite a file. Do not copy only the live main file while WAL writes are active. The launch checklist defines retention, off-host copies and isolated restore tests.
