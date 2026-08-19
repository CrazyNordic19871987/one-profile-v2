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
      <div className="gc-lg p-6 text-center">
        <div className="text-5xl mb-4 animate-bounce">🎁</div>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-status-success)' }}>
          {t('dailyBonusClaimed')}
        </h3>
        {result.comebackBonus && (
          <div className="mb-3 px-3 py-2 rounded-lg text-sm font-bold" style={{
            background: 'var(--color-accent-dim)',
            border: '1px solid var(--color-border-h)',
            color: 'var(--color-accent)',
          }}>
            🎉 {t('dailyBonusComeback')}
          </div>
        )}
        {result.streakFreezeUsed && (
          <div className="mb-3 px-3 py-2 rounded-lg text-sm font-bold" style={{
            background: 'var(--color-accent-dim)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-status-success)',
          }}>
            🧊 {t('dailyBonusStreakFreezeUsed')}
          </div>
        )}
        <div className="flex justify-center gap-8 mb-4">
          <div>
            <div className="text-3xl font-mono font-bold" style={{ color: 'var(--color-status-success)' }}>+{result.xp}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{t('xp')}</div>
          </div>
          <div>
            <div className="text-3xl font-mono font-bold" style={{ color: 'var(--color-status-warn)' }}>+{result.coins}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{t('coins')}</div>
          </div>
        </div>
        <div className="text-sm font-mono" style={{ color: 'var(--color-muted)' }}>
          {t('dailyBonusStreak')}: {result.streak} 🔥
        </div>
      </div>
    )
  }

  const effectiveStreak = currentStreak % 7

  return (
    <div className={`gc-lg p-6 ${alreadyClaimed ? '' : 'border-accent'}`} style={!alreadyClaimed ? { borderColor: 'var(--color-border-h)' } : undefined}>
      <div className="text-center">
        <div className="text-5xl mb-4">🎁</div>
        <h3 className="text-xl font-bold mb-3">{t('dailyBonusTitle')}</h3>
        
        <div className="flex justify-center gap-6 mb-5">
          <div className="gc px-4 py-3 text-center">
            <div className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>{t('dailyBonusStreak')}</div>
            <div className="text-2xl font-mono font-bold" style={{ color: 'var(--color-accent)' }}>{currentStreak} 🔥</div>
          </div>
          <div className="gc px-4 py-3 text-center">
            <div className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>{t('dailyBonusNext')}</div>
            <div className="text-lg font-mono font-bold" style={{ color: 'var(--color-accent)' }}>+{getNextXp()} XP</div>
            <div className="text-xs font-mono" style={{ color: 'var(--color-status-warn)' }}>+{getNextCoins()} 💰</div>
          </div>
        </div>

        {/* Connected day track */}
        <div className="mb-5">
          <div className="relative flex justify-center items-center" style={{ minHeight: 48 }}>
            {/* Connector line behind circles */}
            <div className="absolute left-0 right-0 flex items-center justify-center px-6" style={{ height: 2, background: 'var(--color-glass-b)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{
                width: `${Math.min(effectiveStreak / 7 * 100, 100)}%`,
                maxWidth: 'calc(100% - 48px)',
                background: 'var(--color-accent)',
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
                        ? 'var(--color-accent)'
                        : isCurrent
                          ? 'var(--color-accent-dim)'
                          : 'var(--color-glass-b)',
                      color: isCompleted ? 'var(--color-navy-dark)' : isCurrent ? 'var(--color-accent)' : 'var(--color-muted)',
                      border: `2px solid ${isCompleted ? 'var(--color-accent)' : isCurrent ? 'var(--color-border-h)' : isDay7 ? 'rgba(178, 75, 243, 0.4)' : 'var(--color-border)'}`,
                      transform: isDay7 && !isCompleted ? 'scale(1.1)' : undefined,
                    }}
                  >
                    {isDay7 ? '💎' : day}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="text-xs mt-2 font-mono" style={{ color: 'var(--color-muted)' }}>
            {t('dailyBonusDay7Special')}
          </div>
        </div>

        {error && (
          <div className="text-sm mb-4" style={{ color: 'var(--color-status-error)' }}>{error}</div>
        )}

        <button
          onClick={handleClaim}
          disabled={loading || alreadyClaimed}
          className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
            alreadyClaimed
              ? 'cursor-not-allowed'
              : 'btn-accent'
          }`}
          style={alreadyClaimed ? {
            background: 'var(--color-glass-b)',
            color: 'var(--color-muted)',
          } : undefined}
        >
          {loading ? t('dailyBonusClaiming') : alreadyClaimed ? t('dailyBonusAlreadyClaimed') : t('dailyBonusClaim')}
        </button>
      </div>
    </div>
  )
}
