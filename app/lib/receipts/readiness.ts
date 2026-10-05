import { receiptExtractorConfig } from './config.ts';
/** Read-only probe. Never pulls a model or returns provider data to a consumer. */
export async function receiptReadiness(env: NodeJS.ProcessEnv = process.env, fetcher: typeof fetch = fetch): Promise<{ available: boolean }> {
  try {
    const config = receiptExtractorConfig(env);
    if (config.provider === 'demo') return { available: env.NODE_ENV === 'development' };
    const response = await fetcher(`${config.baseUrl}/api/show`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: config.model }), signal: AbortSignal.timeout(3000), redirect: 'error' });
    // Same bounded reader as extraction; no trust in Content-Length or provider error text.
    const { readProviderJson } = await import('./ollama.ts');
    const data = await readProviderJson(response);
    return { available: response.ok && !data.error && !data.remote_model && !data.remote_host && Array.isArray(data.capabilities) && data.capabilities.includes('vision') };
  } catch { return { available: false }; }
}
