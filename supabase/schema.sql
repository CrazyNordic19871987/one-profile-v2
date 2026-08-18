-- ONE! Profile v2 - Supabase Schema Migration
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. Students
-- =====================================================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  class TEXT NOT NULL DEFAULT 'Scout' CHECK (class IN ('Scout', 'Explorer', 'Pathfinder', 'Innovator', 'Leader')),
  photo_url TEXT,
  perks TEXT[] DEFAULT '{}',
  total_xp INTEGER NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
  gems INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  last_bonus_date DATE,
  prestige_count INTEGER NOT NULL DEFAULT 0,
  prestige_constellation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 2. Skills (per direction per student)
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
-- 3. Shifts (camp sessions)
-- =====================================================
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  concept TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('strategy', 'language', 'communication', 'sport', 'it', 'art', 'entrepreneurship')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 4. Squads
-- =====================================================
CREATE TABLE IF NOT EXISTS squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 5. Squad Members
-- =====================================================
CREATE TABLE IF NOT EXISTS squad_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(squad_id, student_id)
);

-- =====================================================
-- 6. Missions
-- =====================================================
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('strategy', 'language', 'communication', 'sport', 'it', 'art', 'entrepreneurship')),
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  xp_reward INTEGER NOT NULL DEFAULT 10,
  coins_reward INTEGER NOT NULL DEFAULT 5,
  gems_reward INTEGER NOT NULL DEFAULT 0,
  shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
  icon_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 7. Mission Completions
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
-- 8. Badges
-- =====================================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  requirement TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 9. Student Badges
-- =====================================================
CREATE TABLE IF NOT EXISTS student_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, badge_id)
);

-- =====================================================
-- 10. Sport Stats
-- =====================================================
CREATE TABLE IF NOT EXISTS sport_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  activity TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  intensity TEXT NOT NULL CHECK (intensity IN ('low', 'medium', 'high')),
  xp_earned INTEGER NOT NULL DEFAULT 0,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 11. Projects
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('strategy', 'language', 'communication', 'sport', 'it', 'art', 'entrepreneurship')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  milestone INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 12. Concept Skins (ship customization)
-- =====================================================
CREATE TABLE IF NOT EXISTS concept_skins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('strategy', 'language', 'communication', 'sport', 'it', 'art', 'entrepreneurship')),
  description TEXT,
  cover_url TEXT,
  cost_coins INTEGER DEFAULT 0,
  cost_gems INTEGER DEFAULT 0,
  required_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 13. Student Skins (owned skins)
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
CREATE INDEX IF NOT EXISTS idx_missions_direction ON missions(direction);
CREATE INDEX IF NOT EXISTS idx_mission_completions_student ON mission_completions(student_id);
CREATE INDEX IF NOT EXISTS idx_mission_completions_status ON mission_completions(status);
CREATE INDEX IF NOT EXISTS idx_student_badges_student ON student_badges(student_id);
CREATE INDEX IF NOT EXISTS idx_sport_stats_student ON sport_stats(student_id);
CREATE INDEX IF NOT EXISTS idx_projects_student ON projects(student_id);
CREATE INDEX IF NOT EXISTS idx_squad_members_student ON squad_members(student_id);
CREATE INDEX IF NOT EXISTS idx_squad_members_squad ON squad_members(squad_id);

-- =====================================================
-- RLS (Row Level Security) - DISABLED for MVP
-- =====================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE sport_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_skins ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skins ENABLE ROW LEVEL SECURITY;

-- Permissive policies for MVP (anon key access)
CREATE POLICY "Allow all for students" ON students FOR ALL USING (true);
CREATE POLICY "Allow all for skills" ON skills FOR ALL USING (true);
CREATE POLICY "Allow all for shifts" ON shifts FOR ALL USING (true);
CREATE POLICY "Allow all for squads" ON squads FOR ALL USING (true);
CREATE POLICY "Allow all for squad_members" ON squad_members FOR ALL USING (true);
CREATE POLICY "Allow all for missions" ON missions FOR ALL USING (true);
CREATE POLICY "Allow all for mission_completions" ON mission_completions FOR ALL USING (true);
CREATE POLICY "Allow all for badges" ON badges FOR ALL USING (true);
CREATE POLICY "Allow all for student_badges" ON student_badges FOR ALL USING (true);
CREATE POLICY "Allow all for sport_stats" ON sport_stats FOR ALL USING (true);
CREATE POLICY "Allow all for projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all for concept_skins" ON concept_skins FOR ALL USING (true);
CREATE POLICY "Allow all for student_skins" ON student_skins FOR ALL USING (true);
