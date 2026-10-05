import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';
import { createReceiptRepository } from '../app/lib/receipts/persistence.ts';
import { getCurrentHousehold } from '../app/lib/households/current.ts';
import { DEVELOPMENT_HOUSEHOLD_ID } from '../app/lib/households/constants.ts';

const a = '10000000-0000-4000-8000-000000000001';
const b = '20000000-0000-4000-8000-000000000002';
const sample = { merchant: 'Example Store', purchaseDate: '2026-10-03', subtotalMinor: 10000, taxMinor: 700, totalMinor: 10700, currency: 'USD', extractionConfidence: null, receiptType: 'purchase', items: [{ rawDescription: 'DRILL', normalizedName: 'Drill', quantity: 1, unitPriceMinor: 10000, totalPriceMinor: 10000, category: 'Tools', isHouseholdAsset: true, assetReason: 'Durable purchase', itemRole: 'durable_asset' }] };
const migration = async (db, name) => db.exec(await readFile(new URL('../db/migrations/'+name, import.meta.url), 'utf8'));
async function setup() {
  const db = new Database(':memory:'); db.pragma('foreign_keys = ON');
  for (const name of ['007_receipts_and_inventory.sql','008_receipt_save_requests.sql','009_receipt_intelligence.sql','010_household_ownership.sql']) await migration(db, name);
  for (const [id, name] of [[a, 'A'],[b, 'B']]) db.prepare('INSERT INTO households (id, display_name) VALUES (?, ?)').run(id, name);
  return db;
}

test('households require context: undefined, null, empty and unknown IDs fail before private access', async () => {
  const db = await setup();
  try { for (const id of [undefined, null, '', ' ', 'unknown']) assert.throws(() => createReceiptRepository(db, id), /valid household context/); }
  finally { db.close(); }
});

test('A and B cannot list or fetch each other’s receipts, lines, candidates, history or inventory', async () => {
  const db = await setup();
  try {
    const ra = createReceiptRepository(db, a), rb = createReceiptRepository(db, b);
    const savedA = ra.saveReviewed({...sample, merchant:'A store'}, [0], randomUUID());
    const savedB = rb.saveReviewed({...sample, merchant:'B store'}, [0], randomUUID());
    for (const [repo, mine, other] of [[ra,savedA,savedB],[rb,savedB,savedA]]) {
      assert.equal(repo.get(other.receipt.id), null);
      assert.deepEqual(repo.candidates(other.receipt.id), []);
      assert.deepEqual(repo.listInventory(other.receipt.id), []);
      assert.deepEqual(repo.listHistory().map(row=>row.id), [mine.receipt.id]);
      assert.deepEqual(repo.listInventory().map(row=>row.id), [mine.inventory[0].id]);
      assert.equal(repo.get(mine.receipt.id).items.length, 1);
    }
  } finally { db.close(); }
});

test('cross-household receipt promotion and mixed receipt/item provenance are rejected both ways', async () => {
  const db=await setup();
  try {
    const ra=createReceiptRepository(db,a), rb=createReceiptRepository(db,b);
    const sa=ra.saveReviewed(sample,[0],randomUUID()), sb=rb.saveReviewed(sample,[0],randomUUID());
    for(const [repo,mine,other] of [[ra,sa,sb],[rb,sb,sa]]) {
      assert.throws(()=>repo.promote(other.receipt.id,other.receipt.items[0].id), /not an inventory candidate/);
      assert.throws(()=>repo.promote(mine.receipt.id,other.receipt.items[0].id), /not an inventory candidate/);
      assert.equal(repo.listInventory().length,1);
    }
    assert.throws(()=>db.prepare(`INSERT INTO inventory_items (id, source_receipt_id, source_receipt_item_id, name, currency) VALUES (?, ?, ?, 'Bad link', 'USD')`).run(randomUUID(),sa.receipt.id,sb.receipt.items[0].id), /UNIQUE|FOREIGN KEY/);
    // Use an unpromoted line to ensure the composite FK, not only unique provenance, rejects the mismatch.
    const fresh=rb.save(sample,'test');
    assert.throws(()=>db.prepare(`INSERT INTO inventory_items (id, source_receipt_id, source_receipt_item_id, name, currency) VALUES (?, ?, ?, 'Bad link', 'USD')`).run(randomUUID(),sa.receipt.id,fresh.items[0].id), /FOREIGN KEY/);
    assert.deepEqual(db.pragma('foreign_key_check'),[]);
  } finally {db.close();}
});

test('save retries cannot read or update another household even when the browser reuses its request ID', async () => {
  const db=await setup();
  try {
    const ra=createReceiptRepository(db,a),rb=createReceiptRepository(db,b),requestId=randomUUID();
    const sa=ra.saveReviewed(sample,[0],requestId);
    const sb=rb.saveReviewed({...sample,merchant:'B store'},[],requestId);
    assert.notEqual(sa.receipt.id,sb.receipt.id);
    assert.equal(ra.get(sa.receipt.id).merchant,'Example Store');
    assert.equal(ra.get(sb.receipt.id),null);
    assert.equal(rb.get(sa.receipt.id),null);
    assert.deepEqual(ra.saveReviewed(sample,[0],requestId),sa);
    assert.deepEqual(rb.saveReviewed({...sample,merchant:'B store'},[],requestId),sb);
    assert.throws(()=>ra.saveReviewed({...sample,merchant:'tampered'},[],requestId),/already completed/);
    assert.equal(rb.get(sb.receipt.id).merchant,'B store');
  } finally {db.close();}
});

