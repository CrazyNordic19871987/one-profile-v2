import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { creditMission } from '../lib/currency'
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
  const [lastReward, setLastReward] = useState<{ xp: number; coins: number; gems: number } | null>(null)

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

  async function handleGrade(completionId: string, studentId: string) {
    const { error } = await supabase
      .from('mission_completions')
      .update({
        status: 'graded',
        grade,
        graded_by: gmId,
        graded_at: new Date().toISOString(),
      })
      .eq('id', completionId)

    if (error) return

    try {
      const completion = pendingCompletions.find(c => c.id === completionId)
      const direction = completion?.mission?.direction
      const reward = await creditMission(completionId, studentId, grade, 'mission', direction)
      setLastReward({ xp: reward.xp, coins: reward.coins, gems: reward.gems })
      setTimeout(() => setLastReward(null), 3000)
    } catch {
      // Grading succeeded even if credit failed - can be retried manually
    }

    setSelectedCompletion(null)
    setGrade(3)
    fetchPendingCompletions()
  }

  function getGradeColor(g: number): string {
    if (g >= 4) return 'var(--color-status-success)'
    if (g >= 3) return 'var(--color-status-warn)'
    return 'var(--color-status-error)'
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
        <div className="skeleton">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📋 {t('gmTitle')}</h2>
        <div className="text-sm" style={{ color: 'var(--color-muted)' }}>
          {pendingCompletions.length} {t('gmPending')}
        </div>
      </div>

      {lastReward && (
        <div className="rounded-lg p-3 text-center animate-pulse" style={{ background: 'rgba(34, 211, 166, 0.1)', border: '1px solid var(--color-status-success)' }}>
          <span className="text-sm font-bold" style={{ color: 'var(--color-status-success)' }}>
            ✅ +{lastReward.xp} XP · +{lastReward.coins} 💰{lastReward.gems > 0 ? ` · +${lastReward.gems} 💎` : ''}
          </span>
        </div>
      )}

      {pendingCompletions.length === 0 ? (
        <div className="rounded-lg p-8 text-center" style={{ background: 'var(--color-navy-light)', border: '1px solid var(--color-border)' }}>
          <div className="text-4xl mb-4">✅</div>
          <h3 className="font-bold mb-2">{t('gmAllCaughtUp')}</h3>
          <p style={{ color: 'var(--color-muted)' }}>{t('gmNoMissions')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingCompletions.map((completion) => (
            <div
              key={completion.id}
              className="rounded-lg p-4"
              style={{ background: 'var(--color-navy-light)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{getDirectionIcon(completion.mission?.direction || 'it')}</span>
                    <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
                      {getDirectionName(completion.mission?.direction || 'it')}
                    </span>
                  </div>
                  <h3 className="font-bold">{completion.mission?.title || t('squadUnknown')}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
                    {t('gmStudent')}: {completion.student?.nickname || t('squadUnknown')}
                  </p>
                </div>
                <div className="text-right text-sm" style={{ color: 'var(--color-muted)' }}>
                  {new Date(completion.created_at).toLocaleString()}
                </div>
              </div>

              {selectedCompletion === completion.id ? (
                <div className="rounded-lg p-4" style={{ background: 'var(--color-glass-b)' }}>
                  <div className="mb-4">
                    <label className="block text-sm mb-2">{t('gmGradeLabel')}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((g) => (
                        <button
                          key={g}
                          onClick={() => setGrade(g as 1 | 2 | 3 | 4 | 5)}
                          className={`flex-1 py-2 rounded border ${
                            grade === g
                              ? 'btn-accent'
                              : ''
                          }`}
                          style={grade !== g ? {
                            background: 'var(--color-glass-b)',
                            color: 'var(--color-muted)',
                            borderColor: 'var(--color-border)',
                          } : undefined}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                    <div className="text-center mt-2" style={{ color: getGradeColor(grade) }}>
                      {getGradeLabel(grade)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGrade(completion.id, completion.student_id)}
                      className="btn-accent flex-1 py-2 rounded font-bold"
                    >
                      {t('gmGrade')}
                    </button>
                    <button
                      onClick={() => { setSelectedCompletion(null); setGrade(3) }}
                      className="btn-ghost px-4 py-2 rounded"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedCompletion(completion.id)}
                  className="btn-accent w-full py-2 rounded font-bold"
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
