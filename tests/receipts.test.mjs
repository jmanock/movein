import { DEVELOPMENT_HOUSEHOLD_ID } from '../app/lib/households/constants.ts';
import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import Database from 'better-sqlite3';
import { normalizeReceipt, processReceipt, createMockExtractor } from '../app/lib/receipts/processing.ts';
import { createReceiptRepository } from '../app/lib/receipts/persistence.ts';
import { withTemporaryReceipt } from '../app/lib/receipts/temporary-file.ts';

const fixture = {
  merchant: '  Example Store ', purchaseDate: '2026-10-02', subtotalMinor: 50200,
  taxMinor: 3514, totalMinor: 53714, currency: ' usd ', extractionConfidence: 0.9,
  items: [
    { rawDescription: ' TV 55 ', normalizedName: 'Television', quantity: 1, unitPriceMinor: 49900, totalPriceMinor: 49900, category: 'electronics', isHouseholdAsset: true, assetReason: 'Durable household purchase' },
    { rawDescription: 'MILK', normalizedName: null, quantity: 1, unitPriceMinor: 300, totalPriceMinor: 300, category: 'groceries', isHouseholdAsset: false, assetReason: null },
  ],
};
async function setup() {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  db.exec(await readFile(new URL('../db/migrations/007_receipts_and_inventory.sql', import.meta.url), 'utf8'));
  db.exec(await readFile(new URL('../db/migrations/008_receipt_save_requests.sql', import.meta.url), 'utf8'));
  db.exec(await readFile(new URL('../db/migrations/009_receipt_intelligence.sql', import.meta.url), 'utf8'));
  db.exec(await readFile(new URL('../db/migrations/010_household_ownership.sql', import.meta.url), 'utf8'));
  return db;
}

