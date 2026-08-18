-- ONE! Profile v2 - SAFE Migration for existing Supabase DB
-- Old project uses text IDs, not uuid — FK references must match
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/wrvzdonjvislrkeltjer/sql/new

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ALTER existing students table — add v2 columns
-- =====================================================
DO $$ BEGIN
  ALTER TABLE students ADD COLUMN IF NOT EXISTS perks TEXT[] DEFAULT '{}';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE students ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE students ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE students ADD COLUMN IF NOT EXISTS gems INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE students ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE students ADD COLUMN IF NOT EXISTS last_bonus_date DATE;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE students ADD COLUMN IF NOT EXISTS prestige_count INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE students ADD COLUMN IF NOT EXISTS prestige_constellation TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- =====================================================
-- 2. Skills — TEXT FK to match students.id
-- =====================================================
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('strategy', 'language', 'communication', 'sport', 'it', 'art', 'entrepreneurship')),
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, direction)
);

-- =====================================================
-- 3. Squads
-- =====================================================
CREATE TABLE IF NOT EXISTS squads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  shift_id TEXT REFERENCES shifts(id) ON DELETE CASCADE,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 4. Squad Members
-- =====================================================
CREATE TABLE IF NOT EXISTS squad_members (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  squad_id TEXT NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(squad_id, student_id)
);

-- =====================================================
-- 5. Mission Completions — FK to missions.id (check type first)
-- =====================================================
DO $$
BEGIN
  -- If missions.id is uuid, we need text FK
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'missions' AND column_name = 'id' AND udt_name = 'uuid'
  ) THEN
    CREATE TABLE IF NOT EXISTS mission_completions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      mission_id TEXT NOT NULL,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'graded', 'credited')),
      grade INTEGER CHECK (grade BETWEEN 1 AND 5),
      graded_by TEXT REFERENCES students(id),
      graded_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  ELSE
    CREATE TABLE IF NOT EXISTS mission_completions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      mission_id TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'graded', 'credited')),
      grade INTEGER CHECK (grade BETWEEN 1 AND 5),
      graded_by TEXT REFERENCES students(id),
      graded_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  END IF;
END $$;

-- =====================================================
-- 6. Student Badges — FK to badges.id (check type)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'badges' AND column_name = 'id' AND udt_name = 'uuid'
  ) THEN
    CREATE TABLE IF NOT EXISTS student_badges (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      badge_id TEXT NOT NULL,
      earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(student_id, badge_id)
    );
  ELSE
    CREATE TABLE IF NOT EXISTS student_badges (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
      earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(student_id, badge_id)
    );
  END IF;
END $$;

-- =====================================================
-- 7. Student Skins — FK to concept_skins.id (check type)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'concept_skins' AND column_name = 'id' AND udt_name = 'uuid'
  ) THEN
    CREATE TABLE IF NOT EXISTS student_skins (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      skin_id TEXT NOT NULL,
      equipped BOOLEAN DEFAULT false,
      purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(student_id, skin_id)
    );
  ELSE
    CREATE TABLE IF NOT EXISTS student_skins (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      skin_id TEXT NOT NULL REFERENCES concept_skins(id) ON DELETE CASCADE,
      equipped BOOLEAN DEFAULT false,
      purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(student_id, skin_id)
    );
  END IF;
END $$;

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_skills_student ON skills(student_id);
CREATE INDEX IF NOT EXISTS idx_skills_direction ON skills(direction);
CREATE INDEX IF NOT EXISTS idx_mission_completions_student ON mission_completions(student_id);
CREATE INDEX IF NOT EXISTS idx_mission_completions_status ON mission_completions(status);
CREATE INDEX IF NOT EXISTS idx_student_badges_student ON student_badges(student_id);
CREATE INDEX IF NOT EXISTS idx_squad_members_student ON squad_members(student_id);
CREATE INDEX IF NOT EXISTS idx_squad_members_squad ON squad_members(squad_id);

-- =====================================================
-- RLS — disabled for MVP
-- =====================================================
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for skills" ON skills FOR ALL USING (true);
CREATE POLICY "Allow all for squads" ON squads FOR ALL USING (true);
CREATE POLICY "Allow all for squad_members" ON squad_members FOR ALL USING (true);
CREATE POLICY "Allow all for mission_completions" ON mission_completions FOR ALL USING (true);
CREATE POLICY "Allow all for student_badges" ON student_badges FOR ALL USING (true);
CREATE POLICY "Allow all for student_skins" ON student_skins FOR ALL USING (true);

-- Ensure RLS on existing tables
DO $$ BEGIN
  ALTER TABLE students ENABLE ROW LEVEL SECURITY;
  ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  ALTER TABLE sport_stats ENABLE ROW LEVEL SECURITY;
  ALTER TABLE concept_skins ENABLE ROW LEVEL SECURITY;
  ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN CREATE POLICY "Allow all for students" ON students FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Allow all for missions" ON missions FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Allow all for badges" ON badges FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Allow all for projects" ON projects FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Allow all for sport_stats" ON sport_stats FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Allow all for concept_skins" ON concept_skins FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Allow all for shifts" ON shifts FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
