import type { ItemRole, ReceiptType, UncertaintyFlag, DateOrder } from './intelligence-types.ts';
import type { ReviewSignal } from './quality.ts';

/** Money is integer currency minor units; null means unknown, never zero by default. */
export type SourceType = 'upload' | 'email' | 'manual' | 'test';
export type ExtractionStatus = 'needs_review' | 'reviewed';
export interface ParsedReceiptItem {
  rawDescription: string;
  normalizedName: string | null;
  quantity: number;
  unitPriceMinor: number | null;
  totalPriceMinor: number | null;
  category: string | null;
  isHouseholdAsset: boolean;
  assetReason: string | null;
  itemRole?: ItemRole;
  /** Transient interpretation uncertainty, not persisted facts. */
  uncertaintyFlags?: UncertaintyFlag[];
}
export interface ParsedReceipt {
  merchant: string | null;
  purchaseDate: string | null;
  subtotalMinor: number | null;
  taxMinor: number | null;
  totalMinor: number | null;
  currency: string;
  extractionConfidence: number | null;
  items: ParsedReceiptItem[];
  receiptType?: ReceiptType;
  /** Transient printed date evidence; no image or complete receipt text. */
  rawDateText?: string | null;
  dateOrder?: DateOrder;
  /** Ephemeral review hints; not stored as receipt facts. */
  reviewSignals?: ReviewSignal[];
}
export interface ReceiptItem extends ParsedReceiptItem {
  id: string;
  receiptId: string;
  createdAt: string;
}
export interface Receipt extends Omit<ParsedReceipt, 'items'> {
  id: string;
  sourceType: SourceType;
  extractionStatus: ExtractionStatus;
  createdAt: string;
  updatedAt: string;
  items: ReceiptItem[];
}
export interface InventoryCandidate {
  sourceReceiptId: string;
  sourceReceiptItemId: string;
  name: string;
  category: string | null;
  purchaseDate: string | null;
  merchant: string | null;
  purchasePriceMinor: number | null;
  currency: string;
}
export interface InventoryItem extends InventoryCandidate {
  id: string;
  createdAt: string;
  updatedAt: string;
}
/** Transport adapters supply bytes or text; no browser File or vendor response escapes here. */
export type ReceiptInput = {
  sourceType: SourceType;
  content: { kind: 'file'; bytes: Uint8Array; mediaType: 'image/jpeg' | 'image/png' | 'application/pdf' }
    | { kind: 'text'; text: string };
};
export interface ReceiptExtractor {
  extract(input: ReceiptInput): Promise<ParsedReceipt>;
}

/** Structured history only; no receipt images are stored. */
export interface ReceiptHistoryEntry {
  id: string;
  merchant: string | null;
  purchaseDate: string | null;
  totalMinor: number | null;
  currency: string;
  itemCount: number;
  inventoryCount: number;
}
