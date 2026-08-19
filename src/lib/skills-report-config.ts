// Skills Report config — competencies, DISC, professions from skills_report1-main

export interface Competency {
  id: string
  nameRu: string
  nameEn: string
  icon: string
  color: string
}

export const COMPETENCIES: Competency[] = [
  { id: 'communication', nameRu: 'Коммуникация', nameEn: 'Communication', icon: '💬', color: '#FBBF24' },
  { id: 'cooperation', nameRu: 'Кооперация', nameEn: 'Cooperation', icon: '🤝', color: '#22C55E' },
  { id: 'problem_solving', nameRu: 'Решение проблем', nameEn: 'Problem Solving', icon: '🧩', color: '#3B82F6' },
  { id: 'adaptability', nameRu: 'Адаптивность', nameEn: 'Adaptability', icon: '🔄', color: '#06B6D4' },
  { id: 'critical_thinking', nameRu: 'Критическое мышление', nameEn: 'Critical Thinking', icon: '🧠', color: '#8B5CF6' },
  { id: 'curiosity', nameRu: 'Любознательность', nameEn: 'Curiosity', icon: '🔍', color: '#EC4899' },
  { id: 'learning_ability', nameRu: 'Умение учиться', nameEn: 'Learning Ability', icon: '📚', color: '#0EA5E9' },
  { id: 'self_organization', nameRu: 'Самоорганизация', nameEn: 'Self-Organization', icon: '📋', color: '#6366F1' },
  { id: 'creativity', nameRu: 'Креативность', nameEn: 'Creativity', icon: '🎨', color: '#F59E0B' },
  { id: 'initiative', nameRu: 'Инициативность', nameEn: 'Initiative', icon: '🚀', color: '#EF4444' },
  { id: 'persistence', nameRu: 'Настойчивость', nameEn: 'Persistence', icon: '💪', color: '#A855F7' },
  { id: 'social_position', nameRu: 'Обществ. позиция', nameEn: 'Social Position', icon: '🏛', color: '#14B8A6' },
]

export const DISC_COLORS: Record<string, string> = {
  D: '#EF4444',
  I: '#FBBF24',
  S: '#22C55E',
  C: '#3B82F6',
}

export const DISC_SKILL_MAP: Record<string, string[]> = {
  D: ['initiative', 'persistence', 'problem_solving'],
  I: ['communication', 'creativity', 'social_position'],
  S: ['cooperation', 'adaptability', 'self_organization'],
  C: ['critical_thinking', 'learning_ability', 'curiosity'],
}

export const DISC_COMBO: Record<string, { labelRu: string; labelEn: string; color: string; descRu: string; descEn: string }> = {
  DI: { labelRu: 'Харизматичный лидер', labelEn: 'Charismatic Leader', color: '#EF4444', descRu: 'Ориентирован на результат через взаимодействие с людьми', descEn: 'Results-oriented through people interaction' },
  IS: { labelRu: 'Дипломат', labelEn: 'Diplomat', color: '#FBBF24', descRu: 'Умеет убеждать, сохраняя дружелюбную атмосферу', descEn: 'Persuasive while maintaining friendly atmosphere' },
  SC: { labelRu: 'Надёжный исполнитель', labelEn: 'Reliable Executor', color: '#22C55E', descRu: 'Качественно и методично выполняет задачи', descEn: 'Performs tasks thoroughly and methodically' },
  CD: { labelRu: 'Точный стратег', labelEn: 'Precise Strategist', color: '#3B82F6', descRu: 'Анализирует и находит самые эффективные решения', descEn: 'Analyzes and finds the most effective solutions' },
}

export interface TrackProfession {
  titleRu: string
  titleEn: string
  descRu: string
  descEn: string
}

