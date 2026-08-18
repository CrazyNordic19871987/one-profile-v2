import { useState } from 'react'

interface TutorialSystemProps {
  onComplete: () => void
}

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to ONE! Profile!',
    titleEn: 'Welcome to ONE! Profile!',
    description: 'You are now a Space Explorer! Your mission is to develop skills, complete missions, and build your ship.',
    descriptionEn: 'You are now a Space Explorer! Your mission is to develop skills, complete missions, and build your ship.',
    icon: '🚀',
  },
  {
    title: 'Your Ship',
    titleEn: 'Your Ship',
    description: 'Your ship evolves as you level up. Start as a Scout Pod and grow into a Dreadnought!',
    descriptionEn: 'Your ship evolves as you level up. Start as a Scout Pod and grow into a Dreadnought!',
    icon: '🛸',
  },
  {
    title: '7 Directions',
    titleEn: '7 Directions',
    description: 'Explore Strategy, Language, Communication, Sport, IT, Art, and Entrepreneurship. Each direction has its own skills.',
    descriptionEn: 'Explore Strategy, Language, Communication, Sport, IT, Art, and Entrepreneurship. Each direction has its own skills.',
    icon: '🧭',
  },
  {
    title: 'Missions',
    titleEn: 'Missions',
    description: 'Complete missions to earn XP and Coins. Your Game Master will grade your work.',
    descriptionEn: 'Complete missions to earn XP and Coins. Your Game Master will grade your work.',
    icon: '📋',
  },
  {
    title: 'Your Squad',
    titleEn: 'Your Squad',
    description: 'Join a squad and work together! Your squad ship grows with everyone\'s contributions.',
    descriptionEn: 'Join a squad and work together! Your squad ship grows with everyone\'s contributions.',
    icon: '👥',
  },
  {
    title: 'Ready to Start!',
    titleEn: 'Ready to Start!',
    description: 'Begin your journey! Complete missions, explore directions, and become a Space Legend!',
    descriptionEn: 'Begin your journey! Complete missions, explore directions, and become a Space Legend!',
    icon: '⭐',
  },
]

export function TutorialSystem({ onComplete }: TutorialSystemProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [lang] = useState<'ru' | 'en'>('en')

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
            {lang === 'ru' ? step.title : step.titleEn}
          </h2>
          <p className="text-cosmic-silver mb-6">
            {lang === 'ru' ? step.description : step.descriptionEn}
          </p>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 bg-space-gray text-cosmic-silver rounded-lg hover:bg-space-border transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-plasma-cyan text-space-deep rounded-lg font-bold hover:bg-plasma-blue transition-colors"
            >
              {currentStep < TUTORIAL_STEPS.length - 1 ? 'Next' : 'Start!'}
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
