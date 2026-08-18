interface PerkSystemProps {
  currentPerks: string[]
  onPerksChange: (perks: string[]) => void
}

const AVAILABLE_PERKS = [
  { id: 'double_xp', name: 'Double XP', icon: '⚡', description: 'Earn 2x XP for 1 hour', cost: 100, type: 'coins' },
  { id: 'lucky_bonus', name: 'Lucky Bonus', icon: '🍀', description: 'Extra coins from next 3 missions', cost: 50, type: 'coins' },
  { id: 'shield', name: 'XP Shield', icon: '🛡️', description: 'Protect XP from next failed mission', cost: 75, type: 'coins' },
  { id: 'speed_boost', name: 'Speed Boost', icon: '🚀', description: 'Mission cooldown reduced by 50%', cost: 10, type: 'gems' },
  { id: 'radar_scan', name: 'Radar Scan', icon: '📡', description: 'Reveal hidden badge requirements', cost: 15, type: 'gems' },
  { id: 'squad_boost', name: 'Squad Boost', icon: '👥', description: 'Squad earns 1.5x XP for 1 hour', cost: 20, type: 'gems' },
]

export function PerkSystem({ currentPerks, onPerksChange }: PerkSystemProps) {
  const MAX_PERKS = 3

  function handleTogglePerk(perkId: string) {
    if (currentPerks.includes(perkId)) {
      onPerksChange(currentPerks.filter(p => p !== perkId))
    } else if (currentPerks.length < MAX_PERKS) {
      onPerksChange([...currentPerks, perkId])
    }
  }

  function isPerkActive(perkId: string): boolean {
    return currentPerks.includes(perkId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">✨ Perks</h2>
        <div className="text-sm text-cosmic-silver">
          {currentPerks.length}/{MAX_PERKS} active
        </div>
      </div>

      {/* Active Perks */}
      <div className="bg-space-nebula rounded-lg p-4 border border-space-border">
        <h3 className="font-bold mb-3">Active Perks</h3>
        <div className="flex gap-2">
          {currentPerks.length === 0 ? (
            <div className="text-sm text-cosmic-silver">No perks active. Select up to 3 below.</div>
          ) : (
            currentPerks.map(perkId => {
              const perk = AVAILABLE_PERKS.find(p => p.id === perkId)
              if (!perk) return null
              return (
                <div
                  key={perk.id}
                  className="flex items-center gap-2 px-3 py-2 bg-plasma-cyan/20 rounded-lg border border-plasma-cyan"
                >
                  <span>{perk.icon}</span>
                  <span className="text-sm">{perk.name}</span>
                  <button
                    onClick={() => handleTogglePerk(perk.id)}
                    className="text-cosmic-silver hover:text-status-error"
                  >
                    ×
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Available Perks */}
      <div className="grid gap-3">
        {AVAILABLE_PERKS.map((perk) => {
          const active = isPerkActive(perk.id)
          const canAdd = currentPerks.length < MAX_PERKS

          return (
            <div
              key={perk.id}
              className={`bg-space-nebula rounded-lg p-4 border transition-all cursor-pointer ${
                active
                  ? 'border-plasma-cyan ring-2 ring-plasma-cyan/30'
                  : 'border-space-border hover:border-plasma-cyan/50'
              }`}
              onClick={() => !active && canAdd && handleTogglePerk(perk.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{perk.icon}</span>
                  <div>
                    <h4 className="font-bold">{perk.name}</h4>
                    <p className="text-sm text-cosmic-silver">{perk.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-mono ${perk.type === 'gems' ? 'text-status-premium' : 'text-status-warning'}`}>
                    {perk.cost} {perk.type === 'gems' ? '💎' : '💰'}
                  </div>
                  {active && (
                    <div className="text-xs text-plasma-cyan">Active</div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
