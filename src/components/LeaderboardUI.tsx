import { getShipStage } from '../lib/engine'

interface LeaderboardEntry {
  id: string
  name: string
  totalXp: number
  level: number
}

interface LeaderboardUIProps {
  entries: LeaderboardEntry[]
  currentStudentId: string
}

export function LeaderboardUI({ entries, currentStudentId }: LeaderboardUIProps) {
  const sorted = [...entries].sort((a, b) => b.totalXp - a.totalXp).slice(0, 10)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">🏅 Squad Leaderboard</h2>

      <div className="bg-space-nebula rounded-xl border border-space-border overflow-hidden">
        {sorted.map((entry, index) => {
          const isCurrentStudent = entry.id === currentStudentId
          const stage = getShipStage(entry.level)

          return (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-4 ${
                index < sorted.length - 1 ? 'border-b border-space-border' : ''
              } ${isCurrentStudent ? 'bg-plasma-cyan/10' : ''}`}
            >
              {/* Rank */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-status-warning text-space-deep' :
                index === 1 ? 'bg-cosmic-silver text-space-deep' :
                index === 2 ? 'bg-status-premium text-space-deep' :
                'bg-space-gray text-cosmic-silver'
              }`}>
                {index + 1}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-space-border flex items-center justify-center text-xl">
                🚀
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className={`font-bold ${isCurrentStudent ? 'text-plasma-cyan' : ''}`}>
                  {entry.name}
                  {isCurrentStudent && <span className="text-xs ml-1">(you)</span>}
                </div>
                <div className="text-xs text-cosmic-silver">
                  Level {entry.level} • {stage}
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <div className="font-mono text-sm text-status-success">
                  {entry.totalXp.toLocaleString()} XP
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
