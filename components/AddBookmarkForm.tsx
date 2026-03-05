'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { PlusCircle } from 'lucide-react'

export default function AddBookmarkForm() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !title) return

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('No user')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('bookmarks')
      .insert([{ url, title, user_id: user.id }])

    setLoading(false)
    if (!error) {
      setUrl('')
      setTitle('')
    } else {
      console.error('Insert error', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-dark/50 backdrop-blur-sm p-6 shadow-xl border border-light-gray/20"
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-off-white">
        <PlusCircle className="text-bright-red" size={20} />
        Add new bookmark
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl bg-dark/70 border border-light-gray/30 px-4 py-3 text-sm text-off-white placeholder-light-gray/50 transition-all focus:border-bright-red focus:outline-none focus:ring-2 focus:ring-bright-red/20"
            required
          />
        </div>
        <div className="flex-1">
          <input
            type="url"
            placeholder="Enter URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl bg-dark/70 border border-light-gray/30 px-4 py-3 text-sm text-off-white placeholder-light-gray/50 transition-all focus:border-bright-red focus:outline-none focus:ring-2 focus:ring-bright-red/20"
            required
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="rounded-xl bg-bright-red px-6 py-3 font-medium text-off-white shadow-md hover:bg-dark-red transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add'}
        </motion.button>
      </form>
    </motion.div>
  )
}