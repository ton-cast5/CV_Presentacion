# Supabase setup

1. Create a project at https://supabase.com
2. Open **SQL Editor** → New query
3. Paste and run the full contents of `migrations/001_initial.sql`
4. Confirm buckets `avatars` and `documents` exist under **Storage**
5. Copy Project URL and keys into `.env.local` / Vercel env vars
6. Auth → URL Configuration:
   - Local: `http://localhost:3000` and redirect `http://localhost:3000/auth/callback`
   - Production: your Vercel URL + `/auth/callback`
