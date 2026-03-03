'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import type { Database } from '@/types/supabase'

type Bookmark = Database['public']['Tables']['bookmarks']['Row']

export default function DashboardPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) console.error(error)
      else setBookmarks(data ?? [])
    }

    fetchBookmarks()
  }, [supabase])

  useEffect(() => {
    const channel = supabase
      .channel('bookmarks_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          setBookmarks((prev) => [payload.new as Bookmark, ...prev])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== payload.old.id)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div className="space-y-6">
      <AddBookmarkForm />
      <BookmarkList bookmarks={bookmarks} />
    </div>
  )
}