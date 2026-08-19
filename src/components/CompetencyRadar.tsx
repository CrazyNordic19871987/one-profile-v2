import { useRef, useEffect } from 'react'
import { COMPETENCIES } from '../lib/skills-report-config'
import { t } from '../lib/i18n'

interface CompetencyRadarProps {
  scores: Record<string, number>
  size?: number
}

export function CompetencyRadar({ scores, size = 240 }: CompetencyRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = size + 'px'
    canvas.style.height = size + 'px'
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const radius = (size / 2) - 30
    const n = COMPETENCIES.length
    const angleStep = (2 * Math.PI) / n

    ctx.clearRect(0, 0, size, size)

    // Draw grid rings
    for (let ring = 1; ring <= 5; ring++) {
      const r = (radius * ring) / 5
      ctx.beginPath()
      for (let i = 0; i <= n; i++) {
        const angle = i * angleStep - Math.PI / 2
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.12)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw axis lines
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle))
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw data polygon
    ctx.beginPath()
    for (let i = 0; i <= n; i++) {
      const idx = i % n
      const angle = idx * angleStep - Math.PI / 2
      const value = (scores[COMPETENCIES[idx].id] || 0) / 100
      const r = radius * value
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.fillStyle = 'rgba(0, 212, 255, 0.15)'
    ctx.fill()
    ctx.strokeStyle = '#00D4FF'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw data points
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2
      const value = (scores[COMPETENCIES[i].id] || 0) / 100
      const r = radius * value
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = COMPETENCIES[i].color
      ctx.fill()
      ctx.strokeStyle = '#0A0E1A'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // Draw labels
    ctx.font = '10px Space Grotesk, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2
      const labelR = radius + 18
      const x = cx + labelR * Math.cos(angle)
      const y = cy + labelR * Math.sin(angle)

      ctx.fillStyle = COMPETENCIES[i].color
      ctx.fillText(COMPETENCIES[i].icon, x, y - 6)
      ctx.fillStyle = '#A0AAB8'
      ctx.font = '8px Space Grotesk, sans-serif'
      const name = COMPETENCIES[i].nameRu.length > 10 ? COMPETENCIES[i].nameRu.slice(0, 10) + '.' : COMPETENCIES[i].nameRu
      ctx.fillText(name, x, y + 5)
      ctx.font = '10px Space Grotesk, sans-serif'
    }

  }, [scores, size])

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} />
      <p className="text-xs text-cosmic-silver mt-1">{t('radarCompetencies')}</p>
    </div>
  )
}
