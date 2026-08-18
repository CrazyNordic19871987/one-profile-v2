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

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'profile', icon: '👤', label: t('navProfile') },
    { id: 'missions', icon: '📋', label: t('navMissions') },
    { id: 'squad', icon: '👥', label: t('navSquad') },
    { id: 'sport', icon: '🏃', label: 'Sport' },
    { id: 'projects', icon: '📊', label: 'Projects' },
    { id: 'directions', icon: '🧭', label: 'Directions' },
    { id: 'badges', icon: '🏆', label: t('navBadges') },
    { id: 'perks', icon: '✨', label: 'Perks' },
    { id: 'ship', icon: '🚀', label: 'Ship' },
    { id: 'prestige', icon: '⭐', label: 'Prestige' },
    { id: 'gm', icon: '🎮', label: 'GM' },
  ]

  if (showTutorial) {
    return <TutorialSystem onComplete={() => setShowTutorial(false)} />
  }

  if (showCareerTest) {
    return (
      <div className="min-h-screen bg-space-deep text-star-white p-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => setShowCareerTest(false)} className="mb-4 text-cosmic-silver hover:text-star-white">← Back</button>
          <CareerTest
            onComplete={(direction) => {
              setSelectedDirection(direction)
              setShowCareerTest(false)
              setActiveTab('directions')
            }}
          />
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-space-deep text-star-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🚀</div>
          <div className="text-cosmic-silver">Loading ONE! Profile...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !student || !studentId) {
    return (
      <div className="min-h-screen bg-space-deep text-star-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-cosmic-silver mb-4">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-plasma-cyan text-space-deep rounded-lg font-bold hover:bg-plasma-blue transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-space-deep text-star-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-space-border">
        <h1 className="text-xl font-bold text-plasma-cyan font-mono">{t('appName')}</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowTutorial(true)} className="px-3 py-1 rounded text-sm bg-space-gray text-cosmic-silver hover:bg-space-border">Tutorial</button>
          <button onClick={() => handleLangChange('ru')} className={`px-3 py-1 rounded text-sm ${lang === 'ru' ? 'bg-plasma-cyan text-space-deep' : 'bg-space-gray text-cosmic-silver'}`}>RU</button>
          <button onClick={() => handleLangChange('en')} className={`px-3 py-1 rounded text-sm ${lang === 'en' ? 'bg-plasma-cyan text-space-deep' : 'bg-space-gray text-cosmic-silver'}`}>EN</button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex overflow-x-auto border-b border-space-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'text-plasma-cyan border-b-2 border-plasma-cyan' : 'text-cosmic-silver hover:text-star-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-space-nebula rounded-xl p-6 border border-space-border">
              <div className="text-center">
                <ShipVisual level={level} className="mb-4" />
                <h2 className="text-2xl font-bold mb-2">{student.name}</h2>
                <p className="text-cosmic-silver mb-1">{t('profileLevel')} {level} · {shipStage}</p>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('xp')}</span>
                    <span className="font-mono text-plasma-cyan">{xpInCurrent} / {xpNeeded}</span>
                  </div>
                  <div className="h-3 bg-space-gray rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-plasma-cyan to-plasma-blue rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-space-gray rounded-lg p-3">
                    <div className="text-2xl mb-1">💰</div>
                    <div className="font-mono text-status-warning">{coins}</div>
                  </div>
                  <div className="bg-space-gray rounded-lg p-3">
                    <div className="text-2xl mb-1">💎</div>
                    <div className="font-mono text-status-premium">{gems}</div>
                  </div>
                  <div className="bg-space-gray rounded-lg p-3">
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="font-mono text-status-success">{streak}</div>
                  </div>
                </div>

                <SkillRadar skills={skills} size={280} className="mx-auto" />
              </div>
            </div>

            <DailyBonus
              studentId={studentId}
              currentStreak={streak}
              lastBonusDate={lastBonusDate}
              onBonusClaimed={refetch}
            />

            <button
              onClick={() => setShowCareerTest(true)}
              className="w-full bg-space-nebula rounded-xl p-4 border border-space-border hover:border-plasma-cyan transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧭</span>
                <div className="text-left">
                  <h3 className="font-bold">Take Career Test</h3>
                  <p className="text-sm text-cosmic-silver">Discover your professional direction</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {activeTab === 'missions' && <MissionSystem studentId={studentId} onMissionComplete={refetch} />}
        {activeTab === 'squad' && <SquadSystem studentId={studentId} />}
        {activeTab === 'sport' && <SportTracker studentId={studentId} onStatAdded={refetch} />}
        {activeTab === 'projects' && <ProjectTracker studentId={studentId} onProjectComplete={refetch} />}
        {activeTab === 'directions' && (
          <DirectionSystem skills={skills} selectedDirection={selectedDirection} onSelectDirection={setSelectedDirection} />
        )}
        {activeTab === 'badges' && <BadgeSystem studentId={studentId} />}
        {activeTab === 'perks' && (
          <PerkSystem currentPerks={currentPerks} onPerksChange={() => refetch()} />
        )}
        {activeTab === 'ship' && (
          <div className="space-y-4">
            <ShipEvolutionUI level={level} />
            <ShipCustomization level={level} coins={coins} gems={gems} onPurchase={(_id, _cost, _currency) => refetch()} />
          </div>
        )}
        {activeTab === 'prestige' && (
          <PrestigeSystem totalXp={totalXp} prestigeCount={prestigeCount} onPrestige={refetch} />
        )}
        {activeTab === 'gm' && (
          <div className="space-y-4">
            <GMGradingWorkflow gmId={studentId} />
            <LeaderboardUI currentStudentId={studentId} />
            <SquadShip squadLevel={1} memberCount={0} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
