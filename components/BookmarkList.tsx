'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/supabase'
import { Trash2, ExternalLink } from 'lucide-react'
import ConfirmModal from './ConfirmModal'

type Bookmark = Tables<'bookmarks'>

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onDelete?: (id: number) => void
}

export default function BookmarkList({ bookmarks, onDelete }: BookmarkListProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
  const supabase = createClient()

  const handleDeleteClick = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark)
    setModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedBookmark) return

    // Optimistic update
    if (onDelete) onDelete(selectedBookmark.id)

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', selectedBookmark.id)

    if (error) {
      console.error('Delete error', error)
      toast.error('Failed to delete bookmark')
    } else {
      toast.success(`Deleted "${selectedBookmark.title}"`)
    }
    setSelectedBookmark(null)
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
        className="mt-8 rounded-2xl bg-dark/50 backdrop-blur-sm p-16 text-center border border-light-gray/20 shadow-xl"
      >
        <p className="text-lg text-light-gray">✨ No bookmarks yet. Add your first one above!</p>
      </motion.div>
    )
  }

  return (
    <>
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
              className="group relative rounded-2xl bg-dark/70 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl border border-light-gray/20 hover:border-bright-red/50 transition-all"
            >
              <div className="pr-8">
                <h3 className="mb-2 text-xl font-semibold text-off-white line-clamp-1">
                  {bookmark.title}
                </h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-light-gray hover:text-off-white break-all line-clamp-1 transition-colors"
                >
                  {bookmark.url}
                  <ExternalLink size={14} className="opacity-50" />
                </a>
                <p className="mt-3 text-xs text-light-gray/60">
                  {formatDate(bookmark.created_at)}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDeleteClick(bookmark)}
                className="absolute right-4 top-4 rounded-full p-2 text-light-gray/50 transition-all hover:bg-bright-red/20 hover:text-bright-red"
                aria-label="Delete bookmark"
              >
                <Trash2 size={18} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Bookmark"
        message={`Are you sure you want to delete "${selectedBookmark?.title}"? This action cannot be undone.`}
      />
    </>
  )
}