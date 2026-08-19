import { useState, useEffect, useCallback, useRef } from 'react'
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

  const loadingRef = useRef(false)

  const load = useCallback(async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    try {
      setState(s => ({ ...s, loading: true, error: null }))

      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        setState({ user: null, studentId: null, student: null, skills: [], loading: false, error: null })
        return
      }

      let { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (!student) {
        const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'Space Explorer'
        const { data: created, error: createError } = await supabase
          .from('students')
          .insert({
            id: user.id,
            nickname: displayName,
            real_name: displayName,
            class: 'Scout',
            total_xp: 0,
            xp: 0,
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
    } finally {
      loadingRef.current = false
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    setState({ user: null, studentId: null, student: null, skills: [], loading: false, error: null })
  }, [])

  useEffect(() => {
    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event) => {
      if (_event === 'SIGNED_OUT') {
        setState({ user: null, studentId: null, student: null, skills: [], loading: false, error: null })
      }
    })

    return () => subscription.unsubscribe()
  }, [load])

  return { ...state, refetch: load, signOut: handleSignOut }
}
