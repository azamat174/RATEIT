import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth/context'
import './globals.css'

export const metadata: Metadata = {
  title: 'RATEIT - Social Rating Platform',
  description: 'Rate user-generated content from 1 to 100. Comment, reply, and react.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
