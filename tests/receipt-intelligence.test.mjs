import { DEVELOPMENT_HOUSEHOLD_ID } from '../app/lib/households/constants.ts';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, mkdtemp, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';
import { readReceiptDate, quantityAmount } from '../app/lib/receipts/intelligence.ts';
import { parseOllamaReceipt, createOllamaExtractor } from '../app/lib/receipts/ollama.ts';
import { receiptPrompt } from '../app/lib/receipts/prompt.ts';
import { receiptExtractorConfig } from '../app/lib/receipts/config.ts';
import { receiptQuality } from '../app/lib/receipts/quality.ts';
import { normalizeReceipt } from '../app/lib/receipts/processing.ts';
import { reviewFromReceipt, reviewedReceipt } from '../app/lib/receipts/review.ts';
import { createReceiptRepository } from '../app/lib/receipts/persistence.ts';
import { compareReceipt, validateExpected, nameSimilarity, aggregateEvaluations, evaluateDirectory } from '../scripts/lib/receipt-evaluation.mjs';
const item = patch => ({ rawDescription:'RYB 18V DRL KT', normalizedName:'Ryobi Drill Kit', quantity:1, unitPriceMinor:9900, totalPriceMinor:9900, category:'tool', itemRole:'durable_asset', isHouseholdAsset:true, assetReason:'Durable tool', uncertaintyFlags:[], ...patch });
const receipt = patch => ({ merchant:'Example Hardware', purchaseDate:'2026-10-01', rawDateText:'2026-10-01', dateOrder:'unknown', receiptType:'purchase', subtotalMinor:9900,taxMinor:0,totalMinor:9900,currency:'USD',items:[item({})], ...patch });
const parse = raw => parseOllamaReceipt(JSON.stringify(raw)).receipt;
const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: 'white' } }).png().toBuffer();

