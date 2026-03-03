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
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between bg-white p-4 shadow">
        <h1 className="text-xl font-bold">Smart Bookmarks</h1>
        <LogoutButton />
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}