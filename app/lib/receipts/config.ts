import { RECEIPT_PROMPT_VERSION, type PromptVersion } from './prompt.ts';
import { ReceiptExtractionError } from './errors.ts';

export type ExtractorConfig = { provider: 'demo'; timeoutMs: number; debug: boolean }
  | { provider: 'ollama'; baseUrl: string; model: string; promptVersion: PromptVersion; timeoutMs: number; debug: boolean };
export function receiptExtractorConfig(env: NodeJS.ProcessEnv = process.env): ExtractorConfig {
  const provider = env.RECEIPT_EXTRACTOR?.trim();
  if (provider === 'disabled') throw new ReceiptExtractionError('configuration', 'Receipt reading is disabled.');
  const debug = env.NODE_ENV === 'development' && env.RECEIPT_EXTRACTION_DEBUG === 'true';
  if (provider === 'demo') {
    if (env.NODE_ENV !== 'development') throw new ReceiptExtractionError('configuration', 'Demo receipt extraction is available only in development.');
    return { provider, timeoutMs: 30000, debug };
  }
  if (provider !== 'ollama') throw new ReceiptExtractionError('configuration', 'Receipt extraction is not configured. Set RECEIPT_EXTRACTOR to ollama, or explicitly choose demo in development.');
  const model = env.OLLAMA_RECEIPT_MODEL?.trim();
  if (!model || model.length > 200 || !/^[a-zA-Z0-9][a-zA-Z0-9_.:/-]*$/.test(model) || /cloud/i.test(model)) throw new ReceiptExtractionError('configuration', 'Choose an installed local vision model with OLLAMA_RECEIPT_MODEL. Cloud models are not supported.');
  let url: URL;
  try { url = new URL(env.OLLAMA_BASE_URL?.trim() || 'http://127.0.0.1:11434'); }
  catch { throw new ReceiptExtractionError('configuration', 'OLLAMA_BASE_URL must be a local HTTP URL.'); }
  // Do not allow a typo/config change to send receipt images to an external endpoint.
  if (url.protocol !== 'http:' || !['127.0.0.1', '[::1]'].includes(url.hostname) || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new ReceiptExtractionError('configuration', 'OLLAMA_BASE_URL must use http://127.0.0.1 or http://[::1], with no path or credentials.');
  const promptVersion = env.RECEIPT_PROMPT_VERSION ?? RECEIPT_PROMPT_VERSION;
  if (!['movein-receipt-v1', 'movein-receipt-v2'].includes(promptVersion)) throw new ReceiptExtractionError('configuration', 'RECEIPT_PROMPT_VERSION must be movein-receipt-v1 or movein-receipt-v2.');
  const rawTimeout = env.OLLAMA_RECEIPT_TIMEOUT_MS ?? '180000';
  if (!/^\d+$/.test(rawTimeout)) throw new ReceiptExtractionError('configuration', 'OLLAMA_RECEIPT_TIMEOUT_MS must be between 1000 and 600000.');
  const timeoutMs = Number(rawTimeout);
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 600000) throw new ReceiptExtractionError('configuration', 'OLLAMA_RECEIPT_TIMEOUT_MS must be between 1000 and 600000.');
  return { provider, baseUrl: url.origin, model, promptVersion: promptVersion as PromptVersion, timeoutMs, debug };
}
