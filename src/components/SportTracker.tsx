import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { t } from '../lib/i18n'
import type { SportStat } from '../types/database'

interface SportTrackerProps {
  studentId: string
  onStatAdded?: () => void
}

export function SportTracker({ studentId, onStatAdded }: SportTrackerProps) {
  const [stats, setStats] = useState<SportStat[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    activity: '',
    duration_minutes: 30,
    intensity: 'medium' as 'low' | 'medium' | 'high',
  })

  useEffect(() => {
    fetchStats()
  }, [studentId])

  async function fetchStats() {
    const { data } = await supabase
      .from('sport_stats')
      .select('*')
      .eq('student_id', studentId)
      .order('recorded_at', { ascending: false })
      .limit(10)

    setStats(data || [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const xpMultiplier = formData.intensity === 'high' ? 15 : formData.intensity === 'medium' ? 10 : 5
    const xpEarned = Math.round((formData.duration_minutes / 10) * xpMultiplier)

    const { error } = await supabase
      .from('sport_stats')
      .insert({
        student_id: studentId,
        activity: formData.activity,
        duration_minutes: formData.duration_minutes,
        intensity: formData.intensity,
        xp_earned: xpEarned,
        recorded_at: new Date().toISOString(),
      })

    if (!error) {
      setShowForm(false)
      setFormData({ activity: '', duration_minutes: 30, intensity: 'medium' })
      fetchStats()
      onStatAdded?.()
    }
  }

  function getTotalXp(): number {
    return stats.reduce((sum, s) => sum + s.xp_earned, 0)
  }

  function getTotalMinutes(): number {
    return stats.reduce((sum, s) => sum + s.duration_minutes, 0)
  }

  function getIntensityIcon(intensity: string): string {
    switch (intensity) {
      case 'high': return '🔥'
      case 'medium': return '⚡'
      default: return '🌊'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="skeleton">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🏃 {t('sportTracker')}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-accent px-3 py-1 rounded text-sm font-bold"
        >
          {showForm ? t('cancel') : t('sportAddSession')}
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3 text-center" style={{ background: 'var(--color-navy-light)', border: '1px solid var(--color-border)' }}>
          <div className="text-2xl font-mono" style={{ color: 'var(--color-status-success)' }}>{getTotalXp()}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{t('sportTotalXp')}</div>
        </div>
        <div className="rounded-lg p-3 text-center" style={{ background: 'var(--color-navy-light)', border: '1px solid var(--color-border)' }}>
          <div className="text-2xl font-mono" style={{ color: 'var(--color-accent)' }}>{getTotalMinutes()}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{t('sportTotalMinutes')}</div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg p-4" style={{ background: 'var(--color-navy-light)', border: '1px solid var(--color-border)' }}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">{t('sportActivity')}</label>
              <input
                type="text"
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                placeholder={t('sportPlaceholder')}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">{t('sportDuration')}</label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                min="1"
                max="180"
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">{t('sportIntensity')}</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, intensity: level })}
                    className={`flex-1 py-2 rounded border ${
                      formData.intensity === level
                        ? 'btn-accent'
                        : 'text-sm border-transparent hover:border-transparent'
                    }`}
                    style={formData.intensity !== level ? {
                      background: 'var(--color-glass-b)',
                      color: 'var(--color-muted)',
                      borderColor: 'var(--color-border)',
                    } : undefined}
                  >
                    {getIntensityIcon(level)} {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-sm" style={{ color: 'var(--color-muted)' }}>
              {t('sportEstimatedXp')} +{Math.round((formData.duration_minutes / 10) * (formData.intensity === 'high' ? 15 : formData.intensity === 'medium' ? 10 : 5))}
            </div>

            <button
              type="submit"
              className="btn-accent w-full py-2 rounded font-bold"
            >
              {t('sportSave')}
            </button>
          </div>
        </form>
      )}

      {/* Recent Stats */}
      <div className="space-y-2">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-lg p-3"
            style={{ background: 'var(--color-navy-light)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{stat.activity}</div>
                <div className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  {stat.duration_minutes} min • {getIntensityIcon(stat.intensity)} {stat.intensity}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono" style={{ color: 'var(--color-status-success)' }}>+{stat.xp_earned} XP</div>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  {new Date(stat.recorded_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
