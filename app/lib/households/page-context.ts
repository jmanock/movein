import 'server-only';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentHousehold } from './current.ts';
import { signInDestination } from '../auth/destination.ts';

export async function requirePageHousehold(destination: '/receipts' | '/my-home') {
  const requestHeaders = await headers();
  const signIn = `/sign-in?next=${encodeURIComponent(signInDestination(destination))}`;
  const host = requestHeaders.get('host');
  if (!host) redirect(signIn);
  let request: Request;
  try { request = new Request(`http://${host}/`, { headers: requestHeaders }); }
  catch { redirect(signIn); }
  const household = await getCurrentHousehold(request);
  if (!household) redirect(signIn);
  return household;
}