export const TRACK_PROFESSIONS: Record<string, TrackProfession[]> = {
  media: [
    { titleRu: 'Видеограф', titleEn: 'Videographer', descRu: 'Снимает трендовое видео', descEn: 'Shoots trending video content' },
    { titleRu: 'Продюсер', titleEn: 'Producer', descRu: 'Презентует проект экспертам', descEn: 'Presents projects to experts' },
    { titleRu: 'Блогер', titleEn: 'Blogger', descRu: 'Создаёт научно-популярный блог', descEn: 'Creates science-popular blog' },
  ],
  eng: [
    { titleRu: 'Робототехник', titleEn: 'Robotics Engineer', descRu: 'Проектирует и собирает роботов', descEn: 'Designs and builds robots' },
    { titleRu: 'Аналитик данных', titleEn: 'Data Analyst', descRu: 'Анализирует данные и строит прогнозы', descEn: 'Analyzes data and builds forecasts' },
    { titleRu: 'Разработчик ИИ', titleEn: 'AI Developer', descRu: 'Создаёт интеллектуальные системы', descEn: 'Creates intelligent systems' },
  ],
  bio: [
    { titleRu: 'Биоинженер', titleEn: 'Bioengineer', descRu: 'Разрабатывает биологические решения', descEn: 'Develops biological solutions' },
    { titleRu: 'Агротехнолог', titleEn: 'Agrotechnologist', descRu: 'Внедряет методы выращивания', descEn: 'Implements growing methods' },
    { titleRu: 'Генетик', titleEn: 'Geneticist', descRu: 'Изучает генетический код', descEn: 'Studies genetic code' },
  ],
  english: [
    { titleRu: 'Глобальный коммуникатор', titleEn: 'Global Communicator', descRu: 'Работает в международных командах', descEn: 'Works in international teams' },
    { titleRu: 'Нарративный дизайнер', titleEn: 'Narrative Designer', descRu: 'Создаёт истории и сценарии', descEn: 'Creates stories and scripts' },
    { titleRu: 'Ведущий мероприятий', titleEn: 'Event Host', descRu: 'Ведёт события перед аудиторией', descEn: 'Hosts events for audiences' },
  ],
}

export interface KtpTask {
  day: number
  track: string
  nameRu: string
  nameEn: string
  descRu: string
  descEn: string
  skills: string[]
}

