# MoveIn household ownership and authentication boundary

**Historical Task 6 checkpoint, October 3, 2026.** Current Task 7 authentication behavior is documented in [authentication setup](authentication.md) and [Task 7 checkpoint](task-7-checkpoint.md); the original Task 6 sections below describe the previous resolver and availability.

Task 6, October 3, 2026. This is ownership preparation, not production authentication. No auth service, session cookies, passwords, invitations, email ingestion, or private production deployment were added.

## Public and private surfaces

Public: homepage, ZIP/provider lookup, Internet comparisons, homeowner/renter hubs, guides, resources, policies, and coverage content. My Move remains a browser-local checklist and is outside server-side household ownership.

Private: `/receipts`, `/my-home`, `/api/receipts/process`, `/api/receipts/save`, and `/api/my-home` (inventory and receipt history). Processing requires household context even though it does not persist purchases. Every API checks identity before reading the request body, querying private records, or calling receipt processing. Private responses use `Cache-Control: no-store`. Private pages are dynamic and noindex; private pages and the noindex `/private-access` notice are absent from the XML sitemap and disallowed in robots.txt. Public links to the private features remain functional.

Production pages redirect to `/private-access`; normal document requests return HTTP 307. Next streamed RSC navigation uses its encoded redirect instruction (the transport may return 200) with private/no-store caching and no private page content. APIs return HTTP 401 with an error only. The notice explains availability without pretending login exists. Protection is in page/API code and the repository, not dependent on Next proxy interception. Forwarded identity headers and forged cookies cannot activate private access.

## Minimal household model and ownership

Migration `010_household_ownership.sql` creates `households(id, display_name, created_at, updated_at)`. IDs use the existing UUID string convention. It adds `receipts.household_id` referencing households with restricted deletion, indexes household/date queries, and changes save-request uniqueness to `(household_id, save_request_id)`.

Receipt is the private aggregate root. Receipt items inherit its household through `receipt_id`. Inventory inherits the same owner through `source_receipt_id`; the existing composite foreign key `(source_receipt_id, source_receipt_item_id)` proves the source item belongs to that receipt. There is no second independent inventory owner to get out of sync. Household ownership on receipt inserts is required by a trigger; ownership changes are prohibited. Receipt-item and inventory provenance changes are prohibited. SQLite foreign keys are enabled by the existing connections.

SQLite cannot add a NOT NULL foreign-key column to populated tables without rebuilding or a non-null default. The additive column is nullable at the column-definition level, with equivalent required-ownership insert and immutable-ownership update triggers. This avoids destructive table replacement and prevents later ownership-free receipt inserts. The global retry index is replaced, not retained, so coincident request IDs cannot leak or collide across households.

`createReceiptRepository(database, householdId)` requires a nonempty existing household ID at compile time and runtime. Every read and mutation is bound to that household; no unscoped factory or list API exists. `get` checks receipt ownership before loading lines; candidates and promotion use that scoped get. Inventory/history query only receipt roots owned by the instance. Retry lookup and reviewed-save update both include household ID. New saves generate receipt/item IDs server-side. The save endpoint rejects browser-supplied household/record/provenance IDs; the body supports only receipt purchase facts, selections, and a retry request ID.

## Legacy records and development

Migration 010 backfills every pre-ownership receipt to:

- ID: `00000000-0000-4000-8000-000000000001`
- Display name: `Legacy local household`

Receipt/items/inventory IDs, facts, dates, classification, totals, fingerprints, and provenance are preserved. The local development app deliberately resolves this household so existing local records stay available. This identity is not assigned to any future public user. If legacy data exists in a production backup, it remains quarantined in this named household until an operator explicitly establishes lawful ownership. Never automatically make the first signup a member of this household.

`app/lib/households/current.ts` contains the single `getCurrentHousehold` resolver. It resolves the seeded household only when `NODE_ENV` is exactly `development`, the request URL and actual Host are loopback with matching ports, and Origin/Fetch-Site checks pass. Query strings, forms, JSON IDs, cookies, and identity/forwarded headers are ignored. It does not seed missing households on demand; migrations are required. There is no bypass environment variable and no production fallback, even on localhost. Tests use the fixed ID or explicit A/B fixture households.

`requirePageHousehold` in `page-context.ts` adapts Next request headers to the same resolver and redirects absent context. API handlers use the resolver directly. The existing local transport helper is solely a development guard, not authentication.

