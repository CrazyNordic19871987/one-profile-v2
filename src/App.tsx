import { useState, useEffect, useRef } from 'react'
import { t, setLocale, getLocale } from './lib/i18n'
import { levelFromXp, xpInLevel, xpToNextLevel, getShipStage } from './lib/engine'
import { useAppData } from './lib/useAppData'
import { setStudentPerks } from './lib/profile'
import { purchaseShipItem, performPrestige, evaluateBadges } from './lib/currency'
import { computeCompetencyScores, computeDISC, scoreProfessions, getReportLevel } from './lib/skills-report-config'
import { supabase } from './lib/supabase'
import type { Locale } from './lib/i18n'
import type { Observation } from './types/database'

import { AuthScreen } from './components/AuthScreen'
import { ShipVisual } from './components/ShipVisual'
import { SkillRadar } from './components/SkillRadar'
import { MissionSystem } from './components/MissionSystem'
import { BadgeSystem } from './components/BadgeSystem'
import { CareerTest } from './components/CareerTest'
import { GMGradingWorkflow } from './components/GMGradingWorkflow'
import { DailyBonus } from './components/DailyBonus'
import { PerkSystem } from './components/PerkSystem'
import { ShipCustomization } from './components/ShipCustomization'
import { PrestigeSystem } from './components/PrestigeSystem'
import { LeaderboardUI } from './components/LeaderboardUI'
import { ShipEvolutionUI } from './components/ShipEvolutionUI'
import { TutorialSystem } from './components/TutorialSystem'
import { MysteryBox } from './components/MysteryBox'
import { NotificationSystem, useNotifications } from './components/NotificationSystem'
import { ShiftManager } from './components/ShiftManager'
import { ObservationLog } from './components/ObservationLog'
import { StudentReport } from './components/StudentReport'

type Page = 'home' | 'missions' | 'badges' | 'report' | 'ship' | 'staff'

interface NavItem {
  id: Page
  icon: string
  labelRu: string
  labelEn: string
  adminOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', icon: '🏠', labelRu: 'Главная', labelEn: 'Home' },
  { id: 'missions', icon: '📋', labelRu: 'Задания', labelEn: 'Missions' },
  { id: 'badges', icon: '🏆', labelRu: 'Достижения', labelEn: 'Badges' },
  { id: 'report', icon: '📊', labelRu: 'Отчёт', labelEn: 'Report' },
  { id: 'ship', icon: '🚀', labelRu: 'Корабль', labelEn: 'Ship' },
  { id: 'staff', icon: '🎮', labelRu: 'Персонал', labelEn: 'Staff', adminOnly: true },
]

