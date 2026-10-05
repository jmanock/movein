import type { ReceiptInput } from './types.ts';

export const MAX_RECEIPT_BYTES = 8 * 1024 * 1024;
export const RECEIPT_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'] as const;
export const UPLOAD_LIMIT_LABEL = '8 MB';
export function validateUpload(file: { name: string; type: string; size: number }): string | null {
  if (!RECEIPT_MIME_TYPES.includes(file.type as typeof RECEIPT_MIME_TYPES[number]) || !/\.(jpe?g|png|pdf)$/i.test(file.name)) return 'Choose a JPG, PNG, or PDF receipt.';
  if (!Number.isSafeInteger(file.size) || file.size <= 0) return 'This file is empty. Choose another receipt.';
  if (file.size > MAX_RECEIPT_BYTES) return 'This receipt is too large. Choose a file under 8 MB.';
  return null;
}
/** Header checks catch mislabeled content without installing a document/image parser. */
export function validateFileSignature(bytes: Uint8Array, type: string): boolean {
  if (type === 'image/jpeg') return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === 'image/png') return [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value);
  if (type === 'application/pdf') return new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-';
  return false;
}
export function uploadInput(bytes: Uint8Array, mediaType: string): ReceiptInput {
  if (!validateFileSignature(bytes, mediaType)) throw new Error('The file contents do not match its type. Choose a valid JPG, PNG, or PDF.');
  return { sourceType: 'upload', content: { kind: 'file', bytes, mediaType: mediaType as 'image/jpeg' | 'image/png' | 'application/pdf' } };
}