Development browsers share this one local household. This mode is for a developer's trusted loopback app, not for an Internet-facing development server. It does not claim to authenticate individual local people.

Local migration was applied after an online SQLite backup in `outputs/task6/movein-before-households.sqlite` (private directory, backup mode 0600). The actual local DB had zero receipts, zero lines, and zero inventory items; its preexisting fields and counts matched after migration. Foreign-key check returned no rows, integrity check returned `ok`, and the legacy household was created. A separate nonempty legacy fixture proves receipt/line/inventory facts survive the migration. No production database was migrated.

## Authentication adapter contract for the next task

A production adapter must provide:

1. A validated, expiring, revocable secure session; HttpOnly/Secure cookie handling, session rotation where appropriate, and logout that invalidates the server-side session.
2. Stable user identity from the provider/library, never a request parameter or unverified token claim.
3. Server-side household membership verification against the database on each private request. A household selector is an untrusted hint until membership is checked.
4. A verified household context returned by the central resolver; no provider code in receipt repositories/components.
5. CSRF/same-origin protection for mutations, cache isolation, and controlled access to receipt-processing resource consumption.

The current resolver intentionally returns null in production; no adapter-registration hook or cookie shortcut can enable it. Task 7 must deliberately replace that closed branch with a verified adapter and add membership/session tests before enabling access.

Users and membership tables are deferred until the auth identity schema is chosen. Creating a guessed provider-user schema now would not increase today's security. Receipt ownership already depends only on household IDs, so adding `users` and `household_memberships(user_id, household_id)` later does not rewrite receipt ownership. For the initial single-owner MVP, provision one new household and one membership transactionally per user. Later sharing adds memberships/invitations while repositories keep their current household boundary. No roles or permissions matrix is needed here.

## Future email ownership, export, and deletion

Inbound email is not implemented. A future server-owned unique receipt alias should map to one household using an opaque unguessable identifier, active alias state, authenticated delivery/webhook verification, abuse limits and idempotency. Never resolve ownership from a sender-provided household ID or trust the From header. After resolving the owner, use the same processing pipeline and household-bound repository. Do not retain raw attachments/messages beyond temporary processing without a separate retention decision.

Future exports select receipt roots by verified household and obtain items/inventory only through those roots. Future delete endpoints must require context and include household predicates, returning the same not-found behavior for another household's IDs. Current inventory FK deletion restrictions require an explicit policy for linked inventory before deleting a receipt. Household deletion should run one scoped transaction (inventory, receipt items/receipts, memberships/household) after confirming the chosen retention policy. No export/deletion UI or new deletion endpoints were built.

## Exact production migration procedure — operator only, not executed

Run from the reviewed production release checkout as the application/backup operator with permission to stop PM2 and read `/var/lib/movein/movein.sqlite`. Use a fresh, restricted backup filename; do not overwrite an earlier backup. The migration runner applies every pending checked-in migration, so review `schema_migrations` first. If production has only the public-data schema, pending 007–010 also create the private tables; confirm that expected sequence before running.

