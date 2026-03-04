'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/supabase'
import { Trash2 } from 'lucide-react'

type Bookmark = Tables<'bookmarks'>

export default function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
  const supabase = createClient()

  const handleDelete = async (id: number) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  // Helper to safely format date (handle null)
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date'
    return new Date(dateString).toLocaleDateString()
  }

  if (bookmarks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-xl bg-white p-12 text-center shadow-sm border border-gray-100"
      >
        <p className="text-gray-500">No bookmarks yet. Add your first one above!</p>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <motion.div
            key={bookmark.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="group relative rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-xl border border-gray-100 hover:scale-[1.02]"
          >
            <div className="pr-8">
              <h3 className="mb-1 text-lg font-semibold text-gray-800 line-clamp-1">
                {bookmark.title}
              </h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline break-all line-clamp-1"
              >
                {bookmark.url}
              </a>
              <p className="mt-2 text-xs text-gray-400">
                {formatDate(bookmark.created_at)}
              </p>
            </div>
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="absolute right-3 top-3 rounded-full p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
              aria-label="Delete bookmark"
            >
              <Trash2 size={18} />
            </button>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}