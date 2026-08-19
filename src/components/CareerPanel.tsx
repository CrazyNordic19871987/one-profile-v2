import { t, getLocale } from '../lib/i18n'

interface CareerPanelProps {
  professions: Array<{ titleRu: string; titleEn: string; descRu: string; descEn: string; score: number }>
}

export function CareerPanel({ professions }: CareerPanelProps) {
  const lang = getLocale()

  if (professions.length === 0) {
    return (
      <div className="neon-card p-4 text-center text-cosmic-silver text-sm">
        <div className="text-2xl mb-2">🧭</div>
        {t('careerNoData')}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold">🎯 {t('careerPanelTitle')}</h3>
      <div className="space-y-2">
        {professions.map((prof, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-space-gray border border-space-border">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, ${i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32'}30, transparent)`,
                color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32',
              }}
            >
              #{i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {lang === 'en' ? prof.titleEn : prof.titleRu}
              </p>
              <p className="text-xs text-cosmic-silver truncate">
                {lang === 'en' ? prof.descEn : prof.descRu}
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold" style={{ color: prof.score >= 70 ? '#22C55E' : prof.score >= 40 ? '#FBBF24' : '#A0AAB8' }}>
                {prof.score}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
