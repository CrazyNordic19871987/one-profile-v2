import { useState, useEffect, useRef } from 'react'
import { t, setLocale, getLocale } from './lib/i18n'
import { levelFromXp, xpInLevel, xpToNextLevel, getShipStage } from './lib/engine'
import { useAppData } from './lib/useAppData'
import { setStudentPerks } from './lib/profile'
import { purchaseShipItem, performPrestige, evaluateBadges } from './lib/currency'
import type { Locale } from './lib/i18n'
import type { Direction } from './types/database'

import { AuthScreen } from './components/AuthScreen'
import { ShipVisual } from './components/ShipVisual'
import { SkillRadar } from './components/SkillRadar'
import { MissionSystem } from './components/MissionSystem'
import { SquadSystem } from './components/SquadSystem'
import { SportTracker } from './components/SportTracker'
import { ProjectTracker } from './components/ProjectTracker'
import { DirectionSystem } from './components/DirectionSystem'
import { BadgeSystem } from './components/BadgeSystem'
import { CareerTest } from './components/CareerTest'
import { GMGradingWorkflow } from './components/GMGradingWorkflow'
import { DailyBonus } from './components/DailyBonus'
import { PerkSystem } from './components/PerkSystem'
import { ShipCustomization } from './components/ShipCustomization'
import { PrestigeSystem } from './components/PrestigeSystem'
import { SquadShip } from './components/SquadShip'
import { LeaderboardUI } from './components/LeaderboardUI'
import { ShipEvolutionUI } from './components/ShipEvolutionUI'
import { TutorialSystem } from './components/TutorialSystem'
import { MysteryBox } from './components/MysteryBox'
import { NotificationSystem, useNotifications } from './components/NotificationSystem'

type Tab = 'profile' | 'missions' | 'squad' | 'sport' | 'projects' | 'directions' | 'badges' | 'perks' | 'ship' | 'prestige' | 'gm' | 'more'

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: 'profile', icon: '👤', label: t('navProfile') },
  { id: 'missions', icon: '📋', label: t('navMissions') },
  { id: 'squad', icon: '👥', label: t('navSquad') },
  { id: 'sport', icon: '🏃', label: t('navSport') },
  { id: 'projects', icon: '📊', label: t('navProjects') },
  { id: 'directions', icon: '🧭', label: t('navDirections') },
  { id: 'badges', icon: '🏆', label: t('navBadges') },
  { id: 'perks', icon: '✨', label: t('navPerks') },
  { id: 'ship', icon: '🚀', label: t('navShip') },
  { id: 'prestige', icon: '⭐', label: t('navPrestige') },
  { id: 'gm', icon: '🎮', label: t('navGM') },
  { id: 'more', icon: '⋯', label: t('navMore') },
]

const PRIMARY_TABS: Tab[] = ['profile', 'missions', 'squad', 'badges', 'more']

const OVERFLOW_TABS: Tab[] = ['sport', 'projects', 'directions', 'perks', 'ship', 'prestige', 'gm']

