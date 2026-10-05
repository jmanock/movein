import type { ReceiptExtractor, ParsedReceipt } from './types.ts';
import type { ExtractorConfig } from './config.ts';
import { ReceiptExtractionError } from './errors.ts';
import { RECEIPT_CATEGORIES, receiptPrompt, type PromptVersion } from './prompt.ts';
import { improveReceipt, readReceiptDate } from './intelligence.ts';
import { normalizeReceipt } from './processing.ts';
import { validateReceiptImage } from './image-security.ts';
import { validateFileSignature, MAX_RECEIPT_BYTES } from './upload.ts';

// Common model placeholders mean unknown, not a store/product literally named "null".
function optionalText(value: unknown) {
  return value === undefined || (typeof value === 'string' && /^(null|unknown|n\/a)$/i.test(value.trim())) ? null : value;
}

/** Conservative formatting repair only: strip ONE complete JSON code fence, never guess JSON content. */
export function parseOllamaReceipt(content: string, version: PromptVersion = 'movein-receipt-v2'): { receipt: ParsedReceipt; jsonRepaired: boolean } {
  let text = content.trim();
  const fenced = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/i.exec(text);
  if (fenced) text = fenced[1].trim();
  let raw;
  try { raw = JSON.parse(text); }
  catch { throw new ReceiptExtractionError('invalid_json', 'The model did not return readable purchase details. Try a clearer image or another vision model.'); }
  try {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || !Array.isArray(raw.items) || raw.items.length > 100) throw new Error('schema');
    if (!raw.items.length) throw new ReceiptExtractionError('no_items', 'No usable purchases were found. Try a clearer, complete receipt photo.');
    if (raw.currency !== 'USD') throw new ReceiptExtractionError('currency', 'Only USD receipts are supported right now. The receipt currency could not be confirmed as USD.');
    const reviewSignals: ParsedReceipt['reviewSignals'] = [];
    const items = raw.items.map((item: Record<string, unknown>, itemIndex: number) => {
      if (!item || typeof item !== 'object' || !RECEIPT_CATEGORIES.includes(item.category as typeof RECEIPT_CATEGORIES[number])) throw new Error('category');
      const quantity = item.quantity ?? null;
      if (quantity === null) reviewSignals.push({ code: 'quantity_assumed', itemIndex });
      const extras = version === 'movein-receipt-v2' ? { itemRole: item.itemRole ?? (item.isHouseholdAsset ? 'durable_asset' : 'other'), uncertaintyFlags: item.uncertaintyFlags ?? [] } : {};
      return { ...extras, rawDescription: item.rawDescription, normalizedName: optionalText(item.normalizedName),
        quantity: quantity === null ? 1 : quantity, unitPriceMinor: item.unitPriceMinor ?? null, totalPriceMinor: item.totalPriceMinor ?? null,
        category: item.category, isHouseholdAsset: item.isHouseholdAsset, assetReason: optionalText(item.assetReason) };
    });
    let purchaseDate = optionalText(raw.purchaseDate);
    let extras = {};
    if (version === 'movein-receipt-v2') {
      const rawDateText = optionalText(raw.rawDateText);
      if (rawDateText !== null && (typeof rawDateText !== 'string' || rawDateText.length > 100)) throw new Error('date evidence');
      const result = readReceiptDate((rawDateText ?? purchaseDate) as string | null, raw.dateOrder ?? 'unknown');
      purchaseDate = result.date;
      if (result.warning) reviewSignals.push({ code: result.warning });
      extras = { receiptType: raw.receiptType ?? 'unknown', rawDateText, dateOrder: raw.dateOrder ?? 'unknown' };
    }
    let receipt = normalizeReceipt({ ...extras, merchant: optionalText(raw.merchant), purchaseDate,
      subtotalMinor: raw.subtotalMinor ?? null, taxMinor: raw.taxMinor ?? null, totalMinor: raw.totalMinor ?? null,
      currency: raw.currency, extractionConfidence: null, items, ...(reviewSignals.length ? { reviewSignals } : {}) } as ParsedReceipt);
    if (version === 'movein-receipt-v2') receipt = normalizeReceipt(improveReceipt(receipt));
    if (!receipt.items.length) throw new ReceiptExtractionError('no_items', 'No usable purchases were found. Try a clearer, complete receipt photo.');
    return { receipt, jsonRepaired: Boolean(fenced) };
  } catch (error) {
    if (error instanceof ReceiptExtractionError) throw error;
    throw new ReceiptExtractionError('invalid_schema', 'Some purchase details could not be read reliably. Try a clearer image or another vision model.');
  }
}

