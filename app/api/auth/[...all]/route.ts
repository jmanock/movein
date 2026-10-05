import { getAuth } from '../../../lib/auth/server.ts';
import { json } from '../../../lib/receipts/http.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const endpoints = new Map([['/sign-in/email', 'POST'], ['/get-session', 'GET'], ['/sign-out', 'POST']]);
async function handle(request: Request) {
  const path = new URL(request.url).pathname.slice('/api/auth'.length);
  if (endpoints.get(path) !== request.method) return json({ error: 'Not found' }, 404);
  try {
    const response = await getAuth().handler(request);
    if (response.status >= 400) {
      const safe = json({ error: response.status === 429 ? 'Too many requests. Please wait before trying again.' : path === '/sign-in/email' && response.status < 500 ? 'Email or password is incorrect.' : 'We could not complete this request. Please try again later.' }, response.status);
      const retryAfter = response.headers.get('Retry-After');
      if (retryAfter && /^\d+$/.test(retryAfter)) safe.headers.set('Retry-After', retryAfter);
      return safe;
    }
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
    return response;
  } catch {
    return json({ error: 'Sign-in is not available right now. Please try again later.' }, 503);
  }
}
export const GET = handle;
export const POST = handle;
