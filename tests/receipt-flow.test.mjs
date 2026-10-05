import { DEVELOPMENT_HOUSEHOLD_ID } from '../app/lib/households/constants.ts';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import test, { after } from 'node:test';
import { mkdtemp, readFile, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';
import { developmentExtractor } from '../app/lib/receipts/demo.ts';
import { processReceipt, normalizeReceipt } from '../app/lib/receipts/processing.ts';
import { createReceiptRepository } from '../app/lib/receipts/persistence.ts';
import { reviewFromReceipt, reviewedReceipt, parseMoney } from '../app/lib/receipts/review.ts';
import { MAX_RECEIPT_BYTES, validateUpload, validateFileSignature } from '../app/lib/receipts/upload.ts';
import { boundedBody, developmentRequestAllowed } from '../app/lib/receipts/http.ts';

const previousDevHousehold = process.env.AUTH_DEV_HOUSEHOLD;
process.env.AUTH_DEV_HOUSEHOLD = 'true';
const previousMode = process.env.NODE_ENV;
const previousProvider = process.env.RECEIPT_EXTRACTOR;
const previousPath = process.env.DATABASE_PATH;
const directory = await mkdtemp(join(tmpdir(), 'movein-flow-'));
process.env.NODE_ENV = 'development';
process.env.RECEIPT_EXTRACTOR = 'demo';
process.env.DATABASE_PATH = join(directory, 'flow.sqlite');
const { getDatabase } = await import('../db/index.ts');
const { POST: processUpload } = await import('../app/api/receipts/process/route.ts');
const { POST: saveReview } = await import('../app/api/receipts/save/route.ts');
const { GET: getInventory } = await import('../app/api/my-home/route.ts');
const migration = async (db) => {
  for (const name of ['007_receipts_and_inventory.sql', '008_receipt_save_requests.sql', '009_receipt_intelligence.sql', '010_household_ownership.sql']) db.exec(await readFile(new URL(`../db/migrations/${name}`, import.meta.url), 'utf8'));
};
await migration(getDatabase());
after(async () => {
  if (previousDevHousehold === undefined) delete process.env.AUTH_DEV_HOUSEHOLD; else process.env.AUTH_DEV_HOUSEHOLD = previousDevHousehold;
  if (globalThis.moveInDatabase?.open) globalThis.moveInDatabase.close();
  globalThis.moveInDatabase = undefined;
  if (previousMode === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousMode;
  if (previousProvider === undefined) delete process.env.RECEIPT_EXTRACTOR; else process.env.RECEIPT_EXTRACTOR = previousProvider;
  if (previousPath === undefined) delete process.env.DATABASE_PATH; else process.env.DATABASE_PATH = previousPath;
  await rm(directory, { recursive: true, force: true });
});
const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: 'white' } }).png().toBuffer();
const input = { sourceType: 'upload', content: { kind: 'file', mediaType: 'image/png', bytes: png } };
function upload(file = new File([png], 'receipt.png', { type: 'image/png' })) {
  const form = new FormData(); if (file) form.set('receipt', file);
  return new Request('http://localhost:3000/api/receipts/process', { method: 'POST', headers: { origin: 'http://localhost:3000' }, body: form });
}
function save(body) { return new Request('http://localhost:3000/api/receipts/save', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' }, body: JSON.stringify(body) }); }

test('upload validation accepts receipt formats and rejects unsupported, empty, oversized, and mislabeled files', () => {
  for (const [name, type] of [['receipt.jpg', 'image/jpeg'], ['receipt.JPEG', 'image/jpeg'], ['receipt.png', 'image/png'], ['receipt.pdf', 'application/pdf']]) assert.equal(validateUpload({ name, type, size: 10 }), null);
  for (const file of [{ name: 'receipt.exe', type: 'image/png', size: 10 }, { name: 'receipt.png', type: 'text/plain', size: 10 }, { name: 'receipt.png', type: 'image/png', size: 0 }, { name: 'receipt.png', type: 'image/png', size: MAX_RECEIPT_BYTES + 1 }]) assert.ok(validateUpload(file));
  assert.equal(validateFileSignature(png, 'image/png'), true);
  assert.equal(validateFileSignature(new TextEncoder().encode('%PDF-1.7'), 'application/pdf'), true);
  assert.equal(validateFileSignature(new Uint8Array([255, 216, 255]), 'image/jpeg'), true);
  assert.equal(validateFileSignature(new TextEncoder().encode('not an image'), 'image/png'), false);
});

test('bounded request body rejects oversize even without Content-Length', async () => {
  const request = new Request('http://localhost/', { method: 'POST', body: new Uint8Array(33) });
  await assert.rejects(boundedBody(request, 32), /too large/);
  const small = await boundedBody(new Request('http://localhost/', { method: 'POST', body: 'okay' }), 32);
  assert.equal(new TextDecoder().decode(small), 'okay');
});

test('demo is deterministic, provider-neutral, and separates household assets from supplies', async () => {
  const first = await processReceipt(input, developmentExtractor());
  const other = await processReceipt({ sourceType: 'email', content: { kind: 'text', text: 'different input' } }, developmentExtractor());
  assert.deepEqual(first, other);
  assert.equal(first.merchant, 'The Home Depot');
  assert.equal(first.items.length, 5);
  assert.deepEqual(first.items.map((item) => item.isHouseholdAsset), [true, true, false, false, false]);
  assert.equal(first.items.reduce((sum, item) => sum + item.totalPriceMinor, 0), first.subtotalMinor);
  assert.equal(first.subtotalMinor + first.taxMinor, first.totalMinor);
  assert.equal(first.extractionConfidence, null);
});

test('review permits corrections and unknown fields without changing inventory selections implicitly', async () => {
  const parsed = await processReceipt(input, developmentExtractor());
  const review = reviewFromReceipt({ ...parsed, purchaseDate: null, totalMinor: null });
  assert.equal(review.purchaseDate, ''); assert.equal(review.total, '');
  review.merchant = 'Corrected merchant'; review.items[0].name = 'Corrected grill';
  review.items[0].totalPrice = '500.25'; review.items[0].selected = false; review.items[3].selected = true;
  const final = reviewedReceipt(parsed, review);
  assert.equal(final.merchant, 'Corrected merchant');
  assert.equal(final.purchaseDate, null); assert.equal(final.totalMinor, null);
  assert.equal(final.items[0].totalPriceMinor, 50025);
  assert.equal(parseMoney('-0.10'), -10); assert.equal(parseMoney('0'), 0); assert.equal(parseMoney(''), null);
  assert.throws(() => parseMoney('1.234')); assert.throws(() => parseMoney('1e8'));
  assert.throws(() => reviewedReceipt({ ...parsed, items: [] }, { ...review, items: [] }), /no usable/);
  review.items[0].name = ''; assert.throws(() => reviewedReceipt(parsed, review), /name/);
});

test('normalizer and processing reject malformed results and propagate extractor failures', async () => {
  for (const bad of [null, {}, { currency: 'USD', items: [null] }, { currency: 'USD', items: new Array(101).fill({}) }]) assert.throws(() => normalizeReceipt(bad));
  await assert.rejects(processReceipt(input, { async extract() { return { invalid: true }; } }), /Invalid receipt/);
  await assert.rejects(processReceipt(input, { async extract() { throw new Error('fixture provider failure'); } }), /fixture provider failure/);
});

test('process endpoint validates uploads and does not persist the raw file or purchase', async () => {
  const response = await processUpload(upload());
  assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store');
  const data = await response.json(); assert.equal(data.mode, 'demo'); assert.equal(data.receipt.items.length, 5);
  assert.equal(getDatabase().prepare('SELECT COUNT(*) count FROM receipts').get().count, 0);
  assert.equal(getDatabase().prepare('SELECT COUNT(*) count FROM inventory_items').get().count, 0);
  const invalid = await processUpload(upload(new File(['text'], 'receipt.png', { type: 'image/png' })));
  assert.equal(invalid.status, 400);
  assert.equal((await processUpload(upload(null))).status, 400);
  assert.equal((await processUpload(upload(new File(['text'], 'receipt.txt', { type: 'text/plain' })))).status, 400);
  const large = new File([new Uint8Array(MAX_RECEIPT_BYTES + 1)], 'receipt.png', { type: 'image/png' });
  assert.equal((await processUpload(upload(large))).status, 413);
  assert.ok((await readdir(directory)).every((name) => name.startsWith('flow.sqlite')));
});

test('confirmed save and My Home API persist user overrides with provenance and retry safety', async () => {
  const parsed = (await (await processUpload(upload())).json()).receipt;
  const review = reviewFromReceipt(parsed); review.items[0].name = 'My grill';
  const body = { receipt: reviewedReceipt(parsed, review), selected: [1, 3], requestId: randomUUID() };
  const response = await saveReview(save(body)); assert.equal(response.status, 200);
  const result = await response.json(); assert.equal(result.receipt.extractionStatus, 'reviewed');
  assert.equal(result.receipt.sourceType, 'test');
  assert.equal(result.receipt.items[0].isHouseholdAsset, false);
  assert.equal(result.receipt.items[3].isHouseholdAsset, true);
  assert.deepEqual(result.inventory.map((item) => item.name).sort(), ['Paper Towels', 'Ryobi Drill']);
  for (const item of result.inventory) {
    assert.equal(item.sourceReceiptId, result.receipt.id);
    assert.ok(result.receipt.items.some((line) => line.id === item.sourceReceiptItemId));
  }
  const retry = await saveReview(save(body)); assert.equal(retry.status, 200);
  assert.deepEqual(await retry.json(), result);
  assert.equal(getDatabase().prepare('SELECT COUNT(*) count FROM receipts').get().count, 1);
  assert.equal(getDatabase().prepare('SELECT COUNT(*) count FROM inventory_items').get().count, 2);
  assert.equal((await saveReview(save({ ...body, selected: [0] }))).status, 409);
  const inventory = await getInventory(new Request('http://localhost:3000/api/my-home'));
  assert.equal(inventory.status, 200); assert.equal((await inventory.json()).items.length, 2);
  assert.equal((await saveReview(save({ ...body, requestId: randomUUID(), receipt: { ...parsed, items: [] } }))).status, 400);
  assert.equal((await saveReview(save({ ...body, selected: [7], requestId: randomUUID() }))).status, 400);
  assert.deepEqual(getDatabase().pragma('foreign_key_check'), []);
  const fields = getDatabase().pragma('table_info(receipts)').map((row) => row.name);
  assert.ok(fields.every((field) => !/file|image|path|body|payload/.test(field)));
});

test('receipt, lines, and inventory all roll back if the second promotion fails', async () => {
  const db = new Database(':memory:'); db.pragma('foreign_keys = ON'); await migration(db);
  try {
    db.exec("CREATE TRIGGER fail_second BEFORE INSERT ON inventory_items WHEN NEW.name = 'Ryobi Drill' BEGIN SELECT RAISE(ABORT, 'fixture inventory failure'); END");
    const repo = createReceiptRepository(db, DEVELOPMENT_HOUSEHOLD_ID);
    const parsed = await processReceipt(input, developmentExtractor());
    assert.throws(() => repo.saveReviewed(parsed, [0, 1], randomUUID()), /fixture inventory failure/);
    for (const table of ['receipts', 'receipt_items', 'inventory_items']) assert.equal(db.prepare(`SELECT COUNT(*) count FROM ${table}`).get().count, 0);
  } finally { db.close(); }
});

test('save failure returns an honest retry error without partial data', async () => {
  const db = getDatabase();
  const before = db.prepare('SELECT COUNT(*) count FROM receipts').get().count;
  db.exec("CREATE TRIGGER fail_save BEFORE INSERT ON inventory_items BEGIN SELECT RAISE(ABORT, 'fixture failure'); END");
  try {
    const parsed = await processReceipt(input, developmentExtractor());
    const response = await saveReview(save({ receipt: parsed, selected: [0], requestId: randomUUID() }));
    assert.equal(response.status, 503); assert.match((await response.json()).error, /changes are still here/);
    assert.equal(db.prepare('SELECT COUNT(*) count FROM receipts').get().count, before);
  } finally { db.exec('DROP TRIGGER fail_save'); }
});

test('demo endpoints reject remote hosts, cross-origin requests, and all production access', async () => {
  assert.equal(developmentRequestAllowed(new Request('http://movein.guide/api/my-home')), false);
  assert.equal(developmentRequestAllowed(new Request('http://localhost:3000/api/my-home', { headers: { host: '127.0.0.1:3000', origin: 'http://127.0.0.1:3000' } })), true);
  assert.equal(developmentRequestAllowed(new Request('http://localhost:3000/api/my-home', { headers: { host: 'example.com:3000' } })), false);
  assert.equal(developmentRequestAllowed(new Request('http://localhost:3000/api/my-home', { headers: { origin: 'https://example.com' } })), false);
  assert.equal(developmentRequestAllowed(new Request('http://localhost:3000/api/my-home', { headers: { 'sec-fetch-site': 'cross-site' } })), false);
  process.env.NODE_ENV = 'production';
  try {
    assert.throws(() => developmentExtractor(), /not configured/);
    assert.equal((await processUpload(upload())).status, 401);
    assert.equal((await saveReview(save({}))).status, 401);
    assert.equal((await getInventory(new Request('http://localhost:3000/api/my-home'))).status, 401);
  } finally { process.env.NODE_ENV = 'development'; }
});

test('real process API returns configured model results and warnings without saving or fallback', async () => {
  const originalFetch = globalThis.fetch;
  const oldModel = process.env.OLLAMA_RECEIPT_MODEL;
  const oldDebug = process.env.RECEIPT_EXTRACTION_DEBUG;
  process.env.RECEIPT_EXTRACTOR = 'ollama'; process.env.OLLAMA_RECEIPT_MODEL = 'mock-vision'; process.env.RECEIPT_EXTRACTION_DEBUG = 'true';
  const before = getDatabase().prepare('SELECT COUNT(*) count FROM receipts').get().count;
  const receipt = { merchant: 'Actual extracted store', purchaseDate: null, subtotalMinor: null, taxMinor: null, totalMinor: 9900, currency: 'USD', items: [{ rawDescription: 'DRL KT', normalizedName: 'Drill Kit', quantity: 1, unitPriceMinor: 9900, totalPriceMinor: 9900, category: 'tool', isHouseholdAsset: true, assetReason: 'Durable tool' }] };
  try {
    globalThis.fetch = async (url) => new Response(JSON.stringify(String(url).endsWith('/api/show') ? { capabilities: ['vision'] } : { done: true, message: { content: JSON.stringify(receipt) } }));
    const response = await processUpload(upload()); assert.equal(response.status, 200);
    const body = await response.json(); assert.equal(body.mode, 'ollama'); assert.equal(body.receipt.merchant, receipt.merchant);
    assert.equal(body.quality.status, 'missing_information'); assert.equal(body.debug.model, 'mock-vision');
    assert.equal(getDatabase().prepare('SELECT COUNT(*) count FROM receipts').get().count, before);
    globalThis.fetch = async () => { throw new Error('SECRET'); };
    const unavailable = await processUpload(upload()); assert.equal(unavailable.status, 503);
    assert.equal((await unavailable.json()).code, 'unavailable');
    delete process.env.RECEIPT_EXTRACTOR;
    const missing = await processUpload(upload()); assert.equal(missing.status, 503); assert.doesNotMatch(JSON.stringify(await missing.json()), /Home Depot|Weber|sample purchases/);
  } finally {
    globalThis.fetch = originalFetch; process.env.RECEIPT_EXTRACTOR = 'demo';
    if (oldModel === undefined) delete process.env.OLLAMA_RECEIPT_MODEL; else process.env.OLLAMA_RECEIPT_MODEL = oldModel;
    if (oldDebug === undefined) delete process.env.RECEIPT_EXTRACTION_DEBUG; else process.env.RECEIPT_EXTRACTION_DEBUG = oldDebug;
  }
});


test('receipt history counts purchase lines and selected inventory separately without counting joins twice', async () => {
  const db = new Database(':memory:');
  try {
    await migration(db);
    const repository = createReceiptRepository(db, DEVELOPMENT_HOUSEHOLD_ID);
    const parsed = await processReceipt(input, developmentExtractor());
    repository.save(parsed, 'test'); // Unreviewed records are not presented as saved history.
    const first = repository.saveReviewed(parsed, [0, 1], randomUUID());
    const second = repository.saveReviewed({ ...parsed, merchant: null, purchaseDate: null, totalMinor: null }, [], randomUUID());
    const history = repository.listHistory();
    assert.equal(history.length, 2);
    assert.equal(history[0].id, second.receipt.id);
    assert.equal(history[0].totalMinor, null);
    assert.equal(history[0].inventoryCount, 0);
    assert.equal(history[1].id, first.receipt.id);
    assert.equal(history[1].itemCount, parsed.items.length);
    assert.equal(history[1].inventoryCount, 2);
    assert.deepEqual(Object.keys(history[0]).sort(), ['id', 'merchant', 'purchaseDate', 'totalMinor', 'currency', 'itemCount', 'inventoryCount'].sort());
  } finally { db.close(); }
});

test('private API scopes My Home/history to the resolved household and rejects browser-selected ownership', async () => {
  const db=getDatabase(),other=randomUUID();db.prepare('INSERT INTO households (id, display_name) VALUES (?, ?)').run(other,'Other household');
  const parsed=await processReceipt(input,developmentExtractor());
  const foreign=createReceiptRepository(db,other).saveReviewed({...parsed,merchant:'Foreign household store'},[0],randomUUID());
  const before=db.prepare('SELECT COUNT(*) count FROM receipts').get().count;
  for (const receipt of [{...parsed, id:foreign.receipt.id}, {...parsed, household_id:other}, {...parsed, items:parsed.items.map(item=>({...item, sourceReceiptId:foreign.receipt.id}))}]) assert.equal((await saveReview(save({receipt,selected:[0],requestId:randomUUID()}))).status,400);
  assert.equal(createReceiptRepository(db,other).get(foreign.receipt.id).merchant,'Foreign household store');
  const body={receipt:parsed,selected:[0],requestId:randomUUID(),householdId:other};
  assert.equal((await saveReview(save(body))).status,400);
  assert.equal(db.prepare('SELECT COUNT(*) count FROM receipts').get().count,before);
  const response=await getInventory(new Request(`http://localhost:3000/api/my-home?householdId=${other}`,{headers:{'x-household-id':other,cookie:`householdId=${other}; session=forged`}}));
  assert.equal(response.status,200);const data=await response.json();
  assert.ok(data.items.every(item=>item.sourceReceiptId!==foreign.receipt.id));
  assert.ok(data.receipts.every(receipt=>receipt.id!==foreign.receipt.id));
  const owned=await saveReview(save({receipt:parsed,selected:[0],requestId:randomUUID()}));assert.equal(owned.status,200);
  const result=await owned.json();assert.equal(db.prepare('SELECT household_id FROM receipts WHERE id = ?').get(result.receipt.id).household_id,DEVELOPMENT_HOUSEHOLD_ID);
});

test('all private APIs fail closed in production before parsing, reading records or contacting receipt processing', async () => {
  const oldMode=process.env.NODE_ENV,oldFetch=globalThis.fetch;
  const db=getDatabase(),before=db.prepare('SELECT COUNT(*) count FROM receipts').get().count;
  process.env.NODE_ENV='production';
  try {
    globalThis.fetch=async()=>{throw new Error('Processing must not be contacted');};
    const responses=[await processUpload(upload()),await saveReview(save({householdId:DEVELOPMENT_HOUSEHOLD_ID,receipt:'invalid'})),await getInventory(new Request('http://localhost:3000/api/my-home',{headers:{cookie:'session=forged','x-household-id':DEVELOPMENT_HOUSEHOLD_ID}}))];
    for(const response of responses){assert.equal(response.status,401);assert.equal(response.headers.get('cache-control'),'no-store');assert.deepEqual(Object.keys(await response.json()),['error']);}
    assert.equal(db.prepare('SELECT COUNT(*) count FROM receipts').get().count,before);
  } finally {process.env.NODE_ENV=oldMode;globalThis.fetch=oldFetch;}
});
