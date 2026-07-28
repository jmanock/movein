ALTER TABLE zip_codes ADD COLUMN confidence_status TEXT CHECK (confidence_status IN ('verified', 'probable', 'partial', 'pending', 'conflicting'));
ALTER TABLE zip_codes ADD COLUMN jurisdiction_notes TEXT;

ALTER TABLE providers ADD COLUMN provider_type TEXT;
ALTER TABLE providers ADD COLUMN start_service_url TEXT;
ALTER TABLE providers ADD COLUMN address_check_url TEXT;
ALTER TABLE providers ADD COLUMN outage_url TEXT;
ALTER TABLE providers ADD COLUMN hours TEXT;
ALTER TABLE providers ADD COLUMN technology_type TEXT;

ALTER TABLE service_areas ADD COLUMN service_availability TEXT CHECK (service_availability IN ('confirmed', 'primary_municipal', 'possible', 'multiple_possible', 'address_required', 'varies', 'unverified', 'not_generally_available'));
ALTER TABLE service_areas ADD COLUMN requires_address_confirmation INTEGER NOT NULL DEFAULT 1 CHECK (requires_address_confirmation IN (0, 1));
ALTER TABLE service_areas ADD COLUMN jurisdiction_notes TEXT;

CREATE TABLE IF NOT EXISTS zip_jurisdictions (
  id INTEGER PRIMARY KEY,
  zip_code_id INTEGER NOT NULL REFERENCES zip_codes(id) ON DELETE CASCADE,
  city_id INTEGER REFERENCES cities(id),
  jurisdiction_type TEXT NOT NULL CHECK (jurisdiction_type IN ('primary_mailing_city', 'additional_city', 'unincorporated_area')),
  is_confirmed INTEGER NOT NULL DEFAULT 0 CHECK (is_confirmed IN (0, 1)),
  source_url TEXT,
  notes TEXT,
  UNIQUE (zip_code_id, city_id, jurisdiction_type)
);

ALTER TABLE correction_submissions ADD COLUMN issue_type TEXT NOT NULL DEFAULT 'other' CHECK (issue_type IN ('wrong-electric-provider', 'wrong-water-provider', 'missing-provider', 'incorrect-phone', 'broken-website', 'outdated-outage-number', 'incorrect-location', 'other'));
ALTER TABLE correction_submissions ADD COLUMN workflow_status TEXT NOT NULL DEFAULT 'new' CHECK (workflow_status IN ('new', 'reviewing', 'accepted', 'rejected', 'resolved'));
ALTER TABLE correction_submissions ADD COLUMN updated_at INTEGER;

CREATE INDEX IF NOT EXISTS idx_zip_jurisdictions_zip ON zip_jurisdictions(zip_code_id);
CREATE INDEX IF NOT EXISTS idx_correction_workflow_status ON correction_submissions(workflow_status, created_at);
