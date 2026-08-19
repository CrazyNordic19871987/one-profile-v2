import { useMemo } from 'react'
import { DIRECTIONS } from '../lib/engine'
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
      <div className={`radar-empty-shimmer rounded-xl p-6 text-center ${className}`} style={{
        background: 'linear-gradient(135deg, rgba(18, 24, 43, 0.6), rgba(30, 37, 56, 0.4))',
        border: '1px dashed rgba(0, 212, 255, 0.2)',
      }}>
        <div className="text-4xl mb-3 opacity-40">🕸️</div>
        <p className="text-sm font-bold text-cosmic-silver mb-1">Навыки закрыты</p>
        <p className="text-xs opacity-50">Пройди первую миссию, чтобы открыть навыки</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={maxRadius * level}
            fill="none"
            stroke="#1E2538"
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
              stroke="#1E2538"
              strokeWidth="1"
            />
          )
        })}

        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="rgba(0, 212, 255, 0.2)"
          stroke="#00D4FF"
          strokeWidth="2"
        />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={p.dir.color}
            stroke="#0A0E1A"
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
              fill="#8B95A8"
              fontSize="10"
            >
              {dir.icon}
            </text>
          )
        })}
      </svg>

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
              <span className="text-cosmic-silver">{dir.icon} {dir.name}</span>
              <span className="font-mono ml-auto">{xp}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
