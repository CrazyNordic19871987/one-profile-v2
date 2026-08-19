import { useState } from 'react'
import { DIRECTIONS } from '../lib/engine'
import { t, getLocale } from '../lib/i18n'
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
  const lang = getLocale()

  function handleAnswer(direction: Direction) {
    const newAnswers = [...answers, direction]
    setAnswers(newAnswers)

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
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
      <div className="gc p-6 text-center">
        <div className="text-6xl mb-4">{dir?.icon}</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
          {lang === 'ru' ? 'Твой путь: ' : 'Your Path: '}{lang === 'ru' ? dir?.name : dir?.nameEn}
        </h2>
        <p className="mb-6" style={{ color: 'var(--color-muted)' }}>
          {lang === 'ru' ? 'По твоим ответам, стоит сосредоточиться на ' : 'Based on your answers, you should focus on '}
          <strong style={{ color: 'var(--color-accent)' }}>{lang === 'ru' ? dir?.name : dir?.nameEn}</strong>!
        </p>
        <div className="rounded-lg p-4 mb-6" style={{ background: 'var(--color-glass-b)' }}>
          <div className="text-sm mb-2" style={{ color: 'var(--color-muted)' }}>
            {lang === 'ru' ? 'Твои ответы показали:' : 'Your answers showed:'}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[...new Set(answers)].map((a, i) => {
              const d = DIRECTIONS.find(dd => dd.id === a)
              return (
                <span key={i} className="px-2 py-1 rounded text-sm" style={{ background: 'var(--color-glass)', border: '1px solid var(--color-border)' }}>
                  {d?.icon} {lang === 'ru' ? d?.name : d?.nameEn}
                </span>
              )
            })}
          </div>
        </div>
        <button
          onClick={handleFinish}
          className="btn-accent px-6 py-3 rounded-lg font-bold transition-all"
        >
          {lang === 'ru' ? 'Начать путешествие' : 'Start Your Journey'}
        </button>
      </div>
    )
  }

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100

  return (
    <div className="gc p-6">
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>{t('careerTitle')}</span>
          <span className="font-mono" style={{ color: 'var(--color-accent)' }}>{currentQuestion + 1}/{QUESTIONS.length}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 text-center">
        {lang === 'ru' ? question.text : question.textEn}
      </h2>

      <div className="grid gap-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className="gc p-4 text-left transition-all hover:translate-y-[-1px]"
          >
            {lang === 'ru' ? option.label : option.labelEn}
          </button>
        ))}
      </div>
    </div>
  )
}
