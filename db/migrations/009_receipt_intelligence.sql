-- Purchase facts only; date evidence and model uncertainty remain transient.
ALTER TABLE receipts ADD COLUMN receipt_type TEXT NOT NULL DEFAULT 'unknown'
  CHECK (receipt_type IN ('purchase', 'return', 'mixed', 'unknown'));
ALTER TABLE receipt_items ADD COLUMN item_role TEXT NOT NULL DEFAULT 'other'
  CHECK (item_role IN ('durable_asset', 'consumable', 'maintenance_supply', 'replacement_part', 'service', 'food', 'apparel', 'other'));