```bash
pm2 stop movein
mkdir -p /var/backups/movein
chmod 700 /var/backups/movein
DATABASE_PATH=/var/lib/movein/movein.sqlite TASK6_BACKUP_PATH=/var/backups/movein/movein-before-households-20261003.sqlite node --input-type=module - <<'JS'
import { openDatabase } from './scripts/lib/database.mjs';
import Database from 'better-sqlite3';
import { existsSync, chmodSync } from 'node:fs';
const { database } = openDatabase();
const backup = process.env.TASK6_BACKUP_PATH;
if (existsSync(backup)) throw new Error('Use a fresh backup filename');
if (database.pragma('integrity_check', { simple: true }) !== 'ok') throw new Error('Source integrity check failed');
console.log(database.prepare('SELECT name FROM schema_migrations ORDER BY name').all());
await database.backup(backup);
chmodSync(backup, 0o600);
const verifiedBackup = new Database(backup, { readonly: true });
if (verifiedBackup.pragma('integrity_check', { simple: true }) !== 'ok') throw new Error('Backup integrity check failed');
verifiedBackup.close();
database.close();
JS
# Review the reported migrations and verify the backup before proceeding.
DATABASE_PATH=/var/lib/movein/movein.sqlite npm run db:migrate
DATABASE_PATH=/var/lib/movein/movein.sqlite TASK6_BACKUP_PATH=/var/backups/movein/movein-before-households-20261003.sqlite node --input-type=module - <<'JS'
import Database from 'better-sqlite3';
import assert from 'node:assert/strict';
const before = new Database(process.env.TASK6_BACKUP_PATH, { readonly: true });
const after = new Database(process.env.DATABASE_PATH, { readonly: true });
assert.equal(before.pragma('integrity_check', { simple: true }), 'ok');
assert.equal(after.pragma('integrity_check', { simple: true }), 'ok');
assert.deepEqual(after.pragma('foreign_key_check'), []);
for (const table of ['receipts', 'receipt_items', 'inventory_items']) {
  const existed = before.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(table);
  const oldRows = existed ? before.prepare(`SELECT * FROM ${table} ORDER BY id`).all() : [];
  const newRows = after.prepare(`SELECT * FROM ${table} ORDER BY id`).all().map(row => {
    const value = { ...row }; delete value.household_id; return value;
  });
  assert.deepEqual(newRows, oldRows, `${table} changed unexpectedly`);
  console.log(`${table}: ${newRows.length} records preserved`);
}
assert.equal(after.prepare('SELECT COUNT(*) count FROM receipts WHERE household_id IS NULL OR household_id != ?').get('00000000-0000-4000-8000-000000000001').count, 0);
assert.ok(after.prepare("SELECT 1 FROM schema_migrations WHERE name='010_household_ownership.sql'").get());
before.close(); after.close();
JS
npm run build
pm2 restart ecosystem.config.cjs --only movein --update-env
BASE_URL=http://127.0.0.1:3006 npm run check:links
SEO_BASE_URL=http://127.0.0.1:3006 npm run seo:audit
FRONTEND_AUDIT_URL=http://127.0.0.1:3006 npm run frontend:audit
```

Leave the app stopped if backup/migration/verification fails. `next start` never migrates automatically. No auth secrets are required for this task because production remains closed. Verify both private pages redirect, all three private APIs return 401, and public lookup returns 200 before reopening traffic. The verification asserts all migrated legacy records belong to the reserved household; for an already migrated future multi-household DB, use the existing migration ledger and tenant-aware verification instead of rerunning the legacy-specific assertion.

Rollback requires the matching old app plus the verified pre-010 database backup while writes are stopped. Old receipt-writing code does not provide household ownership and cannot run safely against schema 010. Preserve the failed/current DB and backup together for recovery; do not hand-edit ownership or silently discard post-backup writes.

## Authentication options and Task 7 decision

Recommended starting point for this existing self-hosted Next/SQLite app: evaluate Better Auth with database-backed sessions and a small app-owned single-owner membership model. It supports SQLite, including the project's existing better-sqlite3 connection pattern. This is a recommendation, not a selected or installed dependency. It would require new auth schema/dependencies, a high-entropy secret, a production base URL, secure session configuration, and a chosen login method. Email-based login also needs a mail delivery service/account; OAuth needs application credentials. See [Better Auth installation](https://better-auth.com/docs/installation) and [SQLite adapter](https://better-auth.com/docs/adapters/sqlite).

Managed alternative: Clerk for hosted account/session handling, with MoveIn still owning household membership and receipt authorization in its database. It needs a vendor account, publishable/secret keys, SDK integration and deployment/domain configuration. See [Clerk Next.js quickstart](https://clerk.com/docs/nextjs/getting-started/quickstart). Compare operational cost, data residency and portability before choosing; no current price or compliance claim is made here.

Use an established authentication solution rather than writing password/session cryptography. Next recommends an auth library and central authorization close to the data layer: [Next authentication guide](https://nextjs.org/docs/app/guides/authentication).

The exact decision before Task 7: choose self-hosted Better Auth or a managed provider (such as Clerk), then choose the initial login method (email link, password, or OAuth) and authorize any required account, mail service, or credentials. Start with one owner and a newly provisioned household per account. Legacy local records remain quarantined unless explicitly reviewed for import. Task 7 has not started.

## Task 7 authentication update

The resolver is now asynchronous: Better Auth database session → verified user → stored membership → existing household. Earlier statements about production identity being unavailable describe Task 6; configured production sessions now work. Missing auth/mail configuration still fails closed. Legacy local access additionally requires `AUTH_DEV_HOUSEHOLD=true` and absent auth configuration, so it cannot mask manual authentication tests. New users receive fresh households, never the seeded legacy household. See [authentication setup](authentication.md).
