import type Database from 'better-sqlite3';
import { getDatabase } from '../../../db/index.ts';
import { developmentRequestAllowed } from '../receipts/http.ts';
import { DEVELOPMENT_HOUSEHOLD_ID } from './constants.ts';
import { getAuth } from '../auth/server.ts';
import { authConfig } from '../auth/config.ts';

export type HouseholdContext = Readonly<{ householdId: string; access: 'authenticated' | 'local-development' }>;

/** Only signed, unexpired database sessions and verified database memberships grant access. */
export async function getCurrentHousehold(request: Request, database?: Database.Database): Promise<HouseholdContext | null> {
  try {
    const config = authConfig();
    if (!['GET', 'HEAD'].includes(request.method) && (request.headers.get('origin') !== config.origin || request.headers.get('sec-fetch-site') === 'cross-site')) return null;
    const db = database ?? getDatabase();
    const session = await getAuth(db).api.getSession({ headers: request.headers });
    if (session) {
      if (!session.user.emailVerified) return null;
      const membership = db.prepare('SELECT m.household_id FROM household_memberships m JOIN households h ON h.id = m.household_id WHERE m.user_id = ?').get(session.user.id) as { household_id: string } | undefined;
      if (!membership || membership.household_id === DEVELOPMENT_HOUSEHOLD_ID) return null;
      return Object.freeze({ householdId: membership.household_id, access: 'authenticated' });
    }
    // With real auth configured, missing or revoked sessions never inherit legacy records.
    return null;
  } catch {
    // Configuration/database failures fail closed. Explicit legacy mode has no real auth configured.
    if (process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_URL) return null;
  }
  if (process.env.AUTH_DEV_HOUSEHOLD !== 'true' || !developmentRequestAllowed(request)) return null;
  const db = database ?? getDatabase();
  if (!db.prepare('SELECT id FROM households WHERE id = ?').get(DEVELOPMENT_HOUSEHOLD_ID)) return null;
  return Object.freeze({ householdId: DEVELOPMENT_HOUSEHOLD_ID, access: 'local-development' });
}
