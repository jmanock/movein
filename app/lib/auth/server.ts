import type Database from 'better-sqlite3';
import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { getDatabase } from '../../../db/index.ts';
import { authConfig, type AuthConfig } from './config.ts';
import { ensureUserHousehold } from './membership.ts';

export function moveInAuthOptions(database: Database.Database, config: AuthConfig): BetterAuthOptions {
  return {
    appName: 'MoveIn', database, secret: config.secret, baseURL: config.origin,
    trustedOrigins: [config.origin], telemetry: { enabled: false }, logger: { disabled: true },
    user: { modelName: 'auth_user' }, account: { modelName: 'auth_account' },
    session: { modelName: 'auth_session', expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24, cookieCache: { enabled: false }, storeSessionInDatabase: true },
    verification: { modelName: 'auth_verification' },
    emailAndPassword: { enabled: true, disableSignUp: true, autoSignIn: false, requireEmailVerification: true, minPasswordLength: 12, maxPasswordLength: 128, revokeSessionsOnPasswordReset: true },
    advanced: { useSecureCookies: config.production, defaultCookieAttributes: { httpOnly: true, sameSite: 'lax', secure: config.production }, ipAddress: { ipAddressHeaders: ['x-real-ip'] } },
    rateLimit: { enabled: true, storage: 'database', modelName: 'auth_rate_limit', window: 60, max: 100, customRules: { '/sign-in/email': { window: 60, max: 5 } } },
    databaseHooks: { session: { create: { before: async (session) => { ensureUserHousehold(database, session.userId); return { data: session }; } } } },
  };
}
export function createMoveInAuth(database: Database.Database, config: AuthConfig) {
  return betterAuth(moveInAuthOptions(database, config));
}
let cached: { database: Database.Database; key: string; auth: ReturnType<typeof createMoveInAuth> } | undefined;
export function getAuth(database = getDatabase()) {
  const config = authConfig();
  const key = JSON.stringify(config);
  if (!cached || cached.database !== database || cached.key !== key) cached = { database, key, auth: createMoveInAuth(database, config) };
  return cached.auth;
}