export const KTP: KtpTask[] = [
  { day: 1, track: 'bio', nameRu: 'Анализ субстратов', nameEn: 'Substrate Analysis', descRu: 'Изучаем агровату, кокос, гидрогель', descEn: 'Study coconut, hydrogel substrates', skills: ['critical_thinking', 'learning_ability'] },
  { day: 1, track: 'eng', nameRu: 'Основы Редстоуна', nameEn: 'Redstone Basics', descRu: 'Сборка электрической цепи', descEn: 'Build an electric circuit', skills: ['problem_solving', 'self_organization'] },
  { day: 1, track: 'media', nameRu: 'Хук Мистера Биста', nameEn: 'MrBeast Hook', descRu: 'Видеодневник, селфи-обращение', descEn: 'Video diary, selfie intro', skills: ['communication', 'creativity'] },
  { day: 1, track: 'english', nameRu: 'Human Bingo', nameEn: 'Human Bingo', descRu: 'Знакомство на английском', descEn: 'Getting to know each other in English', skills: ['communication', 'cooperation', 'initiative'] },
  { day: 2, track: 'bio', nameRu: 'Посадка лута', nameEn: 'Lut Planting', descRu: 'Посадка редиса и кресс-салата', descEn: 'Planting radish and cress', skills: ['cooperation', 'adaptability'] },
  { day: 2, track: 'eng', nameRu: 'Ветряк для базы', nameEn: 'Base Wind Turbine', descRu: 'Моторчик + лопасти = LED от ветра', descEn: 'Motor + blades = LED from wind', skills: ['creativity', 'adaptability'] },
  { day: 2, track: 'media', nameRu: 'B-roll репортаж', nameEn: 'B-roll Report', descRu: 'Макросъёмка, интервью', descEn: 'Macro shooting, interviews', skills: ['communication', 'cooperation'] },
  { day: 2, track: 'english', nameRu: 'Camp Olympics', nameEn: 'Camp Olympics', descRu: 'Олимпиада с заданиями на английском', descEn: 'Olympics with English tasks', skills: ['learning_ability', 'adaptability', 'persistence'] },
  { day: 3, track: 'bio', nameRu: 'Крафт фильтра', nameEn: 'Filter Craft', descRu: 'Многоуровневый фильтр воды', descEn: 'Multi-level water filter', skills: ['problem_solving', 'self_organization'] },
  { day: 3, track: 'eng', nameRu: 'Умный полив', nameEn: 'Smart Irrigation', descRu: 'Датчик влажности + Micro:bit', descEn: 'Moisture sensor + Micro:bit', skills: ['learning_ability', 'problem_solving'] },
  { day: 3, track: 'media', nameRu: 'Научпоп обзор', nameEn: 'Science Review', descRu: 'Научная коммуникация', descEn: 'Science communication', skills: ['learning_ability', 'critical_thinking'] },
  { day: 3, track: 'english', nameRu: 'Treasure Hunt', nameEn: 'Treasure Hunt', descRu: 'Квест с подсказками на английском', descEn: 'Quest with English clues', skills: ['problem_solving', 'curiosity', 'persistence'] },
  { day: 4, track: 'bio', nameRu: 'Дыхание растений', nameEn: 'Plant Breathing', descRu: 'Наблюдение фотосинтеза', descEn: 'Observe photosynthesis', skills: ['curiosity', 'critical_thinking'] },
  { day: 4, track: 'eng', nameRu: 'Солнечная панель', nameEn: 'Solar Panel', descRu: 'Вентилятор от солнечной панели', descEn: 'Fan from solar panel', skills: ['initiative', 'adaptability'] },
  { day: 4, track: 'media', nameRu: 'Stop-Motion', nameEn: 'Stop-Motion', descRu: 'Анимация из пластилина', descEn: 'Clay animation', skills: ['creativity', 'problem_solving'] },
  { day: 4, track: 'english', nameRu: 'Design a Superhero', nameEn: 'Design a Superhero', descRu: 'Супергерой на английском', descEn: 'Superhero in English', skills: ['creativity', 'communication', 'social_position'] },
  { day: 5, track: 'bio', nameRu: 'Враждебные мобы', nameEn: 'Hostile Mobs', descRu: 'Микроскоп: корешки vs плесень', descEn: 'Microscope: roots vs mold', skills: ['critical_thinking', 'persistence'] },
  { day: 5, track: 'eng', nameRu: 'Термо-щит', nameEn: 'Thermo Shield', descRu: 'Датчик температуры → авто-вентилятор', descEn: 'Temperature sensor → auto fan', skills: ['critical_thinking', 'self_organization'] },
  { day: 5, track: 'media', nameRu: 'Эко-Челлендж', nameEn: 'Eco Challenge', descRu: 'Вертикальный ролик с экопризывом', descEn: 'Vertical eco-appeal video', skills: ['initiative', 'social_position'] },
  { day: 5, track: 'english', nameRu: 'Mission Impossible', nameEn: 'Mission Impossible', descRu: 'Командная спецоперация', descEn: 'Team special operation', skills: ['cooperation', 'self_organization', 'problem_solving'] },
  { day: 6, track: 'bio', nameRu: 'Зелёная химия', nameEn: 'Green Chemistry', descRu: 'pH-индикатор из капусты', descEn: 'pH indicator from cabbage', skills: ['curiosity', 'learning_ability'] },
  { day: 6, track: 'eng', nameRu: 'Авто-Свет', nameEn: 'Auto Light', descRu: 'Фоторезистор → авто-лампочка', descEn: 'Photoresistor → auto light', skills: ['creativity', 'learning_ability'] },
  { day: 6, track: 'media', nameRu: 'Рум-тур по Базе', nameEn: 'Base Room Tour', descRu: 'Динамичный обзор', descEn: 'Dynamic overview', skills: ['communication', 'adaptability'] },
  { day: 6, track: 'english', nameRu: 'Camp Newsroom', nameEn: 'Camp Newsroom', descRu: 'Новостной выпуск лагеря', descEn: 'Camp news broadcast', skills: ['communication', 'cooperation', 'creativity'] },
  { day: 7, track: 'bio', nameRu: 'Сбор статистики', nameEn: 'Stats Collection', descRu: 'Измерение роста, график', descEn: 'Growth measurement, graph', skills: ['learning_ability', 'problem_solving'] },
  { day: 7, track: 'eng', nameRu: 'Анти-Грифер', nameEn: 'Anti-Griefer', descRu: 'Геркон → зуммер при вторжении', descEn: 'Reed switch → buzzer on intrusion', skills: ['initiative', 'persistence'] },
  { day: 7, track: 'media', nameRu: 'Срочные новости', nameEn: 'Breaking News', descRu: 'Сценка «взлом базы»', descEn: '"Base hack" skit', skills: ['creativity', 'persistence'] },
  { day: 7, track: 'english', nameRu: 'Story Cubes', nameEn: 'Story Cubes', descRu: 'Истории из кубиков на английском', descEn: 'Stories from cubes in English', skills: ['communication', 'creativity', 'critical_thinking'] },
  { day: 8, track: 'bio', nameRu: 'Лутаем еду!', nameEn: 'Loot Food!', descRu: 'Срезание микрозелени, бутерброды', descEn: 'Harvesting microgreens, sandwiches', skills: ['initiative', 'cooperation'] },
  { day: 8, track: 'eng', nameRu: 'Финальный коннект', nameEn: 'Final Connect', descRu: 'Подключение всего вместе', descEn: 'Connect everything together', skills: ['cooperation', 'problem_solving'] },
  { day: 8, track: 'media', nameRu: 'Премьера фильма', nameEn: 'Film Premiere', descRu: '3-мин ролик, просмотр', descEn: '3-min video, screening', skills: ['cooperation', 'communication'] },
  { day: 8, track: 'english', nameRu: 'Detective Mystery', nameEn: 'Detective Mystery', descRu: 'Детективная загадка на английском', descEn: 'Detective mystery in English', skills: ['critical_thinking', 'curiosity', 'problem_solving'] },
  { day: 9, track: 'bio', nameRu: 'Оптимизация урожая', nameEn: 'Harvest Optimization', descRu: 'Анализ данных роста', descEn: 'Growth data analysis', skills: ['problem_solving', 'critical_thinking'] },
  { day: 9, track: 'eng', nameRu: 'Оптимизация энергии', nameEn: 'Energy Optimization', descRu: 'Подсчёт и оптимизация', descEn: 'Count and optimization', skills: ['critical_thinking', 'learning_ability'] },
  { day: 9, track: 'media', nameRu: 'Бэкстейдж', nameEn: 'Backstage', descRu: 'Закулисье, интервью', descEn: 'Behind the scenes, interviews', skills: ['curiosity', 'learning_ability'] },
  { day: 9, track: 'english', nameRu: 'Adverts & Commercial', nameEn: 'Adverts & Commercial', descRu: 'Рекламный ролик на английском', descEn: 'English commercial', skills: ['communication', 'creativity', 'initiative'] },
  { day: 10, track: 'bio', nameRu: 'Финальный сбор', nameEn: 'Final Harvest', descRu: 'Торжественный сбор, презентация', descEn: 'Ceremonial harvest, presentation', skills: ['communication', 'initiative'] },
  { day: 10, track: 'eng', nameRu: 'Технический рум-тур', nameEn: 'Technical Room Tour', descRu: 'Трубопровод, вентиляция, лазер', descEn: 'Piping, ventilation, laser', skills: ['communication', 'initiative'] },
  { day: 10, track: 'media', nameRu: 'Аналитика и CTR', nameEn: 'Analytics & CTR', descRu: 'Анализ метрик', descEn: 'Metrics analysis', skills: ['critical_thinking', 'problem_solving'] },
  { day: 10, track: 'english', nameRu: 'Talent Show', nameEn: 'Talent Show', descRu: 'Шоу талантов, финальное выступление', descEn: 'Talent show, final performance', skills: ['communication', 'social_position', 'self_organization'] },
]

