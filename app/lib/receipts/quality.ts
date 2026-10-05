import type { ParsedReceipt } from './types.ts';

export const REVIEW_MESSAGES = {
  role_reconciled: 'The item role was reconciled with its food category. Confirm the category and role.',
  ambiguous_date: 'The printed date has an unclear month/day order. Confirm it before saving.',
  date_year_inferred: 'A two-digit year was interpreted as 2000–2099. Confirm the year.',
  invalid_date: 'The printed date could not be normalized. Add the correct date if known.',
  ambiguous_name: 'Check this name against the printed description.',
  inferred_category: 'The category was inferred. Check that it fits this purchase.',
  uncertain_asset: 'Check whether this purchase is a standalone household item.',
  summary_line_removed: 'A payment or receipt-total line was excluded from purchases. Check the remaining items.',
  multiline_joined: 'A price continuation was joined to the preceding purchase. Check quantity and price.',
  duplicate_line: 'A repeated purchase line was kept separately. Confirm it is a separate purchase.',
  quantity_price_mismatch: 'Quantity times unit price differs from the line total. Check discounts or unit pricing.',
  receipt_type_uncertain: 'Negative purchase amounts changed the document type. Check whether this is a refund or mixed receipt.',
  return_receipt: 'This appears to be a return receipt. No new household purchases are recommended.',
  missing_merchant: 'Check the store name; it could not be read.',
  missing_date: 'The purchase date is missing. Add it if you know it.',
  missing_total: 'The receipt total is missing. Check it before saving.',
  missing_subtotal: 'The subtotal was not readable. You can leave it blank.',
  missing_tax: 'Tax was not readable. You can leave it blank.',
  missing_item_price: 'An item price is missing. Check that purchase before saving.',
  missing_item_name: 'An item name needs a second look at the printed description.',
  quantity_assumed: 'Quantity was not visible and is set to 1 for review. Correct it if needed.',
  total_mismatch: 'Subtotal and tax differ from the total. Check for fees, tips, or discounts.',
  item_total_mismatch: 'Item amounts differ from the receipt amounts. Some prices may be missing or discounted.',
} as const;
export type ReviewCode = keyof typeof REVIEW_MESSAGES;
export type ReviewSignal = { code: ReviewCode; field?: 'merchant' | 'purchaseDate' | 'subtotalMinor' | 'taxMinor' | 'totalMinor'; itemIndex?: number };
export type ReceiptQuality = { status: 'needs_review' | 'missing_information'; warnings: (ReviewSignal & { message: string })[] };
export function receiptQuality(receipt: ParsedReceipt): ReceiptQuality {
  const signals: ReviewSignal[] = [];
  const add = (signal: ReviewSignal) => { if (!signals.some((other) => other.code === signal.code && other.itemIndex === signal.itemIndex)) signals.push(signal); };
  for (const signal of receipt.reviewSignals ?? []) add(signal);
  if (!receipt.merchant) add({ code: 'missing_merchant', field: 'merchant' });
  if (!receipt.purchaseDate && !signals.some(signal => ['ambiguous_date', 'invalid_date'].includes(signal.code))) add({ code: 'missing_date', field: 'purchaseDate' });
  for (const [field, code] of [['subtotalMinor', 'missing_subtotal'], ['taxMinor', 'missing_tax'], ['totalMinor', 'missing_total']] as const) if (receipt[field] === null) add({ code, field });
  receipt.items.forEach((item, itemIndex) => {
    if (item.totalPriceMinor === null) add({ code: 'missing_item_price', itemIndex });
    if (!item.normalizedName && !signals.some(signal => signal.code === 'ambiguous_name' && signal.itemIndex === itemIndex)) add({ code: 'missing_item_name', itemIndex });
  });
  const { subtotalMinor: subtotal, taxMinor: tax, totalMinor: total } = receipt;
  if (subtotal !== null && tax !== null && total !== null && Math.abs(subtotal + tax - total) > 2) add({ code: 'total_mismatch', field: 'totalMinor' });
  const prices = receipt.items.map((item) => item.totalPriceMinor);
  if (prices.length && prices.every((value) => value !== null)) {
    const sum = (prices as number[]).reduce((a, b) => a + b, 0);
    const target = subtotal ?? (total !== null && tax !== null ? total - tax : null);
    if (target !== null && Math.abs(sum - target) > Math.max(2, Math.abs(target) * 0.01)) add({ code: 'item_total_mismatch' });
  }
  return { status: !receipt.merchant || !receipt.purchaseDate || [subtotal, tax, total].some(value => value === null) || receipt.items.some(item => !item.normalizedName || item.totalPriceMinor === null) || signals.some(signal => signal.code === 'quantity_assumed') ? 'missing_information' : 'needs_review', warnings: signals.map((signal) => ({ ...signal, message: REVIEW_MESSAGES[signal.code] })) };
}
