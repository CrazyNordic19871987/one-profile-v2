import { useState } from 'react'
import { getShipStage, getShipProgress } from '../lib/engine'
import { t } from '../lib/i18n'

interface ShipCustomizationProps {
  level: number
  coins: number
  gems: number
  onPurchase: (itemId: string, cost: number, currency: 'coins' | 'gems') => void
}

const SHIP_ITEMS = [
  { id: 'engine_glow', name: 'Engine Glow', icon: '🔥', description: 'Brighter engine trail', cost: 100, currency: 'coins' as const, category: 'engine' },
  { id: 'hull_blue', name: 'Blue Hull', icon: '🎨', description: 'Blue color scheme', cost: 150, currency: 'coins' as const, category: 'hull' },
  { id: 'hull_purple', name: 'Purple Hull', icon: '🎨', description: 'Purple color scheme', cost: 150, currency: 'coins' as const, category: 'hull' },
  { id: 'wing_extended', name: 'Extended Wings', icon: '🦅', description: 'Wider wing panels', cost: 200, currency: 'coins' as const, category: 'wings' },
  { id: 'cockpit_holo', name: 'Holo Cockpit', icon: '🖥️', description: 'Holographic display', cost: 10, currency: 'gems' as const, category: 'cockpit' },
  { id: 'shield_bubble', name: 'Shield Bubble', icon: '🛡️', description: 'Protective energy shield', cost: 15, currency: 'gems' as const, category: 'shield' },
  { id: 'thruster_neon', name: 'Neon Thrusters', icon: '💫', description: 'Neon thruster effect', cost: 20, currency: 'gems' as const, category: 'engine' },
  { id: 'legendary_skin', name: 'Legendary Skin', icon: '👑', description: 'Unique legendary appearance', cost: 50, currency: 'gems' as const, category: 'skin' },
]

export function ShipCustomization({ level, coins, gems, onPurchase }: ShipCustomizationProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [ownedItems, setOwnedItems] = useState<string[]>([])

  const stage = getShipStage(level)
  const progress = getShipProgress(level)

  const categories = ['all', 'engine', 'hull', 'wings', 'cockpit', 'shield', 'skin']

  function filteredItems() {
    if (selectedCategory === 'all') return SHIP_ITEMS
    return SHIP_ITEMS.filter(item => item.category === selectedCategory)
  }

  function handlePurchase(item: typeof SHIP_ITEMS[0]) {
    if (ownedItems.includes(item.id)) return
    if (item.currency === 'coins' && coins < item.cost) return
    if (item.currency === 'gems' && gems < item.cost) return

    setOwnedItems([...ownedItems, item.id])
    onPurchase(item.id, item.cost, item.currency)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🚀 {t('shipCustomization')}</h2>
        <div className="text-sm text-cosmic-silver">{stage}</div>
      </div>

      {/* Ship Preview */}
      <div className="bg-space-nebula rounded-xl p-6 border border-space-border text-center">
        <div className="text-8xl mb-4">🚀</div>
        <div className="font-mono text-plasma-cyan">{stage}</div>
        <div className="h-2 bg-space-gray rounded-full overflow-hidden mt-2 max-w-xs mx-auto">
          <div
            className="h-full bg-gradient-to-r from-plasma-cyan to-status-success rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="text-xs text-cosmic-silver mt-1">
          Level {level} • {Math.round(progress * 100)}% {t('shipProgress')}
        </div>
      </div>

      {/* Currency */}
      <div className="flex gap-4">
        <div className="flex-1 bg-space-gray rounded-lg p-3 text-center">
          <div className="text-xl">💰</div>
          <div className="font-mono text-status-warning">{coins}</div>
        </div>
        <div className="flex-1 bg-space-gray rounded-lg p-3 text-center">
          <div className="text-xl">💎</div>
          <div className="font-mono text-status-premium">{gems}</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-plasma-cyan text-space-deep'
                : 'bg-space-gray text-cosmic-silver hover:bg-space-border'
            }`}
          >
            {cat === 'all' ? t('shipAll') : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredItems().map(item => {
          const owned = ownedItems.includes(item.id)
          const canAfford = item.currency === 'coins' ? coins >= item.cost : gems >= item.cost

          return (
            <div
              key={item.id}
              className={`bg-space-nebula rounded-lg p-4 border transition-all ${
                owned
                  ? 'border-status-success'
                  : canAfford
                    ? 'border-space-border hover:border-plasma-cyan cursor-pointer'
                    : 'border-space-border opacity-50'
              }`}
              onClick={() => !owned && canAfford && handlePurchase(item)}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="font-bold text-sm">{item.name}</h4>
                <p className="text-xs text-cosmic-silver mt-1">{item.description}</p>
                <div className={`mt-2 font-mono text-sm ${item.currency === 'gems' ? 'text-status-premium' : 'text-status-warning'}`}>
                  {owned ? `✅ ${t('shipOwned')}` : `${item.cost} ${item.currency === 'gems' ? '💎' : '💰'}`}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
