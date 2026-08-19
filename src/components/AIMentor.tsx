import { useState } from 'react'
import { t } from '../lib/i18n'

const STORAGE_KEY = 'one-profile-openai-key'

interface AIMentorProps {
  studentName: string
  competencyScores: Record<string, number>
  obsCount: number
  avgScore: number
}

export function AIMentor({ studentName, competencyScores, obsCount, avgScore }: AIMentorProps) {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [keyValue, setKeyValue] = useState(localStorage.getItem(STORAGE_KEY) || '')

  function saveKey() {
    localStorage.setItem(STORAGE_KEY, keyValue.trim())
    setShowKeyInput(false)
  }

  async function generateInsight() {
    const apiKey = keyValue.trim() || localStorage.getItem(STORAGE_KEY) || ''
    if (!apiKey) {
      setShowKeyInput(true)
      return
    }
    setLoading(true)
    setError(null)

    const hasObs = obsCount > 0

    const topSkills = Object.entries(competencyScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, val]) => `${id}: ${val}%`)
      .join(', ')

    const bottomSkills = Object.entries(competencyScores)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map(([id, val]) => `${id}: ${val}%`)
      .join(', ')

    const prompt = hasObs
      ? `Analyze this student profile and provide a brief mentor conclusion in Russian (3-4 sentences):
Student: ${studentName}
Total observations: ${obsCount}
Average score: ${avgScore}/5
Top competencies: ${topSkills}
Weakest areas: ${bottomSkills}

Provide:
1. Key strengths
2. Areas for growth
3. One specific recommendation
Keep it encouraging and constructive. Write in Russian.`
      : `Analyze this student profile and provide a brief mentor conclusion in Russian (3-4 sentences).
Note: no observation data yet, so base your analysis on competency radar data only.

Student: ${studentName}
Competency scores (from radar): ${topSkills}
Lower areas: ${bottomSkills}

Provide:
1. Likely strengths based on available data
2. Areas to watch for development
3. One specific recommendation for the counselor to observe
Keep it encouraging. Write in Russian.`

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
          temperature: 0.7,
        }),
      })

      const data = await res.json()
      if (data.choices?.[0]?.message?.content) {
        setInsight(data.choices[0].message.content)
      } else {
        setError(data.error?.message || 'No response from AI')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold">🤖 {t('aiTitle')}</h3>

      {showKeyInput && (
        <div className="p-3 rounded-lg bg-space-gray border border-space-border space-y-2">
          <p className="text-xs text-cosmic-silver">OpenAI API Key (sk-proj-...)</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={keyValue}
              onChange={e => setKeyValue(e.target.value)}
              placeholder="sk-proj-..."
              className="flex-1 px-3 py-1.5 rounded bg-space-deep border border-space-border text-white text-xs"
            />
            <button onClick={saveKey} className="px-3 py-1.5 rounded text-xs font-bold" style={{ background: '#00D4FF', color: '#0A0E1A' }}>
              {t('save')}
            </button>
            <button onClick={() => setShowKeyInput(false)} className="px-2 py-1.5 text-xs text-cosmic-silver">{t('cancel')}</button>
          </div>
        </div>
      )}

      {!insight && !showKeyInput && (
        <button
          onClick={generateInsight}
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-bold transition-all"
          style={{ background: 'linear-gradient(135deg, #B24BF3, #FF2D78)', color: '#fff', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? '🔄...' : `✨ ${t('aiGenerate')}`}
        </button>
      )}

      {obsCount === 0 && !loading && !showKeyInput && !insight && (
        <p className="text-xs text-cosmic-silver text-center">{t('aiNoData')}</p>
      )}

      {error && <p className="text-xs text-status-error">{error}</p>}

      {insight && (
        <div className="p-4 rounded-lg neon-card">
          <p className="text-sm leading-relaxed" style={{ color: '#E8F0FE' }}>{insight}</p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => { setInsight(null); setError(null) }}
              className="text-xs neon-text-cyan"
            >
              ✨ {t('aiGenerate')} снова
            </button>
            <button
              onClick={() => setShowKeyInput(true)}
              className="text-xs text-cosmic-silver"
            >
              🔑 API Key
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
