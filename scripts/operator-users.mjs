import { createInterface, emitKeypressEvents } from 'node:readline';
import Database from 'better-sqlite3';
import { loadNextEnvironment } from './lib/next-env.mjs';
import { resolveDatabasePath } from './lib/database.mjs';
loadNextEnvironment(process.cwd());
process.umask(0o077);
const command = process.argv[2];
if (process.argv.length !== 3 || !['create','list','reset-password'].includes(command)) {
  console.error('Use npm run user:create, user:list, or user:reset-password. Credentials must never be command-line arguments.');
  process.exit(1);
}
let database;
async function hiddenPassword(label) {
  process.stdout.write(label);
  emitKeypressEvents(process.stdin);
  const wasRaw = process.stdin.isRaw;
  process.stdin.setRawMode(true); process.stdin.resume();
  return new Promise((resolve, reject) => {
    let value = '';
    const finish = (error) => {
      process.stdin.off('keypress', keypress); process.stdin.setRawMode(Boolean(wasRaw)); process.stdin.pause(); process.stdout.write('\n');
      if (error) reject(error); else resolve(value);
      value = '';
    };
    const keypress = (text, key = {}) => {
      if (key.ctrl && key.name === 'c') return finish(new Error('Cancelled.'));
      if (key.name === 'return' || key.name === 'enter') return finish();
      if (key.name === 'backspace') value = value.slice(0,-1);
      else if (!key.ctrl && !key.meta && text && !/[\x00-\x1f\x7f]/.test(text) && value.length < 129) value += text;
    };
    process.stdin.on('keypress', keypress);
  });
}
try {
  if (command !== 'list' && (!process.stdin.isTTY || !process.stdout.isTTY)) throw new Error('Interactive terminal required; password input is hidden.');
  const { authConfig } = await import('../app/lib/auth/config.ts');
  const config = authConfig();
  const { provisionUser, resetUserPassword, listUsers } = await import('./lib/operator-users.mjs');
  database = new Database(resolveDatabasePath(), { fileMustExist: true });
  database.pragma('foreign_keys = ON'); database.pragma('busy_timeout = 5000');
  if (command === 'list') console.table(listUsers(database));
  else {
    const input = createInterface({ input: process.stdin, output: process.stdout });
    const email = await new Promise(resolve => input.question('Email: ', resolve)); input.close();
    let password = await hiddenPassword(command === 'create' ? 'Initial password (hidden): ' : 'New password (hidden): ');
    let confirmation = await hiddenPassword('Confirm password (hidden): ');
    if (password !== confirmation) throw new Error('Passwords do not match.');
    confirmation = '';
    const result = command === 'create' ? await provisionUser(database, config, email, password) : await resetUserPassword(database, config, email, password);
    password = '';
    console.log(command === 'create' ? `${result.created ? 'Created' : 'Already provisioned'} ${result.email}; household ${result.householdId}. Existing passwords are unchanged on retry.` : `Password updated for ${result.email}; all existing sessions revoked.`);
  }
} catch (error) {
  // Only our fixed operator messages are printable; library errors may contain input data.
  const safe = ['Interactive terminal required; password input is hidden.','Enter a valid email address.','Password must contain 12–128 characters.','Account does not exist.','Passwords do not match.','Cancelled.','Account needs an operator password reset before provisioning can finish.'];
  console.error(safe.includes(error.message) ? error.message : 'Operator command failed. Check protected auth configuration, database access and applied migrations. No credentials were printed.');
  process.exitCode = 1;
} finally { database?.close(); }
