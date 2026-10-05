import { receiptExtractorConfig } from './config.ts';
import { developmentExtractor } from './demo.ts';
import { createOllamaExtractor } from './ollama.ts';
import { processReceipt } from './processing.ts';
import { receiptQuality } from './quality.ts';
import type { ReceiptInput } from './types.ts';

/** Same interpretation pipeline for the browser adapter and the non-persisting CLI. */
export async function extractConfiguredReceipt(input: ReceiptInput, options: { env?: NodeJS.ProcessEnv; fetcher?: typeof fetch; signal?: AbortSignal } = {}) {
  const config = receiptExtractorConfig(options.env);
  const extractor = config.provider === 'ollama' ? createOllamaExtractor(config, options.fetcher, options.signal) : developmentExtractor();
  const started = performance.now();
  const receipt = await processReceipt(input, extractor);
  const quality = receiptQuality(receipt);
  return { receipt, quality, mode: config.provider,
    ...(config.debug ? { debug: { provider: config.provider, model: config.provider === 'ollama' ? config.model : null,
      durationMs: Math.round(performance.now() - started), promptVersion: config.provider === 'ollama' ? config.promptVersion : 'demo-fixture',
      warningCodes: quality.warnings.map((warning) => warning.code), jsonRepaired: 'diagnostics' in extractor ? (extractor.diagnostics as { jsonRepaired: boolean }).jsonRepaired : false } } : {}) };
}
