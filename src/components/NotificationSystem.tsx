interface Notification {
  id: string
  type: 'success' | 'info' | 'warning'
  message: string
  timestamp: Date
}

interface NotificationSystemProps {
  notifications: Notification[]
}

function getNotificationColor(type: Notification['type']): string {
  switch (type) {
    case 'success': return 'border-status-success bg-status-success/10'
    case 'warning': return 'border-status-warning bg-status-warning/10'
    default: return 'border-plasma-cyan bg-plasma-cyan/10'
  }
}

function getNotificationIcon(type: Notification['type']): string {
  switch (type) {
    case 'success': return '✅'
    case 'warning': return '⚠️'
    default: return 'ℹ️'
  }
}

export function NotificationSystem({ notifications }: NotificationSystemProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${getNotificationColor(notification.type)} backdrop-blur-sm animate-slide-in`}
        >
          <span>{getNotificationIcon(notification.type)}</span>
          <span className="text-sm">{notification.message}</span>
        </div>
      ))}
    </div>
  )
}

export type { Notification }
