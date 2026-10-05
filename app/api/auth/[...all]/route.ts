import { getAuth } from '../../../lib/auth/server.ts';
import { signInDestination } from '../../../lib/auth/destination.ts';
import { json } from '../../../lib/receipts/http.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const endpoints = new Map([['/sign-in/magic-link', 'POST'], ['/magic-link/verify', 'GET'], ['/get-session', 'GET'], ['/sign-out', 'POST']]);
function failedVerification(request: Request) {
  const destination = signInDestination(new URL(request.url).searchParams.get('callbackURL'));
  return new Response(null, { status: 303, headers: { Location: `/sign-in?next=${encodeURIComponent(destination)}&error=VERIFICATION_FAILED`, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
}
async function handle(request: Request) {
  const path = new URL(request.url).pathname.slice('/api/auth'.length);
  if (endpoints.get(path) !== request.method) return json({ error: 'Not found' }, 404);
  try {
    const response = await getAuth().handler(request);
    if (path === '/magic-link/verify' && response.status >= 400) return failedVerification(request);
    if (response.status >= 400) {
      const safe = json({ error: response.status === 429 ? 'Too many requests. Please wait before trying again.' : 'We could not complete this request. Please try again later.' }, response.status);
      const retryAfter = response.headers.get('Retry-After');
      if (retryAfter && /^\d+$/.test(retryAfter)) safe.headers.set('Retry-After', retryAfter);
      return safe;
    }
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
    return response;
  } catch {
    if (path === '/magic-link/verify') return failedVerification(request);
    return json({ error: 'Sign-in is not available right now. Please try again later.' }, 503);
  }
}
export const GET = handle;
export const POST = handle;
