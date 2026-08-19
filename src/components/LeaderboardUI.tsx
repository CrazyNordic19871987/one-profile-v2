import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { levelFromXp, getShipStage } from '../lib/engine'
import { t } from '../lib/i18n'

interface LeaderboardEntry {
  id: string
  nickname: string
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
      .select('id, nickname, total_xp')
      .order('total_xp', { ascending: false })
      .limit(10)

    setEntries(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="skeleton">{t('loading')}</div>
      </div>
    )
  }

  const rankStyles = [
    { bg: 'rgba(255, 215, 64, 0.08)', border: '#FFD740', text: 'var(--color-status-warn)', medal: '🥇' },
    { bg: 'rgba(139, 149, 168, 0.08)', border: '#8B95A8', text: 'var(--color-muted)', medal: '🥈' },
    { bg: 'rgba(255, 145, 0, 0.08)', border: '#FF9100', text: 'var(--color-accent)', medal: '🥉' },
  ]

  return (
    <div className="space-y-6 page-enter">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{t('leaderboardTitle')}</h2>

      <div className="gc overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--color-muted)' }}>{t('leaderboardNoStudents')}</div>
        ) : (
          entries.map((entry, index) => {
            const isCurrentStudent = entry.id === currentStudentId
            const level = levelFromXp(entry.total_xp || 0)
            const stage = getShipStage(level)
            const rank = index < 3 ? rankStyles[index] : null

            return (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-4 transition-all ${
                  index < entries.length - 1 ? '' : ''
                }`}
                style={{
                  borderBottom: index < entries.length - 1 ? '1px solid var(--color-border)' : undefined,
                  background: isCurrentStudent ? 'var(--color-accent-dim)' : rank ? rank.bg : undefined,
                }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    !rank ? 'text-sm' : ''
                  }`}
                  style={!rank ? {
                    background: 'var(--color-glass-b)',
                    color: 'var(--color-muted)',
                  } : {
                    color: rank.text,
                    background: `${rank.border}15`,
                    border: `2px solid ${rank.border}40`,
                  }}
                >
                  {rank ? rank.medal : index + 1}
                </div>

                <div className="flex-1">
                  <div className={`font-bold ${isCurrentStudent ? '' : ''}`} style={isCurrentStudent ? { color: 'var(--color-accent)' } : undefined}>
                    {entry.nickname}
                    {isCurrentStudent && (
                      <span className="text-xs ml-2 px-2 py-0.5 rounded-full font-mono" style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)' }}>
                        {t('leaderboardYou')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--color-muted)' }}>
                    {t('level')} {level} · {stage}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-sm font-bold" style={{ color: 'var(--color-status-success)' }}>
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
