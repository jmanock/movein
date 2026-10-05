import assert from 'node:assert/strict';
import { loadNextEnvironment } from './lib/next-env.mjs';
import { resolveDatabasePath } from './lib/database.mjs';
import Database from 'better-sqlite3';
loadNextEnvironment(process.cwd());
const base = new URL(process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3006');
if (base.username || base.password || base.search || base.hash || base.pathname !== '/') throw new Error('SMOKE_BASE_URL must be a root origin');
const checks = [['/',200],['/lookup/32801',200],['/api/lookup?zip=32801',200],['/sign-in',200],['/api/auth-status',200],['/my-home',307],['/receipts',307],['/api/my-home',401],['/api/receipts/process',401],['/api/receipts/save',401]];
for (const [path, status] of checks) {
  const post = path === '/api/receipts/process' || path === '/api/receipts/save';
  const response = await fetch(new URL(path, base), { method: post ? 'POST' : 'GET', redirect: 'manual', signal: AbortSignal.timeout(10000) });
  assert.equal(response.status,status,`Unexpected HTTP status for ${path}`);
  if (status === 307) assert.equal(response.headers.get('location'),`/sign-in?next=${encodeURIComponent(path)}`);
  if (status === 401) { assert.equal(response.headers.get('cache-control'),'no-store'); assert.deepEqual(Object.keys(await response.json()),['error']); }
  if (path === '/api/auth-status') assert.deepEqual(await response.json(),{authenticated:false});
  console.log(`PASS ${path} (${status})`);
}
const db = new Database(resolveDatabasePath(), { readonly: true, fileMustExist: true });
try { assert.equal(db.pragma('integrity_check',{simple:true}),'ok'); assert.deepEqual(db.pragma('foreign_key_check'),[]); db.prepare('SELECT id FROM households LIMIT 1').get(); console.log('PASS local configured database, integrity and foreign keys (read-only)'); } finally { db.close(); }
console.log('Smoke passed. No mail, uploads, sign-ins, migrations or user-record writes performed. Check extractor state with npm run production:check.');
