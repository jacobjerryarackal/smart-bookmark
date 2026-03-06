'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import LogoutConfirmModal from './LogoutConfirmModal'

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 rounded-lg bg-bright-red px-4 py-2 text-sm font-medium text-off-white shadow-md hover:bg-dark-red transition-all"
      >
        <LogOut size={16} />
        Sign out
      </motion.button>

      <LogoutConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleLogout}
      />
    </>
  )
}