import { supabase } from './supabase'
import { levelFromXp, rewardOf } from './engine'
import type { Direction } from '../types/database'

// === Currency Limits ===

export const MAX_COINS = 9999
export const MAX_GEMS = 999

// === Currency Functions ===

export function clampCoins(coins: number): number {
  return Math.min(Math.max(0, coins), MAX_COINS)
}

export function clampGems(gems: number): number {
  return Math.min(Math.max(0, gems), MAX_GEMS)
}

// === Transaction Types ===

export interface CurrencyTransaction {
  type: 'earn' | 'spend'
  currency: 'xp' | 'coins' | 'gems'
  amount: number
  reason: string
  timestamp: string
}

// === XP Transaction ===

export async function addXp(studentId: string, amount: number, _reason: string): Promise<{ newXp: number; levelUp: boolean; newLevel: number | null }> {
  const { data: profile, error } = await supabase
    .from('students')
    .select('total_xp')
    .eq('id', studentId)
    .single()

  if (error || !profile) throw new Error('Failed to fetch profile')

  const prevXp = profile.total_xp
  const newXp = prevXp + amount
  const prevLevel = levelFromXp(prevXp)
  const newLevelVal = levelFromXp(newXp)
  const levelUp = newLevelVal > prevLevel

  const { error: updateError } = await supabase
    .from('students')
    .update({ total_xp: newXp, updated_at: new Date().toISOString() })
    .eq('id', studentId)

  if (updateError) throw new Error('Failed to update XP')

  // If level up, add gems reward
  if (levelUp) {
    const gemsReward = newLevelVal >= 100 ? 20 : newLevelVal >= 50 ? 15 : newLevelVal >= 25 ? 10 : 5
    await addGems(studentId, gemsReward, `Level ${newLevelVal} reached`)
  }

  return { newXp, levelUp, newLevel: levelUp ? newLevelVal : null }
}

// === Coins Transaction ===

export async function addCoins(studentId: string, amount: number, _reason: string): Promise<number> {
  const { data: profile, error } = await supabase
    .from('students')
    .select('coins')
    .eq('id', studentId)
    .single()

  if (error || !profile) throw new Error('Failed to fetch profile')

  const newCoins = clampCoins(profile.coins + amount)

  const { error: updateError } = await supabase
    .from('students')
    .update({ coins: newCoins, updated_at: new Date().toISOString() })
    .eq('id', studentId)

  if (updateError) throw new Error('Failed to update coins')

  return newCoins
}

export async function spendCoins(studentId: string, amount: number, _reason: string): Promise<number> {
  const { data: profile, error } = await supabase
    .from('students')
    .select('coins')
    .eq('id', studentId)
    .single()

  if (error || !profile) throw new Error('Failed to fetch profile')
  if (profile.coins < amount) throw new Error('Not enough coins')

  const newCoins = clampCoins(profile.coins - amount)

  const { error: updateError } = await supabase
    .from('students')
    .update({ coins: newCoins, updated_at: new Date().toISOString() })
    .eq('id', studentId)

  if (updateError) throw new Error('Failed to update coins')

  return newCoins
}

// === Gems Transaction ===

export async function addGems(studentId: string, amount: number, _reason: string): Promise<number> {
  const { data: profile, error } = await supabase
    .from('students')
    .select('gems')
    .eq('id', studentId)
    .single()

  if (error || !profile) throw new Error('Failed to fetch profile')

  const newGems = clampGems(profile.gems + amount)

  const { error: updateError } = await supabase
    .from('students')
    .update({ gems: newGems, updated_at: new Date().toISOString() })
    .eq('id', studentId)

  if (updateError) throw new Error('Failed to update gems')

  return newGems
}

export async function spendGems(studentId: string, amount: number, _reason: string): Promise<number> {
  const { data: profile, error } = await supabase
    .from('students')
    .select('gems')
    .eq('id', studentId)
    .single()

  if (error || !profile) throw new Error('Failed to fetch profile')
  if (profile.gems < amount) throw new Error('Not enough gems')

  const newGems = clampGems(profile.gems - amount)

  const { error: updateError } = await supabase
    .from('students')
    .update({ gems: newGems, updated_at: new Date().toISOString() })
    .eq('id', studentId)

  if (updateError) throw new Error('Failed to update gems')

  return newGems
}

