'use client'

import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

type Bookmark = Database['public']['Tables']['bookmarks']['Row']

export default function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
  const supabase = createClient()

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) console.error('Delete error', error)
  }

  return (
    <ul className="space-y-2">
      {bookmarks.map((bookmark) => (
        <li
          key={bookmark.id}
          className="flex items-center justify-between rounded border bg-white p-3"
        >
          <div>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              {bookmark.title}
            </a>
            <p className="text-sm text-gray-500">{bookmark.url}</p>
          </div>
          <button
            onClick={() => handleDelete(bookmark.id)}
            className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}