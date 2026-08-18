import { useState } from 'react'
import { t, setLocale, getLocale } from './lib/i18n'
import { levelFromXp, xpInLevel, xpToNextLevel, getShipStage } from './lib/engine'
import { useAppData } from './lib/useAppData'
import type { Locale } from './lib/i18n'
import type { Direction } from './types/database'

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

type Tab = 'profile' | 'missions' | 'squad' | 'sport' | 'projects' | 'directions' | 'badges' | 'perks' | 'ship' | 'prestige' | 'gm'

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
]

function App() {
  const { studentId, student, skills, loading, error, refetch } = useAppData()
  const [lang, setLang] = useState<Locale>(getLocale())
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null)
  const [showCareerTest, setShowCareerTest] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  const handleLangChange = (newLang: Locale) => {
    setLang(newLang)
    setLocale(newLang)
  }

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
          <div className="text-lg neon-text-cyan">{t('loading')} ONE! Profile...</div>
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
          <p className="text-cosmic-silver mb-4">{error || t('error')}</p>
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

  const sid = studentId!
  const s = student!

  function renderContent() {
    switch (activeTab) {
      case 'profile': return (
        <div className="space-y-4 animate-fade-in">
          <div className="neon-card p-6 scanlines">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <ShipVisual level={level} className="flex-shrink-0" />
              </div>
              <div className="flex-1 text-center sm:text-left w-full">
                <h2 className="text-2xl font-bold mb-1">{s.name}</h2>
                <p className="text-cosmic-silver mb-3 font-mono text-sm">{t('profileLevel')} {level} · {shipStage}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-cosmic-silver">{t('xp')}</span>
                    <span className="font-mono neon-text-cyan">{xpInCurrent} / {xpNeeded}</span>
                  </div>
                  <div className="h-2.5 bg-space-deep rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${xpProgress}%`,
                        background: 'linear-gradient(90deg, #00D4FF, #B24BF3)',
                        boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="neon-card p-3 text-center">
                    <div className="text-lg mb-1">💰</div>
                    <div className="font-mono text-sm neon-text-warning">{coins}</div>
                  </div>
                  <div className="neon-card p-3 text-center">
                    <div className="text-lg mb-1">💎</div>
                    <div className="font-mono text-sm neon-text-premium">{gems}</div>
                  </div>
                  <div className="neon-card p-3 text-center">
                    <div className="text-lg mb-1">🔥</div>
                    <div className="font-mono text-sm neon-text-green">{streak}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <SkillRadar skills={skills} size={260} />
            </div>
          </div>
          <DailyBonus studentId={sid} currentStreak={streak} lastBonusDate={lastBonusDate} onBonusClaimed={refetch} />
          <button onClick={() => setShowCareerTest(true)} className="w-full neon-card p-4 text-left">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.15), rgba(0, 212, 255, 0.15))',
                }}
              >
                🧭
              </div>
              <div>
                <h3 className="font-bold">{t('careerTitle')}</h3>
                <p className="text-sm text-cosmic-silver">{t('careerBasedOn')}</p>
              </div>
            </div>
          </button>
        </div>
      )
      case 'missions': return <MissionSystem studentId={sid} onMissionComplete={refetch} />
      case 'squad': return <SquadSystem studentId={sid} />
      case 'sport': return <SportTracker studentId={sid} onStatAdded={refetch} />
      case 'projects': return <ProjectTracker studentId={sid} onProjectComplete={refetch} />
      case 'directions': return <DirectionSystem skills={skills} selectedDirection={selectedDirection} onSelectDirection={setSelectedDirection} />
      case 'badges': return <BadgeSystem studentId={sid} />
      case 'perks': return <PerkSystem currentPerks={currentPerks} onPerksChange={() => refetch()} />
      case 'ship': return (
        <div className="space-y-4 animate-fade-in">
          <ShipEvolutionUI level={level} />
          <ShipCustomization level={level} coins={coins} gems={gems} onPurchase={() => refetch()} />
        </div>
      )
      case 'prestige': return <PrestigeSystem totalXp={totalXp} prestigeCount={prestigeCount} onPrestige={refetch} />
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

  return (
    <div className="h-screen bg-space-deep text-star-white flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 lg:w-64 border-r border-space-border flex-shrink-0" style={{ background: 'linear-gradient(180deg, #12182B 0%, #0E1322 100%)' }}>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-space-border">
          <h1 className="text-xl font-bold font-mono neon-text-cyan tracking-wider">{t('appName')}</h1>
          <div className="flex gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span>💰</span><span className="font-mono neon-text-warning">{coins}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span>💎</span><span className="font-mono neon-text-premium">{gems}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span>🔥</span><span className="font-mono neon-text-green">{streak}</span>
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
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
            <div className="flex gap-2 text-xs">
              <span>💰<span className="font-mono neon-text-warning ml-0.5">{coins}</span></span>
              <span>💎<span className="font-mono neon-text-premium ml-0.5">{gems}</span></span>
              <span>🔥<span className="font-mono neon-text-green ml-0.5">{streak}</span></span>
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
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-sm font-medium">{currentTab?.icon} {currentTab?.label}</span>
          <div className="text-xs text-cosmic-silver font-mono">{t('level')} {level}</div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-[88px] pb-20 md:pb-0">
        <div className="p-4 lg:p-6 max-w-5xl">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-space-border"
        style={{ background: 'linear-gradient(180deg, #0E1322 0%, #12182B 100%)' }}
      >
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2.5 min-w-[56px] transition-all relative ${
                  isActive
                    ? 'text-plasma-cyan'
                    : 'text-cosmic-silver'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-[10px] leading-tight">{tab.label}</span>
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
    </div>
  )
}

export default App