test('all migrations apply and rerunning the migration runner preserves existing data', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'movein-receipt-test-'));
  const path = join(directory, 'test.sqlite');
  try {
    const run = () => spawnSync(process.execPath, ['scripts/db-migrate.mjs'], { cwd: new URL('..', import.meta.url), env: { ...process.env, DATABASE_PATH: path }, encoding: 'utf8' });
    const first = run();
    assert.equal(first.status, 0, first.stderr);
    const db = new Database(path);
    const receipt = createReceiptRepository(db, DEVELOPMENT_HOUSEHOLD_ID).save(fixture, 'test');
    const count = db.prepare('SELECT COUNT(*) count FROM schema_migrations').get().count;
    db.close();
    const second = run();
    assert.equal(second.status, 0, second.stderr);
    assert.doesNotMatch(second.stdout, /Applied/);
    const reopened = new Database(path);
    try {
      assert.equal(reopened.prepare('SELECT COUNT(*) count FROM schema_migrations').get().count, count);
      assert.equal(createReceiptRepository(reopened, DEVELOPMENT_HOUSEHOLD_ID).get(receipt.id).merchant, 'Example Store');
      assert.deepEqual(reopened.pragma('foreign_key_check'), []);
    } finally { reopened.close(); }
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('mock processing normalizes file and future text/email input identically without retaining input', async () => {
  const extractor = createMockExtractor({ ...fixture, providerPayload: 'must not persist' });
  const file = await processReceipt({ sourceType: 'upload', content: { kind: 'file', bytes: new Uint8Array([1]), mediaType: 'image/png' } }, extractor);
  const email = await processReceipt({ sourceType: 'email', content: { kind: 'text', text: 'private raw message' } }, extractor);
  assert.deepEqual(file, email);
  assert.equal(file.currency, 'USD');
  assert.equal(file.items[0].rawDescription, ' TV 55 ');
  assert.equal(file.items[1].isHouseholdAsset, false);
  assert.equal('providerPayload' in file, false);
  file.items[0].normalizedName = 'changed';
  assert.equal((await processReceipt({ sourceType: 'test', content: { kind: 'text', text: '' } }, extractor)).items[0].normalizedName, 'Television');
});

test('normalization rejects invalid money, calendar dates, confidence, and quantities while preserving unknowns', () => {
  for (const patch of [{ totalMinor: 1.25 }, { totalMinor: Infinity }, { totalMinor: Number.MAX_SAFE_INTEGER + 1 }, { purchaseDate: '2026-02-30' }, { currency: 'dollars' }, { extractionConfidence: -1 }, { extractionConfidence: NaN }]) assert.throws(() => normalizeReceipt({ ...fixture, ...patch }));
  for (const quantity of [0, -1, NaN, Infinity]) assert.throws(() => normalizeReceipt({ ...fixture, items: [{ ...fixture.items[0], quantity }] }));
  assert.equal(normalizeReceipt({ ...fixture, totalMinor: null }).totalMinor, null);
  assert.equal(normalizeReceipt({ ...fixture, totalMinor: -200 }).totalMinor, -200);
});

test('structured receipt roundtrip, explicit inventory promotion, and provenance constraints', async () => {
  const db = await setup();
  try {
    const repo = createReceiptRepository(db, DEVELOPMENT_HOUSEHOLD_ID);
    const receipt = repo.save(fixture, 'upload');
    assert.equal(receipt.extractionStatus, 'needs_review');
    assert.equal(receipt.items.length, 2);
    assert.deepEqual(repo.get(receipt.id), receipt);
    assert.equal(repo.get('unknown'), null);
    assert.equal(db.prepare('SELECT COUNT(*) count FROM inventory_items').get().count, 0);
    assert.equal(repo.candidates(receipt.id).length, 1);
    const inventory = repo.promote(receipt.id, receipt.items[0].id);
    assert.equal(inventory.purchasePriceMinor, 49900);
    assert.equal(inventory.currency, 'USD');
    assert.deepEqual(repo.promote(receipt.id, receipt.items[0].id), inventory);
    assert.throws(() => repo.promote(receipt.id, receipt.items[1].id), /not an inventory candidate/);
    const other = repo.save(fixture, 'email');
    assert.throws(() => repo.promote(other.id, receipt.items[0].id), /not an inventory candidate/);
    assert.throws(() => db.prepare('UPDATE inventory_items SET source_receipt_id = ? WHERE id = ?').run(other.id, inventory.id), /provenance|FOREIGN KEY/);
    assert.throws(() => db.prepare('DELETE FROM receipts WHERE id = ?').run(receipt.id), /FOREIGN KEY/);
    db.prepare('DELETE FROM receipts WHERE id = ?').run(other.id);
    assert.equal(db.prepare('SELECT COUNT(*) count FROM receipt_items WHERE receipt_id = ?').get(other.id).count, 0);
    assert.throws(() => db.prepare('UPDATE receipts SET extraction_confidence = 2 WHERE id = ?').run(receipt.id), /CHECK/);
    assert.throws(() => db.prepare('UPDATE receipt_items SET quantity = 0 WHERE id = ?').run(receipt.items[0].id), /CHECK/);
    // A database failure rolls back the entire receipt, with no orphaned header.
    db.exec("CREATE TRIGGER fail_item BEFORE INSERT ON receipt_items BEGIN SELECT RAISE(ABORT, 'fixture failure'); END");
    assert.throws(() => repo.save(fixture, 'test'), /fixture failure/);
    assert.equal(db.prepare('SELECT COUNT(*) count FROM receipts').get().count, 1);
  } finally { db.close(); }
});

test('temporary files are private and removed on success and extractor failure', async () => {
  for (const fail of [false, true]) {
    let path;
    const run = withTemporaryReceipt(new Uint8Array([1, 2, 3]), async (current) => {
      path = current;
      assert.equal((await stat(path)).mode & 0o777, 0o600);
      assert.deepEqual([...await readFile(path)], [1, 2, 3]);
      if (fail) throw new Error('extractor failed');
      return 'done';
    });
    if (fail) await assert.rejects(run, /extractor failed/);
    else assert.equal(await run, 'done');
    await assert.rejects(stat(path), { code: 'ENOENT' });
    await assert.rejects(stat(join(path, '..')), { code: 'ENOENT' });
  }
});
