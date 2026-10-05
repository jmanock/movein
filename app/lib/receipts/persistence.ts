import type Database from 'better-sqlite3';
import { createHash, randomUUID } from 'node:crypto';
import { normalizeReceipt } from './processing.ts';
import type { InventoryCandidate, InventoryItem, ParsedReceipt, Receipt, ReceiptItem, ReceiptHistoryEntry, SourceType } from './types.ts';

const receiptColumns = `id, merchant, purchase_date AS purchaseDate, subtotal_minor AS subtotalMinor,
 tax_minor AS taxMinor, total_minor AS totalMinor, currency, receipt_type AS receiptType, source_type AS sourceType,
 extraction_status AS extractionStatus, extraction_confidence AS extractionConfidence,
 created_at AS createdAt, updated_at AS updatedAt`;
const itemColumns = `id, receipt_id AS receiptId, raw_description AS rawDescription,
 normalized_name AS normalizedName, quantity, unit_price_minor AS unitPriceMinor,
 total_price_minor AS totalPriceMinor, category, is_household_asset AS isHouseholdAsset,
 item_role AS itemRole, asset_reason AS assetReason, created_at AS createdAt`;
const inventoryColumns = `id, source_receipt_id AS sourceReceiptId, source_receipt_item_id AS sourceReceiptItemId,
 name, category, purchase_date AS purchaseDate, merchant, purchase_price_minor AS purchasePriceMinor,
 currency, created_at AS createdAt, updated_at AS updatedAt`;

/** Server-side repository. Caller supplies the existing WAL/FK-enabled connection.
 * Every instance is bound to one existing household. Inventory inherits receipt ownership.
 */
