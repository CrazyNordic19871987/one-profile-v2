import { useState, useEffect } from 'react'
import { getStudentProfile } from '../lib/profile'
import type { StudentProfile } from '../types/database'

interface UseDataResult {
  profile: StudentProfile | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useData(studentId: string | null): UseDataResult {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!studentId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getStudentProfile(studentId)
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [studentId])

  return { profile, loading, error, refetch: fetchData }
}