// === Mission Credit ===

export async function creditMission(
  completionId: string,
  studentId: string,
  grade: 1 | 2 | 3 | 4 | 5,
  type: 'mission' | 'sport' | 'project',
  direction?: Direction
): Promise<{ xp: number; coins: number; gems: number; levelUp: boolean; newLevel: number | null }> {
  const reward = rewardOf(grade, type)

  // Update completion status — only mission_completions has status/grade/graded_at
  if (type === 'mission') {
    const { error: updateError } = await supabase
      .from('mission_completions')
      .update({
        status: 'credited',
        grade,
        graded_at: new Date().toISOString(),
      })
      .eq('id', completionId)

    if (updateError) throw new Error('Failed to update mission completion')
  }

  // Add currencies
  const { levelUp, newLevel } = await addXp(studentId, reward.xp, `${type} graded ${grade}`)
  await addCoins(studentId, reward.coins, `${type} graded ${grade}`)
  if (reward.gems > 0) {
    await addGems(studentId, reward.gems, `${type} graded ${grade}`)
  }

  // Update direction skill
  if (direction) {
    await updateDirectionXp(studentId, direction, reward.xp)
  } else if (type === 'mission') {
    const { data: mission } = await supabase
      .from('missions')
      .select('direction')
      .eq('id', completionId)
      .single()

    if (mission) {
      await updateDirectionXp(studentId, mission.direction, reward.xp)
    }
  }

  return { ...reward, levelUp, newLevel }
}

// === Direction XP ===

export async function updateDirectionXp(studentId: string, direction: Direction, xpGain: number): Promise<void> {
  const { data: skill, error } = await supabase
    .from('skills')
    .select('id, xp, level')
    .eq('student_id', studentId)
    .eq('direction', direction)
    .single()

  if (error || !skill) {
    // Create new skill entry
    await supabase
      .from('skills')
      .insert({
        student_id: studentId,
        direction,
        level: 1,
        xp: xpGain,
      })
  } else {
    const newXp = skill.xp + xpGain
    const newLevel = Math.min(100, Math.floor(newXp / 100) + 1)

    await supabase
      .from('skills')
      .update({ xp: newXp, level: newLevel, updated_at: new Date().toISOString() })
      .eq('id', skill.id)
  }
}

// === Daily Bonus ===

export async function claimDailyBonus(studentId: string): Promise<{ xp: number; coins: number; streak: number }> {
  const { data: profile, error } = await supabase
    .from('students')
    .select('last_bonus_date, streak')
    .eq('id', studentId)
    .single()

  if (error || !profile) throw new Error('Failed to fetch profile')

  const today = new Date().toISOString().split('T')[0]
  const lastBonus = profile.last_bonus_date

  // Check if already claimed today
  if (lastBonus === today) {
    throw new Error('Daily bonus already claimed today')
  }

  // Calculate streak
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const newStreak = lastBonus === yesterdayStr ? profile.streak + 1 : 1
  const streakBonus = Math.min(newStreak, 7)

  const xp = 5 + streakBonus
  const coins = 5 + Math.floor(streakBonus / 2)

  // Update profile
  await supabase
    .from('students')
    .update({
      last_bonus_date: today,
      streak: newStreak,
      updated_at: new Date().toISOString(),
    })
    .eq('id', studentId)

  // Add currencies
  await addXp(studentId, xp, 'Daily bonus')
  await addCoins(studentId, coins, 'Daily bonus')

  return { xp, coins, streak: newStreak }
}

// === Prestige ===

export async function performPrestige(studentId: string): Promise<{ newPrestigeCount: number; constellation: string }> {
  const CONSTELLATIONS = ['Orion', 'Andromeda', 'Cassiopeia', 'Lyra', 'Phoenix']

  const { data: profile, error } = await supabase
    .from('students')
    .select('prestige_count')
    .eq('id', studentId)
    .single()

  if (error || !profile) throw new Error('Failed to fetch profile')

  const newCount = (profile.prestige_count || 0) + 1
  const constellation = CONSTELLATIONS[(newCount - 1) % CONSTELLATIONS.length]

  const { error: updateError } = await supabase
    .from('students')
    .update({
      total_xp: 0,
      prestige_count: newCount,
      prestige_constellation: constellation,
      updated_at: new Date().toISOString(),
    })
    .eq('id', studentId)

  if (updateError) throw new Error('Failed to perform prestige')

  // Reset all skills
  await supabase
    .from('skills')
    .delete()
    .eq('student_id', studentId)

  return { newPrestigeCount: newCount, constellation }
}

