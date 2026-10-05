export type AuthConfig = { secret: string; origin: string; production: boolean; emailMode: 'disabled' | 'console' | 'smtp'; smtp?: { host: string; port: number; secure: boolean; user: string; pass: string; from: string } };
export function authConfig(env: NodeJS.ProcessEnv = process.env): AuthConfig {
  const production = env.NODE_ENV === 'production';
  if (!env.BETTER_AUTH_SECRET || env.BETTER_AUTH_SECRET.length < 32) throw new Error('Authentication needs a secret of at least 32 characters.');
  if (production && (env.BETTER_AUTH_SECRET.trim() !== env.BETTER_AUTH_SECRET || new Set(env.BETTER_AUTH_SECRET).size < 8)) throw new Error('Production authentication requires a random secret.');
  const url = new URL(env.BETTER_AUTH_URL ?? '');
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash || (production ? url.protocol !== 'https:' : !['http:', 'https:'].includes(url.protocol))) throw new Error('Authentication needs a valid base URL (HTTPS in production).');
  if (production && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new Error('Production authentication requires the public HTTPS origin.');
  if (!production && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new Error('Development authentication requires a loopback URL.');
  return { secret: env.BETTER_AUTH_SECRET, origin: url.origin, production, emailMode: 'disabled' };
}

/** Reserved delivery configuration for a future, separately enabled onboarding upgrade. */
export function futureAuthEmailConfig(env: NodeJS.ProcessEnv = process.env): AuthConfig {
  const { secret, origin, production } = authConfig(env);
  if (env.AUTH_EMAIL_MODE === 'console') {
    if (env.NODE_ENV !== 'development' || env.AUTH_DEV_LOG_MAGIC_LINKS !== 'true') throw new Error('Local sign-in link logging requires explicit development opt-in.');
    return { secret, origin, production, emailMode: 'console' };
  }
  if (env.AUTH_SMTP_SECURE && !['true', 'false'].includes(env.AUTH_SMTP_SECURE)) throw new Error('SMTP TLS mode must be true or false.');
  if (/[\r\n]/.test(env.AUTH_EMAIL_FROM ?? '') || !/@[^<>\s]+/.test(env.AUTH_EMAIL_FROM ?? '')) throw new Error('SMTP requires a valid sender address.');
  const port = Number(env.AUTH_SMTP_PORT);
  if (env.AUTH_EMAIL_MODE !== 'smtp' || !env.AUTH_SMTP_HOST || !Number.isInteger(port) || port < 1 || port > 65535 || !env.AUTH_SMTP_USER || !env.AUTH_SMTP_PASS || !env.AUTH_EMAIL_FROM) throw new Error('Authentication email delivery is not configured.');
  return { secret, origin, production, emailMode: 'smtp', smtp: { host: env.AUTH_SMTP_HOST, port, secure: env.AUTH_SMTP_SECURE === 'true', user: env.AUTH_SMTP_USER, pass: env.AUTH_SMTP_PASS, from: env.AUTH_EMAIL_FROM } };
}
