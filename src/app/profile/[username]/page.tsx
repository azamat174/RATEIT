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
import { useRouter } from 'next/navigation'

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { user: currentUser } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editBio, setEditBio] = useState('')

  useEffect(() => {
    loadProfile()
  }, [params.username])

  const loadProfile = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', params.username)
        .single()

      if (userError) throw userError

      setProfile(userData)
      setEditBio(userData.bio || '')

      // Load user's posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false })

      setPosts(postsData || [])
    } catch (err: any) {
      console.error('Error loading profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBioUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser?.id) return

    try {
      const { error } = await supabase
        .from('users')
        .update({ bio: editBio })
        .eq('id', currentUser.id)

      if (error) throw error
      setProfile({ ...profile, bio: editBio })
      setIsEditing(false)
    } catch (err: any) {
      console.error('Error updating bio:', err)
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

  if (!profile) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">User not found</p>
          <Link href="/feed">
            <Button className="bg-primary hover:bg-primary/90">Back to Feed</Button>
          </Link>
        </div>
      </main>
    )
  }

  const isOwnProfile = currentUser?.id === profile.id
  const avgRating =
    posts.length > 0
      ? (posts.reduce((sum, p) => sum + p.average_rating, 0) / posts.length).toFixed(1)
      : '0'

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 rounded-lg border border-muted bg-muted/10 p-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl flex-shrink-0">
              👤
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold">{profile.username}</h1>
              {isOwnProfile && isEditing ? (
                <form onSubmit={handleBioUpdate} className="mt-4 space-y-3">
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Write your bio..."
                    className="w-full rounded-md border border-muted bg-muted/10 px-3 py-2 min-h-16"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  {profile.bio && <p className="mt-2 text-muted-foreground">{profile.bio}</p>}
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="mt-4"
                    >
                      Edit Bio
                    </Button>
                  )}
                </>
              )}

              <div className="mt-6 flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground">Posts</p>
                  <p className="text-2xl font-bold">{posts.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">🔥 {avgRating}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Posts ({posts.length})</h2>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No posts yet</p>
              {isOwnProfile && (
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
      </div>
    </main>
  )
}
