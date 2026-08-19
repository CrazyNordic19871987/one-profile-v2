import { DIRECTIONS } from '../lib/engine'
import { t, getDirectionDesc } from '../lib/i18n'
import type { Direction } from '../types/database'

interface DirectionSystemProps {
  skills: { direction: Direction; xp: number; level: number }[]
  selectedDirection?: Direction | null
  onSelectDirection?: (direction: Direction) => void
}

export function DirectionSystem({ skills, selectedDirection, onSelectDirection }: DirectionSystemProps) {
  function getSkillForDirection(direction: Direction) {
    return skills.find(s => s.direction === direction) || { xp: 0, level: 1 }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">🧭 {t('navDirections')}</h2>

      <div className="grid gap-3">
        {DIRECTIONS.map((dir) => {
          const skill = getSkillForDirection(dir.id)
          const progress = Math.min(skill.xp / 500, 1)
          const isSelected = selectedDirection === dir.id

          return (
            <button
              key={dir.id}
              onClick={() => onSelectDirection?.(dir.id)}
              className={`rounded-lg p-4 transition-all text-left ${
                isSelected
                  ? 'ring-2'
                  : ''
              }`}
              style={{
                background: 'var(--color-navy-light)',
                border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                '--tw-ring-color': 'rgba(237, 118, 21, 0.3)',
              } as React.CSSProperties}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: dir.color + '20' }}
                >
                  {dir.icon}
                </div>

                <div className="flex-1">
                  <div className="font-bold">{dir.name}</div>
                  <div className="text-sm" style={{ color: 'var(--color-muted)' }}>{t('level')} {skill.level}</div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-lg" style={{ color: dir.color }}>
                    {skill.xp}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{t('xp')}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="progress-bar">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress * 100}%`,
                      backgroundColor: dir.color,
                    }}
                  />
                </div>
              </div>

              {/* Direction-specific info */}
              {isSelected && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <div className="text-sm" style={{ color: 'var(--color-muted)' }}>
                    {getDirectionDesc(dir.id)}
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