export const TRACK_NAMES: Record<string, { ru: string; en: string; icon: string }> = {
  bio: { ru: 'BioTech', en: 'BioTech', icon: '🌱' },
  eng: { ru: 'Engineering', en: 'Engineering', icon: '⚙️' },
  media: { ru: 'Media', en: 'Media', icon: '🎬' },
  english: { ru: 'English', en: 'English', icon: '🌍' },
}

export const REPORT_LEVELS = [
  { min: 0, nameRu: 'Новичок', nameEn: 'Newcomer', icon: '🛡️' },
  { min: 50, nameRu: 'Разведчик', nameEn: 'Scout', icon: '⚔️' },
  { min: 120, nameRu: 'Исследователь', nameEn: 'Explorer', icon: '🔭' },
  { min: 220, nameRu: 'Мастер', nameEn: 'Master', icon: '🏆' },
  { min: 340, nameRu: 'Легенда', nameEn: 'Legend', icon: '👑' },
]

// Compute competency scores from observations
export function computeCompetencyScores(observations: Array<{
  track: string
  day: number
  independence: number
  quality: number
  initiative: boolean
}>): Record<string, number> {
  const scores: Record<string, { sum: number; count: number }> = {}
  COMPETENCIES.forEach(c => { scores[c.id] = { sum: 0, count: 0 } })

  for (const obs of observations) {
    const ktpEntry = KTP.find(k => k.day === obs.day && k.track === obs.track)
    if (!ktpEntry) continue
    const avgScore = (obs.independence + obs.quality) / 2
    const initiativeBonus = obs.initiative ? 1 : 0
    for (const skillId of ktpEntry.skills) {
      if (scores[skillId]) {
        scores[skillId].sum += avgScore + initiativeBonus
        scores[skillId].count += 1
      }
    }
  }

  const result: Record<string, number> = {}
  for (const [id, s] of Object.entries(scores)) {
    result[id] = s.count > 0 ? Math.min(100, Math.round((s.sum / s.count / 6) * 100)) : 0
  }
  return result
}

