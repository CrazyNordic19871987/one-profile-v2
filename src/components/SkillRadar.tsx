import { useMemo } from 'react'
import { DIRECTIONS } from '../lib/engine'
import { t } from '../lib/i18n'
import type { Direction } from '../types/database'

interface SkillRadarProps {
  skills: { direction: Direction; xp: number }[]
  size?: number
  className?: string
}

export function SkillRadar({ skills, size = 200, className = '' }: SkillRadarProps) {
  const hasAnyXp = skills.some(s => s.xp > 0)
  const center = size / 2
  const maxRadius = size / 2 - 20

  const points = useMemo(() => {
    return DIRECTIONS.map((dir, i) => {
      const skill = skills.find(s => s.direction === dir.id)
      const xp = skill?.xp || 0
      const value = hasAnyXp ? Math.min(xp / 500, 1) : 0
      const angle = (i / DIRECTIONS.length) * 2 * Math.PI - Math.PI / 2
      const x = center + Math.cos(angle) * maxRadius * value
      const y = center + Math.sin(angle) * maxRadius * value
      return { x, y, dir, value }
    })
  }, [skills, center, maxRadius, hasAnyXp])

  const gridLevels = [0.25, 0.5, 0.75, 1]

  if (!hasAnyXp) {
    return (
      <div className="gc rounded-xl p-6 text-center" style={{
        background: 'var(--color-glass)',
        border: '1px dashed var(--color-border)',
      }}>
        <div className="text-4xl mb-3 opacity-40" aria-hidden="true">🕸️</div>
        <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-muted)' }}>{t('radarEmpty')}</p>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{t('radarEmptyDesc')}</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Skill radar chart">
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={maxRadius * level}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}

        {DIRECTIONS.map((_, i) => {
          const angle = (i / DIRECTIONS.length) * 2 * Math.PI - Math.PI / 2
          const x = center + Math.cos(angle) * maxRadius
          const y = center + Math.sin(angle) * maxRadius
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          )
        })}

        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="rgba(237, 118, 21, 0.12)"
          stroke="#ed7615"
          strokeWidth="2"
        />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={p.dir.color}
            stroke="var(--color-navy-dark)"
            strokeWidth="2"
          />
        ))}

        {DIRECTIONS.map((dir, i) => {
          const angle = (i / DIRECTIONS.length) * 2 * Math.PI - Math.PI / 2
          const labelRadius = maxRadius + 15
          const x = center + Math.cos(angle) * labelRadius
          const y = center + Math.sin(angle) * labelRadius
          return (
            <text
              key={dir.id}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize="10"
            >
              {dir.icon}
            </text>
          )
        })}
      </svg>

      <div className="sr-only" aria-live="polite">
        {DIRECTIONS.map(dir => {
          const skill = skills.find(s => s.direction === dir.id)
          const xp = skill?.xp || 0
          return `${dir.name}: ${xp} XP`
        }).join(', ')}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
        {DIRECTIONS.map((dir) => {
          const skill = skills.find(s => s.direction === dir.id)
          const xp = skill?.xp || 0
          return (
            <div key={dir.id} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: dir.color }}
              />
              <span style={{ color: 'var(--color-muted)' }}>{dir.icon} {dir.name}</span>
              <span className="font-mono ml-auto">{xp}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}