-- Drop existing policies and recreate with proper type handling
-- The students.id column is UUID type, auth.uid() returns UUID

-- === Students ===
DROP POLICY IF EXISTS "Students read own profile" ON students;
DROP POLICY IF EXISTS "Students update own profile" ON students;
DROP POLICY IF EXISTS "Students insert own profile" ON students;

CREATE POLICY "Students read own profile"
  ON students FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Students update own profile"
  ON students FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Students insert own profile"
  ON students FOR INSERT
  WITH CHECK (auth.uid() = id);

-- === Skills ===
DROP POLICY IF EXISTS "Students read own skills" ON skills;
DROP POLICY IF EXISTS "Students insert own skills" ON skills;
DROP POLICY IF EXISTS "Students update own skills" ON skills;
DROP POLICY IF EXISTS "Students delete own skills" ON skills;

CREATE POLICY "Students read own skills"
  ON skills FOR SELECT
  USING (student_id::uuid = auth.uid());

CREATE POLICY "Students insert own skills"
  ON skills FOR INSERT
  WITH CHECK (student_id::uuid = auth.uid());

CREATE POLICY "Students update own skills"
  ON skills FOR UPDATE
  USING (student_id::uuid = auth.uid());

CREATE POLICY "Students delete own skills"
  ON skills FOR DELETE
  USING (student_id::uuid = auth.uid());

-- === Mission Completions ===
DROP POLICY IF EXISTS "Students read own completions" ON mission_completions;
DROP POLICY IF EXISTS "Students insert own completions" ON mission_completions;

CREATE POLICY "Students read own completions"
  ON mission_completions FOR SELECT
  USING (student_id::uuid = auth.uid());

CREATE POLICY "Students insert own completions"
  ON mission_completions FOR INSERT
  WITH CHECK (student_id::uuid = auth.uid());

-- === Student Badges ===
DROP POLICY IF EXISTS "Students read own badges" ON student_badges;
DROP POLICY IF EXISTS "Students insert own badges" ON student_badges;

CREATE POLICY "Students read own badges"
  ON student_badges FOR SELECT
  USING (student_id::uuid = auth.uid());

CREATE POLICY "Students insert own badges"
  ON student_badges FOR INSERT
  WITH CHECK (student_id::uuid = auth.uid());

-- === Projects ===
DROP POLICY IF EXISTS "Students read own projects" ON projects;
DROP POLICY IF EXISTS "Students manage own projects" ON projects;

CREATE POLICY "Students read own projects"
  ON projects FOR SELECT
  USING (student_id::uuid = auth.uid());

CREATE POLICY "Students manage own projects"
  ON projects FOR ALL
  USING (student_id::uuid = auth.uid());

-- === Sport Stats ===
DROP POLICY IF EXISTS "Students read own sport stats" ON sport_stats;
DROP POLICY IF EXISTS "Students manage own sport stats" ON sport_stats;

CREATE POLICY "Students read own sport stats"
  ON sport_stats FOR SELECT
  USING (student_id::uuid = auth.uid());

CREATE POLICY "Students manage own sport stats"
  ON sport_stats FOR ALL
  USING (student_id::uuid = auth.uid());

-- === Squad Members ===
DROP POLICY IF EXISTS "Students read squad members" ON squad_members;
DROP POLICY IF EXISTS "Students join squads" ON squad_members;

CREATE POLICY "Students read squad members"
  ON squad_members FOR SELECT
  USING (true);

CREATE POLICY "Students join squads"
  ON squad_members FOR INSERT
  WITH CHECK (student_id::uuid = auth.uid());

-- === Public tables ===
DROP POLICY IF EXISTS "Anyone can read missions" ON missions;
CREATE POLICY "Anyone can read missions" ON missions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read badges" ON badges;
CREATE POLICY "Anyone can read badges" ON badges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read squads" ON squads;
CREATE POLICY "Anyone can read squads" ON squads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read shifts" ON shifts;
CREATE POLICY "Anyone can read shifts" ON shifts FOR SELECT USING (true);
