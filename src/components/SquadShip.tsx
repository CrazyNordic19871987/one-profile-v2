import { getShipStage } from '../lib/engine'

interface SquadShipProps {
  squadLevel: number
  memberCount: number
}

export function SquadShip({ squadLevel, memberCount }: SquadShipProps) {
  const stage = getShipStage(squadLevel)
  const moduleCount = Math.min(memberCount, 8)

  return (
    <div className="bg-space-nebula rounded-xl p-6 border border-space-border">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">🚀 Squad Ship</h3>
        
        {/* Ship Visual */}
        <div className="relative inline-block mb-4">
          <div className="text-8xl">🚀</div>
          <div className="absolute -top-2 -right-2 bg-plasma-cyan text-space-deep text-xs font-bold px-2 py-0.5 rounded">
            Lvl {squadLevel}
          </div>
        </div>

        <div className="font-mono text-plasma-cyan mb-2">{stage}</div>
        
        {/* Modules */}
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded ${
                i < moduleCount ? 'bg-plasma-cyan' : 'bg-space-gray'
              }`}
            />
          ))}
        </div>

        <div className="text-sm text-cosmic-silver">
          {memberCount} members contributing
        </div>
      </div>
    </div>
  )
}
