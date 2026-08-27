'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/context'
import Link from 'next/link'

interface UserAvatarProps {
  userId: string
  size?: 'sm' | 'md' | 'lg'
}

export function UserAvatar({ userId, size = 'md' }: UserAvatarProps) {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase
        .from('users')
        .select('username, avatar_url')
        .eq('id', userId)
        .single()
      setUser(data)
    }
    loadUser()
  }, [userId])

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-16 w-16 text-2xl',
  }

  if (!user) {
    return (
      <div className={cn(
        'rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-foreground',
        sizeClasses[size]
      )}>
        👤
      </div>
    )
  }

  return (
    <Link href={`/profile/${user.username}`}>
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-foreground cursor-pointer hover:opacity-80 transition-opacity',
          sizeClasses[size]
        )}
        title={user.username}
      >
        {user.avatar_url ? user.avatar_url.charAt(0) : user.username.charAt(0).toUpperCase()}
      </div>
    </Link>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
