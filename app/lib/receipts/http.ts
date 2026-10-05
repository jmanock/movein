/** Local transport guard used only by the central household resolver; not authentication. */
export function developmentRequestAllowed(request: Request): boolean {
  if (process.env.NODE_ENV !== 'development') return false;
  const url = new URL(request.url);
  const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);
  if (!loopback.has(url.hostname)) return false;
  // Next may normalize the internal request URL to localhost when bound to 127.0.0.1.
  // Validate the actual Host as loopback, then compare Origin against that public origin.
  const host = request.headers.get('host') ?? url.host;
  let publicUrl: URL;
  try { publicUrl = new URL(`${url.protocol}//${host}`); } catch { return false; }
  if (!loopback.has(publicUrl.hostname) || publicUrl.host !== host || publicUrl.port !== url.port) return false;
  const origin = request.headers.get('origin');
  if (origin && origin !== publicUrl.origin) return false;
  const fetchSite = request.headers.get('sec-fetch-site');
  return !fetchSite || ['same-origin', 'none'].includes(fetchSite);
}
export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}
export function unauthorized() {
  return json({ error: 'Sign in to access your private household records.' }, 401);
}
/** Read a bounded stream before multipart/JSON parsing, even without Content-Length. */
export async function boundedBody(request: Request, limit: number): Promise<Uint8Array> {
  const declared = request.headers.get('content-length');
  if (declared && Number(declared) > limit) throw new Error('Request is too large');
  if (!request.body) throw new Error('Request body is missing');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) throw new Error('Request is too large');
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
    reader.releaseLock();
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
  return body;
}