function App() {
  const { user, studentId, student, skills, loading, error, refetch, signOut } = useAppData()
  const { notifications, addNotification, dismissNotification } = useNotifications()
  const [lang, setLang] = useState<Locale>(getLocale())
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null)
  const [showCareerTest, setShowCareerTest] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showMoreDrawer, setShowMoreDrawer] = useState(false)
  const moreDrawerRef = useRef<HTMLDivElement>(null)
  const badgesEvaluatedRef = useRef(false)
  const [showLevelUp, setShowLevelUp] = useState(false)

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

  // Escape key closes More Drawer
  useEffect(() => {
    if (!showMoreDrawer) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMoreDrawer(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [showMoreDrawer])

  // Auto-tutorial for first-time users (total_xp === 0 means never completed a mission)
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

  const handleLangChange = (newLang: Locale) => {
    setLang(newLang)
    setLocale(newLang)
  }

  // Auth gate: show auth screen if not logged in
  if (!loading && !user) {
    return <AuthScreen onAuth={() => refetch()} />
  }

  if (showTutorial) return <TutorialSystem onComplete={() => setShowTutorial(false)} />

  if (showCareerTest) {
    return (
      <div className="h-screen bg-space-deep text-star-white p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <button onClick={() => setShowCareerTest(false)} className="mb-4 text-cosmic-silver hover:text-plasma-cyan transition-colors">← Back</button>
          <CareerTest onComplete={(direction) => { setSelectedDirection(direction); setShowCareerTest(false); setActiveTab('directions') }} />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-screen bg-space-deep text-star-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🚀</div>
          <div className="text-lg neon-text-cyan">{t('skeletonLoading')} ONE! Profile...</div>
          <div className="mt-4 flex gap-1 justify-center">
            <div className="w-2 h-2 rounded-full bg-plasma-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-plasma-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-plasma-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  if (error || !student || !studentId) {
    return (
      <div className="h-screen bg-space-deep text-star-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">{t('error')}</h2>
          <p className="text-cosmic-silver mb-4 font-mono text-xs break-all">{error || t('error')}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 rounded-lg font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #00D4FF, #4A90D9)',
              color: '#0A0E1A',
              boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)',
            }}
          >
            {t('retry')}
          </button>
        </div>
      </div>
    )
  }

  const s = student!

  function renderContent() {
    switch (activeTab) {
      case 'profile': return (
        <div className="space-y-4 animate-fade-in">
          {/* Profile Header: Avatar + Name + Rank */}
          <div className="neon-card p-6 scanlines">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-shrink-0">
                <ShipVisual level={level} className="flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold truncate">{s.nickname}</h2>
                <p className="text-xs font-mono mt-0.5" style={{ color: '#A0AAB8' }}>
                  {shipStage}
                </p>
              </div>
              <div className="neon-card px-3 py-1.5 text-center flex-shrink-0">
                <div className="text-xs font-mono" style={{ color: '#A0AAB8' }}>{t('level')}</div>
                <div className="text-lg font-mono font-bold neon-text-cyan">{level}</div>
              </div>
            </div>

            {/* XP Bar — emotional: "До уровня X осталось Y XP" */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-mono neon-text-cyan">{xpInCurrent} XP</span>
                <span className="font-mono" style={{ color: '#A0AAB8' }}>{xpNeeded} XP {t('xpToNextLevelShort').replace('{level}', String(level + 1))}</span>
              </div>
              <div className={`relative h-3 bg-space-deep rounded-full overflow-hidden ${xpProgress >= 80 ? 'xp-bar-near-level' : ''}`}
                style={{ border: '1px solid rgba(46, 53, 72, 0.5)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out xp-bar-scan"
                  style={{
                    width: `${Math.max(xpProgress, 2)}%`,
                    background: xpProgress >= 80
                      ? 'linear-gradient(90deg, #00D4FF, #B24BF3, #00E676)'
                      : xpProgress >= 50
                        ? 'linear-gradient(90deg, #00D4FF, #B24BF3)'
                        : 'linear-gradient(90deg, #4A90D9, #00D4FF)',
                    boxShadow: xpProgress >= 80
                      ? '0 0 12px rgba(0, 212, 255, 0.6), 0 0 20px rgba(178, 75, 243, 0.3)'
                      : '0 0 8px rgba(0, 212, 255, 0.4)',
                  }}
                />
              </div>
            </div>

            {/* Currency Cards — labeled, color-coded */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="neon-card p-3 text-center" style={{ borderColor: 'rgba(255, 215, 64, 0.2)' }}>
                <div className="text-base mb-0.5">💰</div>
                <div className="font-mono text-sm font-bold" style={{ color: '#FFD740' }}>{coins}</div>
                <div className="text-xs mt-0.5" style={{ color: '#A0AAB8' }}>{t('coinsLabel')}</div>
              </div>
              <div className="neon-card p-3 text-center" style={{ borderColor: 'rgba(0, 212, 255, 0.2)' }}>
                <div className="text-base mb-0.5">💎</div>
                <div className="font-mono text-sm font-bold" style={{ color: '#00D4FF' }}>{gems}</div>
                <div className="text-xs mt-0.5" style={{ color: '#A0AAB8' }}>{t('gemsLabel')}</div>
              </div>
              <div className="neon-card p-3 text-center" style={{ borderColor: 'rgba(255, 145, 0, 0.2)' }}>
                <div className="text-base mb-0.5">🔥</div>
                <div className="font-mono text-sm font-bold" style={{ color: '#FF9100' }}>{streak}</div>
                <div className="text-xs mt-0.5" style={{ color: '#A0AAB8' }}>{t('streakLabel')}</div>
              </div>
            </div>
          </div>

          <DailyBonus studentId={sid} currentStreak={streak} lastBonusDate={lastBonusDate} onBonusClaimed={refetch} />

          {/* Skill Radar — shrunk, with empty state */}
          <div className="neon-card p-4 scanlines flex justify-center">
            <SkillRadar skills={skills} size={180} />
          </div>

          {/* Next Goal CTA */}
          <button onClick={() => setActiveTab('missions')} className="w-full neon-card p-4 text-left transition-all hover:border-plasma-cyan/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(178, 75, 243, 0.15))',
              }}>
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: '#E8F0FE' }}>{t('nextGoal')}</h3>
                <p className="text-xs" style={{ color: '#A0AAB8' }}>
                  {t('nextGoalDesc').replace('{xp}', String(xpNeeded)).replace('{level}', String(level + 1))}
                </p>
              </div>
            </div>
          </button>

          {/* Career Test */}
          <button onClick={() => setShowCareerTest(true)} className="w-full neon-card p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl" style={{
                background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.15), rgba(0, 212, 255, 0.15))',
              }}>
                🧭
              </div>
              <div>
                <h3 className="font-bold">{t('careerTitle')}</h3>
                <p className="text-sm" style={{ color: '#A0AAB8' }}>{t('careerBasedOn')}</p>
              </div>
            </div>
          </button>

          {/* Mystery Box — coin sink */}
          <MysteryBox studentId={sid} coins={coins} gems={gems} onOpened={refetch} />
        </div>
      )
      case 'missions': return <MissionSystem studentId={sid} onMissionComplete={refetch} />
      case 'squad': return <SquadSystem studentId={sid} />
      case 'sport': return <SportTracker studentId={sid} onStatAdded={refetch} />
      case 'projects': return <ProjectTracker studentId={sid} onProjectComplete={refetch} />
      case 'directions': return <DirectionSystem skills={skills} selectedDirection={selectedDirection} onSelectDirection={setSelectedDirection} />
      case 'badges': return <BadgeSystem studentId={sid} />
      case 'perks': return           <PerkSystem currentPerks={currentPerks} onPerksChange={async (perks) => { await setStudentPerks(sid, perks); refetch() }} />
      case 'ship': return (
        <div className="space-y-4 animate-fade-in">
          <ShipEvolutionUI level={level} />
          <ShipCustomization level={level} coins={coins} gems={gems} onPurchase={async (itemId, cost, currency) => { await purchaseShipItem(sid, itemId, cost, currency); refetch() }} />
        </div>
      )
      case 'prestige': return <PrestigeSystem totalXp={totalXp} prestigeCount={prestigeCount} onPrestige={async () => { await performPrestige(sid); refetch() }} />
      case 'gm': return (
        <div className="space-y-4 animate-fade-in">
          <GMGradingWorkflow gmId={sid} />
          <LeaderboardUI currentStudentId={sid} />
          <SquadShip squadLevel={1} memberCount={0} />
        </div>
      )
    }
  }

  const currentTab = tabs.find(tab => tab.id === activeTab)

  // Level-based feature gating
  const visibleOverflowTabs = OVERFLOW_TABS.filter(tabId => {
    if (tabId === 'prestige' && level < 25) return false
    if (tabId === 'ship' && level < 3) return false
    if (tabId === 'sport' && level < 2) return false
    if (tabId === 'perks' && level < 5) return false
    return true
  })

  return (
    <div className="h-screen bg-space-deep text-star-white flex overflow-hidden">
      <a href="#main-content" className="skip-to-content">{t('loading') === 'Загрузка...' ? 'Перейти к содержимому' : 'Skip to content'}</a>
      <NotificationSystem notifications={notifications} onDismiss={dismissNotification} />

      {/* Level-Up Celebration Overlay */}
      {showLevelUp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none level-up-overlay">
          <div className="text-center">
            <div className="text-7xl mb-4">🎉</div>
            <div className="text-3xl font-bold neon-text-cyan mb-2">
              {t('level')} {level}!
            </div>
            <div className="text-lg" style={{ color: '#B24BF3' }}>
              {lang === 'ru' ? 'Уровень повышен!' : 'Level Up!'}
            </div>
          </div>
        </div>
      )}
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 lg:w-64 border-r border-space-border flex-shrink-0" style={{ background: 'linear-gradient(180deg, #12182B 0%, #0E1322 100%)' }}>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-space-border">
          <h1 className="text-xl font-bold font-mono neon-text-cyan tracking-wider">{t('appName')}</h1>
          <div className="flex gap-3 mt-3" aria-live="polite">
            <div className="flex items-center gap-1.5 text-xs">
              <span aria-hidden="true">💰</span><span className="font-mono neon-text-warning">{coins}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span aria-hidden="true">💎</span><span className="font-mono neon-text-premium">{gems}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span aria-hidden="true">🔥</span><span className="font-mono neon-text-green">{streak}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-cosmic-silver font-mono">{t('level')} {level}</span>
              <span className="text-cosmic-silver font-mono">{shipStage}</span>
            </div>
            <div className="h-1.5 bg-space-deep rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${xpProgress}%`,
                  background: 'linear-gradient(90deg, #00D4FF, #B24BF3)',
                  boxShadow: '0 0 6px rgba(0, 212, 255, 0.4)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {tabs.filter(tab => tab.id !== 'more').map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 relative ${
                  isActive
                    ? 'nav-active-glow bg-plasma-cyan/8 text-plasma-cyan'
                    : 'text-cosmic-silver hover:bg-space-gray/50 hover:text-star-white'
                }`}
              >
                <span className="text-lg w-6 text-center">{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
                {isActive && (
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l"
                    style={{
                      background: '#00D4FF',
                      boxShadow: '0 0 10px rgba(0, 212, 255, 0.6)',
                    }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-space-border flex gap-2">
          <button
            onClick={() => setShowTutorial(true)}
            className="flex-1 py-1.5 rounded text-xs text-cosmic-silver hover:text-plasma-cyan transition-colors"
            style={{ background: 'rgba(30, 37, 56, 0.5)' }}
          >
            {t('tutorial')}
          </button>
          <button
            onClick={() => signOut()}
            className="flex-1 py-1.5 rounded text-xs text-cosmic-silver hover:text-status-error transition-colors"
            style={{ background: 'rgba(30, 37, 56, 0.5)' }}
            aria-label={lang === 'ru' ? 'Выйти' : 'Sign Out'}
          >
            {lang === 'ru' ? 'Выйти' : 'Sign Out'}
          </button>
          <button
            onClick={() => handleLangChange('ru')}
            className={`px-2 py-1.5 rounded text-xs font-bold transition-all ${
              lang === 'ru'
                ? 'text-space-deep'
                : 'text-cosmic-silver hover:text-star-white'
            }`}
            style={lang === 'ru' ? {
              background: 'linear-gradient(135deg, #00D4FF, #4A90D9)',
              boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)',
            } : { background: 'rgba(30, 37, 56, 0.5)' }}
          >
            RU
          </button>
          <button
            onClick={() => handleLangChange('en')}
            className={`px-2 py-1.5 rounded text-xs font-bold transition-all ${
              lang === 'en'
                ? 'text-space-deep'
                : 'text-cosmic-silver hover:text-star-white'
            }`}
            style={lang === 'en' ? {
              background: 'linear-gradient(135deg, #00D4FF, #4A90D9)',
              boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)',
            } : { background: 'rgba(30, 37, 56, 0.5)' }}
          >
            EN
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 border-b border-space-border"
        style={{ background: 'linear-gradient(180deg, #12182B 0%, #0E1322 100%)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold font-mono neon-text-cyan tracking-wider">{t('appName')}</h1>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 text-xs" aria-live="polite">
              <span><span aria-hidden="true">💰</span><span className="font-mono neon-text-warning ml-0.5">{coins}</span></span>
              <span><span aria-hidden="true">💎</span><span className="font-mono neon-text-premium ml-0.5">{gems}</span></span>
              <span><span aria-hidden="true">🔥</span><span className="font-mono neon-text-green ml-0.5">{streak}</span></span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleLangChange('ru')}
                className={`px-1.5 py-0.5 rounded text-xs font-bold transition-all ${lang === 'ru' ? 'text-space-deep' : 'text-cosmic-silver'}`}
                style={lang === 'ru' ? {
                  background: 'linear-gradient(135deg, #00D4FF, #4A90D9)',
                } : {}}
              >
                RU
              </button>
              <button
                onClick={() => handleLangChange('en')}
                className={`px-1.5 py-0.5 rounded text-xs font-bold transition-all ${lang === 'en' ? 'text-space-deep' : 'text-cosmic-silver'}`}
                style={lang === 'en' ? {
                  background: 'linear-gradient(135deg, #00D4FF, #4A90D9)',
                } : {}}
              >
                EN
              </button>
              <button
                onClick={() => signOut()}
                className="px-2 py-1.5 rounded text-xs font-bold text-cosmic-silver hover:text-status-error transition-colors"
                aria-label={lang === 'ru' ? 'Выйти' : 'Sign Out'}
              >
                ⏻
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-sm font-medium">{currentTab?.icon} {currentTab?.label}</span>
          <div className="text-xs text-cosmic-silver font-mono">{t('level')} {level}</div>
        </div>
      </div>

      {/* Main Content */}
      <main id="main-content" className="flex-1 overflow-y-auto md:pt-0 pt-[88px] pb-20 md:pb-0" tabIndex={-1}>
        <div className="p-4 lg:p-6 max-w-5xl">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-space-border"
        style={{ background: 'linear-gradient(180deg, #0E1322 0%, #12182B 100%)' }}
      >
        <div className="flex">
          {PRIMARY_TABS.map((tabId) => {
            const tab = tabs.find(t => t.id === tabId)!
            const isActive = tabId === 'more' ? showMoreDrawer : activeTab === tabId
            return (
              <button
                key={tabId}
                onClick={() => {
                  if (tabId === 'more') {
                    setShowMoreDrawer(!showMoreDrawer)
                  } else {
                    setShowMoreDrawer(false)
                    setActiveTab(tabId)
                  }
                }}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-3 flex-1 min-w-0 transition-all relative ${
                  isActive
                    ? 'text-plasma-cyan'
                    : 'text-cosmic-silver'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-[10px] leading-tight truncate">{tab.label}</span>
                {isActive && (
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{
                      background: '#00D4FF',
                      boxShadow: '0 0 8px rgba(0, 212, 255, 0.6)',
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* More Drawer Overlay */}
      {showMoreDrawer && (
        <div
          className="md:hidden fixed inset-0 z-50"
          onClick={() => setShowMoreDrawer(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            ref={moreDrawerRef}
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t border-space-border animate-fade-in"
            style={{ background: 'linear-gradient(180deg, #12182B 0%, #0E1322 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-space-border flex items-center justify-between">
              <h3 className="text-sm font-bold neon-text-cyan">{t('navMoreDrawerTitle')}</h3>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-cosmic-silver hover:text-star-white transition-colors"
                style={{ background: 'rgba(30, 37, 56, 0.8)' }}
                aria-label={lang === 'ru' ? 'Закрыть' : 'Close'}
              >
                ✕
              </button>
            </div>
            <div className="p-2 pb-8 grid grid-cols-4 gap-2">
              {visibleOverflowTabs.map((tabId) => {
                const tab = tabs.find(t => t.id === tabId)!
                const isActive = activeTab === tabId
                return (
                  <button
                    key={tabId}
                    onClick={() => {
                      setActiveTab(tabId)
                      setShowMoreDrawer(false)
                    }}
                    aria-label={tab.label}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-plasma-cyan/10 text-plasma-cyan'
                        : 'text-cosmic-silver hover:bg-space-gray/50 hover:text-star-white'
                    }`}
                  >
                    <span className="text-2xl">{tab.icon}</span>
                    <span className="text-[10px] leading-tight text-center">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
