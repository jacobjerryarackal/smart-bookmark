'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AddBookmarkForm() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!url || !title) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('No user logged in');
    return;
  }

  const { error } = await supabase
    .from('bookmarks')
    .insert([{ url, title, user_id: user.id }]);

  if (error) {
    console.error('Insert error', error);
  } else {
    setUrl('');
    setTitle('');
  }
};

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 rounded border p-2"
        required
      />
      <input
        type="url"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 rounded border p-2"
        required
      />
      <button
        type="submit"
        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        Add
      </button>
    </form>
  )
}