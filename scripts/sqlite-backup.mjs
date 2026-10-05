import Database from 'better-sqlite3';
import { mkdir, chmod, access, rm, open } from 'node:fs/promises';
import { resolve, dirname, isAbsolute } from 'node:path';
import { loadNextEnvironment } from './lib/next-env.mjs';
import { resolveDatabasePath } from './lib/database.mjs';
loadNextEnvironment(process.cwd());
const source = resolveDatabasePath();
const destination = process.argv[2];
if (!destination || !isAbsolute(destination) || resolve(destination) === resolve(source)) throw new Error('Supply a new absolute backup filename, distinct from DATABASE_PATH');
await access(source);
try { await access(destination); throw new Error('Backup destination already exists; refusing overwrite'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
await mkdir(dirname(destination), { recursive: true, mode: 0o700 });
const database = new Database(source, { readonly: true, fileMustExist: true });
let reserved = false;
try {
  const reservation = await open(destination, 'wx', 0o600);
  reserved = true; await reservation.close();
  await database.backup(destination);
  await chmod(destination, 0o600);
  const copy = new Database(destination, { readonly: true, fileMustExist: true });
  try {
    if (copy.pragma('integrity_check', { simple: true }) !== 'ok' || copy.pragma('foreign_key_check').length) throw new Error('Backup integrity verification failed');
  } finally { copy.close(); }
  console.log('SQLite online backup complete; integrity and foreign keys passed. File mode 0600.');
} catch (error) {
  if (reserved) await rm(destination, { force: true });
  throw error;
} finally { database.close(); }
