import { useMemo } from 'react'
import { getShipStage, getShipProgress, type ShipStage } from '../lib/engine'

interface ShipVisualProps {
  level: number
  className?: string
}

const SHIP_CONFIGS: Record<ShipStage, {
  size: number
  modules: number
  glowColor: string
  animation: string
}> = {
  'Scout Pod': { size: 80, modules: 2, glowColor: '#00D4FF', animation: 'pulse' },
  'Explorer': { size: 120, modules: 4, glowColor: '#4A90D9', animation: 'float' },
  'Cruiser': { size: 160, modules: 6, glowColor: '#7C4DFF', animation: 'glow' },
  'Battleship': { size: 200, modules: 8, glowColor: '#FF9100', animation: 'spin' },
  'Dreadnought': { size: 240, modules: 10, glowColor: '#FFD740', animation: 'rainbow' },
}

export function ShipVisual({ level, className = '' }: ShipVisualProps) {
  const stage = getShipStage(level)
  const progress = getShipProgress(level)
  const config = SHIP_CONFIGS[stage]

  const modules = useMemo(() => {
    return Array.from({ length: config.modules }, (_, i) => ({
      id: i,
      angle: (i / config.modules) * 360,
      distance: 20 + (i % 2) * 10,
      size: 4 + Math.random() * 4,
    }))
  }, [config.modules])

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Glow effect */}
      <div
        className="absolute rounded-full opacity-30 blur-xl"
        style={{
          width: config.size * 1.5,
          height: config.size * 1.5,
          backgroundColor: config.glowColor,
          animation: `ship-${config.animation} 3s ease-in-out infinite`,
        }}
      />

      {/* Ship SVG */}
      <svg
        width={config.size}
        height={config.size}
        viewBox="0 0 100 100"
        className="relative z-10"
      >
        {/* Ship body */}
        <defs>
          <linearGradient id="shipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.glowColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B95A8" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main hull */}
        <path
          d="M50 15 L65 45 L60 75 L40 75 L35 45 Z"
          fill="url(#shipGradient)"
          stroke={config.glowColor}
          strokeWidth="1"
          filter="url(#glow)"
        />

        {/* Cockpit */}
        <ellipse
          cx="50"
          cy="30"
          rx="8"
          ry="12"
          fill="#1E2538"
          stroke={config.glowColor}
          strokeWidth="0.5"
        />

        {/* Wings */}
        <path
          d="M35 45 L15 55 L25 65 L40 55 Z"
          fill="url(#shipGradient)"
          stroke={config.glowColor}
          strokeWidth="0.5"
          opacity="0.7"
        />
        <path
          d="M65 45 L85 55 L75 65 L60 55 Z"
          fill="url(#shipGradient)"
          stroke={config.glowColor}
          strokeWidth="0.5"
          opacity="0.7"
        />

        {/* Engine glow */}
        <ellipse
          cx="50"
          cy="80"
          rx="10"
          ry="5"
          fill={config.glowColor}
          opacity={0.3 + progress * 0.5}
        >
          <animate
            attributeName="opacity"
            values={`${0.3 + progress * 0.3};${0.5 + progress * 0.5};${0.3 + progress * 0.3}`}
            dur="1s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Module indicators */}
        {modules.map((mod) => {
          const rad = (mod.angle * Math.PI) / 180
          const x = 50 + Math.cos(rad) * mod.distance
          const y = 50 + Math.sin(rad) * mod.distance
          return (
            <circle
              key={mod.id}
              cx={x}
              cy={y}
              r={mod.size / 2}
              fill={config.glowColor}
              opacity={0.5 + progress * 0.5}
            >
              <animate
                attributeName="r"
                values={`${mod.size / 2};${mod.size / 2 + 1};${mod.size / 2}`}
                dur="2s"
                repeatCount="indefinite"
                begin={`${mod.id * 0.2}s`}
              />
            </circle>
          )
        })}
      </svg>

      {/* Stage label */}
      <div className="absolute bottom-0 text-center">
        <span
          className="text-xs font-mono px-2 py-0.5 rounded"
          style={{ backgroundColor: config.glowColor + '30', color: config.glowColor }}
        >
          {stage}
        </span>
      </div>

      <style>{`
        @keyframes ship-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        @keyframes ship-float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-5px); opacity: 0.5; }
        }
        @keyframes ship-glow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.6; }
        }
        @keyframes ship-spin {
          0% { transform: rotate(0deg); opacity: 0.3; }
          100% { transform: rotate(360deg); opacity: 0.3; }
        }
        @keyframes ship-rainbow {
          0% { filter: hue-rotate(0deg); opacity: 0.3; }
          100% { filter: hue-rotate(360deg); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
