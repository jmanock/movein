import { DEVELOPMENT_HOUSEHOLD_ID } from '../app/lib/households/constants.ts';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';
import { receiptExtractorConfig } from '../app/lib/receipts/config.ts';
import { createOllamaExtractor, parseOllamaReceipt } from '../app/lib/receipts/ollama.ts';
import { extractConfiguredReceipt } from '../app/lib/receipts/extraction.ts';
import { receiptQuality } from '../app/lib/receipts/quality.ts';
import { RECEIPT_OUTPUT_SCHEMA, RECEIPT_PROMPT_VERSION } from '../app/lib/receipts/prompt.ts';
import { createReceiptRepository } from '../app/lib/receipts/persistence.ts';
const env = { NODE_ENV: 'development', RECEIPT_EXTRACTOR: 'ollama', OLLAMA_RECEIPT_MODEL: 'local-vision:small' };
const config = receiptExtractorConfig(env);
const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: 'white' } }).png().toBuffer();
const input = { sourceType: 'upload', content: { kind: 'file', mediaType: 'image/png', bytes: png } };
const fixture = () => ({ merchant: ' Example Hardware ', purchaseDate: '2026-10-02', subtotalMinor: 10299, taxMinor: 721, totalMinor: 11020, currency: 'USD', items: [
  { rawDescription: 'RYOBI 18V DRL KT', normalizedName: 'Ryobi 18V Drill Kit', quantity: 1, unitPriceMinor: 9900, totalPriceMinor: 9900, category: 'tool', isHouseholdAsset: true, assetReason: 'Durable tool' },
  { rawDescription: 'PPR TWL 6RL', normalizedName: 'Paper Towels', quantity: 1, unitPriceMinor: 399, totalPriceMinor: 399, category: 'consumable', isHouseholdAsset: false, assetReason: 'Disposable cleaning consumable' },
] });
const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
const completed = (content = JSON.stringify(fixture())) => ({ done: true, message: { content } });
function mock(chat = completed(), metadata = { capabilities: ['completion', 'vision'] }) {
  const calls = [];
  const fetcher = async (url, options) => { calls.push({ url, options }); return json(url.endsWith('/api/show') ? metadata : chat); };
  return { calls, fetcher };
}
const rejectsCode = (promise, code) => assert.rejects(promise, (error) => error.code === code && !error.message.includes('SECRET'));

