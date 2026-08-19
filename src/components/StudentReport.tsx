import { t, getLocale } from '../lib/i18n'
import { CompetencyRadar } from './CompetencyRadar'
import { DISCProfile } from './DISCProfile'
import { CareerPanel } from './CareerPanel'
import { AIMentor } from './AIMentor'
import { TRACK_NAMES } from '../lib/skills-report-config'
import type { Student, Observation } from '../types/database'

interface StudentReportProps {
  student: Student
  observations: Observation[]
  competencyScores: Record<string, number>
  disc: { type: string; values: Record<string, number>; combo: string | null }
  professions: Array<{ titleRu: string; titleEn: string; descRu: string; descEn: string; score: number }>
  level: { level: number; nameRu: string; nameEn: string; icon: string; xp: number }
  onClose: () => void
}

export function StudentReport({ student, observations, competencyScores, disc, professions, level, onClose }: StudentReportProps) {
  const lang = getLocale()

  function handlePrint() {
    window.print()
  }

  const obsCount = observations.length
  const avgScore = obsCount > 0
    ? (observations.reduce((sum, o) => sum + (o.independence + o.quality) / 2, 0) / obsCount).toFixed(1)
    : '—'
  const engagement = obsCount > 0 ? Math.round((obsCount / 40) * 100) : 0

  return (
    <>
      <style>{`
        @media print {
          body > *:not(.report-overlay) { display: none !important; }
          .report-overlay { position: static !important; background: white !important; }
          .report-content { background: white !important; color: #1a1a1a !important; max-width: 900px !important; margin: 0 auto !important; }
          .report-content * { color: #1a1a1a !important; background: transparent !important; border-color: #ddd !important; }
          .report-toolbar { display: none !important; }
          .no-print { display: none !important; }
          .rp-section { break-inside: avoid; }
        }
      `}</style>

      <div className="report-overlay fixed inset-0 z-[5000] overflow-y-auto" style={{ background: 'rgba(10, 14, 26, 0.95)' }}>
        {/* Toolbar */}
        <div className="report-toolbar sticky top-0 z-10 px-4 py-3 flex items-center justify-between no-print" style={{ background: 'rgba(10, 14, 26, 0.95)', borderBottom: '1px solid rgba(0, 212, 255, 0.2)' }}>
          <h2 className="text-sm font-bold neon-text-cyan">📄 {t('reportTitle')}</h2>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: '#00D4FF', color: '#0A0E1A' }}>
              🖨️ {t('reportPrint')}
            </button>
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-cosmic-silver border border-space-border">
              ✕ {t('cancel')}
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="report-content max-w-[900px] mx-auto p-6 space-y-6">

          {/* Header */}
          <div className="text-center py-6" style={{ borderBottom: '3px solid #00D4FF' }}>
            <h1 className="text-2xl font-bold" style={{ color: '#0A0E1A' }}>ONE! Profile</h1>
            <p className="text-sm" style={{ color: '#666' }}>{t('reportTitle')}</p>
          </div>

          {/* Hero Card */}
          <div className="rp-section flex items-center gap-6 p-6 rounded-xl" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ background: 'linear-gradient(135deg, #00D4FF20, #B24BF320)' }}>
              {student.emoji || '🦊'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold" style={{ color: '#0A0E1A' }}>{student.nickname}</h2>
              <div className="flex gap-3 mt-1">
                <span className="text-sm px-2 py-0.5 rounded-full" style={{ background: '#00D4FF20', color: '#0090FF' }}>
                  {level.icon} {level[lang === 'en' ? 'nameEn' : 'nameRu']}
                </span>
                <span className="text-sm" style={{ color: '#666' }}>
                  ⚡ {level.xp} XP
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: '#00D4FF' }}>Lv.{level.level}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="rp-section grid grid-cols-4 gap-4">
            {[
              { label: t('reportTasks'), value: obsCount, icon: '📋' },
              { label: t('reportBadges'), value: student.coins, icon: '💰' },
              { label: t('obsScore'), value: avgScore, icon: '⭐' },
              { label: t('reportEngagement'), value: `${engagement}%`, icon: '🔥' },
            ].map((stat, i) => (
              <div key={i} className="p-3 rounded-lg text-center" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                <div className="text-lg">{stat.icon}</div>
                <div className="text-xl font-bold" style={{ color: '#0A0E1A' }}>{stat.value}</div>
                <div className="text-xs" style={{ color: '#666' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Radar */}
          <div className="rp-section p-4 rounded-xl" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#0A0E1A' }}>📊 {t('radarTitle')}</h3>
            <div className="flex justify-center">
              <CompetencyRadar scores={competencyScores} size={280} />
            </div>
          </div>

          {/* DISC + Career in 2 columns */}
          <div className="rp-section grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <DISCProfile values={disc.values} dominant={disc.type} combo={disc.combo} />
            </div>
            <div className="p-4 rounded-xl" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <CareerPanel professions={professions} />
            </div>
          </div>

          {/* AI Mentor */}
          <div className="rp-section p-4 rounded-xl" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
            <AIMentor
              studentName={student.nickname}
              competencyScores={competencyScores}
              obsCount={obsCount}
              avgScore={parseFloat(avgScore as string) || 0}
            />
          </div>

          {/* Observation Journal */}
          {observations.length > 0 && (
            <div className="rp-section p-4 rounded-xl" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: '#0A0E1A' }}>📝 {t('reportObservations')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th className="text-left py-2 px-2" style={{ color: '#666' }}>{t('obsDay')}</th>
                      <th className="text-left py-2 px-2" style={{ color: '#666' }}>{t('obsTrack')}</th>
                      <th className="text-center py-2 px-2" style={{ color: '#666' }}>{t('obsIndependence')}</th>
                      <th className="text-center py-2 px-2" style={{ color: '#666' }}>{t('obsQuality')}</th>
                      <th className="text-center py-2 px-2" style={{ color: '#666' }}>🚀</th>
                      <th className="text-left py-2 px-2" style={{ color: '#666' }}>{t('obsNotes')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {observations.map(obs => (
                      <tr key={obs.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td className="py-1.5 px-2 font-bold" style={{ color: '#0A0E1A' }}>{obs.day}</td>
                        <td className="py-1.5 px-2">
                          {TRACK_NAMES[obs.track]?.icon} {lang === 'en' ? TRACK_NAMES[obs.track]?.en : TRACK_NAMES[obs.track]?.ru}
                        </td>
                        <td className="py-1.5 px-2 text-center">⭐{obs.independence}</td>
                        <td className="py-1.5 px-2 text-center">⭐{obs.quality}</td>
                        <td className="py-1.5 px-2 text-center">{obs.initiative ? '✅' : '—'}</td>
                        <td className="py-1.5 px-2 text-xs" style={{ color: '#666' }}>{obs.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-4" style={{ borderTop: '2px solid #e2e8f0' }}>
            <p className="text-xs" style={{ color: '#999' }}>{t('reportFooter')} · {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </>
  )
}
