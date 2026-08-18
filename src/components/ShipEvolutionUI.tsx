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
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold neon-text-cyan">{t('shipEvolution')}</h2>

      <div className="neon-card p-6 scanlines">
        <div className="flex items-center justify-between relative">
          {/* Connection line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-space-gray" />
          <div
            className="absolute top-6 left-0 h-0.5 transition-all duration-700"
            style={{
              width: `${(currentIndex / (SHIP_STAGES.length - 1)) * 100}%`,
              background: 'linear-gradient(90deg, #00D4FF, #B24BF3)',
              boxShadow: '0 0 8px rgba(0, 212, 255, 0.5)',
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
                      ? 'linear-gradient(135deg, #00D4FF, #B24BF3)'
                      : isUnlocked
                        ? 'rgba(0, 230, 118, 0.15)'
                        : 'rgba(30, 37, 56, 0.8)',
                    border: `2px solid ${isActive ? '#00D4FF' : isUnlocked ? '#00E67680' : '#2E354880'}`,
                    boxShadow: isActive
                      ? '0 0 20px rgba(0, 212, 255, 0.5)'
                      : isUnlocked
                        ? '0 0 10px rgba(0, 230, 118, 0.2)'
                        : 'none',
                  }}
                >
                  {stageIcons[index]}
                </div>

                <div className={`text-xs font-bold ${isActive ? 'neon-text-cyan' : isUnlocked ? 'neon-text-green' : 'text-cosmic-silver'}`}>
                  {stage.stage}
                </div>

                <div className="text-[10px] text-cosmic-silver font-mono">
                  {stage.minLevel}–{stage.maxLevel === Infinity ? '∞' : stage.maxLevel}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-space-border text-center">
          <div
            className="text-5xl mb-3"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(0, 212, 255, 0.5))',
            }}
          >
            {stageIcons[currentIndex]}
          </div>
          <h3 className="text-xl font-bold neon-text-cyan">{currentStage}</h3>
          <p className="text-sm text-cosmic-silver mt-1 font-mono">
            {currentIndex < SHIP_STAGES.length - 1
              ? `${SHIP_STAGES[currentIndex + 1].minLevel - level} ${t('shipLevelsToNext')}`
              : t('shipMaxReached')}
          </p>
        </div>
      </div>

      {currentIndex < SHIP_STAGES.length - 1 && (
        <div className="neon-card p-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(178, 75, 243, 0.1))',
              }}
            >
              {stageIcons[currentIndex + 1]}
            </div>
            <div>
              <h4 className="font-bold">{t('shipNext')} {SHIP_STAGES[currentIndex + 1].stage}</h4>
              <div className="text-sm text-cosmic-silver font-mono">
                {t('shipUnlocksAt')} {SHIP_STAGES[currentIndex + 1].minLevel}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