export function createReceiptRepository(database: Database.Database, householdId: string) {
  if (typeof householdId !== 'string' || !householdId.trim() || !database.prepare('SELECT id FROM households WHERE id = ?').get(householdId)) {
    throw new Error('A valid household context is required');
  }
  function get(id: string): Receipt | null {
    const row = database.prepare(`SELECT ${receiptColumns} FROM receipts WHERE id = ? AND household_id = ?`).get(id, householdId) as Omit<Receipt, 'items'> | undefined;
    if (!row) return null;
    const items = database.prepare(`SELECT ${itemColumns} FROM receipt_items WHERE receipt_id = ? AND receipt_id IN (SELECT id FROM receipts WHERE household_id = ?) ORDER BY rowid`).all(id, householdId) as (Omit<ReceiptItem, 'isHouseholdAsset'> & { isHouseholdAsset: number })[];
    return { ...row, items: items.map((item) => ({ ...item, isHouseholdAsset: item.isHouseholdAsset === 1 })) };
  }
  function save(parsed: ParsedReceipt, sourceType: SourceType): Receipt {
    const data = normalizeReceipt(parsed);
    const id = randomUUID();
    database.transaction(() => {
      database.prepare(`INSERT INTO receipts (id, household_id, merchant, purchase_date, subtotal_minor, tax_minor, total_minor, currency, source_type, extraction_status, extraction_confidence, receipt_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'needs_review', ?, ?)`).run(id, householdId, data.merchant, data.purchaseDate, data.subtotalMinor, data.taxMinor, data.totalMinor, data.currency, sourceType, data.extractionConfidence, data.receiptType ?? 'unknown');
      const insert = database.prepare(`INSERT INTO receipt_items (id, receipt_id, raw_description, normalized_name, quantity, unit_price_minor, total_price_minor, category, is_household_asset, asset_reason, item_role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      for (const item of data.items) insert.run(randomUUID(), id, item.rawDescription, item.normalizedName, item.quantity, item.unitPriceMinor, item.totalPriceMinor, item.category, Number(item.isHouseholdAsset), item.assetReason, item.itemRole ?? 'other');
    })();
    return get(id)!;
  }
  function candidates(id: string): InventoryCandidate[] {
    const receipt = get(id);
    if (!receipt) return [];
    return receipt.items.filter((item) => item.isHouseholdAsset).map((item) => ({
      sourceReceiptId: receipt.id, sourceReceiptItemId: item.id,
      name: item.normalizedName ?? item.rawDescription, category: item.category,
      purchaseDate: receipt.purchaseDate, merchant: receipt.merchant,
      purchasePriceMinor: item.totalPriceMinor, currency: receipt.currency,
    }));
  }
  /** Explicit confirmation; retrying promotion returns the existing inventory record. */
  function promote(receiptId: string, receiptItemId: string): InventoryItem {
    return database.transaction(() => {
      const candidate = candidates(receiptId).find((item) => item.sourceReceiptItemId === receiptItemId);
      if (!candidate) throw new Error('Receipt item is not an inventory candidate');
      const existing = database.prepare(`SELECT ${inventoryColumns} FROM inventory_items WHERE source_receipt_item_id = ? AND source_receipt_id IN (SELECT id FROM receipts WHERE household_id = ?)`).get(receiptItemId, householdId) as InventoryItem | undefined;
      if (existing) return existing;
      const id = randomUUID();
      database.prepare(`INSERT INTO inventory_items (id, source_receipt_id, source_receipt_item_id, name, category, purchase_date, merchant, purchase_price_minor, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(id, candidate.sourceReceiptId, candidate.sourceReceiptItemId, candidate.name, candidate.category, candidate.purchaseDate, candidate.merchant, candidate.purchasePriceMinor, candidate.currency);
      return database.prepare(`SELECT ${inventoryColumns} FROM inventory_items WHERE id = ? AND source_receipt_id IN (SELECT id FROM receipts WHERE household_id = ?)`).get(id, householdId) as InventoryItem;
    })();
  }
  function listInventory(receiptId?: string): InventoryItem[] {
    return database.prepare(`SELECT ${inventoryColumns} FROM inventory_items WHERE source_receipt_id IN (SELECT id FROM receipts WHERE household_id = ?) ${receiptId ? 'AND source_receipt_id = ?' : ''} ORDER BY created_at DESC, rowid DESC`).all(householdId, ...(receiptId ? [receiptId] : [])) as InventoryItem[];
  }
  /** Outer transaction covers the header, every line, and every selected inventory item. */
  function saveReviewed(parsed: ParsedReceipt, selected: number[], requestId: string, sourceType: SourceType = 'test') {
    if (!/^[0-9a-f-]{36}$/i.test(requestId)) throw new Error('Invalid save request');
    const data = normalizeReceipt(parsed);
    if (!data.items.length) throw new Error('This receipt has no usable items');
    if (!Array.isArray(selected) || new Set(selected).size !== selected.length || selected.some((index) => !Number.isInteger(index) || index < 0 || index >= data.items.length)) throw new Error('Invalid inventory selection');
    const fingerprint = createHash('sha256').update(JSON.stringify({ data, selected: [...selected].sort((a, b) => a - b) })).digest('hex');
    return database.transaction(() => {
      const previous = database.prepare('SELECT id, save_fingerprint FROM receipts WHERE save_request_id = ? AND household_id = ?').get(requestId, householdId) as { id: string; save_fingerprint: string } | undefined;
      if (previous) {
        if (previous.save_fingerprint !== fingerprint) throw new Error('This save was already completed with different details. Start another receipt.');
        return { receipt: get(previous.id)!, inventory: listInventory(previous.id) };
      }
      const finalData = { ...data, items: data.items.map((item, index) => ({ ...item, isHouseholdAsset: selected.includes(index), assetReason: selected.includes(index) ? 'Selected during review' : 'Not selected during review' })) };
      // Real uploads retain their input provenance; demo records stay test records.
      const receipt = save(finalData, sourceType);
      database.prepare("UPDATE receipts SET extraction_status = 'reviewed', save_request_id = ?, save_fingerprint = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND household_id = ?").run(requestId, fingerprint, receipt.id, householdId);
      for (const index of selected) promote(receipt.id, receipt.items[index].id);
      return { receipt: get(receipt.id)!, inventory: listInventory(receipt.id) };
    })();
  }
  function listHistory(): ReceiptHistoryEntry[] {
    return database.prepare(`SELECT r.id, r.merchant, r.purchase_date AS purchaseDate,
      r.total_minor AS totalMinor, r.currency,
      (SELECT COUNT(*) FROM receipt_items WHERE receipt_id = r.id) AS itemCount,
      (SELECT COUNT(*) FROM inventory_items WHERE source_receipt_id = r.id) AS inventoryCount
      FROM receipts r WHERE r.household_id = ? AND r.extraction_status = 'reviewed' ORDER BY r.created_at DESC, r.rowid DESC`).all(householdId) as ReceiptHistoryEntry[];
  }
  return { get, save, candidates, promote, saveReviewed, listInventory, listHistory };
}
