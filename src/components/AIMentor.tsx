import { useState } from 'react'
import { t } from '../lib/i18n'

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

  const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

  async function generateInsight() {
    if (!OPENAI_KEY) {
      setError('OpenAI API key not configured. Set VITE_OPENAI_API_KEY in .env')
      return
    }
    setLoading(true)
    setError(null)

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

    const prompt = `Analyze this student profile and provide a brief mentor conclusion in Russian (3-4 sentences):
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

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`,
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
        setError('No response from AI')
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

      {!insight && (
        <button
          onClick={generateInsight}
          disabled={loading || obsCount === 0}
          className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${
            obsCount === 0 ? 'opacity-40 cursor-not-allowed' : ''
          }`}
          style={{ background: 'linear-gradient(135deg, #B24BF3, #FF2D78)', color: '#fff' }}
        >
          {loading ? '🔄...' : `✨ ${t('aiGenerate')}`}
        </button>
      )}

      {obsCount === 0 && !loading && (
        <p className="text-xs text-cosmic-silver text-center">{t('aiNoData')}</p>
      )}

      {error && <p className="text-xs text-status-error">{error}</p>}

      {insight && (
        <div className="p-4 rounded-lg neon-card">
          <p className="text-sm leading-relaxed" style={{ color: '#E8F0FE' }}>{insight}</p>
          <button
            onClick={() => { setInsight(null); setError(null) }}
            className="mt-2 text-xs neon-text-cyan"
          >
            {t('aiGenerate')} снова
          </button>
        </div>
      )}
    </div>
  )
}
