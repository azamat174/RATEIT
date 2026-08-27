'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/context'
import { Header } from '@/components/layout/header'
import { PostCard } from '@/components/posts/post-card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FeedPage() {
  const { session } = useAuth()
  const supabase = createClient()
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'popular' | 'new'>('new')

  useEffect(() => {
    loadPosts()
  }, [sortBy])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      let query = supabase.from('posts').select('*')

      if (sortBy === 'popular') {
        query = query.order('average_rating', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query.limit(50)

      if (error) throw error
      setPosts(data || [])
    } catch (err: any) {
      console.error('Error loading posts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Sort Buttons */}
        <div className="mb-8 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Sort:</span>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'new' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('new')}
              className={sortBy === 'new' ? 'bg-primary hover:bg-primary/90' : ''}
            >
              New
            </Button>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('popular')}
              className={sortBy === 'popular' ? 'bg-primary hover:bg-primary/90' : ''}
            >
              Popular
            </Button>
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No posts yet</p>
            {session && (
              <Link href="/upload">
                <Button className="bg-primary hover:bg-primary/90">Upload First Post</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
