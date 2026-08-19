import { t, getLocale } from '../lib/i18n'
import { DISC_COLORS, DISC_COMBO } from '../lib/skills-report-config'

interface DISCProfileProps {
  values: Record<string, number>
  dominant: string
  combo: string | null
}

export function DISCProfile({ values, dominant, combo }: DISCProfileProps) {
  const lang = getLocale()
  const types = ['D', 'I', 'S', 'C'] as const
  const labels: Record<string, { ru: string; en: string }> = {
    D: { ru: 'Доминантный', en: 'Dominant' },
    I: { ru: 'Влиятельный', en: 'Influential' },
    S: { ru: 'Стабильный', en: 'Steady' },
    C: { ru: 'Сознательный', en: 'Conscientious' },
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold">🧠 {t('discTitle')}</h3>

      {types.map(type => {
        const val = values[type] || 0
        const isDominant = type === dominant
        return (
          <div key={type} className="flex items-center gap-3">
            <span className="text-xs font-bold w-6" style={{ color: DISC_COLORS[type] }}>{type}</span>
            <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'var(--color-navy-dark)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${val}%`,
                  background: DISC_COLORS[type],
                  opacity: isDominant ? 1 : 0.6,
                }}
              />
            </div>
            <span className="text-xs font-bold w-10 text-right" style={{ color: DISC_COLORS[type] }}>{val}%</span>
          </div>
        )
      })}

      <div className="mt-3 p-3 rounded-lg" style={{ background: 'var(--color-glass)', border: `2px solid ${DISC_COLORS[dominant]}` }}>
        <div className="flex items-center gap-2">
          <span className="text-lg" style={{ color: DISC_COLORS[dominant] }}>●</span>
          <span className="text-sm font-bold" style={{ color: DISC_COLORS[dominant] }}>
            {labels[dominant]?.[lang] || dominant}
          </span>
        </div>
        {combo && DISC_COMBO[combo] && (
          <div className="mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: DISC_COMBO[combo].color + '30', color: DISC_COMBO[combo].color }}>
              {DISC_COMBO[combo][`label${lang === 'en' ? 'En' : 'Ru'}`]}
            </span>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
              {DISC_COMBO[combo][`desc${lang === 'en' ? 'En' : 'Ru'}`]}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}