// Compute DISC profile from competency scores
export function computeDISC(scores: Record<string, number>): { type: string; values: Record<string, number>; combo: string | null } {
  const discValues: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 }
  const discMax: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 }

  for (const [type, skillIds] of Object.entries(DISC_SKILL_MAP)) {
    for (const skillId of skillIds) {
      discValues[type] += scores[skillId] || 0
      discMax[type] += 100
    }
  }

  const discPct: Record<string, number> = {}
  for (const type of Object.keys(discValues)) {
    discPct[type] = Math.max(10, Math.round((discValues[type] / discMax[type]) * 100))
  }

  const sorted = Object.entries(discPct).sort((a, b) => b[1] - a[1])
  const dominant = sorted[0][0]
  const second = sorted[1][0]
  const combo = DISC_COMBO[dominant + second] ? dominant + second : null

  return { type: dominant, values: discPct, combo }
}

// Score professions for a student
export function scoreProfessions(
  compScores: Record<string, number>,
  observations: Array<{ track: string }>
): Array<{ titleRu: string; titleEn: string; descRu: string; descEn: string; score: number }> {
  const trackCounts: Record<string, number> = {}
  for (const obs of observations) {
    trackCounts[obs.track] = (trackCounts[obs.track] || 0) + 1
  }
  const totalObs = observations.length || 1

  const allProfessions: Array<{ titleRu: string; titleEn: string; descRu: string; descEn: string; score: number }> = []

  for (const [track, profs] of Object.entries(TRACK_PROFESSIONS)) {
    const trackScore = ((trackCounts[track] || 0) / totalObs) * 40
    for (const prof of profs) {
      const competencyBonus = Object.values(compScores).reduce((a, b) => a + b, 0) / Object.keys(compScores).length * 0.25
      const initiativeBonus = (compScores.initiative || 0) > 60 ? 15 : 0
      const score = Math.min(100, Math.round(trackScore + competencyBonus + initiativeBonus))
      allProfessions.push({ ...prof, score })
    }
  }

  return allProfessions.sort((a, b) => b.score - a.score).slice(0, 5)
}

// Get report level from observations count
export function getReportLevel(obsCount: number, badgeCount: number): { level: number; nameRu: string; nameEn: string; icon: string; xp: number } {
  const xp = Math.round(obsCount * 3.5 + badgeCount * 9)
  let current = REPORT_LEVELS[0]
  let lvl = 1
  for (let i = REPORT_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= REPORT_LEVELS[i].min) {
      current = REPORT_LEVELS[i]
      lvl = i + 1
      break
    }
  }
  return { level: lvl, nameRu: current.nameRu, nameEn: current.nameEn, icon: current.icon, xp }
}