export async function readProviderJson(response: Response): Promise<Record<string, unknown>> {
  if (!response.body) throw new ReceiptExtractionError('malformed_response', 'Ollama returned an empty response. Please try again.');
  const reader = response.body.getReader();
  const parts: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.length;
      if (size > 256 * 1024) throw new ReceiptExtractionError('malformed_response', 'Ollama returned too much data. Try a shorter receipt.');
      parts.push(value);
    }
  } finally { await reader.cancel(); reader.releaseLock(); }
  try {
    const result = JSON.parse(Buffer.concat(parts).toString('utf8'));
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('schema');
    return result;
  } catch { throw new ReceiptExtractionError('malformed_response', 'Ollama returned an unreadable response. Please try again.'); }
}
function providerFailure(status: number, body: Record<string, unknown>): never {
  // Inspect only to choose a safe canned message. Never echo provider text.
  const message = typeof body.error === 'string' ? body.error : '';
  if (status === 404 || /not found|does not exist/i.test(message)) throw new ReceiptExtractionError('model_missing', 'The configured model is not installed. Choose an installed vision model or install it in Ollama first.');
  if (/image|vision|decode|multimodal|unsupported.*format/i.test(message)) throw new ReceiptExtractionError('vision', 'This model could not read the image. Use a vision-capable model and a valid JPG or PNG.');
  throw new ReceiptExtractionError('provider_error', 'Ollama could not complete this receipt. Check the selected model and try again.');
}
export function createOllamaExtractor(config: Extract<ExtractorConfig, { provider: 'ollama' }>, fetcher: typeof fetch = fetch, signal?: AbortSignal): ReceiptExtractor & { diagnostics: { jsonRepaired: boolean } } {
  const diagnostics = { jsonRepaired: false };
  return { diagnostics, async extract(input) {
    if (input.content.kind !== 'file') throw new ReceiptExtractionError('format', 'Text and email extraction are not enabled yet.');
    if (input.content.mediaType === 'application/pdf') throw new ReceiptExtractionError('pdf', 'Real PDF extraction is not enabled yet. Upload a JPG or PNG photo of the receipt.');
    if (!input.content.bytes.length || input.content.bytes.length > MAX_RECEIPT_BYTES || !validateFileSignature(input.content.bytes, input.content.mediaType)) throw new ReceiptExtractionError('image', 'Choose a valid JPG or PNG receipt under 8 MB.');
    await validateReceiptImage(input.content.bytes, input.content.mediaType);
    const deadline = AbortSignal.timeout(config.timeoutMs);
    const combined = signal ? AbortSignal.any([deadline, signal]) : deadline;
    async function request(path: string, body: unknown) {
      combined.throwIfAborted();
      const response = await fetcher(`${config.baseUrl}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: combined, redirect: 'error' });
      const data = await readProviderJson(response);
      if (!response.ok || data.error) providerFailure(response.status, data);
      return data;
    }
    try {
      // Inspect an already installed model. Never call /api/pull or accept a remote/cloud model.
      const metadata = await request('/api/show', { model: config.model });
      if (metadata.remote_model || metadata.remote_host || !Array.isArray(metadata.capabilities)) throw new ReceiptExtractionError('model_local', 'Choose a local installed vision model. Remote or unknown-capability models are not supported.');
      if (!metadata.capabilities.includes('vision')) throw new ReceiptExtractionError('vision', 'The configured model does not support images. Choose an installed vision-capable model.');
      const prompt = receiptPrompt(config.promptVersion);
      const result = await request('/api/chat', { model: config.model, stream: false, format: prompt.schema,
        options: { temperature: 0, num_predict: 8192 },
        messages: [{ role: 'system', content: prompt.system }, { role: 'user', content: `Read this receipt image. Return only JSON matching this schema: ${JSON.stringify(prompt.schema)}`, images: [Buffer.from(input.content.bytes).toString('base64')] }] });
      const message = result.message as { content?: unknown } | undefined;
      if (result.done !== true || typeof message?.content !== 'string' || result.done_reason === 'length') throw new ReceiptExtractionError('malformed_response', 'The model returned incomplete purchase details. Try a shorter receipt or another model.');
      const parsed = parseOllamaReceipt(message.content, config.promptVersion);
      diagnostics.jsonRepaired = parsed.jsonRepaired;
      return parsed.receipt;
    } catch (error) {
      if (error instanceof ReceiptExtractionError) throw error;
      if (deadline.aborted) throw new ReceiptExtractionError('timeout', 'Reading this receipt took too long. Try a smaller image or increase the local extraction timeout.');
      if (signal?.aborted) throw new ReceiptExtractionError('canceled', 'Receipt processing was canceled. Please try again.');
      throw new ReceiptExtractionError('unavailable', 'Could not reach local Ollama. Start Ollama and check OLLAMA_BASE_URL.');
    }
  } };
}
