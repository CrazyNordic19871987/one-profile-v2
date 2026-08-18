import { supabase } from './supabase'
import type { Student, StudentProfile, Skill, SquadMember } from '../types/database'
import { levelFromXp } from './engine'

// === Profile Fetch ===

export async function getStudentProfile(studentId: string): Promise<StudentProfile | null> {
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('*')
    .eq('id', studentId)
    .single()

  if (studentError || !student) return null

  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('student_id', studentId)

  const { data: badges } = await supabase
    .from('student_badges')
    .select('*')
    .eq('student_id', studentId)

  const { data: squadMember } = await supabase
    .from('squad_members')
    .select('*')
    .eq('student_id', studentId)
    .single()

  return {
    ...student,
    skills: skills || [],
    badges: badges || [],
    squad: squadMember,
    total_xp: student.total_xp || 0,
    level: levelFromXp(student.total_xp || 0),
    coins: student.coins || 0,
    gems: student.gems || 0,
    streak: student.streak || 0,
    last_bonus_date: student.last_bonus_date || null,
    prestige_count: student.prestige_count || 0,
    prestige_constellation: student.prestige_constellation || null,
  }
}

// === Profile Update ===

export async function updateStudentProfile(
  studentId: string,
  updates: Partial<Pick<Student, 'name' | 'photo_url' | 'perks'>>
): Promise<Student | null> {
  const { data, error } = await supabase
    .from('students')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', studentId)
    .select()
    .single()

  if (error) throw new Error('Failed to update profile')
  return data
}

// === Create Profile ===

export async function createStudentProfile(
  name: string,
  classType: Student['class'] = 'Scout'
): Promise<Student | null> {
  const { data, error } = await supabase
    .from('students')
    .insert({
      name,
      class: classType,
      total_xp: 0,
      coins: 0,
      gems: 0,
      streak: 0,
      perks: [],
    })
    .select()
    .single()

  if (error) throw new Error('Failed to create profile')
  return data
}

// === Skills ===

export async function getStudentSkills(studentId: string): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('student_id', studentId)

  if (error) throw new Error('Failed to fetch skills')
  return data || []
}

// === Squad ===

export async function getStudentSquad(studentId: string): Promise<SquadMember | null> {
  const { data, error } = await supabase
    .from('squad_members')
    .select('*')
    .eq('student_id', studentId)
    .single()

  if (error) return null
  return data
}

export async function getSquadMembers(squadId: string): Promise<SquadMember[]> {
  const { data, error } = await supabase
    .from('squad_members')
    .select('*')
    .eq('squad_id', squadId)

  if (error) throw new Error('Failed to fetch squad members')
  return data || []
}

// === Perks ===

export async function setStudentPerks(studentId: string, perks: string[]): Promise<void> {
  const { error } = await supabase
    .from('students')
    .update({ perks, updated_at: new Date().toISOString() })
    .eq('id', studentId)

  if (error) throw new Error('Failed to update perks')
}
