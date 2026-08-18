import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { levelFromXp, getShipStage } from '../lib/engine'
import { t } from '../lib/i18n'

interface LeaderboardEntry {
  id: string
  name: string
  total_xp: number
}

interface LeaderboardUIProps {
  currentStudentId: string
}

export function LeaderboardUI({ currentStudentId }: LeaderboardUIProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [currentStudentId])

  async function fetchLeaderboard() {
    const { data } = await supabase
      .from('students')
      .select('id, name, total_xp')
      .order('total_xp', { ascending: false })
      .limit(10)

    setEntries(data || [])
    setLoading(false)
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
      <h2 className="text-xl font-bold">🏅 Leaderboard</h2>

      <div className="bg-space-nebula rounded-xl border border-space-border overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-8 text-center text-cosmic-silver">No students yet</div>
        ) : (
          entries.map((entry, index) => {
            const isCurrentStudent = entry.id === currentStudentId
            const level = levelFromXp(entry.total_xp || 0)
            const stage = getShipStage(level)

            return (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-4 ${
                  index < entries.length - 1 ? 'border-b border-space-border' : ''
                } ${isCurrentStudent ? 'bg-plasma-cyan/10' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  index === 0 ? 'bg-status-warning text-space-deep' :
                  index === 1 ? 'bg-cosmic-silver text-space-deep' :
                  index === 2 ? 'bg-status-premium text-space-deep' :
                  'bg-space-gray text-cosmic-silver'
                }`}>
                  {index + 1}
                </div>

                <div className="w-10 h-10 rounded-full bg-space-border flex items-center justify-center text-xl">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🚀'}
                </div>

                <div className="flex-1">
                  <div className={`font-bold ${isCurrentStudent ? 'text-plasma-cyan' : ''}`}>
                    {entry.name}
                    {isCurrentStudent && <span className="text-xs ml-1">(you)</span>}
                  </div>
                  <div className="text-xs text-cosmic-silver">
                    Level {level} · {stage}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-sm text-status-success">
                    {(entry.total_xp || 0).toLocaleString()} XP
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