test('date normalization handles names, ISO/timestamps, clear order and inferred years without locale guessing', () => {
  for(const [text,order,date] of [['10/01/26','mdy','2026-10-01'],['10-01-2026','mdy','2026-10-01'],['Oct 1 2026','unknown','2026-10-01'],['01 OCT 26','unknown','2026-10-01'],['2026-10-01T14:05:00Z','unknown','2026-10-01'],['10/01/2026 14:05:00','mdy','2026-10-01'],['31/10/2026','unknown','2026-10-31']]) assert.equal(readReceiptDate(text,order).date,date,text);
  assert.equal(readReceiptDate('10/01/26','mdy').warning,'date_year_inferred');
  assert.deepEqual(readReceiptDate('10/01/2026'),{date:null,warning:'ambiguous_date'});
  assert.equal(readReceiptDate('2026-02-30').warning,'invalid_date');
  const result=parse(receipt({purchaseDate:'2026-10-01',rawDateText:'10/01/2026'}));
  assert.equal(result.purchaseDate,null);assert.ok(result.reviewSignals.some(signal=>signal.code==='ambiguous_date'));
});
test('normalization preserves printed evidence and generalizes unsupported numeric specificity', () => {
  const raw='  WEBR SP E310 BLK\nSKU 12345  ';
  const result=parse(receipt({items:[item({rawDescription:raw,normalizedName:'Weber Grill 48-inch Z999'})]}));
  assert.equal(result.items[0].rawDescription,raw);assert.equal(result.items[0].normalizedName,'Weber Grill');
  assert.ok(result.items[0].uncertaintyFlags.includes('ambiguousName'));
  const sku=parse(receipt({items:[item({rawDescription:'12345',normalizedName:'Brand Model 12345'})]}));
  const skuWithPrice=parse(receipt({items:[item({rawDescription:'SKU 12345 $99.00',normalizedName:'Invented Model 12345'})]}));assert.equal(skuWithPrice.items[0].normalizedName,null);assert.equal(skuWithPrice.items[0].isHouseholdAsset,false);
  assert.equal(sku.items[0].normalizedName,null);assert.equal(sku.items[0].isHouseholdAsset,false);
  assert.equal(parse(receipt({items:[item({normalizedName:'Ryobi 18V Drill Kit'})]})).items[0].normalizedName,'Ryobi 18V Drill Kit');
});
test('item roles are validated and non-durable roles never recommend standalone inventory', () => {
  for(const role of ['consumable','maintenance_supply','replacement_part','service','food','apparel','other']) {
    const result=parse(receipt({items:[item({itemRole:role})]}));assert.equal(result.items[0].isHouseholdAsset,false,role);
  }
  assert.equal(parse(receipt({items:[item({itemRole:'durable_asset'})]})).items[0].isHouseholdAsset,true);
  const food = parse(receipt({items:[item({category:'grocery',itemRole:'consumable',isHouseholdAsset:false})]})); assert.equal(food.items[0].itemRole,'food'); assert.ok(food.reviewSignals.some(signal=>signal.code==='role_reconciled'));
  assert.throws(()=>parse(receipt({items:[item({itemRole:'unbounded_taxonomy'})]})),error=>error.code==='invalid_schema');
});
test('refund and mixed receipts exclude refunded products; coupons are not returns', () => {
  const refund=parse(receipt({receiptType:'return',subtotalMinor:-9900,totalMinor:-9900,items:[item({totalPriceMinor:-9900,unitPriceMinor:-9900})]}));
  assert.equal(refund.receiptType,'return');assert.equal(reviewFromReceipt(refund).items[0].selected,false);
  const mixed=parse(receipt({items:[item({}),item({rawDescription:'RETURN TV',totalPriceMinor:-20000})]}));assert.equal(mixed.receiptType,'mixed');assert.equal(mixed.items[1].isHouseholdAsset,false);
  const discount=parse(receipt({items:[item({}),item({rawDescription:'COUPON',itemRole:'other',totalPriceMinor:-500,unitPriceMinor:-500})]}));assert.equal(discount.receiptType,'purchase');assert.equal(discount.items[1].isHouseholdAsset,false);
  for (const label of ['DISC','PROMO','REBATE']) assert.equal(parse(receipt({items:[item({}),item({rawDescription:label,totalPriceMinor:-500,itemRole:'other'})]})).receiptType,'purchase');
  const explicitReturn=parse(receipt({receiptType:'return',items:[item({totalPriceMinor:null})]}));assert.equal(explicitReturn.items[0].isHouseholdAsset,false);
});
test('duplicates are retained; price continuations join only a missing-price predecessor; summary rows removed', () => {
  const duplicate=parse(receipt({items:[item({}),item({})]}));assert.equal(duplicate.items.length,2);assert.ok(duplicate.reviewSignals.some(s=>s.code==='duplicate_line'&&s.itemIndex===1));
  const multiline=parse(receipt({items:[item({totalPriceMinor:null,unitPriceMinor:null}),item({rawDescription:'2 x $99.00',quantity:2,totalPriceMinor:19800}),item({rawDescription:'SUBTOTAL $198.00',totalPriceMinor:19800})]}));
  assert.equal(multiline.items.length,1);assert.equal(multiline.items[0].quantity,2);assert.equal(multiline.items[0].totalPriceMinor,19800);assert.match(multiline.items[0].rawDescription,/\n2 x/);
  assert.ok(multiline.reviewSignals.some(s=>s.code==='multiline_joined'));assert.ok(multiline.reviewSignals.some(s=>s.code==='summary_line_removed'));
  const joinedRefund=parse(receipt({items:[item({rawDescription:'RETURN DRILL',totalPriceMinor:null,unitPriceMinor:null}),item({rawDescription:'-$99.00',totalPriceMinor:-9900}),item({rawDescription:'NEW VACUUM',totalPriceMinor:14900})]}));assert.equal(joinedRefund.receiptType,'mixed');assert.equal(joinedRefund.items[0].isHouseholdAsset,false);
  const notMerged=parse(receipt({items:[item({}),item({rawDescription:'$99.00'})]}));assert.equal(notMerged.items.length,2);
  const namedProduct=parse(receipt({items:[item({rawDescription:'Tax Software'})]}));assert.equal(namedProduct.items.length,1);
});
test('negative and zero money remains integer cents; quantity arithmetic warns without inventing totals', () => {
  assert.equal(quantityAmount(199,2),398);assert.equal(quantityAmount(400,.125),50);assert.equal(quantityAmount(199,.5),null);
  const zero=parse(receipt({items:[item({totalPriceMinor:0,unitPriceMinor:0})]}));assert.equal(zero.items[0].totalPriceMinor,0);
  const mismatch=parse(receipt({totalMinor:null,subtotalMinor:1,items:[item({quantity:2})]}));const warnings=receiptQuality(mismatch).warnings.map(s=>s.code);
  assert.ok(warnings.includes('quantity_price_mismatch'));assert.ok(warnings.includes('missing_total'));assert.ok(warnings.includes('item_total_mismatch'));
  const receiptMismatch=parse(receipt({taxMinor:100,totalMinor:9900}));assert.ok(receiptQuality(receiptMismatch).warnings.some(s=>s.code==='total_mismatch'));
});
test('uncertainty flags are bounded, preserved for review and cannot contain arbitrary provider prose', () => {
  const result=parse(receipt({items:[item({uncertaintyFlags:['ambiguousName','inferredCategory','uncertainAssetClassification']})]}));
  assert.equal(result.items[0].isHouseholdAsset,false);
  const codes=receiptQuality(result).warnings.map(s=>s.code);for(const code of ['ambiguous_name','inferred_category','uncertain_asset']) assert.ok(codes.includes(code));
  assert.throws(()=>parse(receipt({items:[item({uncertaintyFlags:['provider_secret']})]})),error=>error.code==='invalid_schema');
  assert.throws(()=>normalizeReceipt({...result,receiptType:'fake'}));
});
test('reviewed role/type persist while raw date and model flags remain transient; corrections remain authoritative', async () => {
  const db=new Database(':memory:');db.pragma('foreign_keys = ON');
  try {
    for(const name of ['007_receipts_and_inventory.sql','008_receipt_save_requests.sql','009_receipt_intelligence.sql', '010_household_ownership.sql']) db.exec(await readFile(new URL('../db/migrations/'+name,import.meta.url),'utf8'));
    const original=parse(receipt({items:[item({uncertaintyFlags:['ambiguousName']})]}));const review=reviewFromReceipt(original);review.receiptType='mixed';review.items[0].itemRole='replacement_part';review.items[0].name='Reviewed Drill';review.items[0].selected=true;
    const data=reviewedReceipt(original,review);const result=createReceiptRepository(db, DEVELOPMENT_HOUSEHOLD_ID).saveReviewed(data,[0],randomUUID(),'upload');
    assert.equal(result.receipt.receiptType,'mixed');assert.equal(result.receipt.items[0].itemRole,'replacement_part');assert.equal(result.inventory[0].name,'Reviewed Drill');
    assert.equal('rawDateText' in result.receipt,false);assert.equal('uncertaintyFlags' in result.receipt.items[0],false);assert.deepEqual(db.pragma('foreign_key_check'),[]);
  } finally {db.close();}
});
test('evaluation compares partial fields independently, aligns duplicates one-to-one and counts extra/missing lines', () => {
  const actual=parse(receipt({items:[item({}),item({rawDescription:'PPR TWL',normalizedName:'Paper towels',itemRole:'consumable',category:'consumable',isHouseholdAsset:false,totalPriceMinor:400}),item({})]}));
  const expected={merchant:'EXAMPLE HARDWARE',purchaseDate:'2026-10-01',totalMinor:9900,items:[{rawDescription:'RYB 18V DRL KT',totalPriceMinor:9900,isHouseholdAsset:true},{rawDescription:'RYB 18V DRL KT',totalPriceMinor:9900,isHouseholdAsset:true},{rawDescription:'PPR TWL',normalizedName:'Paper Towels',quantity:1,itemRole:'consumable',category:'consumable',isHouseholdAsset:false}]};
  const comparison=compareReceipt(actual,expected);assert.equal(comparison.metrics.itemCapture.passed,3);assert.deepEqual(comparison.items.map(i=>i.actualIndex),[0,2,1]);assert.equal(comparison.metrics.isHouseholdAsset.passed,3);assert.equal('taxMinor' in comparison.metrics,false);
  const withPrice = { ...actual, items:[{...actual.items[0],rawDescription:'RYB 18V DRL KT $99.00'}] };
  const priceAligned = compareReceipt(withPrice,{items:[{rawDescription:'RYB 18V DRL KT',totalPriceMinor:9900}]});assert.equal(priceAligned.metrics.itemCapture.passed,1);assert.equal(priceAligned.metrics.rawDescription.failed,1);assert.equal(priceAligned.metrics.totalPriceMinor.passed,1);
  assert.equal(compareReceipt(actual,{totalMinor:null}).metrics.totalMinor.failed,1);
  assert.equal(compareReceipt(actual,{items:[{rawDescription:'MISSING PRODUCT',quantity:1}]}).metrics.itemCapture.failed,1);
  assert.equal(compareReceipt(undefined,expected).metrics.merchant.failed,1);
  const aggregate=aggregateEvaluations([{comparison,durationMs:10,receipt:actual,quality:{warnings:[]}},{comparison:compareReceipt(actual,{totalMinor:0}),durationMs:30,error:'failed'}]);assert.equal(aggregate.metrics.totalMinor.total,2);assert.equal(aggregate.metrics.totalMinor.failed,1);assert.equal(aggregate.errors,1);assert.equal(aggregate.durationMs.median,20);
});
test('name comparison and expected schema are deterministic, explicit and reject bad data', () => {
  assert.equal(nameSimilarity('RYOBI Drill Kit','ryobi drill kit'),1);assert.ok(nameSimilarity('Drill','Refrigerator')<.85);
  const actual=parse(receipt({items:[item({normalizedName:'Cordless Drill'})]}));
  assert.equal(compareReceipt(actual,{items:[{rawDescription:'RYB 18V DRL KT',normalizedName:'Ryobi Drill Kit',acceptableNames:['Cordless Drill']}]}).metrics.normalizedName.passed,1);
  for(const expected of [{items:[{}]},{totalMinor:99.5},{items:[{rawDescription:'X',quantity:0}]},{purchaseDate:'2026-02-30'},{total:123},{items:[{rawDescription:'X',isHouseholdAsset:'true'}]}]) assert.throws(()=>validateExpected(expected));
});
test('evaluation discovers five images, ignores symlinks, continues errors, clears inputs, and never writes DB/images', async () => {
  const dir=await mkdtemp(join(tmpdir(),'movein-eval-test-'));const inputs=[];
  try {
    for(let i=1;i<=5;i++) {await writeFile(join(dir,`receipt-${i}.png`),png);await writeFile(join(dir,`receipt-${i}.expected.json`),JSON.stringify({merchant:'Example Hardware',items:[{rawDescription:'RYB 18V DRL KT',isHouseholdAsset:true}]}));}
    await symlink(join(dir,'receipt-1.png'),join(dir,'skip.png'));await writeFile(join(dir,'ignored.pdf'),'%PDF');
    const run=await evaluateDirectory(dir,{extract:async input=>{inputs.push(input);if(inputs.length===3) throw new Error('Mock unavailable');return {receipt:parse(receipt({})),quality:{status:'needs_review',warnings:[]}};}});
    assert.equal(run.summary.receiptCount,5);assert.equal(run.summary.errors,1);assert.equal(run.summary.metrics.merchant.failed,1);assert.equal(run.summary.metrics.isHouseholdAsset.passed,4);
    for(const input of inputs) assert.equal(input.content.bytes.length,0);
    assert.equal((await readFile(join(dir,'receipt-1.png'))).length,png.length);assert.equal(JSON.stringify(run).includes(Buffer.from(png).toString('base64')),false);
  } finally {await rm(dir,{recursive:true,force:true});}
});
test('prompt selection uses separate versioned schemas and mocked HTTP without any model pull', async () => {
  assert.equal(receiptPrompt('movein-receipt-v1').schema.properties.receiptType,undefined);assert.ok(receiptPrompt('movein-receipt-v2').schema.properties.receiptType);
  assert.throws(()=>receiptExtractorConfig({RECEIPT_EXTRACTOR:'ollama',OLLAMA_RECEIPT_MODEL:'local',RECEIPT_PROMPT_VERSION:'v3'}));
  for(const version of ['movein-receipt-v1','movein-receipt-v2']) {
    const calls=[];const config=receiptExtractorConfig({NODE_ENV:'development',RECEIPT_EXTRACTOR:'ollama',OLLAMA_RECEIPT_MODEL:'local',RECEIPT_PROMPT_VERSION:version});
    const extract=createOllamaExtractor(config,async(url,options)=>{calls.push({url,body:JSON.parse(options.body)});return new Response(JSON.stringify(url.endsWith('/api/show')?{capabilities:['vision']}:{done:true,message:{content:JSON.stringify(receipt({}))}}));});
    await extract.extract({sourceType:'upload',content:{kind:'file',mediaType:'image/png',bytes:png}});assert.deepEqual(calls[1].body.format,receiptPrompt(version).schema);assert.ok(calls[1].body.messages[0].content.includes(version));assert.equal(calls.some(c=>c.url.includes('/pull')),false);
  }
});

