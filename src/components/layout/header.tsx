'use client'

import { useAuth } from '@/lib/auth/context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Bell, Menu } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { session, signOut, user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-muted bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            RATEIT
          </Link>

          {/* Search */}
          <div className="hidden flex-1 mx-8 md:flex">
            <div className="w-full max-w-sm rounded-lg border border-muted bg-muted/20 px-4 py-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Поиск пользователей, публикаций..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {session && (
              <>
                <Link href="/notifications">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button variant="default" className="hidden sm:inline-flex bg-primary hover:bg-primary/90">
                    Загрузить
                  </Button>
                </Link>
                <Link href={`/profile/${user?.username}`}>
                  <Button variant="ghost" size="sm">
                    {user?.username}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Выход
                </Button>
              </>
            )}
            
            {!session && (
              <>
                <Link href="/auth/login" className="hidden sm:inline">
                  <Button variant="outline" size="sm">
                    Войти
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Зарегистрироваться
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <div className="w-full rounded-lg border border-muted bg-muted/20 px-4 py-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Поиск..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
