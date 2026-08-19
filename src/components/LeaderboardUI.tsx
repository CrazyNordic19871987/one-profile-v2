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

  const rankStyles = [
    { bg: 'linear-gradient(135deg, rgba(255, 215, 64, 0.15), rgba(255, 145, 0, 0.1))', border: '#FFD740', glow: '0 0 20px rgba(255, 215, 64, 0.3)', text: 'neon-text-warning', medal: '🥇' },
    { bg: 'linear-gradient(135deg, rgba(139, 149, 168, 0.15), rgba(139, 149, 168, 0.05))', border: '#8B95A8', glow: '0 0 15px rgba(139, 149, 168, 0.2)', text: 'text-cosmic-silver', medal: '🥈' },
    { bg: 'linear-gradient(135deg, rgba(255, 145, 0, 0.15), rgba(255, 145, 0, 0.05))', border: '#FF9100', glow: '0 0 15px rgba(255, 145, 0, 0.2)', text: 'neon-text-premium', medal: '🥉' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold neon-text-cyan">{t('leaderboardTitle')}</h2>

      <div className="neon-card overflow-hidden scanlines">
        {entries.length === 0 ? (
          <div className="p-8 text-center text-cosmic-silver">{t('leaderboardNoStudents')}</div>
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
                  index < entries.length - 1 ? 'border-b border-space-border' : ''
                } ${isCurrentStudent ? 'bg-plasma-cyan/5' : 'hover:bg-space-gray/30'}`}
                style={rank ? {
                  background: rank.bg,
                  boxShadow: isCurrentStudent ? rank.glow : 'none',
                } : undefined}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    rank ? rank.text : 'bg-space-gray text-cosmic-silver'
                  }`}
                  style={rank ? {
                    background: `${rank.border}20`,
                    border: `2px solid ${rank.border}60`,
                    boxShadow: `0 0 10px ${rank.border}30`,
                  } : undefined}
                >
                  {rank ? rank.medal : index + 1}
                </div>

                <div className="flex-1">
                  <div className={`font-bold ${isCurrentStudent ? 'neon-text-cyan' : ''}`}>
                    {entry.name}
                    {isCurrentStudent && (
                      <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-plasma-cyan/10 text-plasma-cyan font-mono">
                        {t('leaderboardYou')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-cosmic-silver font-mono">
                    {t('level')} {level} · {stage}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-sm neon-text-green font-bold">
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
