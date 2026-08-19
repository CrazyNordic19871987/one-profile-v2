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
  const [result, setResult] = useState<{ xp: number; coins: number; streak: number; comebackBonus: boolean; streakFreezeUsed: boolean } | null>(null)
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

  function getNextXp(): number {
    const nextStreak = currentStreak + 1
    const streakBonus = Math.min(nextStreak, 7)
    return 10 + (nextStreak * 5) + (streakBonus * 2)
  }

  function getNextCoins(): number {
    const nextStreak = currentStreak + 1
    const streakBonus = Math.min(nextStreak, 7)
    return 5 + (nextStreak * 3) + (streakBonus * 1)
  }

  if (result) {
    return (
      <div className="neon-card neon-glow-green p-6 text-center scanlines">
        <div className="text-5xl mb-4 animate-bounce">🎁</div>
        <h3 className="text-xl font-bold mb-3 neon-text-green">
          {t('dailyBonusClaimed')}
        </h3>
        {result.comebackBonus && (
          <div className="mb-3 px-3 py-2 rounded-lg text-sm font-bold" style={{
            background: 'linear-gradient(135deg, rgba(178, 75, 243, 0.15), rgba(255, 45, 120, 0.15))',
            border: '1px solid rgba(178, 75, 243, 0.3)',
            color: '#B24BF3',
          }}>
            🎉 {t('dailyBonusComeback')}
          </div>
        )}
        {result.streakFreezeUsed && (
          <div className="mb-3 px-3 py-2 rounded-lg text-sm font-bold" style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 230, 118, 0.15))',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            color: '#00D4FF',
          }}>
            🧊 {t('dailyBonusStreakFreezeUsed')}
          </div>
        )}
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

  const effectiveStreak = currentStreak % 7

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
            <div className="text-lg font-mono font-bold neon-text-cyan">+{getNextXp()} XP</div>
            <div className="text-xs font-mono neon-text-warning">+{getNextCoins()} 💰</div>
          </div>
        </div>

        {/* Connected day track */}
        <div className="mb-5">
          <div className="relative flex justify-center items-center" style={{ minHeight: 48 }}>
            {/* Connector line behind circles */}
            <div className="absolute left-0 right-0 flex items-center justify-center px-6" style={{ height: 2, background: 'rgba(30, 37, 56, 0.8)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{
                width: `${Math.min(effectiveStreak / 7 * 100, 100)}%`,
                maxWidth: 'calc(100% - 48px)',
                background: 'linear-gradient(90deg, #FF9100, #FFD740)',
                boxShadow: effectiveStreak > 0 ? '0 0 8px rgba(255, 145, 0, 0.4)' : 'none',
              }} />
            </div>

            <div className="relative flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const isCompleted = day <= effectiveStreak
                const isCurrent = day === effectiveStreak + 1 && !alreadyClaimed
                const isDay7 = day === 7

                return (
                  <div
                    key={day}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isCurrent ? 'day-current-pulse' : ''}`}
                    style={{
                      background: isCompleted
                        ? 'linear-gradient(135deg, #FF9100, #FFD740)'
                        : isCurrent
                          ? 'linear-gradient(135deg, rgba(255, 145, 0, 0.3), rgba(255, 215, 64, 0.3))'
                          : 'rgba(30, 37, 56, 0.8)',
                      color: isCompleted ? '#0A0E1A' : isCurrent ? '#FFD740' : '#8B95A8',
                      border: `2px solid ${isCompleted ? '#FF9100' : isCurrent ? 'rgba(255, 145, 0, 0.5)' : isDay7 ? 'rgba(178, 75, 243, 0.4)' : '#2E354880'}`,
                      boxShadow: isCompleted ? '0 0 10px rgba(255, 145, 0, 0.3)' : 'none',
                      transform: isDay7 && !isCompleted ? 'scale(1.1)' : undefined,
                    }}
                  >
                    {isDay7 ? '💎' : day}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="text-xs text-cosmic-silver mt-2 font-mono">
            {t('dailyBonusDay7Special')}
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
