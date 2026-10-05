import { loadNextEnvironment } from './lib/next-env.mjs';
import { authConfig } from '../app/lib/auth/config.ts';
import { receiptReadiness } from '../app/lib/receipts/readiness.ts';
import { resolveDatabasePath } from './lib/database.mjs';
import Database from 'better-sqlite3';
import { stat, readdir } from 'node:fs/promises';
import { dirname } from 'node:path';
process.env.NODE_ENV = 'production';
loadNextEnvironment(process.cwd());
let failed = false;
async function check(label, fn) { try { const result = await fn(); if (result === false) throw new Error(); console.log(`PASS ${label}`); } catch { failed = true; console.log(`FAIL ${label}`); } }
await check('HTTPS auth origin, secret requirements, SMTP sender and TLS configuration (delivery still needs manual verification)', () => { authConfig(); });
await check('development flags and analytics debug disabled', () => !['AUTH_DEV_LOG_MAGIC_LINKS','AUTH_DEV_HOUSEHOLD','RECEIPT_EXTRACTION_DEBUG','NEXT_PUBLIC_GA_DEBUG','NEXT_PUBLIC_GA_ENABLE_DEV'].some(key => process.env[key] === 'true'));
await check('explicit persistent database, owner-only directory/file permissions, integrity, foreign keys and migrations', async () => {
  const path = resolveDatabasePath();
  for (const file of [path, dirname(path)]) { const info = await stat(file); if (info.mode & 0o077) throw new Error(); }
  const db = new Database(path, { readonly: true, fileMustExist: true });
  try {
    if (db.pragma('integrity_check', { simple: true }) !== 'ok' || db.pragma('foreign_key_check').length) throw new Error();
    const applied = new Set(db.prepare('SELECT name FROM schema_migrations').all().map(row => row.name));
    for (const name of (await readdir('db/migrations')).filter(name => name.endsWith('.sql'))) if (!applied.has(name)) throw new Error();
  } finally { db.close(); }
});
await check('explicit extractor choice: disabled, or reachable installed local vision model', async () => {
  if (process.env.RECEIPT_EXTRACTOR === 'disabled') return true;
  return process.env.RECEIPT_EXTRACTOR === 'ollama' && (await receiptReadiness()).available;
});
await check('analytics ID present and debug disabled', () => /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''));
if (failed) process.exitCode = 1;
