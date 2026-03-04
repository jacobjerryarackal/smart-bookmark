'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { PlusCircle } from 'lucide-react'

export default function AddBookmarkForm() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !title) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('bookmarks')
      .insert([{ url, title, user_id: user.id }])

    if (!error) {
      setUrl('')
      setTitle('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-xl border border-white/30"
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
        <PlusCircle className="text-indigo-500" size={20} />
        Add new bookmark
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm placeholder-gray-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-200/50"
            required
          />
        </div>
        <div className="flex-1">
          <input
            type="url"
            placeholder="Enter URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm placeholder-gray-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-200/50"
            required
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white shadow-md hover:shadow-xl transition-all"
        >
          Add
        </motion.button>
      </form>
    </motion.div>
  )
}