// === Purchase Ship Item ===

export async function purchaseShipItem(
  studentId: string,
  itemId: string,
  cost: number,
  currency: 'coins' | 'gems'
): Promise<void> {
  if (currency === 'coins') {
    await spendCoins(studentId, cost, `Ship item: ${itemId}`)
  } else {
    await spendGems(studentId, cost, `Ship item: ${itemId}`)
  }

  // Store owned items in student's perks array with 'ship_' prefix
  const { data: profile } = await supabase
    .from('students')
    .select('perks')
    .eq('id', studentId)
    .single()

  if (profile) {
    const currentPerks = profile.perks || []
    if (!currentPerks.includes(`ship_${itemId}`)) {
      await supabase
        .from('students')
        .update({ perks: [...currentPerks, `ship_${itemId}`], updated_at: new Date().toISOString() })
        .eq('id', studentId)
    }
  }
}

// === Badge Evaluator ===

export async function evaluateBadges(studentId: string): Promise<string[]> {
  // Fetch student data
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', studentId)
    .single()

  if (!student) return []

  // Fetch all badges
  const { data: allBadges } = await supabase.from('badges').select('*')
  if (!allBadges) return []

  // Fetch already earned
  const { data: earned } = await supabase
    .from('student_badges')
    .select('badge_id')
    .eq('student_id', studentId)

  const earnedIds = new Set((earned || []).map(e => e.badge_id))

  // Count missions completed
  const { count: missionCount } = await supabase
    .from('mission_completions')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('status', 'credited')

  // Count completed projects
  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('status', 'completed')

  // Count directions with xp
  const { data: skills } = await supabase
    .from('skills')
    .select('direction, xp')
    .eq('student_id', studentId)

  const dirsExplored = new Set((skills || []).map(s => s.direction)).size
  const dirsLevel10 = (skills || []).filter(s => Math.floor(s.xp / 100) + 1 >= 10).length
  const sportXp = (skills || []).find(s => s.direction === 'sport')?.xp || 0
  const itXp = (skills || []).find(s => s.direction === 'it')?.xp || 0

  // Check squad
  const { data: squadMember } = await supabase
    .from('squad_members')
    .select('id')
    .eq('student_id', studentId)
    .limit(1)

  const level = levelFromXp(student.total_xp || 0)
  const streak = student.streak || 0

  const newlyEarned: string[] = []

  for (const badge of allBadges) {
    if (earnedIds.has(badge.id)) continue

    let earned = false
    const req = badge.requirement

    if (req === 'missions >= 1' && (missionCount || 0) >= 1) earned = true
    else if (req === 'directions >= 3' && dirsExplored >= 3) earned = true
    else if (req === 'sport_xp >= 100' && sportXp >= 100) earned = true
    else if (req === 'it_xp >= 100' && itXp >= 100) earned = true
    else if (req === 'squad = true' && squadMember && squadMember.length > 0) earned = true
    else if (req === 'streak >= 7' && streak >= 7) earned = true
    else if (req === 'missions >= 10' && (missionCount || 0) >= 10) earned = true
    else if (req === 'projects >= 1' && (projectCount || 0) >= 1) earned = true
    else if (req === 'dirs_level10 >= 3' && dirsLevel10 >= 3) earned = true
    else if (req === 'level >= 50' && level >= 50) earned = true

    if (earned) {
      const { error } = await supabase
        .from('student_badges')
        .insert({
          student_id: studentId,
          badge_id: badge.id,
          earned_at: new Date().toISOString(),
        })

      if (!error) {
        newlyEarned.push(badge.name)
        if (badge.xp_reward > 0) {
          await addXp(studentId, badge.xp_reward, `Badge: ${badge.name}`)
        }
      }
    }
  }

  return newlyEarned
}
