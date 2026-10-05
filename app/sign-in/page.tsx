import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { PageHero } from '../components/PageHero';
import { SignInForm } from '../components/SignInForm';
import { pageMetadata } from '../lib/metadata';
import { signInDestination } from '../lib/auth/destination';
import { getCurrentHousehold } from '../lib/households/current';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = pageMetadata('Sign in', 'Sign in to your private MoveIn household.', '/sign-in', { noindex: true });
export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  const destination = signInDestination(params.next);
  const requestHeaders = await headers();
  const context = await getCurrentHousehold(new Request('http://localhost/sign-in', { headers: requestHeaders }));
  return <main id="main-content" className="home-tool-page"><PageHero eyebrow="Your MoveIn account" title="A private place for your home records." description="Sign in to keep the purchases you choose to remember." /><div className="shell receipt-page">{context?.access === 'authenticated' ? <section className="receipt-card"><h2>You’re signed in</h2><Link className="button" href={destination}>Continue to {destination === '/receipts' ? 'receipts' : 'My Home'}</Link></section> : <SignInForm destination={destination} linkError={params.error === 'VERIFICATION_FAILED' ? 'failed' : params.error ? 'invalid' : null} />}</div></main>;
}
