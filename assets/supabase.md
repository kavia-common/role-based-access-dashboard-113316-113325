# Supabase Integration Notes

This project uses Supabase for authentication, user management and RBAC (Role Based Access Control) profiles.
Supabase client is initialized in `src/config/supabase.js` using the public anon key for client-side access.

---

## Demo Data & Seeding

To quickly set up demo organizations, users, and role assignments (for RLS policy verification or video demos):

- See [`assets/supabase-demo-seed-guide.md`](./supabase-demo-seed-guide.md) for human steps (roles, org mapping, super_admin setup, etc.)
- See [`assets/supabase-seed-demo.sql`](./supabase-seed-demo.sql) for editable SQL to populate orgs/profiles/etc.

Always create users via your app or Supabase UI first (never direct SQL insert to `auth.users`). After registration, update `profiles` and org/role assignments using the SQL script with the real auth user IDs.

---

## Edge Functions: User Invitation Flow

- The `invite_user` Edge Function is used to securely invite users to the platform, allowing only backend/server context to use privileged actions.
  - **Frontend Integration:** The client (browser) calls the Edge Function via `fetch('/functions/v1/invite_user', {...})`.
  - **Security:** Never include or expose the Supabase service role key in the frontend or in browser-executed JavaScript — all sensitive operations are delegated to the Edge Function which runs in a secure context.
  - **Parameters sent:** `{ email, role, org_id }`
  - **Response:** The Edge Function responds with a `message` for success or `error` for problems. The frontend displays this using toasts.
  - **Dashboards:** Both Super Admin and Org Admin dashboards expose an "Invite User" dialog for this flow.

- For backend/server actions or automation, use the Supabase Service Role key on secure infrastructure only.

- All invite logic (permissions, validation, etc.) should live in the edge function. Frontend only sends parameters and shows user feedback.

---
