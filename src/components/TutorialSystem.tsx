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
      localStorage.setItem('one-profile-tutorial-seen', 'true')
      onComplete()
    }
  }

  function handleSkip() {
    localStorage.setItem('one-profile-tutorial-seen', 'true')
    onComplete()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-navy)' }}>
      <div className="max-w-md w-full">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>{t('tutorial')}</span>
            <span className="font-mono" style={{ color: 'var(--color-accent)' }}>{currentStep + 1}/{TUTORIAL_STEPS.length}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="gc-lg p-8 text-center">
          <div className="text-6xl mb-6">{step.icon}</div>
          <h2 className="text-2xl font-bold mb-4">
            {lang === 'ru' ? t(step.title as keyof Translations) : t(step.titleEn as keyof Translations)}
          </h2>
          <p className="mb-6" style={{ color: 'var(--color-muted)' }}>
            {lang === 'ru' ? t(step.description as keyof Translations) : t(step.descriptionEn as keyof Translations)}
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 btn-ghost"
            >
              {t('skip')}
            </button>
            <button
              onClick={handleNext}
              className="flex-1 btn-accent"
            >
              {currentStep < TUTORIAL_STEPS.length - 1 ? t('next') : t('start')}
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {TUTORIAL_STEPS.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full"
              style={{
                background: index === currentStep
                  ? 'var(--color-accent)'
                  : index < currentStep
                    ? 'var(--color-status-success)'
                    : 'var(--color-glass-b)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
