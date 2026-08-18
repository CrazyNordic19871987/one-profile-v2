import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { t, getDirectionName, getDirectionIcon } from '../lib/i18n'
import type { MissionCompletion, Mission, Student } from '../types/database'

interface GMGradingWorkflowProps {
  gmId: string
}

export function GMGradingWorkflow({ gmId }: GMGradingWorkflowProps) {
  const [pendingCompletions, setPendingCompletions] = useState<(MissionCompletion & { mission: Mission; student: Student })[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCompletion, setSelectedCompletion] = useState<string | null>(null)
  const [grade, setGrade] = useState<1 | 2 | 3 | 4 | 5>(3)

  useEffect(() => {
    fetchPendingCompletions()
  }, [gmId])

  async function fetchPendingCompletions() {
    const { data } = await supabase
      .from('mission_completions')
      .select('*, mission:missions(*), student:students(*)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    setPendingCompletions(data || [])
    setLoading(false)
  }

  async function handleGrade(completionId: string, _studentId: string) {
    const { error } = await supabase
      .from('mission_completions')
      .update({
        status: 'graded',
        grade,
        graded_by: gmId,
        graded_at: new Date().toISOString(),
      })
      .eq('id', completionId)

    if (!error) {
      setSelectedCompletion(null)
      setGrade(3)
      fetchPendingCompletions()
    }
  }

  function getGradeColor(g: number): string {
    if (g >= 4) return 'text-status-success'
    if (g >= 3) return 'text-status-warning'
    return 'text-status-error'
  }

  function getGradeLabel(g: number): string {
    switch (g) {
      case 5: return t('gmExcellent')
      case 4: return t('gmGood')
      case 3: return t('gmAverage')
      case 2: return t('gmBelowAverage')
      case 1: return t('gmPoor')
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-cosmic-silver">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📋 {t('gmTitle')}</h2>
        <div className="text-sm text-cosmic-silver">
          {pendingCompletions.length} {t('gmPending')}
        </div>
      </div>

      {pendingCompletions.length === 0 ? (
        <div className="bg-space-nebula rounded-lg p-8 border border-space-border text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="font-bold mb-2">{t('gmAllCaughtUp')}</h3>
          <p className="text-cosmic-silver">{t('gmNoMissions')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingCompletions.map((completion) => (
            <div
              key={completion.id}
              className="bg-space-nebula rounded-lg p-4 border border-space-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{getDirectionIcon(completion.mission?.direction || 'it')}</span>
                    <span className="text-sm text-cosmic-silver">
                      {getDirectionName(completion.mission?.direction || 'it')}
                    </span>
                  </div>
                  <h3 className="font-bold">{completion.mission?.title || t('squadUnknown')}</h3>
                  <p className="text-sm text-cosmic-silver mt-1">
                    {t('gmStudent')}: {completion.student?.name || t('squadUnknown')}
                  </p>
                </div>
                <div className="text-right text-sm text-cosmic-silver">
                  {new Date(completion.created_at).toLocaleString()}
                </div>
              </div>

              {selectedCompletion === completion.id ? (
                <div className="bg-space-gray rounded-lg p-4">
                  <div className="mb-4">
                    <label className="block text-sm mb-2">{t('gmGradeLabel')}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((g) => (
                        <button
                          key={g}
                          onClick={() => setGrade(g as 1 | 2 | 3 | 4 | 5)}
                          className={`flex-1 py-2 rounded border ${
                            grade === g
                              ? 'bg-plasma-cyan text-space-deep border-plasma-cyan'
                              : 'bg-space-gray text-cosmic-silver border-space-border hover:border-plasma-cyan'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                    <div className={`text-center mt-2 ${getGradeColor(grade)}`}>
                      {getGradeLabel(grade)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGrade(completion.id, completion.student_id)}
                      className="flex-1 py-2 bg-status-success text-space-deep rounded font-bold hover:opacity-90 transition-opacity"
                    >
                      {t('gmGrade')}
                    </button>
                    <button
                      onClick={() => { setSelectedCompletion(null); setGrade(3) }}
                      className="px-4 py-2 bg-space-gray text-cosmic-silver rounded hover:bg-space-border transition-colors"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedCompletion(completion.id)}
                  className="w-full py-2 bg-plasma-cyan text-space-deep rounded font-bold hover:bg-plasma-blue transition-colors"
                >
                  {t('gmGradeMission')}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
