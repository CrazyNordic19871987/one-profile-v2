import { useState } from 'react'
import { DIRECTIONS } from '../lib/engine'
import type { Direction } from '../types/database'

interface CareerTestProps {
  onComplete: (recommendedDirection: Direction) => void
}

interface Question {
  id: number
  text: string
  textEn: string
  options: { value: Direction; label: string; labelEn: string }[]
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Что тебе больше нравится?',
    textEn: 'What do you prefer?',
    options: [
      { value: 'strategy', label: 'Придумывать планы', labelEn: 'Making plans' },
      { value: 'communication', label: 'Общаться с друзьями', labelEn: 'Talking to friends' },
      { value: 'it', label: 'Создавать на компьютере', labelEn: 'Creating on computer' },
      { value: 'sport', label: 'Двигаться и играть', labelEn: 'Moving and playing' },
    ],
  },
  {
    id: 2,
    text: 'Какой предмет тебе интереснее?',
    textEn: 'Which subject interests you more?',
    options: [
      { value: 'language', label: 'Иностранный язык', labelEn: 'Foreign language' },
      { value: 'art', label: 'Рисование и дизайн', labelEn: 'Drawing and design' },
      { value: 'entrepreneurship', label: 'Экономика', labelEn: 'Economics' },
      { value: 'strategy', label: 'Логика и шахматы', labelEn: 'Logic and chess' },
    ],
  },
  {
    id: 3,
    text: 'Как ты любишь работать?',
    textEn: 'How do you like to work?',
    options: [
      { value: 'communication', label: 'В команде', labelEn: 'In a team' },
      { value: 'it', label: 'Один за компьютером', labelEn: 'Alone at computer' },
      { value: 'sport', label: 'Активно двигаясь', labelEn: 'Actively moving' },
      { value: 'art', label: 'Творчески', labelEn: 'Creatively' },
    ],
  },
  {
    id: 4,
    text: 'Что бы ты хотел создать?',
    textEn: 'What would you like to create?',
    options: [
      { value: 'it', label: 'Приложение или игру', labelEn: 'An app or game' },
      { value: 'entrepreneurship', label: 'Свой бизнес', labelEn: 'Your own business' },
      { value: 'art', label: 'Красивый дизайн', labelEn: 'Beautiful design' },
      { value: 'language', label: 'Перевод для мира', labelEn: 'Translation for the world' },
    ],
  },
  {
    id: 5,
    text: 'Какой суперсилой ты хочешь обладать?',
    textEn: 'What superpower would you want?',
    options: [
      { value: 'strategy', label: 'Предвидеть будущее', labelEn: 'See the future' },
      { value: 'communication', label: 'Убедить кого угодно', labelEn: 'Convince anyone' },
      { value: 'sport', label: 'Быть самым быстрым', labelEn: 'Be the fastest' },
      { value: 'art', label: 'Создавать миры', labelEn: 'Create worlds' },
    ],
  },
  {
    id: 6,
    text: 'Где ты представляешь себя через 10 лет?',
    textEn: 'Where do you see yourself in 10 years?',
    options: [
      { value: 'entrepreneurship', label: 'Свой стартап', labelEn: 'Your own startup' },
      { value: 'it', label: 'В tech-компании', labelEn: 'In a tech company' },
      { value: 'language', label: 'Международная карьера', labelEn: 'International career' },
      { value: 'sport', label: 'Профессиональный спорт', labelEn: 'Professional sports' },
    ],
  },
]

export function CareerTest({ onComplete }: CareerTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Direction[]>([])
  const [showResult, setShowResult] = useState(false)
  const [recommended, setRecommended] = useState<Direction | null>(null)

  function handleAnswer(direction: Direction) {
    const newAnswers = [...answers, direction]
    setAnswers(newAnswers)

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate result
      const counts: Record<Direction, number> = {
        strategy: 0, language: 0, communication: 0, sport: 0,
        it: 0, art: 0, entrepreneurship: 0,
      }
      newAnswers.forEach(a => counts[a]++)
      
      const maxDirection = Object.entries(counts).reduce((a, b) => 
        b[1] > a[1] ? b : a
      )[0] as Direction

      setRecommended(maxDirection)
      setShowResult(true)
    }
  }

  function handleFinish() {
    if (recommended) {
      onComplete(recommended)
    }
  }

  if (showResult && recommended) {
    const dir = DIRECTIONS.find(d => d.id === recommended)
    return (
      <div className="bg-space-nebula rounded-xl p-6 border border-space-border text-center">
        <div className="text-6xl mb-4">{dir?.icon}</div>
        <h2 className="text-2xl font-bold mb-2">Your Path: {dir?.name}</h2>
        <p className="text-cosmic-silver mb-6">
          Based on your answers, you should focus on <strong>{dir?.name}</strong>!
        </p>
        <div className="bg-space-gray rounded-lg p-4 mb-6">
          <div className="text-sm text-cosmic-silver mb-2">Your answers showed:</div>
          <div className="flex flex-wrap justify-center gap-2">
            {[...new Set(answers)].map((a, i) => {
              const d = DIRECTIONS.find(dd => dd.id === a)
              return (
                <span key={i} className="px-2 py-1 bg-space-border rounded text-sm">
                  {d?.icon} {d?.name}
                </span>
              )
            })}
          </div>
        </div>
        <button
          onClick={handleFinish}
          className="px-6 py-3 bg-plasma-cyan text-space-deep rounded-lg font-bold hover:bg-plasma-blue transition-colors"
        >
          Start Your Journey
        </button>
      </div>
    )
  }

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100

  return (
    <div className="bg-space-nebula rounded-xl p-6 border border-space-border">
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Career Test</span>
          <span className="font-mono text-plasma-cyan">{currentQuestion + 1}/{QUESTIONS.length}</span>
        </div>
        <div className="h-2 bg-space-gray rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-plasma-cyan to-status-success rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 text-center">
        {question.text}
      </h2>

      <div className="grid gap-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className="p-4 bg-space-gray rounded-lg border border-space-border hover:border-plasma-cyan hover:bg-space-border transition-all text-left"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
