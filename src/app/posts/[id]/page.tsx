'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/context'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Trash2, Edit2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { formatDate, getRatingEmoji, categories } from '@/lib/utils'
import { CommentSection } from '@/components/posts/comment-section'

export default function PostPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [isRating, setIsRating] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [showReportForm, setShowReportForm] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ title: '', description: '' })

  useEffect(() => {
    loadPost()
  }, [params.id])

  useEffect(() => {
    if (user && post) {
      loadUserRating()
    }
  }, [user, post])

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setPost(data)
      setEditData({ title: data.title, description: data.description })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserRating = async () => {
    if (!user) return
    try {
      const { data } = await supabase
        .from('ratings')
        .select('rating')
        .eq('post_id', params.id)
        .eq('user_id', user.id)
        .single()

      if (data) {
        setUserRating(data.rating)
      }
    } catch (err) {
      // No rating found
    }
  }

  const handleRating = async (rating: number) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    setIsRating(true)
    try {
      if (userRating !== null) {
        // Update existing rating
        const { error } = await supabase
          .from('ratings')
          .update({ rating })
          .eq('post_id', params.id)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        // Create new rating
        const { error } = await supabase.from('ratings').insert({
          post_id: params.id,
          user_id: user.id,
          rating,
        })

        if (error) throw error
      }

      setUserRating(rating)
      loadPost()
    } catch (err: any) {
      console.error('Error rating:', err)
    } finally {
      setIsRating(false)
    }
  }

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/auth/login')
      return
    }

    setIsReporting(true)
    try {
      const { error } = await supabase.from('reports').insert({
        user_id: user.id,
        post_id: params.id,
        reason: reportReason,
        description: '',
      })

      if (error) throw error
      setShowReportForm(false)
      alert('Report submitted successfully')
    } catch (err: any) {
      console.error('Error reporting:', err)
    } finally {
      setIsReporting(false)
    }
  }

  const handleDeletePost = async () => {
    if (!confirm('Delete this post? This action cannot be undone.')) return

    try {
      // Delete file from storage
      if (post.file_url) {
        const filePath = post.file_url.split('/').pop()
        if (filePath) {
          await supabase.storage
            .from('posts')
            .remove([`${post.category}/${user?.id}/${filePath}`])
        }
      }

      // Delete post (cascades will delete related data)
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', params.id)
        .eq('user_id', user?.id)

      if (error) throw error
      router.push('/feed')
    } catch (err: any) {
      console.error('Error deleting post:', err)
    }
  }

  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: editData.title,
          description: editData.description,
        })
        .eq('id', params.id)
        .eq('user_id', user?.id)

      if (error) throw error
      setIsEditing(false)
      loadPost()
    } catch (err: any) {
      console.error('Error editing post:', err)
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

  if (error || !post) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-destructive">{error || 'Post not found'}</p>
          </div>
        </div>
      </main>
    )
  }

  const category = categories.find((c) => c.id === post.category)
  const ratingEmoji = getRatingEmoji(post.average_rating || 0)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Media */}
          {post.file_type === 'image' && post.file_url && (
            <div className="relative h-96 w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={post.file_url}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {post.file_type === 'audio' && post.file_url && (
            <div className="rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 p-8 text-center">
              <div className="text-6xl mb-4">🎵</div>
              <audio controls className="w-full" src={post.file_url} />
            </div>
          )}

          {/* Header */}
          <div className="space-y-4">
            {isEditing ? (
              <form onSubmit={handleEditPost} className="space-y-3">
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full rounded-md border border-muted bg-muted/10 px-3 py-2 min-h-20"
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
                <h1 className="text-4xl font-bold">{post.title}</h1>
                {post.description && (
                  <p className="text-lg text-muted-foreground">{post.description}</p>
                )}
              </>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{category?.label}</span>
              <span>•</span>
              <span>{formatDate(post.created_at)}</span>
              <span>•</span>
              <span className="font-semibold text-foreground">By Author</span>
            </div>
          </div>

          {/* Rating Section */}
          <div className="rounded-lg border border-muted bg-muted/10 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-4xl font-bold">
                    {ratingEmoji} {post.average_rating.toFixed(1)}/100
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{post.rating_count} ratings</p>
                </div>
              </div>

              {/* Rating Slider */}
              {user && (
                <div className="space-y-3 pt-4 border-t border-muted">
                  <p className="text-sm font-medium">
                    {userRating ? `Your rating: ${userRating}/100` : 'Rate this post'}
                  </p>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={userRating || 50}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        setUserRating(val)
                      }}
                      className="w-full"
                      disabled={isRating}
                    />
                    <p className="text-xs text-muted-foreground">
                      {userRating! <= 30 && '👎 Not good'}
                      {userRating! > 30 && userRating! <= 60 && '😐 Okay'}
                      {userRating! > 60 && userRating! <= 80 && '👌 Good'}
                      {userRating! > 80 && '🔥 Excellent'}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleRating(userRating || 50)}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isRating}
                  >
                    {isRating ? 'Submitting...' : userRating ? 'Update Rating' : 'Submit Rating'}
                  </Button>
                </div>
              )}

              {!user && (
                <p className="text-sm text-muted-foreground text-center pt-4">
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => router.push('/auth/login')}
                  >
                    Sign in
                  </Button>
                  {' '}to rate this post
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {user?.id === post.user_id && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeletePost}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReportForm(!showReportForm)}
            >
              Report
            </Button>
          </div>

          {/* Report Form */}
          {showReportForm && (
            <form onSubmit={handleReport} className="rounded-lg border border-muted bg-muted/10 p-4 space-y-3">
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full rounded-md border border-muted bg-muted/10 px-3 py-2 text-sm"
              >
                <option value="">Select reason</option>
                <option value="spam">Spam</option>
                <option value="offensive">Offensive</option>
                <option value="forbidden">Forbidden content</option>
                <option value="fraud">Fraud</option>
                <option value="other">Other</option>
              </select>
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90" disabled={isReporting || !reportReason}>
                  {isReporting ? 'Reporting...' : 'Submit'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowReportForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Comments Section */}
        <div className="border-t border-muted pt-8">
          <h2 className="text-2xl font-bold mb-6">Comments ({post.comment_count})</h2>
          <CommentSection postId={params.id} />
        </div>
      </div>
    </main>
  )
}
