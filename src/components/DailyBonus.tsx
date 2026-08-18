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
      <div className="neon-card neon-glow-green p-6 text-center scanlines">
        <div className="text-5xl mb-4 animate-bounce">🎁</div>
        <h3 className="text-xl font-bold mb-3 neon-text-green">
          {t('dailyBonusClaimed')}
        </h3>
        <div className="flex justify-center gap-8 mb-4">
          <div>
            <div className="text-3xl font-mono font-bold neon-text-green">+{result.xp}</div>
            <div className="text-xs text-cosmic-silver mt-1">{t('xp')}</div>
          </div>
          <div>
            <div className="text-3xl font-mono font-bold neon-text-warning">+{result.coins}</div>
            <div className="text-xs text-cosmic-silver mt-1">{t('coins')}</div>
          </div>
        </div>
        <div className="text-sm text-cosmic-silver font-mono">
          {t('dailyBonusStreak')}: {result.streak} 🔥
        </div>
      </div>
    )
  }

  return (
    <div className={`neon-card p-6 scanlines ${alreadyClaimed ? '' : 'neon-glow-orange'}`}>
      <div className="text-center">
        <div className="text-5xl mb-4">🎁</div>
        <h3 className="text-xl font-bold mb-3">{t('dailyBonusTitle')}</h3>
        
        <div className="flex justify-center gap-6 mb-5">
          <div className="neon-card px-4 py-3 text-center">
            <div className="text-xs text-cosmic-silver mb-1">{t('dailyBonusStreak')}</div>
            <div className="text-2xl font-mono font-bold neon-text-premium">{currentStreak} 🔥</div>
          </div>
          <div className="neon-card px-4 py-3 text-center">
            <div className="text-xs text-cosmic-silver mb-1">{t('dailyBonusNext')}</div>
            <div className="text-2xl font-mono font-bold neon-text-cyan">+{getStreakBonus()} XP</div>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isCompleted = day <= currentStreak
              return (
                <div
                  key={day}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: isCompleted
                      ? 'linear-gradient(135deg, #FF9100, #FFD740)'
                      : 'rgba(30, 37, 56, 0.8)',
                    color: isCompleted ? '#0A0E1A' : '#8B95A8',
                    border: `2px solid ${isCompleted ? '#FF9100' : '#2E354880'}`,
                    boxShadow: isCompleted ? '0 0 10px rgba(255, 145, 0, 0.3)' : 'none',
                  }}
                >
                  {day}
                </div>
              )
            })}
          </div>
          <div className="text-xs text-cosmic-silver mt-2 font-mono">
            {t('dailyBonusDay7')}
          </div>
        </div>

        {error && (
          <div className="text-sm text-status-error mb-4">{error}</div>
        )}

        <button
          onClick={handleClaim}
          disabled={loading || alreadyClaimed}
          className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
            alreadyClaimed
              ? 'bg-space-gray text-cosmic-silver cursor-not-allowed'
              : ''
          }`}
          style={!alreadyClaimed ? {
            background: 'linear-gradient(135deg, #FF9100, #FFD740)',
            color: '#0A0E1A',
            boxShadow: '0 0 20px rgba(255, 145, 0, 0.3)',
          } : undefined}
          onMouseEnter={(e) => {
            if (!alreadyClaimed) {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 145, 0, 0.5)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }
          }}
          onMouseLeave={(e) => {
            if (!alreadyClaimed) {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 145, 0, 0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          {loading ? t('dailyBonusClaiming') : alreadyClaimed ? t('dailyBonusAlreadyClaimed') : t('dailyBonusClaim')}
        </button>
      </div>
    </div>
  )
}
