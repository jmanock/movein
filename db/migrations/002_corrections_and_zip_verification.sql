ALTER TABLE zip_codes ADD COLUMN last_verified_at TEXT;

CREATE TABLE IF NOT EXISTS correction_submissions (
  id INTEGER PRIMARY KEY,
  zip_code TEXT NOT NULL CHECK (length(zip_code) = 5),
  provider_category TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  issue_details TEXT NOT NULL,
  source_url TEXT,
  reply_email TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'resolved', 'dismissed')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_correction_submissions_status_created
  ON correction_submissions(status, created_at);
CREATE INDEX IF NOT EXISTS idx_correction_submissions_zip
  ON correction_submissions(zip_code);
