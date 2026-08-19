import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { t } from '../lib/i18n'
import type { Student, CampShift, CampSquad, CampShiftMember, CampSquadMember } from '../types/database'

interface ShiftManagerProps {
  students: Student[]
}

export function ShiftManager({ students }: ShiftManagerProps) {
  const [shifts, setShifts] = useState<CampShift[]>([])
  const [squads, setSquads] = useState<CampSquad[]>([])
  const [shiftMembers, setShiftMembers] = useState<CampShiftMember[]>([])
  const [squadMembers, setSquadMembers] = useState<CampSquadMember[]>([])
  const [selectedShift, setSelectedShift] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateShift, setShowCreateShift] = useState(false)
  const [newShiftName, setNewShiftName] = useState('')
  const [showCreateSquad, setShowCreateSquad] = useState(false)
  const [newSquadName, setNewSquadName] = useState('')
  const [assigningToShift, setAssigningToShift] = useState<string | null>(null)
  const [assigningToSquad, setAssigningToSquad] = useState<string | null>(null)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [shiftsRes, squadsRes, smRes, sqmRes] = await Promise.all([
      supabase.from('camp_shifts').select('*').order('created_at', { ascending: true }),
      supabase.from('camp_squads').select('*'),
      supabase.from('camp_shift_members').select('*'),
      supabase.from('camp_squad_members').select('*'),
    ])
    setShifts(shiftsRes.data || [])
    setSquads(squadsRes.data || [])
    setShiftMembers(smRes.data || [])
    setSquadMembers(sqmRes.data || [])
    setLoading(false)
  }

  async function createShift() {
    if (!newShiftName.trim()) return
    await supabase.from('camp_shifts').insert({ name: newShiftName.trim() })
    setNewShiftName('')
    setShowCreateShift(false)
    loadAll()
  }

  async function deleteShift(id: string) {
    await supabase.from('camp_shifts').delete().eq('id', id)
    if (selectedShift === id) setSelectedShift(null)
    loadAll()
  }

  async function createSquad(shiftId: string) {
    if (!newSquadName.trim()) return
    await supabase.from('camp_squads').insert({ name: newSquadName.trim(), shift_id: shiftId })
    setNewSquadName('')
    setShowCreateSquad(false)
    loadAll()
  }

  async function deleteSquad(id: string) {
    await supabase.from('camp_squads').delete().eq('id', id)
    loadAll()
  }

  async function assignStudentToShift(studentId: string, shiftId: string) {
    await supabase.from('camp_shift_members').insert({ student_id: studentId, shift_id: shiftId })
    setAssigningToShift(null)
    loadAll()
  }

  async function removeFromShift(studentId: string, shiftId: string) {
    await supabase.from('camp_shift_members').delete().eq('student_id', studentId).eq('shift_id', shiftId)
    loadAll()
  }

  async function assignStudentToSquad(studentId: string, squadId: string) {
    await supabase.from('camp_squad_members').insert({ student_id: studentId, squad_id: squadId })
    setAssigningToSquad(null)
    loadAll()
  }

  async function removeFromSquad(studentId: string, squadId: string) {
    await supabase.from('camp_squad_members').delete().eq('student_id', studentId).eq('squad_id', squadId)
    loadAll()
  }

  function getShiftStudents(shiftId: string) {
    const memberIds = shiftMembers.filter(m => m.shift_id === shiftId).map(m => m.student_id)
    return students.filter(s => memberIds.includes(s.id))
  }

  function getSquadStudents(squadId: string) {
    const memberIds = squadMembers.filter(m => m.squad_id === squadId).map(m => m.student_id)
    return students.filter(s => memberIds.includes(s.id))
  }

  function getUnassignedStudents(shiftId: string) {
    const assignedIds = shiftMembers.filter(m => m.shift_id === shiftId).map(m => m.student_id)
    return students.filter(s => !assignedIds.includes(s.id))
  }

  function getShiftSquads(shiftId: string) {
    return squads.filter(s => s.shift_id === shiftId)
  }

  if (loading) return <div className="p-4 text-center" style={{ color: 'var(--color-muted)' }}>{t('loading')}</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🏕️ {t('shiftManagerTitle')}</h2>
        <button
          onClick={() => setShowCreateShift(true)}
          className="btn-accent px-3 py-1.5 rounded-lg text-sm font-bold"
        >
          + {t('shiftCreate')}
        </button>
      </div>

      {showCreateShift && (
        <div className="gc p-4 flex gap-2">
          <input
            value={newShiftName}
            onChange={e => setNewShiftName(e.target.value)}
            placeholder={t('shiftName')}
            className="input flex-1 px-3 py-2 rounded-lg text-sm"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && createShift()}
          />
          <button onClick={createShift} className="btn-accent px-4 py-2 rounded-lg text-sm font-bold">{t('save')}</button>
          <button onClick={() => { setShowCreateShift(false); setNewShiftName('') }} className="px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--color-muted)' }}>{t('cancel')}</button>
        </div>
      )}

      {shifts.length === 0 && (
        <div className="gc p-8 text-center" style={{ color: 'var(--color-muted)' }}>{t('shiftEmpty')}</div>
      )}

      {shifts.map(shift => {
        const shiftStudents = getShiftStudents(shift.id)
        const shiftSquads = getShiftSquads(shift.id)
        const unassigned = getUnassignedStudents(shift.id)
        const isSelected = selectedShift === shift.id

        return (
          <div key={shift.id} className="gc overflow-hidden">
            <div
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => setSelectedShift(isSelected ? null : shift.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🏕️</span>
                <div>
                  <h3 className="font-bold text-sm">{shift.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{shiftStudents.length} {t('shiftStudents').toLowerCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">{isSelected ? '▲' : '▼'}</span>
                <button
                  onClick={e => { e.stopPropagation(); deleteShift(shift.id) }}
                  className="text-xs text-status-error hover:opacity-80 px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            </div>

            {isSelected && (
              <div className="p-4 space-y-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                {/* Assign students */}
                <div>
                  <button
                    onClick={() => setAssigningToShift(assigningToShift === shift.id ? null : shift.id)}
                    className="text-xs font-bold"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    + {t('shiftAssignStudent')}
                  </button>
                  {assigningToShift === shift.id && (
                    <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                      {unassigned.length === 0 && <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{t('shiftNoStudents')}</p>}
                      {unassigned.map(s => (
                        <button
                          key={s.id}
                          onClick={() => assignStudentToShift(s.id, shift.id)}
                          className="w-full text-left px-3 py-1.5 rounded text-xs transition flex items-center gap-2"
                          style={{ ':hover': { background: 'var(--color-navy-dark)' } } as any}
                        >
                          <span>{s.emoji || '🦊'}</span>
                          <span className="text-white">{s.nickname}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assigned students list */}
                <div className="flex flex-wrap gap-1.5">
                  {shiftStudents.map(s => (
                    <span key={s.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ background: 'var(--color-navy-dark)', border: '1px solid var(--color-border)' }}>
                      <span>{s.emoji || '🦊'}</span>
                      <span className="text-white">{s.nickname}</span>
                      <button onClick={() => removeFromShift(s.id, shift.id)} className="hover:text-status-error ml-1" style={{ color: 'var(--color-muted)' }}>×</button>
                    </span>
                  ))}
                </div>

                {/* Squads */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold">{t('shiftSquads')}</h4>
                    <button
                      onClick={() => setShowCreateSquad(true)}
                      className="text-xs font-bold"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      + {t('shiftSquadCreate')}
                    </button>
                  </div>

                  {showCreateSquad && (
                    <div className="flex gap-2 mb-2">
                      <input
                        value={newSquadName}
                        onChange={e => setNewSquadName(e.target.value)}
                        placeholder={t('shiftSquadName')}
                        className="input flex-1 px-3 py-1.5 rounded text-xs"
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && createSquad(shift.id)}
                      />
                      <button onClick={() => createSquad(shift.id)} className="btn-accent px-3 py-1.5 rounded text-xs font-bold">{t('save')}</button>
                      <button onClick={() => { setShowCreateSquad(false); setNewSquadName('') }} className="px-2 py-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>{t('cancel')}</button>
                    </div>
                  )}

                  {shiftSquads.map(sq => {
                    const sqStudents = getSquadStudents(sq.id)

                    return (
                      <div key={sq.id} className="rounded-lg p-3 mb-2" style={{ background: 'var(--color-navy-dark)', border: '1px solid var(--color-border)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold">⚔️ {sq.name}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setAssigningToSquad(assigningToSquad === sq.id ? null : sq.id)}
                              className="text-xs"
                              style={{ color: 'var(--color-accent)' }}
                            >
                              + {t('shiftAssignStudent')}
                            </button>
                            <button onClick={() => deleteSquad(sq.id)} className="text-xs text-status-error">✕</button>
                          </div>
                        </div>

                        {assigningToSquad === sq.id && (
                          <div className="mb-2 max-h-32 overflow-y-auto space-y-1">
                            {shiftStudents.filter(s => !sqStudents.some(x => x.id === s.id)).map(s => (
                              <button
                                key={s.id}
                                onClick={() => assignStudentToSquad(s.id, sq.id)}
                                className="w-full text-left px-2 py-1 rounded text-xs transition flex items-center gap-1"
                              >
                                <span>{s.emoji || '🦊'}</span>
                                <span className="text-white">{s.nickname}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {sqStudents.map(s => (
                            <span key={s.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: 'var(--color-navy-light)', border: '1px solid var(--color-border)' }}>
                              <span>{s.emoji || '🦊'}</span>
                              <span className="text-white">{s.nickname}</span>
                              <button onClick={() => removeFromSquad(s.id, sq.id)} className="hover:text-status-error ml-1" style={{ color: 'var(--color-muted)' }}>×</button>
                            </span>
                          ))}
                          {sqStudents.length === 0 && <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{t('shiftNoStudents')}</span>}
                        </div>
                      </div>
                    )
                  })}

                  {shiftSquads.length === 0 && (
                    <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{t('shiftEmpty')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}