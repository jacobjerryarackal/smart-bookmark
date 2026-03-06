'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Basic validation: image type, size < 2MB
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB')
        return
      }
      setAvatarFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Frontend validation
    if (!email || !password || !confirmPassword || !avatarFile) {
      toast.error('All fields are required')
      setLoading(false)
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // 1. Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError
      if (!signUpData.user) throw new Error('Signup failed')

      // 2. Upload avatar to storage
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${signUpData.user.id}/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile)

      if (uploadError) throw uploadError

      // 3. Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
      const avatarUrl = urlData.publicUrl

      // 4. Create profile entry
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: signUpData.user.id, email, avatar_url: avatarUrl }])

      if (profileError) throw profileError

      toast.success('Account created! Please check your email for confirmation.')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-dark">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl bg-dark/80 backdrop-blur-xl border border-light-gray/20 p-8 shadow-2xl">
          <h1 className="mb-2 text-center text-3xl font-bold text-off-white">Create account</h1>
          <p className="mb-6 text-center text-light-gray">Sign up with email and profile picture</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-light-gray mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-dark/70 border border-light-gray/30 px-4 py-3 text-off-white placeholder-light-gray/50 focus:border-bright-red focus:outline-none focus:ring-2 focus:ring-bright-red/20"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-light-gray mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-dark/70 border border-light-gray/30 px-4 py-3 text-off-white placeholder-light-gray/50 focus:border-bright-red focus:outline-none focus:ring-2 focus:ring-bright-red/20"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-light-gray mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg bg-dark/70 border border-light-gray/30 px-4 py-3 text-off-white placeholder-light-gray/50 focus:border-bright-red focus:outline-none focus:ring-2 focus:ring-bright-red/20"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-light-gray mb-1">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-light-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-bright-red file:text-off-white file:cursor-pointer hover:file:bg-dark-red"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-bright-red py-3 font-medium text-off-white hover:bg-dark-red transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="mt-6 text-center text-light-gray">
            Already have an account?{' '}
            <Link href="/login" className="text-bright-red hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}