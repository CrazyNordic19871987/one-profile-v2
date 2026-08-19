-- ============================================================
-- ONE! Profile v2 — Skills Report migration
-- Run in Supabase SQL Editor after migrate-v2-safe.sql
-- NOTE: students.id is TEXT type, so FK columns must also be TEXT
-- ============================================================

-- 1. Observations table (GM logs per student per day/track)
CREATE TABLE IF NOT EXISTS observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  day integer CHECK (day BETWEEN 1 AND 10) NOT NULL,
  track text CHECK (track IN ('bio','eng','media','english','dev','design','sport','science','art','music','community')) NOT NULL,
  independence integer CHECK (independence BETWEEN 1 AND 5) DEFAULT 3,
  quality integer CHECK (quality BETWEEN 1 AND 5) DEFAULT 3,
  initiative boolean DEFAULT false,
  notes text,
  counselor_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obs_student ON observations(student_id);

-- 2. Shifts table (смены)
CREATE TABLE IF NOT EXISTS camp_shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- 3. Shift members
CREATE TABLE IF NOT EXISTS camp_shift_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL,
  student_id text NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(shift_id, student_id)
);

-- 4. Squads within a shift
CREATE TABLE IF NOT EXISTS camp_squads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  shift_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 5. Squad members
CREATE TABLE IF NOT EXISTS camp_squad_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id uuid NOT NULL,
  student_id text NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(squad_id, student_id)
);

-- RLS
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_shift_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_squad_members ENABLE ROW LEVEL SECURITY;

-- Public read/write
CREATE POLICY "Public read observations" ON observations FOR SELECT USING (true);
CREATE POLICY "Public insert observations" ON observations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update observations" ON observations FOR UPDATE USING (true);
CREATE POLICY "Public delete observations" ON observations FOR DELETE USING (true);

CREATE POLICY "Public read shifts" ON camp_shifts FOR SELECT USING (true);
CREATE POLICY "Public insert shifts" ON camp_shifts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update shifts" ON camp_shifts FOR UPDATE USING (true);
CREATE POLICY "Public delete shifts" ON camp_shifts FOR DELETE USING (true);

CREATE POLICY "Public read shift_members" ON camp_shift_members FOR SELECT USING (true);
CREATE POLICY "Public insert shift_members" ON camp_shift_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete shift_members" ON camp_shift_members FOR DELETE USING (true);

CREATE POLICY "Public read camp_squads" ON camp_squads FOR SELECT USING (true);
CREATE POLICY "Public insert camp_squads" ON camp_squads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update camp_squads" ON camp_squads FOR UPDATE USING (true);
CREATE POLICY "Public delete camp_squads" ON camp_squads FOR DELETE USING (true);

CREATE POLICY "Public read squad_members" ON camp_squad_members FOR SELECT USING (true);
CREATE POLICY "Public insert squad_members" ON camp_squad_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete squad_members" ON camp_squad_members FOR DELETE USING (true);
