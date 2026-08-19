import { useState } from 'react'
import { levelFromXp, MAX_LEVEL } from '../lib/engine'
import { t } from '../lib/i18n'

interface PrestigeSystemProps {
  totalXp: number
  prestigeCount: number
  onPrestige: () => void
}

const CONSTELLATIONS = [
  { name: 'Orion', icon: '⭐', bonus: '1.1x XP' },
  { name: 'Andromeda', icon: '🌌', bonus: '1.2x XP' },
  { name: 'Cassiopeia', icon: '✨', bonus: '1.3x XP' },
  { name: 'Lyra', icon: '🎵', bonus: '1.4x XP' },
  { name: 'Phoenix', icon: '🔥', bonus: '1.5x XP' },
]

export function PrestigeSystem({ totalXp, prestigeCount, onPrestige }: PrestigeSystemProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const level = levelFromXp(totalXp)
  const canPrestige = level >= MAX_LEVEL
  const nextConstellation = CONSTELLATIONS[prestigeCount % CONSTELLATIONS.length]

  function handlePrestige() {
    onPrestige()
    setShowConfirm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">⭐ {t('prestigeTitle')}</h2>
        <div className="text-sm" style={{ color: 'var(--color-muted)' }}>{t('prestigeConstellations')}: {prestigeCount}</div>
      </div>

      <div className="gc-lg p-6 text-center">
        <div className="text-6xl mb-4">🌌</div>
        <h3 className="text-xl font-bold mb-2">{t('prestigeStarConstellations')}</h3>
        <p style={{ color: 'var(--color-muted)' }} className="mb-4">
          {t('prestigeReachLevel').replace('{level}', String(MAX_LEVEL))}
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {CONSTELLATIONS.map((c, i) => (
            <div
              key={c.name}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                i < prestigeCount ? '' : ''
              }`}
              style={i < prestigeCount
                ? { background: 'var(--color-accent)', color: 'var(--color-navy-dark)' }
                : { background: 'var(--color-glass-b)', color: 'var(--color-muted)' }
              }
            >
              {c.icon}
            </div>
          ))}
        </div>

        {prestigeCount > 0 && (
          <div className="gc p-3 mb-4">
            <div className="text-sm" style={{ color: 'var(--color-muted)' }}>{t('prestigeCurrentBonus')}</div>
            <div className="font-mono" style={{ color: 'var(--color-accent)' }}>
              {CONSTELLATIONS[(prestigeCount - 1) % CONSTELLATIONS.length].bonus}
            </div>
          </div>
        )}

        {canPrestige ? (
          showConfirm ? (
            <div className="gc p-4">
              <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
                Reset to level 1 and unlock {nextConstellation.name} constellation?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrestige}
                  className="flex-1 btn-accent"
                >
                  {t('prestigeNow')}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-ghost"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full btn-accent"
            >
              ⭐ {t('prestigeNow')}
            </button>
          )
        ) : (
          <div>
            <div className="text-sm mb-2" style={{ color: 'var(--color-muted)' }}>
              {t('level')} {level} / {MAX_LEVEL}
            </div>
            <div className="progress-bar max-w-xs mx-auto">
              <div
                className="progress-bar-fill transition-all duration-500"
                style={{ width: `${(level / MAX_LEVEL) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="gc p-4">
        <h4 className="font-bold mb-2">{t('shipNext')} {nextConstellation.name}</h4>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{nextConstellation.icon}</span>
          <div>
            <div className="text-sm" style={{ color: 'var(--color-muted)' }}>{t('prestigeBonus')}: {nextConstellation.bonus}</div>
            <div className="text-xs" style={{ color: 'var(--color-muted2)' }}>
              {prestigeCount + 1} of {CONSTELLATIONS.length} {t('prestigeConstellations')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
