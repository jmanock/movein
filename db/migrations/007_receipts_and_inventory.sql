-- Structured records only. Raw uploads and email bodies are never stored here.
CREATE TABLE receipts (
  id TEXT PRIMARY KEY NOT NULL,
  merchant TEXT,
  purchase_date TEXT,
  subtotal_minor INTEGER CHECK (subtotal_minor IS NULL OR typeof(subtotal_minor) = 'integer'),
  tax_minor INTEGER CHECK (tax_minor IS NULL OR typeof(tax_minor) = 'integer'),
  total_minor INTEGER CHECK (total_minor IS NULL OR typeof(total_minor) = 'integer'),
  currency TEXT NOT NULL CHECK (length(currency) = 3 AND currency GLOB '[A-Z][A-Z][A-Z]'),
  source_type TEXT NOT NULL CHECK (source_type IN ('upload', 'email', 'manual', 'test')),
  extraction_status TEXT NOT NULL CHECK (extraction_status IN ('needs_review', 'reviewed')),
  extraction_confidence REAL CHECK (extraction_confidence BETWEEN 0 AND 1),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE receipt_items (
  id TEXT PRIMARY KEY NOT NULL,
  receipt_id TEXT NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  raw_description TEXT NOT NULL,
  normalized_name TEXT,
  quantity REAL NOT NULL CHECK (quantity > 0),
  unit_price_minor INTEGER CHECK (unit_price_minor IS NULL OR typeof(unit_price_minor) = 'integer'),
  total_price_minor INTEGER CHECK (total_price_minor IS NULL OR typeof(total_price_minor) = 'integer'),
  category TEXT,
  is_household_asset INTEGER NOT NULL DEFAULT 0 CHECK (is_household_asset IN (0, 1)),
  asset_reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (receipt_id, id)
);
CREATE INDEX receipt_items_receipt_idx ON receipt_items(receipt_id);
CREATE TABLE inventory_items (
  id TEXT PRIMARY KEY NOT NULL,
  source_receipt_id TEXT NOT NULL,
  source_receipt_item_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  category TEXT,
  purchase_date TEXT,
  merchant TEXT,
  purchase_price_minor INTEGER CHECK (purchase_price_minor IS NULL OR typeof(purchase_price_minor) = 'integer'),
  currency TEXT NOT NULL CHECK (length(currency) = 3 AND currency GLOB '[A-Z][A-Z][A-Z]'),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_receipt_id, source_receipt_item_id)
    REFERENCES receipt_items(receipt_id, id) ON DELETE RESTRICT
);
CREATE INDEX inventory_items_receipt_idx ON inventory_items(source_receipt_id);
