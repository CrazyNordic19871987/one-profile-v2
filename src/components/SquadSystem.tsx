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
    // Get student's squad
    const { data: memberData } = await supabase
      .from('squad_members')
      .select('*')
      .eq('student_id', studentId)
      .single()

    if (memberData) {
      // Get squad details
      const { data: squadData } = await supabase
        .from('squads')
        .select('*')
        .eq('id', memberData.squad_id)
        .single()

      setSquad(squadData)

      // Get all squad members with student data
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
        <div className="text-cosmic-silver">{t('loading')}</div>
      </div>
    )
  }

  if (!squad) {
    return (
      <div className="bg-space-nebula rounded-lg p-6 border border-space-border text-center">
        <div className="text-4xl mb-4">👥</div>
        <h3 className="font-bold mb-2">{t('squadNoYet')}</h3>
        <p className="text-cosmic-silver text-sm">
          {t('squadNoYetDesc')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t('squadTitle')}</h2>

      {/* Squad Header */}
      <div className="bg-space-nebula rounded-lg p-4 border border-space-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">{squad.name}</h3>
            <p className="text-cosmic-silver text-sm">{members.length} {t('squadMembers')}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono text-plasma-cyan">Lvl {getSquadLevel()}</div>
            <div className="text-xs text-cosmic-silver">{t('squadLevel')}</div>
          </div>
        </div>

        {/* Squad Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>{t('squadProgress')}</span>
            <span className="font-mono text-plasma-cyan">
              {Math.round(getSquadProgress() * 100)}%
            </span>
          </div>
          <div className="h-3 bg-space-gray rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-plasma-cyan to-status-success rounded-full transition-all duration-500"
              style={{ width: `${getSquadProgress() * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Squad Ship */}
      <div className="bg-space-nebula rounded-lg p-4 border border-space-border text-center">
        <div className="text-6xl mb-2">🚀</div>
        <div className="text-sm text-cosmic-silver">{t('squadShip')}</div>
        <div className="font-mono text-plasma-cyan">
          {getShipStage(getSquadLevel())}
        </div>
      </div>

      {/* Members List */}
      <div className="bg-space-nebula rounded-lg p-4 border border-space-border">
        <h4 className="font-bold mb-3">{t('squadMembers')}</h4>
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 bg-space-gray rounded"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-space-border flex items-center justify-center">
                  {member.student?.photo_url ? (
                    <img
                      src={member.student.photo_url}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">👤</span>
                  )}
                </div>
                <div>
                  <div className="font-medium">{member.student?.name || t('squadUnknown')}</div>
                  <div className="text-xs text-cosmic-silver">
                    {t('level')} {levelFromXp(member.student?.total_xp || 0)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-status-success">
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
