import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { t } from '../lib/i18n'
import { levelFromXp, getShipStage } from '../lib/engine'
import type { Squad, SquadMember, Student } from '../types/database'

interface SquadSystemProps {
  studentId: string
}

export function SquadSystem({ studentId }: SquadSystemProps) {
  const [squad, setSquad] = useState<Squad | null>(null)
  const [members, setMembers] = useState<(SquadMember & { student: Student })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [studentId])

  async function fetchData() {
    const { data: memberData } = await supabase
      .from('squad_members')
      .select('*')
      .eq('student_id', studentId)
      .single()

    if (memberData) {
      const { data: squadData } = await supabase
        .from('squads')
        .select('*')
        .eq('id', memberData.squad_id)
        .single()

      setSquad(squadData)

      const { data: membersData } = await supabase
        .from('squad_members')
        .select('*, student:students(*)')
        .eq('squad_id', memberData.squad_id)

      setMembers(membersData || [])
    }

    setLoading(false)
  }

  function getSquadLevel(): number {
    if (members.length === 0) return 1
    const totalXp = members.reduce((sum, m) => sum + (m.student?.total_xp || 0), 0)
    return Math.floor(totalXp / (members.length * 100)) + 1
  }

  function getSquadProgress(): number {
    const xpInLevel = members.reduce((sum, m) => sum + (m.student?.total_xp || 0), 0) % (members.length * 100)
    return xpInLevel / (members.length * 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="skeleton">{t('loading')}</div>
      </div>
    )
  }

  if (!squad) {
    return (
      <div className="rounded-lg p-6 text-center" style={{ background: 'var(--color-navy-light)', border: '1px solid var(--color-border)' }}>
        <div className="text-4xl mb-4">👥</div>
        <h3 className="font-bold mb-2">{t('squadNoYet')}</h3>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          {t('squadNoYetDesc')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t('squadTitle')}</h2>

      {/* Squad Header */}
      <div className="rounded-lg p-4" style={{ background: 'var(--color-navy-light)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">{squad.name}</h3>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{members.length} {t('squadMembers')}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono" style={{ color: 'var(--color-accent)' }}>Lvl {getSquadLevel()}</div>
            <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{t('squadLevel')}</div>
          </div>
        </div>

        {/* Squad Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>{t('squadProgress')}</span>
            <span className="font-mono" style={{ color: 'var(--color-accent)' }}>
              {Math.round(getSquadProgress() * 100)}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${getSquadProgress() * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Squad Ship */}
      <div className="rounded-lg p-4 text-center" style={{ background: 'var(--color-navy-light)', border: '1px solid var(--color-border)' }}>
        <div className="text-6xl mb-2">🚀</div>
        <div className="text-sm" style={{ color: 'var(--color-muted)' }}>{t('squadShip')}</div>
        <div className="font-mono" style={{ color: 'var(--color-accent)' }}>
          {getShipStage(getSquadLevel())}
        </div>
      </div>

      {/* Members List */}
      <div className="rounded-lg p-4" style={{ background: 'var(--color-navy-light)', border: '1px solid var(--color-border)' }}>
        <h4 className="font-bold mb-3">{t('squadMembers')}</h4>
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 rounded"
              style={{ background: 'var(--color-glass-b)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--color-border)' }}>
                  <span className="text-sm">{member.student?.emoji || '👤'}</span>
                </div>
                <div>
                  <div className="font-medium">{member.student?.nickname || t('squadUnknown')}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    {t('level')} {levelFromXp(member.student?.total_xp || 0)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm" style={{ color: 'var(--color-status-success)' }}>
                  {member.student?.total_xp || 0} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
