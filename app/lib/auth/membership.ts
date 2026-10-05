import type Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import { DEVELOPMENT_HOUSEHOLD_ID } from '../households/constants.ts';
export function ensureUserHousehold(database: Database.Database, userId: string): string {
  return database.transaction(() => {
    const user = database.prepare('SELECT id, emailVerified FROM auth_user WHERE id = ?').get(userId) as { id: string; emailVerified: number } | undefined;
    if (!user?.emailVerified) throw new Error('A verified user is required');
    const existing = database.prepare('SELECT household_id FROM household_memberships WHERE user_id = ?').get(userId) as { household_id: string } | undefined;
    if (existing) {
      if (existing.household_id === DEVELOPMENT_HOUSEHOLD_ID) throw new Error('Legacy household is not an authenticated household');
      return existing.household_id;
    }
    const id = randomUUID();
    database.prepare("INSERT INTO households (id, display_name) VALUES (?, 'My Home')").run(id);
    database.prepare('INSERT INTO household_memberships (user_id, household_id) VALUES (?, ?)').run(userId, id);
    return id;
  })();
}
