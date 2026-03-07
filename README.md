# Smart Bookmark App

A modern, real-time bookmark manager built with Next.js 15 (App Router), Supabase, and Tailwind CSS. Authenticate securely with Google OAuth, add bookmarks, and see changes instantly across all open tabs – all wrapped in a sleek, animated dark theme.


## ✨ Features

- **Google OAuth Authentication** – One‑click sign‑in with your Google account.
- **Private Bookmarks** – Each user sees only their own bookmarks.
- **Real‑time Updates** – Bookmarks sync instantly across multiple browser tabs (powered by Supabase Realtime).
- **Add & Delete Bookmarks** – Clean forms with instant UI feedback and confirmation dialogs.
- **Responsive Dark Theme** – Custom color palette (`#2B2D42`, `#8D99AE`, `#EDF2F4`, `#EF233C`, `#D90429`) with smooth animations.
- **Toast Notifications** – Success and error messages with `react-hot-toast`.
- **Animated Modals** – Stylish confirmations for deletion and logout.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Authentication & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Theme
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)



## 🚀 Live Demo

Visit the live app: [https://smart-bookmark-iota-woad.vercel.app](https://smart-bookmark-iota-woad.vercel.app)



## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase project (free tier works)
- Google OAuth credentials (see [Google Cloud Console](https://console.cloud.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-bookmark.git
   cd smart-bookmark
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**  
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000   # or your production URL
   ```

   *Get these values from your Supabase project settings (Project Settings > API).*

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the app.

### Supabase Configuration

- Create a `bookmarks` table with the following schema (SQL Editor):
  ```sql
  CREATE TABLE bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

  -- Policies (allow users to manage only their own bookmarks)
  CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can insert own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

  -- Set default user_id to the authenticated user
  ALTER TABLE bookmarks ALTER COLUMN user_id SET DEFAULT auth.uid();
  ```

- Enable **Realtime** for the `bookmarks` table:  
  Go to **Database** → **Replication** → add the `bookmarks` table with INSERT and DELETE events.

- Enable **Google OAuth** in **Authentication** → **Providers** and fill in your Client ID and Secret (from Google Cloud Console).

### Google Cloud Console Setup

- Create a new OAuth 2.0 Client ID (Web application) with:
  - Authorized JavaScript origins: `http://localhost:3000`, `https://smart-bookmark-iota-woad.vercel.app`
  - Authorized redirect URIs: `https://your-project-ref.supabase.co/auth/v1/callback`

## 🧪 Testing

1. **Login with Google** – Click the button and complete the OAuth flow.
2. **Add a bookmark** – Fill in the title and URL, click Add – it appears instantly.
3. **Delete a bookmark** – Click the trash icon, confirm – it disappears immediately.
4. **Real‑time sync** – Open two browser tabs; adding/deleting in one updates the other.
5. **Privacy** – Log in with a different Google account – you see only your own bookmarks.

## 🐛 Problems & Solutions

### 1. Google OAuth `redirect_uri_mismatch`
**Problem:** After deployment, the login redirect failed because the callback URL was still pointing to `localhost`.  
**Solution:** Updated both Google Cloud Console and Supabase URL Configuration with the production Vercel URL. Also added `NEXT_PUBLIC_SITE_URL` environment variable in Vercel and used it in the callback route to dynamically construct the redirect.

### 2. Real‑time updates not working
**Problem:** Bookmarks didn't appear automatically in other tabs.  
**Solution:** Enabled Realtime for the `bookmarks` table in Supabase (Database → Replication). Also verified that the client subscription code was correct and that the WebSocket connection was established (no CORS issues).

### 3. TypeScript errors with Supabase types
**Problem:** Manual types caused confusion and errors.  
**Solution:** Used the Supabase CLI to generate types directly from the database schema (`supabase gen types typescript --project-id ... > types/supabase.ts`), ensuring perfect alignment between code and database.

### 4. Modal appearing inside the header (containing block issue)
**Problem:** The logout modal was stuck near the header due to `backdrop-filter` on the nav bar.  
**Solution:** Wrapped the modal in a React Portal to render it directly under `<body>`, bypassing any CSS containment.

### 5. Tailwind CSS `@apply` warnings
**Problem:** Editor showed "Unknown at rule @apply".  
**Solution:** Installed the Tailwind CSS IntelliSense extension for VS Code and ensured `postcss.config.js` was properly configured.


## 🚀 Deployment on Vercel

1. Push your code to a GitHub repository.
2. Import the project into [Vercel](https://vercel.com).
3. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`).
4. Deploy – Vercel automatically detects Next.js and builds the app.

After deployment, update the **Authorized redirect URIs** in Google Cloud Console and **Site URL / Redirect URLs** in Supabase to include your production Vercel URL.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Vercel](https://vercel.com/)

---

**Made with ❤️ by Jacob Jerry Arackal**