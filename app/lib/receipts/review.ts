import type { ItemRole, ReceiptType } from './intelligence-types.ts';
import type { ParsedReceipt } from './types.ts';
import { normalizeReceipt } from './processing.ts';

export interface ReceiptReview {
  receiptType: ReceiptType;
  merchant: string; purchaseDate: string; subtotal: string; tax: string; total: string;
  items: { itemRole: ItemRole; name: string; category: string; quantity: string; unitPrice: string; totalPrice: string; selected: boolean }[];
}
// This review supports USD minor units; other currencies require explicit precision support.
export const editableMoney = (minor: number | null) => minor === null ? '' : (minor / 100).toFixed(2);
export function parseMoney(value: string): number | null {
  const text = value.trim();
  if (!text) return null;
  if (!/^-?\d+(\.\d{1,2})?$/.test(text)) throw new Error('Enter amounts with up to two decimal places.');
  const negative = text.startsWith('-');
  const [whole, fraction = ''] = text.replace(/^-/, '').split('.');
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(minor)) throw new Error('This amount is too large.');
  return negative ? -minor : minor;
}
export function reviewFromReceipt(receipt: ParsedReceipt): ReceiptReview {
  return { receiptType: receipt.receiptType ?? 'unknown', merchant: receipt.merchant ?? '', purchaseDate: receipt.purchaseDate ?? '',
    subtotal: editableMoney(receipt.subtotalMinor), tax: editableMoney(receipt.taxMinor), total: editableMoney(receipt.totalMinor),
    items: receipt.items.map((item) => ({ itemRole: item.itemRole ?? (item.isHouseholdAsset ? 'durable_asset' : 'other'), name: item.normalizedName ?? item.rawDescription, category: item.category ?? '', quantity: String(item.quantity), unitPrice: editableMoney(item.unitPriceMinor), totalPrice: editableMoney(item.totalPriceMinor), selected: item.isHouseholdAsset })) };
}
export function reviewedReceipt(original: ParsedReceipt, review: ReceiptReview): ParsedReceipt {
  if (!review.items.length || review.items.length !== original.items.length) throw new Error('This receipt has no usable items.');
  if (review.items.some((item) => !item.name.trim())) throw new Error('Give each purchase a name before saving.');
  return normalizeReceipt({ ...original, receiptType: review.receiptType, merchant: review.merchant.trim() || null, purchaseDate: review.purchaseDate || null,
    subtotalMinor: parseMoney(review.subtotal), taxMinor: parseMoney(review.tax), totalMinor: parseMoney(review.total),
    items: review.items.map((item, index) => ({ ...original.items[index], normalizedName: item.name, itemRole: item.itemRole,
      category: item.category.trim() || null, quantity: Number(item.quantity), unitPriceMinor: parseMoney(item.unitPrice), totalPriceMinor: parseMoney(item.totalPrice) })) });
}
export function formatMoney(value: number | null, currency: string): string {
  if (value === null) return 'Price not recorded';
  try { return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value / 100); }
  catch { return `${(value / 100).toFixed(2)} ${currency}`; }
}
