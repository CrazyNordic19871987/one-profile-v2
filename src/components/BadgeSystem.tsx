import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { t, getLocale } from '../lib/i18n'
import type { Badge, StudentBadge } from '../types/database'

interface BadgeSystemProps {
  studentId: string
}

type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'

const RARITY_CONFIG: Record<BadgeRarity, { color: string; glow: string; label: string; labelRu: string }> = {
  common: { color: '#8B95A8', glow: 'rgba(139, 149, 168, 0.3)', label: 'Common', labelRu: 'Обычный' },
  rare: { color: '#448AFF', glow: 'rgba(68, 138, 255, 0.3)', label: 'Rare', labelRu: 'Редкий' },
  epic: { color: '#B24BF3', glow: 'rgba(178, 75, 243, 0.3)', label: 'Epic', labelRu: 'Эпический' },
  legendary: { color: '#FFD740', glow: 'rgba(255, 215, 64, 0.3)', label: 'Legendary', labelRu: 'Легендарный' },
  mythic: { color: '#FF2D78', glow: 'rgba(255, 45, 120, 0.3)', label: 'Mythic', labelRu: 'Мифический' },
}

const BADGE_RARITY_MAP: Record<string, BadgeRarity> = {
  'First Steps': 'common',
  'Team Player': 'common',
  'Sport Star': 'common',
  'Code Master': 'rare',
  'Explorer': 'rare',
  'Streak Champion': 'rare',
  'Project Pioneer': 'epic',
  'Mission Master': 'epic',
  'All-Rounder': 'legendary',
  'Space Legend': 'legendary',
}

const HIDDEN_BADGES = new Set<string>([
  'Night Owl',
  'Speed Demon',
  'Perfectionist',
  'Comeback Kid',
])

const BADGE_DEFINITIONS: (Omit<Badge, 'id' | 'created_at'> & { hidden?: boolean })[] = [
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
  { name: 'Night Owl', description: 'Complete a mission after 10 PM', icon_url: '🦉', requirement: 'missions >= 5', xp_reward: 75, hidden: true },
  { name: 'Speed Demon', description: 'Complete 3 missions in one day', icon_url: '⚡', requirement: 'missions >= 3', xp_reward: 100, hidden: true },
  { name: 'Perfectionist', description: 'Get grade 5 on 5 missions', icon_url: '💎', requirement: 'missions >= 10', xp_reward: 200, hidden: true },
  { name: 'Comeback Kid', description: 'Return after 3+ day break', icon_url: '🔄', requirement: 'missions >= 1', xp_reward: 75, hidden: true },
]

export function BadgeSystem({ studentId }: BadgeSystemProps) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [earnedBadges, setEarnedBadges] = useState<StudentBadge[]>([])
  const [loading, setLoading] = useState(true)
  const lang = getLocale()

  useEffect(() => {
    fetchData()
  }, [studentId])

  async function fetchData() {
    const { data: existingBadges } = await supabase
      .from('badges')
      .select('*')

    if (!existingBadges || existingBadges.length === 0) {
      const { data: insertedBadges } = await supabase
        .from('badges')
        .insert(BADGE_DEFINITIONS)
        .select()
      setBadges(insertedBadges || [])
    } else {
      setBadges(existingBadges)
    }

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
        <div className="skeleton">{t('loading')}</div>
      </div>
    )
  }

  const percent = badges.length > 0 ? Math.round((earnedBadges.length / badges.length) * 100) : 0

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{t('badgesTitle')}</h2>
        <div className="text-sm font-mono" style={{ color: 'var(--color-muted)' }}>
          {earnedBadges.length} / {badges.length}
        </div>
      </div>

      <div className="gc p-4">
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: 'var(--color-muted)' }}>{t('badgesCollection')}</span>
          <span className="font-mono" style={{ color: 'var(--color-accent)' }}>{percent}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {badges.map((badge) => {
          const earned = isBadgeEarned(badge.id)
          const earnedDate = getEarnedDate(badge.id)
          const isHidden = HIDDEN_BADGES.has(badge.name) && !earned
          const rarity = BADGE_RARITY_MAP[badge.name] || 'common'
          const rarityConfig = RARITY_CONFIG[rarity]

          return (
            <div
              key={badge.id}
              className={`relative badge-zoom ${earned ? 'badge-earned' : ''}`}
            >
              <div className="badge-glow-ring" />

              <div
                className={`gc p-4 text-center transition-all ${
                  earned
                    ? ''
                    : isHidden
                      ? 'opacity-40 hover:opacity-60'
                      : 'opacity-50 grayscale hover:opacity-80 hover:grayscale-[50%]'
                }`}
                style={earned ? {
                  borderColor: rarityConfig.color + '40',
                  boxShadow: `0 0 15px ${rarityConfig.glow}`,
                } : undefined}
              >
                <div
                  className={`mx-auto mb-3 flex items-center justify-center rounded-full transition-all duration-300 ${
                    earned ? 'w-20 h-20' : 'w-16 h-16'
                  }`}
                  style={{
                    background: earned
                      ? `${rarityConfig.color}18`
                      : 'var(--color-glass-b)',
                  }}
                >
                  <span className={`${earned ? 'text-4xl' : 'text-3xl'}`}>
                    {isHidden ? '❓' : (badge.icon_url || '🏅')}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <h3 className="font-bold text-sm">{isHidden ? '???' : badge.name}</h3>
                </div>

                <div
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-1"
                  style={{
                    color: rarityConfig.color,
                    background: rarityConfig.color + '15',
                    border: `1px solid ${rarityConfig.color}30`,
                  }}
                >
                  {lang === 'ru' ? rarityConfig.labelRu : rarityConfig.label}
                </div>

                <p className="text-xs leading-tight mt-1" style={{ color: 'var(--color-muted)' }}>
                  {isHidden ? 'Скрытое достижение' : badge.description}
                </p>

                {earned ? (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <span className="text-xs font-bold" style={{ color: 'var(--color-status-success)' }}>✓ {t('badgesEarned')}</span>
                    {earnedDate && (
                      <div className="text-xs mt-1 font-mono" style={{ color: 'var(--color-muted)' }}>{earnedDate}</div>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>🔒 {t('badgesLocked')}</span>
                    <div className="text-xs font-mono mt-1" style={{ color: 'var(--color-status-warn)' }}>+{badge.xp_reward} XP</div>
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
