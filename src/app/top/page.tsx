'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/context'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { categories } from '@/lib/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function TopPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState<'today' | 'week' | 'month'>('week')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    loadTopPosts()
  }, [timePeriod, selectedCategory])

  const loadTopPosts = async () => {
    setIsLoading(true)
    try {
      const now = new Date()
      let startDate = new Date()

      if (timePeriod === 'today') {
        startDate.setHours(0, 0, 0, 0)
      } else if (timePeriod === 'week') {
        startDate.setDate(now.getDate() - 7)
      } else if (timePeriod === 'month') {
        startDate.setMonth(now.getMonth() - 1)
      }

      let query = supabase
        .from('posts')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .gte('rating_count', 3) // Minimum 3 ratings to be in top
        .order('average_rating', { ascending: false })
        .limit(50)

      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (err: any) {
      console.error('Error loading top posts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-2">🏆 TOP RATEIT</h1>
          <p className="text-muted-foreground">Best rated content</p>
        </motion.div>

        {/* Time Period Selector */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {(['today', 'week', 'month'] as const).map((period) => (
            <Button
              key={period}
              variant={timePeriod === period ? 'default' : 'outline'}
              onClick={() => setTimePeriod(period)}
              className={timePeriod === period ? 'bg-primary hover:bg-primary/90' : ''}
            >
              {period === 'today' ? 'Today' : period === 'week' ? 'Week' : 'Month'}
            </Button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="mb-8 space-y-4">
          <p className="text-sm text-muted-foreground">Filter by category:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedCategory ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={!selectedCategory ? 'bg-primary hover:bg-primary/90' : ''}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? 'bg-primary hover:bg-primary/90' : ''}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts in this category yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/posts/${post.id}`}>
                  <div className="rounded-lg border border-muted bg-muted/10 p-4 hover:border-primary transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">By Author</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold">🔥 {post.average_rating.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">{post.rating_count} ratings</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
