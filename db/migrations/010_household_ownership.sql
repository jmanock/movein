-- Add ownership without rebuilding or deleting existing receipt tables.
CREATE TABLE households (
  id TEXT PRIMARY KEY NOT NULL CHECK (length(trim(id)) > 0),
  display_name TEXT NOT NULL CHECK (length(trim(display_name)) > 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Quarantine legacy records in a named local household; never assign them to a future user.
INSERT INTO households (id, display_name)
VALUES ('00000000-0000-4000-8000-000000000001', 'Legacy local household');
ALTER TABLE receipts ADD COLUMN household_id TEXT REFERENCES households(id) ON DELETE RESTRICT;
UPDATE receipts SET household_id = '00000000-0000-4000-8000-000000000001';
CREATE INDEX receipts_household_created_idx ON receipts(household_id, created_at);
-- Retry keys belong to a household, not to the entire application.
DROP INDEX receipts_save_request_idx;
CREATE UNIQUE INDEX receipts_household_save_request_idx ON receipts(household_id, save_request_id)
WHERE save_request_id IS NOT NULL;
-- SQLite ADD COLUMN cannot add a NOT NULL FK without a default or table rebuild.
-- Enforce required ownership on future inserts and forbid reassignment at the DB boundary.
CREATE TRIGGER receipts_require_household BEFORE INSERT ON receipts
WHEN NEW.household_id IS NULL
BEGIN SELECT RAISE(ABORT, 'Receipt household is required'); END;
CREATE TRIGGER receipts_immutable_household BEFORE UPDATE OF household_id ON receipts
WHEN NEW.household_id IS NOT OLD.household_id
BEGIN SELECT RAISE(ABORT, 'Receipt household cannot be changed'); END;
-- Inventory inherits its sole owner through source_receipt_id. Its existing composite FK
-- verifies that source_receipt_item_id really belongs to that receipt. Neither a line
-- nor an inventory item may be moved to a different receipt (and hence household).
CREATE TRIGGER receipt_items_immutable_receipt BEFORE UPDATE OF receipt_id ON receipt_items
WHEN NEW.receipt_id IS NOT OLD.receipt_id
BEGIN SELECT RAISE(ABORT, 'Receipt item provenance cannot be changed'); END;
CREATE TRIGGER inventory_immutable_provenance BEFORE UPDATE OF source_receipt_id, source_receipt_item_id ON inventory_items
WHEN NEW.source_receipt_id IS NOT OLD.source_receipt_id OR NEW.source_receipt_item_id IS NOT OLD.source_receipt_item_id
BEGIN SELECT RAISE(ABORT, 'Inventory provenance cannot be changed'); END;
