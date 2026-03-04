import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Smart Bookmarks',
  description: 'A simple bookmark manager',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}