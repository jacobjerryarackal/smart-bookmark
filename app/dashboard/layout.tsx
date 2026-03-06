import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Subtle pattern overlay */}
      <div 
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23EDF2F4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <nav className="sticky top-0 z-10 bg-dark/80 backdrop-blur-xl border-b border-light-gray/20 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-bright-red to-dark-red bg-clip-text text-transparent">
              Smart Bookmarks
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-dark/50 px-3 py-1.5 rounded-full border border-light-gray/20 hover:border-bright-red/50 transition-all group relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-bright-red to-dark-red flex items-center justify-center text-xs font-bold text-off-white">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white hidden sm:inline-block group-hover:text-off-white transition-colors">
                  {user.email}
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}