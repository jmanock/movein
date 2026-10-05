'use client';
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from '../lib/auth/client';
export function SignInForm({ destination }: { destination: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(''); setPending(true);
    try { await signIn(email.trim(), password); setPassword(''); window.location.assign(destination); }
    catch (error) { setPassword(''); setError(error instanceof Error ? error.message : 'Please try again later.'); setPending(false); }
  }
  return <section className="receipt-card sign-in-card"><h2>Sign in</h2><p>MoveIn is currently in early access. Use the credentials provided to you.</p>
    {error && <p role="alert" className="receipt-error">{error}</p>}
    <form onSubmit={submit}><label htmlFor="sign-in-email">Email</label><input id="sign-in-email" type="email" name="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} disabled={pending} /><label htmlFor="sign-in-password">Password</label><input id="sign-in-password" type="password" name="password" autoComplete="current-password" required maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} disabled={pending} /><button className="button" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button></form>
    <p className="small-text">Your email is used for account access, not marketing. <Link href="/privacy">Privacy</Link></p></section>;
}
