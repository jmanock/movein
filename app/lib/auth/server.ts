import type Database from 'better-sqlite3';
import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import { getDatabase } from '../../../db/index.ts';
import { authConfig, type AuthConfig } from './config.ts';
import { authEmailSender, type AuthEmailSender } from './email.ts';
import { ensureUserHousehold } from './membership.ts';

export function createMoveInAuth(database: Database.Database, config: AuthConfig, sender: AuthEmailSender = authEmailSender(config)) {
  return betterAuth({
    appName: 'MoveIn', database, secret: config.secret, baseURL: config.origin,
    trustedOrigins: [config.origin], telemetry: { enabled: false }, logger: { disabled: true },
    user: { modelName: 'auth_user' }, account: { modelName: 'auth_account' },
    session: { modelName: 'auth_session', expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24, cookieCache: { enabled: false }, storeSessionInDatabase: true },
    verification: { modelName: 'auth_verification' },
    emailAndPassword: { enabled: false },
    advanced: { useSecureCookies: config.production, defaultCookieAttributes: { httpOnly: true, sameSite: 'lax', secure: config.production }, ipAddress: { ipAddressHeaders: ['x-real-ip'] } },
    rateLimit: { enabled: true, storage: 'database', modelName: 'auth_rate_limit', window: 60, max: 100 },
    databaseHooks: { session: { create: { before: async (session) => { ensureUserHousehold(database, session.userId); return { data: session }; } } } },
    plugins: [magicLink({ expiresIn: 600, storeToken: 'hashed', rateLimit: { window: 60, max: 5 }, sendMagicLink: async ({ email, url }) => sender({ email, url }) })],
  });
}
let cached: { database: Database.Database; key: string; auth: ReturnType<typeof createMoveInAuth> } | undefined;
export function getAuth(database = getDatabase()) {
  const config = authConfig();
  const key = JSON.stringify(config);
  if (!cached || cached.database !== database || cached.key !== key) cached = { database, key, auth: createMoveInAuth(database, config) };
  return cached.auth;
}