test('database rejects missing/unknown household ownership and moving receipt/item/inventory provenance', async()=>{
  const db=await setup();
  try {
    const ra=createReceiptRepository(db,a),rb=createReceiptRepository(db,b);
    const sa=ra.saveReviewed(sample,[0],randomUUID()),sb=rb.saveReviewed(sample,[],randomUUID());
    const insert=db.prepare("INSERT INTO receipts (id, household_id, currency, source_type, extraction_status) VALUES (?, ?, 'USD', 'test', 'needs_review')");
    assert.throws(()=>insert.run(randomUUID(),null),/household is required/);
    assert.throws(()=>insert.run(randomUUID(),'missing'),/FOREIGN KEY/);
    assert.throws(()=>db.prepare('UPDATE receipts SET household_id = ? WHERE id = ?').run(b,sa.receipt.id),/cannot be changed/);
    assert.throws(()=>db.prepare('UPDATE receipts SET household_id = NULL WHERE id = ?').run(sa.receipt.id),/cannot be changed/);
    assert.throws(()=>db.prepare('UPDATE receipt_items SET receipt_id = ? WHERE id = ?').run(sb.receipt.id,sa.receipt.items[0].id),/provenance/);
    assert.throws(()=>db.prepare('UPDATE inventory_items SET source_receipt_id = ?, source_receipt_item_id = ? WHERE id = ?').run(sb.receipt.id,sb.receipt.items[0].id,sa.inventory[0].id),/provenance/);
    assert.throws(()=>db.prepare('DELETE FROM households WHERE id = ?').run(a),/FOREIGN KEY/);
  } finally {db.close();}
});

test('additive migration preserves every legacy receipt, line, inventory field and retry key', async()=>{
  const db=new Database(':memory:');db.pragma('foreign_keys = ON');
  try {
    for(const name of ['007_receipts_and_inventory.sql','008_receipt_save_requests.sql','009_receipt_intelligence.sql']) await migration(db,name);
    db.prepare("INSERT INTO receipts (id, merchant, currency, source_type, extraction_status, save_request_id, save_fingerprint) VALUES ('legacy', 'Legacy Store', 'USD', 'upload', 'reviewed', ?, 'fingerprint')").run(randomUUID());
    db.exec("INSERT INTO receipt_items (id, receipt_id, raw_description, quantity, is_household_asset) VALUES ('line', 'legacy', 'DRILL', 1, 1); INSERT INTO inventory_items (id, source_receipt_id, source_receipt_item_id, name, currency) VALUES ('inventory', 'legacy', 'line', 'Drill', 'USD')");
    const receipts=db.prepare('SELECT * FROM receipts').all(), lines=db.prepare('SELECT * FROM receipt_items').all(),inventory=db.prepare('SELECT * FROM inventory_items').all();
    await migration(db,'010_household_ownership.sql');
    assert.deepEqual(db.prepare('SELECT * FROM receipts').all().map(row=>{const legacy={...row};delete legacy.household_id;return legacy;}),receipts);
    assert.deepEqual(db.prepare('SELECT * FROM receipt_items').all(),lines);
    assert.deepEqual(db.prepare('SELECT * FROM inventory_items').all(),inventory);
    const repo=createReceiptRepository(db,DEVELOPMENT_HOUSEHOLD_ID);
    assert.equal(repo.listHistory().length,1);assert.equal(repo.listInventory().length,1);
    assert.equal(db.prepare('SELECT household_id FROM receipts').get().household_id,DEVELOPMENT_HOUSEHOLD_ID);
    assert.deepEqual(db.pragma('foreign_key_check'),[]);assert.equal(db.pragma('integrity_check',{simple:true}),'ok');
  } finally {db.close();}
});

test('development identity is deterministic, ignores browser ownership hints, and fails closed in production/test/remote contexts', async()=>{
  const db=await setup(),old=process.env.NODE_ENV,oldFlag=process.env.AUTH_DEV_HOUSEHOLD;
  process.env.AUTH_DEV_HOUSEHOLD='true';
  try {
    const request=new Request('http://localhost:3000/api/my-home',{headers:{'x-household-id':b,'x-user-id':'forged','cookie':`householdId=${b}; session=forged`}});
    process.env.NODE_ENV='development';
    assert.deepEqual(await getCurrentHousehold(request,db),{householdId:DEVELOPMENT_HOUSEHOLD_ID,access:'local-development'});
    for(const url of ['https://movein.guide/api/my-home','http://example.com:3000/api/my-home']) assert.equal(await getCurrentHousehold(new Request(url),db),null);
    assert.equal(await getCurrentHousehold(new Request('http://localhost:3000/api/my-home',{headers:{origin:'https://evil.example'}}),db),null);
    for(const mode of ['production','test',undefined]) {
      if(mode===undefined) delete process.env.NODE_ENV;else process.env.NODE_ENV=mode;
      // A proxy that throws proves no production resolver path even queries a household.
      assert.equal(await getCurrentHousehold(request,new Proxy({}, {get(){throw new Error('DB must not be used')}})),null);
    }
    process.env.NODE_ENV='development';
    db.prepare('DELETE FROM households WHERE id = ?').run(DEVELOPMENT_HOUSEHOLD_ID);
    assert.equal(await getCurrentHousehold(request,db),null);
  } finally {if(oldFlag===undefined) delete process.env.AUTH_DEV_HOUSEHOLD;else process.env.AUTH_DEV_HOUSEHOLD=oldFlag;if(old===undefined) delete process.env.NODE_ENV;else process.env.NODE_ENV=old;db.close();}
});
