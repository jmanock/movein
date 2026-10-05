import type { DateOrder } from './intelligence-types.ts';
import type { ParsedReceipt, ParsedReceiptItem } from './types.ts';
import type { ReviewSignal } from './quality.ts';
const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
function iso(year: number, month: number, day: number) {
  const value = `${String(year).padStart(4,'0')}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value ? value : null;
}
/** No locale/clock guesses: ambiguous numeric order stays unknown. Two-digit years use 2000–2099 with a warning. */
export function readReceiptDate(text: string | null, order: DateOrder = 'unknown'): { date: string | null; warning?: 'ambiguous_date' | 'date_year_inferred' | 'invalid_date' } {
  if (!text?.trim()) return { date: null };
  const value = text.trim().replace(/\s+(?:at\s+)?\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?(?:\s*[A-Z+-][A-Z0-9:+-]*)?$/i, '').replace(/T\d{2}:.*$/, '');
  const yearFirst = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(value);
  if (yearFirst) { const date = iso(+yearFirst[1], +yearFirst[2], +yearFirst[3]); return date ? { date } : { date:null, warning:'invalid_date' }; }
  const named = /^(?:([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{2}|\d{4})|(\d{1,2})\s+([A-Za-z]+)\s+(\d{2}|\d{4}))$/.exec(value);
  let yearText: string, month: number, day: number;
  if (named) { yearText = named[3] ?? named[6]; month = months.indexOf((named[1] ?? named[5]).slice(0,3).toLowerCase()) + 1; day = +(named[2] ?? named[4]); }
  else {
    const numeric = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})$/.exec(value);
    if (!numeric) return { date: null, warning:'invalid_date' };
    const a = +numeric[1], b = +numeric[2]; yearText = numeric[3];
    if (order === 'unknown' && a !== b && a <= 12 && b <= 12) return { date:null, warning:'ambiguous_date' };
    if (order === 'mdy' || (order === 'unknown' && b > 12) || a === b) { month=a; day=b; }
    else { month=b; day=a; }
  }
  const date = iso(yearText.length === 2 ? 2000 + +yearText : +yearText, month, day);
  return !date ? { date:null, warning:'invalid_date' } : { date, ...(yearText.length === 2 ? { warning:'date_year_inferred' as const } : {}) };
}

/** Exact cents arithmetic for displayed decimal quantities; no float-money multiplication. */
export function quantityAmount(unitMinor: number, quantity: number): number | null {
  const text = String(quantity);
  if (!/^\d+(?:\.\d+)?$/.test(text)) return null;
  const [whole, fraction = ''] = text.split('.');
  const numerator = BigInt(unitMinor) * BigInt(whole + fraction), denominator = BigInt(10) ** BigInt(fraction.length);
  if (numerator % denominator !== BigInt(0)) return null;
  const value = Number(numerator / denominator);
  return Number.isSafeInteger(value) && Math.abs(value) <= 1000000000 ? value : null;
}
const adjustment = /\b(coupon|discount|disc|deposit|fee|savings|promotion|promo|rebate)\b/i;
const summary = /^(?:sub\s*total|tax|sales tax|total|grand total|balance|amount due|cash|change|tender|visa|mastercard|payment)(?:\s*[:=]?\s*\$?-?[0-9]+(?:\.[0-9]{2})?)?\s*$/i;
const priceContinuation = /^(?:-?\$?-?[0-9]+\.[0-9]{2}|[0-9]+(?:\.[0-9]+)?\s*[xX@]\s*\$?[0-9]+\.[0-9]{2})$/;
const compact = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g,'');

/** Evidence-driven safeguards, not a product lookup or a hidden price classifier. */
export function improveReceipt(receipt: ParsedReceipt): ParsedReceipt {
  const signals: ReviewSignal[] = [];
  const mapped = new Map<number, number>();
  const items: ParsedReceiptItem[] = [];
  const observedQuantities = new Set<number>();
  receipt.items.forEach((input, originalIndex) => {
    const item = { ...input, uncertaintyFlags: [...(input.uncertaintyFlags ?? [])] };
    if (summary.test(item.rawDescription.trim())) { signals.push({ code:'summary_line_removed' }); return; }
    if (item.category === 'grocery' && item.itemRole === 'consumable') { item.itemRole = 'food'; signals.push({ code:'role_reconciled', itemIndex:items.length }); }
    const previous = items.at(-1);
    if (previous && previous.totalPriceMinor === null && item.totalPriceMinor !== null && priceContinuation.test(item.rawDescription.trim()) && previous.rawDescription.length + item.rawDescription.length < 499) {
      previous.rawDescription += '\n' + item.rawDescription;
      previous.totalPriceMinor = item.totalPriceMinor;
      previous.unitPriceMinor ??= item.unitPriceMinor;
      const quantityText = /^([0-9]+(?:\.[0-9]+)?)\s*[xX@]/.exec(item.rawDescription.trim());
      if (quantityText && Number(quantityText[1]) > 0 && Number(quantityText[1]) <= 100000) { previous.quantity = Number(quantityText[1]); observedQuantities.add(items.length-1); }
      mapped.set(originalIndex, items.length-1); signals.push({ code:'multiline_joined', itemIndex:items.length-1 }); return;
    }
    // Unsupported numeric model/size claims are generalized; brands cannot be verified with string rules.
    if (item.normalizedName) {
      const unsupported = item.normalizedName.split(/\s+/).filter(token => /\d/.test(token) && !compact(item.rawDescription).includes(compact(token)));
      if (unsupported.length) {
        item.normalizedName = item.normalizedName.split(/\s+/).filter(token => !unsupported.includes(token)).join(' ').trim() || null;
        item.uncertaintyFlags.push('ambiguousName');
      }
    }
    if (/^(?:SKU\s*[:#]?\s*)?[0-9\s#-]+(?:\s+-?\$?[0-9]+(?:\.[0-9]{2})?)?$/i.test(item.rawDescription.trim()) || priceContinuation.test(item.rawDescription.trim())) { item.normalizedName = null; item.itemRole = 'other'; item.uncertaintyFlags.push('ambiguousName', 'uncertainAssetClassification'); }
    if (item.uncertaintyFlags.includes('uncertainAssetClassification') || item.totalPriceMinor !== null && item.totalPriceMinor < 0 || adjustment.test(item.rawDescription) || item.itemRole && item.itemRole !== 'durable_asset') {
      if (item.isHouseholdAsset) item.uncertaintyFlags.push('uncertainAssetClassification');
      item.isHouseholdAsset = false;
    }
    item.uncertaintyFlags = [...new Set(item.uncertaintyFlags)];
    mapped.set(originalIndex, items.length); items.push(item);
  });
  for (const signal of receipt.reviewSignals ?? []) {
    if (signal.itemIndex === undefined) signals.push(signal);
    else if (mapped.has(signal.itemIndex) && !(signal.code === 'quantity_assumed' && observedQuantities.has(mapped.get(signal.itemIndex)!))) signals.push({ ...signal, itemIndex:mapped.get(signal.itemIndex)! });
  }
  const products = items.filter(item => !adjustment.test(item.rawDescription));
  const positive = products.some(item => item.totalPriceMinor !== null && item.totalPriceMinor > 0);
  const negative = products.some(item => item.totalPriceMinor !== null && item.totalPriceMinor < 0);
  let receiptType = receipt.receiptType ?? 'unknown';
  if (negative) {
    const signedType = positive ? 'mixed' : 'return';
    if (receiptType !== signedType) signals.push({ code:'receipt_type_uncertain' });
    receiptType = signedType;
  }
  if (receiptType === 'return') {
    signals.push({ code:'return_receipt' });
    items.forEach(item => { item.isHouseholdAsset = false; item.assetReason = 'Return receipt: no new household purchase is recommended.'; });
  }
  items.forEach((item,itemIndex) => {
    if (item.totalPriceMinor !== null && item.totalPriceMinor < 0) { item.isHouseholdAsset = false; item.assetReason = 'Negative purchase or adjustment amount: not a new household purchase.'; }
    else if (item.uncertaintyFlags?.includes('uncertainAssetClassification') && !item.isHouseholdAsset) item.assetReason = 'The purchase role or identity is uncertain. Check whether it is a standalone household item.';
    if (items.slice(0,itemIndex).some(other => other.rawDescription === item.rawDescription && other.totalPriceMinor === item.totalPriceMinor && other.quantity === item.quantity)) signals.push({ code:'duplicate_line', itemIndex });
    for (const flag of item.uncertaintyFlags ?? []) signals.push({ code:flag === 'ambiguousName' ? 'ambiguous_name' : flag === 'inferredCategory' ? 'inferred_category' : 'uncertain_asset', itemIndex });
    if (item.unitPriceMinor !== null && item.totalPriceMinor !== null) {
      const calculated = quantityAmount(item.unitPriceMinor,item.quantity);
      if (calculated !== null && (item.totalPriceMinor < 0 ? Math.abs(Math.abs(calculated)-Math.abs(item.totalPriceMinor)) : Math.abs(calculated-item.totalPriceMinor)) > 2) signals.push({ code:'quantity_price_mismatch', itemIndex });
    }
  });
  return { ...receipt, receiptType, items, reviewSignals:signals };
}
