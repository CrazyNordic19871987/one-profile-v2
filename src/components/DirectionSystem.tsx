import { DIRECTIONS } from '../lib/engine'
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
      <h2 className="text-xl font-bold">🧭 Professional Directions</h2>

      <div className="grid gap-3">
        {DIRECTIONS.map((dir) => {
          const skill = getSkillForDirection(dir.id)
          const progress = Math.min(skill.xp / 500, 1)
          const isSelected = selectedDirection === dir.id

          return (
            <button
              key={dir.id}
              onClick={() => onSelectDirection?.(dir.id)}
              className={`bg-space-nebula rounded-lg p-4 border transition-all text-left ${
                isSelected
                  ? 'border-plasma-cyan ring-2 ring-plasma-cyan/30'
                  : 'border-space-border hover:border-plasma-cyan/50'
              }`}
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
                  <div className="text-sm text-cosmic-silver">Level {skill.level}</div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-lg" style={{ color: dir.color }}>
                    {skill.xp}
                  </div>
                  <div className="text-xs text-cosmic-silver">XP</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="h-2 bg-space-gray rounded-full overflow-hidden">
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
                <div className="mt-3 pt-3 border-t border-space-border">
                  <div className="text-sm text-cosmic-silver">
                    {dir.id === 'strategy' && 'Make decisions, plan ahead, lead teams'}
                    {dir.id === 'language' && 'Learn languages, communicate globally'}
                    {dir.id === 'communication' && 'Present ideas, work in teams, resolve conflicts'}
                    {dir.id === 'sport' && 'Stay active, build endurance, compete fairly'}
                    {dir.id === 'it' && 'Code, build, debug, create technology'}
                    {dir.id === 'art' && 'Design, create, express yourself visually'}
                    {dir.id === 'entrepreneurship' && 'Innovate, lead projects, think business'}
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
