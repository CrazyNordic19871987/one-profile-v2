import { useState } from 'react'
import { t, setLocale, getLocale } from './lib/i18n'
import { levelFromXp, xpInLevel, xpToNextLevel, getShipStage } from './lib/engine'
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
  const [lang, setLang] = useState<Locale>(getLocale())
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null)
  const [showCareerTest, setShowCareerTest] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentPerks, setCurrentPerks] = useState<string[]>([])

  const handleLangChange = (newLang: Locale) => {
    setLang(newLang)
    setLocale(newLang)
  }

  // Mock data
  const studentId = 'demo-student-1'
  const gmId = 'demo-gm-1'
  const totalXp = 2450
  const level = levelFromXp(totalXp)
  const xpInCurrent = xpInLevel(totalXp)
  const xpNeeded = xpToNextLevel(totalXp)
  const xpProgress = xpNeeded > 0 ? (xpInCurrent / xpNeeded) * 100 : 100
  const shipStage = getShipStage(level)

  const coins = 450
  const gems = 25
  const streak = 3
  const lastBonusDate = null
  const prestigeCount = 0

  const skills = [
    { direction: 'strategy' as Direction, xp: 320, level: 4 },
    { direction: 'language' as Direction, xp: 280, level: 3 },
    { direction: 'communication' as Direction, xp: 150, level: 2 },
    { direction: 'sport' as Direction, xp: 420, level: 5 },
    { direction: 'it' as Direction, xp: 380, level: 4 },
    { direction: 'art' as Direction, xp: 200, level: 3 },
    { direction: 'entrepreneurship' as Direction, xp: 180, level: 2 },
  ]

  const mockLeaderboard = [
    { id: '1', name: 'Alex', totalXp: 3200, level: 15 },
    { id: '2', name: 'You', totalXp: 2450, level: 12 },
    { id: '3', name: 'Sam', totalXp: 2100, level: 11 },
    { id: '4', name: 'Jordan', totalXp: 1800, level: 10 },
    { id: '5', name: 'Casey', totalXp: 1500, level: 9 },
  ]

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
          <button
            onClick={() => setShowCareerTest(false)}
            className="mb-4 text-cosmic-silver hover:text-star-white"
          >
            ← Back
          </button>
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

  return (
    <div className="min-h-screen bg-space-deep text-star-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-space-border">
        <h1 className="text-xl font-bold text-plasma-cyan font-mono">
          {t('appName')}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTutorial(true)}
            className="px-3 py-1 rounded text-sm bg-space-gray text-cosmic-silver hover:bg-space-border"
          >
            Tutorial
          </button>
          <button
            onClick={() => handleLangChange('ru')}
            className={`px-3 py-1 rounded text-sm ${lang === 'ru' ? 'bg-plasma-cyan text-space-deep' : 'bg-space-gray text-cosmic-silver'}`}
          >
            RU
          </button>
          <button
            onClick={() => handleLangChange('en')}
            className={`px-3 py-1 rounded text-sm ${lang === 'en' ? 'bg-plasma-cyan text-space-deep' : 'bg-space-gray text-cosmic-silver'}`}
          >
            EN
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex overflow-x-auto border-b border-space-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-plasma-cyan border-b-2 border-plasma-cyan'
                : 'text-cosmic-silver hover:text-star-white'
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
                <h2 className="text-2xl font-bold mb-2">
                  {lang === 'ru' ? 'Космический Исследователь' : 'Space Explorer'}
                </h2>
                <p className="text-cosmic-silver mb-1">
                  {t('profileLevel')} {level} • {shipStage}
                </p>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('xp')}</span>
                    <span className="font-mono text-plasma-cyan">{xpInCurrent} / {xpNeeded}</span>
                  </div>
                  <div className="h-3 bg-space-gray rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-plasma-cyan to-plasma-blue rounded-full transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    />
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
                    <div className="text-2xl mb-1">⭐</div>
                    <div className="font-mono text-status-success">12</div>
                  </div>
                </div>

                <SkillRadar skills={skills} size={280} className="mx-auto" />
              </div>
            </div>

            <DailyBonus
              studentId={studentId}
              currentStreak={streak}
              lastBonusDate={lastBonusDate}
              onBonusClaimed={() => {}}
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

        {activeTab === 'missions' && <MissionSystem studentId={studentId} />}
        {activeTab === 'squad' && <SquadSystem studentId={studentId} />}
        {activeTab === 'sport' && <SportTracker studentId={studentId} />}
        {activeTab === 'projects' && <ProjectTracker studentId={studentId} />}
        {activeTab === 'directions' && (
          <DirectionSystem
            skills={skills}
            selectedDirection={selectedDirection}
            onSelectDirection={setSelectedDirection}
          />
        )}
        {activeTab === 'badges' && <BadgeSystem studentId={studentId} />}
        {activeTab === 'perks' && (
          <PerkSystem currentPerks={currentPerks} onPerksChange={setCurrentPerks} />
        )}
        {activeTab === 'ship' && (
          <div className="space-y-4">
            <ShipEvolutionUI level={level} />
            <ShipCustomization
              level={level}
              coins={coins}
              gems={gems}
              onPurchase={(_id, _cost, _currency) => {}}
            />
          </div>
        )}
        {activeTab === 'prestige' && (
          <PrestigeSystem
            totalXp={totalXp}
            prestigeCount={prestigeCount}
            onPrestige={() => {}}
          />
        )}
        {activeTab === 'gm' && (
          <div className="space-y-4">
            <GMGradingWorkflow gmId={gmId} />
            <LeaderboardUI entries={mockLeaderboard} currentStudentId={studentId} />
            <SquadShip squadLevel={8} memberCount={5} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
