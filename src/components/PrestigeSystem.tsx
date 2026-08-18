import { useState } from 'react'
import { levelFromXp, MAX_LEVEL } from '../lib/engine'

interface PrestigeSystemProps {
  totalXp: number
  prestigeCount: number
  onPrestige: () => void
}

const CONSTELLATIONS = [
  { name: 'Orion', icon: ' Orion', bonus: '1.1x XP' },
  { name: 'Andromeda', icon: '🌌', bonus: '1.2x XP' },
  { name: 'Cassiopeia', icon: '✨', bonus: '1.3x XP' },
  { name: 'Lyra', icon: '🎵', bonus: '1.4x XP' },
  { name: 'Phoenix', icon: '🔥', bonus: '1.5x XP' },
]

export function PrestigeSystem({ totalXp, prestigeCount, onPrestige }: PrestigeSystemProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const level = levelFromXp(totalXp)
  const canPrestige = level >= MAX_LEVEL
  const nextConstellation = CONSTELLATIONS[prestigeCount % CONSTELLATIONS.length]

  function handlePrestige() {
    onPrestige()
    setShowConfirm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">⭐ Prestige</h2>
        <div className="text-sm text-cosmic-silver">Constellations: {prestigeCount}</div>
      </div>

      {/* Current Status */}
      <div className="bg-space-nebula rounded-xl p-6 border border-space-border text-center">
        <div className="text-6xl mb-4">🌌</div>
        <h3 className="text-xl font-bold mb-2">Star Constellations</h3>
        <p className="text-cosmic-silver mb-4">
          Reach level {MAX_LEVEL} to prestige and unlock a new constellation
        </p>

        {/* Constellation Progress */}
        <div className="flex justify-center gap-2 mb-4">
          {CONSTELLATIONS.map((c, i) => (
            <div
              key={c.name}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                i < prestigeCount
                  ? 'bg-status-premium text-space-deep'
                  : 'bg-space-gray text-cosmic-silver'
              }`}
            >
              {c.icon}
            </div>
          ))}
        </div>

        {/* Current Constellation */}
        {prestigeCount > 0 && (
          <div className="bg-space-gray rounded-lg p-3 mb-4">
            <div className="text-sm text-cosmic-silver">Current Bonus</div>
            <div className="font-mono text-status-premium">
              {CONSTELLATIONS[(prestigeCount - 1) % CONSTELLATIONS.length].bonus}
            </div>
          </div>
        )}

        {/* Prestige Button */}
        {canPrestige ? (
          showConfirm ? (
            <div className="bg-space-gray rounded-lg p-4">
              <p className="text-sm text-cosmic-silver mb-3">
                Reset to level 1 and unlock {nextConstellation.name} constellation?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrestige}
                  className="flex-1 py-2 bg-status-premium text-space-deep rounded font-bold hover:opacity-90"
                >
                  Prestige!
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-space-gray text-cosmic-silver rounded hover:bg-space-border"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full py-3 bg-gradient-to-r from-status-premium to-status-warning text-space-deep rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              ⭐ Prestige Now!
            </button>
          )
        ) : (
          <div>
            <div className="text-sm text-cosmic-silver mb-2">
              Level {level} / {MAX_LEVEL}
            </div>
            <div className="h-3 bg-space-gray rounded-full overflow-hidden max-w-xs mx-auto">
              <div
                className="h-full bg-gradient-to-r from-status-premium to-status-warning rounded-full transition-all duration-500"
                style={{ width: `${(level / MAX_LEVEL) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Next Constellation Preview */}
      <div className="bg-space-nebula rounded-lg p-4 border border-space-border">
        <h4 className="font-bold mb-2">Next: {nextConstellation.name}</h4>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{nextConstellation.icon}</span>
          <div>
            <div className="text-sm text-cosmic-silver">Bonus: {nextConstellation.bonus}</div>
            <div className="text-xs text-cosmic-silver">
              {prestigeCount + 1} of {CONSTELLATIONS.length} constellations
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
