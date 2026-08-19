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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-navy)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-3xl font-bold font-mono tracking-wider" style={{ color: 'var(--color-accent)' }}>{t('appName')}</h1>
          <p className="mt-2" style={{ color: 'var(--color-muted)' }}>
            {lang === 'ru' ? 'Космическое путешествие начинается' : 'Your space journey begins'}
          </p>
        </div>

        <div className="gc p-6">
          <div className="flex mb-6 rounded-lg overflow-hidden">
            <button
              onClick={() => { setMode('login'); setError(null); setSuccess(null) }}
              className={mode === 'login' ? 'pill active flex-1' : 'pill flex-1'}
            >
              {lang === 'ru' ? 'Вход' : 'Login'}
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); setSuccess(null) }}
              className={mode === 'signup' ? 'pill active flex-1' : 'pill flex-1'}
            >
              {lang === 'ru' ? 'Регистрация' : 'Sign Up'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs mb-1.5 font-mono" style={{ color: 'var(--color-muted)' }}>
                  {lang === 'ru' ? 'Имя космонавта' : 'Astronaut name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'ru' ? 'Ваше имя...' : 'Your name...'}
                  className="input w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-xs mb-1.5 font-mono" style={{ color: 'var(--color-muted)' }}>
                {lang === 'ru' ? 'Email' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === 'ru' ? 'cosmonaut@space.com' : 'astronaut@space.com'}
                required
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-xs mb-1.5 font-mono" style={{ color: 'var(--color-muted)' }}>
                {lang === 'ru' ? 'Пароль' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={lang === 'ru' ? 'Минимум 6 символов' : 'Minimum 6 characters'}
                required
                minLength={6}
                className="input w-full"
              />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg text-sm" style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--color-status-error)',
              }}>
                {error}
              </div>
            )}

            {success && (
              <div className="px-3 py-2 rounded-lg text-sm" style={{
                background: 'rgba(34, 211, 166, 0.1)',
                border: '1px solid rgba(34, 211, 166, 0.3)',
                color: 'var(--color-status-success)',
              }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-accent disabled:opacity-50"
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

        <p className="text-center text-xs mt-6" style={{ color: 'var(--color-muted)' }}>
          {lang === 'ru'
            ? 'ONE! Profile v2 — Геймификация обучения'
            : 'ONE! Profile v2 — Gamified Learning'}
        </p>
      </div>
    </div>
  )
}
