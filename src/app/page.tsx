'use client'

import { useAuth } from '@/lib/auth/context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { categories } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'

export default function Home() {
  const { session } = useAuth()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            RATEIT
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Загружай контент, получай честные оценки, общайся с сообществом
          </p>
          
          {!session && (
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/auth/login">
                <Button variant="outline" size="lg">
                  Войти
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Зарегистрироваться
                </Button>
              </Link>
            </div>
          )}
          
          {session && (
            <div className="mt-8">
              <Link href="/upload">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Загрузить публикацию
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-3xl font-bold">Категории</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-lg border border-muted bg-muted/20 p-6 backdrop-blur-sm transition-all hover:border-primary hover:bg-muted/40"
            >
              <h3 className="text-lg font-semibold">{category.label}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feed Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-3xl font-bold">Лента</h2>
        <div className="text-center text-muted-foreground">
          <p>Публикации появятся здесь</p>
        </div>
      </section>
    </main>
  )
}
