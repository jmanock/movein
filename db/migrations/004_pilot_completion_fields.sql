ALTER TABLE zip_codes ADD COLUMN mailing_city_name TEXT;
ALTER TABLE zip_codes ADD COLUMN jurisdiction_status TEXT NOT NULL DEFAULT 'unknown'
  CHECK (jurisdiction_status IN ('incorporated', 'unincorporated', 'mixed', 'unknown'));

ALTER TABLE providers ADD COLUMN outage_map_url TEXT;
ALTER TABLE providers ADD COLUMN collection_info_url TEXT;

ALTER TABLE correction_submissions ADD COLUMN issue_kind TEXT NOT NULL DEFAULT 'other'
  CHECK (issue_kind IN ('wrong-electric-provider', 'wrong-water-provider', 'wrong-sewer-provider', 'missing-utility', 'incorrect-phone', 'broken-official-link', 'incorrect-location', 'incorrect-trash', 'incorrect-internet', 'other'));

UPDATE correction_submissions SET issue_kind = CASE issue_type
  WHEN 'missing-provider' THEN 'missing-utility'
  WHEN 'broken-website' THEN 'broken-official-link'
  ELSE issue_type
END;

CREATE INDEX IF NOT EXISTS idx_correction_issue_kind ON correction_submissions(issue_kind, workflow_status);
