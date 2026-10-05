import sharp from 'sharp';
import { ReceiptExtractionError } from './errors.ts';

export const MAX_RECEIPT_PIXELS = 20_000_000;
/** Decode under a pixel cap before handing untrusted compressed bytes to the model. No disk output. */
export async function validateReceiptImage(bytes: Uint8Array, mediaType: string) {
  try {
    const image = sharp(bytes, { limitInputPixels: MAX_RECEIPT_PIXELS, failOn: 'warning' });
    const metadata = await image.metadata();
    if (metadata.format !== (mediaType === 'image/png' ? 'png' : 'jpeg') || !metadata.width || !metadata.height || metadata.width * metadata.height > MAX_RECEIPT_PIXELS || (metadata.pages ?? 1) > 1) throw new Error('image');
    await image.stats(); // Header recognition alone would allow truncated or malformed pixel data.
  } catch {
    throw new ReceiptExtractionError('image', 'Choose a complete JPG or PNG photo under 20 megapixels. This image could not be safely opened.');
  }
}
