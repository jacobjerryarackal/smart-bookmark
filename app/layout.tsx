import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Bookmarks',
  description: 'A beautiful bookmark manager',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark min-h-screen`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#2B2D42',
              color: '#EDF2F4',
              border: '1px solid #8D99AE20',
            },
            success: { iconTheme: { primary: '#EF233C', secondary: '#EDF2F4' } },
          }}
        />
      </body>
    </html>
  )
}