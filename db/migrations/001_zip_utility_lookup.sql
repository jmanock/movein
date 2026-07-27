PRAGMA foreign_keys = ON;

-- The retired newsletter table is intentionally left untouched so a release
-- cannot destroy production subscriber data. The new product does not write to it.
CREATE TABLE IF NOT EXISTS states (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL UNIQUE CHECK (length(code) = 2),
  name TEXT NOT NULL UNIQUE,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1))
);

CREATE TABLE IF NOT EXISTS counties (
  id INTEGER PRIMARY KEY,
  state_id INTEGER NOT NULL REFERENCES states(id),
  name TEXT NOT NULL,
  fips_code TEXT,
  UNIQUE (state_id, name)
);

CREATE TABLE IF NOT EXISTS cities (
  id INTEGER PRIMARY KEY,
  state_id INTEGER NOT NULL REFERENCES states(id),
  county_id INTEGER REFERENCES counties(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  UNIQUE (state_id, county_id, name)
);

CREATE TABLE IF NOT EXISTS zip_codes (
  id INTEGER PRIMARY KEY,
  zip_code TEXT NOT NULL UNIQUE CHECK (length(zip_code) = 5),
  state_id INTEGER NOT NULL REFERENCES states(id),
  county_id INTEGER REFERENCES counties(id),
  primary_city_id INTEGER REFERENCES cities(id),
  latitude REAL,
  longitude REAL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('verified', 'partial', 'pending')),
  is_indexable INTEGER NOT NULL DEFAULT 0 CHECK (is_indexable IN (0, 1)),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  locality_source_url TEXT
);

CREATE TABLE IF NOT EXISTS provider_categories (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS providers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id INTEGER NOT NULL REFERENCES provider_categories(id),
  state_id INTEGER NOT NULL REFERENCES states(id),
  description TEXT,
  official_website TEXT NOT NULL,
  service_notes TEXT,
  is_verified INTEGER NOT NULL DEFAULT 0 CHECK (is_verified IN (0, 1)),
  last_verified_at TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('verified', 'partial', 'pending', 'inactive'))
);

CREATE TABLE IF NOT EXISTS service_areas (
  id INTEGER PRIMARY KEY,
  provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  zip_code_id INTEGER NOT NULL REFERENCES zip_codes(id) ON DELETE CASCADE,
  coverage_type TEXT NOT NULL CHECK (coverage_type IN ('primary', 'possible', 'address_required', 'varies', 'unverified')),
  coverage_notes TEXT NOT NULL,
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('high', 'medium', 'low', 'pending')),
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
  UNIQUE (provider_id, zip_code_id)
);

CREATE TABLE IF NOT EXISTS provider_contacts (
  id INTEGER PRIMARY KEY,
  provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('customer_service', 'outage', 'emergency', 'general')),
  label TEXT NOT NULL,
  phone TEXT NOT NULL,
  UNIQUE (provider_id, contact_type, phone)
);

CREATE TABLE IF NOT EXISTS data_sources (
  id INTEGER PRIMARY KEY,
  provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL,
  retrieved_at TEXT NOT NULL,
  notes TEXT,
  UNIQUE (provider_id, source_url)
);

CREATE TABLE IF NOT EXISTS verification_records (
  id INTEGER PRIMARY KEY,
  provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  verified_at TEXT NOT NULL,
  verification_method TEXT NOT NULL,
  verified_by TEXT NOT NULL,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_zip_codes_active ON zip_codes(zip_code, is_active);
CREATE INDEX IF NOT EXISTS idx_zip_codes_county ON zip_codes(county_id);
CREATE INDEX IF NOT EXISTS idx_providers_category_status ON providers(category_id, status);
CREATE INDEX IF NOT EXISTS idx_providers_state_status ON providers(state_id, status);
CREATE INDEX IF NOT EXISTS idx_service_areas_zip ON service_areas(zip_code_id);
CREATE INDEX IF NOT EXISTS idx_service_areas_provider ON service_areas(provider_id);
CREATE INDEX IF NOT EXISTS idx_verification_provider_date ON verification_records(provider_id, verified_at);
