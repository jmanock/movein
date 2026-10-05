import { readFile, stat } from 'node:fs/promises';
import { extname } from 'node:path';
import { loadNextEnvironment } from './lib/next-env.mjs';

// Use the same local env loading as Next dev; no DB/repository import or persistence.
process.env.NODE_ENV ??= 'development';
loadNextEnvironment(process.cwd());
const { extractConfiguredReceipt } = await import('../app/lib/receipts/extraction.ts');
const { receiptExtractorConfig } = await import('../app/lib/receipts/config.ts');
const { MAX_RECEIPT_BYTES, validateUpload, uploadInput } = await import('../app/lib/receipts/upload.ts');
let input;
try {
  const path = process.argv[2];
  if (!path) throw new Error('Usage: npm run receipt:test -- /path/to/receipt.jpg');
  const config = receiptExtractorConfig();
  if (config.provider !== 'ollama') throw new Error('receipt:test requires RECEIPT_EXTRACTOR=ollama. It never tests fake extraction.');
  const extension = extname(path).toLowerCase();
  const type = ({ '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf' })[extension] ?? '';
  const info = await stat(path);
  if (!info.isFile() || info.size > MAX_RECEIPT_BYTES) throw new Error('Choose a receipt file under 8 MB.');
  const error = validateUpload({ name: path, type, size: info.size });
  if (error) throw new Error(error);
  input = uploadInput(new Uint8Array(await readFile(path)), type);
  const started = performance.now();
  const result = await extractConfiguredReceipt(input);
  console.log(JSON.stringify({ provider: result.mode, model: config.model, durationMs: Math.round(performance.now() - started), receipt: result.receipt, quality: result.quality, ...(result.debug ? { debug: result.debug } : {}) }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Receipt extraction failed.');
  process.exitCode = 1;
} finally { if (input?.content.kind === 'file') input.content.bytes = new Uint8Array(); }
