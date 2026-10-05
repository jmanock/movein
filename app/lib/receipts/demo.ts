import type { ParsedReceipt, ReceiptExtractor } from './types.ts';

const sample: ParsedReceipt = {
  merchant: 'The Home Depot', purchaseDate: '2026-10-02', subtotalMinor: 76900,
  taxMinor: 5383, totalMinor: 82283, currency: 'USD', extractionConfidence: null,
  items: [
    { rawDescription: 'WEBER SPIRIT GRILL', normalizedName: 'Weber Spirit Grill', quantity: 1, unitPriceMinor: 59900, totalPriceMinor: 59900, category: 'Outdoor living', isHouseholdAsset: true, assetReason: 'A durable household purchase' },
    { rawDescription: 'RYOBI DRILL KIT', normalizedName: 'Ryobi Drill', quantity: 1, unitPriceMinor: 12900, totalPriceMinor: 12900, category: 'Tools', isHouseholdAsset: true, assetReason: 'A tool worth keeping track of' },
    { rawDescription: 'GRILL CLEANER', normalizedName: 'Grill Cleaner', quantity: 1, unitPriceMinor: 1400, totalPriceMinor: 1400, category: 'Cleaning supplies', isHouseholdAsset: false, assetReason: 'A consumable supply' },
    { rawDescription: 'PAPER TOWELS', normalizedName: 'Paper Towels', quantity: 1, unitPriceMinor: 1800, totalPriceMinor: 1800, category: 'Household supplies', isHouseholdAsset: false, assetReason: 'An everyday consumable' },
    { rawDescription: 'SCREWS 100 PACK', normalizedName: 'Screws', quantity: 1, unitPriceMinor: 900, totalPriceMinor: 900, category: 'Hardware', isHouseholdAsset: false, assetReason: 'A small project supply' },
  ],
};

/** Sample interpreter only. Never reads the supplied file and never runs in production. */
export function developmentExtractor(): ReceiptExtractor {
  if (process.env.NODE_ENV !== 'development') throw new Error('Real receipt extraction is not configured');
  return { async extract() { return structuredClone(sample); } };
}
