-- Retry-safe reviewed saves; nullable for existing foundation receipts.
ALTER TABLE receipts ADD COLUMN save_request_id TEXT;
ALTER TABLE receipts ADD COLUMN save_fingerprint TEXT;
CREATE UNIQUE INDEX receipts_save_request_idx ON receipts(save_request_id) WHERE save_request_id IS NOT NULL;
