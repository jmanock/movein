import { ITEM_ROLES, RECEIPT_TYPES, UNCERTAINTY_FLAGS, DATE_ORDERS } from './intelligence-types.ts';
import { REVIEW_MESSAGES } from './quality.ts';
import type { ParsedReceipt, ReceiptExtractor, ReceiptInput } from './types.ts';

function clean(value: string | null) {
  if (value === null) return null;
  if (typeof value !== 'string' || value.length > 500) throw new Error('Invalid receipt text');
  return value.trim() || null;
}
function money(value: number | null) {
  if (value !== null && (!Number.isSafeInteger(value) || Math.abs(value) > 1000000000)) throw new Error('Money must be safe integer minor units');
  return value;
}
function date(value: string | null) {
  if (value === null) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) throw new Error('Invalid purchase date');
  return value;
}
/** Validate and allowlist the domain output, stripping unrelated provider fields. */
export function normalizeReceipt(parsed: ParsedReceipt): ParsedReceipt {
  if (!parsed || typeof parsed !== 'object' || typeof parsed.currency !== 'string' || !Array.isArray(parsed.items) || parsed.items.length > 100) throw new Error('Invalid receipt result');
  const currency = parsed.currency.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error('Currency must be a three-letter code');
  const confidence = parsed.extractionConfidence;
  if (confidence !== null && (!Number.isFinite(confidence) || confidence < 0 || confidence > 1)) throw new Error('Invalid extraction confidence');
  if (parsed.receiptType !== undefined && !RECEIPT_TYPES.includes(parsed.receiptType)) throw new Error('Invalid receipt type');
  if (parsed.dateOrder !== undefined && !DATE_ORDERS.includes(parsed.dateOrder)) throw new Error('Invalid date order');
  return {
    ...(parsed.receiptType !== undefined ? { receiptType: parsed.receiptType } : {}),
    ...(parsed.rawDateText !== undefined ? { rawDateText: clean(parsed.rawDateText) } : {}),
    ...(parsed.dateOrder !== undefined ? { dateOrder: parsed.dateOrder } : {}),
    merchant: clean(parsed.merchant), purchaseDate: date(parsed.purchaseDate),
    subtotalMinor: money(parsed.subtotalMinor), taxMinor: money(parsed.taxMinor), totalMinor: money(parsed.totalMinor),
    currency, extractionConfidence: confidence,
    ...(Array.isArray(parsed.reviewSignals) ? { reviewSignals: parsed.reviewSignals.filter((signal) => signal && typeof signal.code === 'string' && Object.hasOwn(REVIEW_MESSAGES, signal.code) && (signal.itemIndex === undefined || (Number.isInteger(signal.itemIndex) && signal.itemIndex >= 0 && signal.itemIndex < parsed.items.length))).map((signal) => ({ code: signal.code, ...(signal.itemIndex !== undefined ? { itemIndex: signal.itemIndex } : {}) })) } : {}),
    items: parsed.items.map((item) => {
      if (!item || typeof item !== 'object') throw new Error('Invalid receipt item');
      const rawDescription = item.rawDescription;
      if (typeof rawDescription !== 'string' || rawDescription.length > 500 || !rawDescription.trim()) throw new Error('Invalid receipt text');
      if (item.itemRole !== undefined && !ITEM_ROLES.includes(item.itemRole)) throw new Error('Invalid item role');
      if (item.uncertaintyFlags !== undefined && (!Array.isArray(item.uncertaintyFlags) || item.uncertaintyFlags.length > 3 || item.uncertaintyFlags.some(flag => !UNCERTAINTY_FLAGS.includes(flag)))) throw new Error('Invalid uncertainty flags');
      if (!rawDescription || !Number.isFinite(item.quantity) || item.quantity <= 0 || item.quantity > 100000 || typeof item.isHouseholdAsset !== 'boolean') throw new Error('Invalid receipt item');
      return { ...(item.itemRole !== undefined ? { itemRole: item.itemRole } : {}),
        ...(item.uncertaintyFlags !== undefined ? { uncertaintyFlags: [...new Set(item.uncertaintyFlags)] } : {}), rawDescription, normalizedName: clean(item.normalizedName), quantity: item.quantity,
        unitPriceMinor: money(item.unitPriceMinor), totalPriceMinor: money(item.totalPriceMinor),
        category: clean(item.category), isHouseholdAsset: item.isHouseholdAsset, assetReason: clean(item.assetReason) };
    }),
  };
}
export async function processReceipt(input: ReceiptInput, extractor: ReceiptExtractor): Promise<ParsedReceipt> {
  return normalizeReceipt(await extractor.extract(input));
}
/** Fixture injection only. It never interprets a real receipt or runs in the UI. */
export function createMockExtractor(fixture: ParsedReceipt): ReceiptExtractor {
  return { async extract() { return structuredClone(fixture); } };
}
