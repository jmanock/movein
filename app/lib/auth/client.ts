export async function signIn(email: string, password: string) {
  const response = await fetch('/api/auth/sign-in/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  if (!response.ok) throw new Error(response.status === 429 ? 'Too many requests. Please wait a minute before trying again.' : response.status >= 500 ? 'Sign-in is not available right now. Please try again later.' : 'Email or password is incorrect.');
}
export async function signOut() {
  const response = await fetch('/api/auth/sign-out', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  if (!response.ok) throw new Error('Could not sign out. Please try again.');
}
