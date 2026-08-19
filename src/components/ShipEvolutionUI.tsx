import { getShipStage, SHIP_STAGES } from '../lib/engine'
import { t } from '../lib/i18n'

interface ShipEvolutionUIProps {
  level: number
  onEvolutionComplete?: () => void
}

export function ShipEvolutionUI({ level, onEvolutionComplete: _onEvolutionComplete }: ShipEvolutionUIProps) {
  const currentStage = getShipStage(level)
  const currentIndex = SHIP_STAGES.findIndex(s => s.stage === currentStage)

  const stageIcons = ['🛸', '🦅', '⚔️', '🛡️', '👑']

  return (
    <div className="space-y-6 page-enter">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{t('shipEvolution')}</h2>

      <div className="gc p-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-6 left-0 right-0 h-0.5" style={{ background: 'var(--color-glass-b)' }} />
          <div
            className="absolute top-6 left-0 h-0.5 transition-all duration-700"
            style={{
              width: `${(currentIndex / (SHIP_STAGES.length - 1)) * 100}%`,
              background: 'var(--color-accent)',
            }}
          />

          {SHIP_STAGES.map((stage, index) => {
            const isActive = index === currentIndex
            const isUnlocked = index <= currentIndex

            return (
              <div key={stage.stage} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all duration-300 ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={{
                    background: isActive
                      ? 'var(--color-accent)'
                      : isUnlocked
                        ? 'var(--color-accent-dim)'
                        : 'var(--color-glass-b)',
                    border: `2px solid ${isActive ? 'var(--color-accent)' : isUnlocked ? 'rgba(34,211,166,0.5)' : 'var(--color-border)'}`,
                  }}
                >
                  {stageIcons[index]}
                </div>

                <div
                  className="text-xs font-bold"
                  style={{
                    color: isActive ? 'var(--color-accent)' : isUnlocked ? 'var(--color-status-success)' : 'var(--color-muted)',
                  }}
                >
                  {stage.stage}
                </div>

                <div className="text-[10px] font-mono" style={{ color: 'var(--color-muted)' }}>
                  {stage.minLevel}–{stage.maxLevel === Infinity ? '∞' : stage.maxLevel}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-5xl mb-3">
            {stageIcons[currentIndex]}
          </div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--color-accent)' }}>{currentStage}</h3>
          <p className="text-sm mt-1 font-mono" style={{ color: 'var(--color-muted)' }}>
            {currentIndex < SHIP_STAGES.length - 1
              ? `${SHIP_STAGES[currentIndex + 1].minLevel - level} ${t('shipLevelsToNext')}`
              : t('shipMaxReached')}
          </p>
        </div>
      </div>

      {currentIndex < SHIP_STAGES.length - 1 && (
        <div className="gc p-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
              style={{ background: 'var(--color-accent-dim)' }}
            >
              {stageIcons[currentIndex + 1]}
            </div>
            <div>
              <h4 className="font-bold">{t('shipNext')} {SHIP_STAGES[currentIndex + 1].stage}</h4>
              <div className="text-sm font-mono" style={{ color: 'var(--color-muted)' }}>
                {t('shipUnlocksAt')} {SHIP_STAGES[currentIndex + 1].minLevel}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