test('CLI uses mocked local HTTP for five receipts, creates private reports, refuses overwrite and never opens SQLite', async () => {
  const { createServer } = await import('node:http');
  const { execFile } = await import('node:child_process');
  const { stat } = await import('node:fs/promises');
  const root=await mkdtemp(join(tmpdir(),'movein-eval-cli-'));let requests=0;
  const server=createServer((request,response)=>{requests++;request.resume();response.setHeader('Content-Type','application/json');response.end(JSON.stringify(request.url==='/api/show'?{capabilities:['vision']}:{done:true,message:{content:JSON.stringify(receipt({}))}}));});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const report=join(root,'reports','evaluation.json');
  const env={...process.env,NODE_ENV:'development',RECEIPT_EXTRACTOR:'ollama',OLLAMA_BASE_URL:`http://127.0.0.1:${server.address().port}`,OLLAMA_RECEIPT_MODEL:'mock-local-vision',RECEIPT_PROMPT_VERSION:'movein-receipt-v2',DATABASE_PATH:join(root,'must-not-exist.sqlite')};
  const run=(overrides={})=>new Promise(resolve=>execFile(process.execPath,['scripts/receipt-eval.mjs',root,'--report',report],{cwd:new URL('..',import.meta.url),env:{...env,...overrides},timeout:10000},(error,stdout,stderr)=>resolve({code:error?.code??0,stdout,stderr})));
  try {
    for(let index=1;index<=5;index++){await writeFile(join(root,`r${index}.png`),png);await writeFile(join(root,`r${index}.expected.json`),JSON.stringify({merchant:'Example Hardware',totalMinor:9900,items:[{rawDescription:'RYB 18V DRL KT',quantity:1,isHouseholdAsset:true}]}));}
    const success=await run();assert.equal(success.code,0,success.stderr);assert.equal(requests,10);
    const original=await readFile(report,'utf8'),result=JSON.parse(original);assert.equal(result.summary.receiptCount,5);assert.equal(result.promptVersion,'movein-receipt-v2');assert.equal(result.summary.metrics.isHouseholdAsset.passed,5);
    if(process.platform!=='win32') assert.equal((await stat(report)).mode&0o777,0o600);
    await assert.rejects(stat(env.DATABASE_PATH),error=>error.code==='ENOENT');
    const overwrite=await run();assert.equal(overwrite.code,1);assert.equal(await readFile(report,'utf8'),original);
    const before=requests;assert.equal((await run({NODE_ENV:'production'})).code,1);assert.equal(requests,before);assert.equal((await run({RECEIPT_EXTRACTOR:'demo'})).code,1);assert.equal(requests,before);
  } finally {await new Promise(resolve=>server.close(resolve));await rm(root,{recursive:true,force:true});}
});
test('malformed sidecars are errors, other files still evaluate, and empty corpora fail clearly', async () => {
  const root=await mkdtemp(join(tmpdir(),'movein-eval-invalid-'));
  try {
    await assert.rejects(evaluateDirectory(root),/No JPG/);
    await writeFile(join(root,'bad.png'),png);await writeFile(join(root,'bad.expected.json'),'{');await writeFile(join(root,'good.png'),png);
    let calls=0;const result=await evaluateDirectory(root,{extract:async()=>{calls++;return {receipt:parse(receipt({})),quality:{warnings:[]}};}});
    assert.equal(calls,1);assert.equal(result.summary.errors,1);assert.equal(result.results[0].error,'Expected JSON is malformed.');assert.equal(result.summary.withExpectations,0);
  } finally {await rm(root,{recursive:true,force:true});}
});