function App() {
  const { user, studentId, student, skills, loading, error, refetch, signOut } = useAppData()
  const { notifications, addNotification, dismissNotification } = useNotifications()
  const [lang, setLang] = useState<Locale>(getLocale())
  const [activePage, setActivePage] = useState<Page>('home')
  const [showCareerTest, setShowCareerTest] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const badgesEvaluatedRef = useRef(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [myObservations, setMyObservations] = useState<Observation[]>([])
  const [allStudents, setAllStudents] = useState<import('./types/database').Student[]>([])

  const totalXp = student?.total_xp || 0
  const level = levelFromXp(totalXp)
  const xpInCurrent = xpInLevel(totalXp)
  const xpNeeded = xpToNextLevel(totalXp)
  const xpProgress = xpNeeded > 0 ? (xpInCurrent / xpNeeded) * 100 : 100
  const shipStage = getShipStage(level)
  const coins = student?.coins || 0
  const gems = student?.gems || 0
  const streak = student?.streak || 0
  const lastBonusDate = student?.last_bonus_date || null
  const prestigeCount = student?.prestige_count || 0
  const currentPerks = student?.perks || []
  const sid = studentId!
  const prevLevelRef = useRef(level)

  // Evaluate badges on load (once per session)
  useEffect(() => {
    if (badgesEvaluatedRef.current || !sid) return
    badgesEvaluatedRef.current = true
    evaluateBadges(sid).then(newBadges => {
      newBadges.forEach(name => addNotification('success', `${lang === 'ru' ? 'Бейдж получен' : 'Badge earned'}: ${name}`))
    }).catch(() => {})
  }, [sid])

  // Auto-tutorial for first-time users
  useEffect(() => {
    if (!student || loading) return
    const hasSeenTutorial = localStorage.getItem('one-profile-tutorial-seen')
    if (!hasSeenTutorial && (student.total_xp || 0) === 0) {
      setShowTutorial(true)
    }
  }, [student, loading])

  // Level-up detection
  useEffect(() => {
    if (prevLevelRef.current < level) {
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 2500)
    }
    prevLevelRef.current = level
  }, [level])

  // Load observations for report
  useEffect(() => {
    if (!sid) return
    supabase.from('observations').select('*').eq('student_id', sid).then(({ data }) => setMyObservations(data || []))
  }, [sid, refetch])

  // Load all students for admin features
  useEffect(() => {
    if (!sid) return
    supabase.from('students').select('*').then(({ data }) => setAllStudents(data || []))
  }, [sid])

  const handleLangChange = (newLang: Locale) => {
    setLang(newLang)
    setLocale(newLang)
  }

  // Auth gate
  if (!loading && !user) {
    return <AuthScreen onAuth={() => refetch()} />
  }

  if (showTutorial) return <TutorialSystem onComplete={() => setShowTutorial(false)} />

  if (showCareerTest) {
    return (
      <div className="h-screen p-4 flex items-center justify-center" style={{ background: 'var(--color-navy)' }}>
        <div className="w-full max-w-md">
          <button onClick={() => setShowCareerTest(false)} className="mb-4 text-sm" style={{ color: 'var(--color-muted)' }}>← Back</button>
          <CareerTest onComplete={(_direction) => { setShowCareerTest(false); setActivePage('report') }} />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: 'var(--color-navy)' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">🚀</div>
          <div className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>{t('loading')} ONE! Profile...</div>
        </div>
      </div>
    )
  }

  if (error || !student || !studentId) {
    return (
      <div className="h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-navy)' }}>
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">{t('error')}</h2>
          <p className="mb-4 font-mono text-xs break-all" style={{ color: 'var(--color-muted)' }}>{error || t('error')}</p>
          <button onClick={refetch} className="btn-accent px-6 py-2 text-sm">{t('retry')}</button>
        </div>
      </div>
    )
  }

  const s = student!

  // Filter nav items by role
  const visibleNav = NAV_ITEMS.filter(item => !item.adminOnly)

  function renderPage() {
    switch (activePage) {
      case 'home': return (
        <div className="space-y-4 page-enter">
          {/* Profile Header */}
          <div className="gc p-5">
            <div className="flex items-center gap-4 mb-4">
              <ShipVisual level={level} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold truncate">{s.nickname}</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{shipStage}</p>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="font-display text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{level}</div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>{t('level')}</div>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-mono" style={{ color: 'var(--color-accent)' }}>{xpInCurrent} XP</span>
                <span className="font-mono" style={{ color: 'var(--color-muted)' }}>{xpNeeded} XP → {t('level')} {level + 1}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${Math.max(xpProgress, 2)}%` }} />
              </div>
            </div>

            {/* Stat Row */}
            <div className="grid grid-cols-4 gap-3">
              <div className="stat-block">
                <div className="stat-value">{coins}</div>
                <div className="stat-label">💰 {t('coinsLabel')}</div>
              </div>
              <div className="stat-block">
                <div className="stat-value">{gems}</div>
                <div className="stat-label">💎 {t('gemsLabel')}</div>
              </div>
              <div className="stat-block">
                <div className="stat-value">{streak}</div>
                <div className="stat-label">🔥 {t('streakLabel')}</div>
              </div>
              <div className="stat-block">
                <div className="stat-value">{myObservations.length}</div>
                <div className="stat-label">📝 {lang === 'ru' ? 'Наблюдения' : 'Observations'}</div>
              </div>
            </div>
          </div>

          {/* Daily Bonus */}
          <DailyBonus studentId={sid} currentStreak={streak} lastBonusDate={lastBonusDate} onBonusClaimed={refetch} />

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setActivePage('missions')} className="gc p-4 text-left">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-bold">{t('navMissions')}</div>
            </button>
            <button onClick={() => setActivePage('badges')} className="gc p-4 text-left">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-sm font-bold">{t('navBadges')}</div>
            </button>
            <button onClick={() => setShowReport(true)} className="gc p-4 text-left">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-bold">{t('reportTitle')}</div>
            </button>
            <button onClick={() => setActivePage('ship')} className="gc p-4 text-left">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm font-bold">{t('navShip')}</div>
            </button>
          </div>

          {/* Skill Radar */}
          <div className="gc p-4 flex justify-center">
            <SkillRadar skills={skills} size={180} />
          </div>

          {/* Mystery Box */}
          <MysteryBox studentId={sid} coins={coins} gems={gems} onOpened={refetch} />
        </div>
      )

      case 'missions': return (
        <div className="page-enter">
          <MissionSystem studentId={sid} onMissionComplete={refetch} />
        </div>
      )

      case 'badges': return (
        <div className="space-y-4 page-enter">
          <BadgeSystem studentId={sid} />
          <LeaderboardUI currentStudentId={sid} />
          <button onClick={() => setShowCareerTest(true)} className="gc p-4 w-full text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧭</span>
              <div>
                <div className="text-sm font-bold">{t('careerTitle')}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{t('careerBasedOn')}</div>
              </div>
            </div>
          </button>
        </div>
      )

      case 'report': return (
        <div className="page-enter">
          <button onClick={() => setShowReport(true)} className="gc p-5 w-full text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ background: 'var(--color-accent-dim)' }}>
                📄
              </div>
              <div>
                <h3 className="font-bold text-lg">{t('reportTitle')}</h3>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  {t('radarTitle')} · {t('discTitle')} · {t('careerPanelTitle')} · AI
                </p>
              </div>
            </div>
          </button>
          <div className="mt-4">
            <SkillRadar skills={skills} size={220} />
          </div>
        </div>
      )

      case 'ship': return (
        <div className="space-y-4 page-enter">
          <ShipEvolutionUI level={level} />
          <ShipCustomization level={level} coins={coins} gems={gems} onPurchase={async (itemId, cost, currency) => { await purchaseShipItem(sid, itemId, cost, currency); refetch() }} />
          <PerkSystem currentPerks={currentPerks} onPerksChange={async (perks) => { await setStudentPerks(sid, perks); refetch() }} />
          {level >= 25 && <PrestigeSystem totalXp={totalXp} prestigeCount={prestigeCount} onPrestige={async () => { await performPrestige(sid); refetch() }} />}
        </div>
      )

      case 'staff': return (
        <div className="space-y-4 page-enter">
          <GMGradingWorkflow gmId={sid} />
          <ShiftManager students={allStudents} />
          <ObservationLog students={allStudents} counselorId={sid} />
        </div>
      )
    }
  }

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--color-navy)', color: 'var(--color-white)' }}>
      <a href="#main-content" className="skip-to-content">
        {lang === 'ru' ? 'Перейти к содержимому' : 'Skip to content'}
      </a>
      <NotificationSystem notifications={notifications} onDismiss={dismissNotification} />

      {/* Report Overlay */}
      {showReport && student && (
        <StudentReport
          student={student}
          observations={myObservations}
          competencyScores={computeCompetencyScores(myObservations)}
          disc={computeDISC(computeCompetencyScores(myObservations))}
          professions={scoreProfessions(computeCompetencyScores(myObservations), myObservations)}
          level={getReportLevel(myObservations.length, 0)}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* Level-Up Celebration */}
      {showLevelUp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none level-up-overlay">
          <div className="text-center">
            <div className="text-7xl mb-4">🎉</div>
            <div className="text-3xl font-bold font-display" style={{ color: 'var(--color-accent)' }}>
              {t('level')} {level}!
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r flex-shrink-0" style={{ background: 'var(--color-navy-dark)', borderColor: 'var(--color-border)' }}>
        {/* Logo */}
        <div className="px-4 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h1 className="text-lg font-bold font-display tracking-wider" style={{ color: 'var(--color-accent)' }}>
            {t('appName')}
          </h1>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: 'var(--color-muted)' }}>{t('level')} {level}</span>
              <span style={{ color: 'var(--color-muted)' }}>{shipStage}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {visibleNav.map((item) => {
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all relative ${
                  isActive ? 'nav-active' : 'hover:bg-white/5'
                }`}
                style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-muted)' }}
              >
                <span className="text-lg w-6 text-center">{item.icon}</span>
                <span className="text-sm font-medium">{lang === 'ru' ? item.labelRu : item.labelEn}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t flex gap-2" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setShowTutorial(true)}
            className="flex-1 py-1.5 rounded text-xs transition-colors"
            style={{ background: 'var(--color-glass)', color: 'var(--color-muted)' }}
          >
            {t('tutorial')}
          </button>
          <button
            onClick={() => signOut()}
            className="flex-1 py-1.5 rounded text-xs transition-colors"
            style={{ background: 'var(--color-glass)', color: 'var(--color-muted)' }}
          >
            {lang === 'ru' ? 'Выйти' : 'Sign Out'}
          </button>
          <button
            onClick={() => handleLangChange('ru')}
            className="px-2 py-1.5 rounded text-xs font-bold transition-all"
            style={{
              background: lang === 'ru' ? 'var(--color-accent)' : 'var(--color-glass)',
              color: lang === 'ru' ? 'var(--color-navy-dark)' : 'var(--color-muted)',
            }}
          >
            RU
          </button>
          <button
            onClick={() => handleLangChange('en')}
            className="px-2 py-1.5 rounded text-xs font-bold transition-all"
            style={{
              background: lang === 'en' ? 'var(--color-accent)' : 'var(--color-glass)',
              color: lang === 'en' ? 'var(--color-navy-dark)' : 'var(--color-muted)',
            }}
          >
            EN
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 border-b" style={{ background: 'var(--color-navy-dark)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-base font-bold font-display tracking-wider" style={{ color: 'var(--color-accent)' }}>
            {t('appName')}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 text-xs" aria-live="polite">
              <span>💰 <span className="font-mono" style={{ color: 'var(--color-accent)' }}>{coins}</span></span>
              <span>💎 <span className="font-mono" style={{ color: 'var(--color-accent)' }}>{gems}</span></span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleLangChange('ru')}
                className="px-1.5 py-0.5 rounded text-xs font-bold"
                style={{
                  background: lang === 'ru' ? 'var(--color-accent)' : 'transparent',
                  color: lang === 'ru' ? 'var(--color-navy-dark)' : 'var(--color-muted)',
                }}
              >
                RU
              </button>
              <button
                onClick={() => handleLangChange('en')}
                className="px-1.5 py-0.5 rounded text-xs font-bold"
                style={{
                  background: lang === 'en' ? 'var(--color-accent)' : 'transparent',
                  color: lang === 'en' ? 'var(--color-navy-dark)' : 'var(--color-muted)',
                }}
              >
                EN
              </button>
              <button
                onClick={() => signOut()}
                className="px-2 py-1.5 rounded text-xs"
                style={{ color: 'var(--color-muted)' }}
                aria-label={lang === 'ru' ? 'Выйти' : 'Sign Out'}
              >
                ⏻
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="main-content" className="flex-1 overflow-y-auto md:pt-0 pt-[52px] pb-20 md:pb-0" tabIndex={-1}>
        <div className="p-4 lg:p-6 max-w-3xl mx-auto">
          {renderPage()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t" style={{ background: 'var(--color-navy-dark)', borderColor: 'var(--color-border)' }}>
        <div className="flex">
          {visibleNav.map((item) => {
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className="flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2.5 flex-1 min-w-0 transition-all relative"
                style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-muted)' }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[10px] leading-tight truncate">{lang === 'ru' ? item.labelRu : item.labelEn}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ background: 'var(--color-accent)' }} />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default App
