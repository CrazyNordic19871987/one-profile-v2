export type Locale = 'ru' | 'en'

export interface Translations {
  appName: string
  loading: string
  error: string
  save: string
  cancel: string
  delete: string
  edit: string
  back: string
  retry: string
  tutorial: string
  start: string
  next: string
  skip: string

  navProfile: string
  navMissions: string
  navSquad: string
  navBadges: string
  navSettings: string
  navSport: string
  navProjects: string
  navDirections: string
  navPerks: string
  navShip: string
  navPrestige: string
  navGM: string

  profileTitle: string
  profileLevel: string
  profileStage: string
  profileXp: string
  profileXpToNext: string

  coins: string
  gems: string
  xp: string

  dirStrategy: string
  dirLanguage: string
  dirCommunication: string
  dirSport: string
  dirIt: string
  dirArt: string
  dirEntrepreneurship: string
  dirStrategyDesc: string
  dirLanguageDesc: string
  dirCommunicationDesc: string
  dirSportDesc: string
  dirItDesc: string
  dirArtDesc: string
  dirEntrepreneurshipDesc: string

  shipTitle: string
  shipStage: string
  shipProgress: string
  shipEvolution: string
  shipCustomization: string
  shipLevelsToNext: string
  shipMaxReached: string
  shipNext: string
  shipUnlocksAt: string
  shipOwned: string
  shipAll: string

  missionsTitle: string
  missionsPending: string
  missionsCompleted: string
  missionGrade: string
  missionXpReward: string
  missionCoinsReward: string
  missionStart: string
  missionAwaitingGrade: string
  missionGraded: string
  missionCompleted: string

  dailyBonusTitle: string
  dailyBonusClaim: string
  dailyBonusClaimed: string
  dailyBonusStreak: string
  dailyBonusNext: string
  dailyBonusDay7: string
  dailyBonusClaiming: string
  dailyBonusAlreadyClaimed: string

  squadTitle: string
  squadMembers: string
  squadProgress: string
  squadShip: string
  squadNoYet: string
  squadNoYetDesc: string
  squadLevel: string
  squadUnknown: string

  badgesTitle: string
  badgesEarned: string
  badgesLocked: string
  badgesCollection: string

  gmTitle: string
  gmApprove: string
  gmReject: string
  gmGrade: string
  gmPending: string
  gmAllCaughtUp: string
  gmNoMissions: string
  gmGradeLabel: string
  gmGradeMission: string
  gmStudent: string
  gmExcellent: string
  gmGood: string
  gmAverage: string
  gmBelowAverage: string
  gmPoor: string

  perksTitle: string
  perksActive: string
  perksNoneActive: string

  prestigeTitle: string
  prestigeConstellations: string
  prestigeStarConstellations: string
  prestigeReachLevel: string
  prestigeCurrentBonus: string
  prestigeResetConfirm: string
  prestigeNow: string
  prestigeBonus: string
  prestigeOf: string

  sportTracker: string
  sportAddSession: string
  sportTotalXp: string
  sportTotalMinutes: string
  sportActivity: string
  sportPlaceholder: string
  sportDuration: string
  sportIntensity: string
  sportEstimatedXp: string
  sportSave: string

  projectTracker: string
  projectNew: string
  projectActive: string
  projectCompleted: string
  projectTotalXp: string
  projectTitle: string
  projectTitlePlaceholder: string
  projectDescription: string
  projectDescPlaceholder: string
  projectCreate: string
  projectMilestones: string
  projectMilestone: string

  leaderboardTitle: string
  leaderboardNoStudents: string
  leaderboardYou: string

  squadShipTitle: string
  squadShipMembers: string

  tutorialWelcome: string
  tutorialWelcomeDesc: string
  tutorialShip: string
  tutorialShipDesc: string
  tutorialDirections: string
  tutorialDirectionsDesc: string
  tutorialMissions: string
  tutorialMissionsDesc: string
  tutorialSquad: string
  tutorialSquadDesc: string
  tutorialReady: string
  tutorialReadyDesc: string

  careerTitle: string
  careerYourPath: string
  careerBasedOn: string
  careerAnswersShowed: string
  careerStartJourney: string

  level: string
  stage: string
  direction: string
  difficulty: string
  intensity: string
}

