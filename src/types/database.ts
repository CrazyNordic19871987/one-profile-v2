export interface Student {
  id: string
  name: string
  class: 'Scout' | 'Explorer' | 'Pathfinder' | 'Innovator' | 'Leader'
  photo_url: string | null
  perks: string[]
  total_xp: number
  coins: number
  gems: number
  streak: number
  last_bonus_date: string | null
  prestige_count: number
  prestige_constellation: string | null
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  student_id: string
  direction: Direction
  level: number
  xp: number
  created_at: string
  updated_at: string
}

export type Direction =
  | 'strategy'
  | 'language'
  | 'communication'
  | 'sport'
  | 'it'
  | 'art'
  | 'entrepreneurship'

export interface Mission {
  id: string
  title: string
  description: string
  direction: Direction
  difficulty: 1 | 2 | 3 | 4 | 5
  xp_reward: number
  coins_reward: number
  gems_reward: number
  shift_id: string | null
  created_at: string
}

export interface MissionCompletion {
  id: string
  mission_id: string
  student_id: string
  status: 'pending' | 'graded' | 'credited'
  grade: 1 | 2 | 3 | 4 | 5 | null
  graded_by: string | null
  graded_at: string | null
  created_at: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon_url: string | null
  requirement: string
  xp_reward: number
  created_at: string
}

export interface StudentBadge {
  id: string
  student_id: string
  badge_id: string
  earned_at: string
}

export interface Shift {
  id: string
  name: string
  concept: string
  direction: Direction
  start_date: string
  end_date: string
  cover_url: string | null
  created_at: string
}

export interface Squad {
  id: string
  name: string
  shift_id: string
  logo_url: string | null
  created_at: string
}

export interface SquadMember {
  id: string
  squad_id: string
  student_id: string
  joined_at: string
}

export interface SportStat {
  id: string
  student_id: string
  activity: string
  duration_minutes: number
  intensity: 'low' | 'medium' | 'high'
  xp_earned: number
  recorded_at: string
  created_at: string
}

export interface Project {
  id: string
  student_id: string
  title: string
  description: string
  direction: Direction
  status: 'in_progress' | 'completed'
  milestone: number
  xp_earned: number
  completed_at: string | null
  created_at: string
}

export interface StudentProfile extends Student {
  skills: Skill[]
  badges: StudentBadge[]
  squad: SquadMember | null
  total_xp: number
  level: number
  coins: number
  gems: number
  streak: number
  last_bonus_date: string | null
  prestige_count: number
  prestige_constellation: string | null
}
