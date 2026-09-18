-- ==============================================================================
-- TRACE-AI — SUPABASE POSTGRESQL SCHEMA
-- Organization: Ministry of Home Affairs — National Crime Records Bureau (NCRB)
-- Project: SIH 26189 — AI-Powered Criminal Network Analysis System
-- ==============================================================================

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('investigator', 'analyst', 'administrator')),
    department VARCHAR(255) NOT NULL DEFAULT 'Women Safety Division, NCRB',
    badge_number VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. INVESTIGATIONS
CREATE TABLE IF NOT EXISTS investigations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    investigation_code VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'under_review', 'closed', 'archived')),
    priority VARCHAR(50) NOT NULL DEFAULT 'high' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    lead_investigator_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PERSONS (Suspects, Mules, Coordinators)
CREATE TABLE IF NOT EXISTS persons (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    person_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    alias VARCHAR(255),
    age INTEGER,
    gender VARCHAR(20),
    occupation VARCHAR(255),
    risk_score NUMERIC(5, 2) DEFAULT 0.00,
    network_score NUMERIC(5, 2) DEFAULT 0.00,
    primary_role VARCHAR(100) DEFAULT 'suspect',
    status VARCHAR(50) DEFAULT 'under_surveillance',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PHONE NUMBERS (CDR Devices)
CREATE TABLE IF NOT EXISTS phone_numbers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    phone_hash VARCHAR(255) UNIQUE NOT NULL,
    masked_number VARCHAR(50) NOT NULL,
    label VARCHAR(100),
    carrier VARCHAR(100),
    owner_person_id TEXT REFERENCES persons(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. VEHICLES (Vahan Records)
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    make_model VARCHAR(150),
    color VARCHAR(50),
    owner_person_id TEXT REFERENCES persons(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. LOCATIONS (Depots, Safehouses, Terminals)
CREATE TABLE IF NOT EXISTS locations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL DEFAULT 'New Delhi',
    state VARCHAR(100) NOT NULL DEFAULT 'Delhi',
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    location_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ORGANIZATIONS (Shell Entities, Corporate Fronts)
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    registration_id VARCHAR(100),
    headquarters_location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. BANK ACCOUNTS (Mule & Layering Channels)
CREATE TABLE IF NOT EXISTS bank_accounts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    account_reference VARCHAR(100) UNIQUE NOT NULL,
    bank_name VARCHAR(150) NOT NULL,
    account_type VARCHAR(100) NOT NULL,
    holder_person_id TEXT REFERENCES persons(id) ON DELETE SET NULL,
    holder_org_id TEXT REFERENCES organizations(id) ON DELETE SET NULL,
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. FIRS (First Information Reports)
CREATE TABLE IF NOT EXISTS firs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    fir_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    acts_sections VARCHAR(255),
    date TIMESTAMPTZ NOT NULL,
    police_station VARCHAR(150) NOT NULL,
    location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
    investigation_id TEXT REFERENCES investigations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. TRANSACTIONS (Financial Flow Edges)
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    sender_account_id TEXT REFERENCES bank_accounts(id) ON DELETE CASCADE,
    receiver_account_id TEXT REFERENCES bank_accounts(id) ON DELETE CASCADE,
    amount NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    timestamp TIMESTAMPTZ NOT NULL,
    transaction_type VARCHAR(100) NOT NULL,
    is_suspicious BOOLEAN DEFAULT FALSE,
    suspicion_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. COMMUNICATIONS (CDR Call Logs)
CREATE TABLE IF NOT EXISTS communications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    source_phone_id TEXT REFERENCES phone_numbers(id) ON DELETE CASCADE,
    target_phone_id TEXT REFERENCES phone_numbers(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL,
    duration INTEGER NOT NULL,
    communication_type VARCHAR(50) NOT NULL CHECK (communication_type IN ('call', 'sms', 'encrypted_voip')),
    tower_location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. RELATIONSHIPS (Heterogeneous Graph Edges)
CREATE TABLE IF NOT EXISTS relationships (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    investigation_id TEXT REFERENCES investigations(id) ON DELETE CASCADE,
    source_entity_type VARCHAR(50) NOT NULL,
    source_entity_id TEXT NOT NULL,
    target_entity_type VARCHAR(50) NOT NULL,
    target_entity_id TEXT NOT NULL,
    relationship_type VARCHAR(100) NOT NULL,
    confidence NUMERIC(5, 2) NOT NULL DEFAULT 85.00,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source VARCHAR(255) NOT NULL DEFAULT 'CDR & Field Intelligence',
    evidence_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. EVIDENCE (Tamper-Evident SHA-256 Chain of Custody)
CREATE TABLE IF NOT EXISTS evidence (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    evidence_code VARCHAR(100) UNIQUE NOT NULL,
    investigation_id TEXT REFERENCES investigations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    file_path VARCHAR(500),
    file_size_bytes BIGINT DEFAULT 0,
    sha256_hash VARCHAR(64) NOT NULL,
    source_type VARCHAR(100) NOT NULL,
    source_url VARCHAR(500),
    created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'tampered', 'pending_review'))
);

-- 14. ALERTS (Emerging Networks, Hidden Links, Coordinated Activity)
CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    alert_code VARCHAR(100) UNIQUE NOT NULL,
    alert_type VARCHAR(100) NOT NULL CHECK (alert_type IN ('emerging_network', 'hidden_relationship', 'coordinated_activity', 'financial_pattern', 'unusual_activity')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    confidence NUMERIC(5, 2) NOT NULL DEFAULT 85.00,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'confirmed', 'dismissed')),
    investigation_id TEXT REFERENCES investigations(id) ON DELETE CASCADE,
    entities JSONB DEFAULT '[]'::jsonb,
    supporting_evidence_codes JSONB DEFAULT '[]'::jsonb,
    explanation_factors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. OSINT RESULTS (Public-Web Open Source Intelligence)
CREATE TABLE IF NOT EXISTS osint_results (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    investigation_id TEXT REFERENCES investigations(id) ON DELETE CASCADE,
    query VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    snippet TEXT NOT NULL,
    url VARCHAR(1000) NOT NULL,
    source_domain VARCHAR(255) NOT NULL,
    published_at TIMESTAMPTZ,
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    relevance_score NUMERIC(5, 2) NOT NULL DEFAULT 85.00,
    entities_found JSONB DEFAULT '[]'::jsonb,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'rejected', 'needs_review')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. AUDIT LOGS (Immutable Law Enforcement Audit Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- INDEXES FOR HIGH PERFORMANCE GRAPH & TEMPORAL QUERIES
CREATE INDEX IF NOT EXISTS idx_relationships_investigation ON relationships(investigation_id);
CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(source_entity_type, source_entity_id);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships(target_entity_type, target_entity_id);
CREATE INDEX IF NOT EXISTS idx_relationships_timestamp ON relationships(timestamp);
CREATE INDEX IF NOT EXISTS idx_communications_timestamp ON communications(timestamp);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_alerts_investigation ON alerts(investigation_id);
CREATE INDEX IF NOT EXISTS idx_evidence_hash ON evidence(sha256_hash);
CREATE INDEX IF NOT EXISTS idx_osint_investigation ON osint_results(investigation_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- ACCESS PERMISSIONS (Allow API keys to read/write)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE investigations DISABLE ROW LEVEL SECURITY;
ALTER TABLE persons DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE firs DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE communications DISABLE ROW LEVEL SECURITY;
ALTER TABLE relationships DISABLE ROW LEVEL SECURITY;
ALTER TABLE evidence DISABLE ROW LEVEL SECURITY;
ALTER TABLE alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE osint_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
