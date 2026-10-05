'use client';
import { useState } from 'react';
import Link from 'next/link';
import { requestMagicLink } from '../lib/auth/client';
export function SignInForm({ destination, linkError }: { destination: string; linkError: 'invalid' | 'failed' | null }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'ready' | 'sending' | 'sent'>('ready');
  const [error, setError] = useState(linkError === 'failed' ? 'We could not finish signing you in. Request a new link or try again later.' : linkError ? 'This sign-in link is invalid, expired, or already used. Request a new link below.' : '');
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(''); setState('sending');
    try { await requestMagicLink(email.trim(), destination); setState('sent'); }
    catch (error) { setError(error instanceof Error ? error.message : 'Please try again later.'); setState('ready'); }
  }
  return <section className="receipt-card sign-in-card"><h2>Sign in with your email</h2><p>We’ll send a private link to open your household’s receipts and My Home. No password needed.</p>
    {error && <p role="alert" className="receipt-error">{error}</p>}
    {state === 'sent' ? <div role="status"><h3>Check your email</h3><p>Your link expires in 10 minutes and works once. Open the newest link to finish signing in.</p><button className="button button-secondary" onClick={() => setState('ready')}>Send another link</button></div> : <form onSubmit={submit}><label htmlFor="sign-in-email">Email address</label><input id="sign-in-email" type="email" name="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} disabled={state === 'sending'} /><button className="button" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending link…' : 'Email me a sign-in link'}</button></form>}
    <p className="small-text">Your email is used for account access, not marketing. <Link href="/privacy">Privacy</Link></p></section>;
}
