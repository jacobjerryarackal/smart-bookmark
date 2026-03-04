'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/supabase'
import { Trash2, ExternalLink } from 'lucide-react'

type Bookmark = Tables<'bookmarks'>

export default function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
  const supabase = createClient()

  const handleDelete = async (id: number) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date'
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (bookmarks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-8 rounded-2xl bg-white/60 backdrop-blur-sm p-16 text-center border border-white/30 shadow-xl"
      >
        <p className="text-lg text-gray-600">✨ No bookmarks yet. Add your first one above!</p>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <motion.div
            key={bookmark.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="group relative rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl border border-white/30 hover:border-indigo-200 transition-all"
          >
            <div className="pr-8">
              <h3 className="mb-2 text-xl font-semibold text-gray-800 line-clamp-1">
                {bookmark.title}
              </h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 break-all line-clamp-1"
              >
                {bookmark.url}
                <ExternalLink size={14} className="opacity-50" />
              </a>
              <p className="mt-3 text-xs text-gray-400">
                {formatDate(bookmark.created_at)}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDelete(bookmark.id)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-all hover:bg-red-100 hover:text-red-500"
              aria-label="Delete bookmark"
            >
              <Trash2 size={18} />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}