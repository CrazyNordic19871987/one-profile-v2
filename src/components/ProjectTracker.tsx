import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { t, getDirectionName, getDirectionIcon } from '../lib/i18n'
import type { Project } from '../types/database'
import { DIRECTIONS } from '../lib/engine'

interface ProjectTrackerProps {
  studentId: string
  onProjectComplete?: () => void
}

export function ProjectTracker({ studentId, onProjectComplete }: ProjectTrackerProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    direction: 'it' as Project['direction'],
  })

  useEffect(() => {
    fetchProjects()
  }, [studentId])

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })

    setProjects(data || [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const { error } = await supabase
      .from('projects')
      .insert({
        student_id: studentId,
        title: formData.title,
        description: formData.description,
        direction: formData.direction,
        status: 'in_progress',
        milestone: 0,
        xp_earned: 0,
      })

    if (!error) {
      setShowForm(false)
      setFormData({ title: '', description: '', direction: 'it' })
      fetchProjects()
    }
  }

  async function completeMilestone(projectId: string, currentMilestone: number) {
    const newMilestone = currentMilestone + 1
    const xpEarned = newMilestone * 50

    const { error } = await supabase
      .from('projects')
      .update({
        milestone: newMilestone,
        xp_earned: xpEarned,
        status: newMilestone >= 5 ? 'completed' : 'in_progress',
        completed_at: newMilestone >= 5 ? new Date().toISOString() : null,
      })
      .eq('id', projectId)

    if (!error) {
      fetchProjects()
      if (newMilestone >= 5) {
        onProjectComplete?.()
      }
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'text-status-success'
      case 'in_progress': return 'text-plasma-cyan'
      default: return 'text-cosmic-silver'
    }
  }

  function getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return '✅'
      case 'in_progress': return '🔄'
      default: return '📋'
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
        <h2 className="text-xl font-bold">📊 {t('projectTracker')}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 bg-plasma-cyan text-space-deep rounded text-sm font-bold hover:bg-plasma-blue transition-colors"
        >
          {showForm ? t('cancel') : t('projectNew')}
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-space-nebula rounded-lg p-3 border border-space-border text-center">
          <div className="text-2xl font-mono text-plasma-cyan">
            {projects.filter(p => p.status === 'in_progress').length}
          </div>
          <div className="text-xs text-cosmic-silver">{t('projectActive')}</div>
        </div>
        <div className="bg-space-nebula rounded-lg p-3 border border-space-border text-center">
          <div className="text-2xl font-mono text-status-success">
            {projects.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-xs text-cosmic-silver">{t('projectCompleted')}</div>
        </div>
        <div className="bg-space-nebula rounded-lg p-3 border border-space-border text-center">
          <div className="text-2xl font-mono text-status-warning">
            {projects.reduce((sum, p) => sum + p.xp_earned, 0)}
          </div>
          <div className="text-xs text-cosmic-silver">{t('projectTotalXp')}</div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-space-nebula rounded-lg p-4 border border-space-border">
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">{t('projectTitle')}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('projectTitlePlaceholder')}
                className="w-full px-3 py-2 bg-space-gray rounded border border-space-border focus:border-plasma-cyan focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">{t('projectDescription')}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('projectDescPlaceholder')}
                className="w-full px-3 py-2 bg-space-gray rounded border border-space-border focus:border-plasma-cyan focus:outline-none h-20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Direction</label>
              <select
                value={formData.direction}
                onChange={(e) => setFormData({ ...formData, direction: e.target.value as Project['direction'] })}
                className="w-full px-3 py-2 bg-space-gray rounded border border-space-border focus:border-plasma-cyan focus:outline-none"
              >
                {DIRECTIONS.map((dir) => (
                  <option key={dir.id} value={dir.id}>
                    {dir.icon} {dir.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-status-success text-space-deep rounded font-bold hover:opacity-90 transition-opacity"
            >
              {t('projectCreate')}
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-space-nebula rounded-lg p-4 border border-space-border"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>{getDirectionIcon(project.direction)}</span>
                  <span className="text-sm text-cosmic-silver">
                    {getDirectionName(project.direction)}
                  </span>
                  <span className={getStatusColor(project.status)}>
                    {getStatusIcon(project.status)}
                  </span>
                </div>
                <h3 className="font-bold">{project.title}</h3>
                {project.description && (
                  <p className="text-sm text-cosmic-silver mt-1">{project.description}</p>
                )}
              </div>
            </div>

            {/* Milestone Progress */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{t('projectMilestones')}</span>
                <span className="font-mono text-plasma-cyan">{project.milestone}/5</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded ${
                      i < project.milestone
                        ? 'bg-status-success'
                        : 'bg-space-gray'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="font-mono text-sm text-status-success">
                +{project.xp_earned} XP
              </div>

              {project.status === 'in_progress' && project.milestone < 5 && (
                <button
                  onClick={() => completeMilestone(project.id, project.milestone)}
                  className="px-3 py-1 bg-plasma-cyan text-space-deep rounded text-sm font-bold hover:bg-plasma-blue transition-colors"
                >
                  {t('projectMilestone')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
