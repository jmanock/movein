export async function requestMagicLink(email: string, destination: string) {
  const response = await fetch('/api/auth/sign-in/magic-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, callbackURL: destination, newUserCallbackURL: destination, errorCallbackURL: `/sign-in?next=${encodeURIComponent(destination)}` }) });
  if (!response.ok) throw new Error(response.status === 429 ? 'Too many requests. Please wait a minute before trying again.' : 'We could not send your sign-in link. Please try again later.');
}
export async function signOut() {
  const response = await fetch('/api/auth/sign-out', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  if (!response.ok) throw new Error('Could not sign out. Please try again.');
}
