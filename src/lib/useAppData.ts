import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'
import type { Student, Skill } from '../types/database'

interface AppState {
  user: User | null
  studentId: string | null
  student: Student | null
  skills: Skill[]
  loading: boolean
  error: string | null
}

export function useAppData(): AppState & { refetch: () => Promise<void>; signOut: () => Promise<void> } {
  const [state, setState] = useState<AppState>({
    user: null,
    studentId: null,
    student: null,
    skills: [],
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    try {
      setState(s => ({ ...s, loading: true, error: null }))

      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        setState({ user: null, studentId: null, student: null, skills: [], loading: false, error: null })
        return
      }

      // Find or create student profile linked to auth user
      let { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      // Auto-create student profile if none exists
      if (!student) {
        const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'Space Explorer'
        const { data: created, error: createError } = await supabase
          .from('students')
          .insert({
            id: user.id,
            name: displayName,
            class: 'Scout',
            total_xp: 0,
            coins: 0,
            gems: 0,
            streak: 0,
            perks: [],
          })
          .select()
          .single()

        if (createError) throw new Error('Failed to create student: ' + createError.message)
        student = created
      }

      if (!student) throw new Error('No student found')

      // Load skills
      const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .eq('student_id', student.id)

      setState({
        user,
        studentId: student.id,
        student,
        skills: skills || [],
        loading: false,
        error: null,
      })
    } catch (err) {
      setState(s => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }))
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    setState({ user: null, studentId: null, student: null, skills: [], loading: false, error: null })
  }, [])

  useEffect(() => {
    load()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        load()
      } else {
        setState({ user: null, studentId: null, student: null, skills: [], loading: false, error: null })
      }
    })

    return () => subscription.unsubscribe()
  }, [load])

  return { ...state, refetch: load, signOut: handleSignOut }
}
