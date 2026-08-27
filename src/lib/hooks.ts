'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function usePost(postId: string) {
  const supabase = createClient()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const { data, error: err } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single()

        if (err) throw err
        setPost(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [postId])

  return { post, loading, error }
}

export function usePosts(category?: string, limit = 50) {
  const supabase = createClient()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        let query = supabase.from('posts').select('*')
        if (category) {
          query = query.eq('category', category)
        }
        const { data, error: err } = await query
          .order('created_at', { ascending: false })
          .limit(limit)

        if (err) throw err
        setPosts(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [category, limit])

  return { posts, loading, error }
}

export function useUser(username: string) {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data, error: err } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single()

        if (err) throw err
        setUser(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [username])

  return { user, loading, error }
}
