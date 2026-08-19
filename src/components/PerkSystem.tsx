import { t } from '../lib/i18n'

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
        <h2 className="text-xl font-bold">✨ {t('perksTitle')}</h2>
        <div className="text-sm" style={{ color: 'var(--color-muted)' }}>
          {currentPerks.length}/{MAX_PERKS} {t('perksActive')}
        </div>
      </div>

      <div className="gc p-4">
        <h3 className="font-bold mb-3">{t('perksActive')}</h3>
        <div className="flex gap-2">
          {currentPerks.length === 0 ? (
            <div className="text-sm" style={{ color: 'var(--color-muted)' }}>{t('perksNoneActive')}</div>
          ) : (
            currentPerks.map(perkId => {
              const perk = AVAILABLE_PERKS.find(p => p.id === perkId)
              if (!perk) return null
              return (
                <div
                  key={perk.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                  style={{ background: 'var(--color-accent-dim)', borderColor: 'var(--color-accent)' }}
                >
                  <span>{perk.icon}</span>
                  <span className="text-sm">{perk.name}</span>
                  <button
                    onClick={() => handleTogglePerk(perk.id)}
                    className="hover:text-[var(--color-status-error)]"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    ×
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="grid gap-3">
        {AVAILABLE_PERKS.map((perk) => {
          const active = isPerkActive(perk.id)
          const canAdd = currentPerks.length < MAX_PERKS

          return (
            <div
              key={perk.id}
              className={`gc p-4 transition-all cursor-pointer ${
                active ? '' : 'hover:border-[var(--color-border-h)]'
              }`}
              style={active ? {
                borderColor: 'var(--color-accent)',
                boxShadow: '0 0 0 2px var(--color-accent-dim)',
              } : undefined}
              onClick={() => !active && canAdd && handleTogglePerk(perk.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{perk.icon}</span>
                  <div>
                    <h4 className="font-bold">{perk.name}</h4>
                    <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{perk.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono" style={{ color: perk.type === 'gems' ? 'var(--color-accent)' : 'var(--color-status-warn)' }}>
                    {perk.cost} {perk.type === 'gems' ? '💎' : '💰'}
                  </div>
                  {active && (
                    <div className="text-xs" style={{ color: 'var(--color-accent)' }}>{t('perksActive')}</div>
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
