import { getShipStage } from '../lib/engine'
import { t } from '../lib/i18n'

interface SquadShipProps {
  squadLevel: number
  memberCount: number
}

export function SquadShip({ squadLevel, memberCount }: SquadShipProps) {
  const stage = getShipStage(squadLevel)
  const moduleCount = Math.min(memberCount, 8)

  return (
    <div className="gc-lg p-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">🚀 {t('squadShipTitle')}</h3>

        <div className="relative inline-block mb-4">
          <div className="text-8xl">🚀</div>
          <div
            className="absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: 'var(--color-accent)', color: 'var(--color-navy-dark)' }}
          >
            Lvl {squadLevel}
          </div>
        </div>

        <div className="font-mono mb-2" style={{ color: 'var(--color-accent)' }}>{stage}</div>

        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded`}
              style={{ background: i < moduleCount ? 'var(--color-accent)' : 'var(--color-glass-b)' }}
            />
          ))}
        </div>

        <div className="text-sm" style={{ color: 'var(--color-muted)' }}>
          {memberCount} {t('squadShipMembers')}
        </div>
      </div>
    </div>
  )
}
