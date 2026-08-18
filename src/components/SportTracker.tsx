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
        <div className="text-cosmic-silver">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🏃 Sport Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 bg-plasma-cyan text-space-deep rounded text-sm font-bold hover:bg-plasma-blue transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Session'}
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-space-nebula rounded-lg p-3 border border-space-border text-center">
          <div className="text-2xl font-mono text-status-success">{getTotalXp()}</div>
          <div className="text-xs text-cosmic-silver">Total XP Earned</div>
        </div>
        <div className="bg-space-nebula rounded-lg p-3 border border-space-border text-center">
          <div className="text-2xl font-mono text-plasma-cyan">{getTotalMinutes()}</div>
          <div className="text-xs text-cosmic-silver">Total Minutes</div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-space-nebula rounded-lg p-4 border border-space-border">
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Activity</label>
              <input
                type="text"
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                placeholder="Running, Swimming, Yoga..."
                className="w-full px-3 py-2 bg-space-gray rounded border border-space-border focus:border-plasma-cyan focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                min="1"
                max="180"
                className="w-full px-3 py-2 bg-space-gray rounded border border-space-border focus:border-plasma-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Intensity</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, intensity: level })}
                    className={`flex-1 py-2 rounded border ${
                      formData.intensity === level
                        ? 'bg-plasma-cyan text-space-deep border-plasma-cyan'
                        : 'bg-space-gray text-cosmic-silver border-space-border hover:border-plasma-cyan'
                    }`}
                  >
                    {getIntensityIcon(level)} {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-sm text-cosmic-silver">
              Estimated XP: +{Math.round((formData.duration_minutes / 10) * (formData.intensity === 'high' ? 15 : formData.intensity === 'medium' ? 10 : 5))}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-status-success text-space-deep rounded font-bold hover:opacity-90 transition-opacity"
            >
              Save Session
            </button>
          </div>
        </form>
      )}

      {/* Recent Stats */}
      <div className="space-y-2">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-space-nebula rounded-lg p-3 border border-space-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{stat.activity}</div>
                <div className="text-sm text-cosmic-silver">
                  {stat.duration_minutes} min • {getIntensityIcon(stat.intensity)} {stat.intensity}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-status-success">+{stat.xp_earned} XP</div>
                <div className="text-xs text-cosmic-silver">
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
