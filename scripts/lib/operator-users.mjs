// Operator-only: never import this module into an app route or browser bundle.
import { betterAuth } from 'better-auth';
import { moveInAuthOptions } from '../../app/lib/auth/server.ts';
import { ensureUserHousehold } from '../../app/lib/auth/membership.ts';

function emailIdentifier(email) {
  const normalized = email.trim().toLowerCase();
  if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error('Enter a valid email address.');
  return normalized;
}
function passwordPolicy(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) throw new Error('Password must contain 12–128 characters.');
}
function operatorAuth(database, config, onReset = async () => {}) {
  const options = moveInAuthOptions(database, config);
  // This instance has no HTTP handler mounted. Only the CLI calls these supported APIs.
  return betterAuth({ ...options, emailAndPassword: { ...options.emailAndPassword, disableSignUp: false, sendResetPassword: onReset } });
}
export async function provisionUser(database, config, email, password) {
  email = emailIdentifier(email); passwordPolicy(password);
  const auth = operatorAuth(database, config);
  const context = await auth.$context;
  let existing = await context.internalAdapter.findUserByEmail(email);
  const created = !existing;
  if (!existing) {
    await auth.api.signUpEmail({ body: { email, password, name: 'MoveIn user' } });
    // Re-read after creation: safe on a simultaneous retry or an interrupted earlier run.
    existing = await context.internalAdapter.findUserByEmail(email);
  }
  if (!existing || !await context.internalAdapter.findCredentialAccount(existing.user.id)) throw new Error('Account needs an operator password reset before provisioning can finish.');
  // Operator approval stands in for inbox verification; no email is sent.
  await context.internalAdapter.updateUser(existing.user.id, { emailVerified: true });
  const householdId = ensureUserHousehold(database, existing.user.id);
  return { email, householdId, created };
}
export async function resetUserPassword(database, config, email, newPassword) {
  email = emailIdentifier(email); passwordPolicy(newPassword);
  let token;
  const auth = operatorAuth(database, config, async (reset) => { token = reset.token; });
  const context = await auth.$context;
  const existing = await context.internalAdapter.findUserByEmail(email);
  if (!existing) throw new Error('Account does not exist.');
  try {
    await auth.api.requestPasswordReset({ body: { email } });
    if (!token) throw new Error('Password reset could not be prepared.');
    await auth.api.resetPassword({ body: { token, newPassword } });
    return { email };
  } finally {
    // Reset consumes the token. Also clean it up after failure; never print it or its URL.
    if (token) await context.internalAdapter.deleteVerificationByIdentifier(`reset-password:${token}`);
    token = undefined;
  }
}
export function listUsers(database) {
  return database.prepare(`SELECT u.email, u.createdAt AS created, m.household_id AS household,
    CASE WHEN u.emailVerified = 1 AND a.id IS NOT NULL AND m.household_id IS NOT NULL THEN 'approved' ELSE 'incomplete' END AS state
    FROM auth_user u LEFT JOIN household_memberships m ON m.user_id = u.id
    LEFT JOIN auth_account a ON a.userId = u.id AND a.providerId = 'credential' ORDER BY u.createdAt, u.email`).all();
}
