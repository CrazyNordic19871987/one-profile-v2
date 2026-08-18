-- ONE! Profile v2 - SAFE Migration for existing Supabase DB
-- Old project tables exist (students, clans, shifts, missions, badges, projects, sport_stats, concept_skins)
-- This adds missing columns + new tables only
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
-- 2. Skills (new table — per direction per student)
-- =====================================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('strategy', 'language', 'communication', 'sport', 'it', 'art', 'entrepreneurship')),
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, direction)
);

-- =====================================================
-- 3. Squads (new — distinct from old 'clans')
-- =====================================================
CREATE TABLE IF NOT EXISTS squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 4. Squad Members (new)
-- =====================================================
CREATE TABLE IF NOT EXISTS squad_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(squad_id, student_id)
);

-- =====================================================
-- 5. Mission Completions (new — distinct from old 'assignments')
-- =====================================================
CREATE TABLE IF NOT EXISTS mission_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'graded', 'credited')),
  grade INTEGER CHECK (grade BETWEEN 1 AND 5),
  graded_by UUID REFERENCES students(id),
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 6. Student Badges (new — distinct from old system)
-- =====================================================
CREATE TABLE IF NOT EXISTS student_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, badge_id)
);

-- =====================================================
-- 7. Student Skins (new — ship customization)
-- =====================================================
CREATE TABLE IF NOT EXISTS student_skins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skin_id UUID NOT NULL REFERENCES concept_skins(id) ON DELETE CASCADE,
  equipped BOOLEAN DEFAULT false,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, skin_id)
);

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
-- RLS (disabled for MVP with anon key)
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

-- Also ensure RLS is permissive on existing tables
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

-- Permissive policies for existing tables
DO $$ BEGIN
  CREATE POLICY "Allow all for students" ON students FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow all for missions" ON missions FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow all for badges" ON badges FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow all for projects" ON projects FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow all for sport_stats" ON sport_stats FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow all for concept_skins" ON concept_skins FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow all for shifts" ON shifts FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
