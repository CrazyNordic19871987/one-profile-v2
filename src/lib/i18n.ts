export type Locale = 'ru' | 'en'

export interface Translations {
  // App
  appName: string
  loading: string
  error: string
  save: string
  cancel: string
  delete: string
  edit: string
  back: string

  // Navigation
  navProfile: string
  navMissions: string
  navSquad: string
  navBadges: string
  navSettings: string

  // Profile
  profileTitle: string
  profileLevel: string
  profileStage: string
  profileXp: string
  profileXpToNext: string

  // Currencies
  coins: string
  gems: string
  xp: string

  // Directions
  dirStrategy: string
  dirLanguage: string
  dirCommunication: string
  dirSport: string
  dirIt: string
  dirArt: string
  dirEntrepreneurship: string

  // Ship
  shipTitle: string
  shipStage: string
  shipProgress: string

  // Missions
  missionsTitle: string
  missionsPending: string
  missionsCompleted: string
  missionGrade: string
  missionXpReward: string
  missionCoinsReward: string

  // Daily Bonus
  dailyBonusTitle: string
  dailyBonusClaim: string
  dailyBonusClaimed: string
  dailyBonusStreak: string

  // Squad
  squadTitle: string
  squadMembers: string
  squadProgress: string
  squadShip: string

  // Badges
  badgesTitle: string
  badgesEarned: string
  badgesLocked: string

  // GM Panel
  gmTitle: string
  gmApprove: string
  gmReject: string
  gmGrade: string

  // Settings
  settingsTitle: string
  settingsLanguage: string
  settingsNotifications: string

  // General
  level: string
  stage: string
  direction: string
  difficulty: string
  intensity: string
}

const ru: Translations = {
  appName: 'ONE! Profile',
  loading: 'Загрузка...',
  error: 'Ошибка',
  save: 'Сохранить',
  cancel: 'Отмена',
  delete: 'Удалить',
  edit: 'Редактировать',
  back: 'Назад',

  navProfile: 'Профиль',
  navMissions: 'Миссии',
  navSquad: 'Отряд',
  navBadges: 'Бейджи',
  navSettings: 'Настройки',

  profileTitle: 'Мой Профиль',
  profileLevel: 'Уровень',
  profileStage: 'Стадия',
  profileXp: 'Опыт',
  profileXpToNext: 'до следующего уровня',

  coins: 'Монеты',
  gems: 'Кристаллы',
  xp: 'Опыт',

  dirStrategy: 'Стратегия',
  dirLanguage: 'Язык',
  dirCommunication: 'Коммуникация',
  dirSport: 'Спорт',
  dirIt: 'IT',
  dirArt: 'Искусство',
  dirEntrepreneurship: 'Бизнес',

  shipTitle: 'Мой Корабль',
  shipStage: 'Стадия корабля',
  shipProgress: 'Прогресс',

  missionsTitle: 'Миссии',
  missionsPending: 'Ожидают',
  missionsCompleted: 'Выполнены',
  missionGrade: 'Оценка',
  missionXpReward: 'Награда XP',
  missionCoinsReward: 'Награда Монеты',

  dailyBonusTitle: 'Ежедневный Бонус',
  dailyBonusClaim: 'Получить бонус',
  dailyBonusClaimed: 'Бонус получен!',
  dailyBonusStreak: 'Серия дней',

  squadTitle: 'Мой Отряд',
  squadMembers: 'Участники',
  squadProgress: 'Прогресс отряда',
  squadShip: 'Корабль отряда',

  badgesTitle: 'Бейджи',
  badgesEarned: 'Получено',
  badgesLocked: 'Заблокировано',

  gmTitle: 'Панель Game Master',
  gmApprove: 'Одобрить',
  gmReject: 'Отклонить',
  gmGrade: 'Оценить',

  settingsTitle: 'Настройки',
  settingsLanguage: 'Язык',
  settingsNotifications: 'Уведомления',

  level: 'Уровень',
  stage: 'Стадия',
  direction: 'Направление',
  difficulty: 'Сложность',
  intensity: 'Интенсивность',
}

const en: Translations = {
  appName: 'ONE! Profile',
  loading: 'Loading...',
  error: 'Error',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  back: 'Back',

  navProfile: 'Profile',
  navMissions: 'Missions',
  navSquad: 'Squad',
  navBadges: 'Badges',
  navSettings: 'Settings',

  profileTitle: 'My Profile',
  profileLevel: 'Level',
  profileStage: 'Stage',
  profileXp: 'Experience',
  profileXpToNext: 'to next level',

  coins: 'Coins',
  gems: 'Gems',
  xp: 'XP',

  dirStrategy: 'Strategy',
  dirLanguage: 'Language',
  dirCommunication: 'Communication',
  dirSport: 'Sport',
  dirIt: 'IT',
  dirArt: 'Art & Design',
  dirEntrepreneurship: 'Entrepreneurship',

  shipTitle: 'My Ship',
  shipStage: 'Ship Stage',
  shipProgress: 'Progress',

  missionsTitle: 'Missions',
  missionsPending: 'Pending',
  missionsCompleted: 'Completed',
  missionGrade: 'Grade',
  missionXpReward: 'XP Reward',
  missionCoinsReward: 'Coins Reward',

  dailyBonusTitle: 'Daily Bonus',
  dailyBonusClaim: 'Claim Bonus',
  dailyBonusClaimed: 'Bonus Claimed!',
  dailyBonusStreak: 'Day Streak',

  squadTitle: 'My Squad',
  squadMembers: 'Members',
  squadProgress: 'Squad Progress',
  squadShip: 'Squad Ship',

  badgesTitle: 'Badges',
  badgesEarned: 'Earned',
  badgesLocked: 'Locked',

  gmTitle: 'Game Master Panel',
  gmApprove: 'Approve',
  gmReject: 'Reject',
  gmGrade: 'Grade',

  settingsTitle: 'Settings',
  settingsLanguage: 'Language',
  settingsNotifications: 'Notifications',

  level: 'Level',
  stage: 'Stage',
  direction: 'Direction',
  difficulty: 'Difficulty',
  intensity: 'Intensity',
}

const translations: Record<Locale, Translations> = { ru, en }

let currentLocale: Locale = 'ru'

export function setLocale(locale: Locale): void {
  currentLocale = locale
  localStorage.setItem('one-profile-locale', locale)
}

export function getLocale(): Locale {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('one-profile-locale') as Locale | null
    if (stored && (stored === 'ru' || stored === 'en')) {
      currentLocale = stored
    }
  }
  return currentLocale
}

export function t(key: keyof Translations): string {
  return translations[currentLocale][key]
}

export function getDirectionName(direction: string): string {
  const map: Record<string, keyof Translations> = {
    strategy: 'dirStrategy',
    language: 'dirLanguage',
    communication: 'dirCommunication',
    sport: 'dirSport',
    it: 'dirIt',
    art: 'dirArt',
    entrepreneurship: 'dirEntrepreneurship',
  }
  return t(map[direction] || 'dirStrategy')
}

export function getDirectionIcon(direction: string): string {
  const icons: Record<string, string> = {
    strategy: '👑',
    language: '🌍',
    communication: '💬',
    sport: '⚡',
    it: '💻',
    art: '🎨',
    entrepreneurship: '🚀',
  }
  return icons[direction] || '⭐'
}
