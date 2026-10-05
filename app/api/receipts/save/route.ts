import { getCurrentHousehold } from '../../../lib/households/current.ts';
import { getDatabase } from '../../../../db/index.ts';
import { createReceiptRepository } from '../../../lib/receipts/persistence.ts';
import { normalizeReceipt } from '../../../lib/receipts/processing.ts';
import { boundedBody, json, unauthorized } from '../../../lib/receipts/http.ts';
import { receiptExtractorConfig } from '../../../lib/receipts/config.ts';
import type { ParsedReceipt } from '../../../lib/receipts/types.ts';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  const household = await getCurrentHousehold(request);
  if (!household) return unauthorized();
  let receipt: ParsedReceipt, selected: number[], requestId: string;
  try {
    if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('Invalid request');
    const body = JSON.parse(new TextDecoder().decode(await boundedBody(request, 128 * 1024)));
    if (!body || typeof body !== 'object' || Object.keys(body).some(key => !['receipt', 'selected', 'requestId'].includes(key))) throw new Error('Invalid review');
    const purchase = body.receipt;
    if (!purchase || typeof purchase !== 'object' || Array.isArray(purchase)) throw new Error('Invalid review');
    const ownershipKeys = ['id', 'householdId', 'household_id', 'receiptId', 'receipt_id', 'sourceReceiptId', 'sourceReceiptItemId', 'source_receipt_id', 'source_receipt_item_id'];
    if (ownershipKeys.some(key => Object.hasOwn(purchase, key)) || (Array.isArray(purchase.items) && purchase.items.some((item: unknown) => item && typeof item === 'object' && ownershipKeys.some(key => Object.hasOwn(item, key))))) throw new Error('Invalid review');
    receipt = normalizeReceipt(purchase);
    selected = body.selected;
    requestId = body.requestId;
    if (!receipt.items.length || !Array.isArray(selected) || selected.some((index) => !Number.isInteger(index) || index < 0 || index >= receipt.items.length) || new Set(selected).size !== selected.length || typeof requestId !== 'string' || !/^[0-9a-f-]{36}$/i.test(requestId)) throw new Error('Invalid review');
  } catch {
    return json({ error: 'Check the purchase details and item amounts before saving. At least one item is required.' }, 400);
  }
  let sourceType: 'test' | 'upload';
  try { sourceType = receiptExtractorConfig().provider === 'demo' ? 'test' : 'upload'; }
  catch { return json({ error: 'Receipt saving is temporarily unavailable. Your changes are still here; please try again later.' }, 503); }
  try {
    const result = createReceiptRepository(getDatabase(), household.householdId).saveReviewed(receipt, selected, requestId, sourceType);
    return json(result);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('This save was already completed')) return json({ error: error.message }, 409);
    return json({ error: 'Your receipt could not be saved. Your changes are still here; please try again later.' }, 503);
  }
}
