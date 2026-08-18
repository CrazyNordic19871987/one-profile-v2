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

  function getStatusColor(status: string | null): string {
    switch (status) {
      case 'credited': return 'text-status-success'
      case 'graded': return 'text-status-warning'
      case 'pending': return 'text-plasma-cyan'
      default: return 'text-cosmic-silver'
    }
  }

  function getStatusIcon(status: string | null): string {
    switch (status) {
      case 'credited': return '✅'
      case 'graded': return '⏳'
      case 'pending': return '🔄'
      default: return '📋'
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
      <h2 className="text-xl font-bold">{t('missionsTitle')}</h2>

      <div className="grid gap-3">
        {missions.map((mission) => {
          const completion = getMissionStatus(mission.id)
          const status = completion?.status || null

          return (
            <div
              key={mission.id}
              className="bg-space-nebula rounded-lg p-4 border border-space-border"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{getDirectionIcon(mission.direction)}</span>
                    <span className="text-sm text-cosmic-silver">
                      {getDirectionName(mission.direction)}
                    </span>
                    <span className="text-xs text-cosmic-silver">
                      {'⭐'.repeat(mission.difficulty)}
                    </span>
                  </div>
                  <h3 className="font-bold">{mission.title}</h3>
                  <p className="text-sm text-cosmic-silver mt-1">{mission.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={getStatusColor(status)}>
                    {getStatusIcon(status)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-space-border">
                <div className="flex gap-4 text-sm">
                  <span className="text-status-success">+{mission.xp_reward} XP</span>
                  <span className="text-status-warning">+{mission.coins_reward} 💰</span>
                  {mission.gems_reward > 0 && (
                    <span className="text-status-premium">+{mission.gems_reward} 💎</span>
                  )}
                </div>

                {!completion && (
                  <button
                    onClick={() => startMission(mission.id)}
                    className="px-3 py-1 bg-plasma-cyan text-space-deep rounded text-sm font-bold hover:bg-plasma-blue transition-colors"
                  >
                    Start
                  </button>
                )}
                {status === 'pending' && (
                  <span className="text-xs text-plasma-cyan">Awaiting grade</span>
                )}
                {status === 'graded' && (
                  <span className="text-xs text-status-warning">Graded: {completion?.grade}/5</span>
                )}
                {status === 'credited' && (
                  <span className="text-xs text-status-success">Completed!</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
