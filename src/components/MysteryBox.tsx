import { useState } from 'react'
import { t, getLocale } from '../lib/i18n'
import { supabase } from '../lib/supabase'

interface MysteryBoxProps {
  studentId: string
  coins: number
  gems: number
  onOpened: () => void
}

const CRATE_COST = 50

const REWARDS = [
  { type: 'xp', amount: 25, weight: 30, emoji: '⚡', labelKey: 'xp' as const },
  { type: 'xp', amount: 50, weight: 20, emoji: '⚡', labelKey: 'xp' as const },
  { type: 'xp', amount: 100, weight: 10, emoji: '⚡', labelKey: 'xp' as const },
  { type: 'coins', amount: 15, weight: 25, emoji: '💰', labelKey: 'coins' as const },
  { type: 'coins', amount: 30, weight: 10, emoji: '💰', labelKey: 'coins' as const },
  { type: 'gems', amount: 3, weight: 4, emoji: '💎', labelKey: 'gems' as const },
  { type: 'gems', amount: 5, weight: 1, emoji: '💎', labelKey: 'gems' as const },
]

function rollReward() {
  const totalWeight = REWARDS.reduce((sum, r) => sum + r.weight, 0)
  let roll = Math.random() * totalWeight
  for (const reward of REWARDS) {
    roll -= reward.weight
    if (roll <= 0) return reward
  }
  return REWARDS[0]
}

export function MysteryBox({ studentId, coins, onOpened }: MysteryBoxProps) {
  const [loading, setLoading] = useState(false)
  const [reward, setReward] = useState<typeof REWARDS[0] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const canAfford = coins >= CRATE_COST
  const lang = getLocale()

  async function handleOpen() {
    if (!canAfford || loading) return
    setLoading(true)
    setError(null)

    try {
      const rolled = rollReward()

      const { data: current } = await supabase
        .from('students')
        .select('coins, gems, total_xp, xp')
        .eq('id', studentId)
        .single()

      if (!current) throw new Error('Failed to read student')

      const updates: Record<string, unknown> = {
        coins: Math.max(0, current.coins - CRATE_COST),
      }

      if (rolled.type === 'xp') {
        updates.total_xp = (current.total_xp || 0) + rolled.amount
        updates.xp = (current.xp || 0) + rolled.amount
      } else if (rolled.type === 'coins') {
        updates.coins = Math.max(0, current.coins - CRATE_COST + rolled.amount)
      } else if (rolled.type === 'gems') {
        updates.gems = (current.gems || 0) + rolled.amount
      }

      const { error: updateError } = await supabase
        .from('students')
        .update(updates)
        .eq('id', studentId)

      if (updateError) throw updateError

      setReward(rolled)
      onOpened()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open crate')
    } finally {
      setLoading(false)
    }
  }

  if (reward) {
    return (
      <div className="gc p-4 text-center">
        <div className="text-4xl mb-2 animate-bounce" aria-hidden="true">{reward.emoji}</div>
        <p className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>+{reward.amount} {t(reward.labelKey)}</p>
        <button
          onClick={() => setReward(null)}
          className="mt-3 px-4 py-1.5 rounded-lg text-xs font-bold transition-all btn-ghost"
        >
          OK
        </button>
      </div>
    )
  }

  return (
    <div className="gc p-4">
      <div className="flex items-center gap-3">
        <div className="text-3xl" aria-hidden="true">📦</div>
        <div className="flex-1">
          <h3 className="text-sm font-bold">
            {lang === 'ru' ? 'Тайный ящик' : 'Mystery Crate'}
          </h3>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            {CRATE_COST} 💰 → random reward
          </p>
        </div>
        <button
          onClick={handleOpen}
          disabled={!canAfford || loading}
          className={canAfford ? 'btn-accent' : 'btn-ghost opacity-40 cursor-not-allowed'}
        >
          {loading ? '...' : canAfford ? (lang === 'ru' ? 'Открыть' : 'Open') : (lang === 'ru' ? 'Недостаточно' : 'Need more')}
        </button>
      </div>
      {error && <p className="text-xs mt-2" style={{ color: 'var(--color-status-error)' }}>{error}</p>}
    </div>
  )
}
