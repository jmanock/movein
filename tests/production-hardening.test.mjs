import assert from 'node:assert/strict';
import test from 'node:test';
import sharp from 'sharp';
import { mkdtemp, readdir, readFile, stat, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import Database from 'better-sqlite3';
import { validateReceiptImage } from '../app/lib/receipts/image-security.ts';
import { createOllamaExtractor } from '../app/lib/receipts/ollama.ts';
import { receiptExtractorConfig } from '../app/lib/receipts/config.ts';
import { receiptReadiness } from '../app/lib/receipts/readiness.ts';
import { createReceiptAdmission } from '../app/lib/receipts/admission.ts';
import { authConfig } from '../app/lib/auth/config.ts';
const image = sharp({create:{width:2,height:2,channels:3,background:'white'}});
const png=await image.png().toBuffer(), jpeg=await image.jpeg().toBuffer();
const env={NODE_ENV:'production',RECEIPT_EXTRACTOR:'ollama',OLLAMA_RECEIPT_MODEL:'vision:local'};
const json = data => new Response(JSON.stringify(data));

test('real JPG/PNG decode succeeds; truncated, mislabeled and compressed pixel bombs are rejected before model contact',async()=>{
  await validateReceiptImage(png,'image/png');await validateReceiptImage(jpeg,'image/jpeg');
  const bomb=Buffer.from(png);bomb.writeUInt32BE(100000,16);bomb.writeUInt32BE(100000,20);
  // Keep IHDR's checksum valid so rejection exercises the pixel cap, not a bad header CRC.
  let crc=0xffffffff;
  for(const byte of bomb.subarray(12,29)){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}
  bomb.writeUInt32BE((crc^0xffffffff)>>>0,29);
  for(const bytes of [png.subarray(0,40),new Uint8Array([137,80,78,71,13,10,26,10,0]),bomb]) {
    let calls=0;await assert.rejects(createOllamaExtractor(receiptExtractorConfig(env),async()=>{calls++;return json({});}).extract({sourceType:'upload',content:{kind:'file',mediaType:'image/png',bytes}}),error=>error.code==='image');assert.equal(calls,0);
  }
  await assert.rejects(validateReceiptImage(jpeg,'image/png'),error=>error.code==='image');
});

test('receipt admission bounds attempts, permits only one active job, releases idempotently and expires windows',()=>{
  const old=process.env.NODE_ENV;process.env.NODE_ENV='production';let time=0;const enter=createReceiptAdmission(()=>time);
  const req=ip=>new Request('https://movein.example/api/receipts/process',{headers:{'x-real-ip':ip}});
  try {
    const first=enter('a',req('192.0.2.1'));assert.equal(first.allowed,true);
    assert.equal(enter('b',req('192.0.2.2')).status,503);first.release();
    const second=enter('b',req('192.0.2.2'));assert.equal(second.allowed,true);first.release();assert.equal(enter('c',req('192.0.2.3')).status,503);second.release();
    const rate=createReceiptAdmission(()=>time);
    for(let i=0;i<5;i++){const a=rate('a',req('192.0.2.4'));assert.equal(a.allowed,true);a.release();}
    assert.equal(rate('a',req('192.0.2.4')).status,429);time=600001;const reset=rate('a',req('192.0.2.4'));assert.equal(reset.allowed,true);reset.release();
    const ips=createReceiptAdmission(()=>time);for(let i=0;i<10;i++){const a=ips('user'+i,req('192.0.2.5'));assert.equal(a.allowed,true);a.release();}assert.equal(ips('another',req('192.0.2.5')).status,429);
  }finally{if(old===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=old;}
});

test('readiness is a bounded metadata-only probe, rejects remote/non-vision models, and disabled/demo production never calls inference',async()=>{
  let calls=0;
  const probe=async(url,options)=>{calls++;assert.ok(url.endsWith('/api/show'));assert.equal(options.body.includes('images'),false);assert.equal(options.redirect,'error');return json({capabilities:['vision']});};
  assert.deepEqual(await receiptReadiness(env,probe),{available:true});assert.equal(calls,1);
  for(const data of [{capabilities:[]},{capabilities:['vision'],remote_host:'external'},{error:'PRIVATE SERVER ERROR'}]) assert.deepEqual(await receiptReadiness(env,async()=>json(data)),{available:false});
  for(const provider of ['disabled','demo',undefined])assert.deepEqual(await receiptReadiness({...env,RECEIPT_EXTRACTOR:provider},async()=>{throw new Error('must not call');}),{available:false});
  assert.deepEqual(await receiptReadiness(env,async()=>new Response('x'.repeat(262145))),{available:false});
  assert.deepEqual(await receiptReadiness(env,async()=>{throw new Error('private filesystem path');}),{available:false});
});

test('production rejects weak secrets, loopback origins, invalid TLS modes and header injection; local console remains opt-in',()=>{
  const base={NODE_ENV:'production',BETTER_AUTH_SECRET:'test-secret-with-sufficient-distinct-characters-123',BETTER_AUTH_URL:'https://movein.example',AUTH_EMAIL_MODE:'smtp',AUTH_SMTP_HOST:'smtp.example',AUTH_SMTP_PORT:'587',AUTH_SMTP_USER:'test',AUTH_SMTP_PASS:'test',AUTH_EMAIL_FROM:'signin@movein.example'};
  assert.equal(authConfig(base).production,true);
  for(const patch of [{BETTER_AUTH_SECRET:'x'.repeat(48)},{BETTER_AUTH_URL:'https://127.0.0.1'},{BETTER_AUTH_URL:'http://movein.example'},{AUTH_SMTP_SECURE:'anything'},{AUTH_EMAIL_FROM:'a@example.com\r\nBcc: b@example.com'},{AUTH_EMAIL_FROM:'missing-address'}])assert.throws(()=>authConfig({...base,...patch}));
  assert.equal(authConfig({...base,NODE_ENV:'development',BETTER_AUTH_SECRET:'x'.repeat(32),BETTER_AUTH_URL:'http://localhost:3007',AUTH_EMAIL_MODE:'console',AUTH_DEV_LOG_MAGIC_LINKS:'true'}).emailMode,'console');
});

test('controlled migrations 007–011 preserve populated purchase data; online WAL backup restores and refuses overwrite',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'movein-release-')),path=join(dir,'source.sqlite'),backup=join(dir,'backup.sqlite');const db=new Database(path);db.pragma('foreign_keys=ON');db.pragma('journal_mode=WAL');
  try {
    db.exec(await readFile('db/migrations/007_receipts_and_inventory.sql','utf8'));
    db.exec("CREATE TABLE schema_migrations (name TEXT PRIMARY KEY, applied_at TEXT DEFAULT CURRENT_TIMESTAMP); INSERT INTO schema_migrations(name) VALUES ('007_receipts_and_inventory.sql')");
    db.prepare("INSERT INTO receipts(id,merchant,currency,source_type,extraction_status) VALUES ('r','Preserved store','USD','upload','reviewed')").run();
    db.prepare("INSERT INTO receipt_items(id,receipt_id,raw_description,quantity) VALUES ('i','r','Preserved item',1)").run();
    db.prepare("INSERT INTO inventory_items(id,source_receipt_id,source_receipt_item_id,name,currency) VALUES ('n','r','i','Preserved item','USD')").run();
    const run=script=>spawnSync(process.execPath,[script,...(script.includes('backup')?[backup]:[])],{env:{...process.env,NODE_ENV:'test',DATABASE_PATH:path},encoding:'utf8'});
    const migrate=run('scripts/db-migrate.mjs');assert.equal(migrate.status,0,migrate.stderr);assert.equal(run('scripts/db-migrate.mjs').status,0);
    assert.equal(db.prepare('SELECT merchant FROM receipts').get().merchant,'Preserved store');assert.equal(db.prepare('SELECT raw_description FROM receipt_items').get().raw_description,'Preserved item');assert.equal(db.prepare('SELECT name FROM inventory_items').get().name,'Preserved item');
    assert.equal(db.prepare('SELECT count(*) n FROM auth_user').get().n,0);assert.equal(db.prepare('SELECT count(*) n FROM schema_migrations').get().n,(await readdir('db/migrations')).filter(name=>name.endsWith('.sql')).length);
    assert.deepEqual(db.pragma('foreign_key_check'),[]);assert.equal(run('scripts/sqlite-backup.mjs').status,0);assert.equal((await stat(backup)).mode&0o777,0o600);assert.notEqual(run('scripts/sqlite-backup.mjs').status,0);
    const restored=new Database(backup,{readonly:true});try{assert.equal(restored.pragma('integrity_check',{simple:true}),'ok');assert.deepEqual(restored.pragma('foreign_key_check'),[]);assert.equal(restored.prepare('SELECT merchant FROM receipts').get().merchant,'Preserved store');assert.equal(restored.prepare('SELECT name FROM inventory_items').get().name,'Preserved item');}finally{restored.close();}
  }finally{db.close();await rm(dir,{recursive:true,force:true});}
});
