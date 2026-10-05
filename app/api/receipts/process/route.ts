import { getCurrentHousehold } from '../../../lib/households/current.ts';
import { boundedBody, json, unauthorized } from '../../../lib/receipts/http.ts';
import { MAX_RECEIPT_BYTES, uploadInput, validateUpload } from '../../../lib/receipts/upload.ts';
import { extractConfiguredReceipt } from '../../../lib/receipts/extraction.ts';
import { ReceiptExtractionError } from '../../../lib/receipts/errors.ts';
import { enterReceiptProcessing } from '../../../lib/receipts/admission.ts';
import { receiptExtractorConfig } from '../../../lib/receipts/config.ts';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  const household = await getCurrentHousehold(request);
  if (!household) return unauthorized();
  try { receiptExtractorConfig(); }
  catch { return json({ error: 'Receipt reading is unavailable. You can still view your saved home records.' }, 503); }
  const admission = enterReceiptProcessing(household.householdId, request);
  if (!admission.allowed) {
    const response = json({ error: admission.status === 429 ? 'Too many upload attempts. Please wait before trying again.' : 'Receipt reading is busy. Please try again shortly.' }, admission.status);
    response.headers.set('Retry-After', String(admission.retryAfter));
    return response;
  }
  try { return await processUpload(request); }
  finally { admission.release(); }
}
async function processUpload(request: Request) {
  let input;
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.startsWith('multipart/form-data;')) return json({ error: 'Choose a receipt file to upload.' }, 400);
    const body = await boundedBody(request, MAX_RECEIPT_BYTES + 64 * 1024);
    const form = await new Response(body as BodyInit, { headers: { 'Content-Type': contentType } }).formData();
    const files = form.getAll('receipt');
    if (files.length !== 1 || !(files[0] instanceof File)) return json({ error: 'Choose one receipt file.' }, 400);
    const file = files[0];
    const error = validateUpload(file);
    if (error) return json({ error }, file.size > MAX_RECEIPT_BYTES ? 413 : 400);
    input = uploadInput(new Uint8Array(await file.arrayBuffer()), file.type);
  } catch (error) {
    return json({ error: error instanceof Error && error.message === 'Request is too large' ? 'This receipt is too large. Choose a file under 8 MB.' : 'We couldn’t open this file. Choose a valid JPG, PNG, or PDF receipt.' }, error instanceof Error && error.message === 'Request is too large' ? 413 : 400);
  }
  try {
    const result = await extractConfiguredReceipt(input, { signal: request.signal });
    if (!result.receipt.items.length) return json({ error: 'No usable purchases were found. Try another receipt.' }, 422);
    return json(result);
  } catch (error) {
    if (error instanceof ReceiptExtractionError) {
      const status = error.code === 'timeout' ? 504 : ['configuration', 'unavailable', 'model_missing', 'model_local'].includes(error.code) ? 503 : ['pdf', 'format', 'image', 'currency'].includes(error.code) ? 415 : error.code === 'no_items' ? 422 : 502;
      const unavailable = ['configuration', 'unavailable', 'model_missing', 'model_local'].includes(error.code);
      if (process.env.NODE_ENV === 'production') console.warn('Receipt processing failed', { code: error.code });
      return json({ error: process.env.NODE_ENV === 'production' && unavailable ? 'Receipt reading is temporarily unavailable. Your saved home records are still available.' : error.message, code: error.code }, status);
    }
    return json({ error: 'We couldn’t process this receipt. Please try again.' }, 502);
  } finally {
    // Neither provider needs disk input; release the only application byte reference.
    if (input.content.kind === 'file') input.content.bytes = new Uint8Array();
  }
}
