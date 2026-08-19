import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { t } from '../lib/i18n'
import { TRACK_NAMES } from '../lib/skills-report-config'
import type { Student, Observation } from '../types/database'

interface ObservationLogProps {
  students: Student[]
  counselorId: string
}

const TRACKS = Object.keys(TRACK_NAMES)
const DAYS = Array.from({ length: 10 }, (_, i) => i + 1)

export function ObservationLog({ students, counselorId }: ObservationLogProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [day, setDay] = useState(1)
  const [track, setTrack] = useState('bio')
  const [independence, setIndependence] = useState(3)
  const [quality, setQuality] = useState(3)
  const [initiative, setInitiative] = useState(false)
  const [notes, setNotes] = useState('')
  const [observations, setObservations] = useState<Observation[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [lang, setLang] = useState<'ru' | 'en'>('ru')

  useEffect(() => {
    const loc = localStorage.getItem('one-profile-locale')
    if (loc === 'en' || loc === 'ru') setLang(loc)
  }, [])

  useEffect(() => {
    if (selectedStudent) loadObservations()
  }, [selectedStudent])

  async function loadObservations() {
    if (!selectedStudent) return
    const { data } = await supabase
      .from('observations')
      .select('*')
      .eq('student_id', selectedStudent)
      .order('day', { ascending: true })
      .order('created_at', { ascending: false })
    setObservations(data || [])
  }

  async function handleSave() {
    if (!selectedStudent || saving) return
    setSaving(true)

    const { error } = await supabase.from('observations').insert({
      student_id: selectedStudent,
      day,
      track,
      independence,
      quality,
      initiative,
      notes: notes.trim() || null,
      counselor_id: counselorId,
    })

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      setIndependence(3)
      setQuality(3)
      setInitiative(false)
      setNotes('')
      loadObservations()
    }
    setSaving(false)
  }

  const obsCount = observations.length
  const avgScore = obsCount > 0
    ? (observations.reduce((sum, o) => sum + (o.independence + o.quality) / 2, 0) / obsCount).toFixed(1)
    : '—'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📝 {t('obsTitle')}</h2>
        <span className="text-sm" style={{ color: 'var(--color-muted)' }}>{obsCount} {t('obsCount').toLowerCase()} · avg {avgScore}</span>
      </div>

      {/* Student selector */}
      <select
        value={selectedStudent}
        onChange={e => setSelectedStudent(e.target.value)}
        className="input w-full px-3 py-2.5 rounded-lg text-sm"
      >
        <option value="">{t('obsSelectStudent')}</option>
        {students.map(s => (
          <option key={s.id} value={s.id}>{s.emoji || '🦊'} {s.nickname}</option>
        ))}
      </select>

      {selectedStudent && (
        <div className="gc p-4 space-y-4">
          {/* Day selector */}
          <div>
            <label className="block text-xs font-bold mb-2" style={{ color: 'var(--color-accent)' }}>{t('obsSelectDay')}</label>
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map(d => (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                    day === d
                      ? 'pill active'
                      : 'pill'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Track selector */}
          <div>
            <label className="block text-xs font-bold mb-2" style={{ color: 'var(--color-accent)' }}>{t('obsSelectTrack')}</label>
            <div className="flex flex-wrap gap-1.5">
              {TRACKS.map(tr => (
                <button
                  key={tr}
                  onClick={() => setTrack(tr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    track === tr
                      ? 'pill active'
                      : 'pill'
                  }`}
                >
                  {TRACK_NAMES[tr]?.icon} {lang === 'en' ? TRACK_NAMES[tr]?.en : TRACK_NAMES[tr]?.ru}
                </button>
              ))}
            </div>
          </div>

          {/* Star ratings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-2">{t('obsIndependence')}</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => setIndependence(s)}
                    className={`text-xl transition-all ${s <= independence ? 'opacity-100' : 'opacity-30'}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold mb-2">{t('obsQuality')}</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => setQuality(s)}
                    className={`text-xl transition-all ${s <= quality ? 'opacity-100' : 'opacity-30'}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Initiative toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setInitiative(!initiative)}
              className={`relative w-12 h-6 rounded-full transition-all ${initiative ? 'bg-status-success' : ''}`}
              style={!initiative ? { background: 'var(--color-navy-dark)', border: '1px solid var(--color-border)' } : undefined}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${initiative ? 'left-6' : 'left-0.5'}`} />
            </button>
            <span className="text-sm">🚀 {t('obsInitiative')}</span>
          </div>

          {/* Notes */}
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={t('obsNotes')}
            className="input w-full px-3 py-2 rounded-lg text-sm h-20 resize-none"
          />

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${saved ? 'bg-status-success text-space-deep' : ''}`}
            style={!saved ? { background: 'var(--color-accent)', color: '#0A0E1A' } : undefined}
          >
            {saved ? `✅ ${t('obsSaved')}` : saving ? '...' : `💾 ${t('obsSave')}`}
          </button>
        </div>
      )}

      {/* History */}
      {selectedStudent && observations.length > 0 && (
        <div className="gc p-4">
          <h3 className="text-sm font-bold mb-3">{t('obsHistory')}</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {observations.map(obs => (
              <div key={obs.id} className="flex items-center gap-3 p-2 rounded" style={{ background: 'var(--color-navy-dark)', border: '1px solid var(--color-border)' }}>
                <span className="text-sm font-bold" style={{ color: 'var(--color-accent)', minWidth: '50px' }}>
                  {t('obsDay')} {obs.day}
                </span>
                <span className="text-xs">
                  {TRACK_NAMES[obs.track]?.icon} {lang === 'en' ? TRACK_NAMES[obs.track]?.en : TRACK_NAMES[obs.track]?.ru}
                </span>
                <span className="text-xs">⭐{obs.independence}/{obs.quality}</span>
                {obs.initiative && <span className="text-xs">🚀</span>}
                <span className="text-xs ml-auto" style={{ color: 'var(--color-muted)' }}>{new Date(obs.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}