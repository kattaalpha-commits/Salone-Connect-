-- ============================================================================
-- SALONE CONNECT DATING - PRODUCTION POSTGRESQL + POSTGIS SCHEMA (STEP 1)
-- ============================================================================
-- Features:
--  1. Geospatial indexing with PostGIS for radius / location queries.
--  2. Strict >= 18 age constraint and unique username indexing.
--  3. High-throughput swipe engine with mutual like verification indexes.
--  4. Symmetric pair guarantee on matches (user1_id < user2_id).
--  5. Real-time chat messaging with composite indexes for cursor pagination.
--  6. Safety, blocking, and reporting tables for user protection.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE user_gender AS ENUM ('man', 'woman', 'non-binary');
CREATE TYPE user_seeking AS ENUM ('men', 'women', 'everyone');
CREATE TYPE swipe_action AS ENUM ('like', 'pass', 'superlike');
CREATE TYPE relationship_goal AS ENUM ('friendship', 'long-term', 'short-term', 'marriage', 'casual');
CREATE TYPE verification_badge AS ENUM ('none', 'photo_pose', 'liveness_3d', 'government_id');
CREATE TYPE message_type AS ENUM ('text', 'image', 'voice_note', 'view_once', 'escrow_pill');
CREATE TYPE report_reason AS ENUM ('impersonation', 'harassment', 'inappropriate_content', 'scam', 'underage', 'other');

-- ============================================================================
-- 3. USERS TABLE (Authentication & Account Credentials)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(30) UNIQUE,
    password_hash VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);

-- ============================================================================
-- 4. PROFILES TABLE (Demographics, Location Geography & Cultural Preferences)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INT GENERATED ALWAYS AS (
        DATE_PART('year', AGE(CURRENT_DATE, date_of_birth))::INT
    ) STORED,
    gender user_gender NOT NULL,
    seeking user_seeking NOT NULL DEFAULT 'everyone',
    bio TEXT CHECK (CHAR_LENGTH(bio) <= 1000),
    profession VARCHAR(100),
    company VARCHAR(100),
    school_or_university VARCHAR(150),
    religion VARCHAR(80),
    district VARCHAR(80) NOT NULL DEFAULT 'Western Area Urban (Freetown)',
    location_city VARCHAR(100) DEFAULT 'Freetown',
    location_country VARCHAR(100) DEFAULT 'Sierra Leone',
    
    -- PostGIS Point geography: SRID 4326 (WGS 84, Lat/Lon)
    location GEOGRAPHY(Point, 4326),
    max_discovery_distance_km INT NOT NULL DEFAULT 100 CHECK (max_discovery_distance_km > 0),
    min_age_preference INT NOT NULL DEFAULT 18 CHECK (min_age_preference >= 18),
    max_age_preference INT NOT NULL DEFAULT 65 CHECK (max_age_preference >= min_age_preference),

    photos TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_type verification_badge NOT NULL DEFAULT 'none',
    liveness_verified BOOLEAN NOT NULL DEFAULT FALSE,
    
    relationship_goal relationship_goal NOT NULL DEFAULT 'friendship',
    dialects TEXT[] DEFAULT ARRAY['Krio', 'English'],
    favorite_dish VARCHAR(100) DEFAULT 'Cassava Leaf & Rice',
    weekend_vibe VARCHAR(100) DEFAULT 'Lion Mountains Peak Views',
    football_club VARCHAR(80) DEFAULT 'Arsenal',

    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    premium_tier VARCHAR(50),
    is_spotlight BOOLEAN NOT NULL DEFAULT FALSE,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Strict age threshold constraint (must be at least 18 years old)
    CONSTRAINT chk_minimum_age_18 CHECK (
        date_of_birth <= (CURRENT_DATE - INTERVAL '18 years')
    ),
    -- Safe username regex (alphanumeric & underscore only)
    CONSTRAINT chk_valid_username_format CHECK (
        username ~ '^[a-zA-Z0-9_]{3,30}$'
    )
);

-- PostGIS GiST spatial index for high-speed radius / bounding-box calculations
CREATE INDEX idx_profiles_location_gist ON profiles USING GIST(location);

-- Discovery Candidate filtering indexes
CREATE INDEX idx_profiles_seeking_gender ON profiles(gender, seeking);
CREATE INDEX idx_profiles_age ON profiles(age);
CREATE INDEX idx_profiles_last_active ON profiles(last_active_at DESC);
CREATE INDEX idx_profiles_district ON profiles(district);

-- ============================================================================
-- 5. SWIPES TABLE (High-Throughput Interactions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS swipes (
    id BIGSERIAL PRIMARY KEY,
    swiper_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action swipe_action NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate swipes on the same target
    CONSTRAINT uq_swiper_target UNIQUE (swiper_id, target_id),
    CONSTRAINT chk_cannot_swipe_self CHECK (swiper_id <> target_id)
);

-- Fast exclusion index: "Find all users swiper_id has already swiped on"
CREATE INDEX idx_swipes_swiper ON swipes(swiper_id, target_id);

-- Mutual match lookup index: "Did target_id like swiper_id back?"
CREATE INDEX idx_swipes_target_action ON swipes(target_id, swiper_id) WHERE action IN ('like', 'superlike');

-- ============================================================================
-- 6. MATCHES TABLE (Mutual Connections)
-- ============================================================================
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Enforce canonical ordering: user1_id is always less than user2_id to guarantee unique pairs
    user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_message_at TIMESTAMPTZ,
    last_message_preview TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_canonical_user_order CHECK (user1_id < user2_id),
    CONSTRAINT uq_match_pair UNIQUE (user1_id, user2_id)
);

CREATE INDEX idx_matches_user1 ON matches(user1_id) WHERE is_active = TRUE;
CREATE INDEX idx_matches_user2 ON matches(user2_id) WHERE is_active = TRUE;
CREATE INDEX idx_matches_last_message ON matches(last_message_at DESC NULLS LAST);

-- ============================================================================
-- 7. MESSAGES TABLE (Real-Time Chat & History)
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    msg_type message_type NOT NULL DEFAULT 'text',
    media_url TEXT,
    is_view_once BOOLEAN NOT NULL DEFAULT FALSE,
    is_view_once_opened BOOLEAN NOT NULL DEFAULT FALSE,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound index for cursor-based chat history pagination (match_id, created_at DESC)
CREATE INDEX idx_messages_match_pagination ON messages(match_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read) WHERE is_read = FALSE;

-- ============================================================================
-- 8. BLOCKS & SAFETY REPORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_blocks (
    id BIGSERIAL PRIMARY KEY,
    blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_block_pair UNIQUE (blocker_id, blocked_id),
    CONSTRAINT chk_cannot_block_self CHECK (blocker_id <> blocked_id)
);

CREATE INDEX idx_user_blocks_blocker ON user_blocks(blocker_id, blocked_id);

CREATE TABLE IF NOT EXISTS safety_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason report_reason NOT NULL,
    details TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_safety_reports_status ON safety_reports(status, created_at DESC);

-- ============================================================================
-- 9. AUTOMATED TRIGGERS (Updated Timestamp & Mutual Match Engine)
-- ============================================================================

-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Trigger to update match last_message_at
CREATE OR REPLACE FUNCTION trigger_update_match_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE matches
    SET last_message_at = NEW.created_at,
        last_message_preview = SUBSTRING(NEW.content, 1, 60)
    WHERE id = NEW.match_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_messages_update_match
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION trigger_update_match_last_message();
