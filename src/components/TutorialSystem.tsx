import { useState } from 'react'
import { t, getLocale, type Translations } from '../lib/i18n'

interface TutorialSystemProps {
  onComplete: () => void
}

const TUTORIAL_STEPS = [
  {
    title: 'tutorialWelcome',
    titleEn: 'tutorialWelcome',
    description: 'tutorialWelcomeDesc',
    descriptionEn: 'tutorialWelcomeDesc',
    icon: '🚀',
  },
  {
    title: 'tutorialShip',
    titleEn: 'tutorialShip',
    description: 'tutorialShipDesc',
    descriptionEn: 'tutorialShipDesc',
    icon: '🛸',
  },
  {
    title: 'tutorialDirections',
    titleEn: 'tutorialDirections',
    description: 'tutorialDirectionsDesc',
    descriptionEn: 'tutorialDirectionsDesc',
    icon: '🧭',
  },
  {
    title: 'tutorialMissions',
    titleEn: 'tutorialMissions',
    description: 'tutorialMissionsDesc',
    descriptionEn: 'tutorialMissionsDesc',
    icon: '📋',
  },
  {
    title: 'tutorialSquad',
    titleEn: 'tutorialSquad',
    description: 'tutorialSquadDesc',
    descriptionEn: 'tutorialSquadDesc',
    icon: '👥',
  },
  {
    title: 'tutorialReady',
    titleEn: 'tutorialReady',
    description: 'tutorialReadyDesc',
    descriptionEn: 'tutorialReadyDesc',
    icon: '⭐',
  },
]

export function TutorialSystem({ onComplete }: TutorialSystemProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [lang] = useState<'ru' | 'en'>(getLocale())

  const step = TUTORIAL_STEPS[currentStep]
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100

  function handleNext() {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  function handleSkip() {
    onComplete()
  }

  return (
    <div className="min-h-screen bg-space-deep text-star-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Tutorial</span>
            <span className="font-mono text-plasma-cyan">{currentStep + 1}/{TUTORIAL_STEPS.length}</span>
          </div>
          <div className="h-2 bg-space-gray rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-plasma-cyan to-status-success rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-space-nebula rounded-xl p-8 border border-space-border text-center">
          <div className="text-6xl mb-6">{step.icon}</div>
          <h2 className="text-2xl font-bold mb-4">
            {lang === 'ru' ? t(step.title as keyof Translations) : t(step.titleEn as keyof Translations)}
          </h2>
          <p className="text-cosmic-silver mb-6">
            {lang === 'ru' ? t(step.description as keyof Translations) : t(step.descriptionEn as keyof Translations)}
          </p>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 bg-space-gray text-cosmic-silver rounded-lg hover:bg-space-border transition-colors"
            >
              {t('skip')}
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-plasma-cyan text-space-deep rounded-lg font-bold hover:bg-plasma-blue transition-colors"
            >
              {currentStep < TUTORIAL_STEPS.length - 1 ? t('next') : t('start')}
            </button>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {TUTORIAL_STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep
                  ? 'bg-plasma-cyan'
                  : index < currentStep
                    ? 'bg-status-success'
                    : 'bg-space-gray'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
