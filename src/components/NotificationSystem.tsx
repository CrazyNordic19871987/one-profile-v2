import { useState, useEffect, useCallback } from 'react'

interface Notification {
  id: string
  type: 'success' | 'info' | 'warning'
  message: string
  timestamp: Date
}

interface NotificationSystemProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

function getNotificationStyle(type: Notification['type']): React.CSSProperties {
  switch (type) {
    case 'success': return { background: 'var(--color-navy-dark)', borderColor: 'var(--color-status-success)' }
    case 'warning': return { background: 'var(--color-navy-dark)', borderColor: 'var(--color-status-warn)' }
    default: return { background: 'var(--color-navy-dark)', borderColor: 'var(--color-accent)' }
  }
}

function getNotificationIcon(type: Notification['type']): string {
  switch (type) {
    case 'success': return '✅'
    case 'warning': return '⚠️'
    default: return 'ℹ️'
  }
}

export function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
  useEffect(() => {
    if (notifications.length === 0) return

    const latest = notifications[notifications.length - 1]
    const timer = setTimeout(() => {
      onDismiss(latest.id)
    }, 4000)

    return () => clearTimeout(timer)
  }, [notifications, onDismiss])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className="flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm page-enter cursor-pointer"
          style={getNotificationStyle(notification.type)}
          onClick={() => onDismiss(notification.id)}
        >
          <span>{getNotificationIcon(notification.type)}</span>
          <span className="text-sm flex-1">{notification.message}</span>
          <button
            className="hover:opacity-80 text-sm"
            style={{ color: 'var(--color-muted)' }}
            onClick={(e) => { e.stopPropagation(); onDismiss(notification.id) }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export type { Notification }

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((type: Notification['type'], message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setNotifications(prev => [...prev, { id, type, message, timestamp: new Date() }])
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return { notifications, addNotification, dismissNotification }
}
