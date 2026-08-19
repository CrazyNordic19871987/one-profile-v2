import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export type { User }

export async function signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error) return { user: null, error: error.message }

  if (data.user) {
    const { error: profileError } = await supabase
      .from('students')
      .insert({
        id: data.user.id,
        name,
        class: 'Scout',
        total_xp: 0,
        coins: 0,
        gems: 0,
        streak: 0,
        perks: [],
      })

    if (profileError) {
      console.error('Failed to create student profile:', profileError)
    }
  }

  return { user: data.user, error: null }
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { user: null, error: error.message }
  return { user: data.user, error: null }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getStudentIdForUser(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('students')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data) return null
  return data.id
}
