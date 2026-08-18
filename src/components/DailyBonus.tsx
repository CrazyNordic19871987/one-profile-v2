import { useState } from 'react'
import { t } from '../lib/i18n'
import { claimDailyBonus } from '../lib/currency'

interface DailyBonusProps {
  studentId: string
  currentStreak: number
  lastBonusDate: string | null
  onBonusClaimed: () => void
}

export function DailyBonus({ studentId, currentStreak, lastBonusDate, onBonusClaimed }: DailyBonusProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ xp: number; coins: number; streak: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]
  const alreadyClaimed = lastBonusDate === today

  async function handleClaim() {
    setLoading(true)
    setError(null)

    try {
      const bonus = await claimDailyBonus(studentId)
      setResult(bonus)
      onBonusClaimed()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim bonus')
    } finally {
      setLoading(false)
    }
  }

  function getStreakBonus(): number {
    return Math.min(currentStreak + 1, 7)
  }

  if (result) {
    return (
      <div className="bg-space-nebula rounded-xl p-6 border border-status-success text-center">
        <div className="text-5xl mb-4 animate-bounce">🎁</div>
        <h3 className="text-xl font-bold mb-2 text-status-success">
          {t('dailyBonusClaimed')}
        </h3>
        <div className="flex justify-center gap-6 mb-4">
          <div>
            <div className="text-2xl font-mono text-status-success">+{result.xp}</div>
            <div className="text-xs text-cosmic-silver">{t('xp')}</div>
          </div>
          <div>
            <div className="text-2xl font-mono text-status-warning">+{result.coins}</div>
            <div className="text-xs text-cosmic-silver">{t('coins')}</div>
          </div>
        </div>
        <div className="text-sm text-cosmic-silver">
          {t('dailyBonusStreak')}: {result.streak} 🔥
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-space-nebula rounded-xl p-6 border ${alreadyClaimed ? 'border-space-border' : 'border-status-premium'}`}>
      <div className="text-center">
        <div className="text-5xl mb-4">🎁</div>
        <h3 className="text-xl font-bold mb-2">{t('dailyBonusTitle')}</h3>
        
        <div className="flex justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-cosmic-silver">{t('dailyBonusStreak')}</div>
            <div className="text-2xl font-mono text-status-premium">{currentStreak} 🔥</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-cosmic-silver">{t('dailyBonusNext')}</div>
            <div className="text-2xl font-mono text-plasma-cyan">+{getStreakBonus()} XP</div>
          </div>
        </div>

        {/* Streak Progress */}
        <div className="mb-4">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div
                key={day}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  day <= currentStreak
                    ? 'bg-status-premium text-space-deep'
                    : 'bg-space-gray text-cosmic-silver'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="text-xs text-cosmic-silver mt-2">
            {t('dailyBonusDay7')}
          </div>
        </div>

        {error && (
          <div className="text-sm text-status-error mb-4">{error}</div>
        )}

        <button
          onClick={handleClaim}
          disabled={loading || alreadyClaimed}
          className={`w-full py-3 rounded-lg font-bold transition-colors ${
            alreadyClaimed
              ? 'bg-space-gray text-cosmic-silver cursor-not-allowed'
              : 'bg-plasma-cyan text-space-deep hover:bg-plasma-blue'
          }`}
        >
          {loading ? t('dailyBonusClaiming') : alreadyClaimed ? t('dailyBonusAlreadyClaimed') : t('dailyBonusClaim')}
        </button>
      </div>
    </div>
  )
}
