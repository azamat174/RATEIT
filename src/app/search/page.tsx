'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/context'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PostCard } from '@/components/posts/post-card'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SearchPage() {
  const supabase = createClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchType, setSearchType] = useState<'all' | 'posts' | 'users'>('all')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      let data = []

      if (searchType === 'posts' || searchType === 'all') {
        const { data: postsData } = await supabase
          .from('posts')
          .select('*')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(20)

        if (postsData) {
          data = [...data, ...postsData.map((p) => ({ ...p, type: 'post' }))]
        }
      }

      if (searchType === 'users' || searchType === 'all') {
        const { data: usersData } = await supabase
          .from('users')
          .select('*')
          .or(`username.ilike.%${searchQuery}%`)
          .limit(20)

        if (usersData) {
          data = [...data, ...usersData.map((u) => ({ ...u, type: 'user' }))]
        }
      }

      setResults(data)
    } catch (err: any) {
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const posts = results.filter((r) => r.type === 'post')
  const users = results.filter((r) => r.type === 'user')

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <form onSubmit={handleSearch} className="mb-8 space-y-4">
          <Input
            type="search"
            placeholder="Search posts, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-base"
          />
          <div className="flex flex-wrap gap-2">
            {(['all', 'posts', 'users'] as const).map((type) => (
              <Button
                key={type}
                variant={searchType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchType(type)}
                className={searchType === type ? 'bg-primary hover:bg-primary/90' : ''}
              >
                {type === 'all' ? 'All' : type === 'posts' ? 'Posts' : 'Users'}
              </Button>
            ))}
          </div>
        </form>

        {searchQuery && isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Searching...</p>
          </div>
        )}

        {searchQuery && !isLoading && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found</p>
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Enter a search query to get started</p>
          </div>
        )}

        {/* Posts Results */}
        {posts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Posts ({posts.length})</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Users Results */}
        {users.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Users ({users.length})</h2>
            <div className="space-y-4">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/profile/${user.username}`}>
                    <div className="rounded-lg border border-muted bg-muted/10 p-4 hover:border-primary transition-all cursor-pointer">
                      <p className="font-semibold">{user.username}</p>
                      {user.bio && <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