test('explicit provider, local URL, model, timeout and development-only debug configuration', () => {
  assert.deepEqual(config, { provider: 'ollama', baseUrl: 'http://127.0.0.1:11434', model: 'local-vision:small', promptVersion: 'movein-receipt-v2', timeoutMs: 180000, debug: false });
  assert.equal(receiptExtractorConfig({ ...env, OLLAMA_BASE_URL: 'http://[::1]:11434', OLLAMA_RECEIPT_TIMEOUT_MS: '240000', RECEIPT_EXTRACTION_DEBUG: 'true' }).debug, true);
  assert.equal(receiptExtractorConfig({ ...env, NODE_ENV: 'production', RECEIPT_EXTRACTION_DEBUG: 'true' }).debug, false);
  assert.equal(receiptExtractorConfig({ ...env, RECEIPT_EXTRACTOR: 'demo' }).provider, 'demo');
  for (const patch of [{ RECEIPT_EXTRACTOR: '' }, { RECEIPT_EXTRACTOR: 'unknown' }, { OLLAMA_RECEIPT_MODEL: '' }, { OLLAMA_RECEIPT_MODEL: 'vision:cloud' }, { OLLAMA_BASE_URL: 'https://example.com' }, { OLLAMA_BASE_URL: 'http://localhost:11434' }, { OLLAMA_BASE_URL: 'http://127.0.0.1:11434/api' }, { OLLAMA_BASE_URL: 'http://secret@127.0.0.1:11434' }, { OLLAMA_RECEIPT_TIMEOUT_MS: '20' }, { OLLAMA_RECEIPT_TIMEOUT_MS: 'Infinity' }, { OLLAMA_RECEIPT_TIMEOUT_MS: '600001' }]) assert.throws(() => receiptExtractorConfig({ ...env, ...patch }), (error) => error.code === 'configuration');
  assert.throws(() => receiptExtractorConfig({ NODE_ENV: 'production', RECEIPT_EXTRACTOR: 'demo' }), /only in development/);
});
test('real provider posts structured image request; allowlists facts without fake confidence', async () => {
  const transport = mock(completed(JSON.stringify({ ...fixture(), extractionConfidence: 0.99, privateProviderField: 'SECRET' })));
  const result = await extractConfiguredReceipt(input, { env: { ...env, RECEIPT_EXTRACTION_DEBUG: 'true' }, fetcher: transport.fetcher });
  assert.equal(result.mode, 'ollama'); assert.equal(result.receipt.merchant, 'Example Hardware');
  assert.equal(result.receipt.extractionConfidence, null); assert.equal('privateProviderField' in result.receipt, false);
  assert.equal(result.receipt.items[0].rawDescription, 'RYOBI 18V DRL KT');
  assert.equal(result.receipt.items[0].normalizedName, 'Ryobi 18V Drill Kit');
  assert.equal(result.receipt.items[0].isHouseholdAsset, true); assert.equal(result.receipt.items[1].isHouseholdAsset, false);
  assert.equal(result.receipt.items[0].unitPriceMinor, 9900); assert.equal(result.receipt.totalMinor, 11020);
  assert.deepEqual(transport.calls.map((call) => new URL(call.url).pathname), ['/api/show', '/api/chat']);
  const request = JSON.parse(transport.calls[1].options.body);
  assert.deepEqual(request.format, RECEIPT_OUTPUT_SCHEMA); assert.equal(request.stream, false); assert.equal(request.model, env.OLLAMA_RECEIPT_MODEL);
  assert.equal(request.messages[1].images[0], Buffer.from(png).toString('base64'));
  assert.equal(transport.calls[1].options.redirect, 'error');
  assert.equal(result.debug.promptVersion, RECEIPT_PROMPT_VERSION); assert.equal(result.debug.jsonRepaired, false);
  assert.equal(JSON.stringify(result.debug).includes(Buffer.from(png).toString('base64')), false);
});
test('malformed JSON and prose fail; only one complete JSON fence is repaired', () => {
  for (const text of ['not json SECRET', '{"items":', `Here you go: ${JSON.stringify(fixture())}`]) assert.throws(() => parseOllamaReceipt(text), (error) => error.code === 'invalid_json');
  assert.equal(parseOllamaReceipt('```json\n' + JSON.stringify(fixture()) + '\n```').jsonRepaired, true);
});
test('schema rejects bad dates, floating dollar values, excessive money, categories and booleans', () => {
  for (const patch of [{ purchaseDate: '2026-02-30' }, { merchant: 123 }, { totalMinor: 110.20 }, { totalMinor: 1000000001 }, { items: {} }]) assert.throws(() => parseOllamaReceipt(JSON.stringify({ ...fixture(), ...patch }), 'movein-receipt-v1'), (error) => error.code === 'invalid_schema');
  for (const patch of [{ quantity: 0 }, { quantity: '1' }, { quantity: 100001 }, { isHouseholdAsset: 'true' }, { category: 'wild_category' }, { rawDescription: '' }, { unitPriceMinor: '99.00' }]) assert.throws(() => parseOllamaReceipt(JSON.stringify({ ...fixture(), items: [{ ...fixture().items[0], ...patch }] })), (error) => error.code === 'invalid_schema');
  assert.throws(() => parseOllamaReceipt(JSON.stringify({ ...fixture(), items: [] })), (error) => error.code === 'no_items');
  assert.throws(() => parseOllamaReceipt(JSON.stringify({ ...fixture(), currency: 'EUR' })), (error) => error.code === 'currency');
});
test('missing optional fields remain null; unreadable quantity gets an explicit review hint', () => {
  const receipt = parseOllamaReceipt(JSON.stringify({ currency: 'USD', items: [{ rawDescription: 'DRILL', category: 'tool', isHouseholdAsset: true }] })).receipt;
  for (const field of ['merchant', 'purchaseDate', 'subtotalMinor', 'taxMinor', 'totalMinor']) assert.equal(receipt[field], null);
  assert.equal(receipt.items[0].normalizedName, null); assert.equal(receipt.items[0].unitPriceMinor, null); assert.equal(receipt.items[0].quantity, 1);
  const quality = receiptQuality(receipt); assert.equal(quality.status, 'missing_information');
  assert.ok(quality.warnings.some((warning) => warning.code === 'quantity_assumed' && warning.itemIndex === 0));
});
test('placeholder strings become unknown and schema uses portable date grammar', () => {
  const receipt = parseOllamaReceipt(JSON.stringify({ ...fixture(), merchant: 'null', purchaseDate: 'unknown', items: [{ ...fixture().items[0], normalizedName: 'n/a', assetReason: 'NULL' }] })).receipt;
  assert.equal(receipt.merchant, null); assert.equal(receipt.purchaseDate, null); assert.equal(receipt.items[0].normalizedName, null); assert.equal(receipt.items[0].assetReason, null);
  assert.ok(receiptQuality(receipt).warnings.some((warning) => warning.code === 'missing_merchant'));
  assert.equal(RECEIPT_OUTPUT_SCHEMA.properties.purchaseDate.pattern.includes('\\d'), false);
});
test('arithmetic mismatches warn without rejecting discounts or missing totals', () => {
  const receipt = parseOllamaReceipt(JSON.stringify({ ...fixture(), subtotalMinor: 9000, totalMinor: 8000 })).receipt;
  assert.ok(receiptQuality(receipt).warnings.some((warning) => warning.code === 'total_mismatch'));
  assert.ok(receiptQuality(receipt).warnings.some((warning) => warning.code === 'item_total_mismatch'));
  assert.equal(receipt.items.length, 2);
});
test('network failure remains an honest error in production with no demo fallback', async () => {
  await rejectsCode(extractConfiguredReceipt(input, { env: { ...env, NODE_ENV: 'production' }, fetcher: async () => { throw new Error('SECRET connection stack'); } }), 'unavailable');
  await rejectsCode(extractConfiguredReceipt(input, { env: { NODE_ENV: 'production', RECEIPT_EXTRACTOR: 'demo' } }), 'configuration');
});
test('missing model and image errors become safe useful application errors', async () => {
  await rejectsCode(createOllamaExtractor(config, async () => json({ error: 'model missing SECRET' }, 404)).extract(input), 'model_missing');
  await rejectsCode(createOllamaExtractor(config, async () => json({ error: 'unsupported image SECRET' }, 400)).extract(input), 'vision');
  await rejectsCode(createOllamaExtractor(config, async () => json({ error: 'internal SECRET' }, 500)).extract(input), 'provider_error');
});
test('non-vision and remote models are rejected before sending image bytes', async () => {
  for (const metadata of [{ capabilities: ['completion'] }, { capabilities: ['vision'], remote_model: 'vision' }, { capabilities: ['vision'], remote_host: 'remote' }, {}]) {
    const transport = mock(completed(), metadata);
    await assert.rejects(createOllamaExtractor(config, transport.fetcher).extract(input), (error) => ['vision', 'model_local'].includes(error.code));
    assert.equal(transport.calls.length, 1); assert.equal(transport.calls[0].options.body.includes('images'), false);
  }
});
test('deadline aborts hung HTTP and cancellation remains distinct', async () => {
  const hangingFetch = async (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true }));
  const keepAlive = setInterval(() => {}, 1000);
  try { await rejectsCode(createOllamaExtractor({ ...config, timeoutMs: 15 }, hangingFetch).extract(input), 'timeout'); }
  finally { clearInterval(keepAlive); }
  const controller = new AbortController();
  const pending = createOllamaExtractor(config, hangingFetch, controller.signal).extract(input); controller.abort();
  await rejectsCode(pending, 'canceled');
});
test('malformed, oversized and incomplete provider envelopes fail safely', async () => {
  await rejectsCode(createOllamaExtractor(config, async () => new Response('SECRET not json')).extract(input), 'malformed_response');
  await rejectsCode(createOllamaExtractor(config, async () => new Response('x'.repeat(262145))).extract(input), 'malformed_response');
  for (const chat of [{ done: false, message: { content: '{}' } }, { done: true }, { ...completed(), done_reason: 'length' }]) await rejectsCode(createOllamaExtractor(config, mock(chat).fetcher).extract(input), 'malformed_response');
});
test('PDF, text, invalid images fail honestly without contacting Ollama', async () => {
  const transport = mock(); const extractor = createOllamaExtractor(config, transport.fetcher);
  await rejectsCode(extractor.extract({ ...input, content: { kind: 'file', mediaType: 'application/pdf', bytes: new TextEncoder().encode('%PDF-1.7') } }), 'pdf');
  await rejectsCode(extractor.extract({ sourceType: 'email', content: { kind: 'text', text: 'private email' } }), 'format');
  await rejectsCode(extractor.extract({ ...input, content: { ...input.content, bytes: new Uint8Array([0]) } }), 'image');
  assert.equal(transport.calls.length, 0);
});
test('real classification and raw/normalized descriptions persist only after reviewed save', async () => {
  const db = new Database(':memory:'); db.pragma('foreign_keys = ON');
  try {
    for (const migration of ['007_receipts_and_inventory.sql', '008_receipt_save_requests.sql', '009_receipt_intelligence.sql', '010_household_ownership.sql']) db.exec(await readFile(new URL('../db/migrations/' + migration, import.meta.url), 'utf8'));
    const { receipt } = await extractConfiguredReceipt(input, { env, fetcher: mock().fetcher });
    const repository = createReceiptRepository(db, DEVELOPMENT_HOUSEHOLD_ID);
    assert.equal(repository.listInventory().length, 0);
    const saved = repository.saveReviewed(receipt, [0], randomUUID(), 'upload');
    assert.equal(saved.receipt.sourceType, 'upload'); assert.equal(saved.inventory.length, 1);
    assert.equal(saved.receipt.items[0].rawDescription, 'RYOBI 18V DRL KT'); assert.equal(saved.inventory[0].name, 'Ryobi 18V Drill Kit');
    assert.equal(saved.receipt.items[0].isHouseholdAsset, true); assert.equal(saved.receipt.items[1].isHouseholdAsset, false);
    assert.equal(saved.inventory[0].purchasePriceMinor, 9900); assert.deepEqual(db.pragma('foreign_key_check'), []);
  } finally { db.close(); }
});
