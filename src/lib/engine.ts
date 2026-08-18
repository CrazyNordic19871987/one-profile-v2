import type { Direction } from '../types/database'

// === XP & Level Constants ===

export const MAX_LEVEL = 100
export const LEVEL_XP_BASE = 80
export const LEVEL_XP_LINEAR = 20
export const LEVEL_XP_QUADRATIC = 2

// === Ship Stages ===

export type ShipStage = 'Scout Pod' | 'Explorer' | 'Cruiser' | 'Battleship' | 'Dreadnought'

export const SHIP_STAGES: { stage: ShipStage; minLevel: number; maxLevel: number }[] = [
  { stage: 'Scout Pod', minLevel: 1, maxLevel: 10 },
  { stage: 'Explorer', minLevel: 11, maxLevel: 25 },
  { stage: 'Cruiser', minLevel: 26, maxLevel: 50 },
  { stage: 'Battleship', minLevel: 51, maxLevel: 100 },
  { stage: 'Dreadnought', minLevel: 101, maxLevel: Infinity },
]

// === Directions ===

export const DIRECTIONS: { id: Direction; name: string; nameEn: string; icon: string; color: string }[] = [
  { id: 'strategy', name: 'Стратегия', nameEn: 'Strategy', icon: '👑', color: '#7C4DFF' },
  { id: 'language', name: 'Язык', nameEn: 'Language', icon: '🌍', color: '#448AFF' },
  { id: 'communication', name: 'Коммуникация', nameEn: 'Communication', icon: '💬', color: '#FF6E84' },
  { id: 'sport', name: 'Спорт', nameEn: 'Sport', icon: '⚡', color: '#69F0AE' },
  { id: 'it', name: 'IT', nameEn: 'IT', icon: '💻', color: '#00E5FF' },
  { id: 'art', name: 'Искусство', nameEn: 'Art & Design', icon: '🎨', color: '#FFAB40' },
  { id: 'entrepreneurship', name: 'Бизнес', nameEn: 'Entrepreneurship', icon: '🚀', color: '#FFD740' },
]

// === XP Functions ===

export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0
  return LEVEL_XP_BASE + (level - 1) * LEVEL_XP_LINEAR + Math.pow(level - 1, 2) * LEVEL_XP_QUADRATIC
}

export function totalXpForLevel(level: number): number {
  let total = 0
  for (let i = 2; i <= level; i++) {
    total += xpRequiredForLevel(i)
  }
  return total
}

export function levelFromXp(totalXp: number): number {
  let level = 1
  let xpUsed = 0

  while (level < MAX_LEVEL) {
    const xpNeeded = xpRequiredForLevel(level + 1)
    if (xpUsed + xpNeeded > totalXp) break
    xpUsed += xpNeeded
    level++
  }

  return level
}

export function xpInLevel(totalXp: number): number {
  let level = 1
  let xpUsed = 0

  while (level < MAX_LEVEL) {
    const xpNeeded = xpRequiredForLevel(level + 1)
    if (xpUsed + xpNeeded > totalXp) return totalXp - xpUsed
    xpUsed += xpNeeded
    level++
  }

  return 0
}

export function xpToNextLevel(totalXp: number): number {
  const level = levelFromXp(totalXp)
  if (level >= MAX_LEVEL) return 0
  return xpRequiredForLevel(level + 1)
}

export function xpProgress(totalXp: number): number {
  const current = xpInLevel(totalXp)
  const needed = xpToNextLevel(totalXp)
  return needed > 0 ? current / needed : 1
}

// === Ship Functions ===

export function getShipStage(level: number): ShipStage {
  for (const s of SHIP_STAGES) {
    if (level >= s.minLevel && level <= s.maxLevel) return s.stage
  }
  return 'Dreadnought'
}

export function getShipProgress(level: number): number {
  const stage = SHIP_STAGES.find(s => level >= s.minLevel && level <= s.maxLevel)
  if (!stage || stage.maxLevel === Infinity) return 1
  const stageRange = stage.maxLevel - stage.minLevel + 1
  const position = level - stage.minLevel
  return position / stageRange
}

// === Currency Rewards ===

export interface CurrencyReward {
  xp: number
  coins: number
  gems: number
}

export function rewardOf(grade: 1 | 2 | 3 | 4 | 5, type: 'mission' | 'sport' | 'project'): CurrencyReward {
  const base: Record<string, CurrencyReward> = {
    mission: { xp: 50, coins: 20, gems: 0 },
    sport: { xp: 100, coins: 30, gems: 0 },
    project: { xp: 200, coins: 50, gems: 0 },
  }

  const multiplier = grade / 3
  const b = base[type]

  return {
    xp: Math.round(b.xp * multiplier),
    coins: Math.round(b.coins * multiplier),
    gems: grade === 5 ? 5 : 0,
  }
}

// === Direction XP ===

export function directionXpGain(_direction: Direction, intensity: 'low' | 'medium' | 'high'): number {
  const base: Record<string, number> = {
    low: 5,
    medium: 10,
    high: 15,
  }
  return base[intensity]
}

// === Level Up Check ===

export function didLevelUp(prevXp: number, newXp: number): boolean {
  return levelFromXp(newXp) > levelFromXp(prevXp)
}

export function newLevel(prevXp: number, newXp: number): number | null {
  const prevLevel = levelFromXp(prevXp)
  const newLevel = levelFromXp(newXp)
  return newLevel > prevLevel ? newLevel : null
}
