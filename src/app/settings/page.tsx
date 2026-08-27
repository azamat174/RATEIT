'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/context'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    loadSettings()
  }, [user])

  const loadSettings = async () => {
    if (!user) return
    try {
      const { data } = await supabase
        .from('users')
        .select('username, bio')
        .eq('id', user.id)
        .single()
      if (data) {
        setUsername(data.username)
        setBio(data.bio || '')
      }
    } catch (err) {
      console.error('Error loading settings:', err)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error: err } = await supabase
        .from('users')
        .update({ username, bio })
        .eq('id', user?.id)

      if (err) throw err
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 flex gap-2 mb-6">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-primary/50 bg-primary/10 p-3 mb-6">
            <p className="text-sm text-primary">✓ Settings saved successfully!</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="text-sm font-medium">Username</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="w-full rounded-md border border-muted bg-muted/10 px-3 py-2 min-h-24"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </div>
    </main>
  )
}
