import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
const port = process.env.AUTH_DEV_PORT ?? '3007';
if (!/^\d+$/.test(port) || Number(port) < 1024 || Number(port) > 65535) throw new Error('AUTH_DEV_PORT must be 1024–65535');
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1', '--port', port], { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'development', BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || randomBytes(48).toString('base64url'), BETTER_AUTH_URL: `http://127.0.0.1:${port}`, AUTH_EMAIL_MODE: 'disabled', AUTH_DEV_LOG_MAGIC_LINKS: 'false', AUTH_DEV_HOUSEHOLD: 'false' } });
console.info(`Local sign-in: http://127.0.0.1:${port}/sign-in — use npm run user:create with the same local database and stable secret. Restarting with an ephemeral secret signs out existing sessions.`);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code) => process.exit(code ?? 0));
