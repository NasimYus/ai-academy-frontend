import { Link } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { Notification } from '#/entities/notification'

import { useMarkSeen, useNotifications, useUnreadCount } from '#/features/notifications/model/use-notifications'

/** Bell with unread badge + dropdown of recent notifications. */
export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data } = useNotifications()
  const unread = useUnreadCount()
  const markSeen = useMarkSeen()

  // Close the dropdown on an outside click.
  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const recent = (data?.notifications ?? []).slice(0, 6)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Уведомления"
        className="relative flex items-center text-ink/60 hover:text-brand-600"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-brand-100 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-brand-100 px-4 py-2.5">
            <span className="text-sm font-semibold text-ink">Уведомления</span>
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs text-brand-600 hover:underline"
            >
              Все
            </Link>
          </div>

          {recent.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-ink/50">Нет уведомлений</p>
          ) : (
            <ul className="max-h-96 divide-y divide-brand-50 overflow-y-auto">
              {recent.map((n: Notification) => (
                <li
                  key={n.id}
                  className={n.status === 'unread' ? 'bg-brand-50/50' : undefined}
                >
                  <button
                    type="button"
                    onClick={() => n.status === 'unread' && markSeen.mutate(n.id)}
                    className="block w-full px-4 py-3 text-left hover:bg-brand-50"
                  >
                    <div className="flex items-start gap-2">
                      {n.status === 'unread' && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{n.title}</p>
                        <p className="line-clamp-2 text-xs text-ink/60">{n.message}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
