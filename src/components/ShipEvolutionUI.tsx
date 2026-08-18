import { getShipStage, SHIP_STAGES } from '../lib/engine'
import { t } from '../lib/i18n'

interface ShipEvolutionUIProps {
  level: number
  onEvolutionComplete?: () => void
}

export function ShipEvolutionUI({ level, onEvolutionComplete: _onEvolutionComplete }: ShipEvolutionUIProps) {
  const currentStage = getShipStage(level)
  const currentIndex = SHIP_STAGES.findIndex(s => s.stage === currentStage)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">🚀 {t('shipEvolution')}</h2>

      {/* Evolution Timeline */}
      <div className="bg-space-nebula rounded-xl p-6 border border-space-border">
        <div className="flex items-center justify-between">
          {SHIP_STAGES.map((stage, index) => {
            const isActive = index === currentIndex
            const isUnlocked = index <= currentIndex

            return (
              <div key={stage.stage} className="flex flex-col items-center">
                {/* Stage Node */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 ${
                    isActive
                      ? 'bg-plasma-cyan text-space-deep ring-4 ring-plasma-cyan/30'
                      : isUnlocked
                        ? 'bg-status-success text-space-deep'
                        : 'bg-space-gray text-cosmic-silver'
                  }`}
                >
                  {index === 0 ? ' Pod' : index === 1 ? '🦅' : index === 2 ? '⚔️' : index === 3 ? '🛡️' : '👑'}
                </div>

                {/* Stage Name */}
                <div className={`text-xs font-bold ${isActive ? 'text-plasma-cyan' : isUnlocked ? 'text-status-success' : 'text-cosmic-silver'}`}>
                  {stage.stage}
                </div>

                {/* Level Range */}
                <div className="text-xs text-cosmic-silver">
                  Lvl {stage.minLevel}-{stage.maxLevel === Infinity ? '100+' : stage.maxLevel}
                </div>

                {/* Connector */}
                {index < SHIP_STAGES.length - 1 && (
                  <div className="absolute w-full h-0.5 bg-space-gray" style={{ top: '24px' }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Current Stage Info */}
        <div className="mt-6 pt-4 border-t border-space-border">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {currentIndex === 0 ? ' Pod' : currentIndex === 1 ? '🦅' : currentIndex === 2 ? '⚔️' : currentIndex === 3 ? '🛡️' : '👑'}
            </div>
            <h3 className="font-bold text-lg">{currentStage}</h3>
            <p className="text-sm text-cosmic-silver">
              {currentIndex < SHIP_STAGES.length - 1
                ? `${SHIP_STAGES[currentIndex + 1].minLevel - level} ${t('shipLevelsToNext')}`
                : t('shipMaxReached')}
            </p>
          </div>
        </div>
      </div>

      {/* Next Stage Preview */}
      {currentIndex < SHIP_STAGES.length - 1 && (
        <div className="bg-space-nebula rounded-lg p-4 border border-space-border">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {currentIndex + 1 === 0 ? ' Pod' : currentIndex + 1 === 1 ? '🦅' : currentIndex + 1 === 2 ? '⚔️' : currentIndex + 1 === 3 ? '🛡️' : '👑'}
            </span>
            <div>
              <h4 className="font-bold">{t('shipNext')} {SHIP_STAGES[currentIndex + 1].stage}</h4>
              <div className="text-sm text-cosmic-silver">
                {t('shipUnlocksAt')} {SHIP_STAGES[currentIndex + 1].minLevel}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
