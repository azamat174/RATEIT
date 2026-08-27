'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/context'
import { Header } from '@/components/layout/header'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { session } = useAuth()
  const supabase = createClient()
  const [stats, setStats] = useState({ posts: 0, users: 0, ratings: 0 })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [postsRes, usersRes, ratingsRes] = await Promise.all([
        supabase.from('posts').select('count', { count: 'exact' }).limit(0),
        supabase.from('users').select('count', { count: 'exact' }).limit(0),
        supabase.from('ratings').select('count', { count: 'exact' }).limit(0),
      ])

      setStats({
        posts: postsRes.count || 0,
        users: usersRes.count || 0,
        ratings: ratingsRes.count || 0,
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
            RATEIT
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Rate content from 1 to 100. Comment. React. Discover.
          </p>

          {!session ? (
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/feed">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Explore Feed
                </Button>
              </Link>
              <Link href="/upload">
                <Button size="lg" variant="outline">
                  Upload Content
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-12 border-y border-muted">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <p className="text-4xl font-bold text-primary">{stats.posts}</p>
            <p className="text-muted-foreground">Posts</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <p className="text-4xl font-bold text-secondary">{stats.users}</p>
            <p className="text-muted-foreground">Users</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <p className="text-4xl font-bold text-accent">{stats.ratings}</p>
            <p className="text-muted-foreground">Ratings</p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">Features</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: '⭐', title: 'Rate', desc: 'Rate content 1-100' },
            { icon: '💬', title: 'Comment', desc: 'Share your thoughts' },
            { icon: '👍', title: 'React', desc: 'Express with emojis' },
            { icon: '🔔', title: 'Notify', desc: 'Get real-time alerts' },
            { icon: '🔍', title: 'Discover', desc: 'Find new content' },
            { icon: '📱', title: 'Mobile', desc: 'Works everywhere' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg border border-muted bg-muted/10 p-6 text-center"
            >
              <p className="text-4xl mb-2">{feature.icon}</p>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          {!session ? (
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Create Account
              </Button>
            </Link>
          ) : (
            <Link href="/upload">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Upload Your First Post
              </Button>
            </Link>
          )}
        </motion.div>
      </section>
    </main>
  )
}
