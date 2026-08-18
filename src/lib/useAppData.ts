import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import type { Student, Skill } from '../types/database'

interface AppState {
  studentId: string | null
  student: Student | null
  skills: Skill[]
  loading: boolean
  error: string | null
}

const DEMO_NAME = 'Space Explorer'

export function useAppData(): AppState & { refetch: () => Promise<void> } {
  const [state, setState] = useState<AppState>({
    studentId: null,
    student: null,
    skills: [],
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    try {
      setState(s => ({ ...s, loading: true, error: null }))

      // Try to find existing student
      let { data: student } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      // Auto-create demo student if none exists
      if (!student) {
        const { data: created, error: createError } = await supabase
          .from('students')
          .insert({
            name: DEMO_NAME,
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

  useEffect(() => {
    load()
  }, [load])

  return { ...state, refetch: load }
}
