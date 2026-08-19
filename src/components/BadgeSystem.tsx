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
        <div className="text-cosmic-silver">{t('loading')}</div>
      </div>
    )
  }

  const percent = badges.length > 0 ? Math.round((earnedBadges.length / badges.length) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold neon-text-cyan">{t('badgesTitle')}</h2>
        <div className="text-sm text-cosmic-silver font-mono">
          {earnedBadges.length} / {badges.length}
        </div>
      </div>

      <div className="neon-card p-4 scanlines">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-cosmic-silver">{t('badgesCollection')}</span>
          <span className="font-mono neon-text-cyan">{percent}%</span>
        </div>
        <div className="h-2 bg-space-deep rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${percent}%`,
              background: 'linear-gradient(90deg, #00D4FF, #B24BF3, #FF2D78)',
              boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
            }}
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
                className={`neon-card p-4 text-center transition-all ${
                  earned
                    ? 'neon-glow-cyan'
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
                      ? `linear-gradient(135deg, ${rarityConfig.color}25, ${rarityConfig.color}15)`
                      : 'rgba(30, 37, 56, 0.8)',
                    boxShadow: earned
                      ? `0 0 20px ${rarityConfig.glow}, inset 0 0 20px ${rarityConfig.color}15`
                      : 'none',
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

                <p className="text-xs text-cosmic-silver leading-tight mt-1">
                  {isHidden ? 'Скрытое достижение' : badge.description}
                </p>

                {earned ? (
                  <div className="mt-3 pt-3 border-t border-space-border">
                    <span className="text-xs neon-text-green font-bold">✓ {t('badgesEarned')}</span>
                    {earnedDate && (
                      <div className="text-xs text-cosmic-silver mt-1 font-mono">{earnedDate}</div>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t border-space-border">
                    <span className="text-xs text-cosmic-silver">🔒 {t('badgesLocked')}</span>
                    <div className="text-xs neon-text-warning font-mono mt-1">+{badge.xp_reward} XP</div>
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