const ru: Translations = {
  appName: 'ONE! Профиль',
  loading: 'Загрузка...',
  error: 'Ошибка',
  save: 'Сохранить',
  cancel: 'Отмена',
  delete: 'Удалить',
  edit: 'Редактировать',
  back: 'Назад',
  retry: 'Повторить',
  tutorial: 'Обучение',
  start: 'Начать',
  next: 'Далее',
  skip: 'Пропустить',

  navProfile: 'Профиль',
  navMissions: 'Миссии',
  navSquad: 'Отряд',
  navBadges: 'Бейджи',
  navSettings: 'Настройки',
  navSport: 'Спорт',
  navProjects: 'Проекты',
  navDirections: 'Направления',
  navPerks: 'Перки',
  navShip: 'Корабль',
  navPrestige: 'Престиж',
  navGM: 'ГМ',

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
  dirIt: 'ИТ',
  dirArt: 'Искусство',
  dirEntrepreneurship: 'Бизнес',
  dirStrategyDesc: 'Принимать решения, планировать, руководить командами',
  dirLanguageDesc: 'Изучать языки, общаться с миром',
  dirCommunicationDesc: 'Презентовать идеи, работать в команде, разрешать конфликты',
  dirSportDesc: 'Быть активным, тренироваться, соревноваться',
  dirItDesc: 'Кодить, создавать, исправлять, делать технологии',
  dirArtDesc: 'Рисовать, создавать, выражать себя визуально',
  dirEntrepreneurshipDesc: 'Инновации, руководить проектами, бизнес-мышление',

  shipTitle: 'Мой Корабль',
  shipStage: 'Стадия корабля',
  shipProgress: 'Прогресс',
  shipEvolution: 'Эволюция корабля',
  shipCustomization: 'Кастомизация корабля',
  shipLevelsToNext: 'уровней до следующей эволюции',
  shipMaxReached: 'Максимальная эволюция достигнута!',
  shipNext: 'Далее:',
  shipUnlocksAt: 'Откроется на уровне',
  shipOwned: 'Куплено',
  shipAll: 'Все',

  missionsTitle: 'Миссии',
  missionsPending: 'Ожидают',
  missionsCompleted: 'Выполнены',
  missionGrade: 'Оценка',
  missionXpReward: 'Награда XP',
  missionCoinsReward: 'Награда Монеты',
  missionStart: 'Начать',
  missionAwaitingGrade: 'Ожидает оценки',
  missionGraded: 'Оценка:',
  missionCompleted: 'Выполнено!',

  dailyBonusTitle: 'Ежедневный Бонус',
  dailyBonusClaim: 'Получить бонус',
  dailyBonusClaimed: 'Бонус получен!',
  dailyBonusStreak: 'Серия дней',
  dailyBonusNext: 'Следующий бонус',
  dailyBonusDay7: 'День 7 = бонусные кристаллы!',
  dailyBonusClaiming: 'Получение...',
  dailyBonusAlreadyClaimed: 'Уже получен',

  squadTitle: 'Мой Отряд',
  squadMembers: 'Участники',
  squadProgress: 'Прогресс отряда',
  squadShip: 'Корабль отряда',
  squadNoYet: 'Отряда пока нет',
  squadNoYetDesc: 'Вас ещё не зачислили в отряд. Подождите, пока Game Master вас назначит.',
  squadLevel: 'Уровень отряда',
  squadUnknown: 'Неизвестно',

  badgesTitle: 'Бейджи',
  badgesEarned: 'Получено',
  badgesLocked: 'Заблокировано',
  badgesCollection: 'Коллекция бейджей',

  gmTitle: 'Панель Game Master',
  gmApprove: 'Одобрить',
  gmReject: 'Отклонить',
  gmGrade: 'Оценить',
  gmPending: 'ожидает',
  gmAllCaughtUp: 'Всё оценено!',
  gmNoMissions: 'Нет миссий для оценки',
  gmGradeLabel: 'Оценка (1-5)',
  gmGradeMission: 'Оценить миссию',
  gmStudent: 'Ученик:',
  gmExcellent: 'Отлично',
  gmGood: 'Хорошо',
  gmAverage: 'Нормально',
  gmBelowAverage: 'Ниже среднего',
  gmPoor: 'Плохо',

  perksTitle: 'Перки',
  perksActive: 'активно',
  perksNoneActive: 'Нет активных перков. Выберите до 3 ниже.',

  prestigeTitle: 'Престиж',
  prestigeConstellations: 'Созвездия:',
  prestigeStarConstellations: 'Звёздные Созвездия',
  prestigeReachLevel: 'Достигните уровня {level}, чтобы престижовать и открыть новое созвездие',
  prestigeCurrentBonus: 'Текущий бонус',
  prestigeResetConfirm: 'Сбросить на уровень 1 и открыть созвездие {name}?',
  prestigeNow: 'Престиж!',
  prestigeBonus: 'Бонус:',
  prestigeOf: 'из',

  sportTracker: 'Трекер Спорта',
  sportAddSession: '+ Добавить',
  sportTotalXp: 'Всего XP',
  sportTotalMinutes: 'Всего минут',
  sportActivity: 'Активность',
  sportPlaceholder: 'Бег, Плавание, Йога...',
  sportDuration: 'Длительность (мин)',
  sportIntensity: 'Интенсивность',
  sportEstimatedXp: 'Примерный XP:',
  sportSave: 'Сохранить',

  projectTracker: 'Трекер Проектов',
  projectNew: '+ Новый проект',
  projectActive: 'Активные',
  projectCompleted: 'Завершены',
  projectTotalXp: 'Всего XP',
  projectTitle: 'Название проекта',
  projectTitlePlaceholder: 'Мой крутой проект...',
  projectDescription: 'Описание',
  projectDescPlaceholder: 'О чём этот проект?',
  projectCreate: 'Создать проект',
  projectMilestones: 'Вехи',
  projectMilestone: '+ Веха',

  leaderboardTitle: 'Рейтинг',
  leaderboardNoStudents: 'Пока нет учеников',
  leaderboardYou: '(вы)',

  squadShipTitle: 'Корабль отряда',
  squadShipMembers: 'участников',

  tutorialWelcome: 'Добро пожаловать в ONE! Профиль!',
  tutorialWelcomeDesc: 'Вы теперь Космический Исследователь! Ваша задача — развивать навыки, выполнять миссии и строить корабль.',
  tutorialShip: 'Ваш корабль',
  tutorialShipDesc: 'Ваш корабль развивается вместе с вашим уровнем. Начните с Разведчика и станьте Дредноутом!',
  tutorialDirections: '7 Направлений',
  tutorialDirectionsDesc: 'Исследуйте Стратегию, Язык, Коммуникацию, Спорт, ИТ, Искусство и Бизнес. У каждого направления свои навыки.',
  tutorialMissions: 'Миссии',
  tutorialMissionsDesc: 'Выполняйте миссии, чтобы заработать XP и Монеты. Ваш Game Master будет оценивать вашу работу.',
  tutorialSquad: 'Ваш отряд',
  tutorialSquadDesc: 'Присоединяйтесь к отряду и работайте вместе! Корабль отряда растёт благодаря вкладу каждого.',
  tutorialReady: 'Готовы начать!',
  tutorialReadyDesc: 'Начните своё путешествие! Выполняйте миссии, исследуйте направления и станьте Космической Легендой!',

  careerTitle: 'Карьера',
  careerYourPath: 'Ваш путь:',
  careerBasedOn: 'На основе ваших ответов, вам стоит сосредоточиться на',
  careerAnswersShowed: 'Ваши ответы показали:',
  careerStartJourney: 'Начать путешествие',

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
  retry: 'Retry',
  tutorial: 'Tutorial',
  start: 'Start',
  next: 'Next',
  skip: 'Skip',

  navProfile: 'Profile',
  navMissions: 'Missions',
  navSquad: 'Squad',
  navBadges: 'Badges',
  navSettings: 'Settings',
  navSport: 'Sport',
  navProjects: 'Projects',
  navDirections: 'Directions',
  navPerks: 'Perks',
  navShip: 'Ship',
  navPrestige: 'Prestige',
  navGM: 'GM',

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
  dirStrategyDesc: 'Make decisions, plan ahead, lead teams',
  dirLanguageDesc: 'Learn languages, communicate globally',
  dirCommunicationDesc: 'Present ideas, work in teams, resolve conflicts',
  dirSportDesc: 'Stay active, build endurance, compete fairly',
  dirItDesc: 'Code, build, debug, create technology',
  dirArtDesc: 'Design, create, express yourself visually',
  dirEntrepreneurshipDesc: 'Innovate, lead projects, think business',

  shipTitle: 'My Ship',
  shipStage: 'Ship Stage',
  shipProgress: 'Progress',
  shipEvolution: 'Ship Evolution',
  shipCustomization: 'Ship Customization',
  shipLevelsToNext: 'levels to next evolution',
  shipMaxReached: 'Maximum evolution reached!',
  shipNext: 'Next:',
  shipUnlocksAt: 'Unlocks at level',
  shipOwned: 'Owned',
  shipAll: 'All',

  missionsTitle: 'Missions',
  missionsPending: 'Pending',
  missionsCompleted: 'Completed',
  missionGrade: 'Grade',
  missionXpReward: 'XP Reward',
  missionCoinsReward: 'Coins Reward',
  missionStart: 'Start',
  missionAwaitingGrade: 'Awaiting grade',
  missionGraded: 'Graded:',
  missionCompleted: 'Completed!',

  dailyBonusTitle: 'Daily Bonus',
  dailyBonusClaim: 'Claim Bonus',
  dailyBonusClaimed: 'Bonus Claimed!',
  dailyBonusStreak: 'Day Streak',
  dailyBonusNext: 'Next Bonus',
  dailyBonusDay7: 'Day 7 = Bonus gems!',
  dailyBonusClaiming: 'Claiming...',
  dailyBonusAlreadyClaimed: 'Already Claimed',

  squadTitle: 'My Squad',
  squadMembers: 'Members',
  squadProgress: 'Squad Progress',
  squadShip: 'Squad Ship',
  squadNoYet: 'No Squad Yet',
  squadNoYetDesc: "You haven't been assigned to a squad yet. Wait for your Game Master to assign you.",
  squadLevel: 'Squad Level',
  squadUnknown: 'Unknown',

  badgesTitle: 'Badges',
  badgesEarned: 'Earned',
  badgesLocked: 'Locked',
  badgesCollection: 'Badge Collection',

  gmTitle: 'Game Master Panel',
  gmApprove: 'Approve',
  gmReject: 'Reject',
  gmGrade: 'Grade',
  gmPending: 'pending',
  gmAllCaughtUp: 'All caught up!',
  gmNoMissions: 'No missions to grade right now.',
  gmGradeLabel: 'Grade (1-5)',
  gmGradeMission: 'Grade Mission',
  gmStudent: 'Student:',
  gmExcellent: 'Excellent',
  gmGood: 'Good',
  gmAverage: 'Average',
  gmBelowAverage: 'Below Average',
  gmPoor: 'Poor',

  perksTitle: 'Perks',
  perksActive: 'active',
  perksNoneActive: 'No perks active. Select up to 3 below.',

  prestigeTitle: 'Prestige',
  prestigeConstellations: 'Constellations:',
  prestigeStarConstellations: 'Star Constellations',
  prestigeReachLevel: 'Reach level {level} to prestige and unlock a new constellation',
  prestigeCurrentBonus: 'Current Bonus',
  prestigeResetConfirm: 'Reset to level 1 and unlock {name} constellation?',
  prestigeNow: 'Prestige Now!',
  prestigeBonus: 'Bonus:',
  prestigeOf: 'of',

  sportTracker: 'Sport Tracker',
  sportAddSession: '+ Add Session',
  sportTotalXp: 'Total XP Earned',
  sportTotalMinutes: 'Total Minutes',
  sportActivity: 'Activity',
  sportPlaceholder: 'Running, Swimming, Yoga...',
  sportDuration: 'Duration (minutes)',
  sportIntensity: 'Intensity',
  sportEstimatedXp: 'Estimated XP:',
  sportSave: 'Save Session',

  projectTracker: 'Project Tracker',
  projectNew: '+ New Project',
  projectActive: 'Active',
  projectCompleted: 'Completed',
  projectTotalXp: 'Total XP',
  projectTitle: 'Project Title',
  projectTitlePlaceholder: 'My awesome project...',
  projectDescription: 'Description',
  projectDescPlaceholder: 'What is this project about?',
  projectCreate: 'Create Project',
  projectMilestones: 'Milestones',
  projectMilestone: '+ Milestone',

  leaderboardTitle: 'Leaderboard',
  leaderboardNoStudents: 'No students yet',
  leaderboardYou: '(you)',

  squadShipTitle: 'Squad Ship',
  squadShipMembers: 'members contributing',

  tutorialWelcome: 'Welcome to ONE! Profile!',
  tutorialWelcomeDesc: 'You are now a Space Explorer! Your mission is to develop skills, complete missions, and build your ship.',
  tutorialShip: 'Your Ship',
  tutorialShipDesc: 'Your ship evolves as you level up. Start as a Scout Pod and grow into a Dreadnought!',
  tutorialDirections: '7 Directions',
  tutorialDirectionsDesc: 'Explore Strategy, Language, Communication, Sport, IT, Art, and Entrepreneurship. Each direction has its own skills.',
  tutorialMissions: 'Missions',
  tutorialMissionsDesc: 'Complete missions to earn XP and Coins. Your Game Master will grade your work.',
  tutorialSquad: 'Your Squad',
  tutorialSquadDesc: "Join a squad and work together! Your squad ship grows with everyone's contributions.",
  tutorialReady: 'Ready to Start!',
  tutorialReadyDesc: 'Begin your journey! Complete missions, explore directions, and become a Space Legend!',

  careerTitle: 'Career Test',
  careerYourPath: 'Your Path:',
  careerBasedOn: 'Based on your answers, you should focus on',
  careerAnswersShowed: 'Your answers showed:',
  careerStartJourney: 'Start Your Journey',

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

export function getDirectionDesc(direction: string): string {
  const map: Record<string, keyof Translations> = {
    strategy: 'dirStrategyDesc',
    language: 'dirLanguageDesc',
    communication: 'dirCommunicationDesc',
    sport: 'dirSportDesc',
    it: 'dirItDesc',
    art: 'dirArtDesc',
    entrepreneurship: 'dirEntrepreneurshipDesc',
  }
  return t(map[direction] || 'dirStrategyDesc')
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
