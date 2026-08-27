'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/context'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatDate, getReactionEmoji } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function NotificationsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    loadNotifications()
  }, [user])

  const loadNotifications = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setNotifications(data || [])
      setUnreadCount((data || []).filter((n) => !n.is_read).length)
    } catch (err: any) {
      console.error('Error loading notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error
      loadNotifications()
    } catch (err: any) {
      console.error('Error marking as read:', err)
    }
  }

  const getNotificationMessage = (notification: any) => {
    switch (notification.type) {
      case 'rating':
        return 'rated your post'
      case 'comment':
        return 'commented on your post'
      case 'reply':
        return 'replied to your comment'
      case 'reaction':
        return 'reacted to your comment'
      default:
        return 'interacted with you'
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">🔔 Notifications</h1>
        <p className="text-muted-foreground mb-8">{unreadCount} unread</p>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={`rounded-lg border p-4 cursor-pointer transition-all ${
                    notification.is_read
                      ? 'border-muted bg-muted/5'
                      : 'border-primary bg-primary/10'
                  }`}
                  onClick={() => {
                    handleMarkAsRead(notification.id)
                    if (notification.post_id) {
                      router.push(`/posts/${notification.post_id}`)
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">
                        User {getNotificationMessage(notification)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0 ml-4 mt-1" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
