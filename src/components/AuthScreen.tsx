import { useState } from 'react'
import { t, getLocale } from '../lib/i18n'
import { signIn, signUp } from '../lib/auth'

interface AuthScreenProps {
  onAuth: () => void
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const lang = getLocale()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (mode === 'signup') {
      if (!name.trim()) {
        setError(lang === 'ru' ? 'Введите имя' : 'Enter your name')
        setLoading(false)
        return
      }
      const result = await signUp(email, password, name)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(lang === 'ru'
          ? 'Аккаунт создан! Проверьте почту для подтверждения.'
          : 'Account created! Check your email to confirm.')
        setTimeout(() => onAuth(), 1500)
      }
    } else {
      const result = await signIn(email, password)
      if (result.error) {
        setError(result.error)
      } else {
        onAuth()
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-space-deep text-star-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-3xl font-bold font-mono neon-text-cyan tracking-wider">{t('appName')}</h1>
          <p className="text-cosmic-silver mt-2">
            {lang === 'ru' ? 'Космическое путешествие начинается' : 'Your space journey begins'}
          </p>
        </div>

        <div className="neon-card p-6 scanlines">
          <div className="flex mb-6 rounded-lg overflow-hidden" style={{ background: 'rgba(30, 37, 56, 0.8)' }}>
            <button
              onClick={() => { setMode('login'); setError(null); setSuccess(null) }}
              className={`flex-1 py-2.5 text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'text-space-deep'
                  : 'text-cosmic-silver hover:text-star-white'
              }`}
              style={mode === 'login' ? {
                background: 'linear-gradient(135deg, #00D4FF, #4A90D9)',
                boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)',
              } : {}}
            >
              {lang === 'ru' ? 'Вход' : 'Login'}
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); setSuccess(null) }}
              className={`flex-1 py-2.5 text-sm font-bold transition-all ${
                mode === 'signup'
                  ? 'text-space-deep'
                  : 'text-cosmic-silver hover:text-star-white'
              }`}
              style={mode === 'signup' ? {
                background: 'linear-gradient(135deg, #00D4FF, #4A90D9)',
                boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)',
              } : {}}
            >
              {lang === 'ru' ? 'Регистрация' : 'Sign Up'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs text-cosmic-silver mb-1.5 font-mono">
                  {lang === 'ru' ? 'Имя космонавта' : 'Astronaut name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'ru' ? 'Ваше имя...' : 'Your name...'}
                  className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all outline-none"
                  style={{
                    background: 'rgba(30, 37, 56, 0.8)',
                    border: '1px solid #2E3548',
                    color: '#E8F0FE',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00D4FF'
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.2)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#2E3548'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-cosmic-silver mb-1.5 font-mono">
                {lang === 'ru' ? 'Email' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === 'ru' ? 'cosmonaut@space.com' : 'astronaut@space.com'}
                required
                className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all outline-none"
                style={{
                  background: 'rgba(30, 37, 56, 0.8)',
                  border: '1px solid #2E3548',
                  color: '#E8F0FE',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00D4FF'
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.2)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#2E3548'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label className="block text-xs text-cosmic-silver mb-1.5 font-mono">
                {lang === 'ru' ? 'Пароль' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={lang === 'ru' ? 'Минимум 6 символов' : 'Minimum 6 characters'}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all outline-none"
                style={{
                  background: 'rgba(30, 37, 56, 0.8)',
                  border: '1px solid #2E3548',
                  color: '#E8F0FE',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00D4FF'
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.2)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#2E3548'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg text-sm" style={{
                background: 'rgba(255, 82, 82, 0.1)',
                border: '1px solid rgba(255, 82, 82, 0.3)',
                color: '#FF5252',
              }}>
                {error}
              </div>
            )}

            {success && (
              <div className="px-3 py-2 rounded-lg text-sm" style={{
                background: 'rgba(0, 230, 118, 0.1)',
                border: '1px solid rgba(0, 230, 118, 0.3)',
                color: '#00E676',
              }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm transition-all duration-300 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #B24BF3)',
                color: '#0A0E1A',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.5)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {loading
                ? (lang === 'ru' ? 'Загрузка...' : 'Loading...')
                : mode === 'login'
                  ? (lang === 'ru' ? 'Войти' : 'Sign In')
                  : (lang === 'ru' ? 'Создать аккаунт' : 'Create Account')
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-cosmic-silver mt-6">
          {lang === 'ru'
            ? 'ONE! Profile v2 — Геймификация обучения'
            : 'ONE! Profile v2 — Gamified Learning'}
        </p>
      </div>
    </div>
  )
}
