import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { t, getDirectionName, getDirectionIcon } from '../lib/i18n'
import type { Mission, MissionCompletion } from '../types/database'

interface MissionSystemProps {
  studentId: string
  onMissionComplete?: (missionId: string) => void
}

export function MissionSystem({ studentId, onMissionComplete }: MissionSystemProps) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [completions, setCompletions] = useState<MissionCompletion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [studentId])

  async function fetchData() {
    const { data: missionsData } = await supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: completionsData } = await supabase
      .from('mission_completions')
      .select('*')
      .eq('student_id', studentId)

    setMissions(missionsData || [])
    setCompletions(completionsData || [])
    setLoading(false)
  }

  async function startMission(missionId: string) {
    const { error } = await supabase
      .from('mission_completions')
      .insert({
        mission_id: missionId,
        student_id: studentId,
        status: 'pending',
      })

    if (!error) {
      onMissionComplete?.(missionId)
      fetchData()
    }
  }

  function getMissionStatus(missionId: string): MissionCompletion | null {
    return completions.find(c => c.mission_id === missionId) || null
  }

  function getStatusStyle(status: string | null) {
    switch (status) {
      case 'credited':
        return { bg: 'rgba(0, 230, 118, 0.1)', border: '#00E676', text: 'var(--color-status-success)', icon: '✓', label: t('missionCompleted') }
      case 'graded':
        return { bg: 'rgba(255, 215, 64, 0.1)', border: '#FFD740', text: 'var(--color-status-warn)', icon: '⏳', label: `${t('missionGraded')}` }
      case 'pending':
        return { bg: 'var(--color-accent-dim)', border: 'var(--color-accent)', text: 'var(--color-accent)', icon: '↻', label: t('missionAwaitingGrade') }
      default:
        return { bg: 'transparent', border: 'var(--color-border)', text: '', icon: '', label: '' }
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
    <div className="space-y-6 page-enter">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{t('missionsTitle')}</h2>

      <div className="space-y-4">
        {missions.map((mission) => {
          const completion = getMissionStatus(mission.id)
          const status = completion?.status || null
          const statusStyle = getStatusStyle(status)
          const isCompleted = status === 'credited'

          return (
            <div
              key={mission.id}
              className={`gc p-5 ${isCompleted ? 'border-accent' : ''}`}
              style={isCompleted ? { borderColor: 'var(--color-border-h)' } : undefined}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: 'var(--color-accent-dim)' }}
                >
                  {getDirectionIcon(mission.direction)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono" style={{ color: 'var(--color-muted)' }}>
                      {getDirectionName(mission.direction)}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: mission.difficulty }).map((_, i) => (
                        <span key={i} className="text-xs" style={{ color: 'var(--color-status-warn)' }}>★</span>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-bold text-base mb-1">{mission.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{mission.description}</p>
                </div>

                {status && (
                  <div
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}40`, color: statusStyle.text }}
                  >
                    {statusStyle.icon} {statusStyle.label}
                    {status === 'graded' && completion?.grade && (
                      <span className="ml-1">{completion.grade}/5</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <div className="flex gap-4">
                  <span className="text-sm font-mono font-bold" style={{ color: 'var(--color-status-success)' }}>+{mission.xp_reward} XP</span>
                  <span className="text-sm font-mono" style={{ color: 'var(--color-status-warn)' }}>+{mission.coins_reward} 💰</span>
                  {mission.gems_reward > 0 && (
                    <span className="text-sm font-mono" style={{ color: 'var(--color-accent)' }}>+{mission.gems_reward} 💎</span>
                  )}
                </div>

                {!completion && (
                  <button
                    onClick={() => startMission(mission.id)}
                    className="btn-accent px-5 py-2 rounded-lg font-bold text-sm"
                  >
                    {t('missionStart')}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
