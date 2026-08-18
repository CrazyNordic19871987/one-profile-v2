import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { t } from '../lib/i18n'
import type { Badge, StudentBadge } from '../types/database'

interface BadgeSystemProps {
  studentId: string
}

const BADGE_DEFINITIONS: Omit<Badge, 'id' | 'created_at'>[] = [
  { name: 'First Steps', description: 'Complete your first mission', icon_url: '👣', requirement: 'missions >= 1', xp_reward: 50 },
  { name: 'Explorer', description: 'Try 3 different directions', icon_url: '🧭', requirement: 'directions >= 3', xp_reward: 100 },
  { name: 'Sport Star', description: 'Earn 100 Sport XP', icon_url: '⚡', requirement: 'sport_xp >= 100', xp_reward: 75 },
  { name: 'Code Master', description: 'Earn 100 IT XP', icon_url: '💻', requirement: 'it_xp >= 100', xp_reward: 75 },
  { name: 'Team Player', description: 'Join a squad', icon_url: '👥', requirement: 'squad = true', xp_reward: 50 },
  { name: 'Streak Champion', description: '7-day login streak', icon_url: '🔥', requirement: 'streak >= 7', xp_reward: 100 },
  { name: 'Mission Master', description: 'Complete 10 missions', icon_url: '🏆', requirement: 'missions >= 10', xp_reward: 150 },
  { name: 'Project Pioneer', description: 'Complete a project', icon_url: '🚀', requirement: 'projects >= 1', xp_reward: 100 },
  { name: 'All-Rounder', description: 'Reach level 10 in 3 directions', icon_url: '⭐', requirement: 'dirs_level10 >= 3', xp_reward: 200 },
  { name: 'Space Legend', description: 'Reach level 50', icon_url: '👑', requirement: 'level >= 50', xp_reward: 500 },
]

export function BadgeSystem({ studentId }: BadgeSystemProps) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [earnedBadges, setEarnedBadges] = useState<StudentBadge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [studentId])

  async function fetchData() {
    // Get or create badge definitions
    const { data: existingBadges } = await supabase
      .from('badges')
      .select('*')

    if (!existingBadges || existingBadges.length === 0) {
      // Insert badge definitions
      const { data: insertedBadges } = await supabase
        .from('badges')
        .insert(BADGE_DEFINITIONS)
        .select()
      setBadges(insertedBadges || [])
    } else {
      setBadges(existingBadges)
    }

    // Get earned badges
    const { data: earned } = await supabase
      .from('student_badges')
      .select('*')
      .eq('student_id', studentId)

    setEarnedBadges(earned || [])
    setLoading(false)
  }

  function isBadgeEarned(badgeId: string): boolean {
    return earnedBadges.some(b => b.badge_id === badgeId)
  }

  function getEarnedDate(badgeId: string): string | null {
    const earned = earnedBadges.find(b => b.badge_id === badgeId)
    return earned ? new Date(earned.earned_at).toLocaleDateString() : null
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
        <h2 className="text-xl font-bold">🏆 {t('badgesTitle')}</h2>
        <div className="text-sm text-cosmic-silver">
          {earnedBadges.length} / {badges.length} {t('badgesEarned')}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-space-nebula rounded-lg p-3 border border-space-border">
        <div className="flex justify-between text-sm mb-1">
          <span>Badge Collection</span>
          <span className="font-mono text-plasma-cyan">
            {Math.round((earnedBadges.length / badges.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-space-gray rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-status-warning to-status-premium rounded-full transition-all duration-500"
            style={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => {
          const earned = isBadgeEarned(badge.id)
          const earnedDate = getEarnedDate(badge.id)

          return (
            <div
              key={badge.id}
              className={`bg-space-nebula rounded-lg p-4 border transition-all ${
                earned
                  ? 'border-status-success shadow-lg shadow-status-success/20'
                  : 'border-space-border opacity-60'
              }`}
            >
              <div className="text-center">
                <div className={`text-4xl mb-2 ${earned ? '' : 'grayscale'}`}>
                  {badge.icon_url || '🏅'}
                </div>
                <h3 className="font-bold text-sm">{badge.name}</h3>
                <p className="text-xs text-cosmic-silver mt-1">{badge.description}</p>

                {earned ? (
                  <div className="mt-2">
                    <span className="text-xs text-status-success">✅ Earned</span>
                    {earnedDate && (
                      <div className="text-xs text-cosmic-silver mt-1">{earnedDate}</div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2">
                    <span className="text-xs text-cosmic-silver">🔒 Locked</span>
                    <div className="text-xs text-status-premium mt-1">+{badge.xp_reward} XP</div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
