'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Add new bookmark</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          required
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]"
        >
          Add
        </button>
      </form>
    </div>
  )
}